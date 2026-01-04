// ==UserScript==
// @name         GeoGuessr Quick-Moving Shortcut
// @namespace    https://greasyfork.org/users/1179204
// @version      0.0.8
// @author       KaKa
// @description  create shortcut for qucik moving in geoguessr game
// @license      MIT
// @match        *://*.geoguessr.com/*
// @icon         https://www.svgrepo.com/show/509212/rocket.svg
// @downloadURL https://update.greasyfork.org/scripts/538927/GeoGuessr%20Quick-Moving%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/538927/GeoGuessr%20Quick-Moving%20Shortcut.meta.js
// ==/UserScript==

/* ------------------------------------------------------------------------------- */
/* ----- KEYBOARD SHORTCUTS (MUST Refresh PAGE FOR CHANGES TO TAKE EFFECT) -------- */
/* ------------------------------------------------------------------------------- */

const KEY_BIND = {
    // Single key
    FORWARD: '3',

    BACKWARD: '4',
};

const STEP= 0.1 // kilo metres

/* ############################################################################### */
/* ##### DON'T MODIFY ANYTHING BELOW HERE UNLESS YOU KNOW WHAT YOU ARE DOING ##### */
/* ############################################################################### */


let service;
let isApplied;

function svgToUrl(svgText) {
    const svgBlob = new Blob([svgText], {type: 'image/svg+xml'});
    const svgUrl = URL.createObjectURL(svgBlob);
    return svgUrl;
}

const svg=`<svg fill="#ffffff" width="16px" height="16px" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M11.5 0c-.654 0-.65 1 0 1h6.842c.72 0 .73.408.554.77l-3.84 7.5c-.172.334.07.73.444.73h7.072c.15 0 .323.093.39.248.07.155.095.443-.288.95L10.33 27.57l1.664-9.988c.05-.305-.185-.583-.494-.582H7.54c-.557 0-.6-.164-.505-.934l1.96-14.5c.09-.66-.903-.794-.99-.132l-1.962 14.5c-.075.556-.06 1.048.203 1.46.264.413.768.606 1.293.606h3.368L9.006 29.418c-.086.516.578.8.892.383l13.575-18c.524-.694.643-1.406.406-1.95-.24-.544-.77-.85-1.308-.85h-6.254l3.467-6.77c.188-.368.316-.856.12-1.36C19.707.363 19.12 0 18.34 0z"></path></g></svg>`
const svgUrl=svgToUrl(svg)
function getViewer(){
    try{
        const container= document.querySelector('div[data-qa="panorama"]');
        const keys = Object.keys(container)
        const key = keys.find(key => key.startsWith("__reactFiber"))
        const props = container[key]
        return props.return.updateQueue.lastEffect.deps[0];
    }
    catch(e){
        console.error('Error finding pano viewer: '+e);
    }
}

async function getPanorama(lat, lng){
    if (google){
        if (!service) service = new google.maps.StreetViewService();
        return new Promise(resolve => {
            service.getPanorama({
                location: { lat, lng },
                radius: STEP * 500,
                source: google.maps.StreetViewSource.GOOGLE
            }, (data, status) => {
                if (status === 'OK') resolve(data);
                else resolve(null);
            });
        });
    } else {
        console.error('Google StreetView Service is not prepared!');
        return null;
    }
}


function getLocation(viewer){
    return {
        lat: viewer.location.latLng.lat(),
        lng: viewer.location.latLng.lng(),
        heading: viewer.getPov().heading
    };
}

async function moveStreetView(direction) {
    const viewer = getViewer();
    if (!viewer) return;

    let { lat, lng, heading } = getLocation(viewer);
    const distance = direction === 'forward' ? STEP / 100 : -STEP / 100;

    const radHeading = heading * (Math.PI / 180);
    const radLeftHeading = (heading - 45) * (Math.PI / 180);
    const radRightHeading = (heading + 45) * (Math.PI / 180);

    let mainLat = lat + Math.cos(radHeading) * distance;
    let mainLng = lng + Math.sin(radHeading) * distance;

    let leftLat = lat + Math.cos(radLeftHeading) * distance;
    let leftLng = lng + Math.sin(radLeftHeading) * distance;

    let rightLat = lat + Math.cos(radRightHeading) * distance;
    let rightLng = lng + Math.sin(radRightHeading) * distance;

    let [panoMain, panoLeft, panoRight] = await Promise.all([
        getPanorama(mainLat, mainLng),
        getPanorama(leftLat, leftLng),
        getPanorama(rightLat, rightLng)
    ]);

    let newLat = mainLat, newLng = mainLng;

    if (panoMain) {
        newLat = panoMain.location.latLng.lat();
        newLng = panoMain.location.latLng.lng();
    } else if (panoLeft) {
        newLat = panoLeft.location.latLng.lat();
        newLng = panoLeft.location.latLng.lng();
    } else if (panoRight) {
        newLat = panoRight.location.latLng.lat();
        newLng = panoRight.location.latLng.lng();
    }
    else{
        newLat = lat
        newLng = lng
    }
    viewer.setPosition({
        lat: newLat,
        lng: newLng
    });
}


let onKeyDown = (e) =>{
    const container= document.querySelector('div[data-qa="panorama"]');
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable||!container||!isApplied) {
        return;
    }
    e.stopPropagation();
    if (e.key === KEY_BIND.FORWARD) moveStreetView('forward');
    if (e.key === KEY_BIND.BACKWARD) moveStreetView('backward');
}

    document.addEventListener("keydown", onKeyDown);
if (!window.location.href.includes('duel')) {
    const observer = new MutationObserver((mutationsList, observer) => {
        const originalElements = document.querySelectorAll(".styles_control__Pa4Ta");

        if (originalElements.length>2 && !document.getElementById('quick-move-button')) {
            const targetElement = originalElements[originalElements.length - 1];
            const clonedElement = targetElement.cloneNode(true);
            clonedElement.id='quick-move-button'
            const parent = targetElement.parentNode;
            parent.insertBefore(clonedElement, targetElement);
            const tooltip = clonedElement.querySelector(".tooltip_tooltip__3D6bz");
            if (tooltip) {
                tooltip.textContent = "Enable quick moving";
                tooltip.style.transition="0.3s"
                const arrow = document.createElement("div");
                arrow.classList.add("tooltip_arrow__LJ1of");
                tooltip.appendChild(arrow);

                const imgElement = clonedElement.querySelector("img");
                const buttonElement = clonedElement.querySelector("button");
                if (imgElement) {
                    imgElement.src = svgUrl;
                }
                if(isApplied){
                    tooltip.textContent = "Disable Quick Moving";
                    buttonElement.style.outline = '2px solid #e6a014';
                }
                clonedElement.addEventListener("mouseover", () => {

                    tooltip.style.visibility = "visible";
                    tooltip.style.opacity = "1";
                    arrow.style.opcaity="1"
                    tooltip.style.transform="translateY(-50%) scale(1)"
                });

                clonedElement.addEventListener("mouseout", () => {
                    tooltip.style.visibility = "hidden";
                    tooltip.style.opacity = "0";
                    tooltip.style.transform="translateY(-50%) scale(0)"
                });

                clonedElement.addEventListener("click",()=>{
                    if(!isApplied){
                        tooltip.textContent = "Disable Quick Moving";
                        buttonElement.style.outline = '2px solid #e6a014';
                    }
                    else {
                        tooltip.textContent = "Enable Quick Moving";
                        buttonElement.style.outline='';

                    }
                    tooltip.appendChild(arrow);
                    isApplied=!isApplied
                })
            }
        }});
    observer.observe(document.body, { childList: true, subtree: true });
}