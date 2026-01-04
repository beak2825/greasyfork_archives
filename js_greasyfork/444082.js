// ==UserScript==
// @name        易优批量新增模型字段 
// @namespace   Violentmonkey Scripts
// @include https://www.eyoucms.com/
// @match       http://*/*/login.php?m=admin&c=Field&a=channel_index&channel_id=*&lang=cn
// @grant       none
// @version     1.0
// @author      sunzehui
// @license MIT
// @description 2022/4/27 11:36:36
// @downloadURL https://update.greasyfork.org/scripts/444082/%E6%98%93%E4%BC%98%E6%89%B9%E9%87%8F%E6%96%B0%E5%A2%9E%E6%A8%A1%E5%9E%8B%E5%AD%97%E6%AE%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/444082/%E6%98%93%E4%BC%98%E6%89%B9%E9%87%8F%E6%96%B0%E5%A2%9E%E6%A8%A1%E5%9E%8B%E5%AD%97%E6%AE%B5.meta.js
// ==/UserScript==

function init(){
  
    const parent =  $(".flexigrid");
  parent.children(".mDiv").append(`<div class="ftitle">
								<div class="fbutton">
                    <a href="javascript:void(0);" id="batchInsert" >
				        <div class="add" title="新增字段">
				            <span><i class="layui-icon layui-icon-addition"></i>批量新增</span>
				        </div>
				    </a>
				</div>
				            </div>`)
  $('#batchInsert').on("click", showBox)

}
let isBoxShow = false
function showBox(){
  console.log(isBoxShow)
  if(!isBoxShow){
    isBoxShow = true
  }else{
    $(".flexigrid .bDiv").empty();
    isBoxShow=false
  }
const style =document.createElement("style");style.innerHTML= `*,
::before,
::after {
  box-sizing: border-box;
  /* 1 */
  border-width: 0;
  /* 2 */
  border-style: solid;
  /* 2 */
  border-color: #e5e7eb;
  /* 2 */
}
input[type="text"], input[type="password"], textarea, select, .editable, .editable2, .editable-tarea, .editable-tarea2{
}
.editable, .editable2, input[type="text"], input[type="password"]{
height:50px;
line-height:auto;
font-size:1em;
}/*
! tailwindcss v3.0.24 | MIT License | https://tailwindcss.com
*/

/*
1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)
*/

*,
::before,
::after {
  box-sizing: border-box;
  /* 1 */
  border-width: 0;
  /* 2 */
  border-style: solid;
  /* 2 */
  border-color: #e5e7eb;
  /* 2 */
}

::before,
::after {
  --tw-content: "";
}

/*
1. Use a consistent sensible line-height in all browsers.
2. Prevent adjustments of font size after orientation changes in iOS.
3. Use a more readable tab size.
4. Use the user's configured sans font-family by default.
*/

html {
  line-height: 1.5;
  /* 1 */
  -webkit-text-size-adjust: 100%;
  /* 2 */
  -moz-tab-size: 4;
  /* 3 */
  -o-tab-size: 4;
  tab-size: 4;
  /* 3 */
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  /* 4 */
}

/*
1. Remove the margin in all browsers.
2. Inherit line-height from html so users can set them as a class directly on the html element.
*/

body {
  margin: 0;
  /* 1 */
  line-height: inherit;
  /* 2 */
}

/*
1. Add the correct height in Firefox.
2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
3. Ensure horizontal rules are visible by default.
*/

hr {
  height: 0;
  /* 1 */
  color: inherit;
  /* 2 */
  border-top-width: 1px;
  /* 3 */
}

/*
Add the correct text decoration in Chrome, Edge, and Safari.
*/

abbr:where([title]) {
  -webkit-text-decoration: underline dotted;
  text-decoration: underline dotted;
}

/*
Remove the default font size and weight for headings.
*/

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: inherit;
}

/*
Reset links to optimize for opt-in styling instead of opt-out.
*/

a {
  color: inherit;
  text-decoration: inherit;
}

/*
Add the correct font weight in Edge and Safari.
*/

b,
strong {
  font-weight: bolder;
}

/*
1. Use the user's configured mono font family by default.
2. Correct the odd em font sizing in all browsers.
*/

code,
kbd,
samp,
pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
  /* 1 */
  font-size: 1em;
  /* 2 */
}

/*
Add the correct font size in all browsers.
*/

small {
  font-size: 80%;
}

/*
Prevent sub and sup elements from affecting the line height in all browsers.
*/

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/*
1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
3. Remove gaps between table borders by default.
*/

table {
  text-indent: 0;
  /* 1 */
  border-color: inherit;
  /* 2 */
  border-collapse: collapse;
  /* 3 */
}

/*
1. Change the font styles in all browsers.
2. Remove the margin in Firefox and Safari.
3. Remove default padding in all browsers.
*/

button,
input,
optgroup,
select,
textarea {
  font-family: inherit;
  /* 1 */
  font-size: 100%;
  /* 1 */
  line-height: inherit;
  /* 1 */
  color: inherit;
  /* 1 */
  margin: 0;
  /* 2 */
  padding: 0;
  /* 3 */
}

/*
Remove the inheritance of text transform in Edge and Firefox.
*/

button,
select {
  text-transform: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Remove default button styles.
*/

button,
[type="button"],
[type="reset"],
[type="submit"] {
  -webkit-appearance: button;
  /* 1 */
  background-color: transparent;
  /* 2 */
  background-image: none;
  /* 2 */
}

/*
Use the modern Firefox focus style for all focusable elements.
*/

:-moz-focusring {
  outline: auto;
}

/*
Remove the additional :invalid styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
*/

:-moz-ui-invalid {
  box-shadow: none;
}

/*
Add the correct vertical alignment in Chrome and Firefox.
*/

progress {
  vertical-align: baseline;
}

/*
Correct the cursor style of increment and decrement buttons in Safari.
*/

::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  height: auto;
}

/*
1. Correct the odd appearance in Chrome and Safari.
2. Correct the outline style in Safari.
*/

[type="search"] {
  -webkit-appearance: textfield;
  /* 1 */
  outline-offset: -2px;
  /* 2 */
}

/*
Remove the inner padding in Chrome and Safari on macOS.
*/

::-webkit-search-decoration {
  -webkit-appearance: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Change font properties to inherit in Safari.
*/

::-webkit-file-upload-button {
  -webkit-appearance: button;
  /* 1 */
  font: inherit;
  /* 2 */
}

/*
Add the correct display in Chrome and Safari.
*/

summary {
  display: list-item;
}

/*
Removes the default spacing and border for appropriate elements.
*/

blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
figure,
p,
pre {
  margin: 0;
}

fieldset {
  margin: 0;
  padding: 0;
}

legend {
  padding: 0;
}

ol,
ul,
menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

/*
Prevent resizing textareas horizontally by default.
*/

textarea {
  resize: vertical;
}

/*
1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
2. Set the default placeholder color to the user's configured gray 400 color.
*/

input::-moz-placeholder,
textarea::-moz-placeholder {
  opacity: 1;
  /* 1 */
  color: #9ca3af;
  /* 2 */
}

input:-ms-input-placeholder,
textarea:-ms-input-placeholder {
  opacity: 1;
  /* 1 */
  color: #9ca3af;
  /* 2 */
}

input::placeholder,
textarea::placeholder {
  opacity: 1;
  /* 1 */
  color: #9ca3af;
  /* 2 */
}

/*
Set the default cursor for buttons.
*/

button,
[role="button"] {
  cursor: pointer;
}

/*
Make sure disabled buttons don't get the pointer cursor.
*/

:disabled {
  cursor: default;
}

/*
1. Make replaced elements display: block by default. (https://github.com/mozdevs/cssremedy/issues/14)
2. Add vertical-align: middle to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
   This can trigger a poorly considered lint error in some tools but is included by design.
*/

img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block;
  /* 1 */
  vertical-align: middle;
  /* 2 */
}

/*
Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
*/

img,
video {
  max-width: 100%;
  height: auto;
}

/*
Ensure the default browser behavior of the hidden attribute.
*/

[hidden] {
  display: none;
}

[type="text"],
[type="email"],
[type="url"],
[type="password"],
[type="number"],
[type="date"],
[type="datetime-local"],
[type="month"],
[type="search"],
[type="tel"],
[type="time"],
[type="week"],
[multiple],
textarea,
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #fff;
  border-color: #6b7280;
  border-width: 1px;
  border-radius: 0px;
  padding-top: 0.5rem;
  padding-right: 0.75rem;
  padding-bottom: 0.5rem;
  padding-left: 0.75rem;
  font-size: 1rem;
  line-height: 1.5rem;
  --tw-shadow: 0 0 #0000;
}

[type="text"]:focus,
[type="email"]:focus,
[type="url"]:focus,
[type="password"]:focus,
[type="number"]:focus,
[type="date"]:focus,
[type="datetime-local"]:focus,
[type="month"]:focus,
[type="search"]:focus,
[type="tel"]:focus,
[type="time"]:focus,
[type="week"]:focus,
[multiple]:focus,
textarea:focus,
select:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  --tw-ring-inset: var(--tw-empty, /*!*/ /*!*/);
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: #2563eb;
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
    var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
    calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
    var(--tw-shadow);
  border-color: #2563eb;
}

input::-moz-placeholder,
textarea::-moz-placeholder {
  color: #6b7280;
  opacity: 1;
}

input:-ms-input-placeholder,
textarea:-ms-input-placeholder {
  color: #6b7280;
  opacity: 1;
}

input::placeholder,
textarea::placeholder {
  color: #6b7280;
  opacity: 1;
}

::-webkit-datetime-edit-fields-wrapper {
  padding: 0;
}

::-webkit-date-and-time-value {
  min-height: 1.5em;
}

::-webkit-datetime-edit,
::-webkit-datetime-edit-year-field,
::-webkit-datetime-edit-month-field,
::-webkit-datetime-edit-day-field,
::-webkit-datetime-edit-hour-field,
::-webkit-datetime-edit-minute-field,
::-webkit-datetime-edit-second-field,
::-webkit-datetime-edit-millisecond-field,
::-webkit-datetime-edit-meridiem-field {
  padding-top: 0;
  padding-bottom: 0;
}

select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  -webkit-print-color-adjust: exact;
  color-adjust: exact;
}

[multiple] {
  background-image: initial;
  background-position: initial;
  background-repeat: unset;
  background-size: initial;
  padding-right: 0.75rem;
  -webkit-print-color-adjust: unset;
  color-adjust: unset;
}

[type="checkbox"],
[type="radio"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  padding: 0;
  -webkit-print-color-adjust: exact;
  color-adjust: exact;
  display: inline-block;
  vertical-align: middle;
  background-origin: border-box;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  flex-shrink: 0;
  height: 1rem;
  width: 1rem;
  color: #2563eb;
  background-color: #fff;
  border-color: #6b7280;
  border-width: 1px;
  --tw-shadow: 0 0 #0000;
}

[type="checkbox"] {
  border-radius: 0px;
}

[type="radio"] {
  border-radius: 100%;
}

[type="checkbox"]:focus,
[type="radio"]:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  --tw-ring-inset: var(--tw-empty, /*!*/ /*!*/);
  --tw-ring-offset-width: 2px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: #2563eb;
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
    var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
    calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
    var(--tw-shadow);
}

[type="checkbox"]:checked,
[type="radio"]:checked {
  border-color: transparent;
  background-color: currentColor;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}

[type="checkbox"]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
}

[type="radio"]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e");
}

[type="checkbox"]:checked:hover,
[type="checkbox"]:checked:focus,
[type="radio"]:checked:hover,
[type="radio"]:checked:focus {
  border-color: transparent;
  background-color: currentColor;
}

[type="checkbox"]:indeterminate {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 16'%3e%3cpath stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 8h8'/%3e%3c/svg%3e");
  border-color: transparent;
  background-color: currentColor;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}

[type="checkbox"]:indeterminate:hover,
[type="checkbox"]:indeterminate:focus {
  border-color: transparent;
  background-color: currentColor;
}

[type="file"] {
  background: unset;
  border-color: inherit;
  border-width: 0;
  border-radius: 0;
  padding: 0;
  font-size: unset;
  line-height: inherit;
}

[type="file"]:focus {
  outline: 1px auto -webkit-focus-ring-color;
}

*,
::before,
::after {
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x: ;
  --tw-pan-y: ;
  --tw-pinch-zoom: ;
  --tw-scroll-snap-strictness: proximity;
  --tw-ordinal: ;
  --tw-slashed-zero: ;
  --tw-numeric-figure: ;
  --tw-numeric-spacing: ;
  --tw-numeric-fraction: ;
  --tw-ring-inset: ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur: ;
  --tw-brightness: ;
  --tw-contrast: ;
  --tw-grayscale: ;
  --tw-hue-rotate: ;
  --tw-invert: ;
  --tw-saturate: ;
  --tw-sepia: ;
  --tw-drop-shadow: ;
  --tw-backdrop-blur: ;
  --tw-backdrop-brightness: ;
  --tw-backdrop-contrast: ;
  --tw-backdrop-grayscale: ;
  --tw-backdrop-hue-rotate: ;
  --tw-backdrop-invert: ;
  --tw-backdrop-opacity: ;
  --tw-backdrop-saturate: ;
  --tw-backdrop-sepia: ;
}

.container {
  width: 100%;
}

@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}

@media (min-width: 1536px) {
  .container {
    max-width: 1536px;
  }
}

.col-span-6 {
  grid-column: span 6 / span 6;
}

.col-span-2 {
  grid-column: span 2 / span 2;
}

.col-span-4 {
  grid-column: span 4 / span 4;
}

.col-span-1 {
  grid-column: span 1 / span 1;
}

.col-end-8 {
  grid-column-end: 8;
}

.col-end-4 {
  grid-column-end: 4;
}

.col-end-2 {
  grid-column-end: 2;
}

.col-end-3 {
  grid-column-end: 3;
}

.col-end-1 {
  grid-column-end: 1;
}

.col-end-auto {
  grid-column-end: auto;
}

.col-end-5 {
  grid-column-end: 5;
}

.col-end-7 {
  grid-column-end: 7;
}

.col-end-6 {
  grid-column-end: 6;
}

.row-span-2 {
  grid-row: span 2 / span 2;
}

.row-auto {
  grid-row: auto;
}

.mt-5 {
  margin-top: 1.25rem;
}

.mt-4 {
  margin-top: 1rem;
}

.ml-3 {
  margin-left: 0.75rem;
}

.mt-1 {
  margin-top: 0.25rem;
}

.block {
  display: block;
}

.flex {
  display: flex;
}

.inline-flex {
  display: inline-flex;
}

.table {
  display: table;
}

.grid {
  display: grid;
}

.h-screen {
  height: 100vh;
}

.h-4 {
  height: 1rem;
}

.w-3\/4 {
  width: 75%;
}

.w-4 {
  width: 1rem;
}

.w-full {
  width: 100%;
}

.grid-cols-6 {
  grid-template-columns: repeat(6, minmax(0, 1fr));
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.gap-6 {
  gap: 1.5rem;
}

.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1rem * var(--tw-space-y-reverse));
}

.place-self-center {
  place-self: center;
}

.self-end {
  align-self: flex-end;
}

.overflow-hidden {
  overflow: hidden;
}

.whitespace-nowrap {
  white-space: nowrap;
}

.rounded-md {
  border-radius: 0.375rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.border {
  border-width: 1px;
}

.border-gray-300 {
  --tw-border-opacity: 1;
  border-color: rgb(209 213 219 / var(--tw-border-opacity));
}

.border-transparent {
  border-color: transparent;
}

.bg-white {
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity));
}

.bg-gray-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(249 250 251 / var(--tw-bg-opacity));
}

.bg-indigo-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(79 70 229 / var(--tw-bg-opacity));
}

.p-4 {
  padding: 1rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-5 {
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.px-60 {
  padding-left: 15rem;
  padding-right: 15rem;
}

.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.px-10 {
  padding-left: 2.5rem;
  padding-right: 2.5rem;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.font-medium {
  font-weight: 500;
}

.font-bold {
  font-weight: 700;
}

.font-normal {
  font-weight: 400;
}

.text-indigo-600 {
  --tw-text-opacity: 1;
  color: rgb(79 70 229 / var(--tw-text-opacity));
}

.text-gray-700 {
  --tw-text-opacity: 1;
  color: rgb(55 65 81 / var(--tw-text-opacity));
}

.text-black {
  --tw-text-opacity: 1;
  color: rgb(0 0 0 / var(--tw-text-opacity));
}

.text-gray-900 {
  --tw-text-opacity: 1;
  color: rgb(17 24 39 / var(--tw-text-opacity));
}

.text-white {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
}

.shadow {
  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color),
    0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
    var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-sm {
  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
    var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.table-wrapper table tbody tr {
  --tw-text-opacity: 1;
  color: rgb(55 65 81 / var(--tw-text-opacity));
}

.table-wrapper table tbody tr td {
  border-width: 1px;
  padding: 1rem;
}

.hover\:bg-indigo-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(67 56 202 / var(--tw-bg-opacity));
}

.focus\:border-indigo-500:focus {
  --tw-border-opacity: 1;
  border-color: rgb(99 102 241 / var(--tw-border-opacity));
}

.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
    var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
    calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
    var(--tw-shadow, 0 0 #0000);
}

.focus\:ring-indigo-500:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(99 102 241 / var(--tw-ring-opacity));
}

.focus\:ring-offset-2:focus {
  --tw-ring-offset-width: 2px;
}

@media (min-width: 640px) {
  .sm\:col-span-3 {
    grid-column: span 3 / span 3;
  }

  .sm\:rounded-md {
    border-radius: 0.375rem;
  }

  .sm\:p-6 {
    padding: 1.5rem;
  }

  .sm\:px-6 {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  .sm\:text-sm {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
}

@media (min-width: 768px) {
  .md\:col-span-2 {
    grid-column: span 2 / span 2;
  }

  .md\:mt-0 {
    margin-top: 0px;
  }

  .md\:grid {
    display: grid;
  }

  .md\:grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .md\:gap-6 {
    gap: 1.5rem;
  }
}
.shadow-md {
    --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    border-top:1px solid gainsboro;
}
body > div.page > div.fixed-bar > div > ul > li > a{
border:none
}
`;
  const elemDiv = $(`
  
  <div class="container shadow-md">
    <div class="md:grid md:grid-cols-1 w-3/4 md:gap-6">
      <div class="mt-5 md:mt-0 md:col-span-2">
        <div class="shadow overflow-hidden sm:rounded-md">
          <div class="px-4 py-5 bg-white sm:p-6 text-black">
            <div class="grid grid-cols-6 gap-6">

              <fieldset class="col-span-6 row-span-2 sm:col-span-3">
                <div class="mt-4 space-y-4">
                  <div class="flex items-center">
                    <input id="push-everything" name="push-notifications" type="radio" value="text"
                      class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300">
                    <label for="push-everything" class="ml-3 block text-sm font-medium text-gray-700">单行文本
                    </label>
                  </div>
                  <div class="flex items-center">
                    <input id="push-email" name="push-notifications" type="radio" value="multitext"
                      class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300">
                    <label for="push-email" class="ml-3 block text-sm font-medium text-gray-700"> 多行文本</label>
                  </div>
                  <div class="flex items-center">
                    <input id="push-nothing" name="push-notifications" type="radio" value="img"
                      class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300">
                    <label for="push-nothing" class="ml-3 block text-sm font-medium text-gray-700"> 图片 </label>
                  </div>
                  <div class="flex items-center">
                    <input id="push-test" name="push-notifications" type="radio" value="imgs"
                      class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300">
                    <label for="push-test" class="ml-3 block text-sm font-medium text-gray-700"> 多图片 </label>
                  </div>
                </div>
              </fieldset>


              <div class="col-span-6 sm:col-span-3 row-auto">
                <label for="title" class="block text-sm font-medium text-gray-700">标题</label>
                <input type="text" name="title" id="title" autocomplete="given-name"
                  class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
              </div>
              <div class="col-span-6 sm:col-span-3 row-auto">
                <label for="field" class="block text-sm font-medium text-gray-700">字段名</label>
                <input type="text" name="field" id="field" autocomplete="family-name"
                  class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
              </div>
              <div class="col-span-1 ">
                <label for="pageid" class="block text-sm font-medium text-gray-700">单页ID</label>
                <input type="text" name="pageid" id="pageid" autocomplete="pageid"
                  class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
              </div>
              <div class="col-span-1 ">
                <label for="startIndex" class="block text-sm font-medium text-gray-700">开始下标</label>
                <input type="text" name="startIndex" id="startIndex" autocomplete="startIndex"
                  class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
              </div>
              <div class="col-span-1 ">
                <label for="number" class="block text-sm font-medium text-gray-700">生成数量</label>
                <input type="text" name="number" id="number" autocomplete="number"
                  class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
              </div>
              <div class="col-span-1  place-self-center self-end ">
                <button type="submit" id="gen-btn"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">生成</button>
              </div>
 <div class="col-span-1 col-end-7 self-end place-self-center">
                <a href="#" class="block text-sm font-medium text-indigo-600 ">显示帮助</a>
              </div>

            </div>
            <div class="table-wrapper grid grid-cols-1">
              <h2 class="heading text-black text-center text-lg font-bold py-2">
                将会添加...
              </h2>
              <table class="table p-4 bg-white shadow rounded-lg">
                <thead>
                  <tr>
                    <th class="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900">
                      单页ID
                    </th>
                    <th class="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900">
                      标题
                    </th>
                    <th class="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900">
                      字段名
                    </th>
                    <th class="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900">
                      类型
                    </th>
                  </tr>
                </thead>
                <tbody id="tbody">
                </tbody>
              </table>

            </div>
          </div>
          <div class="col-span-6 px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button type="submit" id="submit-btn"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">确定</button>
          </div>
        </div>
      </div>
    </div>
  </div>
`)
 document.head.appendChild(style);
  document.querySelector("body > div.page").style.height = '100%'
  const parent =  $(".flexigrid");
    parent.css({
    height:'100%',
      overflow:'scroll'
  })
  
  const contentBox = parent.children(".bDiv");
  
  contentBox.empty()
  contentBox.append(elemDiv)
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.onclick = () => insert2Eyou(waitToPush);
  
  
  parent.children(".hDiv").empty();
  parent.children(".tDiv").empty();
}


 function render2Table(data) {
      const tbody = $('#tbody');
      data.forEach(element => {
        const row = $(`
          <tr>
            <td>
            ${element.id}
              </td>
                    <td>
            
                      ${element.title}
                      </td>
                    <td>
            
                      ${element.field}
                      </td>
                    <td>
            
                      ${element.type}
                      </td>
                  </tr>
          
          
          `);
        tbody.append(row);
      });
    }

  const waitToPush = []
