
/*
Created by anonimbiri
*/

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/css?family=Nunito:bold';
document.getElementsByTagName('head')[0].appendChild(link);
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `
@keyframes blur-in  {
   0% {
      backdrop-filter:blur(0px);
   }
   100% {
      backdrop-filter:blur(10px);
   }
}
@keyframes blur-out  {
   100% {
      backdrop-filter:blur(0px);
   }
   0% {
      backdrop-filter:blur(10px);
   }
}
.menus {
    position: absolute;
    z-index: 1000;
    top: 0;
    left: 0;
    display: flex;
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;
}
.bg-blur {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .16);
}
.menus.open {
    animation:blur-in .3s;
    animation-fill-mode:forwards;
    visibility: visible;
}
.menus.close {
    animation:blur-out .3s;
    animation-fill-mode: forwards;
    visibility: hidden;
}
.close-button {
  background: url('data:image/png;base64,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');
  background-size: 32px !important;
  position: absolute;
  z-index: 1001;
  right: 32px;
  top: 32px;
  width: 32px;
  height: 32px;
  opacity: 0.3;
  border: none;
}
.close-button:hover {
  opacity: 1;
}
.close-button:before, .close-button:after {
  position: absolute;
  left: 15px;
  height: 33px;
  width: 2px;
  background-color: #333;
}
.close-button:before {
  transform: rotate(45deg);
}
.close-button:after {
  transform: rotate(-45deg);
}
.menu {
    background-color: #111111;
    width: 640px;
    height: 520px;
    margin: 0 auto;
    border-radius: 5px;
    position: absolute;
    transform: scale(0.82971);
    flex-direction: column;
    z-index: 1001;
}
.menu.pinned {
    visibility: visible;
}
.menu-items {
   width: 640px;
   height: 480px;
   overflow-y: scroll;
}
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
.gradient-slider .title {
   font-family: 'Nunito', sans-serif;
   font-weight: bold;  
   font-size: 20px;
   margin: 0px 0px 20px;
   color: rgb(0, 0, 0);
   position: relative;
   display: flex;
   flex-direction: column;
   align-items: center;
   padding: 5px;
}
.gradient-slider {
    background: linear-gradient(268deg, #ff3939, #eeff30, #37ff30, #30ffd6, #ff30f4);
    background-size: 1000% 1000%;
    width: 100%;
    height: 30px;
    margin: 0 auto;
    border-radius: 5px 5px 0px  0px;
    animation: AnimationName 30s ease infinite;
    cursor: move;
}
@keyframes AnimationName {
    0%{background-position:0% 50%}
    50%{background-position:100% 50%}
    100%{background-position:0% 50%}
}
.gradient-slider .pin-button {
  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFN0lEQVR4nO2dW4xeUxTHf8albkFLQlJxK1UVD0Jo3JWQKkq/eShFShAal5C0KBJEouFB8FKJF/NQl6Yvpm4J4hJVUre4pJVoqzNqRglGKNN2juxYX/Kl+b75znXvtfc+v2S9zWT2Wv/Z5+yz9tprQ007Lgb6gWFgG7AauKLtT9ZUyj7A80DSwR6s9s/XtLInsGocMWpRLPNECjGadr/twcXGucDODIIYu8/1oENlIvBDRjGadq/rwYfISznFaNpi1w6ExE0FxTA2Btzm2pEQOBYYKUGQpigLXTvkM3sAa0oSo1WUW1075iuPlSxGqyi3uHbON84GdlQkSFOUm1076QsHFVjiZjHzTXOta2d94AULYjTNzMJrXDusmRssitEqytWuHdfIMSUucfOIcpXrAGhb4n7kSIxWUea5DoQWHnUsRtNGgTlEzlkVL3Gz2r/A5UTKgcBGBSK0E+UyImS5guCPJ8psIuI6BUHvZv8AlxABRwN/KAh4GvsbmEngS9zVCgKdxf4CzidQHlYQ4LyinIfyJOBpwHzgbuABYKnYEuB2YAEwAzhAfudMYLuC4OY185idihImS66pL2c21ixvtyoIalF70aUI+wPXA2/nKMFJArXfXAhxMPAQ8KuCACTKzNQRW2OCPP//VOB4otTMPr8VLgDWK3A4UW6mLKny74Klss/s2tnEg9mxV5ViHAZ8qMDRxANbBxxedRHa9wocTTyw14BDqhTjJGBIgaOJchuRcqHdqJh3FDibKLd3JQlqhY8VOJwozu7eBfRgkVme55SSiuwTYBqOaMimvusgJApsuyz9zRlGp9SiwNfAKSgiVlF2Ak9JukgdsYmyATgH5cQgyhjwrGwreEHIomzxtawnRFFeBibhMaGIMhxSQxrfRVlRdULQBT6K8nvo5wd9EuWNqvcstNDrQe7rLRtpck1onynfEiENxaLskG5z0dFQLIqqJKFNepW+U6I+3txQOFOiaSxj0g7HezBTFhMBPVIGY6pUpiufKY8Q2RnyH5XPlMcJnDltSkyHFM+UoBteTpW8UDvHh4ATFIpyI4FidtS+6eL8TwpFCSbV3orJB61MGYABqRHW8k45nQBZkjEIA8AUBTNlNMTUyYU5G8FsViDKZwTGkQVPyW52LMoyAsJM9c9LCMqmDhXjNt4pQTW07CsxMJtkttkUZVtLcwLvuaPk4LwifbCw+PgyBQ1BcIb0hSojKGNSQd7tXEUVoswlACbLx10ZAfkFuCjD3y7z8TWotWA6C+YcxAclBeQLafGalbJmimly4z3LShJjObBvgXEUFWVLCB+DZXSPHpXFQBkUeXx5PztOlkONRcT4uYKWd3lmyqcajqAV7fCzoaAYazt8Y9gWxTSnPBGP2R14s6AYfRae142UoiwiogsZ2/032tz46e3yTumXfzBvmVug08+g9Ey0TaPDTFnr03G0dkwrcAXE+9ItyBWNXUTZ6Hg8pXQN/S6nGE9KHy3XzJJZ8WqH1L439KS8Vbld1tS0dq1R0KzYtH49teyB1MClOVq6vu77KVWtHCd9ZbOmzL1eRmrFLAe/yiDGiKz5ayqqpcpyxfV631MP2lmUQYx+WRLXVMTMlOnrtFusNQU4QtLhaa5ZiP46uKrZW3oEdhPjS9+/cn3huRRimIt+93M90BhY2EUI8065x/UgY2GG7FF0EmOr3HRQY4FDZY9ivH3mo2wMpOb/Df33HG+x1rTwTAchzOPrzjpSdpmvbIs1egYVbrFGzfAuYjzte5GY71wpXRQG5PFVgzv+AynEgK57r17vAAAAAElFTkSuQmCC');
  background-size: 25px !important;
  position: absolute;
  z-index: 1001;
  top: 10;
  left: 10px;
  width: 25px;
  height: 25px;
  opacity: 0.3;
  border: none;
}
.menu.pinned .gradient-slider .pin-button {
  background: url('data:image/png;base64,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');
}
.pin-button:hover {
  opacity: 1;
}
.pin-button:before, .close-button:after {
  position: absolute;
  right: 15px;
  height: 33px;
  width: 2px;
  background-color: #333;
}
.pin-button:before {
  transform: rotate(45deg);
}
.pin-button:after {
  transform: rotate(-45deg);
}
.ui-tooltip {
	padding: 8px;
	position: absolute;
	z-index: 9999;
	max-width: 300px;
  width: 120px;
  background-color: #042c70;
  color: #fff;
  text-align: center;
  padding: 5px 10px;
  border-radius: 3px;
  font-family: nunitobold;
  font-size: 14px;
}
body .ui-tooltip {
	border-width: 2px;
}
.ui-tooltip:after {
    position: absolute;
    top: -8px;
    left: 50%;
    -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    -o-transform: translateX(-50%);
    transform: translateX(-50%);
    content: '';
    border-style: solid;
    border-width: 0 10px 15px;
    border-color: transparent transparent #042c70 transparent;
    z-index: -1;
}
.ui-helper-hidden-accessible {
	border: 0;
	clip: rect(0 0 0 0);
	height: 1px;
	margin: -1px;
	overflow: hidden;
	padding: 0;
	position: absolute;
	width: 1px;
}
.toast-color {
  display: block;
  width: 15px;
  margin-right: 5px;
  border-radius: 3px 0 0 3px;
  position: relative;
  box-sizing: border-box;
  color: #eee;
  font-size: 16px;
  font-family: 'Roboto', Tahoma, Geneva, Verdana, sans-serif;
}
.toast-color.red {
  background-color: #b90909;
}
.toast-color.green {
  background-color: #4caf50;
}
.toast-color.yellow {
  background-color: #ff9800;
}
.toast-color.blue {
  background-color: #2196f3;
}
.toast-img {
 padding: 5px;
 position: relative;
 box-sizing: border-box;
 width: 42px;
 height: 42px;
 object-fit: cover;
}
.toast-title {
 padding: 12px;
 position: relative;
 box-sizing: border-box;
 color: #eee;
 font-size: 16px;
 font-weight: bold;
 font-family: 'Roboto', Tahoma, Geneva, Verdana, sans-serif;
}
.toast-msg {
 padding: 12px;
 position: relative;
 box-sizing: border-box;
 color: #eee;
 font-size: 16px;
 font-family: 'Roboto', Tahoma, Geneva, Verdana, sans-serif;
}
#toasts {
    position: absolute;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    max-width: 100%;
    padding: 10px;
    overflow: hidden;
}
#toast {
    height: 43px;
    opacity: 1;
    margin-top: 5px;
    margin-bottom: 5px;
    overflow: hidden;
    margin: 5px 0;
    border-radius: 3px;
    box-shadow: 0 0 4px 0 #000;
    box-sizing: border-box;
    display: block;
    z-index: 1001;
    position: relative;
}
.toast.group {
    display: inline-flex;
    box-sizing: border-box;
    border-radius: 3px;
    color: #eee;
    font-size: 16px;
    background-color: #262626;
    vertical-align: bottom;
}
#toast.show {
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}
@-webkit-keyframes fadein {
  from {right: -30%; opacity: 0;}
  to {right: 1%; opacity: 1;}
}
@keyframes fadein {
  from {right: -30%; opacity: 0;}
  to {right: 1%; opacity: 1;}
}
@-webkit-keyframes fadeout {
  from {right: 1%; opacity: 1;}
  to {right: -30%; opacity: 0;}
}
@keyframes fadeout {
  from {right: 1%; opacity: 1;}
  to {right: -30%; opacity: 0;}
}
.button {
  background-color: transparent;
  border: 2px solid #e0e1e2;
  color: #e0e1e2;
  padding: 16px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  transition-duration: 0.4s;
  cursor: pointer;
  border-radius: 5px;
  font-family: 'Nunito', sans-serif;
  font-weight: bold;
}
.button:hover {  color: rgba(0,0,0,.6); background: #cacbcd }
.switch {
	position: relative;
	display: inline-block;
    width: 60px;
    height: 34px;
	border-radius:40px;
	border:2px solid #e0e1e2;
}
.switch input { 
  opacity: 0;
}
.slider {
        position: absolute;
	cursor:pointer;
	top:0;
	left:0;
	right:0;
	bottom:0;
	border-radius: 34px;
	-webkit-transition:.5s;
}
.slider:before {
	position: absolute;
	content:"";
    height: 26px;
    width: 26px;
	top:3px;
	left:4px;
	background-color: #e0e1e2;
	-webkit-transition:.5s;
}
input:checked + .slider:before{
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}
.slider:before {
  border-radius: 50%;
}
.list-group {
 align-items: center;
 display: flex;
 padding-left: 10px;
 padding-right: 10px;
 padding-top: 20px;
 justify-content: space-between;
}
.list-group .label {
 display: inline-block;
 color: white;
 font-family: 'Nunito', sans-serif;
 font-weight: bold;
}
.DropZone {
 width: 200px;
 max-width: 200px;
 height: 200px;
 padding: 25px;
 display: flex;
 align-items: center;
 justify-content: center;
 border: 4px dashed #e0e1e27a;
 cursor:pointer;
}
.DropZone:hover {
 border-color: #cacbcd;
}
.DropZone.Error {
 border: 4px dashed #ff00007a;
}
.DropZone.Error:hover {
 border: 4px dashed #ff003b;
}
.DropZone.Error div{
 color: #ff003b;
}
.DropZone div{
    text-align: center;
    font-family: 'Nunito', sans-serif;
    font-weight: 500;
    font-size: 20px;
    color: lightgray;
    position: relative;
}
.Fileİnput {
    display: none;
}
.DropThumb {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  background-color: #cccccc;
  background-size: cover;
  position: relative;
}
.DropThumb::after {
  content: attr(data-label);
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 5px 0;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.75);
  font-size: 14px;
  text-align: center;
}
.options-menu {
  background-color: #e0e1e2;
  width: 200px;
  position: relative;
  display: inline-block;
  border-radius: 5px;
}
.select-style {
  background-color: transparent;
  border: none;
  padding: 5px 10px;
  font-size: 16px;
  color: #555;
  width: 100%;
  border-radius: 5px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  cursor: pointer;
  outline: none;
  font-family: 'Nunito', sans-serif;
  font-weight: bold;
}
.select-style:after {
  content: "\f107";
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}
.select-style option {
  background-color: #e0e1e2;
  color: #555;
  font-size: 16px;
  padding: 5px 10px;
  cursor: pointer;
}
.select-style option:checked {
  background-color: #8f8f8f;
  color: #fff;
}

.list-group.Input input {
  font-size: 16px;
  padding: 10px;
  background-color: #e0e1e2;
  border-radius: 9px;
  font-family: 'Nunito', sans-serif;
  font-weight: bold;
  border: 4px solid;
}

.list-group.Input .input {
  width: 200px;
}

.list-group.Input input:focus {
  outline: none;
  border: 4px solid #007fff;
}

`;
document.getElementsByTagName('head')[0].appendChild(style);

