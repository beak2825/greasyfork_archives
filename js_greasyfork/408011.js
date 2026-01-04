// ==UserScript==
// @name         Likes Counter In Profile
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Likes
// @author       lolzteam
// @match        https://lolz.guru/*
// @downloadURL https://update.greasyfork.org/scripts/408011/Likes%20Counter%20In%20Profile.user.js
// @updateURL https://update.greasyfork.org/scripts/408011/Likes%20Counter%20In%20Profile.meta.js
// ==/UserScript==

function main()
{
    console.log("script");
    if($("#content > div > div > div.profilePage").length > 0)
    {
        var plink = document.location.href;
        if(plink.endsWith("/") == false) plink = plink+"/";
        $.get(`${plink}likes2`,{},onLikesSuccess);

        function onLikesSuccess(resp)
        {
            var htmlObject = document.createElement('div');
            htmlObject.innerHTML = resp;
            var likes = htmlObject.querySelector("#content > div > div > div.titleBar > h1").textContent.split("(")[1].split(")")[0];

            var likesdiv = `<a class="page_counter" href="${plink}likes2" rel="nofollow">
<div class="count">${likes}</div>
<div class="label muted">лайков</div>
</a>`

            $(likesdiv).insertAfter($("#content > div > div > div > div.mainProfileColumn > div > div.counts_module > a:nth-child(2)"));

        }
    }
}
main();