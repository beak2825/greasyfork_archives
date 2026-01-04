// ==UserScript==
// @name         Ferzu Photo Like Fixer
// @namespace    Amaroq64
// @version      0.1
// @description  Like photos without reloading them.
// @author       Amaroq
// @match        https://www.ferzu.com/Photo/Details/*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/32225/Ferzu%20Photo%20Like%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/32225/Ferzu%20Photo%20Like%20Fixer.meta.js
// ==/UserScript==

var anchor = document.getElementsByTagName('a');
var n;

//Identify the desired anchor.
for (let i = 0; i < anchor.length; i++)
{
    if (anchor[i].href.search("javascript:likePhoto") > -1)
    {
        anchor[i].id = "like";
        n = i;
        break;
    }
    else if (anchor[i].href.search("javascript:unLikePhoto") > -1)
    {
        anchor[i].id = "unlike";
        n = i;
        break;
    }
}

anchor = anchor[n];

//Our Like/Unlike switcher.
function likeToggle()
{
    switch (anchor.id)
    {
        case "like":
            anchor.id = "unlike";
            anchor.innerHTML = "Undo Like";
            anchor.href = likeToggle.temp.replace("likePhoto", "unLikePhoto");
            break;

        case "unlike":
            anchor.id = "like";
            anchor.innerHTML = "Like";
            anchor.href = likeToggle.temp.replace("unLikePhoto", "likePhoto");
            break;
    }
}

likeToggle.temp = anchor.getAttribute("href");

//Override the inbuilt like/unlike functions.
likePhoto = function(id) {
        $.ajax({ type: 'POST', url: '/Photo/Like?id=' + id, cache: false, success: function (result) {
            likeToggle();
        }
        });
    };

unLikePhoto = function(id) {
        $.ajax({ type: 'POST', url: '/Photo/UnLike?id=' + id, cache: false, success: function (result) {
            likeToggle();
        }
        });
    };

