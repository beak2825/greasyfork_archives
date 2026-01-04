// ==UserScript==
// @name         4chan Image Resizer
// @namespace    https://greasyfork.org/en/users/393416
// @version      2.5
// @description  Automatically downscale images based on custom presets. Features image cropping and WebP conversion. Requires 4chan X.
// @author       greenronia
// @match        *://boards.4chan.org/*
// @match        *://boards.4channel.org/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/spark-md5/3.0.0/spark-md5.js
// @require      https://unpkg.com/@daiyam/cropperjs@1.5.9-d2/dist/@daiyam/cropper.js
// @resource     cropper_css https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.9/cropper.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @icon         https://i.imgur.com/hQp5BTf.png
// @downloadURL https://update.greasyfork.org/scripts/391758/4chan%20Image%20Resizer.user.js
// @updateURL https://update.greasyfork.org/scripts/391758/4chan%20Image%20Resizer.meta.js
// ==/UserScript==
//
//Using SparkMD5 to generate image hashes - https://github.com/satazor/js-spark-md5
//Using @daiyam/Cropper.js fork to crop images - https://github.com/daiyam/cropperjs/tree/daiyam
//
//----------DEBUG MODE-------------//
var DEBUG = false;//console        //
//--------CURRENT VERSION--------//
const version = "2.5";
//-----------------------------//
if(DEBUG) console.log("[ImageResizer] Initialized");
//CSS
var cssTxt = GM_getResourceText ("cropper_css");
GM_addStyle (cssTxt);
var style = document.createElement("style");
style.innerHTML = '' +
    '.centerImg { margin: 0; position: absolute; top: 50%; left: 50%; -ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%); max-width: 100%; max-height: 100vh; height: auto; cursor: pointer; }\n' +
    '.settingsOverlay { background: rgba(0,0,0,0.8); display: none; height: 100%; left: 0; position: fixed; top: 0; width: 100%; z-index: 777; } \n' +
    '#pvOverlay { background: rgba(0,0,0,0.9); height: 100%; left: 0; position: fixed; top: 0; width: 100%; z-index: 777; text-align: center;} \n' +
    '#pvHeader { position: fixed; height: 35px; width: 100%; opacity: 0; -webkit-transition: opacity 0.5s ease-in-out;}\n' +
    '#pvHeader:hover { opacity: 0.8; -webkit-transition: none; }\n' +
    '.pvOpct { opacity: 0.7 !important; } \n' +
    '#imgResizeMenu { margin: 10% auto auto auto; width: 100%; width: 620px; padding: 2em; overflow: hidden; z-index: 8;}\n' +
    '#imgResizeMenu h3 { text-align: center; }\n' +
    '#imgResizeMenu a { cursor: pointer; }\n' +
    '#imgResizeMenu label { text-decoration-line: underline; }\n' +
    '#heplDiv summary { cursor: pointer; }\n' +
    '.settingsOverlay input[type=number], #manInput input[type=number] { -moz-appearance: textfield; text-align: right; }\n' +
    '.resizer-settings { padding-bottom: 10px }\n' +
    '#errMsg { color: red; text-align: center; }\n' +
    '#ruleTable { border-collapse: collapse; }\n' +
    '#ruleTable td, th { padding: 8px; text-align: left; border-bottom: 1pt solid; }\n' +
    '#QCTable { border-collapse: collapse; }\n' +
    '#QCTable td, th { padding: 8px; text-align: center; border-bottom: 1pt solid; }\n' +
    '#QCTable p { margin: auto; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n' +
    '#inputContainer { text-align: center; padding-top: 1em; }\n' +
    '#inputContainer button { margin-top: 20px; }\n' +
    '.menuBtns { margin-left: 1em; }\n' +
    '#sideMenu { position: absolute; display: none; padding: 5px 0px 5px 0px; width: 105px; margin-left: -110px; margin-top: -2px;}\n' +
    '#manInput { position: absolute; padding: 10px 0px 10px 0px; width: 170px; margin-left: -175px; margin-top: -2px; text-align: center;}\n' +
    '.sideMenuElement { background: inherit; display: block; cursor: pointer; padding: 2px 10px 2px 10px; text-align: left;}\n' +
    '.downscale-menu-off { display: none; }\n' +
    '.downscale-menu-on { display: block !important; }';