var CreateToasts = document.createElement("div");
var CreateMenus = document.createElement("div");
var close_button = document.createElement("button");
window.addEventListener('load', (event) => {
  CreateToasts.setAttribute("id", "toasts");
  document.body.prepend(CreateToasts);
  CreateMenus.setAttribute("class", "menus open");
  document.body.prepend(CreateMenus);
  var blur_bg = document.createElement("div");
  blur_bg.setAttribute("class", "bg-blur");
  CreateMenus.prepend(blur_bg);
  close_button.setAttribute("class", "close-button");
  close_button.setAttribute("title", "Close");
  CreateMenus.prepend(close_button);
  console.log('%c╦═══════════════════════════╦\n║Anonim Biri - Abnormal-Menu║\n╩═══════════════════════════╩\n%cGtihub doc: %chttps://github.com/anonimbiri/Abnormal-Menu\n\n%cNote: %cthis doesn\'t give you cheats, it\'s a ui design.', 'font-weight: bold; font-size: 50px;color: rgb(255, 10, 63); text-shadow: 3px 3px 0 rgb(64, 1, 25)', 'font-weight: bold; font-size: 15px;color: rgb(245, 236, 66); text-shadow: 1px 1px 0 rgb(145, 140, 33)', 'font-weight: bold; font-size: 15px;color: rgb(240, 239, 233); text-shadow: 1px 1px 0 rgb(145, 145, 144)', 'font-weight: bold; font-size: 15px;color: rgb(245, 236, 66); text-shadow: 1px 1px 0 rgb(145, 140, 33)', 'font-weight: bold; font-size: 15px;color: rgb(240, 239, 233); text-shadow: 1px 1px 0 rgb(145, 145, 144)');
});

