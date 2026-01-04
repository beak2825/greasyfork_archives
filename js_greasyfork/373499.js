// ==UserScript==
// @name         Simple HTML5 video player
// @description  Replaces any default HTML5 player with custom controls
// @grant        GM_addStyle
// @include *
// @run-at document-load
// @version 8
// @namespace https://greasyfork.org/users/3167
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/373499/Simple%20HTML5%20video%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/373499/Simple%20HTML5%20video%20player.meta.js
// ==/UserScript==

var videowrapper_init = false;

function HHMMSS(num) {
    num = num || 0;
    var sec_num = Math.floor(num);

    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}

    if (hours<1) {
        return minutes+':'+seconds;
    }
    return hours+':'+minutes+':'+seconds;
}

function fs_status() {
    if (document.fullscreenElement) {
        return 1;
    }
    else if (document.webkitFullscreenElement) {
        return 1;
    }
    else if (document.mozFullScreenElement) {
        return 1;
    }
    else return -1;
}

function init_videowrapper() {

    var videos = document.getElementsByTagName('video');
    for (var i=0; i<videos.length; i++) {

        (function(video) {
            if (video.controls==true && !video.iswrapped) {
                var spacing = 4;
              
                var computedStyle = window.getComputedStyle(video);
              
                video.controls_timeout=false;
              
				
                video.controls=false;
                video.iswrapped=true;

                var videowrapper = document.createElement('videowrapper');
                videowrapper.className=video.className;

                var showui = function() {
                    videowrapper.classList.add("showui");
                }
                var hideui = function() {
                    videowrapper.classList.remove("showui");
                }
                var peekui = function(duration) {
                    duration = duration || 1000;
                  
                    showui();
                    if (video.controls_timeout) {
                      clearTimeout(video.controls_timeout);
                    }
                    
                    video.controls_timeout = setTimeout(hideui, duration);
                }
              
			                  
                var showosd = function() {
                    videowrapper.classList.add("showosd");
                }
                var hideosd = function() {
                    videowrapper.classList.remove("showosd");
                }
                var peekosd = function(duration) {
                    duration = duration || 1000;
                  
                    showosd();
                    if (video.osd_timeout) {
                      clearTimeout(video.osd_timeout);
                    }
                    
                    video.osd_timeout = setTimeout(hideosd, duration);
                }
				
				var setosd = function(content) {
					videowrapper.setAttribute("data-osd", content)
				}
					
				setosd('Loading'); 
			  
                if (computedStyle.position == "absolute") {
                  videowrapper.className="absolute";
                } else {
                  videowrapper.className="relative";
                }
              
                if (video.height>0) {
                  videowrapper.style.height=video.height;
                }                
                if (video.width>0) {
                  videowrapper.style.width=video.width;
                }
              
                video.classList.add("iswrapped");

                if (video.parentNode==document.body && document.body.childNodes.length==1) {
                    //document.body.style.display="flex";
                    //document.body.style.alignItems="center";
                    //document.body.style.justifyContent="center";
                    //document.body.style.margin="auto";
                    //document.body.style.height="100vh";
					document.body.className="videobody";
                }

                if (video.parentNode!=videowrapper) { 
                    video.parentNode.insertBefore(videowrapper, video); 
                    videowrapper.appendChild(video);
                }

                var controls = document.createElement('controls');
                video.parentNode.insertBefore(controls, video.nextSibling);

                var playbutton = document.createElement('button');
                controls.appendChild(playbutton);
                playbutton.innerHTML="&#x25b6;";

                playbutton.style.left = spacing + "px";

                var timestamp = document.createElement('span');
                controls.appendChild(timestamp);
                timestamp.innerHTML="0:00/0:00";

                timestamp.style.left = (spacing + playbutton.clientWidth + spacing) + "px";

              
                var fsbutton = document.createElement('button');
                controls.appendChild(fsbutton);
                fsbutton.innerHTML="&#x25a1;";

                fsbutton.style.right = spacing + "px";

                var volumebar = document.createElement('input');
                controls.appendChild(volumebar);
                volumebar.type="range";
                volumebar.min=0;
                volumebar.max=1;

                volumebar.step=0.01;
                volumebar.value=0.5;
                volumebar.innerHTML="";

                volumebar.style.width="50px";
                volumebar.style.right= (spacing + fsbutton.clientWidth + spacing) + "px";

                            
                var mutebutton = document.createElement('button');
                controls.appendChild(mutebutton);
                mutebutton.innerHTML="&#x1f50a;";
                mutebutton.style.right=(spacing + volumebar.clientWidth + spacing + fsbutton.clientWidth + spacing) + "px";

              
                var seekbar = document.createElement('input');
                controls.appendChild(seekbar);
                seekbar.type="range";
                seekbar.value=0;
                seekbar.step=0.01;
                seekbar.innerHTML="";

                seekbar.hidden = true;

                var header = document.createElement('header');
                video.parentNode.insertBefore(header, video.nextSibling);

                var label = document.createElement('label');
                header.appendChild(label);
                label.innerHTML="Loading...";

                /*
			var savebutton = document.createElement('a');
			controls.appendChild(savebutton);
			savebutton.innerHTML="&#x1f847;";
			savebutton.style.lineHeight="32px";
			savebutton.style.position="absolute";
			savebutton.style.right="8px";
			savebutton.style.bottom="0";
			savebutton.style.border="none";
			savebutton.style.paddingTop="0";
			savebutton.style.paddingBottom="0";
			savebutton.style.paddingLeft="4px";
			savebutton.style.paddingRight="4px";
			savebutton.style.background="none";
			savebutton.style.fontFamily="Segoe UI Symbol";
			savebutton.style.fontSize="18px";
			savebutton.style.margin="0";
			savebutton.style.height="32px";

			savebutton.href=video.currentSrc;
			savebutton.download="";
				
*/
				var playvideo = function() {
					video.play();						
					if (video.livemode) {
						video.currentTime = video.duration - 3;
					}
				}

                playbutton.addEventListener("click", function() {
                    if (video.paused == true) {
                        playvideo();
                    } else {
                        video.pause();
                    }
					
                });

                video.addEventListener("click", function() {
					if (video.paused == true) {
						playvideo();
					} else {
						if (!video.livemode) {
							video.pause();
						}
					}
                });

                video.addEventListener("play", function() {					
					setosd(playbutton.innerHTML);
					peekosd(1000);
					
                    playbutton.innerHTML = "&#10074;&#10074;";
                    //controls.className="playing";
                    videowrapper.classList.remove("paused");
                    videowrapper.classList.add("playing");

                });

                video.addEventListener("pause", function() {					
					setosd(playbutton.innerHTML);
					peekosd(3000);
					
                    playbutton.innerHTML = "&#x25b6;";
                    //controls.className="paused";
                    videowrapper.classList.remove("playing");
                    videowrapper.classList.add("paused");
                });
				
				var updatetimestamp = function() {
					if (video.livemode) {
						var buffer = Math.round(video.duration - video.currentTime);
						timestamp.innerHTML = "Buffer: " + buffer + "s";
					} else {
						timestamp.innerHTML = HHMMSS(video.currentTime) + "/" + HHMMSS(video.duration);
					}
				}

                video.addEventListener("timeupdate", function() {
					updatetimestamp();
                });

                video.addEventListener("durationchange", function() {
                    updatetimestamp();
                });

                mutebutton.addEventListener("click", function() {
                    if (video.muted == false) {
                        video.muted = true;
                    } else {
                        video.muted = false;
                    }
                });

                var togglefs = function() {
                    if (fs_status()>0) {
                        if (document.exitFullscreen) {
                            document.exitFullscreen();
                        } else if (document.webkitExitFullscreen) {
                            document.webkitExitFullscreen();
                        } else if (document.mozCancelFullScreen) {
                            document.mozCancelFullScreen();
                        } else if (document.msExitFullscreen) {
                            document.msExitFullscreen();
                        }
                    }
                    else {

                        if (videowrapper.requestFullscreen) {
                            videowrapper.requestFullscreen();
                        } else if (videowrapper.mozRequestFullScreen) {
                            videowrapper.mozRequestFullScreen(); // Firefox
                        } else if (videowrapper.webkitRequestFullscreen) {
                            videowrapper.webkitRequestFullscreen(); // Chrome and Safari
                        }
                    }
                };
              
                fsbutton.addEventListener("click", togglefs);
              
                videowrapper.addEventListener("dblclick", togglefs);

                seekbar.addEventListener("input", function() {
                    var time = video.duration * (seekbar.value / 100);
                    video.currentTime = time;

                });


                video.addEventListener("timeupdate", function() {
                    var value = (100 / video.duration) * video.currentTime;
                    var progress = (video.currentTime / video.duration);
                    seekbar.value = value;
                    //seekbar.style.background = '-webkit-gradient( linear, left top, right top, color-stop(' + progress + ', var(--range-progress-color)), color-stop(' + progress + ', var(--range-background-color)))';
                });

                var updatebuffer = function() {
								
					if (video.duration == Infinity || video.hls || video.livemode) {
						video.livemode = true;
					}
				
					if (video.livemode) {
						seekbar.hidden = true;
						
						label.innerHTML = "Live";
					} else {
					
						var start = video.buffered.length>0 ? ( video.buffered.start(0) / video.duration) : 0;
						var end = video.buffered.length>0 ? (video.buffered.end(0) / video.duration) : 0;
					  
						seekbar.hidden = false;
					  
						seekbar.style.left = (spacing + playbutton.clientWidth + spacing + timestamp.clientWidth + spacing) + "px";
						seekbar.style.right= (spacing + mutebutton.clientWidth + spacing + volumebar.clientWidth + spacing + fsbutton.clientWidth + spacing) + "px";
						seekbar.style.width='calc(100% - ' + seekbar.style.left + ' - ' + seekbar.style.right + ')';
					  
						seekbar.style.background = '-webkit-gradient( linear, left top, right top, color-stop(' + start + ', var(--range-background-color)), color-stop(' + start + ', var(--range-progress-color)), color-stop(' + end  + ', var(--range-progress-color)), color-stop(' + end + ', var(--range-background-color)))';

						if (video.currentSrc && video.currentSrc.length>0) {
							label.innerHTML = decodeURIComponent(video.currentSrc.split("/").pop());
						}
					}

					if (video.videoHeight>0) {
						videowrapper.classList.remove("audiomode");
						videowrapper.classList.add("videomode");
					} else {
						videowrapper.classList.remove("videomode");
						videowrapper.classList.add("audiomode");
					}

                };

                video.addEventListener("timeupdate", updatebuffer);
                video.addEventListener("canplay", updatebuffer);
                video.addEventListener("progress", updatebuffer);
                video.addEventListener("canplaythrough", updatebuffer);

                seekbar.addEventListener("mousedown", function() {
                    seekbar.paused = video.paused;
                    video.pause();
                });

                // Play the video when the slider handle is dropped
                seekbar.addEventListener("mouseup", function() {
                    if (!seekbar.paused) {
                        video.play();
                    }
                });

                volumebar.addEventListener("input", function() {
                    video.volume = volumebar.value;     			
                });
                
                video.addEventListener('wheel', function(e) {
                    e.preventDefault();
                    var volumedelta = 0.10;
                    if (e.deltaY < 0) {
                        video.volume = Math.min(video.volume+volumedelta, 1);
                    }
                    if (e.deltaY > 0) {
                        video.volume = Math.max(video.volume-volumedelta, 0);
                    }
                    volumebar.value = video.volume;

					var volumedata = Math.round(video.volume*100) + "%";

					setosd(volumedata);
					peekosd(1000);
                });
             

                var updatevolume = function() {
                    if (video.muted || video.volume==0) {
                        mutebutton.innerHTML = "&#x1f507;";
                    } else {
                        mutebutton.innerHTML = "&#x1f50a;";
                    }
                    volumebar.style.background = '-webkit-gradient( linear, left top, right top, color-stop(' + video.volume + ', var(--range-progress-color)), color-stop(' + video.volume + ', var(--range-background-color)))';
                    
                    localStorage.setItem("videovolume", video.volume);

                }

                video.addEventListener("volumechange", updatevolume);

                volumebar.value = localStorage.getItem("videovolume", video.volume);
                video.volume = volumebar.value;

                videowrapper.addEventListener("mousemove", function() {
                    peekui(1000);
                    //seekbar.style.background = '-webkit-gradient( linear, left top, right top, color-stop(' + progress + ', var(--range-progress-color)), color-stop(' + progress + ', var(--range-background-color)))';
                });

              
              
                updatebuffer();
              
                updatevolume();

                //seekbar.style.background = '-webkit-gradient( linear, left top, right top, color-stop(' + seekbar.value / 100 + ', var(--range-progress-color)), color-stop(' + seekbar.value / 100 + ', var(--range-background-color)))';
                //volumebar.style.background = '-webkit-gradient( linear, left top, right top, color-stop(' + video.volume + ', var(--range-progress-color)), color-stop(' + video.volume + ', var(--range-background-color)))';
            }
        })(videos[i])
    }
}

