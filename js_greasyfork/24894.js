// ==UserScript==
// @name         Toradorable Animator
// @namespace    http://tampermonkey.net/
// @version      0.0.16
// @description  Library to use for Toradorable Animations on agar and deviants. Animations stored separately. To use, @require this first, then Animations.
// @author       Toradorable
// @grant        none
// ==/UserScript==

/* Library to use for Toradorable Animations on agar and deviants.
 * Animations stored separately. 
 * To use, @require this first, then any Animations you would like. 
 * To play the currently selected animation, call 
animator.playAnimation();
 * NOTE: playAnimation requires per-site functions that are not included with this library.
 * You can find per-site functions in the link below.
 * To stop playing the current animation, call
animator.pauseAnimation(); 
 *
 * To select the next/prev animation, call 
animator.nextAnimation(); animator.prevAnimation();
 * Note that next/prev do not change the playing status. If we are already playing, we will seamlessly switch over to the new animation.
 *
 * To add your own animations, type 
animator.addAnimation({
    title: "Name Of Your Animation",
    // Optional Default display time, used when/if a frame does not have a time specified.
    defaultDisplayTime: 1000,
    frames: [
       //time: Optional display time for this frame in milliseconds,
       //url: "http://Link/To/Your/Image.png",
       //nick: "Optional Nick to use if applicable. Most sites do not allow you to change your nick in game."
         {time: 500, url: "https://s22.postimg.org/jha3867up/image.png", nick: "To"},
         {time: 500, url: "https://s22.postimg.org/jrhlrimgx/image.png", nick: "Ra"},
         {time: 500, url: "https://s22.postimg.org/6xjjy691d/image.png", nick: "Do"},
         {time: 500, url: "https://s22.postimg.org/idpyw7n7l/Ra2.png", nick: "Ra"},
         {time: 500, url: "https://s22.postimg.org/inxhfk1tt/exclam.png", nick: "!"},
         {time: 2000, url: "https://s18.postimg.org/tl8xraeux/Taiga_square.png", nick: "Toradora!"}
    ]
})'
 * To import a skinList, type
animator.importSkinList(
    // First argument is a skin list array.
    // Below is iWubbz's candy skinList as found on
    // https://greasyfork.org/en/scripts/23677-iwubbz-candy-skin-changer/code
    ["http://i.imgur.com/1JQqUzR.png",
     "http://i.imgur.com/VKcEy4k.png",
     "http://i.imgur.com/FKsf0PC.png",
     "http://i.imgur.com/zg6Oxzo.png",
     "http://i.imgur.com/EPawa6H.png",
     "http://i.imgur.com/NyKl8tG.png"
    ],
    // Second argument is optional. However, I recomend setting title at the least.
    //defaultDisplayTime is 1000 (1 second) by default.
    //All frames will be displayed for defaultDisplayTime milliseconds.
    //Use animator.addAnimation if you want different display times per frame.
    {title: "iWubbz's Candy", defaultDisplayTime: 5000}
);
 * ^^ Importing skin lists is as easy as stealing candy from iWubbz. ^^
 * Note that this is just the Toradorable animator library. 
 * Keybindings, Animations, and per-site functions are stored separately.
 *
 * If you need Animations, Keybindings, and Per-Site functions, look in
 * https://greasyfork.org/en/users/79223-Toradorable
 * per-site scripts are labled "Toradorable Site.extention". NOTE: All per-site scripts already include this library.
 * animations are labled "TitleOfAnimation Animation for Toradorable Skin Changer"
 * and extentions are labled "FunctionOfLibrary Extention for Toradorable Skin Changer"
 */