var styleRef = document.querySelector("script");
styleRef.parentNode.insertBefore(style, styleRef);
//Load settings
getSettings();
getPresets();
getQCList();
//local version check against current version
(function () {
    if (version.localeCompare(getSettings().version, undefined, { numeric: true, sensitivity: 'base' }) >= 1) {
        var settings = getSettings();
        settings.version = version;
        settings.convertOutput = "image/png";
        localStorage.setItem("downscale-settings", JSON.stringify(settings));
        var info = '4chan Image Resizer updated to version ' + version;
        var msgDetail = {type: 'info', content: info, lifetime: 10};
        var msgEvent = new CustomEvent('CreateNotification', {bubbles: true, detail: msgDetail});
        document.dispatchEvent(msgEvent);
    }
})();
function getSettings() {
    if (JSON.parse(localStorage.getItem("downscale-settings"))) {
        var settings = JSON.parse(localStorage.getItem("downscale-settings"));
    }
    else {
        settings = { enabled:true, notify:true, convert:true, convertOutput:"image/png", jpegQuality:0.92, shortcut:true , cropOutput:"image/png", version:"2.4"};
        localStorage.setItem("downscale-settings", JSON.stringify(settings));
    }
    return settings;
}
function getPresets() {
    if (JSON.parse(localStorage.getItem("downscale-presets"))) {
        var presets = JSON.parse(localStorage.getItem("downscale-presets"));
    }
    else {
        presets = [];
    }
    return presets;
}
function getQCList() {
    if (JSON.parse(localStorage.getItem("downscale-qclist"))) {
        var QCList = JSON.parse(localStorage.getItem("downscale-qclist"));
    }
    else {
        QCList = [];
    }
    return QCList;
}
//*************************************************************************************//
//                                   MAIN PROCESS
//*************************************************************************************//
//Checking if QuickReply dialog is open. | Do stuff only when QR box is open.
document.addEventListener('QRDialogCreation', function(listenForQRDC) {
    var checkBox = document.getElementById("imgResize");
    var sideMenu = document.getElementById("sideMenuArrow");
    //Checking if the "resize" check box and "side menu" already exist
    if (!sideMenu) {
        appendSideMenu();
    }
    if (!checkBox) {
        appendCheckBox();
    }
    //Listening for clicks on check box
    document.getElementById("imgResize").addEventListener("click", checkState);
    checkState(1);
    if(DEBUG) console.log("[QRFile] Listening...");
    //QRFile | Listening for QRFile, in response to: QRGetFile | Request File
    document.addEventListener('QRFile', function(GetFile) {
        if(DEBUG) console.log("[QRFile] File served: " + GetFile.detail);
        //Remove "Remember" option upon adding a (new) file.
        removeRemOption();
        const file = GetFile.detail;
        //Initialize an instance of a FileReader
        const reader = new FileReader();
        //Checking whether the file is JPG or PNG or WebPiss
        if (file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/webp") {
            if(DEBUG) console.log("Acceptable File type: " + file.type);
            //add <hr> to sideMenu
            var smHR = document.getElementById("sm-hr");
            if (!smHR) {
                appendHR();
            }
            //Check if resizer already completed its task (to determine priority)
			var complete = false;
			var presets = getPresets();
            var QCList = getQCList();

			reader.onload = function(f) {
				var img = new Image();
				img.src = reader.result;

				img.onload = function() {
                    //Base64 MD5 hash of an image
                    var imgMD5 = SparkMD5.hash(img.src);
                    if(DEBUG) console.log("<FILTER START>");
                    if(DEBUG) if(getSettings().convert) console.log("[WebPConverter] Enabled"); else console.log("[WebPConverter] Disabled");
                    if(DEBUG) console.log("INPUT Dimensions: " + img.width + "x" + img.height);
                    if(DEBUG) console.log("INPUT File size: " + formatBytes(file.size));
                    //THE priority list
                    if (getQCList().length > 0) checkMD5(img, imgMD5);
					if (presets.length > 0 && !complete) checkPresets(img);
					if (getSettings().convert && !complete) checkWEBP(img);
                    if (!complete) {
                        //Reset QC and Crop buttons
                        removeQCOption();
                        removeManual();
                        removeCropOption();
                        quickConvert(img, file, imgMD5);
                        manualResize(img, file);
                        crop(img);
                        //Reset preview button
                        removePreviewOption();
                        appendPreviewBtn(img.src, file.size, img.width, img.height, file.name, file.type);
                    }
					return;
				}
				return;
			}

            function checkMD5(img, imgMD5) {
                if(DEBUG) console.log("[quickConverter] Checking for a matching MD5: " + imgMD5);
                var filterCount = QCList.length;
                var matchFound = false;
                for (var i = 0; i < filterCount; i++) {
                    //unpack md5 hash
                    var filterMD5 = QCList[i].split(":").pop();
                    if (filterMD5 == imgMD5) {
                        if(DEBUG) console.log("[quickConverter] Match found.");
                        matchFound = true;
                        resizer(img.width, img.height, img);
                        break;
                    }
                }
                if(DEBUG) if (!matchFound)console.log("[quickConverter] No match found.");
                return;
            }
			function checkPresets(img) {
				var matchCount = 0;
				var rule = [];
				var presetCount = presets.length;
				for (var i = 0; i < presetCount; i++) {
					//unpack rules
					rule[i] = presets[i].split(":");
                    if(DEBUG) console.log("Looking for matching presets...");
					//check for a matching file type
					if (rule[i][0] != 0) {
						switch (parseInt(rule[i][0])) {
							case 1:
								rule[i][0] = "image/png";
								break;
							case 2:
								rule[i][0] = "image/jpeg";
						}
						if (rule[i][0] != file.type) continue;
					}
					//check for matching dimensions
					if (rule[i][1] == img.width && rule[i][2] == img.height) {
						var MAX_WIDTH = parseInt(rule[i][3]);
						var MAX_HEIGHT = parseInt(rule[i][4]);
						matchCount++;
						if(DEBUG) console.log("Preset '" + i + "' matched: " + rule[i]);
						break;
					}
				}
				//failsafe
				if (matchCount == 0 || matchCount > 1) {
					if(DEBUG) console.log("Image didn't match any presets.");
					return;
				}
                else {
                    resizer(MAX_WIDTH, MAX_HEIGHT, img);
                    return;
                }
			}
            //WEBP -> JPEG/PNG
            function checkWEBP(img) {
                if (file.type == "image/webp") {
                    var MAX_WIDTH = img.width;
                    var MAX_HEIGHT = img.height;
                    if(DEBUG) console.log("[WebPConverter] Converting WebP to: " + getSettings().convertOutput);
					resizer(MAX_WIDTH, MAX_HEIGHT, img, undefined, true);
                }
                else {
                    if(DEBUG) console.log("[WebPConverter] Image format isn't WebP.");
                    return;
                }
            }
            //The main resize function
			function resizer(MAX_WIDTH, MAX_HEIGHT, img, imgMD5, webp) {
                if(DEBUG && !imgMD5) console.log("<FILTER END>");
                removePreviewOption();
				var canvas = document.createElement("canvas");
                //Input dimensions
                var width = img.width;
                var height = img.height;
				//Calculating dimensions/aspect ratio
				if (width > height) {
					if (width > MAX_WIDTH) {
						height *= MAX_WIDTH / width;
						width = MAX_WIDTH;
					}
				} else {
					if (height > MAX_HEIGHT) {
						width *= MAX_HEIGHT / height;
						height = MAX_HEIGHT;
					}
				}
				// resize the canvas to the new dimensions
				canvas.width = width;
				canvas.height = height;
				// scale & draw the image onto the canvas
				var ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0, width, height);
				//canvas to dataURL | JPEG quality (0-1)
                var dataURL;
                if (imgMD5) dataURL = canvas.toDataURL('image/jpeg', 92);
                else if (webp && getSettings().convertOutput == 'image/png') dataURL = canvas.toDataURL('image/png');
                else dataURL = canvas.toDataURL('image/jpeg', parseFloat(getSettings().jpegQuality));
				//dataURL to blob
				var blob = dataURItoBlob(dataURL);
				//Stop classObserver | prevent trigger loop
				classObserver.disconnect();
				if(DEBUG) console.log("[classObserver] Stopping...");
				setFile(blob, img, width, height, imgMD5);
                //add crop option after conversion - v2.3.1
                var imgForCrop = new Image;
                imgForCrop.src = dataURL;
                crop(imgForCrop);
                //add preview button after conversion
                appendPreviewBtn(dataURL, blob.size, width, height, file.name, blob.type);
			}
            //Set the new file to QR form
			function setFile(blob, img, width, height, imgMD5) {
                var new_filename = constructFilename(blob.type, file.name)
				var detail = {
					file: blob,
					name: new_filename
				};
				var event = new CustomEvent('QRSetFile', {
					bubbles: true,
					detail: detail
				});
				document.dispatchEvent(event);
                if (imgMD5) rememberQC(img, file, imgMD5, blob.size);
                if(DEBUG) console.log("[QRSetFile] File Sent");
                if(DEBUG) console.log("OUTPUT Dimesnions: " + Math.round(width) + "x" + Math.round(height));
                if(DEBUG) console.log("OUTPUT Filesize: " + formatBytes(blob.size));
                if(DEBUG) console.log("OUTPUT Format: " + blob.type);
                if(DEBUG && blob.type == 'image/jpeg') console.log("JPEG Quality: " + getSettings().jpegQuality);
                //Notification
                var FSInfo = "Original size: (" + formatBytes(file.size) + ", " + img.width + "x" + img.height + ") \n New size: (" + formatBytes(blob.size)+ ", " + Math.round(width) + "x" + Math.round(height) +")";
                if (getSettings().notify) {
					var msgDetail = {type: 'info', content: FSInfo, lifetime: 5};
					var msgEvent = new CustomEvent('CreateNotification', {bubbles: true, detail: msgDetail});
					document.dispatchEvent(msgEvent);
				}
                //Remove Quick Convert option after conversion
                removeQCOption();
                removeCropOption();
                removeManual();
				//Restart classObserver
				classObserver.observe(targetNode, observerOptions);
                //Preset priority
                complete = true;
				if(DEBUG) console.log("<FINISH>\n[classObserver] Restarting...");
			}
            //Quick Convert (QC) image, from Side Menu
            function quickConvert(img, file, imgMD5) {
                //Convert options container (future use)
                var container = document.createElement("div");
                container.id = "qcDiv";
                //Convert button
                var convert = document.createElement("a");
                convert.id = "quickConvert";
                convert.classList.add("sideMenuElement");
                convert.classList.add("entry");
                convert.innerHTML = "Quick Convert";
                convert.title = "Convert image to JPEG format";
                //CSS on hover
                convert.onmouseover = function(){this.classList.toggle("focused")};
                convert.onmouseout = function(){this.classList.toggle("focused")};
                //Call resizer
                convert.addEventListener('click', function(){
                    if(DEBUG) console.log("[quickConverter] Manually calling Resizer...");
                    resizer(img.width, img.height, img, imgMD5);
                },);
                var parent = document.getElementById("sideMenu");
                parent.appendChild(container);
                container.appendChild(convert);
            }
//2.4
            //Downscale/Manually Resize image, from Side Menu
            function manualResize(img, file) {
                //Downscale options container (future use)
                var container = document.createElement("div");
                container.id = "manDiv";
                //Downscale button
                var downscale = document.createElement("a");
                downscale.id = "manualResize";
                downscale.classList.add("sideMenuElement");
                downscale.classList.add("entry");
                downscale.innerHTML = "Manual Resize";
                downscale.title = "Manually resize image";
                //CSS on hover
                downscale.onmouseover = function(){this.classList.toggle("focused")};
                downscale.onmouseout = function(){this.classList.toggle("focused")};
                //Call manualResizeInput
                downscale.addEventListener('click', function(){
                    if(DEBUG) console.log("[ManualResizer] Opened.");
                    manualResizeInput(img, file);
                },);
                var parent = document.getElementById("sideMenu");
                parent.appendChild(container);
                container.appendChild(downscale);
            }

            function manualResizeInput(img, file) {
                //Manual input box | manInput----------------------------------------------------------
                var manInput = document.createElement("div");
                manInput.id = "manInput";
                manInput.classList.add("dialog");
                var manInputRef = document.getElementById("qr");
                manInputRef.insertAdjacentElement("afterbegin", manInput);
                //input fields
                manInput.innerHTML =
                    '<input type="number" id="resWidth" title="Output Width" size="3" min="0" onfocus="this.select();"></input> x ' +
                    '' +
                    '<input type="number" id="resHeight" title="Output Height" size="3" min="0" onfocus="this.select();"></input> ' +
                    '<select id="resFormat" name="resFormat" title="Output Format" style="color: #000">' +
                    '<option id="opt1" value="image/png">PNG</option>' +
                    '<option id="opt2" value="image/jpeg">JPEG</option>' +
                    '</select>' +
                    '<div id="testContainer" style="padding-top: 10px"><button id="resTest">Test</button><span id="resFS" title="Original size: ' + formatBytes(file.size) + '" style="padding-left: 10px">' + formatBytes(file.size) + '</span></div>' +
                    '<hr id="rm-hr";><a id="resSet" style="cursor: pointer">Set File</a>';
                document.getElementById("rm-hr").style.borderColor = getHRColor();
                //populate fields
                var resWidth = document.getElementById("resWidth");
                var resHeight = document.getElementById("resHeight");
                var resFS = document.getElementById("resFS");
                var resFormat = document.getElementById("resFormat");
                var resTest = document.getElementById("resTest");
                var resSet = document.getElementById("resSet");
                resWidth.value = img.width;
                resWidth.max = img.width;
                resWidth.placeholder = img.width;
                resHeight.value = img.height;
                resHeight.max = img.height;
                resHeight.placeholder = img.height;
                resFormat.value = file.type;
                if (file.size > 4194304) resFS.style.color = "red";
                //numbers only
                resWidth.onkeypress = function() { return isNumber(event); };
                resHeight.onkeypress = function() { return isNumber(event); };
                resWidth.oninput = function() { calcResAspect("width", img.width, img.height, resWidth.value); testBlob = null; };
                resHeight.oninput = function() { calcResAspect("height", img.width, img.height, resHeight.value); testBlob = null; };
                resFormat.oninput = function() { testBlob = null; };
                //get filesize, if upscaled, set to original img dimensions (visually)
                resTest.onclick = function(){ if (resWidth.value > img.width || resHeight.value > img.height) {resWidth.value = img.width; resHeight.value = img.height; }; testFileSize(resWidth.value, resHeight.value, resFormat.value, img, resFS); }; //this is so stupid...
                //set file
                resSet.onclick = function(){
                    //check for upscales
                    if (resWidth.value > img.width || resHeight.value > img.height) {
                        alert("No upscaling. Do it yourself.");
                    }
                    else {
                        if (testBlob) {
                            if(DEBUG) console.log("[ManualResizer] testBlob found.");
                            classObserver.disconnect();
                            if(DEBUG) console.log("[classObserver] Stopping...");
                            //reset preview
                            removePreviewOption();
                            appendPreviewBtn(testDataURL, testBlob.size, resWidth.value, resHeight.value, file.name, testBlob.type);
                            setFile(testBlob, img, resWidth.value, resHeight.value);
                        }
                        else {
                            if(DEBUG) console.log("[ManualResizer] testBlob is null, calling fileSizeTester...");
                            testFileSize(resWidth.value, resHeight.value, resFormat.value, img, resFS);
                            classObserver.disconnect();
                            if(DEBUG) console.log("[classObserver] Stopping...");
                            //reset preview
                            removePreviewOption();
                            appendPreviewBtn(testDataURL, testBlob.size, resWidth.value, resHeight.value, file.name, testBlob.type);
                            setFile(testBlob, img, resWidth.value, resHeight.value);
                        }
                    }
                };
                //console.log(testResults);
                //Close the input box when clicking outside of it
                window.addEventListener('click', function closeOnClick(event) {
                    var getmanInput = document.getElementById("manInput");
                    if (!event.target.matches('#manInput') &&
                        !event.target.matches('#resWidth') &&
                        !event.target.matches('#resHeight') &&
                        !event.target.matches('#resFormat') &&
                        !event.target.matches('#opt1') &&
                        !event.target.matches('#opt2') &&
                        !event.target.matches('#resTest') &&
                        //!event.target.matches('#resSet') &&
                        !event.target.matches('#resFS') &&
                        !event.target.matches('#testContainer') &&
                        !event.target.matches('#manualResize')) {
                        getmanInput.remove();
                        if(DEBUG) console.log("[ManualResizer] Closed.");
                        window.removeEventListener('click', closeOnClick);
                    }
                });
            }
            //for storing tested blob (to avoid a meaningless conversion when setting file)
            var testBlob = null;
            var testDataURL = null;
            function testFileSize(MAX_WIDTH, MAX_HEIGHT, format, img, resFS) {
                if(DEBUG) console.log("[fileSizeTester] Starting...");
                var canvas = document.createElement("canvas");
                //Input dimensions
                var width = img.width;
                var height = img.height;
                //Calculating dimensions/aspect ratio
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                // resize the canvas to the new dimensions
                canvas.width = width;
                canvas.height = height;
                // scale & draw the image onto the canvas
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);
                //canvas to dataURL | JPEG quality (0-1)
                var dataURL;
                if (format == 'image/png') dataURL = canvas.toDataURL('image/png');
                else dataURL = canvas.toDataURL('image/jpeg', parseFloat(getSettings().jpegQuality));
                //dataURL to blob
                var blob = dataURItoBlob(dataURL);
                resFS.innerHTML = formatBytes(blob.size);
                //set new size
                if (blob.size > 4194304) {
                    if(DEBUG) console.log("[fileSizeTester] File size is over the limit: " + formatBytes(blob.size));
                    resFS.style.color = "red";
                }
                else {
                    if(DEBUG) console.log("[fileSizeTester] File size OK: " + formatBytes(blob.size));
                    resFS.style.color = "inherit";
                }
                //save test results to global var
                testBlob = blob;
                testDataURL = dataURL;
                if(DEBUG) console.log("[fileSizeTester] Done.");
            }

            //Crop Image button, from Side Menu
            function crop(img) {
                //Crop options container (future use)
                var container = document.createElement("div");
                container.id = "cropDiv";
                //Crop button
                var crop = document.createElement("a");
                crop.id = "crop";
                crop.classList.add("sideMenuElement");
                crop.classList.add("entry");
                crop.innerHTML = "Crop Image";
                //crop.title = "Crop Image";
                //CSS on hover
                crop.onmouseover = function(){this.classList.toggle("focused")};
                crop.onmouseout = function(){this.classList.toggle("focused")};
                //Call cropper
                crop.addEventListener('click', function(){
                    if(DEBUG) console.log("[cropper] Starting...");
                    cropImage(img);
                },);
                var parent = document.getElementById("sideMenu");
                parent.appendChild(container);
                container.appendChild(crop);
            }

            //Image Cropper
            function cropImage(img) {
                var overlay = document.createElement("div");
                overlay.id = "pvOverlay";
                //-----------------------------------------------
                var header = document.createElement("div");
                header.id = "pvHeader";
                header.className = "dialog";
                header.classList.add("pvOpct");
                //header.style = "line-height: 35px;"
                //Set Image button-------------------------------
                var setBtn = document.createElement("a");
                setBtn.id = "setCrop";
                setBtn.style.cursor = "pointer";
                setBtn.innerHTML = "Set Image";
                //Undo button------------------------------------
                var undoBtn = document.createElement("a");
                undoBtn.id = "undoCrop";
                undoBtn.style.cursor = "pointer";
                undoBtn.innerHTML = "Undo";
                //Close button-----------------------------------
                var closeBtn = document.createElement("a");
                closeBtn.id = "closeCrop";
                closeBtn.className = "close fa fa-times";
                closeBtn.style = "float: right; cursor: pointer; margin-right: 20px; margin-top: 7px; transform: scale(1.5);";
                closeBtn.title = "Close";
                //Cropped <img>----------------------------------
                var cropImg = document.createElement("img");
                cropImg.id = "cropImg";
                cropImg.classList.add("centerImg");
                cropImg.src = img.src;
                cropImg.title = "LMB: Set\nMMB: Close\nRMB: Undo\nShift+RMB: Context Menu";
                cropImg.oncontextmenu = function (){ return false; };
                //-----------------------------------------------
                document.body.appendChild(overlay);
                overlay.appendChild(cropImg);
                //Cropper----------------------------------------
                let cropper;
                const image = document.getElementById('cropImg');
                //Do stuff when Cropper is ready
                image.addEventListener('ready', function () {
                    //Scale image to 100%, if it's smaller than overlay/viewport (prevent initial zoom-in/stretching)
                    if (overlay.clientWidth > img.width && overlay.clientHeight > img.height) {
                        cropper.zoomTo(1);
                         if(DEBUG) console.log("[cropper] Scaling image to 100%");
                    }
                    var fired = false;
                    /*---------------Cropper KEYBINDS--------------/
                      --------------------------------------------/
                      To change keybinds edit case values below.
                      -----------------------------------------*/
                    document.body.onkeydown = function (event) {
                        var e = event || window.event;
                        if (e.target !== this || !cropper) {
                            return;
                        }
                        if (!fired) {
                            //case number = keyCode
                            switch (e.keyCode) {
                                    //Close Cropper (both keys do the same thing)
                                case 46: // Delete
                                case 27: // Escape (also closes the QR form...)
                                    e.preventDefault();
                                    cropper.destroy();
                                    overlay.remove();
                                    fired = true;
                                    break;
                                    //Clear crop selection / Undo crop
                                case 8: // Backspace
                                    e.preventDefault();
                                    if (document.getElementById('undoCrop')) {
                                        document.getElementById('undoCrop').click();
                                        fired = true;
                                    }
                                    else {
                                        cropper.clear();
                                    }
                                    break;
                                    //Crop image / Set image (both keys do the same thing)
                                case 32: // Space
                                case 13: // Enter
                                    e.preventDefault();
                                    if (document.getElementById('setCrop')) {
                                        document.getElementById('setCrop').click();
                                        fired = true;
                                    }
                                    //Do not edit beyond this point------------------------------
                                    else
                                    {
                                        //get cropped canvas
                                        var croppedCanvas = cropper.getCroppedCanvas({
                                            imageSmoothingEnabled: false,
                                            imageSmoothingQuality: 'high',
                                        });
                                        //convert canvas to blob ('image/jpeg', 1)
                                        if(DEBUG) console.log("[cropper] Output format: " + getSettings().cropOutput);

                                        var dataURL = croppedCanvas.toDataURL(getSettings().cropOutput, parseFloat(getSettings().jpegQuality));
                                        var blob = dataURItoBlob(dataURL);
                                        //get croping data (dimensions) [rounded]
                                        var cropData = cropper.getData(true);
                                        //kill cropper instance
                                        cropper.destroy();
                                        //show cropped image
                                        cropImg.src = dataURL;
                                        cropImg.addEventListener('mouseup', logMouseButton);
                                        //show header when done
                                        overlay.appendChild(header);
                                        header.appendChild(closeBtn);
                                        header.innerHTML += "Cropped Image (" + formatBytes(blob.size)+ ", " + cropData.width + "x" + cropData.height + ")<br>";
                                        header.appendChild(setBtn);
                                        header.innerHTML += " | ";
                                        header.appendChild(undoBtn);
                                        setTimeout(function() { header.classList.toggle("pvOpct"); }, 2000);
                                        document.getElementById('closeCrop').onclick = function() { cropper.destroy(); overlay.remove(); fired = true; };
                                        document.getElementById('setCrop').onclick = function() { setImage(); };
                                        document.getElementById('undoCrop').onclick = function() { overlay.remove(); cropImage(img); };
                                    }
                                    break;
                            }
                            function setImage() {
                                //Stop classObserver | prevent trigger loop
                                classObserver.disconnect();
                                fired = true;
                                if(DEBUG) console.log("[classObserver] Stopping...");
                                overlay.remove();
                                removePreviewOption();
                                //var new_filename = constructFilename(blob.type, file.name)
                                appendPreviewBtn(dataURL, blob.size, cropImg.width, cropImg.height, file.name, blob.type);
                                setFile(blob, img, cropImg.width, cropImg.height)
                            }
                            //Mouse controls
                            function logMouseButton(e) {
                                if (typeof e === 'object') {
                                    switch (e.button) {
                                        case 0:
                                            setImage();
                                            break;
                                        case 1:
                                            cropper.destroy(); overlay.remove(); fired = true;
                                            break;
                                        case 2:
                                            if (!e.shiftKey){
                                                overlay.remove(); cropImage(img);
                                            }
                                            break;
                                    }
                                }
                            }
                        }
                    }
                });
                //call Cropper with settings
                cropper = new DaiyamCropper(image, {
                    aspectRatio: NaN,
                    background: false,
                    guides: false,
                    viewMode: 1,
                    autoCrop: false,
                    scalable: false,
                });

            }

            //Remember button
            function rememberQC (img, file, imgMD5, newSize) {
                var container = document.createElement("div");
                container.id = "remDiv";
                var remember = document.createElement("a");
                remember.id = "rememberMD5";
                remember.classList.add("sideMenuElement");
                remember.classList.add("entry");
                remember.innerHTML = "Remember";
                remember.style.fontWeight = "bold";
                remember.title = "Always convert this image."
                //CSS on hover
                remember.onmouseover = function(){this.classList.toggle("focused")};
                remember.onmouseout = function(){this.classList.toggle("focused")};
                remember.onclick = function(){ saveImgMD5(img, file, imgMD5, newSize) };
                var parent = document.getElementById("sideMenu");
                parent.appendChild(container);
                container.appendChild(remember);
            }
            //Preview Image button
            function appendPreviewBtn(img, pvSize, pvWidth, pvHeight, pvName, pvMime) {
                var existCheck = document.getElementById("previewImg");
                if (!existCheck) {
                    var preview = document.createElement("a");
                    preview.id = "previewImg";
                    preview.classList.add("sideMenuElement");
                    preview.classList.add("entry");
                    preview.innerHTML = "Preview Image";
                    //CSS on hover
                    preview.onmouseover = function(){this.classList.toggle("focused")};
                    preview.onmouseout = function(){this.classList.toggle("focused")};
                    preview.onclick = function(){ showImage(img, pvSize, pvWidth, pvHeight, pvName, pvMime) };
                    var parent = document.getElementById("sideMenu");
                    parent.appendChild(preview);
                }
                else {
                    existCheck.onclick = function(){ showImage(img, pvSize, pvWidth, pvHeight, pvName, pvMime) };
                }
                return;
            }
			//Read the file
            reader.readAsDataURL(file);
        } else {
            removeHR();
            removeCropOption();
            removeQCOption();
            removePreviewOption();
            removeManual();
            if(DEBUG) console.log("[Error] Invalid FileType: " + file.type);
        }
    }, false);
    //Observing if a file was uploaded or not | checking if div (with id: "file-n-submit") has class named: "has-file"
    function callback(mutationList, observer) {
        if (document.getElementById("file-n-submit").classList.contains("has-file") === true && checkState(2) === true) {
            if(DEBUG) console.log("<START>\n[classObserver] File detected.")
            //QRGetFile | Request File
            if(DEBUG) console.log("[QRGetFile] Requesting file...");
            document.dispatchEvent(new CustomEvent('QRGetFile'));

        } else if (checkState(2) === false) {
            if(DEBUG) console.log("[classObserver] ImageResizer is disabled");
            return;
        }
        else {
            //Remove Side menu options upon removing a file.
            removeHR();
            removeCropOption();
            removeQCOption();
            removeRemOption();
            removePreviewOption();
            removeManual();
            if(DEBUG) console.log("[classObserver] No file");
        }
    }
    //MutationObserver. Checks if div (with id "file-n-submit") has its class attribute changed
    const targetNode = document.getElementById("file-n-submit");
    var observerOptions = {
        attributes: true
    };
    var classObserver = new MutationObserver(callback);
    if(DEBUG) console.log("[classObserver] Starting...");
    classObserver.observe(targetNode, observerOptions);
}, false);
//*************************************************************************************//
//                              END OF THE MAIN PROCESS
//*************************************************************************************//
//Add a label with a check box for ImageResize + Setting button in Side Menu
function appendCheckBox() {
    var settingsButton = document.createElement("a");
    var label = document.createElement("label");
    var input = document.createElement("input");
    input.type = "checkbox";
    input.id = "imgResize";
    label.id = "imgResizeLabel";
    input.title = "Enable Image Resizer";
    input.style = "margin-left: 0";
    settingsButton.classList.add("sideMenuElement");
    settingsButton.classList.add("entry");
    label.classList.add("sideMenuElement");
    //CSS on hover
    label.classList.add("entry");
    var parent = document.getElementById("sideMenu");
    parent.appendChild(label);
    label.appendChild(input);
    label.title = "Enable Image Resizer";
    label.innerHTML += " Enabled";
    settingsButton.title = "Image Resizer Settings";
    settingsButton.innerHTML = "Settings";
    parent.appendChild(settingsButton);
    //CSS on hover
    label.onmouseover = function(){this.classList.toggle("focused")};
    label.onmouseout = function(){this.classList.toggle("focused")};
    settingsButton.onmouseover = function(){this.classList.toggle("focused")};
    settingsButton.onmouseout = function(){this.classList.toggle("focused")};
    //Open settings menu
    settingsButton.onclick = function(){ document.getElementById("imgResizeOverlay").style.display = "block" };
    //Checked by default
    document.getElementById("imgResize").checked = getSettings().enabled;
}
//Check box state
function checkState(caller) {
    var state = document.getElementById("imgResize").checked;
    if (state === true) {
        if (caller != 2) if(DEBUG) console.log("[ImageResizer] Enabled");
        return true;
    } else {
        if (caller != 2) if(DEBUG) console.log("[ImageResizer] Disabled");
        //remove side menu options upon disabling ImageResizer
       removeHR(); removeCropOption(); removeQCOption(); removeRemOption(); removePreviewOption(); removeManual();
        return false;
    }
}
//Clears error messages <p>
function clearErr() { document.getElementById("errMsg").innerHTML = ""; }
//Checks for any logic errors (upscaling)
function basicCheck(edit, rulePos) {
    var inWidth = parseInt(document.getElementById("inWidth").value);
    var inHeight = parseInt(document.getElementById("inHeight").value);
    var outWidth = parseInt(document.getElementById("outWidth").value);
    var outHeight = parseInt(document.getElementById("outHeight").value);
    var imgType = parseInt(document.getElementById("imgType").value);
    if (outWidth <= 0 || outHeight <= 0) { document.getElementById("errMsg").innerHTML = "Invalid output dimensions"; return}
    else if (inWidth < outWidth || inHeight < outHeight) { document.getElementById("errMsg").innerHTML = "Cannot upscale images"; return}
    else finalCheck(edit, imgType, inWidth, inHeight, outWidth, outHeight, rulePos);
    return;
}
//Checks for any rule overlaps
// ([0] - Image type, [1] - Input width, [2] - Input height, [3] - Output width, [4] - Output height)
function finalCheck(edit, imgType, inWidth, inHeight, outWidth, outHeight, rulePos) {
    var e = document.getElementById("imgType");
    var format = e.options[e.selectedIndex].text;
    var presetString = imgType + ":" + inWidth + ":" + inHeight + ":" + outWidth + ":" + outHeight;
    var presets = getPresets();
    if (presets.length > 0) {
        var rule = [];
        var presetCount = presets.length;
        for (var i = 0; i < presetCount; i++) {
            if (edit && i === rulePos) continue;
            rule[i] = presets[i].split(":");
            if (presetString == presets[i]) { document.getElementById("errMsg").innerHTML = "Exact preset already exists"; return }
            else if ((inWidth == rule[i][1] && inHeight == rule[i][2]) && (imgType == rule[i][0] || rule[i][0] == 0)) { document.getElementById("errMsg").innerHTML = "Preset with the same input dimensions for " + format + " format already exists"; return }
        }
    }
    //save preset
    clearErr();
    if (edit) presets[rulePos] = presetString;
    else presets.push(presetString);
    localStorage.setItem("downscale-presets", JSON.stringify(presets));
    //rebuild list
    document.getElementById("ruleTable").tBodies.item(0).innerHTML = "";
    printList();
    //hide / display
    document.getElementById("ruleInput").remove();
    document.getElementById("addRule").style.display = "inline";
    return;
}
//Check if possible to calculate output WIDTH
function aspectCheckH() {
    var inWidth = document.getElementById("inWidth").value;
    var inHeight = document.getElementById("inHeight").value;
    var outWidth = document.getElementById("outWidth").value;
    var outHeight = document.getElementById("outHeight").value;
    if (outHeight > 0) {
        if (parseInt(inHeight) >= parseInt(outHeight)) {
            calcAspect("width", inWidth, inHeight, outHeight);
            clearErr();
        }
        else {
            document.getElementById("errMsg").innerHTML = "Cannot upscale images";
        }
    }
}
//Check if possible to calculate output HEIGHT
function aspectCheckW() {
    var inWidth = document.getElementById("inWidth").value;
    var inHeight = document.getElementById("inHeight").value;
    var outWidth = document.getElementById("outWidth").value;
    var outHeight = document.getElementById("outHeight").value;
    if (outWidth > 0) {
        if (parseInt(inWidth) >= parseInt(outWidth)) {
            calcAspect("height", inWidth, inHeight, outWidth);
            clearErr();
        }
        else {
            document.getElementById("errMsg").innerHTML = "Cannot upscale images";
        }
    }
}
//Aspect ratio calculation (finds the other output dimension based on given exact input dimensions)
function calcAspect(dimension, w, h, output) {
    if (dimension == "width") {
        var width = output / h * w;
        document.getElementById("outWidth").value = Math.round(width);
    }
    if (dimension == "height") {
        var height = output / w * h;
        document.getElementById("outHeight").value = Math.round(height);
    }
}
//Aspect ratio calculation for Manual Resize (finds the other output dimension based on given exact input dimensions)
function calcResAspect(dimension, w, h, output) {
    if (dimension == "width") {
        var width = h / w * output;
        document.getElementById("resHeight").value = Math.round(width);
    }
    if (dimension == "height") {
        var height = w / h * output;
        document.getElementById("resWidth").value = Math.round(height);
    }
}
//Populate Presets list
function printList() {
    var presets = getPresets();
    var list = document.getElementById("imgResizeList");
    var table = document.getElementById("ruleTable");
    if (presets.length > 0) {
        var rule = [];
        var presetCount = presets.length;
        for (let i = 0; i < presetCount; i++) {
            rule[i] = presets[i].split(":");
            switch (parseInt(rule[i][0])) {
                case 0:
                    rule[i][0] = "PNG/JPEG";
                    break;
                case 1:
                    rule[i][0] = "PNG";
                    break;
                case 2:
                    rule[i][0] = "JPEG";
            }
            let delRow = document.createElement("a");
            let editRow = document.createElement("a");
            delRow.innerHTML = "delete";
            editRow.innerHTML = "edit";
            //delete a rule and rebuild the list
            delRow.onclick = function() {
                if (document.getElementById("inputContainer")) document.getElementById("inputContainer").innerHTML = "";
                presets.splice(delRow.parentElement.parentElement.sectionRowIndex, 1);
                localStorage.setItem("downscale-presets", JSON.stringify(presets));
                table.tBodies.item(0).innerHTML = "";
                printList();
                clearErr();
                document.getElementById("addRule").style.display = "inline";
            };
            editRow.onclick = function() { inputUI(true, rule[i], i); clearErr(); };
            //Array contents: [0] - Image type, [1] - Input width, [2] - Input height, [3] - Output width, [4] - Output height
            var row = table.tBodies.item(0).insertRow(-1);
            row.insertCell(0).innerHTML = rule[i][0];
            row.insertCell(1).innerHTML = '[ ' + rule[i][1] + ' x ' + rule[i][2] + ' ]';
            row.insertCell(2).innerHTML = '&#8594;';
            row.insertCell(3).innerHTML = '[ ' + rule[i][3] + ' x ' + rule[i][4] + ' ]';
            row.insertCell(4).appendChild(editRow);
            row.insertCell(5).appendChild(delRow);
        }
    }
}
//Input field
function inputUI(edit, rule, rulePos) {
    if (document.getElementById("inputContainer")) document.getElementById("inputContainer").innerHTML = "";
    document.getElementById("addRule").style.display = "none";
    var inputDiv = document.getElementById("inputContainer");
    var input = document.createElement("div");
    var discardRuleBtn = document.createElement("button");
    discardRuleBtn.innerHTML = "Cancel";
    discardRuleBtn.style.margin = "auto 0 0 10px";
    var saveRuleBtn = document.createElement("button");
    saveRuleBtn.innerHTML = "Save";
    input.id = "ruleInput";
    //Rules form
    input.innerHTML = '' +
        '' +
        '<select id="imgType" name="imgType" title="Input Format">' +
        '<option value="0">PNG/JPEG</option>' +
        '<option value="1">PNG</option>' +
        '<option value="2">JPEG</option>' +
        '</select>&ensp;' +
        '' +
        '<input type="number" id="inWidth" title="Input Width" size="3" min="0" value="0" onfocus="this.select();"></input> x ' +
        '' +
        '<input type="number" id="inHeight" title="Input Height" size="3" min="0" value="0" onfocus="this.select();"></input> ' +
        '&ensp; &#8594; &ensp; <input type="number" id="outWidth" title="Output Width" size="3" min="0" value="0" onfocus="this.select();"></input> x ' +
        '<input type="number" id="outHeight" title="Output Height" size="3" min="0" value="0" onfocus="this.select();"></input><br>';
    inputDiv.appendChild(input);
    var inWidth = document.getElementById("inWidth");
    var inHeight = document.getElementById("inHeight");
    var outWidth = document.getElementById("outWidth");
    var outHeight = document.getElementById("outHeight");
    if (edit) {
        switch (rule[0]) {
            case "PNG/JPEG":
                document.getElementById("imgType").selectedIndex = 0;
                break;
            case "PNG":
                document.getElementById("imgType").selectedIndex = 1;
                break;
            case "JPEG":
                document.getElementById("imgType").selectedIndex = 2;
        }
        inWidth.value = rule[1];
        inHeight.value = rule[2];
        outWidth.value = rule[3];
        outHeight.value = rule[4];
    }
    //Listen for user input on target dimension input fields to automatically calculate aspect ratio
    outWidth.addEventListener("input", aspectCheckW);
    outHeight.addEventListener("input", aspectCheckH);
    inWidth.onkeypress = function() { outHeight.value = 0; outWidth.value = 0; return isNumber(event); };
    inHeight.onkeypress = function() { outHeight.value = 0; outWidth.value = 0; return isNumber(event); };
    outWidth.onkeypress = function() { return isNumber(event); };
    outHeight.onkeypress = function() { return isNumber(event); };

    input.appendChild(saveRuleBtn);
    input.appendChild(discardRuleBtn);
    discardRuleBtn.onclick = function(){ document.getElementById(input.id).remove(); document.getElementById("addRule").style.display = "inline"; clearErr();};
    saveRuleBtn.onclick = function() { if (edit) basicCheck(true, rulePos); else basicCheck(false); };
}
//Populate Quick Convert List table
function printQCList() {
    var QCList = getQCList();
    var list = document.getElementById("QCList");
    var table = document.getElementById("QCTable");
    var filterCount = QCList.length;
    if (filterCount > 0) {
        var QCFilter = [];
        for (let i = 0; i < filterCount; i++) {
            QCFilter[i] = QCList[i].split(":");
            let delRow = document.createElement("a");
            delRow.innerHTML = "delete";
            delRow.onclick = function() {
                QCList.splice(delRow.parentElement.parentElement.sectionRowIndex, 1);
                localStorage.setItem("downscale-qclist", JSON.stringify(QCList));
                table.tBodies.item(0).innerHTML = "";
                printQCList();
            };
            //QCList Array: [0] - Filetype, [1] - Image Width, [2] - Image Height, [3] - Original Filesize, [4] - New Filesize, [5] - Filename, [6] - Image Base64 MD5 Hash
            var row = table.tBodies.item(0).insertRow(-1);
            row.insertCell(0).innerHTML = QCFilter[i][0];
            row.insertCell(1).innerHTML = '[ ' + QCFilter[i][1] + ' x ' + QCFilter[i][2] + ' ]';
            row.insertCell(2).innerHTML = QCFilter[i][3];
            row.insertCell(3).innerHTML = '&#8594;';
            row.insertCell(4).innerHTML = QCFilter[i][4];
            row.insertCell(5).innerHTML = '<p title = "' + QCFilter[i][5] +'">' + QCFilter[i][5] + '</p>';
            row.insertCell(6).appendChild(delRow);
        }
    }
}
//*************************************************************************************//
//                                    MENUS                                            //
//*************************************************************************************//
function appendSettings() {
    //Button--------------------------------------------------------
    var span = document.createElement("span");
    var button = document.createElement("a");
    button.id = "imgResizeSettings";
    button.className += "fa fa-cog";
    button.style = "cursor: pointer;";
    button.title = "Image Resizer Settings";
    var ref = document.getElementById('shortcut-settings');
    ref.insertBefore(span, parent.nextSibling);
    span.appendChild(button);
    //Overlay | imgResizeOverlay------------------------------------
    var overlay = document.createElement("div");
    overlay.id = "imgResizeOverlay";
    overlay.classList.add("settingsOverlay");
    document.body.appendChild(overlay);
    //Settings menu links | imgResizeMenu---------------------------
    var menu = document.createElement("div");
    menu.id = "imgResizeMenu";
    menu.classList.add("dialog");
    overlay.appendChild(menu);
    var close = document.createElement("a");
    close.className += "close fa fa-times";
    close.style = "float: right;";
    close.title = "Close";
    menu.insertAdjacentElement('afterbegin', close);
    //Settings
    var settingsBtn = document.createElement("a");
    settingsBtn.innerHTML += "Settings";
    settingsBtn.classList.add("menuBtns");
    settingsBtn.style = "font-weight: bold;";
    settingsBtn.onclick = function() {
        settingsDiv.className = "downscale-menu-on";
        presetsDiv.className = "downscale-menu-off";
        QCListDiv.className = "downscale-menu-off";
        helpDiv.className = "downscale-menu-off";
        settingsBtn.style = "font-weight: bold;";
        presetsBtn.style = "";
        QCListBtn.style = "";
        helpBtn.style = "";
    };
    menu.appendChild(settingsBtn);
    //Presets
    var presetsBtn = document.createElement("a");
    presetsBtn.innerHTML += "Presets";
    presetsBtn.classList.add("menuBtns");
    presetsBtn.onclick = function() {
        settingsDiv.className = "downscale-menu-off";
        presetsDiv.className = "downscale-menu-on";
        QCListDiv.className = "downscale-menu-off";
        helpDiv.className = "downscale-menu-off";
        settingsBtn.style = "";
        presetsBtn.style = "font-weight: bold;";
        QCListBtn.style = "";
        helpBtn.style = "";
    };
    menu.appendChild(presetsBtn);
    //Quick Convert List
    var QCListBtn = document.createElement("a");
    QCListBtn.innerHTML += "Quick Convert";
    QCListBtn.classList.add("menuBtns");
    QCListBtn.onclick = function() {
        settingsDiv.className = "downscale-menu-off";
        presetsDiv.className = "downscale-menu-off";
        QCListDiv.className = "downscale-menu-on";
        helpDiv.className = "downscale-menu-off";
        settingsBtn.style = "";
        presetsBtn.style = "";
        QCListBtn.style = "font-weight: bold;";
        helpBtn.style = "";
    };
    menu.appendChild(QCListBtn);
    //Help
    var helpBtn = document.createElement("a");
    helpBtn.innerHTML += "About";
    helpBtn.classList.add("menuBtns");
    helpBtn.onclick = function() {
        settingsDiv.className = "downscale-menu-off";
        presetsDiv.className = "downscale-menu-off";
        QCListDiv.className = "downscale-menu-off";
        helpDiv.className = "downscale-menu-on";
        settingsBtn.style = "";
        presetsBtn.style = "";
        QCListBtn.style = "";
        helpBtn.style = "font-weight: bold;";
    };
    menu.appendChild(helpBtn);
    var hr = document.createElement("hr");
    hr.style.borderColor = getHRColor();
    menu.appendChild(hr);
    //Content divs| imgResizeContent---------------------------------
    var content = document.createElement("div");
    content.id = "imgResizeContent";
    menu.appendChild(content);
    content.innerHTML = "";
    var errMsg = document.createElement("p");
    errMsg.id = "errMsg";
    //Settings
    var settingsDiv = document.createElement("div");
    settingsDiv.id = "settingsDiv";
    settingsDiv.classList.add("downscale-menu-on");
    content.appendChild(settingsDiv);
    //Presets
    var presetsDiv = document.createElement("div");
    presetsDiv.id = "presetsDiv";
    presetsDiv.classList.add("downscale-menu-off");
    presetsDiv.style.textAlign = "center";
    content.appendChild(presetsDiv);
    //Quick Convert List
    var QCListDiv = document.createElement("div");
    QCListDiv.id = "QCListDiv";
    QCListDiv.classList.add("downscale-menu-off");
    content.appendChild(QCListDiv);
    //Help
    var helpDiv = document.createElement("div");
    helpDiv.id = "heplDiv";
    helpDiv.classList.add("downscale-menu-off");
    content.appendChild(helpDiv);
    //--------------------------------------------------------------
    var title = document.createElement("h3");
    title.innerHTML = "Image Resizer Settings";
    settingsDiv.appendChild(title);
    //Enable Resizer------------------------------------------------
    var enableDiv = document.createElement("div");
    enableDiv.classList.add("resizer-settings");
    enableDiv.innerHTML = '' +
        '<input type="checkbox" id="enableSet" title="" size="1"></input>' +
        '<label for="enableSet">Enable Resizer</label>:&ensp;' +
        'Enable 4chan Image Resizer by default.';
    settingsDiv.appendChild(enableDiv);
    var enableSet = document.getElementById("enableSet");
    enableSet.checked = getSettings().enabled;
    enableSet.oninput = function() {
        //remove side menu options upon disabling ImageResizer
        if (!enableSet.checked) { removeCropOption(); removeQCOption(); removeRemOption(); removePreviewOption(); }
        var settings = getSettings();
        settings.enabled = enableSet.checked;
        document.getElementById("imgResize").checked = enableSet.checked;
        localStorage.setItem("downscale-settings", JSON.stringify(settings));
    };
    //Enable Shortcut-----------------------------------------------
    var shortcutDiv = document.createElement("div");
    shortcutDiv.classList.add("resizer-settings");
    shortcutDiv.innerHTML = '' +
        '<input type="checkbox" id="shortcutSet" title="" size="1"></input>' +
        '<label for="shortcutSet">Enable Shortcut</label>:&ensp;' +
        'Enable "Quick Convert" shortcut. <kbd>Ctrl</kbd> + <kbd>Q</kbd> by default.';
    settingsDiv.appendChild(shortcutDiv);
    var shortcutSet = document.getElementById("shortcutSet");
    shortcutSet.checked = getSettings().shortcut;
    shortcutSet.oninput = function() {
        var settings = getSettings();
        settings.shortcut = shortcutSet.checked;
        localStorage.setItem("downscale-settings", JSON.stringify(settings));
    };
    //Display notifications-----------------------------------------
    var notifySetDiv = document.createElement("div");
    notifySetDiv.classList.add("resizer-settings");
    notifySetDiv.innerHTML = '' +
        '<input type="checkbox" id="displaySet" title="" size="1"></input>' +
        '<label for="displaySet">Display Notifications</label>:&ensp;' +
        'Display a notification when an image is downscaled.';
    settingsDiv.appendChild(notifySetDiv);
    var notifySet = document.getElementById('displaySet');
    notifySet.checked = getSettings().notify;
    notifySet.oninput = function() {
        var settings = getSettings();
        settings.notify = notifySet.checked;
        localStorage.setItem("downscale-settings", JSON.stringify(settings));
    };
    //Convert WebP-------------------------------------
    var convertSetDiv = document.createElement("div");
    convertSetDiv.classList.add("resizer-settings");
    convertSetDiv.innerHTML = '' +
        '<input type="checkbox" id="convertSet" title="" size="1"></input>' +
        '<label for="convertSet">Convert WebP to </label>' +
        '<select id="convertOut" name="cropOut">' +
        '<option value="image/png">PNG</option>' +
        '<option value="image/jpeg">JPEG</option>' +
        '</select>:&ensp;' +
        'Automatically convert WebP images to selected format.';
    settingsDiv.appendChild(convertSetDiv);
    var convertSet = document.getElementById('convertSet');
    convertSet.checked = getSettings().convert;
    var convertOutSet = document.getElementById('convertOut');
    convertOutSet.value = getSettings().convertOutput;
    //very lazy copy...
    convertSet.oninput = function() {
        var settings = getSettings();
        settings.convert = convertSet.checked;
        settings.convertOutput = convertOutSet.value;
        localStorage.setItem("downscale-settings", JSON.stringify(settings));
    };
    //...paste
    convertOutSet.oninput = function() {
        var settings = getSettings();
        settings.convert = convertSet.checked;
        settings.convertOutput = convertOutSet.value;
        localStorage.setItem("downscale-settings", JSON.stringify(settings));
    };
    //Set JPEG quality----------------------------------------------
    //RegExp ^$|^[1-9][0-9]?$|^100$
    //Only numbers between 1 and 100, including an empty string (that is not written in storage)
    //JPEG quality value is still stored as a decimal number.
    var qualitySetDiv = document.createElement("div");
    qualitySetDiv.classList.add("resizer-settings");
    qualitySetDiv.innerHTML = '' +
        '<input type="text" id="imgQuality" title="JPEG Quality" size="2"></input>' +
        '<label for="imgQuality">JPEG Quality</label>:&ensp;' +
        'A number between 1 and 100 indicating the output image quality.';
    settingsDiv.appendChild(qualitySetDiv);
    var inputField = document.getElementById('imgQuality');
    inputField.value = getSettings().jpegQuality * 100;
    //Check input field validity and store correct value
    inputField.oninput = function() {
        var inputField = document.getElementById('imgQuality');
        var r = new RegExp(/^$|^[1-9][0-9]?$|^100$/);
        if(r.test(inputField.value) && inputField.value != "") {
            inputField.setCustomValidity("");
            var settings = getSettings();
            settings.jpegQuality = inputField.value / 100;
            localStorage.setItem("downscale-settings", JSON.stringify(settings));
        }
        else if (inputField.value == ""){
            inputField.setCustomValidity("Input a number between 1 and 100.\nCurrent set value: " + getSettings().jpegQuality * 100);
            inputField.reportValidity();
        }
        else {
            inputField.setCustomValidity("Input a number between 1 and 100.\nCurrent set value: " + getSettings().jpegQuality * 100);
            inputField.reportValidity();
            inputField.value = getSettings().jpegQuality * 100;
        }
    };
    //Cropper Settings-----------------------------------------------
    /* For future use
    var title2 = document.createElement("h3");
    title2.innerHTML = "Image Cropper Settings";
    settingsDiv.appendChild(title2);
    */
    //Crop output format---------------------------------------------
    var cropOutDiv = document.createElement("div");
    cropOutDiv.classList.add("resizer-settings");
    cropOutDiv.innerHTML = '' +
        '<select id="cropOut" name="cropOut">' +
        '<option value="image/png">PNG</option>' +
        '<option value="image/jpeg">JPEG</option>' +
        '</select>&ensp;' +
        '<label for="cropOut">Crop Output</label>:&ensp;' +
        'Set the desired output format for cropped images.';
    settingsDiv.appendChild(cropOutDiv);
    var cropOutSet = document.getElementById('cropOut');
    cropOutSet.value = getSettings().cropOutput;
    cropOutSet.oninput = function() {
        var settings = getSettings();
        settings.cropOutput = cropOutSet.value;
        localStorage.setItem("downscale-settings", JSON.stringify(settings));
    };
    //Preset table | ruleTable----------------------------------------
    var tableWrapper = document.createElement("div");
    tableWrapper.style.overflowY = "auto";
    tableWrapper.style.maxHeight = "220px";
    var table = document.createElement("table");
    var thead = document.createElement("thead");
    var tbody = document.createElement("tbody");
    var presetsTitle = document.createElement("h3");
    presetsTitle.innerHTML = "Presets";
    presetsDiv.appendChild(presetsTitle);
    table.appendChild(thead);
    table.appendChild(tbody);
    table.id = "ruleTable";
    var row = thead.insertRow(0);
    row.insertCell(0).outerHTML = "<th>Format</th>";
    row.insertCell(1).outerHTML = "<th>Input</th>";
    row.insertCell(2).outerHTML = "<th></th>";
    row.insertCell(3).outerHTML = "<th>Output</th>";
    row.insertCell(4).outerHTML = "<th></th>";
    row.insertCell(5).outerHTML = "<th></th>";
    presetsDiv.appendChild(tableWrapper);
    tableWrapper.appendChild(table);
    //Input container | inputContainer------------------------------
    var inputDiv = document.createElement("div");
    inputDiv.id = "inputContainer";
    presetsDiv.appendChild(inputDiv);
    var addRuleBtn = document.createElement("button");
    addRuleBtn.id = "addRule";
    addRuleBtn.innerHTML = "New Preset";
    printList();
    presetsDiv.appendChild(addRuleBtn);
    presetsDiv.appendChild(errMsg);
    button.onclick = function(){ overlay.style.display = "block"; };
    close.onclick = function(){ overlay.style.display = "none"; };
    window.addEventListener('click', function(closeSettingsMenu) {
        if (closeSettingsMenu.target == overlay) overlay.style.display = "none";
    });
    addRuleBtn.onclick = function(){ inputUI(false); };
    //import/export buttons
    var bottomPresets = document.createElement("div");
    bottomPresets.style = "float: left;";
    var separator1 = document.createElement("span");
    separator1.innerHTML = " | ";
    var importPresets = document.createElement("a");
    var exportPresets = document.createElement("a");
    importPresets.innerHTML = "Import";
    exportPresets.innerHTML = "Export";
    importPresets.classList.add("menuBtns");
    bottomPresets.innerHTML += '<input id="importPresetsFile-input" type="file" accept=".json" style="display: none;" />'; //file-input
    importPresets.onclick = function(){
        document.getElementById('importPresetsFile-input').click();
    };
    exportPresets.onclick = function(){ downloadObjectAsJson(getPresets(), "4chan Image Resizer v" + version + " Presets List - " + Date.now()); }; //call file exporter
    bottomPresets.appendChild(importPresets);
    bottomPresets.appendChild(separator1);
    bottomPresets.appendChild(exportPresets);
    presetsDiv.appendChild(bottomPresets);
    //import
    document.getElementById('importPresetsFile-input').addEventListener('change', function() {
        var jsonPresetsFile = new FileReader();
        jsonPresetsFile.onload = function() {
            var originalPresets = getPresets();
            var duplicateCount1 = 0;
            var tempDuplicateCount1 = 0;
            //parse raw text
            var importedPresets = JSON.parse(jsonPresetsFile.result);
            //check if array
            if (Array.isArray(importedPresets)) {
                for (let i = 0; i < importedPresets.length; i++) {
                    var line1 = importedPresets[i].split(':');
                    if (line1.length != 5) {
                        if(DEBUG) console.log("[Error] Imported array does not match the required length (5)");
                        if(DEBUG) console.log(line1);
                        alert("Error: Array length mismatch.\nThis file is either outdated or invalid.");
                        return;
                    }
                    else {
                        //check for duplicate entries
                        for (let j = 0; j < originalPresets.length; j++) {
                            var tempLine = line1[0] + ":" + line1[1] + ":" + line1[2] + ":" + line1[3] + ":" + line1[4];
                            if (tempLine == originalPresets[j]) {
                                tempDuplicateCount1++;
                                break;
                            }
                        }
                        //if not a dupe, push to the original array
                        if (tempDuplicateCount1 == 0) {
                            originalPresets.push(importedPresets[i]);
                        }
                        //count all duplicate entries
                        else {
                            duplicateCount1 += tempDuplicateCount1;
                            tempDuplicateCount1 = 0;
                        }
                    }
                }
                //add the final result to local storage
                localStorage.setItem("downscale-presets", JSON.stringify(originalPresets));
                //rebuild list
                document.getElementById("ruleTable").tBodies.item(0).innerHTML = "";
                printList();
                var newEntries1 = importedPresets.length - duplicateCount1;
                alert("Succesfully imported " + importedPresets.length + " entries.\nDuplicate entries skipped: " + duplicateCount1 + "\nNew entries added: " + newEntries1);
            }
            else {
                alert("Error: Invalid data type.");
                if(DEBUG) console.log("[Error] Imported data object is not an array.")
            }
        }
        jsonPresetsFile.readAsText(this.files[0]);
    });
    //Quick Convert table | QCTable----------------------------------
    var QCTableWrapper = document.createElement("div");
    QCTableWrapper.style.overflowY = "auto";
    QCTableWrapper.style.maxHeight = "220px";
    var QCTable = document.createElement("table");
    var QCThead = document.createElement("thead");
    var QCTbody = document.createElement("tbody");
    var QCTitle = document.createElement("h3");
    QCTitle.innerHTML = "Quick Convert List";
    QCListDiv.appendChild(QCTitle);
    QCListDiv.innerHTML += "<p style='text-align: center;'>Images on this list will be automatically converted to JPEG with a quality setting of 92.</p>";
    QCTable.appendChild(QCThead);
    QCTable.appendChild(QCTbody);
    QCTable.id = "QCTable";
    var QCRow = QCThead.insertRow(0);
    QCRow.insertCell(0).outerHTML = "<th>Format</th>";
    QCRow.insertCell(1).outerHTML = "<th>Dimensions</th>";
    QCRow.insertCell(2).outerHTML = "<th>Original Size</th>";
    QCRow.insertCell(3).outerHTML = "<th></th>";
    QCRow.insertCell(4).outerHTML = "<th>New Size</th>";
    QCRow.insertCell(5).outerHTML = "<th>Filename</th>";
    QCRow.insertCell(6).outerHTML = "<th></th>";
    QCListDiv.appendChild(QCTableWrapper);
    QCTableWrapper.appendChild(QCTable);
    //import/export buttons
    var bottomQCL = document.createElement("div");
    bottomQCL.style = "padding-top: 1em;";
    var separator2 = document.createElement("span");
    separator2.innerHTML = " | ";
    var importQCList = document.createElement("a");
    var exportQCList = document.createElement("a");
    importQCList.innerHTML = "Import";
    exportQCList.innerHTML = "Export";
    importQCList.classList.add("menuBtns");
    bottomQCL.innerHTML += '<input id="importQCLFile-input" type="file" accept=".json" style="display: none;" />'; //file-input
    importQCList.onclick = function(){
        document.getElementById('importQCLFile-input').click();
    };
    exportQCList.onclick = function(){ downloadObjectAsJson(getQCList(), "4chan Image Resizer v" + version + " Quick Convert List - " + Date.now()); }; //call file exporter
    bottomQCL.appendChild(importQCList);
    bottomQCL.appendChild(separator2);
    bottomQCL.appendChild(exportQCList);
    QCListDiv.appendChild(bottomQCL);
    //import
    document.getElementById('importQCLFile-input').addEventListener('change', function() {
        var jsonFile = new FileReader();
        jsonFile.onload = function() {
            var originalQCL = getQCList();
            var duplicateCount2 = 0;
            var tempDuplicateCount2 = 0;
            //parse raw text
            var importedQCL = JSON.parse(jsonFile.result);
            //check if array
            if (Array.isArray(importedQCL)) {
                for (let i = 0; i < importedQCL.length; i++) {
                    var line = importedQCL[i].split(':');
                    if (line.length != 7 || line[6].length != 32) {
                        if(DEBUG) console.log("[Error] Imported array does not match the required length (7) or contains an invalid MD5 hash.");
                        if(DEBUG) console.log(line);
                        alert("Error: Array length mismatch.\nThis file is either outdated or invalid.");
                        return;
                    }
                    else {
                        //check for duplicate MD5 hashes
                        for (let j = 0; j < originalQCL.length; j++) {
                            var originalLine2 = originalQCL[j].split(':');
                            if (line[6] == originalLine2[6]) {
                                tempDuplicateCount2++;
                                break;
                            }
                        }
                        //if not a dupe, push to the original array
                        if (tempDuplicateCount2 == 0) {
                            originalQCL.push(importedQCL[i]);
                        }
                        //count all duplicate entries
                        else {
                            duplicateCount2 += tempDuplicateCount2;
                            tempDuplicateCount2 = 0;
                        }
                    }
                }
                //add the final result to local storage
                localStorage.setItem("downscale-qclist", JSON.stringify(originalQCL));
                //rebuild list
                document.getElementById("QCTable").tBodies.item(0).innerHTML = "";
                printQCList();
                var newEntries2 = importedQCL.length - duplicateCount2;
                alert("Succesfully imported " + importedQCL.length + " entries.\nDuplicate entries skipped: " + duplicateCount2 + "\nNew entries added: " + newEntries2);
            }
            else {
                alert("Error: Invalid data type.");
                if(DEBUG) console.log("[Error] Imported data object is not an array.")
            }
        }
        jsonFile.readAsText(this.files[0]);
    });
    //delete all QCL entries
    var delAll = document.createElement("a");
    var emptyArray = [];
    delAll.innerHTML = "Delete All";
    delAll.style = "float: right; margin-right: 1em;";
    delAll.onclick = function(){
        if (confirm("WARNING!\nAre you sure you want to DELETE ALL entries from the \"Quick Convert List\"?")) {
            localStorage.setItem("downscale-qclist", JSON.stringify(emptyArray));
            document.getElementById("QCTable").tBodies.item(0).innerHTML = "";
        }
    };
    bottomQCL.appendChild(delAll);
    //INITIAL PRINT OF QUICK CONVERT LIST
    printQCList();
    //Help----------------------------------------------------------
    var helpTitle = document.createElement("h3");
    helpTitle.innerHTML = "About";
    helpDiv.appendChild(helpTitle);
    var rant = document.createElement("div");
    rant.innerHTML = '<strong>4chan Image Resizer</strong> automatically downscales images based on custom presets. Originally developed to downscale anime/vidya screenshots "on the fly". Now with image cropping and WebP conversion!<br><br>' +
        '<details><summary><strong>Presets</strong></summary><br>To automate image resizing, you have to create a preset by choosing an input image format and entering input and output dimensions (pixels). Then just add an image to a quick reply form. ' +
        'If it meets any of the created input requirements, the image will be automatically downscaled to your specified dimensions as a <strong>JPEG</strong>. ' +
        '<br><br><strong>Note</strong> that output dimensions are constrained by input dimensions <strong>aspect ratio</strong>. ' +
        '<br><strong>Also note</strong> that <strong>setting JPEG output quality to 100 will</strong> result in filesizes larger than that of the original image, without any noticable quality changes.</details>' +
        //
        '<br><details><summary><strong>Quick Convert</strong></summary><br>Allows you to quickly convert images (PNG/JPEG/WebP) to JPEG fromat.' +
        '<br>This is very useful when an image exceeds 4chan image size limit of <strong>4 MB</strong>.' +
        '<br><br>It works well on super high resolution images (+3000px), sometimes drastically cutting the filesize without any noticeble quality loss.' +
        ' However, <strong>it is not recommended to use it on grayscale PNG images</strong>, i.e. manga pages, because most of the time <strong>it will result in larger than original filesizes</strong>.' +
        '<br>Once you are satisfied with the <strong>"Quick Convert"</strong> results, you can click <strong>"Remember"</strong> on the side menu to add the image MD5 hash to the <strong>"Quick Convert List"</strong>, which then will always automatically convert the image for you in the future.' +
        '<br><br>You can also use the default <kbd>Ctrl</kbd> + <kbd>Q</kbd> keyboard shortcut to perform <strong>"Quick Convert"</strong> faster. Press again to <strong>"Remember"</strong> the image.</details>' +
        //
        '<br><details><summary><strong>Import/Export</strong></summary><br>Allows you to seperatly backup both, "Presets" and "Quick Convert" lists as .json files.' +
        '<br><strong>Import</strong> works by merging list entries instead of overwriting them, <span style="text-decoration-line: line-through;">so you can export/import items between domains without any worry.</span></details>' +
        //
        '<br><details><summary><strong>Image Cropping</strong></summary><br>A basic image cropping tool that uses <a href="https://github.com/daiyam/cropperjs/tree/daiyam" target="_blank">Daiyam/Cropper.js</a> library. ' +
        'You can change cropped image output format in the settings tab.<br><strong>PNG</strong> is lossless and preserves transperancy, but results in larger filesizes.<br><strong>JPEG</strong> is lossy, but results in smaller filesizes (the <strong>"JPEG Quality"</strong> setting also applies here).</details>' +
        //
        '<br><details><summary><strong>Cropper Controls</strong></summary>' +
        '<br>While cropping:<ul><li>Double click <kbd>LMB</kbd> - switch between cropping and zooming.</li><li>Hold <kbd>Shift</kbd> while cropping - draw a fixed rectangle.</li><li><kbd>MWheel</kbd> - zoom in/out.</li>' +
        '<li><kbd>Backspace</kbd> - clear selection.</li><li><kbd>Enter</kbd> - confirm selection.</li><li><kbd>Esc</kbd> or <kbd>Delete</kbd> - close cropper.</li></ul>' +
        'After selection:<br><ul><li><kbd>Enter</kbd> or <kbd>LMB</kbd> - set image to QR form.</li><li><kbd>Backspace</kbd> or <kbd>RMB</kbd> - undo selection.</li><li><kbd>MMB</kbd> - close cropper.</li><li><kbd>Shift</kbd> + <kbd>RMB</kbd> - open context menu.</li></ul></details>' +
        //
        '<br><details><summary><strong>Custom Shortcuts</strong></summary>' +
        '<br>I am way too lazy to implement custom keybind functionality and the UI for it. But if you really want to change the default keybinds, you will have to edit the code directly.' +
        '<br><br>To do that, you first have to open the code in your script manager (Tampermonkey, Violentmonkey, etc.).' +
        '<br>If you want to change "<strong>Quick Convert</strong>" shortcut, hit Ctrl+F and search for "<strong>Quick Convert KEYBINDS</strong>".' +
        '<br>If you want to change "<strong>Image Cropper</strong>" shortcuts, hit Ctrl+F and search for "<strong>Cropper KEYBINDS</strong>".' +
        '<br>All you have to do now is change the <strong>keyCode</strong> values to the ones that represent your desired keys. You can easily find equivalent keyCode values for each keyboard key by <a href="https://www.google.com/search?q=keyCode+values" target="_blank">googling</a> them.</details>' +
        //
        '<br><span style="font-weight:bold; color: red;">NEW</span><ul><li>Replaced the useless auto PNG conversion with auto WebP conversion.</li><li>Image  preview header now displays the correct file type after conversion.</li><li>Some minor UI adjustments.</li>' +
        '<br><br><div style="float: right;" >[ <a href="https://greasyfork.org/en/scripts/391758-4chan-image-resizer" target="_blank">version ' + version + '</a> ]</div>';
    helpDiv.appendChild(rant);
}
//Only when QR form is open.
function appendSideMenu() {
    //Arrow | sideMenuArrow----------------------------------------------------------
    var arrow = document.createElement("a");
    arrow.id = "sideMenuArrow";
    arrow.title = "Side Menu";
    arrow.style.cursor = "pointer";
    arrow.innerHTML = "&#9664;";
    var arrowRef = document.getElementById("autohide");
    arrowRef.parentNode.insertAdjacentElement("beforebegin", arrow);
    arrow.onclick = function(){ sideMenu.classList.toggle("downscale-menu-on"); };
    //Side Menu | sideMenu----------------------------------------------------------
    var sideMenu = document.createElement("div");
    sideMenu.id = "sideMenu";
    sideMenu.classList.add("dialog");
    var sideMenuRef = document.getElementById("qr");
    sideMenuRef.insertAdjacentElement("afterbegin", sideMenu);
    //Close side menu dialog by clicking anywhere but here:
    window.addEventListener('click', function(event) {
        var getSideMenu = document.getElementById("sideMenu");
        if (!event.target.matches('#sideMenuArrow') &&
            !event.target.matches('#sideMenu') &&
            !event.target.matches('#imgResize') &&
            !event.target.matches('#quickConvert') &&
            //!event.target.matches('#manualResize') &&
            !event.target.matches('#imgResizeLabel')) {
            if (getSideMenu.classList.contains('downscale-menu-on')) getSideMenu.classList.remove('downscale-menu-on');
        }
    });
}
appendSettings();
//*************************************************************************************//
//END OF MENUs                                                                         //
//*************************************************************************************//
//Saves image details to local storage
function saveImgMD5 (img, file, imgMD5, newSize) {
    removeRemOption();
    var QCList = getQCList();
    //"file/jpeg" -> "JPEG"
    var filetype = file.type.split("/").pop().toUpperCase();
    //remove filetype
    var filename = file.name.split(".").slice(0,-1).join(".");
    //replace seperators
    filename = filename.replace(/:/g,"_");
    var orig_filesize = formatBytes(file.size);
    var new_filesize = formatBytes(newSize);
    //QCList Array [0] - Filetype, [1] - Image Width, [2] - Image Height, [3] - Original Filesize, [4] - New Filesize, [5] - Filename, [6] - Image Base64 MD5 Hash
    var QCString = filetype + ":" + img.width + ":" + img.height + ":" + orig_filesize + ":" + new_filesize + ":" + filename + ":" + imgMD5;
    QCList.push(QCString);
    localStorage.setItem("downscale-qclist", JSON.stringify(QCList));
    //Show notification
    var info = file.name + '\nAdded to the "Quick Convert List"';
    var msgDetail = {type: 'info', content: info, lifetime: 5};
    var msgEvent = new CustomEvent('CreateNotification', {bubbles: true, detail: msgDetail});
    document.dispatchEvent(msgEvent);
    //rebuild list
    document.getElementById("QCTable").tBodies.item(0).innerHTML = "";
    printQCList();
}
//Removes these Side Menu options
function removeQCOption() {
    var checkQC = document.getElementById("qcDiv");
    if (checkQC) checkQC.remove();
}
function removeRemOption() {
    var checkRem = document.getElementById("remDiv");
    if (checkRem) checkRem.remove();
}
function removeCropOption() {
    var checkCrop = document.getElementById("cropDiv");
    if (checkCrop) checkCrop.remove();
}
function removePreviewOption() {
    var checkPreview = document.getElementById("previewImg");
    if (checkPreview) checkPreview.remove();
}
function removeHR() {
    var checkHR = document.getElementById("sm-hr");
    if (checkHR) checkHR.remove();
}
function removeManual() {
    var checkMan = document.getElementById("manDiv");
    if (checkMan) checkMan.remove();
}
//Get border color for <hr> hack
function getHRColor () {
    var sample = document.getElementById("imgResizeMenu");
    return window.getComputedStyle(sample, null).getPropertyValue("border-bottom-color");
}
//Show/hide sidemenu <hr>
function appendHR() {
    var hr = document.createElement("hr");
    hr.id = "sm-hr";
    hr.style.borderColor = getHRColor();
    document.getElementById("sideMenu").appendChild(hr);
}
//Image viewer
function showImage(img, size, width, height, filename, mime) {
    var newFileName = constructFilename(mime, filename);
    var overlay = document.createElement("div");
    overlay.id = "pvOverlay";
    //-----------------------------------------------
    var pvHeader = document.createElement("div");
    pvHeader.id = "pvHeader";
    pvHeader.className = "dialog";
    //opacity hack
    pvHeader.classList.add("pvOpct");
    pvHeader.innerHTML = newFileName + "<br>(" + formatBytes(size)+ ", " + Math.round(width) + "x" + Math.round(height) + ")";
    //-----------------------------------------------
    var closePv = document.createElement("a");
    closePv.className = "close fa fa-times";
    closePv.style = "float: right; cursor: pointer; margin-right: 20px; margin-top: -9px; transform: scale(1.5);";
    closePv.title = "Close";
    closePv.onclick = function(){ overlay.remove(); };
    //-----------------------------------------------
    var pvImg = document.createElement("img");
    pvImg.id = "pvImg";
    pvImg.classList.add("centerImg");
    pvImg.title = "Click to close";
    pvImg.src = img;
    pvImg.onclick = function(){ overlay.remove(); };
    //-----------------------------------------------
    document.body.appendChild(overlay);
    //pvHeader.appendChild(closePv);
    overlay.appendChild(pvImg);
    overlay.appendChild(pvHeader);
    pvHeader.appendChild(closePv);
    //opacity hack
    setTimeout(function() { pvHeader.classList.toggle("pvOpct"); }, 2000);
}
//Converts dataURI to blob
function dataURItoBlob(dataURI) {
    //convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) { byteString = atob(dataURI.split(',')[1]); }
    else { byteString = unescape(dataURI.split(',')[1]); }
    //separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    //write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {
        type: mimeString
    });
}
//json file exporter
function downloadObjectAsJson(exportObj, exportName) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
//Prevent multiple event listeners
var scListenerExists = false;

