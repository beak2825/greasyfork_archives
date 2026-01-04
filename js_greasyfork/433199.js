// ==UserScript==
// @name         Hacker News Filter Submissions By Site
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  hide submissions from from sites you don't like
// @author       bigguy
// @match        https://news.ycombinator.com/news*
// @match        https://news.ycombinator.com/news
// @match        https://news.ycombinator.com/
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/433199/Hacker%20News%20Filter%20Submissions%20By%20Site.user.js
// @updateURL https://update.greasyfork.org/scripts/433199/Hacker%20News%20Filter%20Submissions%20By%20Site.meta.js
// ==/UserScript==

(function() {

//quick remove promos
const FIX_NUMBERING = false;

[...(document.querySelector('table.itemList')?.rows ?? [])]
  .reduce((a, _r, i, rows) => (i % 3 ? a : [...a, rows.slice(i, i + 3)]), [])
  .filter((row) => row.length === 3)
  .filter(([title]) => !title.querySelector('td.votelinks'))
  .forEach((rows) => rows.forEach((row) => row.remove()));

if (FIX_NUMBERING) {
  document
    .querySelectorAll('span.rank')
    .forEach?.((s, i) => s.textContent && (s.textContent = `${i + 1}.`));
}

var fucks = GM_getValue("fuckers",[]); //local storage within userscript space
console.log("fucker site filter on");
document.getElementsByClassName('pagetop')[1].style="display:none";
var count = 0;
var filtered = 0;
var counter = document.createElement('span');
var subtexts = document.querySelectorAll('.subtext');
var things = document.querySelectorAll('.athing');

console.log(subtexts.length);
console.log(things.length)

for (let j=0;j<subtexts.length;j++) {
    var user = subtexts[j].getElementsByClassName('hnuser')[0];
    if (user!=undefined){
        user = user.innerText;
    } else {
        let thinymabob = things[j].getElementsByClassName("storylink")[0];
        thinymabob ? thinymabob.classList.add('promo') : null;
    }
    console.log(user)
}

things.forEach(function(post) {
	if (post.getElementsByClassName('sitestr').length < 1) return;
	var site = post.getElementsByClassName('sitestr')[0].innerText;




	var a = document.createElement('a');
	//a.class = 'togg';
	a.href = 'javascript:void(0)';
    a.style='cursor:pointer;';
	a.innerText = " [Y] ";
    count++;

    //a.onmouseover = function (){a.innerText = " [FILTER] "};
    //a.onmouseout = function (){a.innerText = " [Y] "};
	a.onclick = function test(){ site = post.getElementsByClassName('sitestr')[0].innerText; this.innerText = "[FUCKER]"; fucks.indexOf(site) === -1 ? fucks.push(site) : null; GM_setValue("fuckers", fucks); console.log(fucks); post.getElementsByClassName("title")[1].innerText = "'" + site + "' filtered from now on";} //fucks.join("','")
	post.getElementsByClassName('comhead')[0].prepend(a);
    var titleHolder = post.getElementsByClassName("storylink")[0] || null;
    var oldTitle = titleHolder ? titleHolder.innerText : "";
    //console.log(titleHolder.classList);

	if (fucks.includes(site) || (titleHolder && titleHolder.classList && titleHolder.classList.contains("promo"))){
		console.log(site + ' the fucker, has been blocked');
        var derTitle = post.getElementsByClassName("title")[1];
        var oldDerTitle = derTitle.innerText;
        console.log(derTitle.innerText)
        filtered++;


        var g = post.getElementsByClassName("votearrow");

        a.innerText = " . ";
        
        a.onmouseout = function (){a.innerText = " . "};
        a.className = 'subtext';

        if ((titleHolder && titleHolder.classList && titleHolder.classList.contains("promo")) || g.length==0){

            a.onmouseover = function (){a.innerText = oldTitle};
            derTitle.innerHTML = "<span class='push subtext'>[HN-PROMO FILTERED]<\span>";
        }
        else {
            console.log(titleHolder);
            a.onmouseover = function (){a.innerText = " [UNFILTER] "};
            if ( g ) {
                g[0].title = derTitle.innerText
            }
            derTitle.innerHTML = "<span class='push subtext'>["+site.toUpperCase() +" FILTERED]<\span>";
        }

        var b = a.cloneNode();
        b.innerText = " . "; //[P]
        //b.onmouseover = function (){b.innerText = oldTitle};
        //post.getElementsByClassName("push")[0].onmouseover = function (){post.getElementsByClassName("push")[0].innerText = oldTitle};
        //post.getElementsByClassName("push")[0].onmouseout = function (){post.getElementsByClassName("push")[0].innerText = "["+site.toUpperCase() +" FILTERED]"};
        b.onmouseover = function (){b.innerText = " [Preview] "};
        b.onmouseout = function (){b.innerText = " . "};
        b.alt='preview';
        b.onclick = function (){post.getElementsByClassName("title")[1].innerText = oldDerTitle};
        a.onmouseover = function (){a.innerText=" [UNDO] "};
        a.onclick = function test(){ fucks.indexOf(site) >= 0 ? delete fucks[fucks.indexOf(site)] : null;console.log("site index? ",fucks.indexOf(site)); GM_setValue("fuckers", fucks); console.log(fucks);} //fucks.join("','")
        post.getElementsByClassName('title')[1].append(b);
        var c = post.getElementsByClassName('title')[1]
        if (c) {
            c.prepend(a);
        }
	}
});
    counter.innerText=filtered+"/"+count+" submissions filtered!";
    document.getElementsByClassName('pagetop')[0].append(counter);
})();