class SendToast {
  constructor(options) {
    var toast = document.createElement("div");
    toast.setAttribute("id", "toast");
    toast.classList.add('show');
    CreateToasts.prepend(toast);
    var ToastGroup = document.createElement("div");
    ToastGroup.setAttribute("class", "toast group");
    toast.prepend(ToastGroup);
    if (!options) console.error("Data is empty");
    if (options.message) var CreateMsgToast = document.createElement("span");
    if (options.message) CreateMsgToast.setAttribute("class", "toast-msg");
    if (options.message) ToastGroup.prepend(CreateMsgToast);
    if (options.title) var CreateTitleToast = document.createElement("span");
    if (options.title) CreateTitleToast.setAttribute("class", "toast-title");
    if (options.title) ToastGroup.prepend(CreateTitleToast);
    if (options.icon) var CreateimageToast = document.createElement("img");
    if (options.icon) CreateimageToast.setAttribute("class", "toast-img");
    if (options.icon) CreateimageToast.setAttribute("src", options.icon);
    if (options.icon) ToastGroup.prepend(CreateimageToast);
    if (options.type) var CreateColorToast = document.createElement("span");
    if (options.type) CreateColorToast.setAttribute("class", "toast-color");
    if (options.type) ToastGroup.prepend(CreateColorToast);
    if (options.title) CreateTitleToast.innerText = options.title;
    if (options.message) CreateMsgToast.innerText = options.message;
    switch (options.type) {
      case "Success":
        ToastGroup.querySelector('.toast-color').setAttribute("class", "toast-color green");
        break;

      case "Error":
        ToastGroup.querySelector('.toast-color').setAttribute("class", "toast-color red");
        break;

      case "Warning":
        ToastGroup.querySelector('.toast-color').setAttribute("class", "toast-color yellow");
        break;

      case "Info":
        ToastGroup.querySelector('.toast-color').setAttribute("class", "toast-color blue");
        break;
    }

    setTimeout(function () { toast.remove(); }, 2900);
    return toast;
  }
}

