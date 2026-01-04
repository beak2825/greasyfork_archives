// ==UserScript==
// @name         Simplistic Caleb - Light
// @namespace    http://tampermonkey.net/
// @version      1.6.2
// @description  The Only Caleb Theme
// @author       Crjase
// @match        https://caleb.btac.nsw.edu.au/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450435/Simplistic%20Caleb%20-%20Light.user.js
// @updateURL https://update.greasyfork.org/scripts/450435/Simplistic%20Caleb%20-%20Light.meta.js
// ==/UserScript==




let near_due_date = 0;


function myLinks()
{
    // Button CSS
    const buttonStyle = `
  .button-30 {
    align-items: center;
    appearance: none;
    background-color: #FCFCFD;
    border-radius: 4px;
    border-width: 0;
    box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px,rgba(45, 35, 66, 0.3) 0 7px 13px -3px,#D6D6E7 0 -3px 0 inset;
    box-sizing: border-box;
    color: #36395A;
    cursor: pointer;
    display: inline-flex;
    font-family: "JetBrains Mono",monospace;
    height: 48px;
    justify-content: center;
    line-height: 1;
    list-style: none;
    overflow: hidden;
    padding-left: 16px;
    padding-right: 16px;
    position: relative;
    text-align: left;
    text-decoration: none;
    transition: box-shadow .15s,transform .15s;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    white-space: nowrap;
    will-change: box-shadow,transform;
    font-size: 18px;
  }

  .button-30:focus {
    box-shadow: #D6D6E7 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
  }

  .button-30:hover {
    box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
    transform: translateY(-2px);
  }

  .button-30:active {
    box-shadow: #D6D6E7 0 3px 7px inset;
    transform: translateY(2px);
  }
`
    // Creating the button stylesheet
    let stylesheet = document.createElement("style");
    stylesheet.innerHTML = buttonStyle;
    document.head.appendChild(stylesheet);

    const island = document.getElementsByClassName("small-12 island");

    // Iterate through all specific class
    for (let i=0; i<island.length; i++)
    {
        // Find the container needed
        if (island[i].innerHTML.includes("Daily Prayer"))
        {
            var linkBoard = island[i];

            // Get rid of Daily Prayer
            island[i].innerHTML = "";

            // -------- island style --------
            island[i].style.textAlign = "center";
            island[i].style.backgroundColor = "white";
            island[i].style.padding = "20px";
            // island[i].style.outline = "1px solid black";
            island[i].style.position = "relative";

            // -------->  SubHeader  <--------
            let subHeader = document.createElement("h2");
            subHeader.setAttribute("class", "subheader");
            subHeader.innerHTML = "My Link Board";
            subHeader.style.textDecoration = "underline";
            subHeader.style.fontSize = "1.5em";
            subHeader.style.fontWeight = "bold";
            linkBoard.appendChild(subHeader);
            linkBoard.appendChild(document.createElement("br"));
            linkBoard.appendChild(document.createElement("br"));

            // -------->  Add-Button  <--------
            let addButton = document.createElement("button");
            addButton.innerHTML = "+";
            addButton.style.fontWeight = "bold";
            addButton.style.fontSize = "2em";
            addButton.style.background = "none";
            addButton.style.borderRadius = "50%";
            addButton.style.width = "4vw";
            addButton.style.height = "9vh";
            addButton.style.position = "absolute";
            addButton.style.top = "0px";
            addButton.style.left = "0px";

            addButton.onmouseover = function() {
              addButton.style.backgroundColor = "white";
            }

            addButton.onmouseout = function() {
              addButton.style.backgroundColor = "transparent";
            }

            // Create a whole iframe on-top, because I like putting my self through pain
            addButton.onclick = function() {
              let container = document.createElement("div");
              container.style.position = "fixed";
              container.style.top = "0";
              container.style.left = "0";
              container.style.width = "100vw";
              container.style.height = "100vh";
              container.style.backgroundColor = "rgba(0,0,0,0.5)";
              container.style.zIndex = "10000";
              container.style.cursor = "pointer";

              container.onclick = function()
              {
                container.remove();
                window.location.reload();
              }

              let iframeContainer = document.createElement("div");
              iframeContainer.style.border = "1px solid whitesmoke";
              iframeContainer.style.backgroundColor = "rgb(255, 255, 255)";
              iframeContainer.style.width = "80%";
              iframeContainer.style.height = "80%";
              iframeContainer.style.padding = "10px";
              iframeContainer.style.position = "fixed";
              iframeContainer.style.top = "50%";
              iframeContainer.style.left = "50%";
              iframeContainer.style.transform = "translate(-50%, -50%)";
              container.appendChild(iframeContainer);

              let iframe = document.createElement("iframe");
              iframe.src = "https://caleb.btac.nsw.edu.au/cms/myLinks";
              iframe.style.width = "100%";
              iframe.style.height = "100%";
              iframeContainer.appendChild(iframe);

              // ---- Append Container to DOM ----
              document.body.appendChild(container);
            }

            linkBoard.appendChild(addButton);

            // ---- Replace it with something better ----
            let linkContainer = document.getElementById("side-menu-mylinks");
            let offCanvasList = linkContainer.querySelector(".my-links").querySelector(".off-canvas-list");
            let hyperLinkList = offCanvasList.querySelectorAll("li")

            links = [];

            // Get all links and append to links[]
            for (let i = 0; i < hyperLinkList.length; i++)
            {
              let link = hyperLinkList[i].querySelector("a");
              links.push(link);
            }

            // Remove MyLinks from the sidebar
            linkContainer.remove();

            // Create button on the DOM for each link
            for (const a of links)
            {
              let button = document.createElement("button");

              button.onclick = function() {
                window.open(a.href);
              }

              button.innerHTML = a.innerHTML;

              button.setAttribute("class", "button-30");
              button.style = "margin-left: 10px; margin-right: 10px;";

              linkBoard.appendChild(button);
            }
        }
    }
}

