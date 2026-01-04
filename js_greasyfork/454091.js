// ==UserScript==
// @name         Amazon Tools
// @version      0.4
// @description  Amazon 
// @match        https://www.amazon.co.uk/*
// @grant        none
// @license MIT
// @namespace    Amazon
// @downloadURL https://update.greasyfork.org/scripts/454091/Amazon%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/454091/Amazon%20Tools.meta.js
// ==/UserScript==

if(location.href.includes('/progress-tracker/package/'))
    ProgressTracker();

if(location.href.includes('/your-account/order-details/'))
    OrderDetails();

function OrderDetails(){
    document.querySelector('bdi[dir="ltr"]').outerHTML += `<div style="cursor: pointer;width: 10px;height: 11px;background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANoAAADnCAMAAABPJ7iaAAAAeFBMVEX///8AAABPT08RERHt7e3V1dVjY2Pa2tqAgIB4eHj7+/spKSmpqamurq5paWlsbGwzMzNISEi7u7tcXFyUlJSenp7R0dHFxcXo6OhXV1fj4+O1tbXx8fGGhoYUFBQfHx+Ojo4vLy86Ojpzc3MiIiLBwcEyMjKbm5siucIeAAAEqUlEQVR4nO3d2XLiMBBGYRMSFicYCGvYl8nw/m84pKjJQloWajWttus/1zMqfTFxbCPbWUa0WHaK4aDZ0G+zHXZ3vSdqUgK9jhKQritm4q58nBr12SQXlZ1Se370IgebblNjrhrMhWR2PotfLUVkFvYev+sIyIapEY6KaNlbaoKzfqSsnxpQ0i5KNkk9/dJeI2Tt1JP3tOLT9qnn7mnElr2knro37hFlnnri/gZMmu19yKUpj5bivCw03m/bNPW0b+qRQ+uknvVN9Ti0P47BNtumflvXb0eLIXukh+osOD8mgdoFPSHGUDNyIOYeSaRXckaMs1Jy1/8uP+GAyEMIxl9tai/CP7CR6UDMiXGhhDqdkb9SFha12cbhw7SIYVh/RAR7Iua0Cx/mwSCNOsliXCShaFLXyLhRW60bPozFrQaaL9BUA80XaKqB5gs01UDzZZFGHR6npK3aYlGXEIoF/W8X7slK0NqTo+u6mEqtCbmIJpo231lYuNA8tqVpbTvfFB+ur3tE0Va2vige/rx4GkNbqk/e106I1lWfub/ht5VdfJrNlSabr8lzaflee9K39nnRiksbqE/55v4vWGDSbK7ourSPollchfdVEUGzvoZmyaftlacaXM6l9dSnGtqaS1OfaXgrHs3+RrsccTFo1JeW5mLRFurT5DTj0GzdDODqyKG5Dovfui39jo5lJo0th0YPJXgrRWCOs8bHcBp1kbDRSLU46KMVec1pFk4jF+OkXB2UZXP6YxRMo/YiqdfQUOt61uG0NfEfYparS0RfSReh/b4GqBu1PLAfTqM2/r3ugLw1ivYA2rdAUw000EDTCTTQQNMJNNBA0wk00EDTCTTQQNMJNNBA0wk00EDTCTTQQNMJNNBA0wk00EDTCTTQQNMJNNBA0wk00EDTCTTQQNMJNNBA0wk00EDTCTTQQNMJNNBA0wk00CpKK32ZS3Vo1HOLa7LVqOdQ1YRGPeG39B1l1aFRj+p5KxumOjTyPW5lLxevDo1+IWDJ06OqQ1uRtMboPNucqkK07C9tC8oojdqP1IQm8QxjozTn62BrQBN4IK5VmsBbpc3S4jebWVr8s/nt0qKfZGyXRh9I1oOWHetLI0+2a0KLs9mmRb1QxzgtZl9inZYt2Oc35mmOF9XXg5blJ9YBZRVo594Z+5OK0M4tluPR8PBMR23W6tBKozYqaHcLNF+gqQaaL9BUA80XaKqB5gs01UDzBZpqoPkCTTXQfIGmGmi+QFMNNF+gqQaarxrTqFWvFmn98GF2xDDp3gN+iVr23g0fhvoq/yA/26BaxJzW4cOQNwak3WxSU6JXGJbdz3Hv6LswZoyRyIEaRap3Zrf79IRWjLGcC9U2Tf02rsnsOT+m2HWhOjH2Ilk2Tz3rm5pyaJHLQnXasmSOPZKtuH+NJG6eunNMWQU2G/8QYpR66p5Ye/5LjlsVzRRz+GD7IzmJkNGnNlYaRcmyzHHkZiDG6fVV1BMGLBQvi7vn4X61BGQid2KKdxKRnc9KD6klVz0LXn/i3vNwn+J2+tfl49Sez065qOyjd+p6knatkgdSRDXtrYvB1nkyf8eag2GxXi6oSf0D9/B2E5bnHu8AAAAASUVORK5CYII=);background-size: contain;display: inline-block;margin-left: 10px;" class="copyId"></div>`;
    document.querySelector(".copyId").onclick = function () {
        var id = document.querySelector('bdi[dir="ltr"]').innerText;
        fallbackCopyTextToClipboard(id);
        document.querySelector('bdi[dir="ltr"]').style.color = "darkgrey";
        setTimeout(function () {
            document.querySelector('bdi[dir="ltr"]').style.color = "";
        }, 500);
    };
    function fallbackCopyTextToClipboard(text) {
        var textArea = document.createElement("textarea");
        textArea.value = text;

        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            var successful = document.execCommand("copy");
            var msg = successful ? "successful" : "unsuccessful";
            console.log("Fallback: Copying text command was " + msg);
        } catch (err) {
            console.error("Fallback: Oops, unable to copy", err);
        }

        document.body.removeChild(textArea);
    }


}