class CreateMenu {
  constructor(options) {
    this.title = options.title;
    this.menuItems = [];
    this.menuItemsContainer = null;

    const Menu = document.createElement("div");
    Menu.setAttribute("class", "menu");
    Menu.style.width = `${options.width}px`;
    Menu.style.height = `${options.height}px`;
    Menu.style.left = `${options.startX}px`;
    Menu.style.top = `${options.startY}px`;
    CreateMenus.prepend(Menu);
    const gradient_slider = document.createElement("div");
    gradient_slider.setAttribute("class", "gradient-slider");
    Menu.prepend(gradient_slider);
    const menu_items = document.createElement("div");
    menu_items.setAttribute("class", "menu-items");
    menu_items.style.width = `${options.width}px`;
    menu_items.style.height = `${options.height - 40}px`
    Menu.append(menu_items);
    this.menuItemsContainer = menu_items;
    if (options.title) var menu_title = document.createElement("div");
    if (options.title) menu_title.setAttribute("class", "title");
    if (options.title) menu_title.textContent = options.title;
    if (options.title) gradient_slider.prepend(menu_title);
    if (options.pin == true) var pin_button = document.createElement("button");
    if (options.pin == true) pin_button.setAttribute("class", "pin-button");
    if (options.pin == true) gradient_slider.prepend(pin_button);
    if (options.pin == true) pin_button.addEventListener("click", (e) => { if (Menu.classList.contains('pinned')) { Menu.classList.remove('pinned'); } else { Menu.classList.add('pinned'); } });

    let scaleFactor = 1.4;
    window.addEventListener('resize', () => {
      let width = window.innerWidth - (window.innerWidth < 1920 ? 180 : 320);
      let e = width / 1150;
      let scale = e < scaleFactor ? e / scaleFactor : 1;
      Menu.style.transform = `scale(${scale})`;
      Menu.style.transformOrigin = 'center';
    });



    gradient_slider.addEventListener("mousedown", (e) => {
      let initialX = e.clientX;
      let initialY = e.clientY;

      function moveMenu(e) {
        let currentX = e.clientX;
        let currentY = e.clientY;
        let diffX = currentX - initialX;
        let diffY = currentY - initialY;
        Menu.style.left = `${Menu.offsetLeft + diffX}px`;
        Menu.style.top = `${Menu.offsetTop + diffY}px`;
        initialX = currentX;
        initialY = currentY;
      }

      function removeListeners() {
        document.removeEventListener("mousemove", moveMenu);
        document.removeEventListener("mouseup", removeListeners);
      }

      document.addEventListener("mousemove", moveMenu);
      document.addEventListener("mouseup", removeListeners);
    });


  }