$(document).ready(function(){
  if(location.href.includes("eyoucms")){
    return
  }
   init();

  
  $("#gen-btn").on("click", ()=>{
    
const type = $('input[name="push-notifications"]:checked').val();
      const channel_id = new URLSearchParams(location.href).get("channel_id")
      const page_id = [$('#pageid').val()];
      const cnt =Number( $('#number').val());;
      const startIndex = Number($("#startIndex").val());
                         
      // 替换变量
      for (let i = startIndex; i < startIndex+cnt; i++) {
        const reg = new RegExp(`\\$d`, 'g');
        _titile = $("#title").val().replace(reg, i);
        _fieldName = $("#field").val().replace(reg, i);

        waitToPush.push({
          title: _titile,
          field: _fieldName,
          page_id,
          type,
          channel_id
        })
      }

      console.log(waitToPush);

      render2Table(waitToPush)
  })
  

  
    })

    function insertOne(elem) {
      return new Promise((resolve, reject) => $.ajax("login.php?m=admin&c=Field&a=channel_add&_ajax=1&lang=cn", {
        type: "post",
        data: {
          title: elem.title,
          name: elem.field,
          dtype: elem.type,
          "region_data[region_id]": "",
          "region_data[region_names]": "",
          "region_data[region_ids]": '',
          dfvalue: '',
          dfvalue_unit: '',
          IsScreening_status: 0,
          remark: '',
          "typeids": elem.page_id,
          channel_id: elem.channel_id,
        },
        success(d) {
          resolve(d)
        },
        error(e) {
          reject(e)
        }
      }))
    }

   async function insert2Eyou(data) {
      try {
        for (const elem of data) {
          const result = await insertOne(elem)
          console.log({ elem, result })
        }
      } catch (error) {
        console.log({ error })
      }

    }
    function render2Table(data) {
      const tbody = $('#tbody');
      tbody.empty();
      data.forEach(element => {
        const row = $(`
          <tr>
            <td>
            ${element.page_id}
              </td>
                    <td>
            
                      ${element.title}
                      </td>
                    <td>
            
                      ${element.field}
                      </td>
                    <td>
            
                      ${element.type}
                      </td>
                  </tr>
          
          
          `);
        tbody.append(row);
      });
    }
