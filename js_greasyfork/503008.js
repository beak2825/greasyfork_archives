// ==UserScript==
// @name         fanyi
// @namespace    fireloong
// @version      0.0.16
// @description  翻译库
// @author       Itsky71
// @grant        none
// @license      MIT
// ==/UserScript==

let doc_version = window.location.pathname.split('/')[2];

if(doc_version === 'current') {
    doc_version = '7.1';
} else if(doc_version === '5.x') {
    doc_version = '5.4';
}

function fanyi(translates, id, dev = false, delay = false){
    let doc;
    if(typeof id === 'number'){
        switch(id){
            case 1:
                doc = '.toctree a,.ui-heading > h1,.ui-prose > .section p,.ui-prose > .section li,.ui-prose > .section h2>a,.ui-prose > .section h3>a,.ui-prose > .section h4>a,.ui-prose > .section dl>dt,.ui-prose > .section dl > dd,.hljs-comment';
                break;
            case 2:
                doc = '.ui-heading > h1,.ui-prose .section > h2 > a,.ui-prose p,.pagination-item > a,.pagination-item > span,.ui-prose li';
                break;
            default:
                break;
        }
    } else {
        doc = id;
    }
    
    const myFunc = (bb) => {
        $(bb).html(translates[$(bb).text()]);
    };

    let n = 0;
    let jsonStr = '';
    $(doc).each(function(i,v){
        if(translates.hasOwnProperty($(this).text())) {
            if(typeof delay === 'number'){
                setTimeout(myFunc, delay, this);
            } else {
                $(this).html(translates[$(this).text()]);
            }
        } else if(dev) {
            console.log(n,v,$(this).text());
            jsonStr += '\''+$(this).text().replaceAll('\\','\\\\').replaceAll('\'','\\\'').replaceAll("\n",'\\n')+'\': \'\','+"\n";
            n++;
        }
    });
    if(dev){
        console.info(jsonStr);
    }
}

// 精准查找，并翻译
function fanyi_jing(translates){
    $.each(translates, function(k,v){
        $(k).html(function(){
            //const regex = new RegExp(v[0], 'g');
            return $(this).html().replace(v[0], v[1]);
        });
    });
}
