// ==UserScript==
// @name        AliBetterReviews
// @namespace   kneels
// @include     https://feedback.aliexpress.com/*
// @version     1.1
// @grant       none
// @description User script for making Aliexpress reviews easier to browse
// @downloadURL https://update.greasyfork.org/scripts/24475/AliBetterReviews.user.js
// @updateURL https://update.greasyfork.org/scripts/24475/AliBetterReviews.meta.js
// ==/UserScript==

var ownerMemberId = -1,
    productId = -1;
var withPics = false, 
    withInfo = false,
    withMoreInfo = false,
    myCountry = false;
var sortval = "sortdefault@feedback",
    starFilter = "all+Stars",
    translate = "+Y+";
var currentPage = 1;
var imagesExpanded = false;

function appendNextPage() {
    var http = new XMLHttpRequest();
    var url = "https://feedback.aliexpress.com/display/productEvaluation.htm";
    var params = "productId=" + productId + "&ownerMemberId=" + ownerMemberId + "&page=" + ++currentPage
                + "&withPersonalInfo=" + withInfo + "&withPictures=" + withPics
                + "&withAdditionalFeedback=" + withMoreInfo + "&onlyFromMyCountry=" + myCountry
                + "&evaSortValue=" + sortVal + "&evaStarFilterValue=" + starFilter + "&translate=" + translate;
    
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function() { 
        if (http.readyState == 4 && http.status == 200) {
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = http.responseText;
            var newFeedbackList = tempDiv.getElementsByClassName('feedback-list-wrap')[0];
            if (newFeedbackList.getElementsByClassName('no-feedback').length > 0) {
                console.log('no more pages to load');
                return;
            }
            var parent = document.getElementById('transction-feedback');
            var beforeThisNode = document.getElementById('complex-pager');
            if (imagesExpanded) {
                expandAllImages(newFeedbackList);
            }
            parent.insertBefore(newFeedbackList, beforeThisNode);
        }
    }
    http.send(params);
    console.log(http);
}

function expandAllImages(doc) {
    var photoLists = doc.querySelectorAll('.r-photo-list');
    for (var i = 0; i < photoLists.length; ++i) {
        var picItems = photoLists[i].querySelectorAll('.pic-view-item');
        var html = "";
        for (var k = 0; k < picItems.length; ++k) {
            var imgUrl = picItems[k].getElementsByTagName('img')[0].src;
            html += '<img src="' + imgUrl + '">';
        }
        photoLists[i].innerHTML = html;
    }
}

function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

window.onload = function() {
    ownerMemberId = document.getElementById('ownerMemberId').value;
    productId = document.getElementById('productId').value;
    withPics = document.getElementById('withPictures').value;
    withInfo = document.getElementById('withPersonalInfo').value;
    withMoreInfo = document.getElementById('withAdditionalFeedback').value;
    myCountry = document.getElementById('onlyFromMyCountry').value;
    sortVal = document.getElementById('evaSortValue').value;
    starFilter = document.getElementById('evaStarFilterValue').value;
    translate = document.getElementById('translate').value;
    
    var waitTimer = setInterval(function() {
        var feedback = document.getElementById('transction-feedback');
        if (feedback !== null) {
            // Feedback is done loading
            clearInterval(waitTimer);

            var filterList = document.getElementsByClassName('f-filter-list')[0];

            if (inIframe()) {
                var fsButt = document.createElement('button');
                fsButt.innerHTML = "Fullscreen";
                filterList.appendChild(fsButt);
                fsButt.onclick = function() {
                    var url = "https://feedback.aliexpress.com/display/productEvaluation.htm?productId="
                            + productId + "&ownerMemberId=" + ownerMemberId + "&page=1"
                            + "&withPersonalInfo=" + withInfo + "&withPictures=" + withPics
                            + "&withAdditionalFeedback=" + withMoreInfo + "&onlyFromMyCountry=" + myCountry
                            + "&evaSortValue=" + sortVal + "&evaStarFilterValue=" + starFilter + "&translate=" + translate;
                    window.open(url, '_blank');
                };
            } else {
                var expandButt = document.createElement('button');
                expandButt.innerHTML = "Expand All Images";
                filterList.appendChild(expandButt);
                expandButt.onclick = function() {
                    if (!imagesExpanded) {
                        expandAllImages(document);
                        imagesExpanded = true;
                        expandButt.disabled = true;
                    }
                };
                // endless scrolling
                window.onscroll = function(ev) {
                    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                        appendNextPage();
                    }
                };
            }

        }
    }, 500);
};