function leftMenu()
{
    // Local Variables
    const container = document.getElementById("left-menu");
    const subMenu = document.querySelectorAll(".left-submenu");
    const logo = document.querySelector("img[src='/images/logo.php?logo=skin_logo_large&size=normal']");

    // Sleep Method
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function menuLoop() {
        // Each individual link on the container
        const elements = container.getElementsByTagName("a");
        const menuTitle = container.getElementsByTagName("h3")[0];

        // Cold Colours
        const coldColours = [
            "magenta", "blue", "purple", "navy",
            "royal", "space", "iceberg", "sapphire",
            "denim", "vivid cerulean", "lapis lazuli",
            "maya blue"]

        // Void Colours
        const voidColours = ["#000000", "#696969", "#808080", "#A9A9A9"]

        // One-Time-Applied text CSS
        for (let i=0; i<elements.length ; i++)
        {
            // This makes a calm fade effect
            elements[i].style.transition = "1s"
            // Set light-theme colour for the menu
            container.style.backgroundColor = "white";
            // Make sure the menu has no image overlay
            container.style.backgroundImage = "none";
            // Set logo image to inverted colours
            logo.style = "filter: invert(1);";
            // Set H3 font weight
            if (elements[i].parentNode.tagName == "H3")
            {elements[i].style.fontWeight = "700";}
            // Set menu title css
            menuTitle.style.color = "black";
            menuTitle.style.fontSize = "large";
            menuTitle.style.letterSpacing = "2px";
            menuTitle.innerHTML = "Caleb";
        }

        // One-Time-Applied subMenu CSS
        for (let i=0; i<subMenu.length ; i++)
        {
            // Make sure the subMenu has no image overlay
            subMenu[i].style.backgroundImage = "none";
            // Set light-theme for the subMenu
            subMenu[i].style.backgroundColor = "white";
        }

        while (true)
        {
            await sleep(100);

            for (var i=0; i<elements.length; i++)
            {
                // Select a random cold colour
                let coldColour = coldColours[Math.floor(Math.random()*coldColours.length)];
                // Select a random hot colour
                let voidColour = voidColours[Math.floor(Math.random()*voidColours.length)];

                if (! (elements[i].parentNode.tagName == "H3"))
                {
                    elements[i].style.color = coldColour
                } else
                {
                    elements[i].style.color = voidColour
                }
            }
        }
    }

    let worker = new Worker(menuLoop());
}