  addButton(options) {
    var Group = document.createElement("div");
    Group.setAttribute("class", "list-group Buton");
    this.menuItemsContainer.append(Group);
    var Text = document.createElement("div");
    Text.setAttribute("class", "label");
    if (options.label) Text.innerText = options.label;
    Group.append(Text);
    var Button = document.createElement("button");
    Button.setAttribute("class", "button");
    Button.innerText = options.title;
    Group.append(Button);
    this.menuItems.push(Group);


    const self = {
      element: Button,
      html: () => self.element,
      on: (event, callback) => {
        self.element.addEventListener(event, callback);
      }
    };
    return self;
  }

  addSwitch(options) {
    var ToggleSwitch = document.createElement("div");
    ToggleSwitch.setAttribute("class", "list-group toggle-switch");
    this.menuItemsContainer.append(ToggleSwitch);
    var Text = document.createElement("div");
    Text.setAttribute("class", "label");
    Text.innerText = options.label;
    ToggleSwitch.append(Text);
    var Label = document.createElement("label");
    Label.setAttribute("class", "switch");
    ToggleSwitch.append(Label);
    var checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    if (options.value) checkbox.checked = options.value;
    Label.append(checkbox);
    var slider = document.createElement("span");
    slider.setAttribute("class", "slider");
    Label.append(slider);
    this.menuItems.push(ToggleSwitch);

    const self = {
      element: ToggleSwitch,
      html: () => self.element,
      on: (event, callback) => {
        self.element.addEventListener(event, callback);
      },
      getValue: () => checkbox.checked
    };
    return self;
  }

