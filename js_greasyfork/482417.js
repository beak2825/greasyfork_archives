// ==UserScript==
// @name         TesterTV_YouTube_Screenshots
// @namespace    https://greasyfork.org/ru/scripts/482417-testertv-youtube-screenshots
// @version      2023.12.16
// @description  Create YouTube Screenshots
// @license      GPL version 3 or any later version
// @author       TesterTV
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://music.youtube.com/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/482417/TesterTV_YouTube_Screenshots.user.js
// @updateURL https://update.greasyfork.org/scripts/482417/TesterTV_YouTube_Screenshots.meta.js
// ==/UserScript==


setInterval(function() {
    if (window.location.href !== "https://www.youtube.com" && window.location.href !== "https://www.youtube.com/" && window.location.href !== "https://m.youtube.com/" && window.location.href !== "https://m.youtube.com" && window.location.href !== "https://music.youtube.com/" && window.location.href !== "https://music.youtube.com") {
        // Check if the page contains an element with id "ButtonEffects"
        if (!document.getElementById("ScreenshotButton")) {
            // If the element isn't found, start the effects script
            YoutubeScreenshots();
        }
    }
}, 1000);

function YoutubeScreenshots() {

    // Check if current window isn't an iframe
    var isInIframe = window === window.top;
    if (isInIframe) {

//********************************************************************************************************************
//***                                             Screenshot 📷                                                   ***
//********************************************************************************************************************

//***************************
//*** ButtonScreenshot 📷 ***
//***************************

    // Create the screenshot button
    const ScreenshotButton = document.createElement('button');
    ScreenshotButton.id = 'ScreenshotButton';
    ScreenshotButton.style.position = 'relative';
    ScreenshotButton.textContent = '📷';
    ScreenshotButton.style.fontSize = '20px';
    ScreenshotButton.style.background = 'none';
    ScreenshotButton.style.border = "3px solid rgba(0, 0, 0, 0)";
    ScreenshotButton.style.color = 'white';
    ScreenshotButton.style.margin = '6px 10px 0';
    ScreenshotButton.style.height= '34px';
    ScreenshotButton.style.width= '36px';
    ScreenshotButton.style.borderRadius = '5%';
    ScreenshotButton.style.left = '10px';
    ScreenshotButton.style.display = 'flex';
    ScreenshotButton.style.justifyContent = 'center';
    ScreenshotButton.style.alignItems = 'center';

    // Insert into the YouTube player controls
    var ControlsLeft = document.querySelector('.ytp-left-controls');
    ControlsLeft.style.position = 'relative';
    ControlsLeft.style.display = 'flex';
    //ControlsLeft.style.alignItems = 'center';
    var TimeDisplay = document.querySelector('.ytp-time-display');
    ControlsLeft.insertBefore(ScreenshotButton, TimeDisplay.nextSibling);

//********************************************************************************************************************
//***                               Listener event - Screenshot function 📷👂                                      ***
//********************************************************************************************************************

    // Add event listener to the screenshot button
    ScreenshotButton.addEventListener("click", function(event) {
        const VideoElement = document.querySelector('video');
        const Canvas = document.createElement('canvas');
        const Context = Canvas.getContext('2d');
        Canvas.width = VideoElement.videoWidth;
        Canvas.height = VideoElement.videoHeight;
        Context.drawImage(VideoElement, 0, 0, Canvas.width, Canvas.height);

        // Get the current video timing
        const CurrentTime = VideoElement.currentTime;
        const Hours = Math.floor(CurrentTime / 3600);
        const Minutes = Math.floor((CurrentTime % 3600) / 60);
        const Seconds = Math.floor(CurrentTime % 60);
        const FormattedTime = `${Hours.toString().padStart(2, '0')}:${Minutes.toString().padStart(2, '0')}:${Seconds.toString().padStart(2, '0')}`;

        // Save the screenshot to local drive with the timing in the filename
        const ScreenshotImage = Canvas.toDataURL('image/png');
        GM_download({
            url: ScreenshotImage,
            name: `screenshot_${FormattedTime}.png`,

            // Screenshot will be downloaded directly to the download folder without asking the user for the title or location.
            saveAs: false //"true" for SaveAs request
        });

        // Set focus on player
        var playButton = document.querySelector('.html5-main-video');
        playButton.focus();

    });

//****************************************
//***   Listener event - Button 📷👂   ***
//****************************************

    // Add an event listener to check if the user has pressed the screenshot button
    ScreenshotButton.addEventListener("click", function(event) {
        ScreenshotButton.style.border = "3px solid rgba(255, 0, 0, 0.5)";

          if (ScreenshotButton) {
              setTimeout(function() {
                  ScreenshotButton.style.border = "3px solid rgba(0, 0, 0, 0)";
              }, 150);
          }

    });

    // Add mouseover event listener to the button...
	ScreenshotButton.addEventListener('mouseover', function() {
		ScreenshotButton.style.border = "3px solid #74e3ff";
	});

    // Add mouseover event listener to the button...
    ScreenshotButton.addEventListener('mouseleave', function() {
        ScreenshotButton.style.border = "3px solid rgba(0, 0, 0, 0)";
    });

//********************************************************************************************************************
//***                                         Screenshot drawing 📸🖌️                                             ***
//********************************************************************************************************************

//***************************
//***  ButtonShow/Hide 👀 ***
//***************************

    // Create the hide/show draw options button
    const ButtonDrawHideShow = document.createElement('button');
    ButtonDrawHideShow.id = 'ButtonDrawHideShow';
    ButtonDrawHideShow.style.position = 'relative';
    ButtonDrawHideShow.textContent = '🖌️';
    ButtonDrawHideShow.style.fontSize = '20px';
    ButtonDrawHideShow.style.background = 'none';
    ButtonDrawHideShow.style.border = "3px solid rgba(0, 0, 0, 0)";
    ButtonDrawHideShow.style.color = 'white';
    ButtonDrawHideShow.style.margin = '6px 0px 0';
    ButtonDrawHideShow.style.height= '34px';
    ButtonDrawHideShow.style.width= '36px';
    ButtonDrawHideShow.style.borderRadius = '5%';
    ButtonDrawHideShow.style.left = '10px';
    ButtonDrawHideShow.style.display = 'flex';
    ButtonDrawHideShow.style.justifyContent = 'center';
    ButtonDrawHideShow.style.alignItems = 'center';

    // Insert into the YouTube player controls
    //var ControlsLeft = document.querySelector('.ytp-left-controls');
    ControlsLeft.style.position = 'relative';
    ControlsLeft.style.display = 'flex';
    //ControlsLeft.style.alignItems = 'center';
    //var TimeDisplay = document.querySelector('.ytp-time-display');
    ControlsLeft.insertBefore(ButtonDrawHideShow, TimeDisplay.nextSibling);

//**********************************
//*** ButtonScreenshotForDraw 📸 ***
//**********************************

    // Create button
    const ButtonScreenshotForDraw = document.createElement('button');
    ButtonScreenshotForDraw.id = "ButtonScreenshotForDraw"
    ButtonScreenshotForDraw.style.position = 'fixed';
    ButtonScreenshotForDraw.style.height= '34px';
    ButtonScreenshotForDraw.style.width= '36px';
    ButtonScreenshotForDraw.style.top = '80px';
    ButtonScreenshotForDraw.style.left = '10px';
    ButtonScreenshotForDraw.textContent = '📸';
    ButtonScreenshotForDraw.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    ButtonScreenshotForDraw.style.border = '1px solid grey';
    ButtonScreenshotForDraw.style.fontSize = '20px';
    ButtonScreenshotForDraw.style.display = 'flex';
    ButtonScreenshotForDraw.style.justifyContent = 'center';
    ButtonScreenshotForDraw.style.alignItems = 'center';
    ButtonScreenshotForDraw.style.zIndex = '9995';
    ButtonScreenshotForDraw.style.display = 'none'
    document.body.appendChild(ButtonScreenshotForDraw);

//*************************
//***  Color picker 🎨 ***
//*************************

    // Create color picker
    const ColorPicker = document.createElement('input');
    ColorPicker.id = 'ColorPicker';
    ColorPicker.type = 'color';
    ColorPicker.style.position = 'fixed';
    ColorPicker.style.width= '36px'
    ColorPicker.style.top = '120px';
    ColorPicker.style.left = '10px';
    ColorPicker.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    ColorPicker.style.border = '1px solid grey';
    ColorPicker.value = '#74e3ff'; // Initial color is red
    ColorPicker.style.zIndex = '9996';
    ColorPicker.style.display = 'none'
    document.body.appendChild(ColorPicker);

//***************************
//***    ButtonSave 💾   ***
//***************************

    // Create save button
    const SaveButton = document.createElement('button');
    SaveButton.id = "SaveButton"
    SaveButton.style.position = 'fixed';
    SaveButton.style.height= '34px';
    SaveButton.style.width= '36px';
    SaveButton.style.top = '158px';
    SaveButton.style.left = '10px';
    SaveButton.textContent = '💾';
    SaveButton.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    SaveButton.style.border = '1px solid grey';
    SaveButton.style.fontSize = '20px';
    SaveButton.style.zIndex = '9997';
    SaveButton.style.display = 'none'
    document.body.appendChild(SaveButton);

//***************************
//***   ExitDrawMode ❌  ***
//***************************

    // Create exit button
    const ButtonExitDraw = document.createElement('button');
    ButtonExitDraw.id = "ButtonExitDraw"
    ButtonExitDraw.style.position = 'fixed';
    ButtonExitDraw.style.height= '34px';
    ButtonExitDraw.style.width= '36px';
    ButtonExitDraw.style.top = '198px';
    ButtonExitDraw.style.left = '10px';
    ButtonExitDraw.textContent = '❌';
    ButtonExitDraw.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    ButtonExitDraw.style.border = '1px solid grey';
    ButtonExitDraw.style.fontSize = '20px';
    ButtonExitDraw.style.zIndex = '9998';
    ButtonExitDraw.style.display = 'none'
    document.body.appendChild(ButtonExitDraw);

//*************************
//***   Container 📦   ***
//*************************

    // Create image container
    const ImageContainer = document.createElement('div');
    ImageContainer.id = 'ImageContainer';
    ImageContainer.style.position = 'fixed';
    ImageContainer.style.transform = 'translate(-50%, -50%)';
    ImageContainer.style.top = '50%';
    ImageContainer.style.left = '50%';
    ImageContainer.style.display = 'none';
    ImageContainer.style.zIndex = '9990';
    ImageContainer.style.display = 'none'
    document.body.appendChild(ImageContainer);

//***************************
//***Take a Screenshot 🖼️***
//***************************

    // Create canvas for drawing
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '50%';
    canvas.style.left = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';
    ImageContainer.appendChild(canvas);
    const context = canvas.getContext('2d');

//*****************************
//***BrushThicknessSlider 🎚️***
//*****************************

    // Create the BrushThicknessSlider element
    var BrushThicknessSlider = document.createElement('input');
    BrushThicknessSlider.id = 'BrushThicknessSlider';
    BrushThicknessSlider.type = 'range';
    BrushThicknessSlider.min = '1';
    BrushThicknessSlider.max = '30';
    BrushThicknessSlider.step = '0.1';
    BrushThicknessSlider.value = '5';
    BrushThicknessSlider.style.transform = 'rotate(270deg)'; // Rotate the slider vertically
    BrushThicknessSlider.style.position = 'absolute';
    BrushThicknessSlider.style.zIndex = '9999';
    BrushThicknessSlider.style.display = 'none'

    // Chnage sliders color
    BrushThicknessSlider.style.background = ColorPicker.value;
    BrushThicknessSlider.style.border = 'none';
    BrushThicknessSlider.style.height = '5px';
    BrushThicknessSlider.style.top = '151px';
    BrushThicknessSlider.style.left = '-15px';
    BrushThicknessSlider.style.width = '152px';
    BrushThicknessSlider.style.outline = 'none';
    BrushThicknessSlider.style.appearance = 'none';
    BrushThicknessSlider.style.webkitAppearance = 'none';
    BrushThicknessSlider.style.mozAppearance = 'none';
    BrushThicknessSlider.style.msAppearance = 'none';
    BrushThicknessSlider.style.webkitSliderThumb = '-webkit-slider-thumb';
    BrushThicknessSlider.style.mozSliderThumb = '-moz-slider-thumb';
    BrushThicknessSlider.style.msSliderThumb = '-ms-slider-thumb';
    BrushThicknessSlider.style.sliderThumb = 'slider-thumb';

    // Append the slider to the document body or any other desired parent element
    document.body.appendChild(BrushThicknessSlider);

//********************************************************************************************************************
//***                               Listener event - Screenshot draw 🖌️👂                                          ***
//********************************************************************************************************************

//****************************************
//***   ButtonDrawHideShow 🖌️👂        ***
//****************************************

    // Add an event listener to check if the user has pressed the screenshot button
    ButtonDrawHideShow.addEventListener("click", function(event) {
        ButtonDrawHideShow.style.border = "3px solid rgba(255, 0, 0, 0.5)";
          if (ButtonDrawHideShow) {
              setTimeout(function() {
                  ButtonDrawHideShow.style.border = "3px solid rgba(0, 0, 0, 0)";
              }, 150);
          }
    });

    // Add mouseover event listener to the button...
	ButtonDrawHideShow.addEventListener('mouseover', function() {
		ButtonDrawHideShow.style.border = "3px solid #74e3ff";
	});

    // Add mouseover event listener to the button...
    ButtonDrawHideShow.addEventListener('mouseleave', function() {
        ButtonDrawHideShow.style.border = "3px solid rgba(0, 0, 0, 0)";
    });

//************************************
//*** DrawFunctionsHide/Show 🖌️🖼️ ***
//************************************

    // Add event listener to the draw button. Function to show/hide video frame
    document.getElementById("ButtonDrawHideShow").addEventListener("click", function(event) {

        if (ImageContainer.style.display === 'none') {
            ButtonScreenshotForDraw.style.display = 'block';
            ColorPicker.style.display = 'block';
            SaveButton.style.display = 'block';
            ButtonExitDraw.style.display = 'block'
            BrushThicknessSlider.style.display = 'block'

            ButtonScreenshotForDraw.style.display = 'flex';
            ButtonScreenshotForDraw.style.justifyContent = 'center';
            ButtonScreenshotForDraw.style.alignItems = 'center';

            ColorPicker.style.display = 'flex';
            ColorPicker.style.justifyContent = 'center';
            ColorPicker.style.alignItems = 'center';

            SaveButton.style.display = 'flex';
            SaveButton.style.justifyContent = 'center';
            SaveButton.style.alignItems = 'center';

            ButtonExitDraw.style.display = 'flex';
            ButtonExitDraw.style.justifyContent = 'center';
            ButtonExitDraw.style.alignItems = 'center';

            //Click Screenshot button
            var button = document.getElementById('ButtonScreenshotForDraw');
            if (button) {button.click();}

        } else {
            ButtonScreenshotForDraw.style.display = 'none';
            ColorPicker.style.display = 'none';
            SaveButton.style.display = 'none';
            ButtonExitDraw.style.display = 'none'
            BrushThicknessSlider.style.display = 'none'

            // Hide video frame
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseout', stopDrawing);

            ImageContainer.style.display = 'none';
        }
    });

//*****************************
//***   DrawControl 🖱️🖼️   ***
//*****************************

    // Add event listener to the draw button. Function to show/hide video frame
    document.getElementById("ButtonScreenshotForDraw").addEventListener("click", function(event) {

        //Remove old screenshot
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseout', stopDrawing);
            ImageContainer.style.display = 'none';

        //Create new screenshot
        const videoElement = document.querySelector('video');

        // Show video frame
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        // Add mouse event listeners for drawing
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        ImageContainer.style.display = 'block';
    });

//***************************
//***      Drawing 🖌️    ***
//***************************

    // Variables for drawing
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Set initial drawing color
    let DrawingColor = ColorPicker.value;

    // Add event listener to the color picker. Function to change drawing color
    document.getElementById("ColorPicker").addEventListener("change", function(event) {
        DrawingColor = ColorPicker.value;
        BrushThicknessSlider.style.background = ColorPicker.value;
    });

    function draw(e) {
        if (!isDrawing) return;

        context.beginPath();
        context.moveTo(lastX, lastY);
        context.lineTo(e.offsetX, e.offsetY);

        context.strokeStyle = DrawingColor;
        //context.lineWidth = 5;
        context.lineWidth = BrushThicknessSlider.value;

        context.lineCap = 'round';
        context.stroke();

        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function stopDrawing() {
        isDrawing = false;
    }

//****************************
//*** ScreenshotSave 💾🖼️ ***
//****************************

    // Add event listener to the save button
    document.getElementById("SaveButton").addEventListener("click", function(event) {
        // Get the current video timing
        const VideoElement = document.querySelector('video');
        const CurrentTime = VideoElement.currentTime;
        const Hours = Math.floor(CurrentTime / 3600);
        const Minutes = Math.floor((CurrentTime % 3600) / 60);
        const Seconds = Math.floor(CurrentTime % 60);
        const FormattedTime = `${Hours.toString().padStart(2, '0')}:${Minutes.toString().padStart(2, '0')}:${Seconds.toString().padStart(2, '0')}`;

        const dataUrl = canvas.toDataURL('image/png');
        GM_download({
            url: dataUrl,
            name: `screenshot_${FormattedTime}.png`,

            //Video will be downloaded directly to the download folder without asking the user for the title or location.
            saveAs: false //"true" for SaveAs request
        });
    });

//****************************
//*** ScreenshotExit ❌🖼️ ***
//****************************

    // Add event listener to the save button
    document.getElementById("ButtonExitDraw").addEventListener("click", function(event) {
            //Click Screenshot button
            var button = document.getElementById('ButtonDrawHideShow');
            if (button) {button.click();}
    });

//***************************
//*** Thickness change 🎚️ ***
//***************************

    // Add an event listener to update the thickness when the slider value changes by user
    BrushThicknessSlider.addEventListener('input', function() {context.lineWidth = BrushThicknessSlider.value;});

//********************************************************************************************************************
//***                                  Remove player notifications 💬🗑️                                           ***
//********************************************************************************************************************

    // Select the elements to be removed
        //Remove video notification by selector (ytp-fullerscreen-edu-text , ytp-fullerscreen-edu-chevron,)
        //Remove video time by class (ytp-time-display.notranslate)
        //Remove next video button by class (ytp-next-button)
    const elementsToRemove = document.querySelectorAll('.ytp-fullerscreen-edu-text, .ytp-fullerscreen-edu-chevron');

    // Loop through each element and remove it
    elementsToRemove.forEach(element => {element.remove();});

    }//window isn't an iframe

}