function ToradorableAnimator(initArgs={}) {
	if (!( this instanceof ToradorableAnimator) ) {
	    return new ToradorableAnimator(initArgs);
	}
	function isNumeric(n) {
		if (typeof(n) === 'undefined' || typeof(n) === 'null') return false;
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	function Print(msg) {
		console.log(msg);
	}
    function ArrayMove(arr, old_index, new_index) {
        if (old_index < 0) {
            old_index += arr.length;
        }
        if (new_index < 0) {
            new_index += arr.length;
        }
        if (new_index >= arr.length) {
            var k = new_index - arr.length;
            while ((k--) + 1) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        
        return arr; // for testing purposes
    };
    function IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };
    var animator=this;
    const keycodes={
    	    backspace:8,    tab:9,         enter:13,
    	    shift:16,       ctrl:17,       alt:18,
    	    pause_break:19, capslock:20,   escape:27,
    	    space:32,       pageup:33,     pagedown:34,
    	    end:35,         home:36,       leftarrow:37,
    	    uparrow:38,     rightarrow:39, downarrow:40,
    	    insert:45,      delete:46,
    	    0:48,   1:49,   2:50,   3:51,
    	    4:52,   5:53,   6:54,   7:55,
    	    8:56,   9:57,   a:65,   b:66,
    	    c:67,   d:68,   e:69,   f:70,
    	    g:71,   h:72,   i:73,   j:74,
    	    k:75,   l:76,   m:77,   n:78,
    	    o:79,   p:80,   q:81,   r:82,
    	    s:83,   t:84,   u:85,   v:86,
    	    w:87,   x:88,   y:89,   z:90,
    	    multiply: 106, add: 107, subtract: 109,
    	    decimalpoint: 110, divide: 111,
    	    f1: 112, f2: 113, f3: 114,
    	    f4: 115, f5: 116, f6: 117,
    	    f7: 118, f8: 119, f9: 120,
    	    f10: 121, f11: 122, f12: 123,
    	    numlock: 144, scrolllock: 145,
    	    semicolon: 186, equalsign: 187,
    	    comma: 188, dash: 189, period: 190,
    	    forwardslash: 191, graveaccent: 192,
    	    openbracket: 219, backslash: 220,
    	    closebraket: 221, singlequote: 222
    	};
	this.startOnFirstFrame = false;
	var _status = "Standby";
	// Automaticly update UI if initilaized
	this.autoUpdate = true;
	this.defaultDisplayTime = 1000;
	this.animations = [];
	this.animationsById = [];
	this.framesById = [];
    this.defaultAnimationTitle="Unamed Animation";
    this.showPreview = true;
    this.autoSave = true;
    this.autoRestore = true;
    this.doSetNick=true;
	//this.framesById = [];
    this.skinList = [];
	
	var _animationIndex = 0;
	var _animationTimeout =  null;
	var _isPlaying = false;
	var _isInitialized = false;
	var _speedMultiplier = 1;
	var _frameIndex = 0;
	var changeEvents={};
	
	
	// FUNCTONS
	this.onSpeedMultiplierChange = function() {
		this.site.elements.speedMultiplierBox.value=this.speedMultiplier;
	};
	this.decrementSpeedMultiplier = function() {
		this.speedMultiplier *= 0.5;
	};
	this.incrementSpeedMultiplier = function() {
		this.speedMultiplier *= 2;
	};
	var changeEventCount=0;
	this.addChangeEvent = function(id,prop,func) {
		//var id=changeEventCount++;
    	if (!(prop in changeEvents)) changeEvents[prop]={};
    	changeEvents[prop][id]=func;
        return id;
    };
    this.removeChangeEvent = function(prop,id) {
        //console.log("Setter called me");
    	if (!(prop in changeEvents) || !(id in changeEvents[prop]) ) return;
        delete changeEvents[prop][id];
    };
    this.callChangeEvent = function(prop) {
    	if (!(prop in changeEvents) ) return;
        //Check here since we may add more call events in out called functions
        var stopon=changeEvents[prop].length;
    	for (var id in changeEvents[prop]) {
    		if (!(changeEvents[prop][id])) continue;
    		changeEvents[prop][id](this,prop);
    	}
    };
	// Name of the animation
	this.titleOf = function(n){
        if (this.animations[n].title !== '') {
            return this.animations[n].title;
        } else {
            return animator.defaultAnimationTitle;
        }
	};
    this.setTitleOf = function(n,title) {
        this.animations[n].title = title;
        return this.animations[n].title;
    };
	this.setAnimation = function(n){
		this.animationIndex = n;
		if (this.animationIndex >= this.animations.length) this.animationIndex = 0;
		if (this.animationIndex < 0) this.animationIndex = this.animations.length - 1;
		if (this.isPlaying && !this.animationTimeout) {
			// Last Animation/frame had a displayTime <= 0, so no timeout as set.
			// We are still considered to be playing, so lets update
			this.playAnimation();
		}
		this.callChangeEvent('animation-select');
		return this.animations[this.animationIndex];
	};
	this.nextAnimation = function(n=1){
		this.animationIndex += n;
		if (this.animationIndex >= this.animations.length) this.animationIndex = 0;
		if (this.isPlaying && !this.animationTimeout) {
			// Last Animation/frame had a displayTime <= 0, so no timeout as set.
			// We are still considered to be playing, so lets update
			this.playAnimation();
		}
		this.callChangeEvent('animation-next');
		this.callChangeEvent('animation-select');
		return this.animations[this.animationIndex];
	};
	this.prevAnimation = function(n=1){
		this.animationIndex -= n;
		if (this.animationIndex < 0) this.animationIndex = this.animations.length - 1;
		if (this.isPlaying && !this.animationTimeout) {
			// Last Animation/frame had a displayTime <= 0, so no timeout as set.
			// We are still considered to be playing, so lets update
			this.playAnimation();
		}
		this.callChangeEvent('animation-prev');
		this.callChangeEvent('animation-select');
		return this.animations[this.animationIndex];
	};
	this.pauseAnimation = function(){
		this.isPlaying=false;
		if (this.animationTimeout) {
	        clearTimeout(this.animationTimeout);
	    }
		this.callChangeEvent('pause');
	};
	this.addChangeEvent('update status','pause', function() {
		animator.status='Standby';
	});
	this.addChangeEvent('update status','play',function() {
		animator.status='Animating Skin';
	});
	
	this.addChangeEvent('animator modified','autoSave', function() {
		if (animator.autoSave) animator.save();
	});
    this.addChangeEvent('animation modified','animation-add', function() {
			animator.callChangeEvent('autoSave');
    });
	this.addChangeEvent('animation modified','animation-remove', function() {
			animator.callChangeEvent('autoSave');
    });
    this.addChangeEvent('animation modified','animation-order', function() {
			animator.callChangeEvent('autoSave');
    });
	this.onFrameChange = function() {
	};
	this.playAnimation = function(sentoptions={}){
		var options=Object.assign({},{
			isFirstFrame: true,
			animationIdx: null,
			mode: "normal", // normal preview
			callback: function() { animator.site.updateFrame(); },
		}, sentoptions);
		this.isPlaying=true;
		var aniIdx = this.animationIndex;
		if ( isNumeric(options.animationIdx) ) {
			aniIdx = options.animationIdx;
		}
		var animation = this.animations[aniIdx];
		if (options.isFirstFrame) {
			if (this.startOnFirstFrame) this.frameIndex = 0;
			this.callChangeEvent('play');
			animation.callChangeEvent('play');
		} else {
			animation.nextFrame();
			//this.callChangeEvent('frame');
		}
		animation.callChangeEvent('show-frame');
		
		if (options.callback) options.callback(animation.currentSkin());
		var time = animation.currentDisplayTime();
		if (time > 0) {
			clearTimeout(this.animationTimeout);
			options.isFirstFrame=false;
			this.animationTimeout=setTimeout(function() { animator.playAnimation(options); }, time);
		}
	};
	this.toggleAnimation = function() {
		if (this.isPlaying) {
			this.pauseAnimation();
		} else {
			this.playAnimation();
		}
	};
	this.refreshFrame = function(){
		this.site.updateFrame( );
	};
	// Frames
	this.init = function() {
		this.site.initialize();
		this.isInitialized=true;
	};
	this.setFrameIndex = function(n) {
		return this.currentAnimation().frameIdx = n;
	};
	this.nextFrame = function(n=1){
		return this.currentAnimation().nextFrame(n);
	};
	this.prevFrame = function(n=1){
		return this.currentAnimation().prevFrame(n);
	};
	
	// For re-transmitting when player-update
	this.currentAnimation = function() {
		if (this.animationIndex >= this.animations.length) this.animationIndex = 0;
		return this.animations[this.animationIndex];
	};
	this.currentFrame = function(){
		return this.currentAnimation().currentFrame();
	};
	this.currentFrameDisplayTime = function() {
		return this.currentAnimation().currentDisplayTime();
	};

	// Agar Networks allows you to change your nick
	this.currentFrameNick = function(){
		return this.currentAnimation().currentNick();
	};
	this.currentFrameSkin = function(){
		return this.currentAnimation().currentSkin();
	};
	
	this.getAnimation = function(id) {
		return this.animations[id];
	};
	this.addAnimation = function(animation){
		//var a = Object.assign({},this.animationTemplate.clone(),animation);
        var a = new this.animationTemplate(animation);
		this.animations.push(a);
		this.animationsById[a.id]=a;
		this.callChangeEvent('animation-add');
		return a;
	};
	this.importSkinList = function(skinList,attributes={}) {
		var animation = this.addAnimation(attributes);
		animation.importFromSkinList(skinList);
		return animation;
	};
	this.moveAnimation = function(source,dest) {
		ArrayMove(this.animations,source,dest);
		this.callChangeEvent('animation-order');
	};
	this.onAddAnimation = function() {
		if (this.autoUpdate && this.isInitialized) {
			this.site.updateUI();
		}
	};
	this.addAnimations = function() {
		for (var i = 0; i < arguments.length; i++) {
			this.addAnimation(arguments[i]);
		}
		return this.animations;
	};
	this.getAnimationSpecifics = function(i) {
		var diffkeys={};
		for (var attr in this.animations[i]) {
            var template = new this.animationTemplate();
			if (attr in template && this.animations[i][attr] === template[attr]) {
				continue;
			}
			diffkeys[attr]=this.animations[i][attr];
		}
		return diffkeys;
	};
	
	
	this.ui = {
		eventlist: {
			animator:{},
			animation:{},
			frame:{},
		},
		addAnimatorEvent: function(region,name,event,fn) {
			if ( !(region in this.eventlist.animator) ) this.eventlist.animator[region] = {};
			if (event in this.eventlist.animator[region]) {
				animator.removeChangeEvent(this.eventlist.animator[region][event]);
			}
			this.eventlist.animator[region][event] = animator.addChangeEvent(region + name,event,fn);
		},
		addAnimationEvent: function(region,name,animation,event,fn) {
			if (!(region in this.eventlist.animation)) this.eventlist.animation[region] = {};
			if (!(event in this.eventlist.animation[region])) this.eventlist.animation[region][event] = {};
			if (animation.id in this.eventlist.animation[region][event]) {
				animation.removeChangeEvent(this.eventlist.animation[region][event][animation.id]);
			}
			this.eventlist.animation[region][event][animation.id] = animation.addChangeEvent(region + name,event,fn);
		},
		addFrameEvent: function(region,name,frame,event,fn) {
			if (!( region in this.eventlist.frame)) this.eventlist.frame[region] = {};
			if (!( event in this.eventlist.frame[region])) this.eventlist.frame[region][event] = {};
			if (frame.id in this.eventlist.frame[region][event]) {
				frame.removeChangeEvent(this.eventlist.frame[region][event][frame.id]);
			}
			this.eventlist.frame[region][event][frame.id] = frame.addChangeEvent(region + name,event,fn);
		},
		resetFrameEvents: function(region) {
			if (!( region in this.eventlist.frame) || !(event in this.eventlist.frame[region])) return;
			for (var event in this.eventlist.frame[region]) {
				for (var frameid in this.eventlist.frame[region][event]) {
					if (frameid in animator.framesById) {
						animator.framesById[frameid].removeChangeEvent(this.eventlist.frame[region][event][frameid]);
					}
					delete this.eventlist.frame[region][event][frameid];
				}
				delete this.eventlist.frame[region][event];
			}
			delete this.eventlist.frame[region];
		},
		resetAnimationEvents: function(region) {
			if (!( region in this.eventlist.animation) || !(event in this.eventlist.animation[region])) return;
			for (var event in this.eventlist.animation[region]) {
				for (var animationid in this.eventlist.animation[region][event]) {
					if (animationid in animator.animationsById) {
						animator.animationsById[animationid].removeChangeEvent(this.eventlist.animation[region][event][animationid]);
					}
					delete this.eventlist.animation[region][event][animationid];
				}
				delete this.eventlist.animation[region][event];
			}
			delete this.eventlist.animation[region];
		},
		resetAnimatorEvents: function(region) {
			if (!(region in this.eventlist.animator) || !(event in this.eventlist.animator[region])) return;
			for (var event in this.eventlist.animator[region]) {
				animator.removeChangeEvent(this.eventlist.animator[region][event]);
				delete this.eventlist.animator[region][event];
			}
			delete this.eventlist.animator[region];
		},
		elements: {
				showAnimations: null,
				frameByFrameUI: null,
		},
		clearShowAnimations: function() {
			var eventRegion='show-Animations';
			this.resetAnimatorEvents(eventRegion);
			this.resetAnimationEvents(eventRegion);
			this.resetFrameEvents(eventRegion);
            if ('showAnimations' in this.elements && this.elements.showAnimations ) {
                this.elements.showAnimations.remove();
                delete(this.elements.showAnimations);
            }
		},
        hideAnimations: function() {
            this.elements.showAnimations.style.display="none";
        },
        showAnimations: function() {
            if (! this.elements.showAnimations) {
                this.createAnimationsList();
            } else {
                this.elements.showAnimations.style.display="inline-block";
            }
        },
		createAnimationsList: function() {
			var eventRegion='show-Animations';
			this.clearShowAnimations();
			var ui = this;
			var UIcontainer = document.createElement("div");
			
			this.elements.showAnimations=UIcontainer;
			UIcontainer.style.overflow="scroll";
			UIcontainer.style.height="100vh";
            UIcontainer.style.display="inline-block";
			UIcontainer.className="alisio-panel enabledAnimations";
			
			var div = document.createElement("div");
            div.style.display="inline-block"
			//var ul = document.createElement("ul");
			for (var i=0; i < animator.animations.length; i++) {
				//var li = document.createElement("li");
                var animation=animator.animations[i];
                var animationDiv=document.createElement("div");
                animationDiv.dataset.associatedAnimationId=animation.id;
                //option.style.cssText = document.defaultView.getComputedStyle(chatboxInput, "").cssText;
				var img = document.createElement("img");
				var title = animator.site.elements.cssElement.cloneNode(true);
				title.value=animator.animations[i].title;
                title.placeholder=animator.defaultAnimationTitle;
                title.style.width="calc(100% - 50px)";
                title.onchange=(function(animation,key,element){ return function() {
                        animation[key]=element.value;
                    };
                })(animation,'title',title);
                (function(title,animation){
	                ui.addAnimationEvent(eventRegion,'title update',animation,'title',function() {
	                	title.value=animation.title;
	                })
                })(title,animation);
				var json = animator.site.elements.cssElement.cloneNode(true);
                //var changedValues=animator.getAnimationSpecifics(i);
                //delete changedValues.title;
				json.value = JSON.stringify(animator.animations[i].saveable);
				json.title = 'JSON animation object or a comma seperated quoted image links.';
				(function(animation,json) {
					json.onchange = function () {
						var jsonstr = json.value.trim();
						if (jsonstr.charAt(0) == '{' && IsJsonString(jsonstr) ) {
							animation.saveable=JSON.parse(json.value);
							json.style.backgroundColor=animator.site.elements.cssElement.style.backgroundColor;
						}
						else if (jsonstr.charAt(0) === '[' && IsJsonString(jsonstr)) {
							animation.removeAllFrames();
							animation.importFromSkinList(JSON.parse( jsonstr ));
							json.style.backgroundColor=animator.site.elements.cssElement.style.backgroundColor;
						}
						else if ((jsonstr.charAt(0) == '"') && IsJsonString('[' + jsonstr + ']')) {
							animation.removeAllFrames();
							animation.importFromSkinList(JSON.parse( '[' + jsonstr + ']'));
							json.style.backgroundColor=animator.site.elements.cssElement.style.backgroundColor;
						}
						else {
							alert('Must be a valid json object!\n' + 
								'Try double clicking on the image to edit the animation instead. ');
							json.style.backgroundColor='red';
						}
					};
					animation.addChangeEvent('update json','animation-modify', function() {
						json.value=JSON.stringify(animation.saveable);
						json.style.backgroundColor=animator.site.elements.cssElement.style.backgroundColor;
					});
				})(animation,json);
				img.src = (animation.frames.length > 0) ? animation.frames[0].url : "";
				img.style.width='50px';
				img.style.height='50px';
				img.style.borderRadius='50% 50%';
                img.title="Double Click to Edit";
                img.onmouseenter=(function(img,animation) {
                    return function() {
                        animator.playAnimation({animationIdx: animator.animations.indexOf(animation),callback: function(skin) {
                        	img.src=skin;
                        	//if (controlVisible && animator.showPreview) {
                			animator.site.elements.skinpreview.src = skin;
                			//}
                        }});
                    };
                })(img,animation);
                img.onmouseleave=function() { 
                	animator.pauseAnimation();
                	animator.site.elements.skinpreview.src = animator.site.elements.skinurl.value;
                };
                (function(animation) {
	                img.ondblclick=function() {
                        animator.ui.hideAnimations();
	                	animator.ui.frameByFrameUI(animation);
	                };
                })(animation);
               // (function(img,animation){
	           //     ui.addAnimationEvent(eventRegion,'img update',animation,'frame-modify',function() {
	           //     	img.src=(animation.frames.length > 0) ? animation.frames[0].url : "";
	           //     })
               // })(img,animation);
                (function(img,animation){
	                ui.addAnimationEvent(eventRegion,'img update',animation,'frame-add',function() {
	                	img.src=(animation.frames.length > 0) ? animation.frames[0].url : "";
	                });
                    ui.addAnimationEvent(eventRegion,'img update',animation,'frame-remove',function() {
	                	img.src=(animation.frames.length > 0) ? animation.frames[0].url : "";
	                });
                    ui.addAnimationEvent(eventRegion,'img update',animation,'frame-order',function() {
	                	img.src=(animation.frames.length > 0) ? animation.frames[0].url : "";
	                })
                })(img,animation);
				//animationDiv.id=
                animationDiv.appendChild(img);
                animationDiv.appendChild(title);
				animationDiv.appendChild(json);
				
			    //ui.elements.animationSelector.appendChild(li);
                //li.appendChild(animationDiv);
				animationDiv.className = 'orderedAnimation';

                //animationDiv.dataset.shortname=i;
				div.appendChild(animationDiv);
			}
			//div.appendChild(ul);
			//this.addAnimatorEvent(eventRegion,'animation-order', function() {
			//	ui.createAnimationsList();
			//});
			this.addAnimatorEvent(eventRegion,'rebuild animation list','animation-add', function() {
				ui.createAnimationsList();
			});
			this.addAnimatorEvent(eventRegion,'rebuild animation list','animation-remove', function() {
				ui.createAnimationsList();
			});
			var newAnimationBtn = animator.site.elements.cssButton.cloneNode(true);
			newAnimationBtn.textContent="Create";
			newAnimationBtn.title="Create New Animation";
			/*newAnimationBtn.style.width='100px';
            newAnimationBtn.style.height='100px';
            newAnimationBtn.style.top='0px';
            newAnimationBtn.style.left='0px';
            newAnimationBtn.style.right='0px';
            newAnimationBtn.style.bottom='0px';
            newAnimationBtn.style.position='absolute';*/
			//newAnimationBtn.style.left='8px';
			newAnimationBtn.onclick=function() {
				var newAnimation = animator.addAnimation();
			};
			/*var exportBtn = animator.site.elements.cssButton.cloneNode(true);
			exportBtn.textContent="Export";
			exportBtn.title="Export Animation List";
			exportBtn.onclick=function() {
				var newAnimation = animator.addAnimation();
			};*/
			UIcontainer.appendChild(div);
			UIcontainer.appendChild(newAnimationBtn);
			
			var deleteBox = document.createElement('div');
			//var deleteBox = document.createElement('div');
			deleteBox.style.cssText = animator.site.elements.cssButton.style.cssText;
			deleteBox.style.width='200px';
			deleteBox.style.height='88vh';
            deleteBox.style.position='absolute';
            deleteBox.style.boxSizing='border-box';
            //deleteBox.style.position='fixed';
            deleteBox.style.top='0vh';
            deleteBox.style.left='0vw';
            deleteBox.style.zIndex='1001';
            deleteBox.style.lineHeight='88vh';

			deleteBox.style.backgroundColor='red';
			deleteBox.textContent="Delete";
			deleteBox.title="Drag Animation here to Delete";
            deleteBox.style.display="none";
			animator.site.elements.uiOverlay.appendChild(deleteBox);
			document.getElementById('helloContainer').appendChild(UIcontainer);
            dragula([div], {
            	isContainer: function (el) {
            		if (el === deleteBox) return true;
            	    return false; // only elements in drake.containers will be taken into account
            	},
                revertOnSpill: true,
            	//moves: function (el, source, handle, sibling) {
                  //if (el === deleteBox) return true;
            	//  return true; // elements are always draggable by default
            	//},
            }).on('drop',function(el, target, source, sibling) {
                deleteBox.style.display="none";
                if (target === deleteBox) {
                    animator.removeAnimation(animator.animationsById[el.dataset.associatedAnimationId]);
                    return;
                }
            	var sourceIdx = animator.animations.indexOf( animator.animationsById[el.dataset.associatedAnimationId]);
                if (sibling) {
                	var destIdx = animator.animations.indexOf(animator.animationsById[sibling.dataset.associatedAnimationId]);
                    if (destIdx > sourceIdx) destIdx -= 1;
                    //console.log("Moving from " + sourceIdx +  " to " + destIdx);
                	animator.moveAnimation(sourceIdx, destIdx);
                } else {
                   // console.log("Moving from " + sourceIdx +  " to end at " + animator.animations.length - 1);
                	animator.moveAnimation(sourceIdx,animator.animations.length - 1);
                }
            }).on('drag', function(el,source) {
                //deleteBox.style.top=el.style.top;
                deleteBox.style.display="inline-block";
            }).on('cancel', function(el,container,source) {
                deleteBox.style.display="none";
            });
		},
        showSkinList: function() {
        	var eventRegion='skinList';
			var div = document.createElement("div");
            div.style.overflow="scroll";
            div.style.height="100vh";
			div.className="alisio-panel enabledAnimations";
			for (var i=0; i < animator.animations.length; i++) {
                var animation=animator.animations[i];
                var animationDiv=document.createElement("div");
			    var li = animationDiv;
                //option.style.cssText = document.defaultView.getComputedStyle(chatboxInput, "").cssText;
				var img = document.createElement("img");
				var title = animator.site.elements.cssElement.cloneNode(true);
                title.placeholder=animator.defaultAnimationTitle;
				title.value=animator.animations[i];
                title.onchange=(function(animation,key,element){ return function() {
                    animation[key]=element.value;
                 };
            })(animation,'title',title);
				var skinListBox = animator.site.elements.cssElement.cloneNode(true);
                var speedBox = animator.site.elements.cssElement.cloneNode(true);
                var changedValues=animator.getAnimationSpecifics(i);
                delete changedValues.title;
                
				skinListBox.value = JSON.stringify(changedValues);
				img.src = animation.frames[0].url;
				img.style.width='50px';
				img.style.height='50px';
				img.style.borderRadius='50% 50%';
                img.onmouseenter=(function(img,i) {
                    return function() {
                    	animator.playAnimation({
                    		isFirstFrame: true,
                    		animationIdx: i,
                    		callback: function(skin) { img.src=skin; }
                    	});
                    };
                })(img,i);
                img.onmouseleave=function() { animator.pauseAnimation(); console.log("Pausing Animation");};
				animationDiv.appendChild(img);
                animationDiv.appendChild(title);
				animationDiv.appendChild(skinListBox);
                animationDiv.appendChild(speedBox);
				
				li.className = 'orderedAnimation';
				div.appendChild(li);
			}
			//div.appendChild(ul);
			document.getElementById('helloContainer').appendChild(div);
            dragula([div]);
		},
		clearFrameByFrameUI: function() {
			var eventRegion='frame-by-frame';
			this.resetAnimatorEvents(eventRegion);
			this.resetAnimationEvents(eventRegion);
			this.resetFrameEvents(eventRegion);
            
			if ('frameByFrameUI' in this.elements && this.elements.frameByFrameUI ) {
                this.elements.frameByFrameUI.remove();
                delete(this.elements.frameByFrameUI);
            }
		},
        frameByFrameUI: function(animation) {
        	var eventRegion='frame-by-frame';
        	this.clearFrameByFrameUI();
            var ui=this;
            var UIcontainer = document.createElement("div");
            this.elements.frameByFrameUI=UIcontainer;
         // define a handler
            function doc_keyUp(e) {
                if ( e.keycode === keycodes.escape ) {
                    animator.ui.clearFrameByFrameUI();
                    animator.ui.showAnimations();
                }
            }
            // register the handler 
            var savebtn = document.createElement('BUTTON');
            savebtn.onclick=function() {
            	animator.ui.clearFrameByFrameUI();
                animator.ui.showAnimations();
            }
            savebtn.textContent="Save";
            savebtn.title='Closes Animation Editor and Returns to Animation List';
            savebtn.style.cssText=animator.site.elements.cssButton.style.cssText;
            //savebtn.style.cssText = document.defaultView.getComputedStyle(animator.site.elements.cssElement, "").cssText;
            savebtn.style.display='inline-block';
            savebtn.style.opacity='1';
            savebtn.style.position='relative';
            savebtn.style.right='auto';
            savebtn.style.left='8px';
            savebtn.style.top='0px';
            savebtn.style.bottom='auto';
            savebtn.style.width='25%';
            
            UIcontainer.onkeyup=function(e) {
                if ( e.keycode === keycodes.escape ) {
                    animator.ui.clearFrameByFrameUI();
                    animator.ui.showAnimations();
                }
            };
            UIcontainer.style.overflow="scroll";
            UIcontainer.style.height="100vh";
			UIcontainer.className="alisio-panel";
            var title = animator.site.elements.cssElement.cloneNode(true);
            title.placeholder=animator.defaultAnimationTitle;
            title.value=animation.title;
            title.title='Title of Animation';
            title.onchange=(function(animation,key,element){ return function() {
                    animation[key]=element.value;
                 };
            })(animation,'title',title);
            (function(title,animation){
                ui.addAnimationEvent(eventRegion,'frame animation title',animation,'title',function() {
                	title.value=animation.title;
                })
            })(title,animation);
            title.style.width="70%";
            
            UIcontainer.appendChild(title);
            UIcontainer.appendChild(savebtn);
            
			var frameContainter = document.createElement("div");
            UIcontainer.appendChild(frameContainter);
			for (var i=0; i < animation.frames.length; i++) {
                var frame = animation.frames[i];
                var animationDiv=document.createElement("div");
                //option.style.cssText = document.defaultView.getComputedStyle(chatboxInput, "").cssText;
				var img = document.createElement("img");
				
				var skinBox = animator.site.elements.cssElement.cloneNode(true);
                skinBox.placeholder="url of skin:";
                skinBox.title="URL of the desired image.";
                skinBox.onchange=(function(img,frame,skinBox){ return function() {
                    frame.url=skinBox.value;
                    img.src=frame.url;
                  };
                })(img,frame,skinBox);
                (function(skinBox,frame,img){
                    ui.addFrameEvent(eventRegion,'skinbox image',frame,'title',function() {
                    	skinBox.value=frame.url;
                    	img.src=frame.url;
                    });
                })(skinBox,frame,img);
                
                var speedBox = animator.site.elements.cssElement.cloneNode(true);
                speedBox.onchange=(function(frame,key,element){ return function() {
                    frame[key]=element.value;
                  };
                })(frame,'time',speedBox);
                (function(speedBox,frame){
                    ui.addFrameEvent(eventRegion,'speedbox title',frame,'time',function() {
                    	speedBox.value=frame.time;
                    });
                })(speedBox,frame);
                
                speedBox.placeholder="Display time(in milliseconds):";
                speedBox.title="How long we should display this image frame(1000 = 1 sec)";
                if (animator.site.canSetNick) {
                	// Nick cannot be changed on live cells on most sites.
	                var nickBox = animator.site.elements.cssElement.cloneNode(true);
	                nickBox.onchange=(function(frame,key,element){ return function() {
	                    frame[key]=element.value;
	                  };
	                })(frame,'nick',nickBox);
	                (function(nickBox,frame){
	                    ui.addFrameEvent(eventRegion,'nickbox',frame,'nick',function() {
	                    	nickBox.value=frame.nick;
	                    });
	                })(nickBox,frame);
	                nickBox.placeholder="Nick to use:";
	                nickBox.title="What to name our cell when using this frame.";
	                nickBox.value = ('nick' in frame) ? frame.nick : "";
                }
                //var changedValues=AnimationContainer.getAnimationSpecifics(i);
                skinBox.style.width="calc(100% - 50px)";
				skinBox.value = ('url' in frame) ? frame.url : "";
                speedBox.value = (frame.hasExplicitTime) ? frame.time : "";
				img.src = frame.url;
				img.style.width='50px';
				img.style.height='50px';
				img.style.borderRadius='50% 50%';
                //img.onmouseenter=(function(img,i) {return function() { AnimationContainer.playAnimationOn(true,i,function(skin) { img.src=skin; console.log("Playing Animation"); }) }  })(img,i);
                //img.onmouseleave=function() { AnimationContainer.pauseAnimation(); console.log("Pausing Animation");};
				
                animationDiv.appendChild(img);
				animationDiv.appendChild(skinBox);
                animationDiv.appendChild(speedBox);
                if (animator.site.canSetNick) animationDiv.appendChild(nickBox);
				animationDiv.dataset.associatedFrameId=frame.id;
				animationDiv.className = 'orderedAnimation';

				frameContainter.appendChild(animationDiv);
			}
			(function(animation){
                ui.addAnimationEvent(eventRegion,'frameByFrame',animation,'frame-order',function() {
                	ui.frameByFrameUI(animation);
                });
            })(animation);
			(function(animation){
                ui.addAnimationEvent(eventRegion,'frameByFrame',animation,'frame-add',function() {
                	ui.frameByFrameUI(animation);
                });
            })(animation);
			(function(animation){
                ui.addAnimationEvent(eventRegion,'frameByFrame',animation,'frame-remove',function() {
                	ui.frameByFrameUI(animation);
                });
            })(animation);
			var newFrameBtn = animator.site.elements.cssButton.cloneNode(true);
			newFrameBtn.textContent="Add Frame";
			newFrameBtn.title="Create a new frame in the Animation";
			newFrameBtn.style.width='100%';
			newFrameBtn.style.left='8px';
			newFrameBtn.onclick=function() {
				var newFrame = animation.addFrame();
			};
			//UIcontainer.appendChild(div);
			UIcontainer.appendChild(newFrameBtn);
			//div.appendChild(ul);
            var deleteBox = document.createElement('div');
			//var deleteBox = document.createElement('div');
			deleteBox.style.cssText = animator.site.elements.cssButton.style.cssText;
			deleteBox.style.width='200px';
			deleteBox.style.height='88vh';
            deleteBox.style.position='absolute';
            deleteBox.style.boxSizing='border-box';
            //deleteBox.style.position='fixed';
            deleteBox.style.top='0vh';
            deleteBox.style.left='0vw';
            deleteBox.style.zIndex='1001';
            deleteBox.style.lineHeight='88vh';

			deleteBox.style.backgroundColor='red';
			deleteBox.textContent="Delete";
			deleteBox.title="Drag Frame here to Delete";
            deleteBox.style.display="none";
			animator.site.elements.uiOverlay.appendChild(deleteBox);
			document.getElementById('helloContainer').appendChild(UIcontainer);
            dragula([frameContainter],{
                isContainer: function (el) {
            		if (el === deleteBox) return true;
            	    return false; // only elements in drake.containers will be taken into account
            	},
                revertOnSpill: true,
            }).on('drop',function(el, target, source, sibling) {
                deleteBox.style.display="none";
                if (target === deleteBox) {
                    animation.removeFrame(animation.framesById[el.dataset.associatedFrameId]);
                    return;
                }
            	var sourceIdx = animation.frames.indexOf( animation.framesById[el.dataset.associatedFrameId]);
                if (sibling) {
                	var destIdx = animation.frames.indexOf( animation.framesById[sibling.dataset.associatedFrameId]);
                    if (destIdx > sourceIdx) destIdx -= 1;
                	animation.moveFrame(sourceIdx, destIdx);
                } else {
                	animation.moveFrame(sourceIdx,animation.frames.length-1);
                }
                //ArrayMove(el.associatedAnimationIdx,sibling.associatedAnimationIdx);
                //AnimationContainer.animations[el.associatedAnimationIdx];
                //AnimationContainer.animation.move();
               // for (var i = 0; i < target.children.length; i++) {
                    //div.children[i].associatedAnimationIdx--;
               //     target.children[i].dataset.associatedAnimationIdx=i;
               // }
            }).on('drag', function(el,source) {
                //deleteBox.style.top=el.style.top;
                deleteBox.style.display="inline-block";
            }).on('cancel', function(el,container,source) {
                deleteBox.style.display="none";
            });
		}
	};
	this.site = {
		nick: null,
		canSetNick: true,
		elements: {
			uiOverlay: null,
			uiContainer: null,
			nick: null,
			skinurl: null,
			skinpreview: null,
			chatboxInput: null,
			mipmapNode: null,
			animationSelector: null,
			animationStatus: null,
			cssButton: null,
		},
		// changeEventList: region: type (animator/animation): id 
		eventlist: {
			animator:{},
			animation:{},
		},
		addAnimatorEvent: function(region,name,event,fn) {
			if (!(region in this.eventlist.animator)) this.eventlist.animator[region] = {};
			if (event in this.eventlist.animator[region]) {
				animator.removeChangeEvent(this.eventlist.animator[region][event]);
			}
			this.eventlist.animator[region][event] = animator.addChangeEvent(region + name,event,fn);
		},
		addAnimationEvent: function(region,name,animation,event,fn) {
			if (!( region in this.eventlist.animation)) this.eventlist.animation[region] = {};
			if (!( event in this.eventlist.animation[region])) this.eventlist.animation[region][event] = {};
			if (animation.id in this.eventlist.animation[region][event]) {
				animation.removeChangeEvent(this.eventlist.animation[region][event][animation.id]);
			}
			this.eventlist.animation[region][event][animation.id] = animation.addChangeEvent(region + name,event,fn);
		},
		resetAnimationEvents: function(region) {
			if (!(region in this.eventlist.animation) || !(event in this.eventlist.animation[region])) return;
			for (var event in this.eventlist.animation[region]) {
				for (var animationid in this.eventlist.animation[region][event]) {
					if (animationid in animator.animationsById) {
						animator.animationsById[animationid].removeChangeEvent(this.eventlist.animation[region][event][animationid]);
					}
					delete this.eventlist.animation[region][event][animationid];
				}
				delete this.eventlist.animation[region][event];
			}
			delete this.eventlist.animation[region];
		},
		resetAnimatorEvents: function(region) {
			if (!(region in this.eventlist.animator)|| !(event in this.eventlist.animator[region])) return;
			for (var event in this.eventlist.animator[region]) {
				animator.removeChangeEvent(this.eventlist.animator[region][event]);
				delete this.eventlist.animator[region][event];
			}
			delete this.eventlist.animator[region];
		},
		initialize: function() {
			this.elements.mipmapNode = document.getElementById("mipmapNode");
			this.elements.chatboxInput=document.getElementById("input_box2");
			this.elements.uiOverlay=document.getElementById("helloContainer");
			this.elements.uiContainer=document.getElementById("overlays2");
			this.elements.nick = document.getElementById('nick');
			this.elements.skinurl = document.getElementById('skinurl');
			this.elements.skinpreview = document.getElementById('preview-img');
            this.elements.playButton = document.querySelector('.btn.btn-info.btn-play');
            
            this.elements.cssButton = this.elements.playButton.cloneNode(true);
            this.elements.cssButton.id="";
            this.elements.cssButton.name="";
            this.elements.cssButton.style.cssText=document.defaultView.getComputedStyle(this.elements.playButton, "").cssText;
            this.elements.cssButton.style.display='inline-block';
            this.elements.cssButton.style.opacity='1';
            this.elements.cssButton.style.position='relative';
            this.elements.cssButton.style.right='auto';
            this.elements.cssButton.style.left='auto';
            this.elements.cssButton.style.top='auto';
            this.elements.cssButton.style.bottom='auto';
            this.elements.cssButton.style.width='auto';
			this.elements.cssElement = this.elements.chatboxInput.cloneNode(true);
            this.elements.cssElement.id="";
            this.elements.cssElement.name="";
            this.elements.cssElement.style.cssText=document.defaultView.getComputedStyle(this.elements.chatboxInput, "").cssText;
                //this.elements.chatboxInput.style.cssText;
			//this.elements.cssButton = document.getElementById('');
            var siteGetDefaultSkin = myApp["getCustomSkinUrl"];
            myApp["getCustomSkinUrl"] = function () {
            	if (animator.isPlaying) {
            		return animator.currentFrameSkin();
            	} else {
            		return siteGetDefaultSkin();
            	}
            };
            this.canSetNick=false;
			this.initilaizeUI();
		},
		getNick: function() {
			return this.elements.nick.value;
		},
		setNick: function(newNick) {
			this.elements.nick.value = newNick;
			return newNick;
		},
		getSkin: function() {
		},
		setSkin: function(skin) {
		},
		isInGame() { // must be implemented on a per site basis
			if (typeof getCell === 'function' && getCell().length >0) {
				return true
			}
			return false;
		},
		//changeNickTo: function () {   },
		//changeSkinTo: function () {   },
		refreshCurrentFrame: function() {   },
		updateFrame: function(nick=animator.currentFrameNick(), skin=animator.currentFrameSkin(), time=animator.currentFrameDisplayTime(), displaylocal=true) {
		    //this.elements.skinurl.value = skin;
		    //setNick(nick,team,skin,partytoken);
		    //setNick(document.getElementById('nick').value);
			var controlVisible = ! this.elements.uiOverlay.hidden;
			if (controlVisible && animator.showPreview) {
				this.elements.skinpreview.src = skin;
			}
			if (animator.site.isInGame()) {
				var player=playerDetailsByIdentifier[nodeList[0][1] + nodeList[0][6]];
			    socket.emit("playerUpdated", {
			        "action": "update",
			        "displayName": player.displayName,
			        "socketRoom": player.socketRoom,
			        "identifier": player.identifier,
			        "url": skin,
			        "nick": player.nick,
			        "team": player.team,
			        "token": player.token
			    });
			    nodeList[0][5]=skin;
			    if (displaylocal) {
			    	player.url=skin;
			    }
			}
		},
		updateUI: function(status=animator.status) {
			this.elements.animationStatus.textContent=status;
			for (var i = this.elements.animationSelector.options.length - 1 ; i >= 0 ; i--)
		    {
				this.elements.animationSelector.remove(i);
		    }
			for (var i = 0; i < animation.animations.length; i++) {
			    var option = document.createElement("option");
			    //option.style.cssText = document.defaultView.getComputedStyle(chatboxInput, "").cssText;
			    option.value = i;
			    option.text = animation.titleOf(i);
			    //this.elements.animationSelector.children[i] = option;
			    this.elements.animationSelector.appendChild(option);
			}
			this.elements.animationSelector.selectedIndex=animation.animationIndex;
		},
		rebuildAnimationSelectBox: function() {
			var eventRegion = 'statusUI';
			var animationSelector = this.elements.animationSelector;
			for (var i = animationSelector.options.length - 1 ; i >= 0 ; i--)
		    {
				animationSelector.remove(i);
		    }
			for (var i = 0; i < animator.animations.length; i++) {
				var eventRegion = '';
			    var option = document.createElement("option");
			    //option.style.cssText = document.defaultView.getComputedStyle(chatboxInput, "").cssText;
			    var animation=animator.animations[i];
			    option.value = i;
			    option.text = animator.titleOf(i);
                //option.text = animator.defaultAnimationTitle;
			    (function(i,option,thissite) {
			    	thissite.addAnimationEvent(eventRegion,'animation option',animator.animations[i],'title', function() {
				    	option.text=animator.titleOf(i);
					});
			    })(i,option,this);
			    animationSelector.appendChild(option);
			}
		},
		initilaizeUI: function() {
			var eventRegion="statusUI";
			var ui = this;
			this.resetAnimatorEvents(eventRegion);
			this.resetAnimationEvents(eventRegion);
			var SkinTargetType = document.createElement('BUTTON');
			if (this.elements.animationStatus) this.elements.animationStatus.remove();
			this.elements.animationStatus=SkinTargetType;
			SkinTargetType.name="Skin Target Type:";
			SkinTargetType.id="SkinTargetType";
			SkinTargetType.textContent="Standby"; // Theft, Swap, Push
			SkinTargetType.placeholder="Skin Target Type:";
			SkinTargetType.style.cssText = animator.site.elements.cssElement.style.cssText;
			SkinTargetType.style.width="200px";
			SkinTargetType.style.right="9px";
			SkinTargetType.style.bottom="250px";
			SkinTargetType.style.position="absolute";
			SkinTargetType.onclick=function(e) { animator.toggleAnimation(); };
			this.addAnimatorEvent(eventRegion,'status box','status', function() {
				SkinTargetType.textContent = animator.status;
			});
			this.elements.uiContainer.insertBefore(SkinTargetType, this.elements.uiContainer.lastChild);
			
			if (this.elements.speedMultiplierBox) this.elements.speedMultiplierBox.remove();
			var SpeedMultiplierBox = this.elements.cssElement.cloneNode(true);
			this.elements.speedMultiplierBox=SpeedMultiplierBox;
			SpeedMultiplierBox.name="SpeedMultiplier:";
			SpeedMultiplierBox.id="SpeedMultiplierBox";
			SpeedMultiplierBox.value=1; // Theft, Swap, Push
			SpeedMultiplierBox.placeholder="Speed Multiplier:";
			SpeedMultiplierBox.style.cssText =this.elements.cssElement.style.cssText;
			SpeedMultiplierBox.style.width="140px";
			SpeedMultiplierBox.style.right="39px";
			SpeedMultiplierBox.style.bottom="290px";
			SpeedMultiplierBox.style.position="absolute";
			SpeedMultiplierBox.onchange=function(e) { animator.speedMultiplier=e.target.value; };
			this.elements.uiContainer.insertBefore(SpeedMultiplierBox, this.elements.uiContainer.lastChild);
			this.addAnimatorEvent(eventRegion,'SpeedMultiplierBox','speedmultiplier', function() {
				SpeedMultiplierBox.value=animator.speedMultiplier;
			});
			
			if (this.elements.incrementSpeedMuliplier) this.elements.incrementSpeedMuliplier.remove();
			var IncrementSpeed = document.createElement('BUTTON');
			this.elements.incrementSpeedMuliplier=IncrementSpeed;
			IncrementSpeed.name="Skin Target Type:";
			IncrementSpeed.id="incrementSpeedMultiplier";
			IncrementSpeed.textContent="+"; // Theft, Swap, Push
			IncrementSpeed.placeholder="Skin Target Type:";
			IncrementSpeed.style.cssText = this.elements.cssElement.style.cssText;
			IncrementSpeed.style.width="30px";
			IncrementSpeed.style.right="9px";
			IncrementSpeed.style.bottom="290px";
			IncrementSpeed.style.position="absolute";
			IncrementSpeed.onclick=function(e) { animator.incrementSpeedMultiplier(); };
			this.elements.uiContainer.insertBefore(IncrementSpeed, this.elements.uiContainer.lastChild);
			
			if (this.elements.decrementSpeedMuliplier) this.elements.decrementSpeedMuliplier.remove();
			var DecrementSpeed = document.createElement('BUTTON');
			this.elements.decrementSpeedMuliplier=DecrementSpeed;
			DecrementSpeed.name="Skin Target Type:";
			DecrementSpeed.id="decrementSpeedMultiplier";
			DecrementSpeed.textContent="-"; // Theft, Swap, Push
			DecrementSpeed.placeholder="Skin Target Type:";
			DecrementSpeed.style.cssText = this.elements.cssElement.style.cssText;
			DecrementSpeed.style.width="30px";
			DecrementSpeed.style.right="179px";
			DecrementSpeed.style.bottom="290px";
			DecrementSpeed.style.position="absolute";
			DecrementSpeed.onclick=function(e) { animator.decrementSpeedMultiplier(); };
			this.elements.uiContainer.insertBefore(DecrementSpeed, this.elements.uiContainer.lastChild);
			//overlays2.insertBefore(StealSkinBox, overlays2.lastChild);

			if (this.elements.animationSelector) this.elements.animationSelector.remove();
			var SkinListBox = document.createElement("select"); //StealSkinBox.cloneNode(true);
			this.elements.animationSelector=SkinListBox;
			SkinListBox.name="Selected Skin:";
			SkinListBox.id="SelectedSkinElm";
			SkinListBox.value=""; // Theft, Swap, Push
			SkinListBox.placeholder="No Animation Selected";
			SkinListBox.style.cssText = this.elements.cssElement.style.cssText;
			SkinListBox.style.width="200px";
			SkinListBox.style.right="9px";
			SkinListBox.style.bottom="210px";
			SkinListBox.style.position="absolute";
			this.addAnimatorEvent(eventRegion,'skinListBox','animation-select', function() {
				SkinListBox.selectedIndex=animator.animationIndex;
			});
			
			overlays2.insertBefore(SkinListBox, overlays2.lastChild);

			this.rebuildAnimationSelectBox();
			this.addAnimatorEvent(eventRegion,'skinListBox','animation-order', function() {
				ui.rebuildAnimationSelectBox();
			});
			this.addAnimatorEvent(eventRegion,'skinListBox','animation-add', function() {
				ui.rebuildAnimationSelectBox();
			});
			this.addAnimatorEvent(eventRegion,'skinListBox','animation-remove', function() {
				ui.rebuildAnimationSelectBox();
			});
			SkinListBox.onchange=function(event){ animator.setAnimation(event.target.value); };
		},
        
	};
	
	this.removeAnimation = function(animation){ 
		var idx = this.animations.indexOf(animation);
		while (idx >= 0) {
			this.animations.splice(idx,1);
			idx = this.animations.indexOf(animation);
		}
		delete this.animationsById[animation.id];
		this.callChangeEvent('animation-remove');
	};
	this.Frame = function(animation,attr) {
		//if (!( 'instances' in animator.animationTemplate.Frame)) {
		//	animator.animationTemplate.Frame.instances = {};
		//}
		animator.Frame.count = (animator.Frame.count || 0) + 1;
		var _id = animator.Frame.count;
		//animator.animationTemplate.Frame.instances[_id]=this;
		var _nick;
		var _time;
		var _url;
		//var animation;
		if (!(animation)) {
			console.error('Cannot create a frame putside of an animation.');
			return;
		}
		var changeEvents={};
        
        this.addChangeEvent = function(id,prop,func) {
    		//var id=changeEventCount++;
        	if (!(prop in changeEvents)) changeEvents[prop]={};
        	changeEvents[prop][id]=func;
            return id;
        };
        this.removeChangeEvent = function(prop,id) {
            //console.log("Setter called me");
        	if (!(prop in changeEvents) || !(id in changeEvents[prop]) ) return;
            delete changeEvents[prop][id];
        };
        this.callChangeEvent = function(prop) {
        	if (!(prop in changeEvents) ) return;
            //Check here since we may add more call events in out called functions
            var stopon=changeEvents[prop].length;
        	for (var id in changeEvents[prop]) {
        		if (!(changeEvents[prop][id])) continue;
        		changeEvents[prop][id](this,prop);
        	}
        };
		Object.defineProperties(this, {
	        "nick": {
	             "get": function() {
	            	 if (_nick) {
                         return _nick;
                     } else {
                         return "";
                     }
	             },
	             "set": function(val) {
	            	 _nick=val;
	            	 this.callChangeEvent('nick');
	                 //return _title;
	             }
	        },
            "hasExplicitTime": {
	             "get": function() {
	            	 if (isNumeric(_time) && _time > 0) {
	            		return true;
	            	 } else {
                         return false;
                     }
	             },
            },
	        "time": {
	             "get": function() {
	            	 if (isNumeric(_time) && _time > 0) {
	            		return _time;
	            	 } else {
	            		return animation.defaultDisplayTime;
	            	 }
	             },
	             "set": function(val) {
	            	 _time=val;
	            	 this.callChangeEvent('time');
	            	 return _time;
	                 //return _title;
	             }
	        },
	        "url": {
	             "get": function() {
	            	 if (_url) {
	            		return _url;
	            	 } else {
	            		 return "";
	            	 }
	             },
	             "set": function(val) {
	            	 _url=val;
	            	 this.callChangeEvent('url');
	                 //return _title;
	             }
	        },
            stringify: {
                "get": function() {
                    var string="{";
                    if ( typeof(_url)  !== 'undefined' && typeof(_url)  !== 'null' && _url !== '') string += '"url": ' + JSON.stringify(_url);
                    if ( typeof(_nick) !== 'undefined' && typeof(_nick)  !== 'null' && _nick !== '') string += ', "nick": ' + JSON.stringify(_nick);
                    if ( typeof(_time) !== 'undefined' && typeof(_time)  !== 'null' ) string += ', "time": ' + JSON.stringify(_time);
                    string += '}';
                    return string;
                }
            },
            saveable: {
                "get": function() {
                    var obj = {};
                    if ( typeof(_url)  !== 'undefined' && typeof(_url)  !== 'null' && _url !== '') obj.url = _url;
                    if ( typeof(_nick) !== 'undefined' && typeof(_nick)  !== 'null' && _nick !== '') obj.nick = _nick;
                    if ( typeof(_time) !== 'undefined' && typeof(_time)  !== 'null' ) obj.time = _time;
                    return obj;
                }
            },
	        "id": {
	        	"get": function() {
	        		return _id;
	        	}
	        }
	    });
		
		for (var key in attr) {
        //	if (key === 'animation') {
        //		animation=attr[key];
        //	} else {
        		this[key]=attr[key];
        //	}
        }
		
		this.addChangeEvent('animation modified','nick', function() {
			animation.callChangeEvent('animation-modify');
		});
		this.addChangeEvent('animation modified','url', function() {
			animation.callChangeEvent('animation-modify');
		});
		this.addChangeEvent('animation modified','time', function() {
			animation.callChangeEvent('animation-modify');
		});
		return this;
	};
	this.animationTemplate = function(attrib){
		/*addFrame: function(frame,showTime) {
		},*/
		/*fixFrameIndex: function() {
			if (animation.frameIndex >= this.frames.length) animation.frameIndex = 0;
		},*/
		animator.animationTemplate.count = (animator.animationTemplate.count || 0) + 1;
		var _id = animator.animationTemplate.count;
		var thisAnimation=this;
		this.currentFrame = function() {
			if (animator.frameIndex >= this.frames.length) animator.frameIndex = 0;
			return  this.frames[animator.frameIndex];
		};
		this.setFrameIndex = function(n) {
			animator.frameIndex = n;
			if (animator.frameIndex >= this.frames.length) animator.frameIndex = 0;
			if (animator.frameIndex < 0) animator.frameIndex = this.frames.length - 1;
            if (this.frames.length === 0) return;
			return  this.frames[animator.frameIndex];
		};
		this.nextFrame = function(n=1) {
			animator.frameIndex += n;
			if (animator.frameIndex >= this.frames.length) animator.frameIndex = 0;
            if (this.frames.length === 0) return;
			return this.frames[animator.frameIndex];
		};
		this.prevFrame = function(n=1) {
			animator.frameIndex -= n;
			if (animator.frameIndex < 0) animator.frameIndex = this.frames.length - 1;
            if (this.frames.length === 0) return;
			return  this.frames[animator.frameIndex];
		};
		this.currentNick = function() {
			var frame = this.currentFrame();
			return (frame && 'nick' in frame) ? frame.nick : animator.site.getNick();
		},
		this.currentSkin = function() {
			var frame = this.currentFrame();
			return (frame && 'url' in frame) ? frame.url : animator.site.getSkin();
		};
		this.currentDisplayTime = function() {
			var frame = this.currentFrame();
			if (frame && 'time' in frame) {
				return Math.floor(frame.time / animator.speedMultiplier + 1);
			} else {
				return Math.floor( this.defaultDisplayTime / animator.speedMultiplier + 1);
			}
		};
		this.initialize = function() {   };
		this.clone = function() {
			var newAnimation = Object.assign({},this);
			newAnimation.frames=[];
			return newAnimation;
		};
		var _defaultDisplayTime=null;
		var _title = "";
	    Object.defineProperties(this, {
	        "title": {
	             "get": function() {
	            	 return _title;
	             },
	             "set": function(val) {
	            	 _title=val;
	            	 this.callChangeEvent('title');
	                 //return _title;
	             }
	        },
	        "defaultDisplayTime": {
	             "get": function() {
	            	 if (isNumeric(_defaultDisplayTime) && _defaultDisplayTime > 0) {
	            		return _defaultDisplayTime;
	            	 } else {
	            		return animator.defaultDisplayTime;
	            	 }
	             },
	             "set": function(val) {
	            	 _defaultDisplayTime=val;
	            	 this.callChangeEvent('defaultDisplayTime');
	                 //return _title;
	             }
	        },
            /*stringify: {
                "get": function() {
                    var string="{";
                    if ( typeof(_title)  !== 'undefined' && typeof(_title)  !== 'null' && _title !== '') string += '"title": ' + JSON.stringify(_title);
                    if ( typeof(_defaultDisplayTime) !== 'undefined' && typeof(_defaultDisplayTime)  !== 'null' ) string += ', "defaultDisplayTime": ' + JSON.stringify(_defaultDisplayTime);
                    string += ', "frames": [';
                    for (var idx=0; idx < this.frames.length; idx++) {
                        var frame = this.frames[idx];
                        string += frame.stringify;
                        string += ',';
                    }
                    string += ']';
                    if ( typeof(_time) !== 'undefined' && typeof(_time)  !== 'null' ) string += ', "time": ' + JSON.stringify(_time);
                    string += '}';
                    return string;
                }
            },*/
            saveable: {
                "get": function() {
                    var obj={};
                    if ( typeof(_title)  !== 'undefined' && typeof(_title)  !== 'null' && _title !== '') obj.title = _title;
                    if ( typeof(_defaultDisplayTime) !== 'undefined' && typeof(_defaultDisplayTime)  !== 'null' ) obj.defaultDisplayTime = _defaultDisplayTime;
                    obj.frames=[];
                    for (var idx=0; idx < this.frames.length; idx++) {
                        obj.frames.push(this.frames[idx].saveable);
                    }
                    //if ( typeof(_frameIdx) !== 'undefined' && typeof(_frameIdx)  !== 'null' ) obj.frameIdx = _frameIdx;
                    return obj;
                },
                "set": function(obj) {
                	this.removeAllFrames();
                	var title=undefined;
                	var defaultDisplayTime=undefined;
                    for (var key in obj) {
                    	if (key === 'frames') {
                    		 for (var idx=0; idx < obj.frames.length; idx++) {
                    			 this.addFrame(obj.frames[idx]);
                                 //this.frames[idx]=obj.frames[idx];
                             }
                    	}
                    	else if (key === 'title') title = obj[key];
                    	else if (key === 'defaultDisplayTime') defaultDisplayTime = obj[key];
                    }
                    this.title=title;
                    this.defaultDisplayTime=defaultDisplayTime;
                    //if ( typeof(_frameIdx) !== 'undefined' && typeof(_frameIdx)  !== 'null' ) obj.frameIdx = _frameIdx;
                    return obj;
                }
            },
	        "id": {
	        	"get": function() {
	        		return _id;
	        	}
	        }
	    });
        var changeEvents={};
        this.addChangeEvent = function(id,prop,func) {
    		//var id=changeEventCount++;
        	if (!(prop in changeEvents)) changeEvents[prop]={};
        	changeEvents[prop][id]=func;
            return id;
        };
        this.removeChangeEvent = function(prop,id) {
            //console.log("Setter called me");
        	if (!(prop in changeEvents) || !(id in changeEvents[prop]) ) return;
            delete changeEvents[prop][id];
        };
        this.callChangeEvent = function(prop) {
        	if (!(prop in changeEvents) ) return;
            //Check here since we may add more call events in out called functions
            var stopon=changeEvents[prop].length;
        	for (var id in changeEvents[prop]) {
        		if (!(changeEvents[prop][id])) continue;
        		changeEvents[prop][id](this,prop);
        	}
        };
        
		this.frames = [
			/*{
				nick: null,
				time: 0,
				url: "",
			}*/
		];
		this.framesById = [
			/*{
				nick: null,
				time: 0,
				url: "",
			}*/
		];
		this.addFrame = function(attr) {
			var frame = new animator.Frame(this,attr);
			this.frames.push(frame);
			this.framesById[frame.id]=frame;
			animator.framesById[frame.id]=frame;
			this.callChangeEvent('frame-add');
		};
		this.importFromSkinList = function(skinList,attributes={}) {
			//var animation = this.addAnimation(attributes);
			for (var i = 0; i < skinList.length; i++) {
				this.addFrame({url: skinList[i]});
			}
			return this;
		};
		this.moveFrame = function(source,dest) {
			ArrayMove(this.frames,source,dest);
			this.callChangeEvent('frame-order');
		};
		this.removeFrame = function(frame) {
			var idx = this.frames.indexOf(frame);
			while (idx >= 0) {
				this.frames.splice(idx,1);
				idx = this.frames.indexOf(frame);
			}
			delete this.framesById[frame.id];
			delete animator.framesById[frame.id];
			this.callChangeEvent('frame-remove');
		};
		this.removeAllFrames = function() {
			for (var frameId in this.framesById) {
				this.removeFrameById(frameId);
			}
		};
		this.removeFrameById = function(id) {
			this.removeFrame(this.framesById[id]);
		};
		this.removeFrameByIndex = function(idx) {
			var frame = this.frames[idx];
			this.frames.splice(idx,1);
			if (this.frames.indexOf(frame) === -1) {
				delete this.framesById[frame.id];
				delete animator.framesById[frame.id];
			}
			this.callChangeEvent('frame-remove');
		};
		this.addFrames = function() {
			for (var i=0; i < arguments.length; i++) {
				this.addFrame(arguments[i]);
			}
		};
		this.addChangeEvent('animation modified','frame-add', function() {
			thisAnimation.callChangeEvent('animation-modify');
		});
		this.addChangeEvent('animation modified','frame-remove', function() {
			thisAnimation.callChangeEvent('animation-modify');
		});
		this.addChangeEvent('animation modified','frame-order', function() {
			thisAnimation.callChangeEvent('animation-modify');
		});
		this.addChangeEvent('animation modified','title', function() {
			thisAnimation.callChangeEvent('animation-modify');
		});
		this.addChangeEvent('animation modified','defaultDisplayTime', function() {
			thisAnimation.callChangeEvent('animation-modify');
		});
		this.addChangeEvent('animation modified','animation-modify', function() {
			animator.callChangeEvent('autoSave');
		});
        for (var key in attrib) {
        	if (key === 'frames') {
        		for (var i=0; i<attrib.frames.length; i++) {
        			this.addFrame(attrib.frames[i]);
        		}
        	} else {
        		this[key]=attrib[key];
        	}
        }
	};
	
	//var AnimationContainer = {

	Object.defineProperties(this,{
		"frameIndex": {
			get: function() {
				return _frameIndex;
			},
			set: function(val) {
				_frameIndex=val;
				return this.frameIndex;
			},
		},
		speedMultiplier: {
			get: function() {
				return _speedMultiplier;
			},
			set: function(val) {
				_speedMultiplier=val;
				this.callChangeEvent('speedmultiplier');
				return this.speedMultiplier;
			},
		},
		animationIndex: {
			get: function() {
				return _animationIndex;
			},
			set: function(val) {
				_animationIndex = val;
				this.callChangeEvent('animation-select');
				return _animationIndex;
			},
		},
		isPlaying: {
			get: function() {
				return _isPlaying;
			},
			set: function(val) {
				_isPlaying=val;
				this.callChangeEvent((_isPlaying) ? 'play' : 'pause');
				return _isPlaying;
			},
		},
		status: {
			get: function() {
				return _status;
			},
			set: function(val) {
				_status=val;
				this.callChangeEvent('status');
				return _status;
			},
		},
        saveable: {
            get: function() {
                var obj={};
                //obj.defaultAnimationTime=this.defaultAnimationTime;
                obj.animations=[];
                for (var idx=0; idx < this.animations.length; idx++) {
                    obj.animations.push(this.animations[idx].saveable);
                }
                return obj;
            },
            set: function(obj) {
                //obj.defaultAnimationTime=this.defaultAnimationTime;
                //this.addAnimations(obj.animations);
            	for (var animationId in this.animationsById) {
            		this.removeAnimation(this.animationsById[animationId]);
            	}
                if (!('animations' in obj) ) {
                    console.log("Toradorable Animator requires a animations property to restore from object.");
                    return;
                }
                for (var idx=0; idx<obj.animations.length; idx++) {
                    this.addAnimation(obj.animations[idx]);
                }
                return this;
            }
        },
		isInitialized: {
			get: function() {
				return _isInitialized;
			},
		},
	});
    
    this.save = function(location='ToradorableAnimation') {
        GM_setValue(location, JSON.stringify(this.saveable) );
    };
    
    this.restore = function(location='ToradorableAnimation') {
        this.saveable=JSON.parse(GM_getValue(location, '{}' ));
    };
    
    //this.addChangeEvent('animation modified','autoSave', function() {
	//	if (animator.autoSave) animator.save();
	//});
	for (var key in initArgs) {
		this[key] = initArgs[key];
	}
	if (this.autoRestore) {
		this.restore();
	}
    return animator;
}


//var animator = (typeof animator === 'object') ? animator :  new ToradorableAnimator();