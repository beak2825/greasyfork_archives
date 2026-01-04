// ==UserScript==
// @name         Subeta: Auto Reader
// @namespace    https://greasyfork.org/en/users/145271-aybecee
// @version      0.0.1
// @description  Automatically reads to your pets. Your inventory must be in 'Show Categories: Yes' mode. Automatically goes through all items under the 'Book' section. It will not recognise items not under the 'Book' section. If the book cannot be read to your pet, it will be moved to your Vault.
// @author       AyBeCee
// @match        https://subeta.net/inventory.php*
// @match        https://subeta.net/item.php?*
// @require      https://code.jquery.com/jquery-1.7.1.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/418604/Subeta%3A%20Auto%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/418604/Subeta%3A%20Auto%20Reader.meta.js
// ==/UserScript==

var readDropdownKey;
var readDropdown = GM_getValue('readDropdownKey',0);

var readPetKey;
var readPet = GM_getValue('readPetKey',0);

var yesFeedKey;
var yesFeed = GM_getValue('yesFeedKey',0);

var readLogKey;
var readLog = GM_getValue('readLogKey',0);

function flashySaved () {
    $("#savedFade1").fadeIn(500);
    setTimeout(function(){
        $("#savedFade1").fadeOut(500);
    }, 1000);
}

var currentTime = $(`#menu-time`).text();

$(`.container-fluid center:first`).after(`
<div id="inventHelper">

<label for="readDropdown">Read options:</label>

<select name="readDropdown" id="readDropdown">
  <option value="noRead">Do not read</option>
  <option value="uniqueRead">Read to pets who haven't read before</option>
  <option value="anyRead">Read to any available</option>
  <option value="petRead">Read to specific pet</option>
</select>
<div id="readPetContainer" class="toggle">
  <label for="readPet">Read to:</label>
  <input type="text" id="readPet" name="readPet" value="${readPet}">
</div>
<br>
<div id="readLog">
${readLog}
</div>
<div id="clearHistory" class="ui button">Clear history</div>
<div id="savedFade1">Saved</div>
</div>
<style>
#readlog{}
#inventHelper {
padding: 15px; border-radius: 15px; box-shadow: 2px 2px 2px #d3d3d3; display: inline-block; margin-left: 25px; background: #e3e3e3;
}
#savedFade1 {
    text-align: center;
    color: #ffffff;
    background: #4CAF50;
    padding: 2px 8px;
display:none;
margin-top:5px;
}
#inventHelper .toggle {
    padding: 5px 10px;
    background: #efefef;
}
</style>`)


$('#readDropdown').change(function() {
    readDropdown = $("#readDropdown option:selected").val();

    if ( readDropdown == 'petRead' ) {
        $('#readPetContainer').show();
    } else {
        $('#readPetContainer').hide();
    }
    GM_setValue('readDropdownKey',readDropdown);
    flashySaved ()
});
$('#readPet').change(function() {
    readPet = $("#readPet").val();
    GM_setValue('readPetKey',readPet);

    flashySaved ()
});
$('#clearHistory').click(function() {
    $("#readLog").hide();
    GM_setValue('readLogKey',"");

    flashySaved ()
});


// for default form display

if ( readDropdown == 'petRead' ) {
    $('#readPetContainer').show();
} else {
    $('#readPetContainer').hide();
}
$("select#readDropdown").val(readDropdown);

function moveItems(category) {
    if ( $(`.ui.top.attached.header:contains('${category}')`).length > 0 ) {
        var categoryDiv = $(`.ui.top.attached.header:contains('${category}')`).next();
        var nextLink = categoryDiv.find('a:first').attr("href");
        window.location.href = nextLink;
    }
}


function clickItem(itemID) {
    if (window.location.href.includes("inventory.php")) {
        if ( $(`a[href="item.php?n_id=${itemID}"]`).length > 0 ) {
            window.location.href = `https://subeta.net/item.php?n_id=${itemID}` ;
        }
    }
}

if (window.location.href.includes("inventory.php")) {
    moveItems('Book');
}


if (window.location.href.includes("item.php?n_id=")) {
    var itemName = $(`h3.card-title:first`).text();

    if ( $('a.btn.btn-primary:contains("Read to a Pet")').length > 0 ) {

        if ( $(`a:contains('Read to ${readPet}')`).length > 0 ) {

            readLog += `<b>${currentTime}:</b> Read ${itemName} to ${readPet}.<br>`

    GM_setValue('readLogKey',readLog);

            window.location.href = $(`a:contains('Read to ${readPet}')`).attr("href");
        } else {
            console.log(`Can't read to ${readPet}`)
            console.log(`Move to vault`)

            readLog += `<b>${currentTime}:</b> Can't read ${itemName} to ${readPet}. Moving ${itemName} to Vault.<br>`

    GM_setValue('readLogKey',readLog);

            window.location.href = $(`a:contains('Move to your Vault')`).attr("href");
        }
    } else {
        console.log('Do nothing')
    }
}

if ( window.location.href.includes("/item.php?itemid=") && $(`body:contains(' has been read to')`).length > 0) {
    window.location.href = "https://subeta.net/inventory.php"
}