  addFileDrop(options) {
    var Group = document.createElement("div");
    Group.setAttribute("class", "list-group FileDrop");
    this.menuItemsContainer.append(Group);
    var Text = document.createElement("div");
    Text.setAttribute("class", "label");
    Text.innerText = options.label;
    Group.append(Text);
    var DropZone = document.createElement("div");
    DropZone.setAttribute("class", "DropZone");
    Group.append(DropZone);
    var Title = document.createElement("div");
    Title.innerText = options.title;
    DropZone.append(Title);
    var Thumb = document.createElement("div");
    Thumb.setAttribute("class", "DropThumb");
    Thumb.setAttribute("style", "display: none;");
    DropZone.append(Thumb);
    var Fileİnput = document.createElement("input");
    Fileİnput.setAttribute("class", "Fileİnput");
    Fileİnput.setAttribute("type", "file");
    Fileİnput.setAttribute("accept", "image/*");
    DropZone.append(Fileİnput);
    this.menuItems.push(Group);


    Fileİnput.addEventListener('change', function (e) {
      if (!e.target.files.length) e.target.parentElement.classList.add('Error');
      if (e.target.files.length) updateThumbnail(e.target.files[0]);
      const myEvent = new CustomEvent("Filedrop", { detail: e.target.files });
      DropZone.dispatchEvent(myEvent);
    });

    DropZone.addEventListener('click', function (e) {
      e.target.classList.remove('Error');
      Fileİnput.click();
    });

    DropZone.addEventListener("dragover", function (e) {
      e.preventDefault();
    });

    DropZone.addEventListener('drop', function (e) {
      e.preventDefault();
      if (e.dataTransfer.files.length) {
        e.target.classList.remove('Error');

        const myEvent = new CustomEvent("Filedrop", { detail: e.dataTransfer.files });
        DropZone.dispatchEvent(myEvent);
        updateThumbnail(e.dataTransfer.files[0]);
      } else {
        e.target.classList.add('Error');
      }
    });

    function updateThumbnail(file) {

      if (Thumb) {
        Thumb.dataset.label = file.name;
        if (file.type.startsWith("image/")) {
          var reader = new FileReader();

          reader.onload = function (e) {
            Thumb.style.backgroundImage = `url('${e.target.result}')`;
            Thumb.style.display = null;
            Title.style.display = "none";
          }

          reader.readAsDataURL(file);
        } else {
          Thumb.style.backgroundImage = null;
          Title.style.display = null;
        }
      }
    }


    const self =
    {
      element: DropZone,
      html: () => self.element,
      on: (event, callback) => {
        self.element.addEventListener(event, callback);
      }
    }
    return self;
  }

  addSelectMenu(options) {
    var Group = document.createElement("div");
    Group.setAttribute("class", "list-group FileDrop");
    this.menuItemsContainer.append(Group);
    var Text = document.createElement("div");
    Text.setAttribute("class", "label");
    Text.innerText = options.label;
    Group.append(Text);
    const optionsMenu = document.createElement("div");
    optionsMenu.setAttribute("class", "options-menu");
    Group.appendChild(optionsMenu);
    const select = document.createElement("select");
    select.setAttribute("class", "select-style");
    if (options.value) select.value = options.value;
    optionsMenu.appendChild(select);
    if (options.options && options.options.length > 0) {
      for (let i = 0; i < options.options.length; i++) {
        const option = document.createElement("option");
        option.setAttribute("value", options.options[i].value);
        option.textContent = options.options[i].name;
        select.appendChild(option);
      }
    }
    this.menuItems.push(Group);

    const self =
    {
      element: select,
      html: () => self.element,
      changeSelectedIndex: (Index) => {
        self.element.selectedIndex = Index;
      },
      addItem: (name, value) => {
        const option = document.createElement("option");
        option.setAttribute("value", value);
        option.textContent = name;
        select.appendChild(option);
      },
      removeItem: (value) => {
        const options = select.querySelectorAll('option');
        options.forEach((option) => {
          if (option.value === value) {
            option.remove();
          }
        });
      },
      clearAllItems: () => {
        const options = select.querySelectorAll('option');
        for (let i = 0; i < options.length; i++) {
          const option = options[i];
          option.remove();
        }
      },
      getValue: () => self.element.value,
      on: (event, callback) => {
        self.element.addEventListener(event, callback);
      }
    }
    return self;
  }

