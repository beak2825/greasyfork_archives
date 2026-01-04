// ==UserScript==
// @name         RevoveAll
// @namespace    removebazaar.zero.torn
// @version      0.1
// @description  Removes All items at once
// @author       -zero [2669774]
// @match        https://www.torn.com/bazaar.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/473518/RevoveAll.user.js
// @updateURL https://update.greasyfork.org/scripts/473518/RevoveAll.meta.js
// ==/UserScript==

//sid=bazaarData&step=manageItems

//items:[{"bazaarID":"70559252","itemID":"38","remove":1},{"bazaarID":"67906135","itemID":"1123","remove":1},{"bazaarID":"67906125","itemID":"650","remove":1}]

let removeData = [];

function intercept() {
    const { fetch: origFetch } = window;
    window.fetch = async (...args) => {
        console.log("fetch called with args:", args);

        const response = await origFetch(...args);

        /* work with the cloned response in a separate promise
         chain -- could use the same chain with `await`. */

        if (response.url.includes('/bazaar.php?sid=bazaarData&step=getBazaarItems')) {


            let responseCopy = response.clone();
            responseCopy = await responseCopy.json();

            for (let item of responseCopy.list) {
                console.log(item);
                let bazaarId = item.bazaarID;
                let itemId = item.itemID;
                let amount = item.amount;
                removeData.push({
                    "bazaarID": bazaarId
                    , "itemID": itemId,
                    "remove": amount
                });
            }
        }
        console.log("Remove Data: " + removeData);
        return response;
    };

}



let url = window.location.href;
console.log(url);
if (url.includes('#/manage')) {
  intercept();
  window.onload = ()=>{
    console.log("calling insert!");
    insert();
  };
  //  insert();
}

function insert() {
    console.log('trying');
    if ($('div[class^="row_"]').length == 0) {
        setTimeout(insert, 300);
        return;
    }
    console.log('inserted');


    const butt = "<button class='zeroRemoveAll' id='removeall'>Remove All</button><span id='response'></span>";
    $('div[class^="titleContainer_"]').append(butt);
    $('#removeall').on('click', () => {
        $.post('bazaar.php?sid=bazaarData&step=manageItems', { items: JSON.stringify(removeData) }, function (response) {
            $('#response').html(response.text).css('color', response.success ? 'green' : 'red');
        });

    });

    $('.zeroRemoveAll').css("background", "#34495e");
    $('.zeroRemoveAll').css("border-radius", "5%");
    $('.zeroRemoveAll').css("margin", "5px");
}



