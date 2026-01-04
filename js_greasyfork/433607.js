// ==UserScript==
// @name         Menu template for your script
// @namespace    none
// @version      1
// @description  I just did it because I'm bored... How you will use this menu depends on you! I did it for the developers of cheats on Moo Moo.io, but it can be used on any game.
// @author       00100110#6361
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433607/Menu%20template%20for%20your%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/433607/Menu%20template%20for%20your%20script.meta.js
// ==/UserScript==

/* Stting menu */

let menu = {
    opacity: 1,
    position: {
        relative: `relative`,
        absolute: `absolute`,
        top: `${70}px`,
        left: `${20}px`,
        bottom: `${0}px`,
        right: `${0}px`,
    },
    size: {
        width: `${330}px`,
        height: `${400}px`,
        height_title_block: `${30}px`,
        border_body_block: `${5}px`,
        border_radius_body_block: `${7}px`,
        font_size_title_block: `${21}px`,
        font_size_inner_block: `${18}px`
    },
    colors: {
        background_title_block: `rgba(66, 66, 66, 0.61)`,
        background_body_block: `rgba(0, 0, 0, 0.25)`,
        background_inner_block: `rgba(0, 0, 0, 0.25)`,
        border_body_block: `rgba(38, 38, 38, 0.72)`,
        title_text: `#fff`,
        inner_block: `#fff`,
    },
    display: {
        block: `block`,
        flex: `flex`,
        none: `none`
    },
    align: {
        left: `left`,
        center: `center`,
        right: `right`,
        bottom: `bottom`
    }
}

menu = new Proxy(menu, {
    set(target, prop, val) {
        if (prop in target) {
            return true
            if (typeof val != 'string') {
                target[prop] = val.toString()
            } else {
                return target[prop]
            }
        } else {
            return prop
            return false
            throw new Error(`Prop: ${prop} not defined in ${target}`)
        }
    }
});

/* Create menu HTML code */
const html = `
<!--
<main></main> & <passive></passive> - are not embedded tags in HTML.
I use this to denote the significance of the blocks.
class="" & id="" - I use to denote blocks, id for everything else
-->
<!-- Add holder -->
<main class="menu--holder">
  <main class="menu--body">
    <passive id="menu--title">
      Menu
    </passive>
    <main class="menu--inner-gui">
      <passive class="menu--inner-gui-block">
        <passive id="menu--inner-gui-block-text">
          Your text <input type="checkbox" id="Your id">
        </passive>

      </passive>
    </main>
  </main>
</main>
`

/* Create menu CSS code */

let css = `
<style>
/*
. - use for class
# - use for id
*/

/* Style for holder menu. */
main.menu--holder {
position: ${menu.position.absolute};
top: ${menu.position.top};
left: ${menu.position.left};
width: ${menu.size.width};
height: ${menu.size.height};
display: ${menu.display.none};
}

/* Style for body menu. */
main.menu--body {
width: 100% !important;
height: 100% !important;
background: ${menu.colors.background_body_block};
border-radius: ${menu.size.border_radius_body_block};
border: ${menu.size.border_body_block} solid ${menu.colors.border_body_block};
opacity: ${menu.opacity};
}

/* Style for title menu */
passive#menu--title {
cursor: move;
position: ${menu.position.relative};
display: ${menu.display.flex};
width: 92.6% !important;
background: ${menu.colors.background_title_block};
color: ${menu.colors.title_text};
align-content: ${menu.align.center};
justify-content: ${menu.align.center};
font-size: ${menu.size.font_size_title_block};
text-align: ${menu.align.center};
height: ${menu.size.height_title_block};
box-shadow: 0px 0px 4px #1a1a1a;
flex-wrap: wrap;
margin-left: 12px;
margin-top: 5px;
}

/* Style for inner menu gui */
main.menu--inner-gui {
margin: 0px 2px;
display: ${menu.display.flex};
}

/* Style for inner menu gui block */
passive.menu--inner-gui-block {
width: 290px;
vertical-align: top;
height: 330px;
margin: 0px 10px 10px 10px;
background: rgba(66, 66, 66, 0.61);
box-shadow: 0px 0px 4px #1a1a1a;
border-radius: 3px;
overflow-x: hidden;
overflow-y: auto;
color: #fff;
padding: 10px;
margin-top: 10px;
}

/* Style for text in inner menu */
passive#menu--inner-gui-block-text {
color: ${menu.colors.inner_block};
font-size: ${menu.size.font_size_inner_block};
display: ${menu.display.block};
}

input[type="checkbox"] {
vertical-align: middle;
user-select: none;
box-sizing: border-box;
cursor: pointer;
}
</style>
`


/* Create menu JS code */

let js = `
<script>

// If you click outside of the menu location
$(document).mouseup(function (e) {
    let container = $(".menu--holder")
    if (container.has(e.target).length === 0 && container.css('display') == 'block'){
        container.css('opacity', '0.35')
    } else {
        container.css('opacity', '1')
    }
})

// Drag element
dragElement(document.querySelector((".menu--holder")))
function dragElement(elmnt) {
    let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0
    if (document.getElementById("menu--title")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById("menu--title").onmousedown = dragMouseDown
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown
    }

    function dragMouseDown(e) {
        e = e || window.event
        // get the mouse cursor position at startup:
        pos3 = e.clientX
        pos4 = e.clientY
        document.onmouseup = closeDragElement
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag
    }

    function elementDrag(e) {
        e = e || window.event
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX
        pos2 = pos4 - e.clientY
        pos3 = e.clientX
        pos4 = e.clientY
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px"
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px"
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null
        document.onmousemove = null
    }
}
</script>
`

/* Add menu in body */
$('body').append(html, css, js)

/* Add toggler for menu */
let openMenu = true
document.addEventListener("keydown", function(event) {
    if (event.code == "Escape") {
        if (openMenu) {
            openMenu = false
            $('.menu--holder').css('display', menu.display.block)
        } else {
            openMenu = true
            $('.menu--holder').css('display', menu.display.none)
        }
    }
})