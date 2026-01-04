// ==UserScript==
// @name         greprepclub
// @namespace    http://tampermonkey.net/
// @version      2024-02-21
// @description  Augmented
// @author       Rupak
// @license MIT
// @match        https://gre.myprepclub.com/forum/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myprepclub.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/487360/greprepclub.user.js
// @updateURL https://update.greasyfork.org/scripts/487360/greprepclub.meta.js
// ==/UserScript==

var css=`
.sideBarBox{display:none}
.fbContainer{display:none}
#meaningEl{
    display:none;
    position: absolute;
    border-radius: 10px;
    border: 2px solid #73AD21;
    padding: 20px;
    background: rgba(255, 255, 255, 0.90);
    width:calc(100% - 100px);
    margin-left:20px;
}
.hidden{
    display:none;
}
`;
var style = document.createElement('style');
style.innerHTML = css;
document.head.appendChild(style);

var matjaxconf=`
			MathJax.Hub.Config({
				showMathMenu: false,
				showMathMenuMSIE: false,
				TeX: {
					extensions: ["noErrorsGmatClub.js"] // catches errors only to render "HTML-CSS"
				},

				CommonHTML: { linebreaks: { automatic: true } },
  				"HTML-CSS": { linebreaks: { automatic: true } },
         			SVG: { linebreaks: { automatic: true } },
			});

			MathJax.Hub.Register.StartupHook("mml Jax Ready", function () {
				MathJax.ElementJax.mml.math.prototype.defaults.scriptsizemultiplier = 0.8;
				MathJax.ElementJax.mml.math.prototype.defaults.scriptminsize = "8pt";
			});`

if(typeof MathJax==='undefined'){
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = '/static/mathjax/MathJax.js?config=TeX-MML-AM_HTMLorMML-full';
    document.head.appendChild(s);

    var k = document.createElement('script');
    k.type = 'text/x-mathjax-config';
    s.innerHTML = matjaxconf;
    document.head.appendChild(k);
}

