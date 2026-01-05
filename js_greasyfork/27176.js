// ==UserScript==
// @name        mywebcoder
// @namespace   Nihar
// @description coder pannel
// @include     *localhost/*
// @version     0.1 Beta
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27176/mywebcoder.user.js
// @updateURL https://update.greasyfork.org/scripts/27176/mywebcoder.meta.js
// ==/UserScript==

/*<style type="text/css">
        #console{
            background-color:#333;color:#fff;
            width:80%;
            float:left;padding:2% 5%;
            margin:2% 5%; font-size:10px;
            min-height:400px;
        }
        .info{
            color:green;
            font-size:12px;
        }
        #type-pad{width:450px;height:200px;padding:5px 10px;background-color:#444;color:#fff;font-size:12px;}
        #options{ position:absolute;display:none;font-family: courier;}
        #options .optionList{display:block;padding:0px;margin:0px;padding:2px 5px;min-height:10px;min-width:90px;background-color: #e0e0e0;color: #227799; border-radius: 2px;}
    </style>
</head>
<body>
    <br/>
    <!--<button id="TestFieldCode">TestFieldCode</button>  -->
    <hr/>
    <div id="console">
 
        <div contenteditable="true" id="type-pad"></div>
    </div>
    <div id="options"><select size="1" class="optionList"></select></div>
    <script type="text/javascript">
        $(document).ready(function () {

            var px = { "common": [{ "key": "if" }, { "key": "into" }, { "key": "inter" }, { "key": "inum" }, { "key": "inumtestpad" }] }
	   var silectedIndex,CIndex,BIndex;
			
			//type keyup event
           $('#type-pad').keyup(function (e) {
               var currentIndex = textbox();CIndex=currentIndex;
               var content = $(this).text().substring(0, currentIndex);
			   BIndex=content.lastIndexOf(' ')+1;
               var lastWord = content.substring(BIndex, currentIndex);
               //console.log(lastWord);
			   if(e.keyCode!=40&&e.keyCode!=38){
               var MatchList = getObjects(px, "key", lastWord);
               if (MatchList.length < 1) {
                   $('#options').fadeOut(100);
               }
               else if (MatchList.length >= 0) {
                   var match = "";
                   for (var i=0; i < MatchList.length; i++) {
                       match += '<option value="'+MatchList[i].key+'">' + MatchList[i].key + '</option>';
                   }
                   $('#options .optionList').html(match);
                   (MatchList.length > 3) ? $('#options .optionList').attr('size', '3') : $('#options .optionList').attr('size', '' + MatchList.length);
				   				   if(e.keyCode!=13){
                   var coords = getSelectionCoords();
                   console.log(coords.x + ", " + coords.y);
                   $('#options').css({ 'left': (coords.x-5 )+ 'px', 'top': (coords.y+12) + 'px'}).fadeIn(200);
				   $('.optionList option:eq(0)').prop('selected',true)
								   }
               }
				   }
               
           });
			//dropdown Selection and key check
			$('#type-pad').keydown(function(e) {
    			
				if($('#options').is(':visible')){
					silectIndex=$('#options .optionList')[0].selectedIndex;
				if(e.keyCode==40) {
    			console.log(silectIndex);
					$('#options .optionList')[0].selectedIndex=silectIndex+1;
			  	}
				else if(e.keyCode==38) {
					console.log(silectedIndex);
					$('#options .optionList')[0].selectedIndex=silectIndex-1;
			  	}
				else if(e.keyCode==13) {	
					var a=$(this).text();
					var output = a.substring(0, BIndex) + $('#options .optionList option')[silectIndex].value //+ a.substring(CIndex);
					$(this).text("");$(this).text(output);
					console.log(a.substring(0, CIndex) +"   |  "+$('#options .optionList option')[silectIndex].value+"   |  "+a.substring(CIndex))
					$('#options').fadeOut(0);
			  	}
				if($('#options .optionList')[0].selectedIndex<0){
					$('#options .optionList')[0].selectedIndex=0;
				}
				}
			});
			//get matching objects
           function getObjects(obj, key, val) {
               var objects = [];
               var len = val.length;
               for (var i in obj) {
                   if (!obj.hasOwnProperty(i)) continue;
                   if (typeof obj[i] == 'object') { 
                       objects = objects.concat(getObjects(obj[i], key, val));
                   } else if (i == key &&  val==obj[key].substr(0,len)&& len>0) {
                       objects.push(obj);
                   }
               }
               return objects;
           }
           //get string Position
           function textbox() {
               var ctl = document.getElementById('type-pad');
               var startPos = ctl.selectionStart;
               var endPos = ctl.selectionEnd;
               return startPos;
               console.log(startPos);
           }

			//get carret axis
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
                       y = range.boundingTop;
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
                           y = rect.top;
                       }
                       // Fall back to inserting a temporary element
                       if (x == 0 && y == 0) {
                           var span = doc.createElement("span");
                           if (span.getClientRects) {
                               // Ensure span has dimensions and position by
                               // adding a zero-width space character
                               span.appendChild(doc.createTextNode("\u200b"));
                               range.insertNode(span);
                               rect = span.getClientRects()[0];
                               x = rect.left;
                               y = rect.top;
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


        });
    </script>*/