function dueWorkContainer()
{
    const island = document.getElementsByClassName("small-12 island");

    // Iterate through all specific class
    for (let i=0; i<island.length; i++)
    {
        const elem = island[i];

        // Find the correct container
        if (elem.innerHTML.includes("Upcoming Due Work"))
        {
            // Parent node of elem
            // const elemP = elem.parentNode;

            // -------- Apply Custom Style --------
            // elem.style.outline = "1px solid black";
            elem.style.padding = "10px";
            elem.style.backgroundColor = "white";

            // ---- Make the due work highlighted ----
            const infoList = elem.querySelector("section>ul.information-list").querySelectorAll("li");

            for (let i = 0; i < infoList.length; i++) {
                let info = infoList[i];

                // Get the link for later
                const link = info.querySelector("div>h3>a.title");

                //info.style.backgroundColor = "whitesmoke";
                info.style.margin = "10px";
                info.style.cursor = "pointer";


                // ---- Determine if something is near the due date ----
                const due = info.querySelector("div").querySelectorAll("p");

                // Array of tasks near due date
                let dueTasks = [];

                for (let i = 0; i < due.length; i++) {
                    if (due[i].outerText.includes("Due")) {
                        let date = due[i].outerText;

                        let split_date = date.split(" ")

                        /* For Debugging */
                        //console.log(split_date);

                        let index;
                        var day = "Failed to Get";
                        var hours = "Failed to Get";
                        // Get the due date using the more complex method.
                        if (split_date[2] != "at" && !(split_date[2].includes("("))) {
                            index = `${split_date[1]} ${split_date[2]} ${split_date[3]}`;

                            date = split_date.join(" ");

                            let date_1 = new Date(index);
                            let date_2 = new Date();

                            const days = (date_1, date_2) =>{
                                let difference = date_1.getTime() - date_2.getTime();
                                let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
                                return TotalDays;
                            };
                            day = days(date_1, date_2);
                        }
                        // If there is less than 6 days left, 'at' will be present.
                        if (split_date.includes("at") && split_date[5] && !(split_date[5].includes("hours"))) {
                            index = split_date[2];
                            day = index.replace("(", "");
                        };
                        // There is no 'at', but [2] includes '(<int>'. This is around a few days left.
                        if (split_date[2] && split_date[2].includes("(")) {
                            index = split_date[2];
                            day = index.replace("(", "");
                        };
                        if (split_date[5] && split_date[5].includes("hours")) {
                            index = split_date[4];
                            hours = index.replace("(", "");
                        };

                        // I'm not sure why the position is relative? Forgot???
                        info.style.position = "relative";

                        // Globalize (p), so it can be accessed by infoTheme
                        var p = document.createElement("p");

                        if (day != "Failed to Get") {
                            let height = info.height;
                            p.innerHTML = `${day} Days`;
                            p.style.fontSize = "1em";
                            p.style.position = "absolute";
                            p.style.right = "0";
                            p.style.top = "50%";
                            p.style.transform = "translate(-50%, -50%)";

                            info.appendChild(p);
                        }
                        else if (hours != "Failed to Get") {
                            let height = info.height;
                            p.innerHTML = `${hours} Hours`;
                            p.style.fontSize = "1em";
                            p.style.position = "absolute";
                            p.style.right = "0";
                            p.style.top = "50%";
                            p.style.transform = "translate(-50%, -50%)";

                            info.appendChild(p);
                        }
                        else {
                            let height = info.height;
                            p.innerHTML = "Failed to Get Time";
                            p.style.fontSize = "1em";
                            p.style.position = "absolute";
                            p.style.right = "0";
                            p.style.top = "50%";
                            p.style.transform = "translate(-50%, -50%)";

                            info.appendChild(p);
                        };
                    };

                    function infoTheme(info, { bg_over, bg_leave, img_over, img_leave, fg_over, fg_leave, fg_weight, img_transition, bg_transition, audio }) {

                        // Make the div also a link to the task
                        info.onclick = () => {
                            location.href = link;
                        };

                        if (fg_weight)
                            p.style.fontWeight = fg_weight;

                        // Replace background with image on mouse leave
                        if (img_leave)
                            info.style.backgroundImage = img_leave;

                        // Set the foreground colour
                        if (fg_leave)
                            info.style.color = fg_leave;

                        // Replace background with colour on mouse leave
                        if (bg_leave)
                            info.style.backgroundColor = bg_leave;

                        // Highlight it
                        info.onmouseover = () => {

                            if (audio) {
                                let aud = new Audio(audio);
                                aud.play();
                            };

                            if (fg_over)
                                info.style.transition = "0s";
                                info.style.color = fg_over;

                            if (img_over && bg_over) {
                                console.warn("You cannot have both over events, Priortising img_over...");

                                // Transition Time
                                if (img_transition)
                                    info.style.transition = img_transition;

                                info.style.backgroundImage = `url("${img_leave}")`;
                                info.style.backgroundSize = "100%";
                                info.style.backgroundRepeat = "no-repeat";
                                info.style.backgroundPosition = "center";

                                if (bg_leave)
                                    info.style.removeProperty("background-color");

                                return;
                            };

                            if (img_over) {

                                // Transition Time
                                if (img_transition)
                                    info.style.transition = img_transition;

                                info.style.backgroundImage = `url("${img_over}")`;
                                info.style.backgroundSize = "100%";
                                info.style.backgroundRepeat = "no-repeat";
                                info.style.backgroundPosition = "center";

                                if (bg_leave)
                                    info.style.removeProperty("background-color");
                            };

                            if (bg_over) {

                                // Transition Time
                                if (bg_transition)
                                    info.style.transition = bg_transition;

                                info.style.backgroundColor = bg_over;

                                if (img_leave)
                                    info.style.removeProperty("background-image");
                                    info.style.removeProperty("background-size");
                                    info.style.removeProperty("background-position");
                                    info.style.removeProperty("background-repeat");
                            };
                        };

                        // Don't Highlight it
                        info.onmouseleave = () => {

                            if (fg_leave)
                                info.style.transition = "0s";
                                info.style.color = fg_leave;

                            if (img_leave && bg_leave) {
                                console.warn("You cannot have both leave events, Priortising img_leave...");

                                // Transition Time
                                if (img_transition)
                                    info.style.transition = img_transition;

                                info.style.backgroundImage = `url("${img_leave}")`;
                                info.style.backgroundSize = "100%";
                                info.style.backgroundRepeat = "no-repeat";
                                info.style.backgroundPosition = "center";

                                // Remove background-color even though the image covers it
                                if (bg_over)
                                    info.style.removeProperty("background-color");

                                return;
                            };

                            if (img_leave) {

                                // Transition Time
                                if (img_transition)
                                    info.style.transition = img_transition;

                                info.style.backgroundImage = `url("${img_leave}")`;
                                info.style.backgroundSize = "100%";
                                info.style.backgroundRepeat = "no-repeat";
                                info.style.backgroundPosition = "center";

                                // Remove background-color even though the image covers it
                                if (bg_over)
                                    info.style.removeProperty("background-color");
                            };

                            if (bg_leave) {

                                // Transition Time
                                if (bg_transition)
                                    info.style.transition = bg_transition;

                                if (img_over)
                                    info.style.removeProperty("background-image");
                                    info.style.removeProperty("background-size");
                                    info.style.removeProperty("background-position");
                                    info.style.removeProperty("background-repeat");

                                info.style.backgroundColor = bg_leave;
                            };
                        };

                    };

                    // Find how close something is to be submitted and apply themes
                    if (due[i].innerHTML.includes("Due")) {

                        // Error Occured
                        if (day == "Failed to Get") {
                            const url = "https://rare-gallery.com/uploads/posts/336764-Anime-Scenery-Horizon-Shooting-Star-Sunset-4K-3840x2160.jpg";
                            infoTheme(info, { img_over : url, bg_leave : "#01031A", fg_leave : "red", img_transition: "2.4s", bg_transition: "0s" });
                        }

                        // No Warning
                        if (day > 20) {
                            infoTheme(info, { bg_over : "whitesmoke", bg_leave : "white"} );
                        }

                        // Warning
                        if (day <= 20) {
                            infoTheme(info, { bg_over : "orange", bg_leave : "#FFDFBF" });
                        }

                        // Critical Warning
                        if (day <= 10) {
                            // Append this task to the dueTasks array
                            const url = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARwAAACxCAMAAAAh3/JWAAAA21BMVEXaVlL////bVVLZV1PbVVT7///YWFTYV1HZVVDcVVHaVlXVV1LZUEzaU1DbVU7bT03/9PTYQj7TOznaTU/aTEn34uDWRUTojYrQSUfYXljZlJjVgoHgUkvZVVffU1XOOT3RYmDy4+LVSkLbqKHzxsPrysLOVljpsajUYGbeaGbhoJ3kqKj00tXOPznnt7PXhoX42tbOd3XPkY3WhHzTcm/DKybnxcXet7jvn53dc2/FS0fwtbLev7fKYmDpu7PelI/VOTO7O0Dih4jerq/RjIv86ODfPz/dfXfgcm7XszKwAAADkklEQVR4nO3Yf2/iNhgH8NhOYjs/STCBtlAghTICBNpy9Bhbw7V3o+//Fc2BmzR1mlrpdMtEvh/+QbaQHh49evzYhgEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAF7519+p9E8b8jTdunSbtjBPabHebY0qWmo7+Ki8AUThXhVYszycNLctXtyTc7lDlGmLr02uf9b4NAiEriqxQXXHYaZNh3AiNRf9uQSqXhzai5GN+6k1+mPVnDypHC9jJCyJV00/EoOS06zAkHs8v54qY/zZdtk8salk3ZaZnRaVjEWvWDO0J6/LgqTaeXTZL78CH0U+mJmvZjw7gOrixCLLL+pHN0Hx7XXKObbe6W664yXek6jFccY1WonWwsnR3yuBoSa3zqOtRtfl5MWuRhe/X2DKsVYfzaIJY13P3WGuvknJoONzt5tt1slg/zTsXxVcoJfyerzdMoLyb9/T46dRchwsPLcnV5NyveGw/PGmcijra7hUusUWrbp1OJG26Srx/zL0+d2vbikp7tGL0gt3Pdd9bSOA0znHG+H66z587bybB+5Jq86PPKaiX2qVAoM7tfn1IPqdHXzq9lakgjS79foFyTdr7VuhUfUUq5oe5JY9a+iJVtfl91g2Wu9IRIWa17ju1Qmd4Q8mkfxVF8FEVp2h8PvEAwzo75qzrIKjBDejoh6nVDSEsbNo6Gw9Zq08iKYttM/lDKE7WZkHUZcOZS3WqDaL84ZJsWKbVWo11WPG8HjtlUSZKopv36/DnLH19G2WuUeCFzJRVCnv/AzIQumGmx0aOxTstLMdXlkygV+kIIdsQ1YXhdFUbJtNjNdoUfBUJQO6g69p/K5r6KL7JVWS7DvN2Lo27osPLwNsvHUKY/f9ETEDM5l76vomm2yw9RIM0KQ/+ZKGOUeSrePpWXKbIpotjzPvZOw203UNHDbrJNqOD0HDPkcy9+zRvlHXy0XaQB+/DDOS2ffUyqovas3fPd8+rPTN+WaE8lWaN8uZkf4lQ6hmSG/8Hfc16mkTqGF/am9pkd7frfmIm/s6xyDO4kP3QrOL8HU0ctZrporNZh3xVmPV+E/w1LH8pWs9ru9b3bloy9/5P68C/1wT0f7L0e0vIP17dZYUaeY5/lKfyjqOed1xEDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVfgT4JxBo65puKYAAAAASUVORK5CYII=";
                            infoTheme(info, {
                                img_over : url,
                                bg_leave : "#ffcccb",
                                img_transition : "0.4s",
                                bg_transition : "0s",
                                fg_over : "whitesmoke",
                                fg_leave: "black"
                            });
                            // Getting near due date
                            near_due_date += 1;
                        };

                        // Galactically-Critical Warning
                        if (hours != "Failed to Get") {
                            const url = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBUWFRgWFhUZGBgaHBwaHBwcGhocHB4cGhoaHB4cHBocIS4nHB4rHxwaJjgnKy8xNTU1HCQ7QDs0Py40NTEBDAwMEA8QHxISHzQrJCs2NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NP/AABEIAUIAnAMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAADBAECBQAGB//EADcQAAEDAgQDBgUEAgIDAQAAAAEAAhEhMQMSQVEEYXEigZGhsfAFE8HR4TJCUvEUYgYVcoKSI//EABkBAAMBAQEAAAAAAAAAAAAAAAECAwAEBf/EACQRAAICAgMBAAICAwAAAAAAAAABAhESIQMxUUETYSIyBIGx/9oADAMBAAIRAxEAPwD5pnmw131RW6g6XtvEztOvRU+Y4hrS4lrJyg0DcxkwOZqVOE0kkzBgxfaCKDUEhe5FuyDRIqY9j7BEc6JAAJ3FeoB2VXt/aPK9fyh/L/Co5Na+gWzi0msUFyBQVpO3erANkRIFNQ4zroOcbDe6sQuaptBBltBB/CtnJMkySZkkkz1P1RXMJrZR8v8AdLYm0+k+wmpmtFDyjeY/HMUXFsj9METLpoSbDYUkU2V8UAuMQAZgXpNATqefKyqXZQZbexM06b98oNb2Cwb8JzTDgQaUIrX2PEKhE3lGa+ugnluukm3mR7ug0glIoQaEd1vRTgiHNLoImxmL2P8Ar008r/L198uqgCffijizNk4kZQRObNmNsgnQNIvTU9yAG6xr3dyOWUpPPUW5WrP4VWt10g2MXBQaAigGgtPuqKXGBbaaTeep6qGs99xlRlWoJdxFjQilORJkmb1hcCETh8IOBOYAibg1pSCNeRjvsuLSKSe40RUX4C0LMmw19/VGLMopc+S0OG+H5W5nOy+qA/AbEyL8yfBOoNL9/wDBck2KFs293VmikU3tWeqK3D+1PsijhTAMGNKSZgGKIxgwuSF40AV2YZkSY6fc+7JsMy/tg6n8SisZf9IncVsQb119FVcWhHIRaybNOwuVOJgOaJg9YMEe90xhvdoY9FJcYq76yjjGjWzOfhmhO3K30sr/AC9SKGQDaoynTqOsp9tiSKDe07SNbobgXCaBoNSAfdfopvjQchJjGyKEjX3sjvwMPIXAmc0RFAN8xM90fmX4UkwQepjnbXZUdhb2tOm99dUUmvhm/wBlvlXIbUCb8xprdAyU08jtp090V/lR60r/AEpEg0525IOn2jA/kGJAMCJMUEgxJ0kA9YUlhi1PrSdPco7GAmhy1H4PWFfiGwA2ZjTSsVrvTy2QcfA5C2Sd9rC9Aqxp6o4cSINr31rWNaeq5zY6U184QxNkCzQaCF2Iz3Tcoz6FzJBE1IqDE1DosjYDKWCdIVsA85qucZjqTFhU0/Clr3Ggp0+6sGAUiVdmJG3vX+0VYThhkGsO5VuffktbheIaGjM2YcCW5i0Fo/UOpEVWZPdv/aJgVkQTNdNDc9xPiqRVE5KyXntAgm8i/VW4d2VwJaCJqLTyzQYm0qQzoPei55BrPeAaWRaRgLiTesxNhSRQFRhsaTeOu8TFOdJVmk2F/FS7BcBOWZ606oUNdA3tEUBms7GtCPenh3yzXkYqQCe493kruxngQOyOVPM+7KmAW5hIMaxX6j1CFGtkv4QxMUFylXAikrSwSCzLJ6c4ppEflBxMCDcHetU0or4KpegcF1CHAQR3xPl5WCLj8MB+iS2l94rasT+VUs5H3zVw90EUneAT46DolxvsN+CzGH7R37cvFTjW92j+6Jmm4BvFRXuv1Qnj37CFUqDdgGspNtjWp5QLojGlwg92ivgsE1sNLe+q6RPoFkvpmwT9oAiRaCazXmpzcvNWf2iOdNBWeZS2IwzBuKeCV6ZlsM0I2HhuBBA5y4UodjIOyqxkGtPVGw3Gg05zSeSeKCyWYdNxvVHY+mWl5tG+2lfJWaDaRQmw9nxUDB7j71VESb9Blm0ztrsffNCfA58+aKcI0POn9rn8PFyJrY7RSZjVK7GTQCDMDrGtN+iO3CJFyAua3kPdh7/o+GytaBGMQSkAdwhqWyQJJoaNpBrYVGqE1la6Ap57YM2qhHD3+6KiBSBHDMSLWvrHpVG4fDl2UDMTQASZ5Aa1RG4ZPnWb1VXMiQE6iDKyvEPFw0CBFBfmdzzS7W1kfjz6apvFAAoI5SDUQZLdq+ZS7AYPhp1+9krCuiHsETOmk7xBn8pdzZWhhgBpaRJJpen3n6LsXAaCYdNoIFJkTMxpOiTEKkZ4bWJ99fdlD2QLoxwxKnGw46W0NO41otQ1gcNpAmL96GW80VrriBBpJmlQZEe6qpw/9h3AIUGxnGwYMyCIBkTciSK6ivhtVWZjUDdBMWQzxAyZSTAk13MfQBcwC4rtrbfdG/AVrY3wTwHgkBwFYNjypXfzV+OxGBxg66ARHKahKYZ7ROok8pPK0Kj2FyaxHHdjLMeARuPHp6In+PawmbnYT/SCxmWDInSxgAkTFpkW70fDaIkkTtqimBrws1lRQk6VOifwWOzB37gZGaHSaXBv3yk8PHyuBDfGTp7K9AOIa5oytiazF6XFd/6SylXSJydGNi/D3ip1mgj3dUxcBoaAAc1ZM05QFv4gygAGsbbiw1rNlnvwRGbnbXSp5FaMr7FUmxHDZFDrQjw1U4mBroTdMtwwRJUBtQDZUszkxJ+HQDSsGBJnmL1EVVG8LoI3mwpOp92Wk9gy0EmpGnP0lV+Q5sS2dxOkAxOh+/JLYykIHBMQTzFZtJiO8qhwgBUxI8RMd6ZxMBzamh29++iEMIGJpUA39AjQykAdhtihnUwDTSs+6ogw8LK4uzE0yxA6zsEPGNPwhPdABIkOBiHCaSK3isGu3eg0Mtg8QN07I740rWSkyOaK4SDp9vfqg5OSm02UQ6WAwI8T7p+UbDwhhuMAGCWmDmadJBsdwUbhcIGQ6h3849fFExg3MW2ALj60p4JlERy3Qk1g1sZ8q69yvhYdzpYI72tgACup3+yewvhjyxrg0kQ4k0pFulB3oul2CUkjN+SSaTpHTRFwWVFNQNYTvD8KZcAZ7JtvFhPIx3J3h+As95DY7VRoNDa6EpJCOaRm/wCPLiDA5c6U5rVwMEtbmFYodq6HwQcV7SQGQQCTNpNK36rR+Floa7NJkEU6GfIpJyajZOcnVivFY2YtdJmINgBG0ckB7ZADTmkA2Ih23UJjicBoiD5R4VVHO7JiPwjGq0BPwC1wgDLbXUn3VQ1hM2pv9te5UlWFWzmFyIrO82jYJ+jMkBo0Prp/aYw8Wmw3FufohNGYDlqmTh9ktH/kZiDYAA95KSTX0DYhj9olxmpk9Tz8Uti3oKRa9Yr016LS+V2YJjlHsnVIcS4tMAQPC/Ick8ZXpDRdimLgk9okQZ1E03BslXYXO/Kv5Ry8d+9ff9oDpO8c/e6LsuigwGxUqnz3tozEe0bC0/1CMwkGRpr/AHRK4ja38ylaCnZunBjxMj8d5VsbhnAiYl7Q+hB/VaYseSaYWloJdJJ8/Z9yuwmtcRlgR08UUzmyZb4dwQL+1zPO10zxr3BmRhgC9b/qHvqp4jHboHCgH6pgQQRbeqtw2C7EJJk9mD/6kR3RCk2/7S6JuTu2L/DsCXsNKmtaAJ34s8OeGNs0V2928kLD4fIRJjzg/wBoWM6DJHI+/dln/KeQbt2SzhQSCB0mvSieOGGNgiv3QeDxnCCImREik85EbqeNxXEExUaco+yRtuVMW23QrxrJ7QkgeWyAyCLQAD4xMSBT8LsTEdEgUsfOBS9By1Sr3nTy0VUtFoou8ttFVVuHsOvvT8rmMMbbW8mj1UuxG/cEyLVOyKbGaGcN7QABJO8CnQr0Xw3DY5hL3GdI+/2heawn7CT4Ba3A4xa2CbxA+2puo80bjo5+ReAuNaGmGig7681i8ViOcGggANkTAmpJr+Vr4zydMo96DokXsAMiD1+o0VePrY0Hj2Y7hsK7+/ojHhezJNjBtE1oN7JscPtc+x1/KFxJLSAW2NwAdjXeqqVzt6EOIaB2oOW8cuqTZ8Qw4q2vVW+JcWGiAQ7Qia94Sfy2GsKMpO9Foq1s2uIw3sdlh0TFiYuYbuEXg84cXwYFKardcyTWovAmLVvqED/Hca2rcGqKr05s70EZjE1iAZpy2nVM8FjZDI/TqDS9PRBcwCATPShn1UFsCAO8/WapXTVE3T0W4hwzSCXC8i3iaSruwJaHNb11ilkJrD+621z1m39pgOYz9dpEhxp3hK210boSfiuHZkwPATyH1UPx3huWkd2+sFWx+LzmCLm9YHIckDiCASJEA1Ir3zaE6XqKJC+ORYTas2nlGkReUPCxSIA+uUiddFGK2tp1HPmJRHObA0OoiaUqCTe9ITFUQ0u/Nzbc0VZNKWmKfXVWYW6E5hFImRBJM6RAUDGdfW346QUUZh2vM11p/eu1aa9z3ChzqSAk8J/ZiBQzMdqoFJ2170dj4/STzjbZaS0RkGxiREwY00P4SQ1Pv3zTPFcc1oLS9oa8iJAE5bV/bfdZPE8azNlBpS1STsI6+i0HSAotjT8VrYMxY35oQx2PFHXKT+IY7GtiSXHS8cyZtZIMe9ozuaMlqRQm1CblaU6ZSMLVhPjHwtrcuQg5qxFZ5brGtSetdVr8K/FxXDEd2WfpEaCxgJ1vwVrhmLDJra/NScctotGWCps9C5xzST4fcpvhwyzpgyCSaaRSyCwDU5tKaW/inGYYDaNi1aaz3+KWbVUcTfwo7DaCco7tK6g2VHYJINIjv8QPutXgeEc+s0GmoHU38FTjcJrTTtcjqObbKK5P5Yi3szXvZlPadOwvaltFmYgmSPPVH45wBoI3/EWSWcmm/guvjhqysVoo83GpsAI6hKvEc7V7udVfEf2jMDnp90q/iB+k5poQIdqJ15VlU0i0UMMxYcCN9fqgY+NcpPi3uMDTlcV5IvDYeVog3JnNUgbwDdI3spQT58VLoB9/hXwcckwA7s66TANO5LMYP3dr3zTGG/QR70/CysEkOYbjBEwSKE1t/SJw7XZv1VIAlooNzDtQh4RbSlQd9FpDiIo0BrblsA1iDBNUzshJ0ZP/ACjh2NJLjmJGUUrIrmigAhYfwvhsV5BYcrQdtJk6L0/EYDHuBe2SJBmY1uFfh8EQGtAA2Ap7ukXHu2wrkxjQN/wlmJV0h0ASDaK99VfB+C/L7LwHTBgg6iQfD1WzwPAOcS2+lOSLxHDFriDcClfJTc45UiH5X1Zm43DtYG5YAA/SBAvY7z9UpxOOXOJoJMwKDuC0g1pPaMDWKmOQSOJhtm4VI0uxk/TXDCDb7Ir2HWD3/VXY51jby8FD2RULmb2KGbxRY2QYPWfFZv8AmF5Obxit+SNxYJE2mkW2SjcURBaNk0ILutgpFsfi2u7LgD1pH3PRY/GsidQbEH7ap7iuENC0zPUR3HuSfEYb2gggFpPWL63F10QpdFIUujMe0CgJ77quNEXn3py+6M5gkayd/qaJR55KjOhbKztdWwSDQ057DU0VG1pqpe4UAblsCa1MmtbX8kg9l3v7VOgjXZFw3CxE+tNilwwlM4OGaH6opMVsawsTKbAiaiTB6wfRMsJdWQPDXkkX3oj4DqXPT1PonSIyVj7WDNAGYnxJ9bq2C2DzQ2N27uWwTOEwiu31SSZJukaXD8Xk/TfdU4jiM9prr7uglkgRtWkd1L9VzWgCSa2iOv4XPUU7+kkkJ/EeHc2kQYB7iPqvO8RwkuJzL1XHcM9wEOuKzcfhZf8A0x/kfJMqa2dEJJLbPTYcuFajUJnDq45WkNsNYGn0SPCY03put3gngNiO1IMzouXlbj8JUY3xLLFxI0WJiPW38Qa3MQREad3NYeM2SYFF08H9QxKPeIrMg80n81zbJx+HSqWxgKDamq6UkUi0Ax3jQU9DsUmWTeY5e9078i86CbjfL66IIBFRT35o0PF10AYwXi0e41XYrc1QDzVnYhrMGVZrnTLXGeRM9oQRvqVqGtgW7GY1j7I4shs5ornUBkz7/KwbIbUploqDSo08K86SgMdCJhmSt0LI08LFIAAAEa+OuiZwMXU+vclWP7OXTzqK+iI0nLl0mehMVHOim1ZCSNT57XuoIHnKl8CwlL4GAJ/V50O1FpswBAcOVIuuaTUeiVJdFJiS4EaAf3zS4wprKe4zM4wASNo+yXZhQIke+5JF6CEdwcaZTzp+Ffhy9oIitSDNKCqROI53ac1p99EF7zo2OkD0K2MnpjMPiPsc3amTP13M+qW4lxzZqSbxZS3CzfyJrrpTnzKYHClxAgk9fyqJqIjlQhiNmIofeiVfw4H6vLzvqtPiOHAdAzD/AOplVdgzJ7REVoT6hUjyJIGdGX/jToqv4eRtFky7ELTDXOEcvwqB7f3F5HICbcx9FbJ9lFJmU7Cg9pp9NKIRAAKae5zjJLu/l3IfEsAAgyYE0ip0TFsgDGm8b6eFlHJThuv2iAbhGa4f3H2WseyMMGK258kZrRShrt+VXEAGocYBkSRXel1VmKRYkd34WuxXs1cLDc0Uj6+dkxggvvbdJcI/Me04tHSfIBafCcYGyADGpygk+VFGba6WyU7RsfC/h5dcHpp3pziMRjAZjNsBZYGF8Qc0/qcO93lCA/iwSS7MSf8AYivUrkfDOUrb0LWjRw/iTMRp+W4OaCWuIIcZFwYt0Sj8Sq87/wAUxhhvx2w2BiE9o6OmKEGaBel4vi2F0w1tBSJ8DsmjFr4NOKi6Rmj4gc2SQQKg0rOht3d9kx/kMkBz2NJoJIHdM8wsljCLTAoJVuJ4Euh5ExuAQuhw1o0lGzbwePYJbnaHA1FZtI1ggzRGHEbX8u5eQf8ABzGYOjbsnwkUTHwzhntcJbE0ktJaa2P8VP8AGvpGcI1aZ6THxCSDTxP2RsPjcjXNyiTz/CUxMKwgIBFbeS2CkqIKmLY7iXE/n6JUX/P4TeJgTJin3QDhrqhVF4yRbHf+2B3G/SiSew6hGc1Ve+kR76pkqQ8X4LuYdvOEMMPLx/COGFwNKbmgC4YLRJMRynym6JZSQIONoUsnb34KQ8RAEdNequyLET9Pol2NYXCa7b7+iew8cAWM9dd7LOxMVuwnWn2G3pzVOHeHVy+IhBq+xJRs0/mO/VNPESZvzuk8bGNa+X5QcYCs620/tLOwWvIJns0AiBPqVkqBGKEuH4gtx8UNElwadR+mnhVNPxzNb/8AiksVjWcQJEhzDQGNTy5BXxsUAxJ8FFOrT9LyV0/0ekD1oYHEjJlJ1oOuvkshhJNFDnq0oKRySjZo47/4kwrcTxTm4fZ/UTTsl1K7WNlnOxCKSm+F4htA62tAlnDRFxr9mDifEccuBe97Y2bHlQFX4Ti8UEPa57mg2mDO4E10WtjPBdTuXENAECutt1lArmq6C4HGFwPYIP8AsAPCVUg6iO8K2E+sa2RH4jYihWqnoj90J5QTE63QX4gGk9V2Pwomag3CWxWE2dHcFTdFoJMh75vb3ZUbiRe1tkN7HaGSe76oYY4mDG1JKJ0RSDNeZRmCULCZrKOzEisDv+iwW/CzGyDS2tfDZN4XDS0mbaa1mvklmGojVVfjkapXYjt9AcTCBMmeSuxgB3PMkhQ/EabTPuUXh3tk02/KNBd0YHxthZisdubyOU3tAMLT+RAAgTAm99Up/wAowOyw/wC2XxB+yd4bEDmMcRUtE3vr5yoxpTaLPfGmMsxI71XNWo+iXc87ev2V2PGo9Vci4h2OUOBlSwdVBHJBMm0EDohFDqrPxW9vDFLu5/tKbc8C0rJ2LKPQZ+K5tiRQjuNx3hCc9RicQS7MTPWsxTVLkpkhVH0IcUqr3QFV1kMvRKJHPIgb60pygyhhyYZgkgwJi8bID2UrNben3QKRkuiQ+Vzz5IBw/wDY+Klwc4BvzDlFcsCNBp0HghvwcdwcatkDiaOiRXmKdUpjYE/uPdTx3Q/8Ru5ne5Qt+DRiruxluMwGrupFVcfEsIRDXE8iIPNKN+Hs3PvojN4Fg0PilakM1H6KfF+JD8M0IgggTPKfA+SCMdrSQXXOYdHAO9SV3xvhizLBoZpYWoOaxpXHySamy3HFOJ6bB44OdVv9p5pArPmh8Jw4eKYoB1zNCZfwjrNc1/dE+a7U/TjlJXRLHibmOpRnuG/mlPlvtlgjkT5QmcPDeYloJ3yutyCzonKvRfjhlxMK9cxEVEFpF+qu5yV47Ednw5AoXRf+O0KRinl4OHqjD6M43FBHvC5jZBMgAblUY6f4+P4S+LiAOggEcjITWCr0hzEeyga+d6FB+a3dC4h7IAbfX+0oXBLlQ0Y6G2fEHBxrDbLn8U3dJEKrglyY6jEcfxjB/I+HpKF/nt0DvJC4dsmIB6or2YevktcmrsdRigjeMYR+6eghS3iWbnwQsLhGOqJjqjjg2CM3ZB3PuUVkHSCMx2b+qbbAqSJ0AqfJKzgtsJ6z4QaIreKwxWs6gCO5bL0R76F/inCjEYK5S2XWmTBpyWV8N+FsxGZi8gyRHTuWpxHHtMhggbm/ksThMWARzP0XJzY3bRfjutDzuRjx+65jCT+qqzv+0P8AAeJXH4o4/tHiU/5om/FI9LgteyP/ANiO/wDKe4fi8tTik8iRHhFF4z/tX6R5pzh+JkAm+t7p4zjLSIz4H9Nv4njh+IzLlEl9h/qhPwCbv996zncX2mGKjN5iFz8cnVUjJKwYNJJD4wB+kazXpH3Uu+FGM2ak+/VZoxTIqbHXoi/5b/5FHJMzhJdMePw4AAzeZEzb0Xf4Am9ErhcUZqSVoYPENdQeiKoVqQB/AjQwEI8K0DtPA6J12IAbzsrOxGVzQRHWvNZ0FWYuK1s0QbaBOcW9pPZalMykysTszlZuIdZK52KTSaIvDcSW0Ed63+xqAl5UFxstL5rQBLm9zQYVMfjMNrZEA7kCe4BK67bCkIfJf/E+CzOIYQ5wjUrcZx5IkOMe/BYvxJ04jjvB8go8qTSoeAlK4FdkVcpXNs6A+EJPT1TeA8A1sbpTDgBWdiK0ZqK2TkrNR+HDm883oi5Fl4PFmW5jRs9aiE8eNYP3K0OWLt9EpQkEy1HQ/RTCq3FaTRzTTcb7KTjNmJEgSeipnHuxcWXlc7icusJc8YyYnv0WfjY0mSpcn+Qor+Lthjx32ExcZziZKoMZ38jTmgOeqly4vyN7LKBs4HGyIcQDQdUYhYFSijinAZc1PeqvD/IpVID4vDXfAEkwOaWxeMaLVPl4rNLybqA7ktLnvoK4w7+Lcf3R0oqOxSRUlUBVTKhKTbodRQXCxi00MfXuUYmMSZlDaFbKhb6s1IIGc1OT/YeaFK6UXIwUMG481V1NZVJUJG14ZIgrgFdpUE+4G4QbGoqCuL1J9+C736oWbEqXKRChyhCzUWJqoKhctYaLSuBXBcSgajs6kgc/H8KATuVyaJqOkDQ+P4U5hsfH8KpConyaNQUvGx8fwozjY+P4VFEIWahmF2VFyLsifEnYHKuLUbIocxBxCmBAXR77wijDUhnvwQxDkLlvvuVsvvxTHylb5S2DNkJOauyJp2Go+WtgbIXyrsqZGGp+WjgbIWDF2VM/LXfLWwNkKlqnKmCxQWLKJsgGVQWoxYoyLOIbAZV2VGyqMqFGscXLlyqSOUFcuWAiFLVy5YLCBSuXJhGQVy5csFHBSuXLGIClcuWMVKo5cuQYUUKqFK5Ix0SoXLkDH//Z";
                            infoTheme(info, { img_over : url, bg_leave : "#0B135E", fg_leave : "red", fg_over : "white", img_transition: "2.4s", bg_transition: "0s", fg_weight : "600" });
                        }
                    };
                }
            }
        }
    }
}

