// ==UserScript==
// @name                Rabobank Internetbankieren auto-input
// @namespace           FelixAkk
// @description         Quickly select from multiple bank acccounts in the Rabobank login and payment pages
// @include             https://bankieren.rabobank.nl/welcome
// @include             https://bankieren.rabobank.nl/omgevingskeuze/*
// @include             https://bankieren.rabobank.nl/online/*/qsl_debitcardlogon.do
// @include             https://betalen.rabobank.nl/ide/qslo*
// @include             https://betalen.rabobank.nl/ideal-betaling/*
// @include             https://betalen.rabobank.nl/ideal/*
// @include             https://betalen.rabobank.nl/activerencreditcard
// @include             https://idp.rabobank.nl/idp/idin/*
// @grant               GM.setValue
// @grant               GM.getValue
// @require             http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @copyright           2014-2020, Matthijs Kooijman (matthijs@stdin.nl)
// @copyright           2014, Felix Akkermans
// @license             The MIT license; http://opensource.org/licenses/MIT
// @homepageURL         https://github.com/matthijskooijman/greasemonkey-rabobank-autoinput
// @version             2.3.0
// @downloadURL https://update.greasyfork.org/scripts/5072/Rabobank%20Internetbankieren%20auto-input.user.js
// @updateURL https://update.greasyfork.org/scripts/5072/Rabobank%20Internetbankieren%20auto-input.meta.js
// ==/UserScript==

/*jslint undef: true, vars: true, newcap: true, maxerr: 50, maxlen: 200, indent: 4 */

/**
 * The `jslint` comment is an annotation with flags for JSLint.com and alike tools. Some explanation on the options:
 *
 * browser: true        Will make it accept use of document, window, JSON and such without declaration
 * vars: true           Tollerate many seperate variable declarations
 * maxlen: 200          Set the maximum line length to 200 characters
 * undef: true          Tollerate usage of undefined functions. To accept GM_* functions.
 * plusplus: true       Tollerate ++ and -- operators. Just shush already, I just them responsibly.
 */

/**
 * The global annotation is also for JSLint, which will tell it not to whine about the declaration
 */
/*global GM */

