// ==UserScript==
// @name           nice down
// @namespace      http://looxu.blogspot.com/
// @description    bookmater support script
// @include        http://bookmeter.com/bl/*
// @version        1.0.3
// @downloadURL https://update.greasyfork.org/scripts/14726/nice%20down.user.js
// @updateURL https://update.greasyfork.org/scripts/14726/nice%20down.meta.js
// ==/UserScript==
(function(_doc, _win){
	var _lists = [], _iz = 0, _izlast = 0;

	function changeAndScroll( node ){

		var ot = node.offsetTop;

		node.className += " keySelect";
		node.style.backgroundColor = '#f8ffec';

		_win.scrollTo( 0, ot );
	}

  function addCSS(){
    var css = (function(){
    }).toString().replace();
  }

	function addKeyBind( keyChar, func, eve ){
		var t=eve.target, n=t.tagName.toLowerCase();

		if( t.nodeType != 1 || n == 'input' || n == 'textarea' ){
			return;
		}

		var pressKey = eve.which;

		keyChar = (keyChar=='Enter') ? 13 : keyChar.charCodeAt(keyChar);
		if( pressKey == keyChar ){
			eve.preventDefault();    //Stop Default Event
			func.apply();
		}
	}

	function downlist(){
		for( var i=0;i<_iz;i++){
			if( update( _lists[i], _lists[i+1], null ) ){
				break;
			}
		}
	}

	function uplist(){
		for( var i=0;i<_iz;i++){
			if( update( _lists[i], _lists[i-1], _lists[_izlast] ) ){
				break;
			}
		}
	}

	function update( targetNode, destNode, otherNode ){
		var cn = targetNode.className;

		if( /keySelect/.test(cn) ){
			targetNode.className = cn.replace(/ keySelect/,'');
			targetNode.style.backgroundColor = '';

			var move = (destNode) ? destNode : otherNode;

			// last node
			if( !move ){
				next();
				return true;
			}
			changeAndScroll( move );

			return true;
		}
		return false;
	}


	function nicedown(){
		var nodes = _doc.querySelectorAll('.keySelect .log_list_info span a'),
			i=0, iz = nodes.length;

		for(;i<iz;i++){
			if( /nice/.test(nodes[i].href) ){
				var text = nodes[i].href.replace(/javascript:/,'');

				eval( text );
				break;
			}
		}
		downlist();

	}

	function next(){
		var now = _doc.querySelector('.page_navis span.now_page'),
			next = now.nextSibling.firstChild.href;

		location.href = next;
	}

  function niceshow(){
    var logs = _doc.querySelectorAll('.log_list_comment'),
        stars = _doc.querySelectorAll('.log_list_info .nice_star_list'),
        cods = _doc.querySelectorAll('.log_list_info span a.nice_button_sprite');
        i=0,
        iz = logs.length,
        log = null,
        star = null,
        code = null,
        text = "",
        results = [],
        evalCodes = [];

    var offset = 10, staroffset = 2;

    for(;i<iz;i++){
      log = logs[i];
      star = stars[i];
      code = cods[i].href.replace(/javascript:/,'');
      text = log.textContent.replace(/\s/g,'');
      startext = star.textContent.replace(/\s/g,'');

      if( text.length < offset ){
        results.push({ 'log': log, 'star': star, 'code' : code });
      }else if( startext.length < staroffset ){
        results.push({ 'log': log, 'star': star, 'code' : code  });
      } else if( text.indexOf("★") > -1 || text.indexOf("☆") > -1 ) {
        results.push({ 'log': log, 'star': star, 'code' : code  });
      } else if( text.indexOf("http") > -1  ) {
        results.push({ 'log': log, 'star': star, 'code' : code  });
      } else if( text.indexOf("後で") > -1  ) {
        results.push({ 'log': log, 'star': star, 'code' : code  });
      } else {
        evalCodes.push(code);
      }

    }

    var j=0, jz = results.length, result = null,
        div=document.createElement("div"),
        wrapper = null, chkbox = null, label = null;

    div.id = "work_nice_down";

    for(;j<jz;j++){
      result = results[j];
      wrapper = div.appendChild(document.createElement("div"));
      wrapper.style.cssText = "padding: 4px;border-bottom: 1px solid #111;margin-bottom: 8px;";
      chkbox = wrapper.appendChild(document.createElement("input"));
      chkbox.type = "checkbox";
      chkbox.checked = true;
      chkbox.id = "nice_work" + j;
      label = wrapper.appendChild(document.createElement("label"));
      label.setAttribute("for" ,"nice_work" + j);
      label.appendChild(document.createTextNode("チェック"));
      wrapper.appendChild( result.log.cloneNode(true) );
      wrapper.appendChild( result.star.cloneNode(true) );
      wrapper.appendChild(document.createElement("br"));
      chkbox.setAttribute("data-code",result.code);

      (function(wrap,chkb){
        wrap.addEventListener("click", function(){
          var chkflg = chkb.checked ? false : true;
          chkb.checked = chkflg;
          this.style.backgroundColor = chkflg ? "#ffffff" : "#bbbbbb";
          this.style.color = chkflg ? "#333333" : "#ffffff";

        }, false );
      })(wrapper,chkbox);
    }

    div.style.cssText = "padding: 8px;";

    var submit = div.appendChild(document.createElement("input"));
    submit.type="submit";
    submit.addEventListener("click", function(eve){
      eve.preventDefault();
      var chks = document.querySelectorAll("#work_nice_down input[type=checkbox]"),
          l=0, lz = chks.length,
          chk = null;

      for(;l<lz;l++){
        chk = chks[l];
        if( !chk.checked ){
          mycode = chk.getAttribute("data-code");
          evalCodes.push(mycode);
        }
      }


      var k = 0, kz = evalCodes.length;

      for(;k<kz;k++){
        eval(evalCodes[k]);
      }

      document.body.removeChild(document.getElementById("work_nice_down"));

      next();

    }, false );


    document.body.appendChild(div);

    div.style.position = "absolute";
    div.style.top = (50 + document.documentElement.scrollTop) + 'px';
    div.style.right = "0";
    div.style.background = "#ffffff";
    div.style.width  = "480px";
    div.style.border = "1px solid #111";
    div.style.zindex= "20000";
    div.style.overflowY = "scroll";

  }


	function init(){
		_lists = _doc.querySelectorAll('.log_list_box');
		_iz = _lists.length;
		_izlast = _iz-1;

		if( _lists[0] ){
			changeAndScroll( _lists[0] );
		}

		_win.addEventListener('keypress', function(eve){
			addKeyBind( 'j', downlist, eve);
			addKeyBind( 'k', uplist, eve );
			addKeyBind( 'l', nicedown,eve );
			addKeyBind( 's', niceshow ,eve );
			addKeyBind( 'n', next,eve );
		}, false );
	}
    init();
	//_doc.addEventListener('DOMContentLoaded', init, false );
})(document, window);