var stylesheet = `
body.videobody {
    height: 100vh;
    margin: 0;
    padding: 0;
    display: flex;
}
videowrapper button {
    font-family: "Segoe UI Symbol", system-ui, sans-serif !important;
}
videowrapper label, videowrapper:before {
    font-family: system-ui, sans-serif !important;
}
videowrapper {
	--background-color: rgba(0, 0, 0, 0.5);
    --controls-color: #dcdcdc;
    --range-progress-color: #8c8c8c;
    --range-background-color: #3c3c3c;

    display: block;
    font-size: 0px;

    position: relative;
	width: auto;
    height: auto;
    background: inherit;
}
videowrapper.absolute {
    display: flex;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
}
.videobody videowrapper.absolute {
    position: relative;
}
videowrapper video.iswrapped {
    position: relative;
    max-height: 100vh;
}
videowrapper:-webkit-full-page-media {
    width: auto;
    height: auto;
}
videowrapper:-webkit-full-screen {
    width: 100%;
    height: 100%;
}
videowrapper video::-webkit-media-controls-enclosure {
  display:none !important;
}
videowrapper:-webkit-full-screen controls,
videowrapper:-webkit-full-screen header {
  z-index: 2147483647;
}

videowrapper controls > *,
videowrapper header > * {
    color: var(--controls-color);
    /* mix-blend-mode: difference; */
    background: none;
    outline: none;
    line-height: 32px;
    position: absolute;
    font-family: monospace;
}

videowrapper controls,
videowrapper header {
    overflow: hidden;
    white-space: nowrap;

	transition: all 0.5s ease !important;
    background: var(--background-color) !important;
    height: 32px !important;
    width: 100% !important;
    display: block !important;
    position: absolute !important;
    cursor: default !important;
    font-size: 18px !important;
    user-select: none;
}
videowrapper controls {
    bottom: 0px !important;
}
videowrapper header {
    top: 0px !important;
}

videowrapper controls,
videowrapper header {
	opacity: 1;
}
videowrapper.playing controls,
videowrapper.playing header {
	opacity: 0;
}
videowrapper controls:hover, videowrapper.showui controls, videowrapper.paused controls, videowrapper.audiomode controls,
videowrapper header:hover, videowrapper.showui header, videowrapper.paused header, videowrapper.audiomode header {
	opacity: 1;
}
videowrapper button, videowrapper label {
    line-height: 32px !important;
    position: absolute !important;
    bottom: 0px !important;
    background-color: none !important;
    font-size: 18px !important;
    height: 32px !important;
    border: none !important;
    margin: 0 !important;
}
videowrapper button {
    width: 32px !important;	
    padding: 0 !important;
}
videowrapper input[type=range] {
    line-height: 32px !important;
    position: absolute !important;
    background-color: var(--range-background-color) !important;

    bottom: 10px !important;
    height: 10px !important;
    border: none !important;
    margin: 0px !important;
    border-radius: 6px !important;
    -webkit-appearance: none !important;
}
videowrapper input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none !important;
    background-color: var(--controls-color);
    border: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
}

videowrapper.audiomode video:-webkit-full-page-media {
    width: 600px;
}
videowrapper:before {
    content: attr(data-osd);
    position: absolute;
    left: 50%;
    top: calc(50%);
    color: white;
	-webkit-text-stroke: 3px #333333;
    font-size: 64px;
	font-weight: bold;
    font-style: normal;
    z-index: 1;
    transform: translate(-50%, -50%);
    pointer-events: none;
	opacity: 0;
}
videowrapper.audiomode:before, 
videowrapper.showosd:before, 
videowrapper.paused:before {
	opacity: 1;
}
videowrapper label {
    right: 0;
    min-width: 100%;
    text-align: left;
    box-sizing: border-box;
	width: 100% !important;	
    padding: 0px 8px !important;
}
`;

function init() {
	if (videowrapper_init) {
		console.log("Cannot init_videowrapper twice!");
		return;
	}
	videowrapper_init = true;
	
	if (typeof GM_addStyle != "undefined") {
	  GM_addStyle (stylesheet);
	} else {
	  var css = document.createElement("style");
	  css.type = "text/css";
	  css.innerHTML = stylesheet;
	  document.head.appendChild(css);
	}

	init_videowrapper();
	if (typeof unsafeWindow != "undefined") {
	  unsafeWindow.init_videowrapper = init_videowrapper;
	}
}

init();