function specialNameTag()
{
    // ahhh, old code.
    // Find container easily, as it's at the top of the page.
    const welcoming = document.querySelector("div.small-12.columns>h1")
    const nameLabel = document.querySelector("div.small-12.columns>h1>strong")

    nameLabel.style.color = "cornflowerblue";
    nameLabel.style.fontWeight = "600";

    // ahhh, new code.
    welcoming.style.marginBottom = "0";

    let due = document.createElement("p");
    due.innerHTML = `You have ${near_due_date} near due tasks.`;
    due.style.marginBottom = "2rem";
    if (near_due_date > 0) {
        due.style.color = "red";
    }
    const aaaaa = welcoming.parentNode;
    aaaaa.appendChild(due);
}

function importFont(url)
{
    // Open Sans
    let font = document.createElement("link")
    font.href = url;
    font.rel = "stylesheet";
    font.type = "text/css";

    document.head.appendChild(font);
}

function notificationBox()
{
  const boxWide = document.getElementsByClassName("right-menu-dock");
  const boxClass = document.getElementsByClassName("icon-notifications");

  for (let i = 0; i < boxWide.length; i++)
  {
    boxWide[i].style.backgroundColor = "green";
    boxWide[i].style.outline = "1px solid black";
  }
  for (let i = 0; i < boxClass.length; i++)
  {
    boxClass[i].style.backgroundColor = "green";
    boxClass[i].style.outline = "1px solid black";
  }
}

