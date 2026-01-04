// ==UserScript==
// @name         Discord Watch Deleted Messages
// @version      1.0.7
// @license      GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @author       toolzmaker
// @description  Records all deleted messages in every opened channel and stores them so you can read it later ;)
// @homepageURL  https://discord.gg/BJTk6get7H
// @match        *://discordapp.com/*
// @match        *://discord.com/*
// @namespace https://greasyfork.org/users/971428
// @downloadURL https://update.greasyfork.org/scripts/453176/Discord%20Watch%20Deleted%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/453176/Discord%20Watch%20Deleted%20Messages.meta.js
// ==/UserScript==


    (function () {

        /////////////////////CLASS FOR DRAG AND RESIZE WITHOUT JQUERY//////////////////////////////////
          class Drag {
        /**
           * Make an element draggable/resizable
           * @param {Element} targetElm The element that will be dragged/resized
           * @param {Element} handleElm The element that will listen to events (handdle/grabber)
           * @param {object} [options] Options
           * @param {string} [options.mode="move"] Define the type of operation (move/resize)
           * @param {number} [options.minWidth=200] Minimum width allowed to resize
           * @param {number} [options.maxWidth=Infinity] Maximum width allowed to resize
           * @param {number} [options.minHeight=100] Maximum height allowed to resize
           * @param {number} [options.maxHeight=Infinity] Maximum height allowed to resize
           * @param {string} [options.draggingClass="drag"] Class added to targetElm while being dragged
           * @param {boolean} [options.useMouseEvents=true] Use mouse events
           * @param {boolean} [options.useTouchEvents=true] Use touch events
           *
           * @author Victor N. wwww.vitim.us
           */
        constructor(targetElm, handleElm, options) {
          this.options = Object.assign({
            mode: 'move',

            minWidth: 200,
            maxWidth: Infinity,
            minHeight: 100,
            maxHeight: Infinity,
            xAxis: true,
            yAxis: true,

            draggingClass: 'drag',

            useMouseEvents: true,
            useTouchEvents: true,
          }, options);

          // Public properties
          this.minWidth = this.options.minWidth;
          this.maxWidth = this.options.maxWidth;
          this.minHeight = this.options.minHeight;
          this.maxHeight = this.options.maxHeight;
          this.xAxis = this.options.xAxis;
          this.yAxis = this.options.yAxis;
          this.draggingClass = this.options.draggingClass;

          /** @private */
          this._targetElm = targetElm;
          /** @private */
          this._handleElm = handleElm;

          const moveOp = (x, y) => {
            let l = x - offLeft;
            if (x - offLeft < 0) l = 0; //offscreen <-
            else if (x - offRight > vw) l = vw - this._targetElm.clientWidth; //offscreen ->
            let t = y - offTop;
            if (y - offTop < 0) t = 0; //offscreen /\
            else if (y - offBottom > vh) t = vh - this._targetElm.clientHeight; //offscreen \/

            if(this.xAxis) this._targetElm.style.left = `${l}px`;
            if(this.yAxis) this._targetElm.style.top = `${t}px`;
            // NOTE: profilling on chrome translate wasn't faster than top/left as expected. And it also permanently creates a new layer, increasing vram usage.
            // this._targetElm.style.transform = `translate(${l}px, ${t}px)`;
          };

          const resizeOp = (x, y) => {
            let w = x - this._targetElm.offsetLeft - offRight;
            if (x - offRight > vw) w = Math.min(vw - this._targetElm.offsetLeft, this.maxWidth); //offscreen ->
            else if (x - offRight - this._targetElm.offsetLeft > this.maxWidth) w = this.maxWidth; //max width
            else if (x - offRight - this._targetElm.offsetLeft < this.minWidth) w = this.minWidth; //min width
            let h = y - this._targetElm.offsetTop - offBottom;
            if (y - offBottom > vh) h = Math.min(vh - this._targetElm.offsetTop, this.maxHeight); //offscreen \/
            else if (y - offBottom - this._targetElm.offsetTop > this.maxHeight) h = this.maxHeight; //max height
            else if (y - offBottom - this._targetElm.offsetTop < this.minHeight) h = this.minHeight; //min height

            if(this.xAxis) this._targetElm.style.width = `${w}px`;
            if(this.yAxis) this._targetElm.style.height = `${h}px`;
          };

          // define which operation is performed on drag
          const operation = this.options.mode === 'move' ? moveOp : resizeOp;

          // offset from the initial click to the target boundaries
          let offTop, offLeft, offBottom, offRight;

          let vw = window.innerWidth;
          let vh = window.innerHeight;


          function dragStartHandler(e) {
            const touch = e.type === 'touchstart';

            if ((e.buttons === 1 || e.which === 1) || touch) {
              e.preventDefault();

              const x = touch ? e.touches[0].clientX : e.clientX;
              const y = touch ? e.touches[0].clientY : e.clientY;

              const targetOffset = this._targetElm.getBoundingClientRect();

              //offset from the click to the top-left corner of the target (drag)
              offTop = y - targetOffset.y;
              offLeft = x - targetOffset.x;
              //offset from the click to the bottom-right corner of the target (resize)
              offBottom = y - (targetOffset.y + targetOffset.height);
              offRight = x - (targetOffset.x + targetOffset.width);

              vw = window.innerWidth;
              vh = window.innerHeight;

              if (this.options.useMouseEvents) {
                document.addEventListener('mousemove', this._dragMoveHandler);
                document.addEventListener('mouseup', this._dragEndHandler);
              }
              if (this.options.useTouchEvents) {
                document.addEventListener('touchmove', this._dragMoveHandler, {
                  passive: false,
                });
                document.addEventListener('touchend', this._dragEndHandler);
              }

              this._targetElm.classList.add(this.draggingClass);
            }
          }

          function dragMoveHandler(e) {
            e.preventDefault();
            let x, y;

            const touch = e.type === 'touchmove';
            if (touch) {
              const t = e.touches[0];
              x = t.clientX;
              y = t.clientY;
            } else { //mouse

              // If the button is not down, dispatch a "fake" mouse up event, to stop listening to mousemove
              // This happens when the mouseup is not captured (outside the browser)
              if ((e.buttons || e.which) !== 1) {
                this._dragEndHandler();
                return;
              }

              x = e.clientX;
              y = e.clientY;
            }

            operation(x, y);
          }

															
		 
	   
 
          function dragEndHandler(e) {
            if (this.options.useMouseEvents) {
              document.removeEventListener('mousemove', this._dragMoveHandler);
              document.removeEventListener('mouseup', this._dragEndHandler);
											 
					
								 
						
						
            }
            if (this.options.useTouchEvents) {
              document.removeEventListener('touchmove', this._dragMoveHandler);
              document.removeEventListener('touchend', this._dragEndHandler);
            }
            this._targetElm.classList.remove(this.draggingClass);
				   
          }

          // We need to bind the handlers to this instance and expose them to methods enable and destroy
          /** @private */
          this._dragStartHandler = dragStartHandler.bind(this);
          /** @private */
          this._dragMoveHandler = dragMoveHandler.bind(this);
          /** @private */
          this._dragEndHandler = dragEndHandler.bind(this);

          this.enable();
        }

        /**
         * Turn on the drag and drop of the instancea
         * @memberOf Drag
         */
        enable() {
          // this.destroy(); // prevent events from getting binded twice
          if (this.options.useMouseEvents) this._handleElm.addEventListener('mousedown', this._dragStartHandler);
          if (this.options.useTouchEvents) this._handleElm.addEventListener('touchstart', this._dragStartHandler, { passive: false });
																		
        }
        /**
         * Teardown all events bound to the document and elements
         * You can resurrect this instance by calling enable()
         * @memberOf Drag
         */
        destroy() {
          this._targetElm.classList.remove(this.draggingClass);

          if (this.options.useMouseEvents) {
            this._handleElm.removeEventListener('mousedown', this._dragStartHandler);
            document.removeEventListener('mousemove', this._dragMoveHandler);
            document.removeEventListener('mouseup', this._dragEndHandler);
          }
          if (this.options.useTouchEvents) {
            this._handleElm.removeEventListener('touchstart', this._dragStartHandler);
            document.removeEventListener('touchmove', this._dragMoveHandler);
            document.removeEventListener('touchend', this._dragEndHandler);
          }
        }
															 
      }
 
																									
					 
														   
					 
														 
					 
													   
 
					
	 
 
	   
												 
					 
	   
			  
																	
																											 
																																  
	 
	   
															 
														  
					 
	   
			   
														   
 
										
																				 
																		 
																	  
	   
										
																				  
																		 
																	   
	   
	 
   
        ///////////////////CLASS FOR DRAG AND RESIZE WITHOUT JQUERY////////////////////////////////////



        //////////RESTORING LOCALSTORAGE IN DISCORD//////////////
        const myiframe = document.createElement("iframe");
        myiframe.onload = () => {
            const ifrLocalStorage = myiframe.contentWindow.localStorage;
            window.localStorage = ifrLocalStorage;
        };
        myiframe.src = "about:blank";
        document.body.appendChild(myiframe);
        //////////RESTORING LOCALSTORAGE IN DISCORD//////////////

        //////////ADD NEW STYLES///////////////////////////
        var newStyles = (`
    		.new-hr-line {
    		  border: none;
    		  border-top:
    		  2px solid silver;
            }
            .delmsgborder {
              border-top-style: solid;
              border-top-color: silver;
              border-top-width: 1px;
            }
            .right-onhover-btn {
              right:0px;
              cursor: pointer;
            }
            .right-onhover-btn:hover {
              font-weight: bolder;
            }
        `);

        function insertCss(css) {
            const style = document.createElement('style');
            style.appendChild(document.createTextNode(css));
            document.head.appendChild(style);
            return style;
        }
	   
 
							 
													  
														
										 
					 
	 
        insertCss(newStyles);
        //////////ADD NEW STYLES///////////////////////////


        var last_channel = ''; // Remembers last switched channel
        var msgs_underline = '<hr class="new-hr-line">'; // Lines after messages in deleted messaged list
        var delmsgs_count = 0;
        var delmsgs_saved_str = ' messages';

        var observer, observing = false;

        var buttonHtml = (`
    		<div id="savedeletedbtn" class="iconWrapper-2awDjA" tabindex="0" role="button" aria-label="Save Deleted" title="Saved Deleted Messages">
    			<svg aria-hidden="false" width="24" height="24" viewBox="0 0 24 24">
    				<path fill="currentColor" d="M16.4597 7.6932H.7597C.3545 7.6932 0 8.0477 0 8.4529V20.3545c0 1.4181 1.1142 2.5323 2.5323 2.5323H14.6872c1.4181 0 2.5323-1.1142 2.5323-2.5323V8.4529C17.2194 8.0477 16.8649 7.6932 16.4597 7.6932ZM8.6097 20.861v-2.0258c1.6713 0 3.0387-1.3674 3.0387-3.0387 0-1.6713-1.3674-3.0387-3.0387-3.0387-.8103 0-1.57.3545-2.1271.9116l1.2155 1.2155c.1519.1519.0506.4558-.2026.4558h-3.6971c-.1519 0-.2532-.1013-.2532-.2532v-3.6971c0-.2026.2532-.3545.4558-.2026l1.0636 1.0636c.9623-.9116 2.2284-1.4687 3.5958-1.4687 2.7855 0 5.0645 2.279 5.0645 5.0645 0 2.7855-2.3297 5.0139-5.1152 5.0139zM18.2879 4.873 12.973 4.0664 13.2311 2.3656C13.3731 1.4302 12.7239.5487 11.7884.4067L9.2373.0195C8.3019-.1225 7.4203.5267 7.2784 1.4621L7.0203 3.1629 1.7053 2.3563C1.3652 2.3046 1.0224 2.5571.9707 2.8972L.7771 4.1728C.7255 4.513.978 4.8558 1.3181 4.9074L17.9007 7.4242C18.2408 7.4758 18.5836 7.2233 18.6353 6.8832L18.8289 5.6076C18.8805 5.2674 18.628 4.9246 18.2879 4.873ZM11.2722 3.8082 8.721 3.421 8.9146 2.1455C8.9533 1.8903 9.1492 1.7461 9.4043 1.7848l1.7008.2581c.2551.0387.3994.2346.3607.4897z"></path>
    			</svg>
    			<progress style="display:none;"></progress>
    		</div>`);

        var savedeletedTemplate = (`<div id="savedeleted" style=" resize: both; overflow-y:hidden;overflow-x:hidden; width: 400px; height: 350px;  position: fixed; z-index: 999;background-color: #36393F;  border: 2px solid darkgray; display: none;" >
    		 <div id="DELMSGS_CLASSDIV" style="justify-content: center; position: absolute; "   class="scroller__1f96e auto_a48086 scrollerBase_dc3aa9 managedReactiveScroller__79923" >
             <div id="DELMSGS_HEADER" style="top: 35%; text-align: center; color: grey; ">Deleted messages count.</div>
    		 <ol id="DELMSGS_OLMSGLIST" style="min-height:0; max-height: 0;" aria-label="DelMsgsOL" role="list" data-list-id="chat-messages1" tabindex="0">
    		 <li id="chat-messages-1020413784944295967" class="messageListItem-ZZ7v6g" aria-setsize="-1"><div class="message-2CShn3 cozyMessage-1DWF9U groupStart-3Mlgv1 wrapper-30-Nkg cozy-VmLDNB zalgo-26OfGz" role="article" data-list-item-id="chat-messages___chat-messages-1020413784944295967" tabindex="-1" aria-setsize="-1" aria-roledescription="Сообщение" aria-labelledby="message-username-1020413784944295967 uid_1 message-content-1020413784944295967 uid_2 message-timestamp-1020413784944295967"><div class="contents-2MsGLg"><img src="https://cdn.discordapp.com/avatars/223565920667303937/6fce20c42df22f2f8d4a3e44c8bdc177.webp?size=96" aria-hidden="true" class="avatar-2e8lTP clickable-31pE3P" alt=" "><h2 class="header-2jRmjb" aria-labelledby="message-username-1020413784944295967 message-timestamp-1020413784944295967"><span id="message-username-1020413784944295967" class="headerText-2z4IhQ"><span class="username-h_Y3Us desaturateUserColors-1O-G89 clickable-31pE3P" aria-expanded="false" role="button" tabindex="0">QQAdmin</span></span><span class="timestamp-p1Df1m timestampInline-_lS3aK"><time aria-label="Сегодня, в 0:20" id="message-timestamp-1020413784944295967" datetime="2022-09-16T19:20:04.702Z"><i class="separator-AebOhG" aria-hidden="true"> — </i>Сегодня, в 0:20</time></span></h2><div id="message-content-1020413784944295967" class="markup-eYLPri messageContent-2t3eCI">sdfsdf</div></div><div id="message-accessories-1020413784944295967" class="container-2sjPya"></div><div class="buttonContainer-1502pf"><div class="buttons-3dF5Kd container-2gUZhU isHeader-2bbX-L" role="group" aria-label="Действия с сообщениями"><div class="wrapper-2vIMkT"><div class="button-3bklZh" aria-label="Добавить реакцию" aria-expanded="false" role="button" tabindex="0"><svg class="icon-1zidb7" aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12.2512 2.00309C12.1677 2.00104 12.084 2 12 2C6.477 2 2 6.477 2 12C2 17.522 6.477 22 12 22C17.523 22 22 17.522 22 12C22 11.916 21.999 11.8323 21.9969 11.7488C21.3586 11.9128 20.6895 12 20 12C15.5817 12 12 8.41828 12 4C12 3.31052 12.0872 2.6414 12.2512 2.00309ZM10 8C10 6.896 9.104 6 8 6C6.896 6 6 6.896 6 8C6 9.105 6.896 10 8 10C9.104 10 10 9.105 10 8ZM12 19C15.14 19 18 16.617 18 14V13H6V14C6 16.617 8.86 19 12 19Z"></path><path d="M21 3V0H19V3H16V5H19V8H21V5H24V3H21Z" fill="currentColor"></path></svg></div><div class="button-3bklZh" aria-label="Изменить" role="button" tabindex="0"><svg class="icon-1zidb7" aria-hidden="true" role="img" width="16" height="16" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.2929 9.8299L19.9409 9.18278C21.353 7.77064 21.353 5.47197 19.9409 4.05892C18.5287 2.64678 16.2292 2.64678 14.817 4.05892L14.1699 4.70694L19.2929 9.8299ZM12.8962 5.97688L5.18469 13.6906L10.3085 18.813L18.0201 11.0992L12.8962 5.97688ZM4.11851 20.9704L8.75906 19.8112L4.18692 15.239L3.02678 19.8796C2.95028 20.1856 3.04028 20.5105 3.26349 20.7337C3.48669 20.9569 3.8116 21.046 4.11851 20.9704Z" fill="currentColor"></path></svg></div><div class="button-3bklZh" aria-label="Создать ветку" role="button" tabindex="0"><svg class="icon-1zidb7" aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M5.43309 21C5.35842 21 5.30189 20.9325 5.31494 20.859L5.99991 17H2.14274C2.06819 17 2.01168 16.9327 2.02453 16.8593L2.33253 15.0993C2.34258 15.0419 2.39244 15 2.45074 15H6.34991L7.40991 9H3.55274C3.47819 9 3.42168 8.93274 3.43453 8.85931L3.74253 7.09931C3.75258 7.04189 3.80244 7 3.86074 7H7.75991L8.45234 3.09903C8.46251 3.04174 8.51231 3 8.57049 3H10.3267C10.4014 3 10.4579 3.06746 10.4449 3.14097L9.75991 7H15.7599L16.4523 3.09903C16.4625 3.04174 16.5123 3 16.5705 3H18.3267C18.4014 3 18.4579 3.06746 18.4449 3.14097L17.7599 7H21.6171C21.6916 7 21.7481 7.06725 21.7353 7.14069L21.4273 8.90069C21.4172 8.95811 21.3674 9 21.3091 9H17.4099L17.0495 11.04H15.05L15.4104 9H9.41035L8.35035 15H10.5599V17H7.99991L7.30749 20.901C7.29732 20.9583 7.24752 21 7.18934 21H5.43309Z"></path><path fill="currentColor" d="M13.4399 12.96C12.9097 12.96 12.4799 13.3898 12.4799 13.92V20.2213C12.4799 20.7515 12.9097 21.1813 13.4399 21.1813H14.3999C14.5325 21.1813 14.6399 21.2887 14.6399 21.4213V23.4597C14.6399 23.6677 14.8865 23.7773 15.0408 23.6378L17.4858 21.4289C17.6622 21.2695 17.8916 21.1813 18.1294 21.1813H22.5599C23.0901 21.1813 23.5199 20.7515 23.5199 20.2213V13.92C23.5199 13.3898 23.0901 12.96 22.5599 12.96H13.4399Z"></path></svg></div><div class="button-3bklZh" aria-label="Ещё" aria-expanded="false" role="button" tabindex="0"><svg class="icon-1zidb7" aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M7 12.001C7 10.8964 6.10457 10.001 5 10.001C3.89543 10.001 3 10.8964 3 12.001C3 13.1055 3.89543 14.001 5 14.001C6.10457 14.001 7 13.1055 7 12.001ZM14 12.001C14 10.8964 13.1046 10.001 12 10.001C10.8954 10.001 10 10.8964 10 12.001C10 13.1055 10.8954 14.001 12 14.001C13.1046 14.001 14 13.1055 14 12.001ZM19 10.001C20.1046 10.001 21 10.8964 21 12.001C21 13.1055 20.1046 14.001 19 14.001C17.8954 14.001 17 13.1055 17 12.001C17 10.8964 17.8954 10.001 19 10.001Z"></path></svg></div></div></div></div></div></li>
    		 </ol></div>
    			 <div id="DELMSGS_BORDER" class="header" style="background-color: darkgray; position:absolute; top:0px; width: 100%; text-align: center;" >DELETED MESSAGES</div>
                 <div id="savedeletedCloseBtn" class="right-onhover-btn" style=" background-color: darkgray; position:absolute; top: 0px;" >X</div>
                 <div class="resizer" style=" background-color: darkgray; position:absolute; bottom: 0px; right: 0px; cursor: nwse-resize; opacity: 0.1;">//</div>
    		</div>`);

        var prev_ele = false;
        var savedeletedBtn;
        var savedeletedWindow;

        function createElm(html) {
            const temp = document.createElement('div');
            temp.innerHTML = html;
            return temp.removeChild(temp.firstElementChild);
	 
 
							 
														 
													 
																	 
				
												 
																	 
        }

 
									
											 
 
        function toggleWindow() {
            if (savedeletedWindow.style.display !== 'none') {
                savedeletedWindow.style.display = 'none';
                savedeletedBtn.style.color = 'var(--interactive-normal)';
            } else {
                savedeletedWindow.style.display = '';
                savedeletedBtn.style.color = 'var(--interactive-active)';
 
														   
																																			   
																
				 
            }
        }
																					
 
								 
	 
 
										   
																																							
	 
 
										 
 
																						  
																								 
																																							
		 

        var path_find_str = 'channels/';
        var local_storage_name = "SAVED_DELMSGS";

        function delmsg_close() {
            delmsgs_count -= 1;
            CheckMessagesCount(delmsgs_count);

            let delnode_id = this.id;
            let var_parsed = JSON.parse(window.localStorage.getItem(local_storage_name));
            if (var_parsed[last_channel]) {

                for (let cur_key in var_parsed[last_channel]) {
                    if (var_parsed[last_channel][cur_key].indexOf(delnode_id) != -1) { //if current id is found  in strnig, delete it from вшсе
			 
				  
                        var_parsed[last_channel].splice(cur_key, 1);
                    }
                }
            }
            window.localStorage.setItem(local_storage_name, JSON.stringify(var_parsed));

            this.parentNode.remove();
        }

        function CheckMessagesCount(DelCount) {
            savedeletedWindow.querySelector('#DELMSGS_HEADER').innerHTML = 'Found ' + DelCount.toString() + ' messages.';
        }

        function addLocalStorageItem(strng) {
            let channel_path = '0'; // channel string in discord (everything after /channels/)
									 
            if (location.pathname.indexOf(path_find_str) != -1) { // if path has /channels/ substring
                channel_path = location.pathname.substr(location.pathname.indexOf(path_find_str) + path_find_str.length);
															  
									
																																   
																		
										  
			 
															  
																						 
																																								 
																							
							  
																				 
            }
            let find_str = 'channels/';
            location.pathname.substr(location.pathname.indexOf(find_str) + find_str.length);
            if (window.localStorage.getItem(local_storage_name) === null) {
                let newItem = {
                    [channel_path]: [strng]
                };
                window.localStorage.setItem(local_storage_name, JSON.stringify(newItem));
            } else {
                let var_parsed = JSON.parse(window.localStorage.getItem(local_storage_name));
                if(!(channel_path in var_parsed)) {
                    var_parsed[channel_path] = [strng];
                }
                else {
                    var_parsed[channel_path].push(strng);
                }
                window.localStorage.setItem(local_storage_name, JSON.stringify(var_parsed));
            }
											  
        }

        function extra_change_message(msg_str) {
            const spoiler_regex = /(spoilerText-\w+ )(hidden-[-\w]+)/ig;
            return msg_str.replace(spoiler_regex, '$1'); /// UNHIDE SPOILER MESSAGES
        }
            window.localStorage = document.body.appendChild(document.createElement `iframe`).contentWindow.localStorage;
        function check_channel_change() {
            let cur_chan = location.pathname.substr(location.pathname.indexOf(path_find_str) + path_find_str.length);
            if (last_channel != cur_chan) { // if switching channels
                delmsgs_count = 0; // reset deleted messages count
                last_channel = cur_chan;
                let delmsglist = savedeletedWindow.querySelector('[id*="DELMSGS_OLMSGLIST"]'); /// get <OL> node (deleted message list)
                if (delmsglist) { // clear current list when channel changes
                    delmsglist.innerHTML = '';
 
																								 
									 
																						
                }
                ///SWITCHING CHANNELS, GETS DATA FROM LOCALSTORAGE
                let var_parsed = JSON.parse(window.localStorage.getItem(local_storage_name));
                let channel_name = document.body.querySelector('h1[class*="heading-"]').textContent /// Считывает название канала Channel Name
                    let border_name = savedeletedWindow.querySelector('[id*="DELMSGS_BORDER"]');
																				   
                if (border_name) {
                    border_name.innerHTML = 'Deleted in <b>' + channel_name + '</b>';
					 
                }
                if (var_parsed[cur_chan]) {
                    (var_parsed[cur_chan]).forEach(del_record => { // ADD MESSAGE FROM STORED MEMORY
                        /// UNHIDE SPOILER MESSAGES
                        const spoiler_regex = /(spoilerText-\w+ )(hidden-[-\w]+)/ig;
                        del_record = del_record.replace(spoiler_regex, '$1'); ///
                        delmsglist.innerHTML = delmsglist.innerHTML + extra_change_message(del_record);
                        delmsgs_count += 1;
                    });
                    const closeButtons = delmsglist.querySelectorAll('[id*="delmsg"]');
                    closeButtons.forEach((cur_elem) => {
                        cur_elem.onclick = delmsg_close;
                    });
                }
                CheckMessagesCount(delmsgs_count);
            }
        }

        function check(mutations) { // checks DOM mutations, fires when mouse over msg and new msg, even if scroll in somewhere up
            check_channel_change();
            let delmsgs_scroll = savedeletedWindow.querySelector('[id*="DELMSGS_CLASSDIV"]');
            let delmsglist = savedeletedWindow.querySelector('[id*="DELMSGS_OLMSGLIST"]');

            let scroll_elem = document.body.querySelector('[class*="scroller__1f96e"]');

            mutations.forEach(function (mutation) { // iterate all mutations
                mutation.removedNodes.forEach(function (removed_node) {

                    let check_old_msgs = document.body.querySelector('[class*="jumpToPresentBar-"]');
                    if (check_old_msgs) {
                        return; // Skips adding new deleted msgs when scrolling old messages
                    }

                    let scroll_elem = document.body.querySelector('[class*="scroller__1f96e"]');
                    if (scroll_elem && scroll_elem.scrollHeight > 7000 && scroll_elem.scrollTop) {
                        let diff_scroll = 1;
                        diff_scroll = scroll_elem.scrollHeight / scroll_elem.scrollTop;
                        if (diff_scroll > 1.7) {
                            return; // Skip adding deleted mssgs because of scroll
 
                        }
                    }

                    if ((removed_node.tagName === 'LI' || removed_node.tagName === 'DIV') && !removed_node.querySelector('[class*="isSending_"]') && (removed_node.querySelector('[class^="markup_"]'))) {

                        // because we allow divs, we need to filter out divs that are not just chat deletes
                        if (!isChatDelete(removed_node)) {
                            return;
                        }
                        let prevCount = 0;
                        let prevNode = mutation.previousSibling;
                        let olCount = 0; // OL child elements count

                        if (prevNode) {
                            if (prevNode.parentNode.tagName === 'OL') {
                                olCount = prevNode.parentNode.childElementCount;

                            }
                        }
                        while (prevNode /* && prevNode.tagName != 'OL'*/) {
                            prevCount++;
                            prevNode = prevNode.previousSibling;
                        }

                        let prevLimit = 10;
                        if (olCount > prevLimit * 3 && prevCount < prevLimit) {
                            return; // Skip adding deleted msgs to list if the there are less than 10 elements before the beginning of OL tag. Prevents adding deleted messages when channel dels them from cache.
                        }

                        /// USERNAME IN DELETED NODE
                        let delmsg_usrname = ''; // Nickname of deleted msg
                        let delmsg_time = ''; // time of deleted msg

                        if (!(getUsername(removed_node))) {
                            let findNode = mutation.previousSibling;
                            let usrnameNode = false;
                            while (findNode) {
                                usrnameNode = getUsername(findNode, true);
                                if (usrnameNode) {
                                    break;
                                }
                                findNode = findNode.previousSibling;
                            }
                            if (usrnameNode) {
                                delmsg_usrname = usrnameNode.textContent; // Nickname of deleted msg
                            }
                        } else { // if deleted message has nickname in it
                            delmsg_usrname = getUsername(removed_node)
                        }

                        if (delmsglist) {
                            let id_curtimestamp = 'delmsg' + Date.now();
                            const contentElements = removed_node.querySelectorAll('[id*="message-content-"]');
                            let new_delnode = [...contentElements].find(el => !el.className.includes("repliedTextContent"));
                            let delnode_imgs = removed_node.querySelector('[id*="message-accessories-"]'); //if message has images and other accessories
                            let msg_time_node = removed_node.querySelector('[id*="message-timestamp-"]');
                            let msg_time_text = msg_time_node.getAttribute('datetime') ?? "N/A";
                            //delmsg_time = msg_time_node.textContent;
                            const mregex = /^20(\d{2})-(\d{2})-(\d{2})T(.+):.+Z/i;
                            delmsg_time = msg_time_text.replace(mregex, '$4 $3/$2/$1');
                            /// ADD NEW ITEM TO DELMSGS LIST /////////////
                            let new_html = '<div id="' + id_curtimestamp + '" class="right-onhover-btn" style="position:absolute;">X</div> <b>' + delmsg_usrname + '</b> (' + delmsg_time + ') <br /> ' + new_delnode.innerHTML + delnode_imgs.outerHTML;// + msgs_underline;
                            new_delnode.innerHTML = extra_change_message(new_html);
                            new_delnode.classList.add("delmsgborder");
                            delmsglist.appendChild(new_delnode);
                            //delmsglist.innerHTML = delmsglist.innerHTML + msgs_underline;
                            let cur_elem = delmsglist.querySelector('[id*="' + id_curtimestamp + '"]');
                            // Set all mouse events for delete [X] button
                            cur_elem.onclick = delmsg_close;
                            delmsgs_count += 1;
                            CheckMessagesCount(delmsgs_count);
                            delmsgs_scroll.scrollTop = delmsgs_scroll.scrollHeight; // Scroll to the bottom of the list
                            addLocalStorageItem(new_delnode.outerHTML); // Add new deleted message to localStorage array
                        }

                        let nextSibl = mutation.nextSibling;
					 
 
									 
																	
																																			 
																																								
																																																													   
                        let new_node = removed_node;
                        let parent_elem = mutation.parentNode;
																  
																			  
																				   
																	  
																																																																																																																			
																			   
																  
															
																					   
																																	
																	 
														
										   
														  
																																						 
																																						  
                    }
                });
														
												
														  
				 
            });

 
            function getUsername(node, asNode = false) {
                const usernameNode = [...node.querySelectorAll('[class*="username_"]')].find(el => el.closest(`[id^='message-reply-context']`) === null) ?? null;
                if (!usernameNode) {
                    return null;
                }
                return asNode ? usernameNode : usernameNode.textContent;
            }

		 
 
            /**
             * Return true only if this delete refers to a removed message initiated by a user
             * @param node
             * @returns {boolean}
             */
            function isChatDelete(node) {
                // ensure we-wrapped message element (li -> div) when clicked on a reply link is removed
                const messageId = node.id.split("-").pop();
                const messageContent = document.querySelector(`#message-content-${messageId}`);
                if (messageContent) {
                    // ignore modals
                    const popup = messageContent?.closest(`[class^="focusLock"]`) ?? null;
                    if (!popup) {
                        return false;
                    }
                }
                // ignore div tags removed from uploads finished
                if (node.querySelector(`[class^="progressContainer"]`) !== null) {
                    return false;
                }
			 
															
																			  
                return true;
            }

        }

	 
 
        function init(observerInit) {
            savedeletedWindow = createElm(savedeletedTemplate);
            document.body.appendChild(savedeletedWindow);
            new Drag(savedeletedWindow, savedeletedWindow.querySelector('.header'), { mode: 'move' });
            new Drag(savedeletedWindow, savedeletedWindow.querySelector('.resizer'), { mode: 'resize' });
            savedeletedWindow.querySelector("#savedeletedCloseBtn").onclick = toggleWindow;


            observerInit = {
                childList: true,
                subtree: true
            };
            setInterval(function (ele) {
                // savedeletedBtn.onclick = toggleWindow;
                // Waits for mutation changes and adds button if needed
                const discordElm = document.querySelector('#app-mount');
                const toolbar = document.querySelector('#app-mount [class^=toolbar]');
                if (toolbar && (!discordElm.contains(savedeletedBtn))) { ///+ TOOLBAR BUTTON
                    savedeletedBtn = createElm(buttonHtml);
                    savedeletedBtn.onclick = toggleWindow;
                    toolbar.appendChild(savedeletedBtn);
			 
																   
							   
															  
										  
										 
					 
                }
                if (location.pathname.substr(0, 10) === "/channels/") {
                    if (prev_ele) {
                        if (!(document.body.contains(prev_ele))) {
                            observing = false;
                            prev_ele = false;
                        }
									
															   
                    }
                    if (!observing && (ele = document.querySelector('[class^="messagesWrapper_"]'))) {
                        observing = true;
                        prev_ele = ele;
                        //console.log('Observing is true.');
                        if (!observer) {
                            observer = new MutationObserver(check);
                        }
                        observer.observe(ele, observerInit);
                    }
                } else if (observing) {
                    console.log('Observer disconnect!');
                    observer.disconnect();
                    observing = false;
                }

													
									  
								  
			 
 
                if (toolbar) {
                    check_channel_change(); // Checks channel change every 500ms
                }
            }, 500);
        }

        init(); // Start the whole script


    })();