  addHotkey(options) {
    if (options.keyevent instanceof KeyboardEvent) {
      var Group = document.createElement("div");
      Group.setAttribute("class", "list-group Buton");
      this.menuItemsContainer.append(Group);
      var Text = document.createElement("div");
      Text.setAttribute("class", "label");
      if (options.label) Text.innerText = options.label;
      Group.append(Text);
      var Button = document.createElement("button");
      Button.setAttribute("class", "button");
      if (options.keyevent.ctrlKey) {
        Button.innerText = `CTRL + ${options.keyevent.key.toUpperCase()}`;
      } else if (options.keyevent.altKey) {
        Button.innerText = `ALT + ${options.keyevent.key.toUpperCase()}`;
      } else if (options.keyevent.shiftKey) {
        Button.innerText = `SHIFT + ${options.keyevent.key.toUpperCase()}`;
      } else {
        Button.innerText = `${options.keyevent.key.toUpperCase()}`;
      }
      Group.append(Button);
      this.menuItems.push(Group);

      Button.addEventListener("click", () => {
        Button.innerText = `...`;
        document.addEventListener("keyup", handleKeyDown);
      });

      function handleKeyDown(event) {
        event.preventDefault();

        // Kontrol tuşlarına basılıysa, basılan tuşa göre değil de
        // kontrol tuşu kombinasyonuna göre hareket et.
        if (event.ctrlKey) {
          Button.innerText = `CTRL + ${event.key.toUpperCase()}`;
        } else if (event.altKey) {
          Button.innerText = `ALT + ${event.key.toUpperCase()}`;
        } else if (event.shiftKey) {
          Button.innerText = `SHIFT + ${event.key.toUpperCase()}`;
        } else {
          Button.innerText = `${event.key.toUpperCase()}`;
        }

        const myEvent = new CustomEvent("Hotkey", { detail: event });
        Button.dispatchEvent(myEvent);
        document.removeEventListener("keyup", handleKeyDown);
      }

      const self = {
        element: Button,
        html: () => self.element,
        on: (event, callback) => {
          self.element.addEventListener(event, callback);
        },
      };
      return self;

    } else {
      console.error("this is not a KeyboardEvent");
    }
  }

  addInput(options) {
    var Group = document.createElement("div");
    Group.setAttribute("class", "list-group Input");
    this.menuItemsContainer.append(Group);
    var Text = document.createElement("div");
    Text.setAttribute("class", "label");
    if (options.label) Text.innerText = options.label;
    Group.append(Text);
    var Input = document.createElement("input");
    Input.setAttribute("class", "input");
    if (options.placeholder) Input.setAttribute("placeholder", options.placeholder);
    Input.setAttribute("type", options.type === "number" ? "number" : "text");
    if (options.value) Input.value = options.value;
    if (options.min) Input.setAttribute("min", options.min);
    if (options.max) Input.setAttribute("max", options.max);
    Group.append(Input);
    Input.addEventListener("input", function() {
      if (Input.validity.rangeOverflow) {
        Input.value = Input.max;
      } else if (Input.validity.rangeUnderflow) {
        Input.value = Input.min;
      }
    });
    this.menuItems.push(Group);

    const self = {
      element: Input,
      html: () => self.element,
      on: (event, callback) => {
        self.element.addEventListener(event, callback);
      },
      changeValue: (text) => {
        self.element.value = text;
      },
      getValue: () => self.element.value,
    };
    return self;
  }
}

MenuShowHide = function () {
  if (document.querySelector('.menus').className.split(' ').indexOf('open') != -1) {
    document.querySelector('.menus').classList.add('close');
    document.querySelector('.menus').classList.remove('open');
  } else {
    document.querySelector('.menus').classList.add('open');
    document.querySelector('.menus').classList.remove('close');
    document.querySelector('.menus').removeAttribute("style");
  }
}

close_button.addEventListener('click', function () {
  MenuShowHide();
});