//------------------Quick Convert KEYBINDS------------------------- | default Ctrl+Q
if (getSettings().shortcut && !scListenerExists) { document.addEventListener('keyup', qCShortcut); scListenerExists = true ; }
function qCShortcut(e) {
    var convertBtn = document.getElementById("quickConvert");
    var rememberBtn = document.getElementById("rememberMD5");
    //if shortcut is enabled, simulate clicks
    if (getSettings().shortcut) {
        //ctrlKey = Ctrl, 81 = Q
        //You can change ctrlKey to altKey or shiftKey.
        //Example: (e.shiftKey && e.keyCode == 65 && convertBtn) would be Shift+A

        //Edit keyCode value below for "Quick Convert" action
        if (e.ctrlKey && e.keyCode == 81 && convertBtn) {
            convertBtn.click();
        }
        //Edit keyCode value below for "Remember" action
        else if (e.ctrlKey && e.keyCode == 81 && rememberBtn) {
            rememberBtn.click();
        }
        //Do not edit beyond this point------------------------------
    }
}
//Fix filetype in a filename
function constructFilename(mime, filename) {
    //"file/jpeg" -> "jpeg"
    var filetype = mime.split("/").pop();
    //remove filetype from a filename and add the correct one
    var new_filename = filename.split(".").slice(0,-1).join(".").concat("." + filetype);
    return new_filename;
}
//Bloat
function isNumber(e){var i=(e=e||window.event).which?e.which:e.keyCode;return!(i>31&&(i<48||i>57));}
function formatBytes(a,b){if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f];}