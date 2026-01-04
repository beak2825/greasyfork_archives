// ==UserScript==
// @name        Custom Color Twitter
// @name:fr     Custom Color Twitter
// @match       https://twitter.com/*
// @match       https://x.com/*
// @grant       none
// @version     1.26
// @author      LOUDO
// @license     MIT
// @run-at      document-body
// @description Allows you to set a custom color instead of the 6 predefined by Twitter
// @description:fr Permet de définir une couleur personnalisée au lieu des 6 couleurs prédéfinies par Twitter
// @namespace https://greasyfork.org/users/1135033
// @downloadURL https://update.greasyfork.org/scripts/471773/Custom%20Color%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/471773/Custom%20Color%20Twitter.meta.js
// ==/UserScript==



const style1 = document.createElement("style");
const style2 = document.createElement("style");
const colorPicker = document.createElement('input');
const colorPickerDesc = document.createElement('p')
const btnReset = document.createElement('button')
const head = document.head;
let color;
let rgbColor;

colorPicker.type = "color";
colorPicker.setAttribute('id', 'colorPicker');
colorPicker.value = localStorage.getItem('color');
colorPickerDesc.textContent = 'Replace the last color using the color pick to the one you want!'
colorPickerDesc.setAttribute('id', 'colorPickerDesc')


btnReset.textContent = 'Reset'
btnReset.setAttribute('id', 'btnReset')

btnReset.addEventListener('click', () => {
  localStorage.removeItem("color");
  localStorage.removeItem("rgbColor");
  changeColorTheme('changeColor')
})


if(document.querySelector('body').style.backgroundColor == 'rgb(0, 0, 0)' || document.querySelector('body').style.backgroundColor == 'rgb(21, 32, 43)'){
  colorPickerDesc.style.color = "white"
} else {
  colorPickerDesc.style.color = "black"
}

async function addColorPicker() {
  style1.innerHTML = `
    #colorPicker{
      padding: 0;
      margin-top: 10px;
      cursor: pointer;
    }
    #colorPickerDesc{
        position: absolute;
        right: 12px;
        width: 141px;
        top: -65px;
        text-align: right;
    }

    #btnReset{
      position: absolute;
      right: 29px;
      bottom: -7px;
    }
  `;

  const colorPickerParent = await document.querySelector('div[class="css-175oi2r r-18u37iz r-a2tzq0"]');
  if (colorPickerParent !== null) {
    head.appendChild(style1);
    colorPickerParent.appendChild(colorPicker);
    colorPickerParent.appendChild(colorPickerDesc)
    colorPickerParent.appendChild(btnReset)
    colorPicker.addEventListener('change', (e) => {
      changeColorTheme('addNewColor', e.target.value)
    })
    observer.disconnect();
    observer.observe(document, { subtree: true, childList: true });


  }
}

function changeColorTheme(order, color) {
  const fetchColorData = () => {
      let hex = color.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      localStorage.setItem('rgbColor', `rgba(${r}, ${g},${b}`);
      localStorage.setItem('color', color);
      updateStyles();

  }

  const updateStyles = () => {
    const color = localStorage.getItem('color');
    const rgbColor = localStorage.getItem('rgbColor');

    style2.innerHTML = `

     /* "Show More" text */
     div[style*="color: rgb(0, 186, 124);"]:not(div[class="css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41 r-1awozwy r-6koalj r-1h0z5md r-o7ynqc r-clp7b1 r-3s2u2q"]){
        color: ${color} !important;
     }

     /* Outline */
      div[style*="border-color: rgb(0, 186, 124);"]{
        border-color: ${color} !important;
     }

     /* Color line settings display */
     div[style*="background-color: rgb(128, 221, 190);"]{
      background-color: ${rgbColor}, 0.3) !important;
     }


     /* Random Element */
     div[style*="background-color: rgb(0, 186, 124);"]{
      background-color: ${color} !important;
     }


     /* Some random text */
     span[style*="color: rgb(0, 186, 124);"]{
         color: ${color} !important;
     }


     /* Circle settings display */

     div[class="css-1dbjc4n r-sdzlij r-15ce4ve r-tbmifm r-16eto9q"]{
      background-color: ${color} !important;
     }

    /* Link like hashtag or @*/
    a[style*="color: rgb(0, 186, 124);"]{
      color: ${color} !important;
    }

    /* SVG color */
     svg[style*="color: rgb(0, 186, 124);"]{
        color: ${color} !important;
     }

     /* Trend word */
     .r-o6sn0f{
        color: ${color} !important;
     }


    /* Circle Loading Beginning */
     circle[cx="16"]{
        stroke: ${color} !important;
     }

     /* Circle tweeting */
     circle[stroke="#00BA7C"]{
        stroke: ${color} !important;
     }

     /* Global color like tweet button, lines... */
      .r-s224ru {
        background-color: ${color} !important;
      }

      /* Tweet button */

      a[data-testid="SideNav_NewTweet_Button"][style*="background-color: rgb(0, 186, 124);"]{
         background-color: ${color} !important;
      }

      a[data-testid="SideNav_NewTweet_Button"][style*="background-color: rgb(0, 186, 124);"]:hover{
         background-color: ${rgbColor}, 0.9) !important ;
      }

      a[href="/i/verified-choose"][style*="background-color: rgb(0, 186, 124);"]{
          background-color: ${color} !important;
      }

       /* Hover effect */
      .r-1iwjfv5 {
        background-color: ${rgbColor}, 0.9) !important ;
      }


      /* Rectangle Color */
      .r-h7o7i8{
        background-color: ${rgbColor}, 0.3) !important;

      }

      /* Outline Get Verified Section */
      .r-156p8rw{
         border-color: ${color} !important;
      }



      /* More tweet click */
      .r-pxc13i{
         background-color: ${rgbColor}, 0.9) !important;
      }

      /* Border right color selected */
      .r-jgqioj{
          border-right-color: ${color} !important;
      }


      /* Hover effect on svg */
      .r-15azkrj{
          background-color: ${rgbColor}, 0.1) !important;
      }

      /* Message background color when clicked */
      .r-721b40{
          background-color: ${color} !important;
      }


      /* Background color click 3 points on message */
      .r-1x669os{
          background-color: ${rgbColor}, 0.2) !important;
      }

      svg[style="background-color: rgb(0, 186, 124);"]{
         background-color: transparent !important;
         color: white !important;
      }


    `;

    head.appendChild(style2);
  }

  if (order === "addNewColor") {
    fetchColorData();
  } else if (order === "changeColor") {
    updateStyles();
  }

  observer.disconnect();
  observer.observe(document, { subtree: true, childList: true });
}


const observer = new MutationObserver(() => {
  const url = location.href;
  if (url === "https://twitter.com/settings/display") {
    addColorPicker();
  }
});


observer.observe(document, { subtree: true, childList: true });


changeColorTheme('changeColor');