function ProgressTracker(){

   function createCopyBtn(data, target) {
  return `<div data="${data}" target="${target}" style="cursor: pointer;background-repeat: no-repeat; width: 12px; height: 12px;background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANoAAADnCAMAAABPJ7iaAAAAeFBMVEX///8AAABPT08RERHt7e3V1dVjY2Pa2tqAgIB4eHj7+/spKSmpqamurq5paWlsbGwzMzNISEi7u7tcXFyUlJSenp7R0dHFxcXo6OhXV1fj4+O1tbXx8fGGhoYUFBQfHx+Ojo4vLy86Ojpzc3MiIiLBwcEyMjKbm5siucIeAAAEqUlEQVR4nO3d2XLiMBBGYRMSFicYCGvYl8nw/m84pKjJQloWajWttus/1zMqfTFxbCPbWUa0WHaK4aDZ0G+zHXZ3vSdqUgK9jhKQritm4q58nBr12SQXlZ1Se370IgebblNjrhrMhWR2PotfLUVkFvYev+sIyIapEY6KaNlbaoKzfqSsnxpQ0i5KNkk9/dJeI2Tt1JP3tOLT9qnn7mnElr2knro37hFlnnri/gZMmu19yKUpj5bivCw03m/bNPW0b+qRQ+uknvVN9Ti0P47BNtumflvXb0eLIXukh+osOD8mgdoFPSHGUDNyIOYeSaRXckaMs1Jy1/8uP+GAyEMIxl9tai/CP7CR6UDMiXGhhDqdkb9SFha12cbhw7SIYVh/RAR7Iua0Cx/mwSCNOsliXCShaFLXyLhRW60bPozFrQaaL9BUA80XaKqB5gs01UDzZZFGHR6npK3aYlGXEIoF/W8X7slK0NqTo+u6mEqtCbmIJpo231lYuNA8tqVpbTvfFB+ur3tE0Va2vige/rx4GkNbqk/e106I1lWfub/ht5VdfJrNlSabr8lzaflee9K39nnRiksbqE/55v4vWGDSbK7ourSPollchfdVEUGzvoZmyaftlacaXM6l9dSnGtqaS1OfaXgrHs3+RrsccTFo1JeW5mLRFurT5DTj0GzdDODqyKG5Dovfui39jo5lJo0th0YPJXgrRWCOs8bHcBp1kbDRSLU46KMVec1pFk4jF+OkXB2UZXP6YxRMo/YiqdfQUOt61uG0NfEfYparS0RfSReh/b4GqBu1PLAfTqM2/r3ugLw1ivYA2rdAUw000EDTCTTQQNMJNNBA0wk00EDTCTTQQNMJNNBA0wk00EDTCTTQQNMJNNBA0wk00EDTCTTQQNMJNNBA0wk00EDTCTTQQNMJNNBA0wk00EDTCTTQQNMJNNBA0wk00CpKK32ZS3Vo1HOLa7LVqOdQ1YRGPeG39B1l1aFRj+p5KxumOjTyPW5lLxevDo1+IWDJ06OqQ1uRtMboPNucqkK07C9tC8oojdqP1IQm8QxjozTn62BrQBN4IK5VmsBbpc3S4jebWVr8s/nt0qKfZGyXRh9I1oOWHetLI0+2a0KLs9mmRb1QxzgtZl9inZYt2Oc35mmOF9XXg5blJ9YBZRVo594Z+5OK0M4tluPR8PBMR23W6tBKozYqaHcLNF+gqQaaL9BUA80XaKqB5gs01UDzBZpqoPkCTTXQfIGmGmi+QFMNNF+gqQaarxrTqFWvFmn98GF2xDDp3gN+iVr23g0fhvoq/yA/26BaxJzW4cOQNwak3WxSU6JXGJbdz3Hv6LswZoyRyIEaRap3Zrf79IRWjLGcC9U2Tf02rsnsOT+m2HWhOjH2Ilk2Tz3rm5pyaJHLQnXasmSOPZKtuH+NJG6eunNMWQU2G/8QYpR66p5Ye/5LjlsVzRRz+GD7IzmJkNGnNlYaRcmyzHHkZiDG6fVV1BMGLBQvi7vn4X61BGQid2KKdxKRnc9KD6klVz0LXn/i3vNwn+J2+tfl49Sez065qOyjd+p6knatkgdSRDXtrYvB1nkyf8eag2GxXi6oSf0D9/B2E5bnHu8AAAAASUVORK5CYII=);background-size: contain;display: inline-block;margin-left: 10px;" class="copybtn"></div>`;
}
var userInfo = JSON.parse(document.querySelector('script[type="a-state"]').innerText);
var orderId = userInfo.orderId;
var shipmentId = userInfo.shipmentId;
var trackingId = userInfo.trackingId;
var sessionId = window.opts.sessionId;

console.log(window.opts);
document.querySelector("#breadcrumbs").innerHTML += `<div class="a-column a-span4">
<div class="a-row a-spacing-small singleMultiple cardContainer-wrapper">
    <div class="a-row cardContainer">
        <div class="a-row a-spacing-medium widgetLink-group">
                <br>

                <p style="display: inline-block;">Order id: </p>
                <p id="orderId" style="display: inline-block;margin-left: 10px;">${orderId}</p>
                ${createCopyBtn(orderId, "orderId")}

                <br>
                
                <p style="display: inline-block;">Shipment id: </p>
                <p id="shipmentId" style="display: inline-block;margin-left: 10px;">${shipmentId}</p>
                ${createCopyBtn(shipmentId, "shipmentId")}
     
               <br>

               <p style="display: inline-block;">Session id: </p>
               <p id="sessionId" style="display: inline-block;margin-left: 10px;">${sessionId}</p>
               ${createCopyBtn(sessionId, "sessionId")}


        </div>
    </div>
</div>
</div>`;

document.querySelectorAll(".copybtn").forEach((x) => {
  let data = x.getAttribute("data");
  let target = x.getAttribute("target");
  x.onclick = function () {
    fallbackCopyTextToClipboard(data);
    document.querySelector("#" + target).style.color = "darkgrey";
    setTimeout(function () {
      document.querySelector("#" + target).style.color = "";
    }, 500);
  };
});
function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    console.log("Fallback: Copying text command was " + msg);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
}

}