// This function replaces the "student printing" text with
// what subjects I should focus for, to learn mechatronics.
function subjectFocus() {
    const SUBJECTS = `
    Education & Training for a Mechatronic Engineer
    Prerequisite subjects,
    or assumed knowledge,
    in one or more of <span style="font-weight: bold;">English</span>,
    <span style="font-weight: bold;">mathematics</span>,
    <span style="font-weight: bold;">chemistry</span> and <span style="font-weight: bold;">physics</span> are normally required.
    `

    // Iterate through small-12 island
    for (let i=0; i < document.getElementsByClassName("small-12 island").length; i++)
    {
        let island = document.getElementsByClassName("small-12 island")[i];

        // Find the correct container
        if (island.innerHTML.includes("STUDENT PRINTING IS NOW AVAILABLE"))
        {
            // ---------- Replace all text with subjectFocus ----------
            //
            const textDict = island.querySelector("section>article>p").querySelectorAll("span");
            const container = island.querySelector("section");

            // Remove all text
            for (let i = 0; i < textDict.length; i++) {
                let text = textDict[i];
                text.remove();
            }

            // Add my own text
            const sp = document.createElement("span");
            sp.innerHTML = SUBJECTS;

            // Append text
            island.querySelector("section>article>p").appendChild(sp);

            // -------- Container Style --------
            container.style.backgroundColor = "#FDFD96";
        }
    }
}


// Main Method
(function() {
    'use strict';

    // Call Methods
    leftMenu();
    myLinks();
    dueWorkContainer();
    specialNameTag();
    // notificationBox();
    subjectFocus();
})();