(function() {
    'use strict';
    function clearSelection(){
        if (window.getSelection) {
            if (window.getSelection().empty) { // Chrome
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) { // Firefox
                window.getSelection().removeAllRanges();
            }
        } else if (document.selection) { // IE?
            document.selection.empty();
        }
    }

    var meaningEl = document.createElement("div");
    meaningEl.setAttribute("id", "meaningEl");
    meaningEl.classList.add('post-info')
    //meaningEl.onclick=clearSelection;

    function getTopicSubTitle(){
        var tc = document.getElementsByClassName('topics-sub-title');
        for(var i in tc){
            if(!(typeof tc[i]==="object"))continue;
            if(tc[i].textContent.trim()=='Topics'){
                return tc[i];
            }
        }
    };

    function insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    //filters here
    const activefilters = localStorage.getItem("isFilterActive")=='false'?false:true;
    function filter(x){
        //return true;
        if(activefilters){
            return !x.textContent.includes('Difficulty: Easy');
        }else{
            return true;
        }
    };

    function fetchAndUpdate(url,cb){
        fetch(url)
        .then(res => res.text())
        .then(html => {
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(html, "text/html");
            //console.log(htmlDoc.getElementsByClassName('text')[1])
            cb(htmlDoc.getElementsByClassName('text')[1])
        })
    };

    //https://stackoverflow.com/questions/7380190/select-whole-word-with-getselection
    //(modified)
    function snapSelectionToWord() {
        var sel;
        // Check for existence of window.getSelection() and that it has a
        // modify() method. IE 9 has both selection APIs but no modify() method.
        if (window.getSelection && (sel = window.getSelection()).modify) {
            sel = window.getSelection();
            return sel.toString();
        } else if ( (sel = document.selection) && sel.type != "Control") {
            var textRange = sel.createRange();
            return textRange.text;
        }
    }

    //https://stackoverflow.com/questions/6846230/coordinates-of-selected-text-in-browser-page
    //modified
    function getSelectionCoords(win) {
        win = win || window;
        var doc = win.document;
        var sel = doc.selection, range, rects, rect;
        var x = 0, y = 0;
        if (sel) {
            if (sel.type != "Control") {
                range = sel.createRange();
                range.collapse(true);
                x = range.boundingLeft;
                y = range.boundingTop+range.boundingHeight;
            }
        } else if (win.getSelection) {
            sel = win.getSelection();
            if (sel.rangeCount) {
                range = sel.getRangeAt(0).cloneRange();
                if (range.getClientRects) {
                    range.collapse(true);
                    rects = range.getClientRects();
                    if (rects.length > 0) {
                        rect = rects[0];
                    }
                    x = rect.left;
                    y = rect.bottom;
                }
                // Fall back to inserting a temporary element
                if (x == 0 && y == 0) {
                    var span = doc.createElement("span");
                    if (span.getClientRects) {
                        // Ensure span has dimensions and position by
                        // adding a zero-width space character
                        span.appendChild( doc.createTextNode("\u200b") );
                        range.insertNode(span);
                        rect = span.getClientRects()[0];
                        x = rect.left;
                        y = rect.bottom;
                        var spanParent = span.parentNode;
                        spanParent.removeChild(span);

                        // Glue any broken text nodes back together
                        spanParent.normalize();
                    }
                }
            }
        }
        return { x: x, y: y };
    }

    function definationText(r){
        var res = '';
        res+=r.definition;
        if(r.synonyms.length)res+='<br/>Synonyms: '+r.synonyms.join(", ");
        if(r.antonyms.length)res+='<br/>Antonyms: '+r.antonyms.join(", ");
        return res;
    };

    function getMeaningHTML(r){
        var res = '';
        if(Array.isArray(r)){
            //we care r[0] only
            res+=`<h2>${r[0].word}</h2>`;
            var meanings = r[0].meanings;
            for(let i=0;i<meanings.length;i++){
                res+='<hr/>';
                res+=`<h6>${meanings[i].partOfSpeech}</h6><ol>`;
                for(let j=0;j<meanings[i].definitions.length;j++){
                    res+='<li>'+definationText(meanings[i].definitions[j])+'</li>';
                }
                if(meanings[i].synonyms.length)res+='<br/>Synonyms: '+meanings[i].synonyms.join(", ");
                if(meanings[i].antonyms.length)res+='<br/>Antonyms: '+meanings[i].antonyms.join(", ");
                res+='</ol>';
            }
        }else{
            res+=`<h2>${r.title}</h2>`;
            res+=r.message+'<br/>';
            res+=r.resolution;
        }
        return res;
    };

    function logSelection(event) {
        var txt = snapSelectionToWord();
        if(!txt)return;
        txt = txt.replace(/[^\w\s]/gi, '')
        var cords = getSelectionCoords();
        //meaningEl.style.left = `${cords.x}px`;
        var top = (window.pageYOffset || document.scrollTop) - (document.clientTop || 0);
        meaningEl.style.top = `${cords.y+top}px`;
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://api.dictionaryapi.dev/api/v2/entries/en/"+txt,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                meaningEl.style.display='block';
                meaningEl.innerHTML = getMeaningHTML(JSON.parse(response.responseText));
            }
        });
    };

    function removeSelection(event){
        meaningEl.style.display='none';
        clearSelection();
    }

    function mark_visited(link){
        var xlink=window.location.href;
        history.replaceState({},"",link);
        history.replaceState({},"",xlink);
    }

    function clicked(x,hidden){
        if(x.newNode){
            if(!hidden)x.newNode.classList.remove('hidden');
            if(!hidden)mark_visited(x.link);
            return;
        }
        let newNode = document.createElement('div');
        newNode.classList.add('post-info')
        newNode.innerHTML='<img width="100px" src="https://media.tenor.com/JBgYqrobdxsAAAAi/loading.gif"/>';
        var link=x.getElementsByClassName('topic-link')[0].href;
        if(!hidden){
            //console.log('got click', location.pathname);
            const loc = location.pathname.split('/');//2=variable,3=value
            localStorage.setItem(`${loc[2]}_q`, link);
            localStorage.setItem(loc[2], loc[3]);
        }
        x.link=link;
        fetchAndUpdate(link, (x)=>{
            //console.log(x);
            if(!hidden)mark_visited(link);
            if(x==null){
                newNode.innerHTML = 'Content not available';
                return;
            };
            var e=x.getElementsByClassName('post_signature')[0];
            if(e)e.remove();
            var links=x.getElementsByTagName('a');
            for(let i=0;i<links.length;i++){
                if(links[i].classList.contains('spoiler-link'))continue;
                if(links[i].parentElement==x){
                    links[i].classList.add('hidden');
                }else{
                    links[i].parentElement.classList.add('hidden');
                }
            };
            if(x.children.length<2){
                newNode.innerHTML = 'Context not in QA format. Follow link to continue.';
                return;
            };
            //console.log(x.children.length);
            newNode.innerHTML='';
            newNode.appendChild(x);
            newNode.addEventListener("mouseup", logSelection);
            newNode.addEventListener("mousedown", removeSelection);
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,x]);
        });
        if(hidden)newNode.classList.add('hidden');
        x.newNode = newNode;
        insertAfter(x, newNode);
   }

    function updateSiblings(x,lastQ){
        var ns = x.nextElementSibling;
        var prev=null;
        var fst = ns;
        while(ns){
            if(filter(ns)){
                var wrap = document.createElement('div');
                wrap.classList.add('new-topic-button');
                wrap.style.cursor='pointer';
                ns.loaded=false;
                wrap.onclick = (x=>
                                ()=>{
                    clicked(x);
                    if(x.next)clicked(x.next,true);//preload next
                })(ns);
                var button = document.createElement('span');
                button.classList.add('orange-button');
                button.textContent='LOAD';
                wrap.appendChild(button);
                ns.children[4].innerText='';
                ns.children[4].appendChild(wrap);
                //ns.onmouseover = (x=>()=>clicked(x,true))(ns);
                //update link
                var link=ns.getElementsByClassName('topic-link')[0];
                if(link==lastQ){
                    ns.setAttribute('id','lastque');
                };
                link.target='_blank';
                if(prev)prev.next = ns;
            }else{
                ns.style.display='none';
            }
            prev=ns;
            ns=ns.nextElementSibling;
        };
        clicked(fst,true);//preload 1st
    }

    //main
    document.body.appendChild(meaningEl);
    meaningEl.onclick = removeSelection;
    var topicdiv=getTopicSubTitle();
    if(topicdiv){
        // referrer check and bookmark
        const loc = location.pathname.split('/');//2=variable,3=value
        const lastLoc = localStorage.getItem(loc[2]);
        const lastQue = localStorage.getItem(`${loc[2]}_q`);
        var jumpToQue = false;
        function tryRedirect(){
            if(lastLoc!=loc[3] && lastLoc!=null){
                if(confirm("Do you want to go to last page?")){
                    window.location.replace(`/forum/${loc[2]}/${lastLoc}#lastque`);
                }
            }
            jumpToQue=true;
        };
        if(document.referrer==""){
            tryRedirect();
        }else{
            const rf = new URL(document.referrer);
            const rloc = rf.pathname.split('/');
            //redirect only if pagination is not used
            if(rloc[2]!=loc[2]){
                tryRedirect();
            }
        }
        // ------------
        var fb = document.createElement('input');
        fb.style.margin = '2px';
        fb.type='checkbox';
        if(activefilters){
            fb.checked=true;
        }
        fb.onclick = function(){
            localStorage.setItem("isFilterActive",!activefilters);
            location.reload();
        };
        var forumFilters=document.getElementById("forumFilters");
        forumFilters.insertBefore(fb, forumFilters.firstChild);
        updateSiblings(topicdiv,lastQue);
        if(jumpToQue){
            window.location.replace('#lastque');
        }
    }else{
        console.log('Multiple Topics not found');
    }
})();