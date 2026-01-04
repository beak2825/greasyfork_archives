// ==UserScript==
// @name Yen Colors - kissu
// @description Add kita to your post with ctr+"k" and Yen with ctr+"\"
// @version 3
// @match *://*.kissu.moe/*
// @grant none
// @namespace https://greasyfork.org/users/125336

// @downloadURL https://update.greasyfork.org/scripts/425597/Yen%20Colors%20-%20kissu.user.js
// @updateURL https://update.greasyfork.org/scripts/425597/Yen%20Colors%20-%20kissu.meta.js
// ==/UserScript==

//insertion logic
function colorCharacters(root){
    if(root.nodeType !== Node.ELEMENT_NODE){
        return;
    }

    var nodes = Array.from(root.getElementsByClassName('post reply'));
    if(root.classList.contains('post reply')){
        nodes.unshift(root);
    }

    nodes.forEach(function(node){
        if(node.textContent.indexOf('\xa5') <= -1 && node.textContent.indexOf("ｷﾀ━━━(ﾟ∀ﾟ)━━━!!") <= -1){
            return;
        }
        var txtItterator = document.createNodeIterator(node, NodeFilter.SHOW_TEXT);
        var txtNode;
        while((txtNode = txtItterator.nextNode(txtNode))){
            var inside_node = searchYen(txtNode);
            if(inside_node !== "-") {
                searchKita(inside_node.firstChild);
                txtItterator.nextNode();
            }

            var inside_node = searchKita(txtNode);
            if(inside_node !== "-") {
                searchYen(inside_node.firstChild);
                txtItterator.nextNode();
            }
        }
    });
}

var searchYen = function(text_node){
    var hashIndex = text_node.textContent.indexOf('\xa5');
    if(hashIndex > -1){
        var splitNode = text_node.splitText(hashIndex);

        var span = document.createElement('span');
        span.className = "the_m_word";

        span.appendChild(splitNode);
        text_node.parentNode.insertBefore(span, text_node.nextSibling);

        return span;
    }
    return "-";
};

var searchKita = function(text_node){
    var kIndex = text_node.textContent.indexOf("ｷﾀ━━━(ﾟ∀ﾟ)━━━!!");
    if(kIndex > -1){
        var far_split_note =  text_node.splitText(kIndex + "ｷﾀ━━━(ﾟ∀ﾟ)━━━!!".length);
        var splitNode = text_node.splitText(kIndex);

        var span = document.createElement('span');
        span.className = "the_k_word";

        span.appendChild(splitNode);
        text_node.parentNode.insertBefore(span, text_node.nextSibling);
        return span;
    }
    return "-";
};

//color styling
var addStyle = function(){
    var style = document.createElement("STYLE");
    style.innerHTML = ".the_m_word{color:#9370DB} \n.the_k_word{color:#555555}";
    document.head.appendChild(style);
};

//injection
colorCharacters(document.body);
addStyle();

new MutationObserver(function(mutations){
    mutations.forEach(function(mutation){
        mutation.addedNodes.forEach(colorCharacters);
    });
}).observe(document.body, {childList: true, subtree: true});


//hotkeys
var listener_obj = {};
window.addEventListener("keydown", function(e){
    listener_obj[e.keyCode] = true;

    var node = document.activeElement;
    if (listener_obj[17] && listener_obj[75]){
        e.preventDefault();
        insertAtPos(node, 'ｷﾀ━━━(ﾟ∀ﾟ)━━━!!');
    }
    if (listener_obj[17] && listener_obj[220]){
        e.preventDefault();
        insertAtPos(node, '\xa5 ');
    }
}, {passive:false, capture:false, once:false});

window.addEventListener("keyup", function(e){
    listener_obj[e.keyCode] = false;
}, {passive:false, capture:false, once:false});

var insertAtPos = function(node, char){
    var sel_start = node.selectionStart;
    var sel_end = node.selectionEnd;

    n_tc = node.value;
    node.value = n_tc.substr(0, sel_start) + char + n_tc.substr(sel_end);
};


