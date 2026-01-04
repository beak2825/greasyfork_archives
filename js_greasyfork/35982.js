// ==UserScript==
// @name Kita-Yen 4Chan
// @description Add kita to your post with ctr+"k" and Yen with ctr+"\"
// @version 2.5
// @match *://boards.4chan.org/*
// @grant none
// @namespace https://greasyfork.org/users/125336
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/35982/Kita-Yen%204Chan.user.js
// @updateURL https://update.greasyfork.org/scripts/35982/Kita-Yen%204Chan.meta.js
// ==/UserScript==



document.addEventListener("PostsInserted", function(e){
	colorCharacters(document.body);
});
document.addEventListener("4chanXInitFinished", function(e){
	//injection
	addStyle();
	colorCharacters(document.body);
	hotkeyListeners();
});

//color styling
function addStyle(){
    var style = document.createElement("STYLE");
    style.innerHTML = ".the_m_word{color:#9370DB} \n.the_k_word{color:#555555}";
    document.head.appendChild(style);
}

//hotkeys for kita and yen
function hotkeyListeners(){
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
			insertAtPos(node, '\xa5');
		}
	}, {passive:false, capture:false, once:false});

	window.addEventListener("keyup", function(e){
		listener_obj[e.keyCode] = false;
	}, {passive:false, capture:false, once:false});
}

//insertion logic
function colorCharacters(root){
    if(root.nodeType !== Node.ELEMENT_NODE){
        return;
    }

    var nodes = Array.from(root.getElementsByClassName('postMessage'));
    if(root.classList.contains('postmessage')){
		//insert above nodes, the root.
        nodes.unshift(root);
    }

    nodes.forEach(function(node){
        if(node.textContent.indexOf('\xa5') <= -1 && node.textContent.indexOf("ｷﾀ━━━(ﾟ∀ﾟ)━━━!!") <= -1){
            return;
        }
        var txtItterator = document.createNodeIterator(node, NodeFilter.SHOW_TEXT);
        var text_node;
        while((text_node = txtItterator.nextNode())){
			//disregard text inside of A tag links and already colored text
			if(text_node.parentNode.tagName == "A" || /the_[a-z]_word/g.test(text_node.parentNode.className)) continue;
			setColor(text_node, txtItterator);
        }
    });
}

//give color to text inside of nodes.
// first scan for yen symbols and then check the front of the text for not nested kita.
function setColor(text_node, txtItterator){
	var start_text_node = text_node;
    var result;
	var yen_node = searchYen(text_node);
	if(yen_node != false){
		//jump to internal node
		text_node = txtItterator.nextNode();
		//scan for nested kita
		do{
			result = searchKita(text_node);
			if(result != false){
				//jump foreward to point after kita inserted
				text_node = txtItterator.nextNode();
				text_node = txtItterator.nextNode();
			}
		} while(result != false);
	}
	//scan for outside kita from start
	do{
		result = searchKita(start_text_node);
		start_text_node = result.nextSibling;
	}while(result != false && start_text_node !== undefined);

}

//find the location of a yen, split the text from above that position, create a span element and place split into this span.
//Then take the initial text node and insert into it from after the text node.
function searchYen (text_node){
    var yenIndex = text_node.textContent.indexOf('\xa5');
    if(yenIndex > -1){
        var splitNode = text_node.splitText(yenIndex);

        var span = document.createElement('span');
        span.className = "the_m_word";

        span.appendChild(splitNode);
        text_node.parentNode.insertBefore(span, text_node.nextSibling);

        return span;
    }
    return false;
}

//find the location of a kita, isolate it by splitting from the point where the kita ends and the point where it begins.
//Now that there are 3 text nodes, take the middle one from the start position index split, add the text which goes to the point of the rightmost split,
//then refer back to the parent and place it after the leftmost string.
function searchKita (text_node){
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
    return false;
}


function insertAtPos(node, buzzwords){
    var sel_start = node.selectionStart;
    var sel_end = node.selectionEnd;

    n_tc = node.value;
    node.value = n_tc.substr(0, sel_start) + buzzwords + n_tc.substr(sel_end);

	node.selectionStart = sel_start + buzzwords.length;
	node.selectionEnd = sel_end + buzzwords.length;
}


