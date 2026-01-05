// ==UserScript==
// @name        DHL Online Shipping Populate
// @namespace   nickpapoutsis
// @description Populates the dimensions and value fields in DHL Online Shipping
// @include     https://onlineshipping2.dhl.com/wsi/SessionManagementServlet?moduleKey=Rate*
// @include     https://onlineshipping2.dhl.com/wsi/RateServlet?moduleKey=Rate*
// @exclude     https://onlineshipping2.dhl.com/wsi/RateServlet?moduleKey=Rate&ActionIdKey=1002
// @version     0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27968/DHL%20Online%20Shipping%20Populate.user.js
// @updateURL https://update.greasyfork.org/scripts/27968/DHL%20Online%20Shipping%20Populate.meta.js
// ==/UserScript==

// Credit for button code goes to SO

var zNode = document.createElement('div');
zNode.innerHTML = '<button id="myButton" type="button">Populate!</button>';
zNode.setAttribute('id', 'myContainer');
document.body.appendChild(zNode);
//--- Activate the newly added button.
document.getElementById('myButton').addEventListener('click', ButtonClickAction, false);
function ButtonClickAction(zEvent) {
  x = document.getElementsByTagName('td');
  x[27].innerHTML = '<input class="inputlayout wdth45" type="text" name="packageDimensionsList" value="1" tabindex="11" size="1" maxlength="3" onblur="javascript:setTotalPieces()" style="text-align:right;padding-right:2px;">';
  x[28].innerHTML = '<input class="inputlayout wdth45" type="text" name="packageDimensionsList" value="1" tabindex="11" size="1" maxlength="3" onblur="javascript:setTotalPieces()" style="text-align:right;padding-right:2px;">';
  x[29].innerHTML = '<input class="inputlayout wdth45" type="text" name="packageDimensionsList" value="1" tabindex="11" size="1" maxlength="3" onblur="javascript:setTotalPieces()" style="text-align:right;padding-right:2px;">';
  document.getElementById('dutiableCheck').checked = true;
  x[49].innerHTML = '<input id="declaredHidden2" type="text" name="declaredValue" class="inputlayout " value="1" onblur="javascript:setDeclareValue();" onkeypress="removingComma();" tabindex="17" size="14" style="text-align: right; padding-right: 2px; background-color: rgb(255, 255, 255);">';
} //--- Style our newly added elements using CSS.

GM_addStyle(multilineStr(function () { /*!
    #myContainer {
        position:               absolute;
        top:                    0;
        left:                   0;
        font-size:              30px;
        background:             red;
        border:                 1px outset black;
        margin:                 340px 520px;
        opacity:                1;
        z-index:                222;
        padding:                0px;
    }
    #myButton {
        cursor:                 pointer;
    }
*/
}));
function multilineStr(dummyFunc) {
  var str = dummyFunc.toString();
  str = str.replace(/^[^\/]+\/\*!?/, '') // Strip function () { /*!
  .replace(/\s*\*\/\s*\}\s*$/, '') // Strip */ }
  .replace(/\/\/.+$/gm, '') // Double-slash comments wreck CSS. Strip them.
  ;
  return str;
}