// http://stackoverflow.com/questions/1335851/what-does-use-strict-do-in-javascript-and-what-is-the-reasoning-behind-it
(async function () {
    "use strict";
    // --------------- General settings -------------------
    // tweak it to your own likings (script may malfunction on bad values)

    // Want me to fill in your default/primary account automatically as a page loads?
    var autoFillDefault = true,
        // Time in miliseconds to wait for Rabobank's native JavaScript that's ran on DOM-ready to finish.
        // Increase this if you see your account selected but not filled in.
        autoFillDelay = 1000;

    // ---------------- CSS/Stylesheet --------------------

    var stylesheet =
    'div#account_selection {'+
    '    margin-bottom: 20px;'+
    '    background-color: var(--rds-message-color-background);'+
    '    color: var(--rds-message-color-text);'+
    '}'+
    'div#account_selection table#accounts {'+
    '    width: 96%;'+
    '    margin: 10px;'+
    '}'+
    'div#account_selection {'+
    '    border: 1px solid #CCCCCC;'+
    '}'+
    'table#accounts th {'+
    '    text-align: left;'+
    '}'+
    'table#accounts td:first-child {'+
    '    padding-left: 16px;'+
    '}'+
    // Reset some invasive CSS on input and label
    'table#accounts input {'+
    '    width: auto;'+
    '    height: auto;'+
    '}'+
    'table#accounts label {'+
    '    display: inline;'+
    '}'+
    'a.edit {'+
    '    background: no-repeat scroll 0 0 transparent;'+
    '    display: block;'+
    '    margin: 10px;'+
    '    padding-left: 25px;'+
    '}'+
    'a.edit.enter {'+
         // Converted from http://www.famfamfam.com/lab/icons/silk/icons/page_white_edit.png"
         // Image by Mark James, licensed under CC-BY-3.0
    '    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAH8SURBVDjLjZPfS1NhGMdXf0VEQhDUhdCN4X0IYT8ghIJQM0KoC4vushZddLELKyRhQQkSFIKEGEkUCI2oxVhepG5zi1xbc0u3cDs7Z+ec/ezT+x62scmmHvhwDrzP93Pe57znsQE2cR0SdAm6d+GwYL/M1LBVBV35fF4plUqVcrlMK8Q6TqdzYrukJuiW4Vwuh67rdbLZLJlMhmQyaUnigVlC05f4+dbB0tQplp92DsnwPimQBaZpUigUrLtE0zQURSGVSqHF37DhGkVZeQdagszKLJ7HvZtNAhmuIQWGYaCqKps/ZkivPqCwPs/Gp0cYvjnKUTe+F9fMJoFoo96zfJZ9K+sLpP33qRhujPANtr7dJPhqmO/PBxX3+PljTYLtqImPpH13qZge9LUrmLEB1FU7sZd9jJw5MljNthYk/KLnxdFqeAjzdz9Z/z3Ck2fRE36qx9pakAjME1y4Lbb9GTMyTD52GUXsZO3ZadTkL6umrSD4ZZrAezvLH54Q915EjwywtXSH8FQf+t+I9V12FLwe6wE1SmjyAi77Qb6Kt3rGe9H+hKzwrgLH9eMUPE4K3gm8jpPMjRwlHfNTLBbr7Cjo7znA2NVOXA/PsThzi2wyah1pI+0E/9rNQQsqMtM4CyfE36fLhb2ERa0mB7BR0CElexjnGnL0O2T2PyFunSz8jchwAAAAAElFTkSuQmCC);'+
    '}'+
    'a.edit.exit {'+
         // Converted from http://www.famfamfam.com/lab/icons/silk/icons/page_white_put.png"
         // Image by Mark James, licensed under CC-BY-3.0
    '    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGdSURBVDjLlZNLSwJhFIa1Rb8iIWhRQUlluuoftDEtC5TKSgINily1CmoT0kJBqwlSaBGBLVxItGgZQQQVFe3bKN7wOjqO2tucwRGvqAMPMzDf+8w5ZzgyADLhGhJQCWi6MCwwQBkJWVWg4jguVSqVKuVyGe0Q3sPtdruaJZJAQ+FcLgeWZWuk02kkk0lEIhFREg6H4fF4GiR0yUlABwqFAorFongnstksUqkUotGoKMjn86CPMAwjSloEFJYgAQUymQxisVhLS9WZyBsEQhu1A/RMfUutxONxsZJQKNRZ0Ey9hCqheSQSid4F9RJqh2ZCor4EBM/z4lxIQvQtoCp2HtexfW+CObAM062uu4BCElSBJWjEzc8Vrr8Y6L3zvQsoTKz6F+H7PAPz7oLRp8eodmSjp7/geDqG2b8Me9CK8zcnXK8O7AWsmDtUF9UHUw/1gr+2O8BzsPm3YLvbhPPlBI7nI6xc6jC9P/Gr3B0flHZhVpgyKwQ6LpPFtwaTdwmGCy0MpwsVWsD6ZVKQpNs6z9iV35PWsY/q6iso+w9crJoc0rRwaAAAAABJRU5ErkJggg==);'+
    '}'+
    'a.account.add, a.account.delete {'+
    '    background: no-repeat scroll 0 0 transparent;'+
    '    display: inline-block;'+
    '    height: 16px;'+
    '    opacity: 0.3;'+
    '    vertical-align: text-bottom;'+
    '    width: 16px;'+
    '}'+
    'a.account.add:hover, a.account.delete:hover {'+
    '    opacity: 1;'+
    '}'+
    'a.account.add {'+
         // Converted from http://www.famfamfam.com/lab/icons/silk/icons/add.png"
         // Image by Mark James, licensed under CC-BY-3.0
    '    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJvSURBVDjLpZPrS5NhGIf9W7YvBYOkhlkoqCklWChv2WyKik7blnNris72bi6dus0DLZ0TDxW1odtopDs4D8MDZuLU0kXq61CijSIIasOvv94VTUfLiB74fXngup7nvrnvJABJ/5PfLnTTdcwOj4RsdYmo5glBWP6iOtzwvIKSWstI0Wgx80SBblpKtE9KQs/We7EaWoT/8wbWP61gMmCH0lMDvokT4j25TiQU/ITFkek9Ow6+7WH2gwsmahCPdwyw75uw9HEO2gUZSkfyI9zBPCJOoJ2SMmg46N61YO/rNoa39Xi41oFuXysMfh36/Fp0b7bAfWAH6RGi0HglWNCbzYgJaFjRv6zGuy+b9It96N3SQvNKiV9HvSaDfFEIxXItnPs23BzJQd6DDEVM0OKsoVwBG/1VMzpXVWhbkUM2K4oJBDYuGmbKIJ0qxsAbHfRLzbjcnUbFBIpx/qH3vQv9b3U03IQ/HfFkERTzfFj8w8jSpR7GBE123uFEYAzaDRIqX/2JAtJbDat/COkd7CNBva2cMvq0MGxp0PRSCPF8BXjWG3FgNHc9XPT71Ojy3sMFdfJRCeKxEsVtKwFHwALZfCUk3tIfNR8XiJwc1LmL4dg141JPKtj3WUdNFJqLGFVPC4OkR4BxajTWsChY64wmCnMxsWPCHcutKBxMVp5mxA1S+aMComToaqTRUQknLTH62kHOVEE+VQnjahscNCy0cMBWsSI0TCQcZc5ALkEYckL5A5noWSBhfm2AecMAjbcRWV0pUTh0HE64TNf0mczcnnQyu/MilaFJCae1nw2fbz1DnVOxyGTlKeZft/Ff8x1BRssfACjTwQAAAABJRU5ErkJggg==);'+
    '}'+
    'a.account.delete {'+
         // Converted from http://www.famfamfam.com/lab/icons/silk/icons/delete.png"
         // Image by Mark James, licensed under CC-BY-3.0
    '    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJdSURBVDjLpZP7S1NhGMf9W7YfogSJboSEUVCY8zJ31trcps6zTI9bLGJpjp1hmkGNxVz4Q6ildtXKXzJNbJRaRmrXoeWx8tJOTWptnrNryre5YCYuI3rh+8vL+/m8PA/PkwIg5X+y5mJWrxfOUBXm91QZM6UluUmthntHqplxUml2lciF6wrmdHriI0Wx3xw2hAediLwZRWRkCPzdDswaSvGqkGCfq8VEUsEyPF1O8Qu3O7A09RbRvjuIttsRbT6HHzebsDjcB4/JgFFlNv9MnkmsEszodIIY7Oaut2OJcSF68Qx8dgv8tmqEL1gQaaARtp5A+N4NzB0lMXxon/uxbI8gIYjB9HytGYuusfiPIQcN71kjgnW6VeFOkgh3XcHLvAwMSDPohOADdYQJdF1FtLMZPmslvhZJk2ahkgRvq4HHUoWHRDqTEDDl2mDkfheiDgt8pw340/EocuClCuFvboQzb0cwIZgki4KhzlaE6w0InipbVzBfqoK/qRH94i0rgokSFeO11iBkp8EdV8cfJo0yD75aE2ZNRvSJ0lZKcBXLaUYmQrCzDT6tDN5SyRqYlWeDLZAg0H4JQ+Jt6M3atNLE10VSwQsN4Z6r0CBwqzXesHmV+BeoyAUri8EyMfi2FowXS5dhd7doo2DVII0V5BAjigP89GEVAtda8b2ehodU4rNaAW+dGfzlFkyo89GTlcrHYCLpKD+V7yeeHNzLjkp24Uu1Ed6G8/F8qjqGRzlbl2H2dzjpMg1KdwsHxOlmJ7GTeZC/nesXbeZ6c9OYnuxUc3fmBuFft/Ff8xMd0s65SXIb/gAAAABJRU5ErkJggg==);'+
    '}';

    // Construct selection panel DOM
    var selectionPanel =
    // I'll employ the styles of the Rabobank CSS class rass-data-target
    '<div id="account_selection">'+
    '  <form>'+
    '    <table id="accounts">'+
    // Static table header
    '      <thead>'+
    '        <tr>'+
    '          <th>Selecteer uw Rabobank rekening</th>'+
    '          <th>Rekeningnr</th>'+
    '          <th>Kaartnr</th>'+
    '        </tr>'+
    '      </thead>'+
    '      <tbody></tbody>'+
    '    </table>'+
    '  <form>'+
    // The edit button
    '  <a href="#" class="edit enter">Rekeningen instellen...</a>'+
    '  <a href="#" class="edit exit">Veranderingen opslaan</a>'+
    '</div>'
    selectionPanel = $(selectionPanel);

    var code_field, reknr_field, pasnr_field;

    // Account object
    function Account(descr, acc, card) {
        this.description = descr;
        this.number = acc;
        this.cardNumber = card;
    }

    // Define whether the page is in the editing stage
    var editing = false;
    // Example accounts
    var examples = [
        new Account("Bijv. Privé coulante rekening", 123456789, 1234),
        new Account("Bijv. Spaar rekening", 123456789, 1234),
        new Account("Bijv. Zakelijke rekening", 123456789, 1234)
    ];

    // Prefetch storage
    var accountsJSON = await GM.getValue('accountsJSON');
    // Actual accounts
    var accountsArray;
    // If we have no values stored yet (first run), initialize the storage with example values
    if (accountsJSON === undefined) {
        GM.setValue('accountsJSON', JSON.stringify(examples));
        accountsArray = examples;
    } else {
        // Else load the bank accounts
        accountsArray = JSON.parse(accountsJSON);
    }

    // Elements from the original page to be modified
    var container, reknr_field, pasnr_field, code_field, remember_field;

    // Utility function that takes a bank account number and returns it seperated by points like on the Rabobank cards
    function numberFormat(account) {
        var nr = String(account);
        return nr.substring(0, 4) + '.' + nr.substring(4, 6) + '.' + nr.substring(6);
    }

    // Build accounts table contents (the rows), depending on whether we're editing (true) or selecting (false)
    function constructTable() {
        var t = $('#accounts tbody', selectionPanel);
        t.empty();
        for (var idx = 0; idx < accountsArray.length; idx++) {
            if (editing)
                t.append(constructEditableRow(accountsArray[idx]));
            else
                t.append(constructSelectableRow(idx, accountsArray[idx]));
        }
        if (editing)
            $('<tr><td colspan="4"><a href="#" class="account add"/></td></tr>').on('click', addAccount).appendTo(t);
    }

    function constructSelectableRow(idx, acc) {
        return $('<tr class="selectable-account"/>').append(
            $('<td/>').append(
                $('<input type="radio" name="account" />'),
                $('<label/>').text(acc.description)
            ),
            $('<td/>').append($('<label/>').text(acc.number)),
            $('<td/>').append($('<label/>').text(acc.cardNumber))
        ).on('click', function() { selectAccount(idx, true); });
    }

    function constructEditableRow(acc) {
        return $('<tr class="editable-account"/>').append(
            $('<td/>').append($('<input type="text" />').attr('value', acc.description)),
            $('<td/>').append($('<input type="text" size="9" maxlength="9"/>').attr('value', acc.number)),
            $('<td/>').append($('<input type="text" size="4" maxlength="4"/>').attr('value', acc.cardNumber)),
            $('<td/>').append($('<a href="#" class="account delete"/>').on('click', deleteAccount))
        );
    }

    function accountFromRow(row) {
        var inputs = $('input', row);
        return new Account(inputs[0].value, inputs[1].value, inputs[2].value);
    }

    // Define event handling function for selecting an account; fills in the account details
    function selectAccount(idx, override) {
        // Figure out the currently selected values (removing
        // the spaces in the account number added for
        // readability).
        var number = reknr_field.prop('value').replace(/ /g, "");
        var card = pasnr_field.prop('value')

        if (number && card && !override) {
            // On page load, we shouldn't override any
            // current values if they are there, since when
            // using the Rabo Scanner, selecting an account
            // causes a page reload, after which we run
            // again. If we'd override the account number
            // then, we'd select the default account
            // after the user selected a different one
            //
            // Instead, find out which account was selected.
            idx = null;
            for (var i = 0; i < accountsArray.length; ++i) {
                if (accountsArray[i].number == number && accountsArray[i].cardNumber == card) {
                    idx = i;
                    break;
                }
            }
        } else {
            // Assign selected values
            reknr_field.prop('value', accountsArray[idx].number);
            pasnr_field.prop('value', accountsArray[idx].cardNumber);
            // Then, trigger input events. On the Rabo sign page, this is needed to update internally
            // stored values and on the Rabo sign and login pages, this also causes the default
            // scripts to actually request a challenge to scan.
            // We cannot use .tigger("input") here, for some reason that does not trigger the onInput
            // handler in the Rabo sign page.
            reknr_field[0].dispatchEvent(new Event("input"));
            pasnr_field[0].dispatchEvent(new Event("input"));
        }

        // Focus code field, since that is the next thing to enter
        code_field.focus();

        if (idx !== null)
            $('#accounts input[type="radio"]', selectionPanel)[idx].checked = true;
    }

    // Define event handling function for deleting an account/row in the accounts table when editing accounts
    function deleteAccount() {
        $(this).closest('tr').remove();
    }

    // Define event handling function for inserting an account/row in the accounts table after a given index (when editing accounts)
    function addAccount(accountIdx) {
        var row = constructEditableRow(new Account());
        row.insertBefore($('#accounts tbody tr', selectionPanel).last());
    }

    // Event handler for the save changes button
    function saveChanges() {
        accountsArray = []; // new array, clean slate
        // Fill array
        $('#accounts tbody tr', selectionPanel).slice(0, -1).each(function(idx, row) {
            accountsArray.push(accountFromRow(row));
        });
        // Save it all
        GM.setValue('accountsJSON', JSON.stringify(accountsArray));
        setEditMode(false);
    }

    function setEditMode(value) {
        // Update edit/save links
        $("a.edit.enter", selectionPanel).toggle(!value);
        $("a.edit.exit", selectionPanel).toggle(value);
        // Remember new edit mode
        editing = value;
        // Reconstruct table
        constructTable();
    }

    function initAccountsPanel() {
        $("a.edit.enter", selectionPanel).on("click", function() { setEditMode(true)});
        $("a.edit.exit", selectionPanel).on("click", function() { saveChanges()});
        setEditMode(false);
    }

    function initialize() {
        // On form submission, this script sometimes seems to run twice?
        if ($('#rabobank-autoinput-style', container).length > 0)
            return;

        // Load the defined custom styles
        $("<style id=\"rabobank-autoinput-style\"/>").text(stylesheet).appendTo(container);

        console.log("Adding Rabobank Internetbankieren auto-input panel to ", container);
        // Insert and fill the custom account selection panel
        container.prepend(selectionPanel);
        initAccountsPanel();

        // Remove the (now pointless) remember me checkbox
        if (remember_field) {
            remember_field.hide();
        }

        // And for good measure, we may select the default/primary straight away.
        if (autoFillDefault) {
            // We have to wait a little while to avoid conflict with Rabobank's native JavaScript ran on DOM-ready
            window.setTimeout(function() { selectAccount(0, false); }, autoFillDelay);
        }
    }

    function maybe_initialize(retries) {
        // The new Rabo sign and login page loads with just a rass-sign
        // and then initializes the rest using javascript into a "shadow
        // root" that needs to be explicitly addressed for jquery
        // selectors to see it. So handle that specially.
        if ($('rass-sign').length != 0) {
            var root = $('rass-sign')[0].shadowRoot;
            var placeholder = $('rass-rabo-scanner .rds-container', root);
            let reknr_wrapper = $('#rass-data-reknr', root);
            let pasnr_wrapper = $('#rass-data-pasnr', root);
            let code_wrapper = $('#sign_code', root);
            if (placeholder.length && reknr_wrapper.length && pasnr_wrapper.length && code_wrapper.length) {
                // For some reason these do not need .shadowRoot, even though it looks the same as the rass-sign shadowroot in the browser inspector...
                reknr_field = $('input', reknr_wrapper[0]);
                pasnr_field = $('input', pasnr_wrapper[0]);
                code_field = $('input', code_wrapper[0]);
                if (reknr_field.length && pasnr_field.length) {
                    container = placeholder;
                    initialize();
                    return;
                }
            }
        }

        // In case stuff is loaded dynamically, retry after a short while.
        if (retries > 0) {
            setTimeout(function() { maybe_initialize(retries - 1); }, 1000);
        } else {
            console.log("Rabobank Internetbankieren auto-input: No login or sign page found");
        }
    }
    maybe_initialize(10 /* retries */);
}());
