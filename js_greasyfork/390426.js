
document.querySelector("head").innerHTML+=`
<style id="js-bulma-framework" type="text/css">
.bulma {}

@keyframes spinAround { from { transform: rotate(0deg); }
  to { transform: rotate(359deg); } }

.bulma .delete, .bulma .modal-close, .bulma .is-unselectable, .bulma .button, .bulma .file, .bulma .breadcrumb, .bulma .pagination-previous, .bulma .pagination-next, .bulma .pagination-link, .bulma .pagination-ellipsis, .bulma .tabs { -webkit-touch-callout: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }

.bulma .select:not(.is-multiple):not(.is-loading)::after, .bulma .navbar-link:not(.is-arrowless)::after { border: 3px solid transparent; border-radius: 2px; border-right: 0; border-top: 0; content: " "; display: block; height: 0.625em; margin-top: -0.4375em; pointer-events: none; position: absolute; top: 50%; transform: rotate(-45deg); transform-origin: center; width: 0.625em; }

.bulma .box:not(:last-child), .bulma .content:not(:last-child), .bulma .notification:not(:last-child), .bulma .progress:not(:last-child), .bulma .table:not(:last-child), .bulma .table-container:not(:last-child), .bulma .title:not(:last-child), .bulma .subtitle:not(:last-child), .bulma .block:not(:last-child), .bulma .highlight:not(:last-child), .bulma .breadcrumb:not(:last-child), .bulma .level:not(:last-child), .bulma .list:not(:last-child), .bulma .message:not(:last-child), .bulma .tabs:not(:last-child) { margin-bottom: 1.5rem; }

.bulma .delete, .bulma .modal-close { -moz-appearance: none; -webkit-appearance: none; background-color: rgba(10, 10, 10, 0.2); border: none; border-radius: 290486px; cursor: pointer; pointer-events: auto; display: inline-block; flex-grow: 0; flex-shrink: 0; font-size: 0; height: 20px; max-height: 20px; max-width: 20px; min-height: 20px; min-width: 20px; outline: none; position: relative; vertical-align: top; width: 20px; }

.bulma .delete::before, .bulma .modal-close::before, .bulma .delete::after, .bulma .modal-close::after { background-color: white; content: ""; display: block; left: 50%; position: absolute; top: 50%; transform: translateX(-50%) translateY(-50%) rotate(45deg); transform-origin: center center; }

.bulma .delete::before, .bulma .modal-close::before { height: 2px; width: 50%; }

.bulma .delete::after, .bulma .modal-close::after { height: 50%; width: 2px; }

.bulma .delete:hover, .bulma .modal-close:hover, .bulma .delete:focus, .bulma .modal-close:focus { background-color: rgba(10, 10, 10, 0.3); }

.bulma .delete:active, .bulma .modal-close:active { background-color: rgba(10, 10, 10, 0.4); }

.bulma .is-small.delete, .bulma .is-small.modal-close { height: 16px; max-height: 16px; max-width: 16px; min-height: 16px; min-width: 16px; width: 16px; }

.bulma .is-medium.delete, .bulma .is-medium.modal-close { height: 24px; max-height: 24px; max-width: 24px; min-height: 24px; min-width: 24px; width: 24px; }

.bulma .is-large.delete, .bulma .is-large.modal-close { height: 32px; max-height: 32px; max-width: 32px; min-height: 32px; min-width: 32px; width: 32px; }

.bulma .button.is-loading::after, .bulma .loader, .bulma .select.is-loading::after, .bulma .control.is-loading::after { animation: spinAround 500ms infinite linear; border: 2px solid #dbdbdb; border-radius: 290486px; border-right-color: transparent; border-top-color: transparent; content: ""; display: block; height: 1em; position: relative; width: 1em; }

.bulma .is-overlay, .bulma .image.is-square img, .bulma .image.is-square .has-ratio, .bulma .image.is-1by1 img, .bulma .image.is-1by1 .has-ratio, .bulma .image.is-5by4 img, .bulma .image.is-5by4 .has-ratio, .bulma .image.is-4by3 img, .bulma .image.is-4by3 .has-ratio, .bulma .image.is-3by2 img, .bulma .image.is-3by2 .has-ratio, .bulma .image.is-5by3 img, .bulma .image.is-5by3 .has-ratio, .bulma .image.is-16by9 img, .bulma .image.is-16by9 .has-ratio, .bulma .image.is-2by1 img, .bulma .image.is-2by1 .has-ratio, .bulma .image.is-3by1 img, .bulma .image.is-3by1 .has-ratio, .bulma .image.is-4by5 img, .bulma .image.is-4by5 .has-ratio, .bulma .image.is-3by4 img, .bulma .image.is-3by4 .has-ratio, .bulma .image.is-2by3 img, .bulma .image.is-2by3 .has-ratio, .bulma .image.is-3by5 img, .bulma .image.is-3by5 .has-ratio, .bulma .image.is-9by16 img, .bulma .image.is-9by16 .has-ratio, .bulma .image.is-1by2 img, .bulma .image.is-1by2 .has-ratio, .bulma .image.is-1by3 img, .bulma .image.is-1by3 .has-ratio, .bulma .modal, .bulma .modal-background, .bulma .hero-video { bottom: 0; left: 0; position: absolute; right: 0; top: 0; }

.bulma .button, .bulma .input, .bulma .textarea, .bulma .select select, .bulma .file-cta, .bulma .file-name, .bulma .pagination-previous, .bulma .pagination-next, .bulma .pagination-link, .bulma .pagination-ellipsis { -moz-appearance: none; -webkit-appearance: none; align-items: center; border: 1px solid transparent; border-radius: 4px; box-shadow: none; display: inline-flex; font-size: 1rem; height: 2.25em; justify-content: flex-start; line-height: 1.5; padding-bottom: calc(0.375em - 1px); padding-left: calc(0.625em - 1px); padding-right: calc(0.625em - 1px); padding-top: calc(0.375em - 1px); position: relative; vertical-align: top; }

.bulma .button:focus, .bulma .input:focus, .bulma .textarea:focus, .bulma .select select:focus, .bulma .file-cta:focus, .bulma .file-name:focus, .bulma .pagination-previous:focus, .bulma .pagination-next:focus, .bulma .pagination-link:focus, .bulma .pagination-ellipsis:focus, .bulma .is-focused.button, .bulma .is-focused.input, .bulma .is-focused.textarea, .bulma .select select.is-focused, .bulma .is-focused.file-cta, .bulma .is-focused.file-name, .bulma .is-focused.pagination-previous, .bulma .is-focused.pagination-next, .bulma .is-focused.pagination-link, .bulma .is-focused.pagination-ellipsis, .bulma .button:active, .bulma .input:active, .bulma .textarea:active, .bulma .select select:active, .bulma .file-cta:active, .bulma .file-name:active, .bulma .pagination-previous:active, .bulma .pagination-next:active, .bulma .pagination-link:active, .bulma .pagination-ellipsis:active, .bulma .is-active.button, .bulma .is-active.input, .bulma .is-active.textarea, .bulma .select select.is-active, .bulma .is-active.file-cta, .bulma .is-active.file-name, .bulma .is-active.pagination-previous, .bulma .is-active.pagination-next, .bulma .is-active.pagination-link, .bulma .is-active.pagination-ellipsis { outline: none; }

.bulma .button[disabled], .bulma .input[disabled], .bulma .textarea[disabled], .bulma .select select[disabled], .bulma .file-cta[disabled], .bulma .file-name[disabled], .bulma .pagination-previous[disabled], .bulma .pagination-next[disabled], .bulma .pagination-link[disabled], .bulma .pagination-ellipsis[disabled], fieldset[disabled] .bulma .button, fieldset[disabled] .bulma .input, fieldset[disabled] .bulma .textarea, fieldset[disabled] .bulma .select select, fieldset[disabled] .bulma .file-cta, fieldset[disabled] .bulma .file-name, fieldset[disabled] .bulma .pagination-previous, fieldset[disabled] .bulma .pagination-next, fieldset[disabled] .bulma .pagination-link, fieldset[disabled] .bulma .pagination-ellipsis { cursor: not-allowed; }

.bulma, .bulma p, .bulma ol, .bulma ul, .bulma li, .bulma dl, .bulma dt, .bulma dd, .bulma blockquote, .bulma figure, .bulma fieldset, .bulma legend, .bulma textarea, .bulma pre, .bulma iframe, .bulma hr, .bulma h1, .bulma h2, .bulma h3, .bulma h4, .bulma h5, .bulma h6 { margin: 0; padding: 0; }

.bulma h1, .bulma h2, .bulma h3, .bulma h4, .bulma h5, .bulma h6 { font-size: 100%; font-weight: normal; }

.bulma ul { list-style: none; }

.bulma button, .bulma input, .bulma select, .bulma textarea { margin: 0; }

.bulma { box-sizing: border-box; }

.bulma *, .bulma *::before, .bulma *::after { box-sizing: inherit; }

.bulma img, .bulma embed, .bulma iframe, .bulma object, .bulma video { height: auto; max-width: 100%; }

.bulma audio { max-width: 100%; }

.bulma iframe { border: 0; }

.bulma table { border-collapse: collapse; border-spacing: 0; }

.bulma td, .bulma th { padding: 0; }

.bulma td:not([align]), .bulma th:not([align]) { text-align: left; }

.bulma {font-size: 16px; -moz-osx-font-smoothing: grayscale; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; text-size-adjust: 100%; }

.bulma article, .bulma aside, .bulma figure, .bulma footer, .bulma header, .bulma hgroup, .bulma section { display: block; }

.bulma button, .bulma input, .bulma select, .bulma textarea { font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif; }

.bulma code, .bulma pre { -moz-osx-font-smoothing: auto; -webkit-font-smoothing: auto; font-family: monospace; }

.bulma { font-size: 1em; font-weight: 400; line-height: 1.5; }

.bulma a { color: #3273dc; cursor: pointer; text-decoration: none; }

.bulma a strong { color: currentColor; }

.bulma a:hover { color: #363636; }

.bulma code { background-color: whitesmoke; color: #ff3860; font-size: 0.875em; font-weight: normal; padding: 0.25em 0.5em 0.25em; }

.bulma hr { background-color: whitesmoke; border: none; display: block; height: 2px; margin: 1.5rem 0; }

.bulma img { height: auto; max-width: 100%; }

.bulma input[type="checkbox"], .bulma input[type="radio"] { vertical-align: baseline; }

.bulma small { font-size: 0.875em; }

.bulma span { font-style: inherit; font-weight: inherit; }

.bulma strong { color: #363636; font-weight: 700; }

.bulma fieldset { border: none; }

.bulma pre { -webkit-overflow-scrolling: touch; background-color: whitesmoke; color: #4a4a4a; font-size: 0.875em; overflow-x: auto; padding: 1.25rem 1.5rem; white-space: pre; word-wrap: normal; }

.bulma pre code { background-color: transparent; color: currentColor; font-size: 1em; padding: 0; }

.bulma table td, .bulma table th { vertical-align: top; }

.bulma table td:not([align]), .bulma table th:not([align]) { text-align: left; }

.bulma table th { color: #363636; }

.bulma .is-clearfix::after { clear: both; content: " "; display: table; }

.bulma .is-pulled-left { float: left !important; }

.bulma .is-pulled-right { float: right !important; }

.bulma .is-clipped { overflow: hidden !important; }

.bulma .is-size-1 { font-size: 3rem !important; }

.bulma .is-size-2 { font-size: 2.5rem !important; }

.bulma .is-size-3 { font-size: 2rem !important; }

.bulma .is-size-4 { font-size: 1.5rem !important; }

.bulma .is-size-5 { font-size: 1.25rem !important; }

.bulma .is-size-6 { font-size: 1rem !important; }

.bulma .is-size-7 { font-size: 0.75rem !important; }

@media screen and (max-width: 768px) { .bulma .is-size-1-mobile { font-size: 3rem !important; }
  .bulma .is-size-2-mobile { font-size: 2.5rem !important; }
  .bulma .is-size-3-mobile { font-size: 2rem !important; }
  .bulma .is-size-4-mobile { font-size: 1.5rem !important; }
  .bulma .is-size-5-mobile { font-size: 1.25rem !important; }
  .bulma .is-size-6-mobile { font-size: 1rem !important; }
  .bulma .is-size-7-mobile { font-size: 0.75rem !important; } }

@media screen and (min-width: 769px), print { .bulma .is-size-1-tablet { font-size: 3rem !important; }
  .bulma .is-size-2-tablet { font-size: 2.5rem !important; }
  .bulma .is-size-3-tablet { font-size: 2rem !important; }
  .bulma .is-size-4-tablet { font-size: 1.5rem !important; }
  .bulma .is-size-5-tablet { font-size: 1.25rem !important; }
  .bulma .is-size-6-tablet { font-size: 1rem !important; }
  .bulma .is-size-7-tablet { font-size: 0.75rem !important; } }

@media screen and (max-width: 1023px) { .bulma .is-size-1-touch { font-size: 3rem !important; }
  .bulma .is-size-2-touch { font-size: 2.5rem !important; }
  .bulma .is-size-3-touch { font-size: 2rem !important; }
  .bulma .is-size-4-touch { font-size: 1.5rem !important; }
  .bulma .is-size-5-touch { font-size: 1.25rem !important; }
  .bulma .is-size-6-touch { font-size: 1rem !important; }
  .bulma .is-size-7-touch { font-size: 0.75rem !important; } }

@media screen and (min-width: 1024px) { .bulma .is-size-1-desktop { font-size: 3rem !important; }
  .bulma .is-size-2-desktop { font-size: 2.5rem !important; }
  .bulma .is-size-3-desktop { font-size: 2rem !important; }
  .bulma .is-size-4-desktop { font-size: 1.5rem !important; }
  .bulma .is-size-5-desktop { font-size: 1.25rem !important; }
  .bulma .is-size-6-desktop { font-size: 1rem !important; }
  .bulma .is-size-7-desktop { font-size: 0.75rem !important; } }

@media screen and (min-width: 1216px) { .bulma .is-size-1-widescreen { font-size: 3rem !important; }
  .bulma .is-size-2-widescreen { font-size: 2.5rem !important; }
  .bulma .is-size-3-widescreen { font-size: 2rem !important; }
  .bulma .is-size-4-widescreen { font-size: 1.5rem !important; }
  .bulma .is-size-5-widescreen { font-size: 1.25rem !important; }
  .bulma .is-size-6-widescreen { font-size: 1rem !important; }
  .bulma .is-size-7-widescreen { font-size: 0.75rem !important; } }

@media screen and (min-width: 1408px) { .bulma .is-size-1-fullhd { font-size: 3rem !important; }
  .bulma .is-size-2-fullhd { font-size: 2.5rem !important; }
  .bulma .is-size-3-fullhd { font-size: 2rem !important; }
  .bulma .is-size-4-fullhd { font-size: 1.5rem !important; }
  .bulma .is-size-5-fullhd { font-size: 1.25rem !important; }
  .bulma .is-size-6-fullhd { font-size: 1rem !important; }
  .bulma .is-size-7-fullhd { font-size: 0.75rem !important; } }

.bulma .has-text-centered { text-align: center !important; }

.bulma .has-text-justified { text-align: justify !important; }

.bulma .has-text-left { text-align: left !important; }

.bulma .has-text-right { text-align: right !important; }

@media screen and (max-width: 768px) { .bulma .has-text-centered-mobile { text-align: center !important; } }

@media screen and (min-width: 769px), print { .bulma .has-text-centered-tablet { text-align: center !important; } }

@media screen and (min-width: 769px) and (max-width: 1023px) { .bulma .has-text-centered-tablet-only { text-align: center !important; } }

@media screen and (max-width: 1023px) { .bulma .has-text-centered-touch { text-align: center !important; } }

@media screen and (min-width: 1024px) { .bulma .has-text-centered-desktop { text-align: center !important; } }

@media screen and (min-width: 1024px) and (max-width: 1215px) { .bulma .has-text-centered-desktop-only { text-align: center !important; } }

@media screen and (min-width: 1216px) { .bulma .has-text-centered-widescreen { text-align: center !important; } }

@media screen and (min-width: 1216px) and (max-width: 1407px) { .bulma .has-text-centered-widescreen-only { text-align: center !important; } }

@media screen and (min-width: 1408px) { .bulma .has-text-centered-fullhd { text-align: center !important; } }

@media screen and (max-width: 768px) { .bulma .has-text-justified-mobile { text-align: justify !important; } }

@media screen and (min-width: 769px), print { .bulma .has-text-justified-tablet { text-align: justify !important; } }

@media screen and (min-width: 769px) and (max-width: 1023px) { .bulma .has-text-justified-tablet-only { text-align: justify !important; } }

@media screen and (max-width: 1023px) { .bulma .has-text-justified-touch { text-align: justify !important; } }

@media screen and (min-width: 1024px) { .bulma .has-text-justified-desktop { text-align: justify !important; } }

@media screen and (min-width: 1024px) and (max-width: 1215px) { .bulma .has-text-justified-desktop-only { text-align: justify !important; } }

@media screen and (min-width: 1216px) { .bulma .has-text-justified-widescreen { text-align: justify !important; } }

@media screen and (min-width: 1216px) and (max-width: 1407px) { .bulma .has-text-justified-widescreen-only { text-align: justify !important; } }

@media screen and (min-width: 1408px) { .bulma .has-text-justified-fullhd { text-align: justify !important; } }

@media screen and (max-width: 768px) { .bulma .has-text-left-mobile { text-align: left !important; } }

@media screen and (min-width: 769px), print { .bulma .has-text-left-tablet { text-align: left !important; } }

@media screen and (min-width: 769px) and (max-width: 1023px) { .bulma .has-text-left-tablet-only { text-align: left !important; } }

@media screen and (max-width: 1023px) { .bulma .has-text-left-touch { text-align: left !important; } }

@media screen and (min-width: 1024px) { .bulma .has-text-left-desktop { text-align: left !important; } }

@media screen and (min-width: 1024px) and (max-width: 1215px) { .bulma .has-text-left-desktop-only { text-align: left !important; } }

@media screen and (min-width: 1216px) { .bulma .has-text-left-widescreen { text-align: left !important; } }

@media screen and (min-width: 1216px) and (max-width: 1407px) { .bulma .has-text-left-widescreen-only { text-align: left !important; } }

@media screen and (min-width: 1408px) { .bulma .has-text-left-fullhd { text-align: left !important; } }

@media screen and (max-width: 768px) { .bulma .has-text-right-mobile { text-align: right !important; } }

@media screen and (min-width: 769px), print { .bulma .has-text-right-tablet { text-align: right !important; } }

@media screen and (min-width: 769px) and (max-width: 1023px) { .bulma .has-text-right-tablet-only { text-align: right !important; } }

@media screen and (max-width: 1023px) { .bulma .has-text-right-touch { text-align: right !important; } }

@media screen and (min-width: 1024px) { .bulma .has-text-right-desktop { text-align: right !important; } }

@media screen and (min-width: 1024px) and (max-width: 1215px) { .bulma .has-text-right-desktop-only { text-align: right !important; } }

@media screen and (min-width: 1216px) { .bulma .has-text-right-widescreen { text-align: right !important; } }

@media screen and (min-width: 1216px) and (max-width: 1407px) { .bulma .has-text-right-widescreen-only { text-align: right !important; } }

@media screen and (min-width: 1408px) { .bulma .has-text-right-fullhd { text-align: right !important; } }

.bulma .is-capitalized { text-transform: capitalize !important; }

.bulma .is-lowercase { text-transform: lowercase !important; }

.bulma .is-uppercase { text-transform: uppercase !important; }

.bulma .is-italic { font-style: italic !important; }

.bulma .has-text-white { color: white !important; }

.bulma a.has-text-white:hover, .bulma a.has-text-white:focus { color: #e6e6e6 !important; }

.bulma .has-background-white { background-color: white !important; }

.bulma .has-text-black { color: #0a0a0a !important; }

.bulma a.has-text-black:hover, .bulma a.has-text-black:focus { color: black !important; }

.bulma .has-background-black { background-color: #0a0a0a !important; }

.bulma .has-text-light { color: whitesmoke !important; }

.bulma a.has-text-light:hover, .bulma a.has-text-light:focus { color: #dbdbdb !important; }

.bulma .has-background-light { background-color: whitesmoke !important; }

.bulma .has-text-dark { color: #363636 !important; }

.bulma a.has-text-dark:hover, .bulma a.has-text-dark:focus { color: #1c1c1c !important; }

.bulma .has-background-dark { background-color: #363636 !important; }

.bulma .has-text-primary { color: #00d1b2 !important; }

.bulma a.has-text-primary:hover, .bulma a.has-text-primary:focus { color: #009e86 !important; }

.bulma .has-background-primary { background-color: #00d1b2 !important; }

.bulma .has-text-link { color: #3273dc !important; }

.bulma a.has-text-link:hover, .bulma a.has-text-link:focus { color: #205bbc !important; }

.bulma .has-background-link { background-color: #3273dc !important; }

.bulma .has-text-info { color: #209cee !important; }

.bulma a.has-text-info:hover, .bulma a.has-text-info:focus { color: #0f81cc !important; }

.bulma .has-background-info { background-color: #209cee !important; }

.bulma .has-text-success { color: #23d160 !important; }

.bulma a.has-text-success:hover, .bulma a.has-text-success:focus { color: #1ca64c !important; }

.bulma .has-background-success { background-color: #23d160 !important; }

.bulma .has-text-warning { color: #ffdd57 !important; }

.bulma a.has-text-warning:hover, .bulma a.has-text-warning:focus { color: #ffd324 !important; }

.bulma .has-background-warning { background-color: #ffdd57 !important; }

.bulma .has-text-danger { color: #ff3860 !important; }

.bulma a.has-text-danger:hover, .bulma a.has-text-danger:focus { color: #ff0537 !important; }

.bulma .has-background-danger { background-color: #ff3860 !important; }

.bulma .has-text-black-bis { color: #121212 !important; }

.bulma .has-background-black-bis { background-color: #121212 !important; }

.bulma .has-text-black-ter { color: #242424 !important; }

.bulma .has-background-black-ter { background-color: #242424 !important; }

.bulma .has-text-grey-darker { color: #363636 !important; }

.bulma .has-background-grey-darker { background-color: #363636 !important; }

.bulma .has-text-grey-dark { color: #4a4a4a !important; }

.bulma .has-background-grey-dark { background-color: #4a4a4a !important; }

.bulma .has-text-grey { color: #7a7a7a !important; }

.bulma .has-background-grey { background-color: #7a7a7a !important; }

.bulma .has-text-grey-light { color: #b5b5b5 !important; }

.bulma .has-background-grey-light { background-color: #b5b5b5 !important; }

.bulma .has-text-grey-lighter { color: #dbdbdb !important; }

.bulma .has-background-grey-lighter { background-color: #dbdbdb !important; }

.bulma .has-text-white-ter { color: whitesmoke !important; }

.bulma .has-background-white-ter { background-color: whitesmoke !important; }

.bulma .has-text-white-bis { color: #fafafa !important; }

.bulma .has-background-white-bis { background-color: #fafafa !important; }

.bulma .has-text-weight-light { font-weight: 300 !important; }

.bulma .has-text-weight-normal { font-weight: 400 !important; }

.bulma .has-text-weight-medium { font-weight: 500 !important; }

.bulma .has-text-weight-semibold { font-weight: 600 !important; }

.bulma .has-text-weight-bold { font-weight: 700 !important; }

.bulma .is-family-primary { font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif !important; }

.bulma .is-family-secondary { font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif !important; }

.bulma .is-family-sans-serif { font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif !important; }

.bulma .is-family-monospace { font-family: monospace !important; }

.bulma .is-family-code { font-family: monospace !important; }

.bulma .is-block { display: block !important; }

@media screen and (max-width: 768px) { .bulma .is-block-mobile { display: block !important; } }

@media screen and (min-width: 769px), print { .bulma .is-block-tablet { display: block !important; } }

@media screen and (min-width: 769px) and (max-width: 1023px) { .bulma .is-block-tablet-only { display: block !important; } }

@media screen and (max-width: 1023px) { .bulma .is-block-touch { display: block !important; } }

@media screen and (min-width: 1024px) { .bulma .is-block-desktop { display: block !important; } }

@media screen and (min-width: 1024px) and (max-width: 1215px) { .bulma .is-block-desktop-only { display: block !important; } }

@media screen and (min-width: 1216px) { .bulma .is-block-widescreen { display: block !important; } }

@media screen and (min-width: 1216px) and (max-width: 1407px) { .bulma .is-block-widescreen-only { display: block !important; } }

@media screen and (min-width: 1408px) { .bulma .is-block-fullhd { display: block !important; } }

.bulma .is-flex { display: flex !important; }

@media screen and (max-width: 768px) { .bulma .is-flex-mobile { display: flex !important; } }

@media screen and (min-width: 769px), print { .bulma .is-flex-tablet { display: flex !important; } }

@media screen and (min-width: 769px) and (max-width: 1023px) { .bulma .is-flex-tablet-only { display: flex !important; } }

@media screen and (max-width: 1023px) { .bulma .is-flex-touch { display: flex !important; } }

@media screen and (min-width: 1024px) { .bulma .is-flex-desktop { display: flex !important; } }

@media screen and (min-width: 1024px) and (max-width: 1215px) { .bulma .is-flex-desktop-only { display: flex !important; } }

@media screen and (min-width: 1216px) { .bulma .is-flex-widescreen { display: flex !important; } }

@media screen and (min-width: 1216px) and (max-width: 1407px) { .bulma .is-flex-widescreen-only { display: flex !important; } }

@media screen and (min-width: 1408px) { .bulma .is-flex-fullhd { display: flex !important; } }

.bulma .is-inline { display: inline !important; }

@media screen and (max-width: 768px) { .bulma .is-inline-mobile { display: inline !important; } }

@media screen and (min-width: 769px), print { .bulma .is-inline-tablet { display: inline !important; } }

@media screen and (min-width: 769px) and (max-width: 1023px) { .bulma .is-inline-tablet-only { display: inline !important; } }

@media screen and (max-width: 1023px) { .bulma .is-inline-touch { display: inline !important; } }

@media screen and (min-width: 1024px) { .bulma .is-inline-desktop { display: inline !important; } }

@media screen and (min-width: 1024px) and (max-width: 1215px) { .bulma .is-inline-desktop-only { display: inline !important; } }

@media screen and (min-width: 1216px) { .bulma .is-inline-widescreen { display: inline !important; } }

@media screen and (min-width: 1216px) and (max-width: 1407px) { .bulma .is-inline-widescreen-only { display: inline !important; } }

@media screen and (min-width: 1408px) { .bulma .is-inline-fullhd { display: inline !important; } }

.bulma .is-inline-block { display: inline-block !important; }

@media screen and (max-width: 768px) { .bulma .is-inline-block-mobile { display: inline-block !important; } }

@media screen and (min-width: 769px), print { .bulma .is-inline-block-tablet { display: inline-block !important; } }

@media screen and (min-width: 769px) and (max-width: 1023px) { .bulma .is-inline-block-tablet-only { display: inline-block !important; } }

@media screen and (max-width: 1023px) { .bulma .is-inline-block-touch { display: inline-block !important; } }

@media screen and (min-width: 1024px) { .bulma .is-inline-block-desktop { display: inline-block !important; } }

@media screen and (min-width: 1024px) and (max-width: 1215px) { .bulma .is-inline-block-desktop-only { display: inline-block !important; } }

@media screen and (min-width: 1216px) { .bulma .is-inline-block-widescreen { display: inline-block !important; } }

@media screen and (min-width: 1216px) and (max-width: 1407px) { .bulma .is-inline-block-widescreen-only { display: inline-block !important; } }

@media screen and (min-width: 1408px) { .bulma .is-inline-block-fullhd { display: inline-block !important; } }

.bulma .is-inline-flex { display: inline-flex !important; }

@media screen and (max-width: 768px) { .bulma .is-inline-flex-mobile { display: inline-flex !important; } }

@media screen and (min-width: 769px), print { .bulma .is-inline-flex-tablet { display: inline-flex !important; } }

@media screen and (min-width: 769px) and (max-width: 1023px) { .bulma .is-inline-flex-tablet-only { display: inline-flex !important; } }

@media screen and (max-width: 1023px) { .bulma .is-inline-flex-touch { display: inline-flex !important; } }

@media screen and (min-width: 1024px) { .bulma .is-inline-flex-desktop { display: inline-flex !important; } }

@media screen and (min-width: 1024px) and (max-width: 1215px) { .bulma .is-inline-flex-desktop-only { display: inline-flex !important; } }

@media screen and (min-width: 1216px) { .bulma .is-inline-flex-widescreen { display: inline-flex !important; } }

@media screen and (min-width: 1216px) and (max-width: 1407px) { .bulma .is-inline-flex-widescreen-only { display: inline-flex !important; } }

@media screen and (min-width: 1408px) { .bulma .is-inline-flex-fullhd { display: inline-flex !important; } }

.bulma .is-hidden { display: none !important; }

.bulma .is-sr-only { border: none !important; clip: rect(0, 0, 0, 0) !important; height: 0.01em !important; overflow: hidden !important; padding: 0 !important; position: absolute !important; white-space: nowrap !important; width: 0.01em !important; }

@media screen and (max-width: 768px) { .bulma .is-hidden-mobile { display: none !important; } }

@media screen and (min-width: 769px), print { .bulma .is-hidden-tablet { display: none !important; } }

@media screen and (min-width: 769px) and (max-width: 1023px) { .bulma .is-hidden-tablet-only { display: none !important; } }

@media screen and (max-width: 1023px) { .bulma .is-hidden-touch { display: none !important; } }

@media screen and (min-width: 1024px) { .bulma .is-hidden-desktop { display: none !important; } }

@media screen and (min-width: 1024px) and (max-width: 1215px) { .bulma .is-hidden-desktop-only { display: none !important; } }

@media screen and (min-width: 1216px) { .bulma .is-hidden-widescreen { display: none !important; } }

@media screen and (min-width: 1216px) and (max-width: 1407px) { .bulma .is-hidden-widescreen-only { display: none !important; } }

@media screen and (min-width: 1408px) { .bulma .is-hidden-fullhd { display: none !important; } }

.bulma .is-invisible { visibility: hidden !important; }

@media screen and (max-width: 768px) { .bulma .is-invisible-mobile { visibility: hidden !important; } }

@media screen and (min-width: 769px), print { .bulma .is-invisible-tablet { visibility: hidden !important; } }

@media screen and (min-width: 769px) and (max-width: 1023px) { .bulma .is-invisible-tablet-only { visibility: hidden !important; } }

@media screen and (max-width: 1023px) { .bulma .is-invisible-touch { visibility: hidden !important; } }

@media screen and (min-width: 1024px) { .bulma .is-invisible-desktop { visibility: hidden !important; } }

@media screen and (min-width: 1024px) and (max-width: 1215px) { .bulma .is-invisible-desktop-only { visibility: hidden !important; } }

@media screen and (min-width: 1216px) { .bulma .is-invisible-widescreen { visibility: hidden !important; } }

@media screen and (min-width: 1216px) and (max-width: 1407px) { .bulma .is-invisible-widescreen-only { visibility: hidden !important; } }

@media screen and (min-width: 1408px) { .bulma .is-invisible-fullhd { visibility: hidden !important; } }

.bulma .is-marginless { margin: 0 !important; }

.bulma .is-paddingless { padding: 0 !important; }

.bulma .is-radiusless { border-radius: 0 !important; }

.bulma .is-shadowless { box-shadow: none !important; }

.bulma .is-relative { position: relative !important; }

.bulma .box { background-color: white; border-radius: 6px; box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1); color: #4a4a4a; display: block; padding: 1.25rem; }

.bulma a.box:hover, .bulma a.box:focus { box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px #3273dc; }

.bulma a.box:active { box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.2), 0 0 0 1px #3273dc; }

.bulma .button { background-color: white; border-color: #dbdbdb; border-width: 1px; color: #363636; cursor: pointer; justify-content: center; padding-bottom: calc(0.375em - 1px); padding-left: 0.75em; padding-right: 0.75em; padding-top: calc(0.375em - 1px); text-align: center; white-space: nowrap; }

.bulma .button strong { color: inherit; }

.bulma .button .icon, .bulma .button .icon.is-small, .bulma .button .icon.is-medium, .bulma .button .icon.is-large { height: 1.5em; width: 1.5em; }

.bulma .button .icon:first-child:not(:last-child) { margin-left: calc(-0.375em - 1px); margin-right: 0.1875em; }

.bulma .button .icon:last-child:not(:first-child) { margin-left: 0.1875em; margin-right: calc(-0.375em - 1px); }

.bulma .button .icon:first-child:last-child { margin-left: calc(-0.375em - 1px); margin-right: calc(-0.375em - 1px); }

.bulma .button:hover, .bulma .button.is-hovered { border-color: #b5b5b5; color: #363636; }

.bulma .button:focus, .bulma .button.is-focused { border-color: #3273dc; color: #363636; }

.bulma .button:focus:not(:active), .bulma .button.is-focused:not(:active) { box-shadow: 0 0 0 0.125em rgba(50, 115, 220, 0.25); }

.bulma .button:active, .bulma .button.is-active { border-color: #4a4a4a; color: #363636; }

.bulma .button.is-text { background-color: transparent; border-color: transparent; color: #4a4a4a; text-decoration: underline; }

.bulma .button.is-text:hover, .bulma .button.is-text.is-hovered, .bulma .button.is-text:focus, .bulma .button.is-text.is-focused { background-color: whitesmoke; color: #363636; }

.bulma .button.is-text:active, .bulma .button.is-text.is-active { background-color: #e8e8e8; color: #363636; }

.bulma .button.is-text[disabled], fieldset[disabled] .bulma .button.is-text { background-color: transparent; border-color: transparent; box-shadow: none; }

.bulma .button.is-white { background-color: white; border-color: transparent; color: #0a0a0a; }

.bulma .button.is-white:hover, .bulma .button.is-white.is-hovered { background-color: #f9f9f9; border-color: transparent; color: #0a0a0a; }

.bulma .button.is-white:focus, .bulma .button.is-white.is-focused { border-color: transparent; color: #0a0a0a; }

.bulma .button.is-white:focus:not(:active), .bulma .button.is-white.is-focused:not(:active) { box-shadow: 0 0 0 0.125em rgba(255, 255, 255, 0.25); }

.bulma .button.is-white:active, .bulma .button.is-white.is-active { background-color: #f2f2f2; border-color: transparent; color: #0a0a0a; }

.bulma .button.is-white[disabled], fieldset[disabled] .bulma .button.is-white { background-color: white; border-color: transparent; box-shadow: none; }

.bulma .button.is-white.is-inverted { background-color: #0a0a0a; color: white; }

.bulma .button.is-white.is-inverted:hover, .bulma .button.is-white.is-inverted.is-hovered { background-color: black; }

.bulma .button.is-white.is-inverted[disabled], fieldset[disabled] .bulma .button.is-white.is-inverted { background-color: #0a0a0a; border-color: transparent; box-shadow: none; color: white; }

.bulma .button.is-white.is-loading::after { border-color: transparent transparent #0a0a0a #0a0a0a !important; }

.bulma .button.is-white.is-outlined { background-color: transparent; border-color: white; color: white; }

.bulma .button.is-white.is-outlined:hover, .bulma .button.is-white.is-outlined.is-hovered, .bulma .button.is-white.is-outlined:focus, .bulma .button.is-white.is-outlined.is-focused { background-color: white; border-color: white; color: #0a0a0a; }

.bulma .button.is-white.is-outlined.is-loading::after { border-color: transparent transparent white white !important; }

.bulma .button.is-white.is-outlined.is-loading:hover::after, .bulma .button.is-white.is-outlined.is-loading.is-hovered::after, .bulma .button.is-white.is-outlined.is-loading:focus::after, .bulma .button.is-white.is-outlined.is-loading.is-focused::after { border-color: transparent transparent #0a0a0a #0a0a0a !important; }

.bulma .button.is-white.is-outlined[disabled], fieldset[disabled] .bulma .button.is-white.is-outlined { background-color: transparent; border-color: white; box-shadow: none; color: white; }

.bulma .button.is-white.is-inverted.is-outlined { background-color: transparent; border-color: #0a0a0a; color: #0a0a0a; }

.bulma .button.is-white.is-inverted.is-outlined:hover, .bulma .button.is-white.is-inverted.is-outlined.is-hovered, .bulma .button.is-white.is-inverted.is-outlined:focus, .bulma .button.is-white.is-inverted.is-outlined.is-focused { background-color: #0a0a0a; color: white; }

.bulma .button.is-white.is-inverted.is-outlined.is-loading:hover::after, .bulma .button.is-white.is-inverted.is-outlined.is-loading.is-hovered::after, .bulma .button.is-white.is-inverted.is-outlined.is-loading:focus::after, .bulma .button.is-white.is-inverted.is-outlined.is-loading.is-focused::after { border-color: transparent transparent white white !important; }

.bulma .button.is-white.is-inverted.is-outlined[disabled], fieldset[disabled] .bulma .button.is-white.is-inverted.is-outlined { background-color: transparent; border-color: #0a0a0a; box-shadow: none; color: #0a0a0a; }

.bulma .button.is-black { background-color: #0a0a0a; border-color: transparent; color: white; }

.bulma .button.is-black:hover, .bulma .button.is-black.is-hovered { background-color: #040404; border-color: transparent; color: white; }

.bulma .button.is-black:focus, .bulma .button.is-black.is-focused { border-color: transparent; color: white; }

.bulma .button.is-black:focus:not(:active), .bulma .button.is-black.is-focused:not(:active) { box-shadow: 0 0 0 0.125em rgba(10, 10, 10, 0.25); }

.bulma .button.is-black:active, .bulma .button.is-black.is-active { background-color: black; border-color: transparent; color: white; }

.bulma .button.is-black[disabled], fieldset[disabled] .bulma .button.is-black { background-color: #0a0a0a; border-color: transparent; box-shadow: none; }

.bulma .button.is-black.is-inverted { background-color: white; color: #0a0a0a; }

.bulma .button.is-black.is-inverted:hover, .bulma .button.is-black.is-inverted.is-hovered { background-color: #f2f2f2; }

.bulma .button.is-black.is-inverted[disabled], fieldset[disabled] .bulma .button.is-black.is-inverted { background-color: white; border-color: transparent; box-shadow: none; color: #0a0a0a; }

.bulma .button.is-black.is-loading::after { border-color: transparent transparent white white !important; }

.bulma .button.is-black.is-outlined { background-color: transparent; border-color: #0a0a0a; color: #0a0a0a; }

.bulma .button.is-black.is-outlined:hover, .bulma .button.is-black.is-outlined.is-hovered, .bulma .button.is-black.is-outlined:focus, .bulma .button.is-black.is-outlined.is-focused { background-color: #0a0a0a; border-color: #0a0a0a; color: white; }

.bulma .button.is-black.is-outlined.is-loading::after { border-color: transparent transparent #0a0a0a #0a0a0a !important; }

.bulma .button.is-black.is-outlined.is-loading:hover::after, .bulma .button.is-black.is-outlined.is-loading.is-hovered::after, .bulma .button.is-black.is-outlined.is-loading:focus::after, .bulma .button.is-black.is-outlined.is-loading.is-focused::after { border-color: transparent transparent white white !important; }

.bulma .button.is-black.is-outlined[disabled], fieldset[disabled] .bulma .button.is-black.is-outlined { background-color: transparent; border-color: #0a0a0a; box-shadow: none; color: #0a0a0a; }

.bulma .button.is-black.is-inverted.is-outlined { background-color: transparent; border-color: white; color: white; }

.bulma .button.is-black.is-inverted.is-outlined:hover, .bulma .button.is-black.is-inverted.is-outlined.is-hovered, .bulma .button.is-black.is-inverted.is-outlined:focus, .bulma .button.is-black.is-inverted.is-outlined.is-focused { background-color: white; color: #0a0a0a; }

.bulma .button.is-black.is-inverted.is-outlined.is-loading:hover::after, .bulma .button.is-black.is-inverted.is-outlined.is-loading.is-hovered::after, .bulma .button.is-black.is-inverted.is-outlined.is-loading:focus::after, .bulma .button.is-black.is-inverted.is-outlined.is-loading.is-focused::after { border-color: transparent transparent #0a0a0a #0a0a0a !important; }

.bulma .button.is-black.is-inverted.is-outlined[disabled], fieldset[disabled] .bulma .button.is-black.is-inverted.is-outlined { background-color: transparent; border-color: white; box-shadow: none; color: white; }

.bulma .button.is-light { background-color: whitesmoke; border-color: transparent; color: #363636; }

.bulma .button.is-light:hover, .bulma .button.is-light.is-hovered { background-color: #eeeeee; border-color: transparent; color: #363636; }

.bulma .button.is-light:focus, .bulma .button.is-light.is-focused { border-color: transparent; color: #363636; }

.bulma .button.is-light:focus:not(:active), .bulma .button.is-light.is-focused:not(:active) { box-shadow: 0 0 0 0.125em rgba(245, 245, 245, 0.25); }

.bulma .button.is-light:active, .bulma .button.is-light.is-active { background-color: #e8e8e8; border-color: transparent; color: #363636; }

.bulma .button.is-light[disabled], fieldset[disabled] .bulma .button.is-light { background-color: whitesmoke; border-color: transparent; box-shadow: none; }

.bulma .button.is-light.is-inverted { background-color: #363636; color: whitesmoke; }

.bulma .button.is-light.is-inverted:hover, .bulma .button.is-light.is-inverted.is-hovered { background-color: #292929; }

.bulma .button.is-light.is-inverted[disabled], fieldset[disabled] .bulma .button.is-light.is-inverted { background-color: #363636; border-color: transparent; box-shadow: none; color: whitesmoke; }

.bulma .button.is-light.is-loading::after { border-color: transparent transparent #363636 #363636 !important; }

.bulma .button.is-light.is-outlined { background-color: transparent; border-color: whitesmoke; color: whitesmoke; }

.bulma .button.is-light.is-outlined:hover, .bulma .button.is-light.is-outlined.is-hovered, .bulma .button.is-light.is-outlined:focus, .bulma .button.is-light.is-outlined.is-focused { background-color: whitesmoke; border-color: whitesmoke; color: #363636; }

.bulma .button.is-light.is-outlined.is-loading::after { border-color: transparent transparent whitesmoke whitesmoke !important; }

.bulma .button.is-light.is-outlined.is-loading:hover::after, .bulma .button.is-light.is-outlined.is-loading.is-hovered::after, .bulma .button.is-light.is-outlined.is-loading:focus::after, .bulma .button.is-light.is-outlined.is-loading.is-focused::after { border-color: transparent transparent #363636 #363636 !important; }

.bulma .button.is-light.is-outlined[disabled], fieldset[disabled] .bulma .button.is-light.is-outlined { background-color: transparent; border-color: whitesmoke; box-shadow: none; color: whitesmoke; }

.bulma .button.is-light.is-inverted.is-outlined { background-color: transparent; border-color: #363636; color: #363636; }

.bulma .button.is-light.is-inverted.is-outlined:hover, .bulma .button.is-light.is-inverted.is-outlined.is-hovered, .bulma .button.is-light.is-inverted.is-outlined:focus, .bulma .button.is-light.is-inverted.is-outlined.is-focused { background-color: #363636; color: whitesmoke; }

.bulma .button.is-light.is-inverted.is-outlined.is-loading:hover::after, .bulma .button.is-light.is-inverted.is-outlined.is-loading.is-hovered::after, .bulma .button.is-light.is-inverted.is-outlined.is-loading:focus::after, .bulma .button.is-light.is-inverted.is-outlined.is-loading.is-focused::after { border-color: transparent transparent whitesmoke whitesmoke !important; }

.bulma .button.is-light.is-inverted.is-outlined[disabled], fieldset[disabled] .bulma .button.is-light.is-inverted.is-outlined { background-color: transparent; border-color: #363636; box-shadow: none; color: #363636; }

.bulma .button.is-dark { background-color: #363636; border-color: transparent; color: whitesmoke; }

.bulma .button.is-dark:hover, .bulma .button.is-dark.is-hovered { background-color: #2f2f2f; border-color: transparent; color: whitesmoke; }

.bulma .button.is-dark:focus, .bulma .button.is-dark.is-focused { border-color: transparent; color: whitesmoke; }

.bulma .button.is-dark:focus:not(:active), .bulma .button.is-dark.is-focused:not(:active) { box-shadow: 0 0 0 0.125em rgba(54, 54, 54, 0.25); }

.bulma .button.is-dark:active, .bulma .button.is-dark.is-active { background-color: #292929; border-color: transparent; color: whitesmoke; }

.bulma .button.is-dark[disabled], fieldset[disabled] .bulma .button.is-dark { background-color: #363636; border-color: transparent; box-shadow: none; }

.bulma .button.is-dark.is-inverted { background-color: whitesmoke; color: #363636; }

.bulma .button.is-dark.is-inverted:hover, .bulma .button.is-dark.is-inverted.is-hovered { background-color: #e8e8e8; }

.bulma .button.is-dark.is-inverted[disabled], fieldset[disabled] .bulma .button.is-dark.is-inverted { background-color: whitesmoke; border-color: transparent; box-shadow: none; color: #363636; }

.bulma .button.is-dark.is-loading::after { border-color: transparent transparent whitesmoke whitesmoke !important; }

.bulma .button.is-dark.is-outlined { background-color: transparent; border-color: #363636; color: #363636; }

.bulma .button.is-dark.is-outlined:hover, .bulma .button.is-dark.is-outlined.is-hovered, .bulma .button.is-dark.is-outlined:focus, .bulma .button.is-dark.is-outlined.is-focused { background-color: #363636; border-color: #363636; color: whitesmoke; }

.bulma .button.is-dark.is-outlined.is-loading::after { border-color: transparent transparent #363636 #363636 !important; }

.bulma .button.is-dark.is-outlined.is-loading:hover::after, .bulma .button.is-dark.is-outlined.is-loading.is-hovered::after, .bulma .button.is-dark.is-outlined.is-loading:focus::after, .bulma .button.is-dark.is-outlined.is-loading.is-focused::after { border-color: transparent transparent whitesmoke whitesmoke !important; }

.bulma .button.is-dark.is-outlined[disabled], fieldset[disabled] .bulma .button.is-dark.is-outlined { background-color: transparent; border-color: #363636; box-shadow: none; color: #363636; }

.bulma .button.is-dark.is-inverted.is-outlined { background-color: transparent; border-color: whitesmoke; color: whitesmoke; }

.bulma .button.is-dark.is-inverted.is-outlined:hover, .bulma .button.is-dark.is-inverted.is-outlined.is-hovered, .bulma .button.is-dark.is-inverted.is-outlined:focus, .bulma .button.is-dark.is-inverted.is-outlined.is-focused { background-color: whitesmoke; color: #363636; }

.bulma .button.is-dark.is-inverted.is-outlined.is-loading:hover::after, .bulma .button.is-dark.is-inverted.is-outlined.is-loading.is-hovered::after, .bulma .button.is-dark.is-inverted.is-outlined.is-loading:focus::after, .bulma .button.is-dark.is-inverted.is-outlined.is-loading.is-focused::after { border-color: transparent transparent #363636 #363636 !important; }

.bulma .button.is-dark.is-inverted.is-outlined[disabled], fieldset[disabled] .bulma .button.is-dark.is-inverted.is-outlined { background-color: transparent; border-color: whitesmoke; box-shadow: none; color: whitesmoke; }

.bulma .button.is-primary { background-color: #00d1b2; border-color: transparent; color: #fff; }

.bulma .button.is-primary:hover, .bulma .button.is-primary.is-hovered { background-color: #00c4a7; border-color: transparent; color: #fff; }

.bulma .button.is-primary:focus, .bulma .button.is-primary.is-focused { border-color: transparent; color: #fff; }

.bulma .button.is-primary:focus:not(:active), .bulma .button.is-primary.is-focused:not(:active) { box-shadow: 0 0 0 0.125em rgba(0, 209, 178, 0.25); }

.bulma .button.is-primary:active, .bulma .button.is-primary.is-active { background-color: #00b89c; border-color: transparent; color: #fff; }

.bulma .button.is-primary[disabled], fieldset[disabled] .bulma .button.is-primary { background-color: #00d1b2; border-color: transparent; box-shadow: none; }

.bulma .button.is-primary.is-inverted { background-color: #fff; color: #00d1b2; }

.bulma .button.is-primary.is-inverted:hover, .bulma .button.is-primary.is-inverted.is-hovered { background-color: #f2f2f2; }

.bulma .button.is-primary.is-inverted[disabled], fieldset[disabled] .bulma .button.is-primary.is-inverted { background-color: #fff; border-color: transparent; box-shadow: none; color: #00d1b2; }

.bulma .button.is-primary.is-loading::after { border-color: transparent transparent #fff #fff !important; }

.bulma .button.is-primary.is-outlined { background-color: transparent; border-color: #00d1b2; color: #00d1b2; }

.bulma .button.is-primary.is-outlined:hover, .bulma .button.is-primary.is-outlined.is-hovered, .bulma .button.is-primary.is-outlined:focus, .bulma .button.is-primary.is-outlined.is-focused { background-color: #00d1b2; border-color: #00d1b2; color: #fff; }

.bulma .button.is-primary.is-outlined.is-loading::after { border-color: transparent transparent #00d1b2 #00d1b2 !important; }

.bulma .button.is-primary.is-outlined.is-loading:hover::after, .bulma .button.is-primary.is-outlined.is-loading.is-hovered::after, .bulma .button.is-primary.is-outlined.is-loading:focus::after, .bulma .button.is-primary.is-outlined.is-loading.is-focused::after { border-color: transparent transparent #fff #fff !important; }

.bulma .button.is-primary.is-outlined[disabled], fieldset[disabled] .bulma .button.is-primary.is-outlined { background-color: transparent; border-color: #00d1b2; box-shadow: none; color: #00d1b2; }

.bulma .button.is-primary.is-inverted.is-outlined { background-color: transparent; border-color: #fff; color: #fff; }

.bulma .button.is-primary.is-inverted.is-outlined:hover, .bulma .button.is-primary.is-inverted.is-outlined.is-hovered, .bulma .button.is-primary.is-inverted.is-outlined:focus, .bulma .button.is-primary.is-inverted.is-outlined.is-focused { background-color: #fff; color: #00d1b2; }

.bulma .button.is-primary.is-inverted.is-outlined.is-loading:hover::after, .bulma .button.is-primary.is-inverted.is-outlined.is-loading.is-hovered::after, .bulma .button.is-primary.is-inverted.is-outlined.is-loading:focus::after, .bulma .button.is-primary.is-inverted.is-outlined.is-loading.is-focused::after { border-color: transparent transparent #00d1b2 #00d1b2 !important; }

.bulma .button.is-primary.is-inverted.is-outlined[disabled], fieldset[disabled] .bulma .button.is-primary.is-inverted.is-outlined { background-color: transparent; border-color: #fff; box-shadow: none; color: #fff; }

.bulma .button.is-link { background-color: #3273dc; border-color: transparent; color: #fff; }

.bulma .button.is-link:hover, .bulma .button.is-link.is-hovered { background-color: #276cda; border-color: transparent; color: #fff; }

.bulma .button.is-link:focus, .bulma .button.is-link.is-focused { border-color: transparent; color: #fff; }

.bulma .button.is-link:focus:not(:active), .bulma .button.is-link.is-focused:not(:active) { box-shadow: 0 0 0 0.125em rgba(50, 115, 220, 0.25); }

.bulma .button.is-link:active, .bulma .button.is-link.is-active { background-color: #2366d1; border-color: transparent; color: #fff; }

.bulma .button.is-link[disabled], fieldset[disabled] .bulma .button.is-link { background-color: #3273dc; border-color: transparent; box-shadow: none; }

.bulma .button.is-link.is-inverted { background-color: #fff; color: #3273dc; }

.bulma .button.is-link.is-inverted:hover, .bulma .button.is-link.is-inverted.is-hovered { background-color: #f2f2f2; }

.bulma .button.is-link.is-inverted[disabled], fieldset[disabled] .bulma .button.is-link.is-inverted { background-color: #fff; border-color: transparent; box-shadow: none; color: #3273dc; }

.bulma .button.is-link.is-loading::after { border-color: transparent transparent #fff #fff !important; }

.bulma .button.is-link.is-outlined { background-color: transparent; border-color: #3273dc; color: #3273dc; }

.bulma .button.is-link.is-outlined:hover, .bulma .button.is-link.is-outlined.is-hovered, .bulma .button.is-link.is-outlined:focus, .bulma .button.is-link.is-outlined.is-focused { background-color: #3273dc; border-color: #3273dc; color: #fff; }

.bulma .button.is-link.is-outlined.is-loading::after { border-color: transparent transparent #3273dc #3273dc !important; }

.bulma .button.is-link.is-outlined.is-loading:hover::after, .bulma .button.is-link.is-outlined.is-loading.is-hovered::after, .bulma .button.is-link.is-outlined.is-loading:focus::after, .bulma .button.is-link.is-outlined.is-loading.is-focused::after { border-color: transparent transparent #fff #fff !important; }

.bulma .button.is-link.is-outlined[disabled], fieldset[disabled] .bulma .button.is-link.is-outlined { background-color: transparent; border-color: #3273dc; box-shadow: none; color: #3273dc; }

.bulma .button.is-link.is-inverted.is-outlined { background-color: transparent; border-color: #fff; color: #fff; }

.bulma .button.is-link.is-inverted.is-outlined:hover, .bulma .button.is-link.is-inverted.is-outlined.is-hovered, .bulma .button.is-link.is-inverted.is-outlined:focus, .bulma .button.is-link.is-inverted.is-outlined.is-focused { background-color: #fff; color: #3273dc; }

.bulma .button.is-link.is-inverted.is-outlined.is-loading:hover::after, .bulma .button.is-link.is-inverted.is-outlined.is-loading.is-hovered::after, .bulma .button.is-link.is-inverted.is-outlined.is-loading:focus::after, .bulma .button.is-link.is-inverted.is-outlined.is-loading.is-focused::after { border-color: transparent transparent #3273dc #3273dc !important; }

.bulma .button.is-link.is-inverted.is-outlined[disabled], fieldset[disabled] .bulma .button.is-link.is-inverted.is-outlined { background-color: transparent; border-color: #fff; box-shadow: none; color: #fff; }

.bulma .button.is-info { background-color: #209cee; border-color: transparent; color: #fff; }

.bulma .button.is-info:hover, .bulma .button.is-info.is-hovered { background-color: #1496ed; border-color: transparent; color: #fff; }

.bulma .button.is-info:focus, .bulma .button.is-info.is-focused { border-color: transparent; color: #fff; }

.bulma .button.is-info:focus:not(:active), .bulma .button.is-info.is-focused:not(:active) { box-shadow: 0 0 0 0.125em rgba(32, 156, 238, 0.25); }

.bulma .button.is-info:active, .bulma .button.is-info.is-active { background-color: #118fe4; border-color: transparent; color: #fff; }

.bulma .button.is-info[disabled], fieldset[disabled] .bulma .button.is-info { background-color: #209cee; border-color: transparent; box-shadow: none; }

.bulma .button.is-info.is-inverted { background-color: #fff; color: #209cee; }

.bulma .button.is-info.is-inverted:hover, .bulma .button.is-info.is-inverted.is-hovered { background-color: #f2f2f2; }

.bulma .button.is-info.is-inverted[disabled], fieldset[disabled] .bulma .button.is-info.is-inverted { background-color: #fff; border-color: transparent; box-shadow: none; color: #209cee; }

.bulma .button.is-info.is-loading::after { border-color: transparent transparent #fff #fff !important; }

.bulma .button.is-info.is-outlined { background-color: transparent; border-color: #209cee; color: #209cee; }

.bulma .button.is-info.is-outlined:hover, .bulma .button.is-info.is-outlined.is-hovered, .bulma .button.is-info.is-outlined:focus, .bulma .button.is-info.is-outlined.is-focused { background-color: #209cee; border-color: #209cee; color: #fff; }

.bulma .button.is-info.is-outlined.is-loading::after { border-color: transparent transparent #209cee #209cee !important; }

.bulma .button.is-info.is-outlined.is-loading:hover::after, .bulma .button.is-info.is-outlined.is-loading.is-hovered::after, .bulma .button.is-info.is-outlined.is-loading:focus::after, .bulma .button.is-info.is-outlined.is-loading.is-focused::after { border-color: transparent transparent #fff #fff !important; }

.bulma .button.is-info.is-outlined[disabled], fieldset[disabled] .bulma .button.is-info.is-outlined { background-color: transparent; border-color: #209cee; box-shadow: none; color: #209cee; }

.bulma .button.is-info.is-inverted.is-outlined { background-color: transparent; border-color: #fff; color: #fff; }

.bulma .button.is-info.is-inverted.is-outlined:hover, .bulma .button.is-info.is-inverted.is-outlined.is-hovered, .bulma .button.is-info.is-inverted.is-outlined:focus, .bulma .button.is-info.is-inverted.is-outlined.is-focused { background-color: #fff; color: #209cee; }

.bulma .button.is-info.is-inverted.is-outlined.is-loading:hover::after, .bulma .button.is-info.is-inverted.is-outlined.is-loading.is-hovered::after, .bulma .button.is-info.is-inverted.is-outlined.is-loading:focus::after, .bulma .button.is-info.is-inverted.is-outlined.is-loading.is-focused::after { border-color: transparent transparent #209cee #209cee !important; }

.bulma .button.is-info.is-inverted.is-outlined[disabled], fieldset[disabled] .bulma .button.is-info.is-inverted.is-outlined { background-color: transparent; border-color: #fff; box-shadow: none; color: #fff; }

.bulma .button.is-success { background-color: #23d160; border-color: transparent; color: #fff; }

.bulma .button.is-success:hover, .bulma .button.is-success.is-hovered { background-color: #22c65b; border-color: transparent; color: #fff; }

.bulma .button.is-success:focus, .bulma .button.is-success.is-focused { border-color: transparent; color: #fff; }

.bulma .button.is-success:focus:not(:active), .bulma .button.is-success.is-focused:not(:active) { box-shadow: 0 0 0 0.125em rgba(35, 209, 96, 0.25); }

.bulma .button.is-success:active, .bulma .button.is-success.is-active { background-color: #20bc56; border-color: transparent; color: #fff; }

.bulma .button.is-success[disabled], fieldset[disabled] .bulma .button.is-success { background-color: #23d160; border-color: transparent; box-shadow: none; }

.bulma .button.is-success.is-inverted { background-color: #fff; color: #23d160; }

.bulma .button.is-success.is-inverted:hover, .bulma .button.is-success.is-inverted.is-hovered { background-color: #f2f2f2; }

.bulma .button.is-success.is-inverted[disabled], fieldset[disabled] .bulma .button.is-success.is-inverted { background-color: #fff; border-color: transparent; box-shadow: none; color: #23d160; }

.bulma .button.is-success.is-loading::after { border-color: transparent transparent #fff #fff !important; }

.bulma .button.is-success.is-outlined { background-color: transparent; border-color: #23d160; color: #23d160; }

.bulma .button.is-success.is-outlined:hover, .bulma .button.is-success.is-outlined.is-hovered, .bulma .button.is-success.is-outlined:focus, .bulma .button.is-success.is-outlined.is-focused { background-color: #23d160; border-color: #23d160; color: #fff; }

.bulma .button.is-success.is-outlined.is-loading::after { border-color: transparent transparent #23d160 #23d160 !important; }

.bulma .button.is-success.is-outlined.is-loading:hover::after, .bulma .button.is-success.is-outlined.is-loading.is-hovered::after, .bulma .button.is-success.is-outlined.is-loading:focus::after, .bulma .button.is-success.is-outlined.is-loading.is-focused::after { border-color: transparent transparent #fff #fff !important; }

.bulma .button.is-success.is-outlined[disabled], fieldset[disabled] .bulma .button.is-success.is-outlined { background-color: transparent; border-color: #23d160; box-shadow: none; color: #23d160; }

.bulma .button.is-success.is-inverted.is-outlined { background-color: transparent; border-color: #fff; color: #fff; }

.bulma .button.is-success.is-inverted.is-outlined:hover, .bulma .button.is-success.is-inverted.is-outlined.is-hovered, .bulma .button.is-success.is-inverted.is-outlined:focus, .bulma .button.is-success.is-inverted.is-outlined.is-focused { background-color: #fff; color: #23d160; }

.bulma .button.is-success.is-inverted.is-outlined.is-loading:hover::after, .bulma .button.is-success.is-inverted.is-outlined.is-loading.is-hovered::after, .bulma .button.is-success.is-inverted.is-outlined.is-loading:focus::after, .bulma .button.is-success.is-inverted.is-outlined.is-loading.is-focused::after { border-color: transparent transparent #23d160 #23d160 !important; }

.bulma .button.is-success.is-inverted.is-outlined[disabled], fieldset[disabled] .bulma .button.is-success.is-inverted.is-outlined { background-color: transparent; border-color: #fff; box-shadow: none; color: #fff; }

.bulma .button.is-warning { background-color: #ffdd57; border-color: transparent; color: rgba(0, 0, 0, 0.7); }

.bulma .button.is-warning:hover, .bulma .button.is-warning.is-hovered { background-color: #ffdb4a; border-color: transparent; color: rgba(0, 0, 0, 0.7); }

.bulma .button.is-warning:focus, .bulma .button.is-warning.is-focused { border-color: transparent; color: rgba(0, 0, 0, 0.7); }

.bulma .button.is-warning:focus:not(:active), .bulma .button.is-warning.is-focused:not(:active) { box-shadow: 0 0 0 0.125em rgba(255, 221, 87, 0.25); }

.bulma .button.is-warning:active, .bulma .button.is-warning.is-active { background-color: #ffd83d; border-color: transparent; color: rgba(0, 0, 0, 0.7); }

.bulma .button.is-warning[disabled], fieldset[disabled] .bulma .button.is-warning { background-color: #ffdd57; border-color: transparent; box-shadow: none; }

.bulma .button.is-warning.is-inverted { background-color: rgba(0, 0, 0, 0.7); color: #ffdd57; }

.bulma .button.is-warning.is-inverted:hover, .bulma .button.is-warning.is-inverted.is-hovered { background-color: rgba(0, 0, 0, 0.7); }

.bulma .button.is-warning.is-inverted[disabled], fieldset[disabled] .bulma .button.is-warning.is-inverted { background-color: rgba(0, 0, 0, 0.7); border-color: transparent; box-shadow: none; color: #ffdd57; }

.bulma .button.is-warning.is-loading::after { border-color: transparent transparent rgba(0, 0, 0, 0.7) rgba(0, 0, 0, 0.7) !important; }

.bulma .button.is-warning.is-outlined { background-color: transparent; border-color: #ffdd57; color: #ffdd57; }

.bulma .button.is-warning.is-outlined:hover, .bulma .button.is-warning.is-outlined.is-hovered, .bulma .button.is-warning.is-outlined:focus, .bulma .button.is-warning.is-outlined.is-focused { background-color: #ffdd57; border-color: #ffdd57; color: rgba(0, 0, 0, 0.7); }

.bulma .button.is-warning.is-outlined.is-loading::after { border-color: transparent transparent #ffdd57 #ffdd57 !important; }

.bulma .button.is-warning.is-outlined.is-loading:hover::after, .bulma .button.is-warning.is-outlined.is-loading.is-hovered::after, .bulma .button.is-warning.is-outlined.is-loading:focus::after, .bulma .button.is-warning.is-outlined.is-loading.is-focused::after { border-color: transparent transparent rgba(0, 0, 0, 0.7) rgba(0, 0, 0, 0.7) !important; }

.bulma .button.is-warning.is-outlined[disabled], fieldset[disabled] .bulma .button.is-warning.is-outlined { background-color: transparent; border-color: #ffdd57; box-shadow: none; color: #ffdd57; }

.bulma .button.is-warning.is-inverted.is-outlined { background-color: transparent; border-color: rgba(0, 0, 0, 0.7); color: rgba(0, 0, 0, 0.7); }

.bulma .button.is-warning.is-inverted.is-outlined:hover, .bulma .button.is-warning.is-inverted.is-outlined.is-hovered, .bulma .button.is-warning.is-inverted.is-outlined:focus, .bulma .button.is-warning.is-inverted.is-outlined.is-focused { background-color: rgba(0, 0, 0, 0.7); color: #ffdd57; }

.bulma .button.is-warning.is-inverted.is-outlined.is-loading:hover::after, .bulma .button.is-warning.is-inverted.is-outlined.is-loading.is-hovered::after, .bulma .button.is-warning.is-inverted.is-outlined.is-loading:focus::after, .bulma .button.is-warning.is-inverted.is-outlined.is-loading.is-focused::after { border-color: transparent transparent #ffdd57 #ffdd57 !important; }

.bulma .button.is-warning.is-inverted.is-outlined[disabled], fieldset[disabled] .bulma .button.is-warning.is-inverted.is-outlined { background-color: transparent; border-color: rgba(0, 0, 0, 0.7); box-shadow: none; color: rgba(0, 0, 0, 0.7); }

.bulma .button.is-danger { background-color: #ff3860; border-color: transparent; color: #fff; }

.bulma .button.is-danger:hover, .bulma .button.is-danger.is-hovered { background-color: #ff2b56; border-color: transparent; color: #fff; }

.bulma .button.is-danger:focus, .bulma .button.is-danger.is-focused { border-color: transparent; color: #fff; }

.bulma .button.is-danger:focus:not(:active), .bulma .button.is-danger.is-focused:not(:active) { box-shadow: 0 0 0 0.125em rgba(255, 56, 96, 0.25); }

.bulma .button.is-danger:active, .bulma .button.is-danger.is-active { background-color: #ff1f4b; border-color: transparent; color: #fff; }

.bulma .button.is-danger[disabled], fieldset[disabled] .bulma .button.is-danger { background-color: #ff3860; border-color: transparent; box-shadow: none; }

.bulma .button.is-danger.is-inverted { background-color: #fff; color: #ff3860; }

.bulma .button.is-danger.is-inverted:hover, .bulma .button.is-danger.is-inverted.is-hovered { background-color: #f2f2f2; }

.bulma .button.is-danger.is-inverted[disabled], fieldset[disabled] .bulma .button.is-danger.is-inverted { background-color: #fff; border-color: transparent; box-shadow: none; color: #ff3860; }

.bulma .button.is-danger.is-loading::after { border-color: transparent transparent #fff #fff !important; }

.bulma .button.is-danger.is-outlined { background-color: transparent; border-color: #ff3860; color: #ff3860; }

.bulma .button.is-danger.is-outlined:hover, .bulma .button.is-danger.is-outlined.is-hovered, .bulma .button.is-danger.is-outlined:focus, .bulma .button.is-danger.is-outlined.is-focused { background-color: #ff3860; border-color: #ff3860; color: #fff; }

.bulma .button.is-danger.is-outlined.is-loading::after { border-color: transparent transparent #ff3860 #ff3860 !important; }

.bulma .button.is-danger.is-outlined.is-loading:hover::after, .bulma .button.is-danger.is-outlined.is-loading.is-hovered::after, .bulma .button.is-danger.is-outlined.is-loading:focus::after, .bulma .button.is-danger.is-outlined.is-loading.is-focused::after { border-color: transparent transparent #fff #fff !important; }

.bulma .button.is-danger.is-outlined[disabled], fieldset[disabled] .bulma .button.is-danger.is-outlined { background-color: transparent; border-color: #ff3860; box-shadow: none; color: #ff3860; }

.bulma .button.is-danger.is-inverted.is-outlined { background-color: transparent; border-color: #fff; color: #fff; }

.bulma .button.is-danger.is-inverted.is-outlined:hover, .bulma .button.is-danger.is-inverted.is-outlined.is-hovered, .bulma .button.is-danger.is-inverted.is-outlined:focus, .bulma .button.is-danger.is-inverted.is-outlined.is-focused { background-color: #fff; color: #ff3860; }

.bulma .button.is-danger.is-inverted.is-outlined.is-loading:hover::after, .bulma .button.is-danger.is-inverted.is-outlined.is-loading.is-hovered::after, .bulma .button.is-danger.is-inverted.is-outlined.is-loading:focus::after, .bulma .button.is-danger.is-inverted.is-outlined.is-loading.is-focused::after { border-color: transparent transparent #ff3860 #ff3860 !important; }

.bulma .button.is-danger.is-inverted.is-outlined[disabled], fieldset[disabled] .bulma .button.is-danger.is-inverted.is-outlined { background-color: transparent; border-color: #fff; box-shadow: none; color: #fff; }

.bulma .button.is-small { border-radius: 2px; font-size: 0.75rem; }

.bulma .button.is-normal { font-size: 1rem; }

.bulma .button.is-medium { font-size: 1.25rem; }

.bulma .button.is-large { font-size: 1.5rem; }

.bulma .button[disabled], fieldset[disabled] .bulma .button { background-color: white; border-color: #dbdbdb; box-shadow: none; opacity: 0.5; }

.bulma .button.is-fullwidth { display: flex; width: 100%; }

.bulma .button.is-loading { color: transparent !important; pointer-events: none; }

.bulma .button.is-loading::after { position: absolute; left: calc(50% - (1em / 2)); top: calc(50% - (1em / 2)); position: absolute !important; }

.bulma .button.is-static { background-color: whitesmoke; border-color: #dbdbdb; color: #7a7a7a; box-shadow: none; pointer-events: none; }

.bulma .button.is-rounded { border-radius: 290486px; padding-left: 1em; padding-right: 1em; }

.bulma .buttons { align-items: center; display: flex; flex-wrap: wrap; justify-content: flex-start; }

.bulma .buttons .button { margin-bottom: 0.5rem; }

.bulma .buttons .button:not(:last-child):not(.is-fullwidth) { margin-right: 0.5rem; }

.bulma .buttons:last-child { margin-bottom: -0.5rem; }

.bulma .buttons:not(:last-child) { margin-bottom: 1rem; }

.bulma .buttons.are-small .button:not(.is-normal):not(.is-medium):not(.is-large) { border-radius: 2px; font-size: 0.75rem; }

.bulma .buttons.are-medium .button:not(.is-small):not(.is-normal):not(.is-large) { font-size: 1.25rem; }

.bulma .buttons.are-large .button:not(.is-small):not(.is-normal):not(.is-medium) { font-size: 1.5rem; }

.bulma .buttons.has-addons .button:not(:first-child) { border-bottom-left-radius: 0; border-top-left-radius: 0; }

.bulma .buttons.has-addons .button:not(:last-child) { border-bottom-right-radius: 0; border-top-right-radius: 0; margin-right: -1px; }

.bulma .buttons.has-addons .button:last-child { margin-right: 0; }

.bulma .buttons.has-addons .button:hover, .bulma .buttons.has-addons .button.is-hovered { z-index: 2; }

.bulma .buttons.has-addons .button:focus, .bulma .buttons.has-addons .button.is-focused, .bulma .buttons.has-addons .button:active, .bulma .buttons.has-addons .button.is-active, .bulma .buttons.has-addons .button.is-selected { z-index: 3; }

.bulma .buttons.has-addons .button:focus:hover, .bulma .buttons.has-addons .button.is-focused:hover, .bulma .buttons.has-addons .button:active:hover, .bulma .buttons.has-addons .button.is-active:hover, .bulma .buttons.has-addons .button.is-selected:hover { z-index: 4; }

.bulma .buttons.has-addons .button.is-expanded { flex-grow: 1; flex-shrink: 1; }

.bulma .buttons.is-centered { justify-content: center; }

.bulma .buttons.is-centered:not(.has-addons) .button:not(.is-fullwidth) { margin-left: 0.25rem; margin-right: 0.25rem; }

.bulma .buttons.is-right { justify-content: flex-end; }

.bulma .buttons.is-right:not(.has-addons) .button:not(.is-fullwidth) { margin-left: 0.25rem; margin-right: 0.25rem; }

.bulma .container { flex-grow: 1; margin: 0 auto; position: relative; width: auto; }

@media screen and (min-width: 1024px) { .bulma .container { max-width: 960px; }
  .bulma .container.is-fluid { margin-left: 32px; margin-right: 32px; max-width: none; } }

@media screen and (max-width: 1215px) { .bulma .container.is-widescreen { max-width: 1152px; } }

@media screen and (max-width: 1407px) { .bulma .container.is-fullhd { max-width: 1344px; } }

@media screen and (min-width: 1216px) { .bulma .container { max-width: 1152px; } }

@media screen and (min-width: 1408px) { .bulma .container { max-width: 1344px; } }

.bulma .content li + li { margin-top: 0.25em; }

.bulma .content p:not(:last-child), .bulma .content dl:not(:last-child), .bulma .content ol:not(:last-child), .bulma .content ul:not(:last-child), .bulma .content blockquote:not(:last-child), .bulma .content pre:not(:last-child), .bulma .content table:not(:last-child) { margin-bottom: 1em; }

.bulma .content h1, .bulma .content h2, .bulma .content h3, .bulma .content h4, .bulma .content h5, .bulma .content h6 { color: #363636; font-weight: 600; line-height: 1.125; }

.bulma .content h1 { font-size: 2em; margin-bottom: 0.5em; }

.bulma .content h1:not(:first-child) { margin-top: 1em; }

.bulma .content h2 { font-size: 1.75em; margin-bottom: 0.5714em; }

.bulma .content h2:not(:first-child) { margin-top: 1.1428em; }

.bulma .content h3 { font-size: 1.5em; margin-bottom: 0.6666em; }

.bulma .content h3:not(:first-child) { margin-top: 1.3333em; }

.bulma .content h4 { font-size: 1.25em; margin-bottom: 0.8em; }

.bulma .content h5 { font-size: 1.125em; margin-bottom: 0.8888em; }

.bulma .content h6 { font-size: 1em; margin-bottom: 1em; }

.bulma .content blockquote { background-color: whitesmoke; border-left: 5px solid #dbdbdb; padding: 1.25em 1.5em; }

.bulma .content ol { list-style-position: outside; margin-left: 2em; margin-top: 1em; }

.bulma .content ol:not([type]) { list-style-type: decimal; }

.bulma .content ol:not([type]).is-lower-alpha { list-style-type: lower-alpha; }

.bulma .content ol:not([type]).is-lower-roman { list-style-type: lower-roman; }

.bulma .content ol:not([type]).is-upper-alpha { list-style-type: upper-alpha; }

.bulma .content ol:not([type]).is-upper-roman { list-style-type: upper-roman; }

.bulma .content ul { list-style: disc outside; margin-left: 2em; margin-top: 1em; }

.bulma .content ul ul { list-style-type: circle; margin-top: 0.5em; }

.bulma .content ul ul ul { list-style-type: square; }

.bulma .content dd { margin-left: 2em; }

.bulma .content figure { margin-left: 2em; margin-right: 2em; text-align: center; }

.bulma .content figure:not(:first-child) { margin-top: 2em; }

.bulma .content figure:not(:last-child) { margin-bottom: 2em; }

.bulma .content figure img { display: inline-block; }

.bulma .content figure figcaption { font-style: italic; }

.bulma .content pre { -webkit-overflow-scrolling: touch; overflow-x: auto; padding: 1.25em 1.5em; white-space: pre; word-wrap: normal; }

.bulma .content sup, .bulma .content sub { font-size: 75%; }

.bulma .content table { width: 100%; }

.bulma .content table td, .bulma .content table th { border: 1px solid #dbdbdb; border-width: 0 0 1px; padding: 0.5em 0.75em; vertical-align: top; }

.bulma .content table th { color: #363636; }

.bulma .content table th:not([align]) { text-align: left; }

.bulma .content table thead td, .bulma .content table thead th { border-width: 0 0 2px; color: #363636; }

.bulma .content table tfoot td, .bulma .content table tfoot th { border-width: 2px 0 0; color: #363636; }

.bulma .content table tbody tr:last-child td, .bulma .content table tbody tr:last-child th { border-bottom-width: 0; }

.bulma .content .tabs li + li { margin-top: 0; }

.bulma .content.is-small { font-size: 0.75rem; }

.bulma .content.is-medium { font-size: 1.25rem; }

.bulma .content.is-large { font-size: 1.5rem; }

.bulma .icon { align-items: center; display: inline-flex; justify-content: center; height: 1.5rem; width: 1.5rem; }

.bulma .icon.is-small { height: 1rem; width: 1rem; }

.bulma .icon.is-medium { height: 2rem; width: 2rem; }

.bulma .icon.is-large { height: 3rem; width: 3rem; }

.bulma .image { display: block; position: relative; }

.bulma .image img { display: block; height: auto; width: 100%; }

.bulma .image img.is-rounded { border-radius: 290486px; }

.bulma .image.is-square img, .bulma .image.is-square .has-ratio, .bulma .image.is-1by1 img, .bulma .image.is-1by1 .has-ratio, .bulma .image.is-5by4 img, .bulma .image.is-5by4 .has-ratio, .bulma .image.is-4by3 img, .bulma .image.is-4by3 .has-ratio, .bulma .image.is-3by2 img, .bulma .image.is-3by2 .has-ratio, .bulma .image.is-5by3 img, .bulma .image.is-5by3 .has-ratio, .bulma .image.is-16by9 img, .bulma .image.is-16by9 .has-ratio, .bulma .image.is-2by1 img, .bulma .image.is-2by1 .has-ratio, .bulma .image.is-3by1 img, .bulma .image.is-3by1 .has-ratio, .bulma .image.is-4by5 img, .bulma .image.is-4by5 .has-ratio, .bulma .image.is-3by4 img, .bulma .image.is-3by4 .has-ratio, .bulma .image.is-2by3 img, .bulma .image.is-2by3 .has-ratio, .bulma .image.is-3by5 img, .bulma .image.is-3by5 .has-ratio, .bulma .image.is-9by16 img, .bulma .image.is-9by16 .has-ratio, .bulma .image.is-1by2 img, .bulma .image.is-1by2 .has-ratio, .bulma .image.is-1by3 img, .bulma .image.is-1by3 .has-ratio { height: 100%; width: 100%; }

.bulma .image.is-square, .bulma .image.is-1by1 { padding-top: 100%; }

.bulma .image.is-5by4 { padding-top: 80%; }

.bulma .image.is-4by3 { padding-top: 75%; }

.bulma .image.is-3by2 { padding-top: 66.6666%; }

.bulma .image.is-5by3 { padding-top: 60%; }

.bulma .image.is-16by9 { padding-top: 56.25%; }

.bulma .image.is-2by1 { padding-top: 50%; }

.bulma .image.is-3by1 { padding-top: 33.3333%; }

.bulma .image.is-4by5 { padding-top: 125%; }

.bulma .image.is-3by4 { padding-top: 133.3333%; }

.bulma .image.is-2by3 { padding-top: 150%; }

.bulma .image.is-3by5 { padding-top: 166.6666%; }

.bulma .image.is-9by16 { padding-top: 177.7777%; }

.bulma .image.is-1by2 { padding-top: 200%; }

.bulma .image.is-1by3 { padding-top: 300%; }

.bulma .image.is-16x16 { height: 16px; width: 16px; }

.bulma .image.is-24x24 { height: 24px; width: 24px; }

.bulma .image.is-32x32 { height: 32px; width: 32px; }

.bulma .image.is-48x48 { height: 48px; width: 48px; }

.bulma .image.is-64x64 { height: 64px; width: 64px; }

.bulma .image.is-96x96 { height: 96px; width: 96px; }

.bulma .image.is-128x128 { height: 128px; width: 128px; }

.bulma .notification { background-color: whitesmoke; border-radius: 4px; padding: 1.25rem 2.5rem 1.25rem 1.5rem; position: relative; }

.bulma .notification a:not(.button):not(.dropdown-item) { color: currentColor; text-decoration: underline; }

.bulma .notification strong { color: currentColor; }

.bulma .notification code, .bulma .notification pre { background: white; }

.bulma .notification pre code { background: transparent; }

.bulma .notification > .delete { position: absolute; right: 0.5rem; top: 0.5rem; }

.bulma .notification .title, .bulma .notification .subtitle, .bulma .notification .content { color: currentColor; }

.bulma .notification.is-white { background-color: white; color: #0a0a0a; }

.bulma .notification.is-black { background-color: #0a0a0a; color: white; }

.bulma .notification.is-light { background-color: whitesmoke; color: #363636; }

.bulma .notification.is-dark { background-color: #363636; color: whitesmoke; }

.bulma .notification.is-primary { background-color: #00d1b2; color: #fff; }

.bulma .notification.is-link { background-color: #3273dc; color: #fff; }

.bulma .notification.is-info { background-color: #209cee; color: #fff; }

.bulma .notification.is-success { background-color: #23d160; color: #fff; }

.bulma .notification.is-warning { background-color: #ffdd57; color: rgba(0, 0, 0, 0.7); }

.bulma .notification.is-danger { background-color: #ff3860; color: #fff; }

.bulma .progress { -moz-appearance: none; -webkit-appearance: none; border: none; border-radius: 290486px; display: block; height: 1rem; overflow: hidden; padding: 0; width: 100%; }

.bulma .progress::-webkit-progress-bar { background-color: #dbdbdb; }

.bulma .progress::-webkit-progress-value { background-color: #4a4a4a; }

.bulma .progress::-moz-progress-bar { background-color: #4a4a4a; }

.bulma .progress::-ms-fill { background-color: #4a4a4a; border: none; }

.bulma .progress.is-white::-webkit-progress-value { background-color: white; }

.bulma .progress.is-white::-moz-progress-bar { background-color: white; }

.bulma .progress.is-white::-ms-fill { background-color: white; }

.bulma .progress.is-white:indeterminate { background-image: linear-gradient(to right, white 30%, #dbdbdb 30%); }

.bulma .progress.is-black::-webkit-progress-value { background-color: #0a0a0a; }

.bulma .progress.is-black::-moz-progress-bar { background-color: #0a0a0a; }

.bulma .progress.is-black::-ms-fill { background-color: #0a0a0a; }

.bulma .progress.is-black:indeterminate { background-image: linear-gradient(to right, #0a0a0a 30%, #dbdbdb 30%); }

.bulma .progress.is-light::-webkit-progress-value { background-color: whitesmoke; }

.bulma .progress.is-light::-moz-progress-bar { background-color: whitesmoke; }

.bulma .progress.is-light::-ms-fill { background-color: whitesmoke; }

.bulma .progress.is-light:indeterminate { background-image: linear-gradient(to right, whitesmoke 30%, #dbdbdb 30%); }

.bulma .progress.is-dark::-webkit-progress-value { background-color: #363636; }

.bulma .progress.is-dark::-moz-progress-bar { background-color: #363636; }

.bulma .progress.is-dark::-ms-fill { background-color: #363636; }

.bulma .progress.is-dark:indeterminate { background-image: linear-gradient(to right, #363636 30%, #dbdbdb 30%); }

.bulma .progress.is-primary::-webkit-progress-value { background-color: #00d1b2; }

.bulma .progress.is-primary::-moz-progress-bar { background-color: #00d1b2; }

.bulma .progress.is-primary::-ms-fill { background-color: #00d1b2; }

.bulma .progress.is-primary:indeterminate { background-image: linear-gradient(to right, #00d1b2 30%, #dbdbdb 30%); }

.bulma .progress.is-link::-webkit-progress-value { background-color: #3273dc; }

.bulma .progress.is-link::-moz-progress-bar { background-color: #3273dc; }

.bulma .progress.is-link::-ms-fill { background-color: #3273dc; }

.bulma .progress.is-link:indeterminate { background-image: linear-gradient(to right, #3273dc 30%, #dbdbdb 30%); }

.bulma .progress.is-info::-webkit-progress-value { background-color: #209cee; }

.bulma .progress.is-info::-moz-progress-bar { background-color: #209cee; }

.bulma .progress.is-info::-ms-fill { background-color: #209cee; }

.bulma .progress.is-info:indeterminate { background-image: linear-gradient(to right, #209cee 30%, #dbdbdb 30%); }

.bulma .progress.is-success::-webkit-progress-value { background-color: #23d160; }

.bulma .progress.is-success::-moz-progress-bar { background-color: #23d160; }

.bulma .progress.is-success::-ms-fill { background-color: #23d160; }

.bulma .progress.is-success:indeterminate { background-image: linear-gradient(to right, #23d160 30%, #dbdbdb 30%); }

.bulma .progress.is-warning::-webkit-progress-value { background-color: #ffdd57; }

.bulma .progress.is-warning::-moz-progress-bar { background-color: #ffdd57; }

.bulma .progress.is-warning::-ms-fill { background-color: #ffdd57; }

.bulma .progress.is-warning:indeterminate { background-image: linear-gradient(to right, #ffdd57 30%, #dbdbdb 30%); }

.bulma .progress.is-danger::-webkit-progress-value { background-color: #ff3860; }

.bulma .progress.is-danger::-moz-progress-bar { background-color: #ff3860; }

.bulma .progress.is-danger::-ms-fill { background-color: #ff3860; }

.bulma .progress.is-danger:indeterminate { background-image: linear-gradient(to right, #ff3860 30%, #dbdbdb 30%); }

.bulma .progress:indeterminate { animation-duration: 1.5s; animation-iteration-count: infinite; animation-name: moveIndeterminate; animation-timing-function: linear; background-color: #dbdbdb; background-image: linear-gradient(to right, #4a4a4a 30%, #dbdbdb 30%); background-position: top left; background-repeat: no-repeat; background-size: 150% 150%; }

.bulma .progress:indeterminate::-webkit-progress-bar { background-color: transparent; }

.bulma .progress:indeterminate::-moz-progress-bar { background-color: transparent; }

.bulma .progress.is-small { height: 0.75rem; }

.bulma .progress.is-medium { height: 1.25rem; }

.bulma .progress.is-large { height: 1.5rem; }

@keyframes moveIndeterminate { from { background-position: 200% 0; }
  to { background-position: -200% 0; } }

.bulma .table { background-color: white; color: #363636; }

.bulma .table td, .bulma .table th { border: 1px solid #dbdbdb; border-width: 0 0 1px; padding: 0.5em 0.75em; vertical-align: top; }

.bulma .table td.is-white, .bulma .table th.is-white { background-color: white; border-color: white; color: #0a0a0a; }

.bulma .table td.is-black, .bulma .table th.is-black { background-color: #0a0a0a; border-color: #0a0a0a; color: white; }

.bulma .table td.is-light, .bulma .table th.is-light { background-color: whitesmoke; border-color: whitesmoke; color: #363636; }

.bulma .table td.is-dark, .bulma .table th.is-dark { background-color: #363636; border-color: #363636; color: whitesmoke; }

.bulma .table td.is-primary, .bulma .table th.is-primary { background-color: #00d1b2; border-color: #00d1b2; color: #fff; }

.bulma .table td.is-link, .bulma .table th.is-link { background-color: #3273dc; border-color: #3273dc; color: #fff; }

.bulma .table td.is-info, .bulma .table th.is-info { background-color: #209cee; border-color: #209cee; color: #fff; }

.bulma .table td.is-success, .bulma .table th.is-success { background-color: #23d160; border-color: #23d160; color: #fff; }

.bulma .table td.is-warning, .bulma .table th.is-warning { background-color: #ffdd57; border-color: #ffdd57; color: rgba(0, 0, 0, 0.7); }

.bulma .table td.is-danger, .bulma .table th.is-danger { background-color: #ff3860; border-color: #ff3860; color: #fff; }

.bulma .table td.is-narrow, .bulma .table th.is-narrow { white-space: nowrap; width: 1%; }

.bulma .table td.is-selected, .bulma .table th.is-selected { background-color: #00d1b2; color: #fff; }

.bulma .table td.is-selected a, .bulma .table td.is-selected strong, .bulma .table th.is-selected a, .bulma .table th.is-selected strong { color: currentColor; }

.bulma .table th { color: #363636; }

.bulma .table th:not([align]) { text-align: left; }

.bulma .table tr.is-selected { background-color: #00d1b2; color: #fff; }

.bulma .table tr.is-selected a, .bulma .table tr.is-selected strong { color: currentColor; }

.bulma .table tr.is-selected td, .bulma .table tr.is-selected th { border-color: #fff; color: currentColor; }

.bulma .table thead { background-color: transparent; }

.bulma .table thead td, .bulma .table thead th { border-width: 0 0 2px; color: #363636; }

.bulma .table tfoot { background-color: transparent; }

.bulma .table tfoot td, .bulma .table tfoot th { border-width: 2px 0 0; color: #363636; }

.bulma .table tbody { background-color: transparent; }

.bulma .table tbody tr:last-child td, .bulma .table tbody tr:last-child th { border-bottom-width: 0; }

.bulma .table.is-bordered td, .bulma .table.is-bordered th { border-width: 1px; }

.bulma .table.is-bordered tr:last-child td, .bulma .table.is-bordered tr:last-child th { border-bottom-width: 1px; }

.bulma .table.is-fullwidth { width: 100%; }

.bulma .table.is-hoverable tbody tr:not(.is-selected):hover { background-color: #fafafa; }

.bulma .table.is-hoverable.is-striped tbody tr:not(.is-selected):hover { background-color: #fafafa; }

.bulma .table.is-hoverable.is-striped tbody tr:not(.is-selected):hover:nth-child(even) { background-color: whitesmoke; }

.bulma .table.is-narrow td, .bulma .table.is-narrow th { padding: 0.25em 0.5em; }

.bulma .table.is-striped tbody tr:not(.is-selected):nth-child(even) { background-color: #fafafa; }

.bulma .table-container { -webkit-overflow-scrolling: touch; overflow: auto; overflow-y: hidden; max-width: 100%; }

.bulma .tags { align-items: center; display: flex; flex-wrap: wrap; justify-content: flex-start; }

.bulma .tags .tag { margin-bottom: 0.5rem; }

.bulma .tags .tag:not(:last-child) { margin-right: 0.5rem; }

.bulma .tags:last-child { margin-bottom: -0.5rem; }

.bulma .tags:not(:last-child) { margin-bottom: 1rem; }

.bulma .tags.are-medium .tag:not(.is-normal):not(.is-large) { font-size: 1rem; }

.bulma .tags.are-large .tag:not(.is-normal):not(.is-medium) { font-size: 1.25rem; }

.bulma .tags.is-centered { justify-content: center; }

.bulma .tags.is-centered .tag { margin-right: 0.25rem; margin-left: 0.25rem; }

.bulma .tags.is-right { justify-content: flex-end; }

.bulma .tags.is-right .tag:not(:first-child) { margin-left: 0.5rem; }

.bulma .tags.is-right .tag:not(:last-child) { margin-right: 0; }

.bulma .tags.has-addons .tag { margin-right: 0; }

.bulma .tags.has-addons .tag:not(:first-child) { margin-left: 0; border-bottom-left-radius: 0; border-top-left-radius: 0; }

.bulma .tags.has-addons .tag:not(:last-child) { border-bottom-right-radius: 0; border-top-right-radius: 0; }

.bulma .tag:not(body) { align-items: center; background-color: whitesmoke; border-radius: 4px; color: #4a4a4a; display: inline-flex; font-size: 0.75rem; height: 2em; justify-content: center; line-height: 1.5; padding-left: 0.75em; padding-right: 0.75em; white-space: nowrap; }

.bulma .tag:not(body) .delete { margin-left: 0.25rem; margin-right: -0.375rem; }

.bulma .tag:not(body).is-white { background-color: white; color: #0a0a0a; }

.bulma .tag:not(body).is-black { background-color: #0a0a0a; color: white; }

.bulma .tag:not(body).is-light { background-color: whitesmoke; color: #363636; }

.bulma .tag:not(body).is-dark { background-color: #363636; color: whitesmoke; }

.bulma .tag:not(body).is-primary { background-color: #00d1b2; color: #fff; }

.bulma .tag:not(body).is-link { background-color: #3273dc; color: #fff; }

.bulma .tag:not(body).is-info { background-color: #209cee; color: #fff; }

.bulma .tag:not(body).is-success { background-color: #23d160; color: #fff; }

.bulma .tag:not(body).is-warning { background-color: #ffdd57; color: rgba(0, 0, 0, 0.7); }

.bulma .tag:not(body).is-danger { background-color: #ff3860; color: #fff; }

.bulma .tag:not(body).is-normal { font-size: 0.75rem; }

.bulma .tag:not(body).is-medium { font-size: 1rem; }

.bulma .tag:not(body).is-large { font-size: 1.25rem; }

.bulma .tag:not(body) .icon:first-child:not(:last-child) { margin-left: -0.375em; margin-right: 0.1875em; }

.bulma .tag:not(body) .icon:last-child:not(:first-child) { margin-left: 0.1875em; margin-right: -0.375em; }

.bulma .tag:not(body) .icon:first-child:last-child { margin-left: -0.375em; margin-right: -0.375em; }

.bulma .tag:not(body).is-delete { margin-left: 1px; padding: 0; position: relative; width: 2em; }

.bulma .tag:not(body).is-delete::before, .bulma .tag:not(body).is-delete::after { background-color: currentColor; content: ""; display: block; left: 50%; position: absolute; top: 50%; transform: translateX(-50%) translateY(-50%) rotate(45deg); transform-origin: center center; }

.bulma .tag:not(body).is-delete::before { height: 1px; width: 50%; }

.bulma .tag:not(body).is-delete::after { height: 50%; width: 1px; }

.bulma .tag:not(body).is-delete:hover, .bulma .tag:not(body).is-delete:focus { background-color: #e8e8e8; }

.bulma .tag:not(body).is-delete:active { background-color: #dbdbdb; }

.bulma .tag:not(body).is-rounded { border-radius: 290486px; }

.bulma a.tag:hover { text-decoration: underline; }

.bulma .title, .bulma .subtitle { word-break: break-word; }

.bulma .title em, .bulma .title span, .bulma .subtitle em, .bulma .subtitle span { font-weight: inherit; }

.bulma .title sub, .bulma .subtitle sub { font-size: 0.75em; }

.bulma .title sup, .bulma .subtitle sup { font-size: 0.75em; }

.bulma .title .tag, .bulma .subtitle .tag { vertical-align: middle; }

.bulma .title { color: #363636; font-size: 2rem; font-weight: 600; line-height: 1.125; }

.bulma .title strong { color: inherit; font-weight: inherit; }

.bulma .title + .highlight { margin-top: -0.75rem; }

.bulma .title:not(.is-spaced) + .subtitle { margin-top: -1.25rem; }

.bulma .title.is-1 { font-size: 3rem; }

.bulma .title.is-2 { font-size: 2.5rem; }

.bulma .title.is-3 { font-size: 2rem; }

.bulma .title.is-4 { font-size: 1.5rem; }

.bulma .title.is-5 { font-size: 1.25rem; }

.bulma .title.is-6 { font-size: 1rem; }

.bulma .title.is-7 { font-size: 0.75rem; }

.bulma .subtitle { color: #4a4a4a; font-size: 1.25rem; font-weight: 400; line-height: 1.25; }

.bulma .subtitle strong { color: #363636; font-weight: 600; }

.bulma .subtitle:not(.is-spaced) + .title { margin-top: -1.25rem; }

.bulma .subtitle.is-1 { font-size: 3rem; }

.bulma .subtitle.is-2 { font-size: 2.5rem; }

.bulma .subtitle.is-3 { font-size: 2rem; }

.bulma .subtitle.is-4 { font-size: 1.5rem; }

.bulma .subtitle.is-5 { font-size: 1.25rem; }

.bulma .subtitle.is-6 { font-size: 1rem; }

.bulma .subtitle.is-7 { font-size: 0.75rem; }

.bulma .heading { display: block; font-size: 11px; letter-spacing: 1px; margin-bottom: 5px; text-transform: uppercase; }

.bulma .highlight { font-weight: 400; max-width: 100%; overflow: hidden; padding: 0; }

.bulma .highlight pre { overflow: auto; max-width: 100%; }

.bulma .number { align-items: center; background-color: whitesmoke; border-radius: 290486px; display: inline-flex; font-size: 1.25rem; height: 2em; justify-content: center; margin-right: 1.5rem; min-width: 2.5em; padding: 0.25rem 0.5rem; text-align: center; vertical-align: top; }

.bulma .input, .bulma .textarea, .bulma .select select { background-color: white; border-color: #dbdbdb; border-radius: 4px; color: #363636; }

.bulma .input::-moz-placeholder, .bulma .textarea::-moz-placeholder, .bulma .select select::-moz-placeholder { color: rgba(54, 54, 54, 0.3); }

.bulma .input::-webkit-input-placeholder, .bulma .textarea::-webkit-input-placeholder, .bulma .select select::-webkit-input-placeholder { color: rgba(54, 54, 54, 0.3); }

.bulma .input:-moz-placeholder, .bulma .textarea:-moz-placeholder, .bulma .select select:-moz-placeholder { color: rgba(54, 54, 54, 0.3); }

.bulma .input:-ms-input-placeholder, .bulma .textarea:-ms-input-placeholder, .bulma .select select:-ms-input-placeholder { color: rgba(54, 54, 54, 0.3); }

.bulma .input:hover, .bulma .textarea:hover, .bulma .select select:hover, .bulma .is-hovered.input, .bulma .is-hovered.textarea, .bulma .select select.is-hovered { border-color: #b5b5b5; }

.bulma .input:focus, .bulma .textarea:focus, .bulma .select select:focus, .bulma .is-focused.input, .bulma .is-focused.textarea, .bulma .select select.is-focused, .bulma .input:active, .bulma .textarea:active, .bulma .select select:active, .bulma .is-active.input, .bulma .is-active.textarea, .bulma .select select.is-active { border-color: #3273dc; box-shadow: 0 0 0 0.125em rgba(50, 115, 220, 0.25); }

.bulma .input[disabled], .bulma .textarea[disabled], .bulma .select select[disabled], fieldset[disabled] .bulma .input, fieldset[disabled] .bulma .textarea, fieldset[disabled] .bulma .select select { background-color: whitesmoke; border-color: whitesmoke; box-shadow: none; color: #7a7a7a; }

.bulma .input[disabled]::-moz-placeholder, .bulma .textarea[disabled]::-moz-placeholder, .bulma .select select[disabled]::-moz-placeholder, fieldset[disabled] .bulma .input::-moz-placeholder, fieldset[disabled] .bulma .textarea::-moz-placeholder, fieldset[disabled] .bulma .select select::-moz-placeholder { color: rgba(122, 122, 122, 0.3); }

.bulma .input[disabled]::-webkit-input-placeholder, .bulma .textarea[disabled]::-webkit-input-placeholder, .bulma .select select[disabled]::-webkit-input-placeholder, fieldset[disabled] .bulma .input::-webkit-input-placeholder, fieldset[disabled] .bulma .textarea::-webkit-input-placeholder, fieldset[disabled] .bulma .select select::-webkit-input-placeholder { color: rgba(122, 122, 122, 0.3); }

.bulma .input[disabled]:-moz-placeholder, .bulma .textarea[disabled]:-moz-placeholder, .bulma .select select[disabled]:-moz-placeholder, fieldset[disabled] .bulma .input:-moz-placeholder, fieldset[disabled] .bulma .textarea:-moz-placeholder, fieldset[disabled] .bulma .select select:-moz-placeholder { color: rgba(122, 122, 122, 0.3); }

.bulma .input[disabled]:-ms-input-placeholder, .bulma .textarea[disabled]:-ms-input-placeholder, .bulma .select select[disabled]:-ms-input-placeholder, fieldset[disabled] .bulma .input:-ms-input-placeholder, fieldset[disabled] .bulma .textarea:-ms-input-placeholder, fieldset[disabled] .bulma .select select:-ms-input-placeholder { color: rgba(122, 122, 122, 0.3); }

.bulma .input, .bulma .textarea { box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.1); max-width: 100%; width: 100%; }

.bulma .input[readonly], .bulma .textarea[readonly] { box-shadow: none; }

.bulma .is-white.input, .bulma .is-white.textarea { border-color: white; }

.bulma .is-white.input:focus, .bulma .is-white.textarea:focus, .bulma .is-white.is-focused.input, .bulma .is-white.is-focused.textarea, .bulma .is-white.input:active, .bulma .is-white.textarea:active, .bulma .is-white.is-active.input, .bulma .is-white.is-active.textarea { box-shadow: 0 0 0 0.125em rgba(255, 255, 255, 0.25); }

.bulma .is-black.input, .bulma .is-black.textarea { border-color: #0a0a0a; }

.bulma .is-black.input:focus, .bulma .is-black.textarea:focus, .bulma .is-black.is-focused.input, .bulma .is-black.is-focused.textarea, .bulma .is-black.input:active, .bulma .is-black.textarea:active, .bulma .is-black.is-active.input, .bulma .is-black.is-active.textarea { box-shadow: 0 0 0 0.125em rgba(10, 10, 10, 0.25); }

.bulma .is-light.input, .bulma .is-light.textarea { border-color: whitesmoke; }

.bulma .is-light.input:focus, .bulma .is-light.textarea:focus, .bulma .is-light.is-focused.input, .bulma .is-light.is-focused.textarea, .bulma .is-light.input:active, .bulma .is-light.textarea:active, .bulma .is-light.is-active.input, .bulma .is-light.is-active.textarea { box-shadow: 0 0 0 0.125em rgba(245, 245, 245, 0.25); }

.bulma .is-dark.input, .bulma .is-dark.textarea { border-color: #363636; }

.bulma .is-dark.input:focus, .bulma .is-dark.textarea:focus, .bulma .is-dark.is-focused.input, .bulma .is-dark.is-focused.textarea, .bulma .is-dark.input:active, .bulma .is-dark.textarea:active, .bulma .is-dark.is-active.input, .bulma .is-dark.is-active.textarea { box-shadow: 0 0 0 0.125em rgba(54, 54, 54, 0.25); }

.bulma .is-primary.input, .bulma .is-primary.textarea { border-color: #00d1b2; }

.bulma .is-primary.input:focus, .bulma .is-primary.textarea:focus, .bulma .is-primary.is-focused.input, .bulma .is-primary.is-focused.textarea, .bulma .is-primary.input:active, .bulma .is-primary.textarea:active, .bulma .is-primary.is-active.input, .bulma .is-primary.is-active.textarea { box-shadow: 0 0 0 0.125em rgba(0, 209, 178, 0.25); }

.bulma .is-link.input, .bulma .is-link.textarea { border-color: #3273dc; }

.bulma .is-link.input:focus, .bulma .is-link.textarea:focus, .bulma .is-link.is-focused.input, .bulma .is-link.is-focused.textarea, .bulma .is-link.input:active, .bulma .is-link.textarea:active, .bulma .is-link.is-active.input, .bulma .is-link.is-active.textarea { box-shadow: 0 0 0 0.125em rgba(50, 115, 220, 0.25); }

.bulma .is-info.input, .bulma .is-info.textarea { border-color: #209cee; }

.bulma .is-info.input:focus, .bulma .is-info.textarea:focus, .bulma .is-info.is-focused.input, .bulma .is-info.is-focused.textarea, .bulma .is-info.input:active, .bulma .is-info.textarea:active, .bulma .is-info.is-active.input, .bulma .is-info.is-active.textarea { box-shadow: 0 0 0 0.125em rgba(32, 156, 238, 0.25); }

.bulma .is-success.input, .bulma .is-success.textarea { border-color: #23d160; }

.bulma .is-success.input:focus, .bulma .is-success.textarea:focus, .bulma .is-success.is-focused.input, .bulma .is-success.is-focused.textarea, .bulma .is-success.input:active, .bulma .is-success.textarea:active, .bulma .is-success.is-active.input, .bulma .is-success.is-active.textarea { box-shadow: 0 0 0 0.125em rgba(35, 209, 96, 0.25); }

.bulma .is-warning.input, .bulma .is-warning.textarea { border-color: #ffdd57; }

.bulma .is-warning.input:focus, .bulma .is-warning.textarea:focus, .bulma .is-warning.is-focused.input, .bulma .is-warning.is-focused.textarea, .bulma .is-warning.input:active, .bulma .is-warning.textarea:active, .bulma .is-warning.is-active.input, .bulma .is-warning.is-active.textarea { box-shadow: 0 0 0 0.125em rgba(255, 221, 87, 0.25); }

.bulma .is-danger.input, .bulma .is-danger.textarea { border-color: #ff3860; }

.bulma .is-danger.input:focus, .bulma .is-danger.textarea:focus, .bulma .is-danger.is-focused.input, .bulma .is-danger.is-focused.textarea, .bulma .is-danger.input:active, .bulma .is-danger.textarea:active, .bulma .is-danger.is-active.input, .bulma .is-danger.is-active.textarea { box-shadow: 0 0 0 0.125em rgba(255, 56, 96, 0.25); }

.bulma .is-small.input, .bulma .is-small.textarea { border-radius: 2px; font-size: 0.75rem; }

.bulma .is-medium.input, .bulma .is-medium.textarea { font-size: 1.25rem; }

.bulma .is-large.input, .bulma .is-large.textarea { font-size: 1.5rem; }

.bulma .is-fullwidth.input, .bulma .is-fullwidth.textarea { display: block; width: 100%; }

.bulma .is-inline.input, .bulma .is-inline.textarea { display: inline; width: auto; }

.bulma .input.is-rounded { border-radius: 290486px; padding-left: 1em; padding-right: 1em; }

.bulma .input.is-static { background-color: transparent; border-color: transparent; box-shadow: none; padding-left: 0; padding-right: 0; }

.bulma .textarea { display: block; max-width: 100%; min-width: 100%; padding: 0.625em; resize: vertical; }

.bulma .textarea:not([rows]) { max-height: 600px; min-height: 120px; }

.bulma .textarea[rows] { height: initial; }

.bulma .textarea.has-fixed-size { resize: none; }

.bulma .checkbox, .bulma .radio { cursor: pointer; display: inline-block; line-height: 1.25; position: relative; }

.bulma .checkbox input, .bulma .radio input { cursor: pointer; }

.bulma .checkbox:hover, .bulma .radio:hover { color: #363636; }

.bulma .checkbox[disabled], .bulma .radio[disabled], fieldset[disabled] .bulma .checkbox, fieldset[disabled] .bulma .radio { color: #7a7a7a; cursor: not-allowed; }

.bulma .radio + .radio { margin-left: 0.5em; }

.bulma .select { display: inline-block; max-width: 100%; position: relative; vertical-align: top; }

.bulma .select:not(.is-multiple) { height: 2.25em; }

.bulma .select:not(.is-multiple):not(.is-loading)::after { border-color: #3273dc; right: 1.125em; z-index: 4; }

.bulma .select.is-rounded select { border-radius: 290486px; padding-left: 1em; }

.bulma .select select { cursor: pointer; display: block; font-size: 1em; max-width: 100%; outline: none; }

.bulma .select select::-ms-expand { display: none; }

.bulma .select select[disabled]:hover, fieldset[disabled] .bulma .select select:hover { border-color: whitesmoke; }

.bulma .select select:not([multiple]) { padding-right: 2.5em; }

.bulma .select select[multiple] { height: auto; padding: 0; }

.bulma .select select[multiple] option { padding: 0.5em 1em; }

.bulma .select:not(.is-multiple):not(.is-loading):hover::after { border-color: #363636; }

.bulma .select.is-white:not(:hover)::after { border-color: white; }

.bulma .select.is-white select { border-color: white; }

.bulma .select.is-white select:hover, .bulma .select.is-white select.is-hovered { border-color: #f2f2f2; }

.bulma .select.is-white select:focus, .bulma .select.is-white select.is-focused, .bulma .select.is-white select:active, .bulma .select.is-white select.is-active { box-shadow: 0 0 0 0.125em rgba(255, 255, 255, 0.25); }

.bulma .select.is-black:not(:hover)::after { border-color: #0a0a0a; }

.bulma .select.is-black select { border-color: #0a0a0a; }

.bulma .select.is-black select:hover, .bulma .select.is-black select.is-hovered { border-color: black; }

.bulma .select.is-black select:focus, .bulma .select.is-black select.is-focused, .bulma .select.is-black select:active, .bulma .select.is-black select.is-active { box-shadow: 0 0 0 0.125em rgba(10, 10, 10, 0.25); }

.bulma .select.is-light:not(:hover)::after { border-color: whitesmoke; }

.bulma .select.is-light select { border-color: whitesmoke; }

.bulma .select.is-light select:hover, .bulma .select.is-light select.is-hovered { border-color: #e8e8e8; }

.bulma .select.is-light select:focus, .bulma .select.is-light select.is-focused, .bulma .select.is-light select:active, .bulma .select.is-light select.is-active { box-shadow: 0 0 0 0.125em rgba(245, 245, 245, 0.25); }

.bulma .select.is-dark:not(:hover)::after { border-color: #363636; }

.bulma .select.is-dark select { border-color: #363636; }

.bulma .select.is-dark select:hover, .bulma .select.is-dark select.is-hovered { border-color: #292929; }

.bulma .select.is-dark select:focus, .bulma .select.is-dark select.is-focused, .bulma .select.is-dark select:active, .bulma .select.is-dark select.is-active { box-shadow: 0 0 0 0.125em rgba(54, 54, 54, 0.25); }

.bulma .select.is-primary:not(:hover)::after { border-color: #00d1b2; }

.bulma .select.is-primary select { border-color: #00d1b2; }

.bulma .select.is-primary select:hover, .bulma .select.is-primary select.is-hovered { border-color: #00b89c; }

.bulma .select.is-primary select:focus, .bulma .select.is-primary select.is-focused, .bulma .select.is-primary select:active, .bulma .select.is-primary select.is-active { box-shadow: 0 0 0 0.125em rgba(0, 209, 178, 0.25); }

.bulma .select.is-link:not(:hover)::after { border-color: #3273dc; }

.bulma .select.is-link select { border-color: #3273dc; }

.bulma .select.is-link select:hover, .bulma .select.is-link select.is-hovered { border-color: #2366d1; }

.bulma .select.is-link select:focus, .bulma .select.is-link select.is-focused, .bulma .select.is-link select:active, .bulma .select.is-link select.is-active { box-shadow: 0 0 0 0.125em rgba(50, 115, 220, 0.25); }

.bulma .select.is-info:not(:hover)::after { border-color: #209cee; }

.bulma .select.is-info select { border-color: #209cee; }

.bulma .select.is-info select:hover, .bulma .select.is-info select.is-hovered { border-color: #118fe4; }

.bulma .select.is-info select:focus, .bulma .select.is-info select.is-focused, .bulma .select.is-info select:active, .bulma .select.is-info select.is-active { box-shadow: 0 0 0 0.125em rgba(32, 156, 238, 0.25); }

.bulma .select.is-success:not(:hover)::after { border-color: #23d160; }

.bulma .select.is-success select { border-color: #23d160; }

.bulma .select.is-success select:hover, .bulma .select.is-success select.is-hovered { border-color: #20bc56; }

.bulma .select.is-success select:focus, .bulma .select.is-success select.is-focused, .bulma .select.is-success select:active, .bulma .select.is-success select.is-active { box-shadow: 0 0 0 0.125em rgba(35, 209, 96, 0.25); }

.bulma .select.is-warning:not(:hover)::after { border-color: #ffdd57; }

.bulma .select.is-warning select { border-color: #ffdd57; }

.bulma .select.is-warning select:hover, .bulma .select.is-warning select.is-hovered { border-color: #ffd83d; }

.bulma .select.is-warning select:focus, .bulma .select.is-warning select.is-focused, .bulma .select.is-warning select:active, .bulma .select.is-warning select.is-active { box-shadow: 0 0 0 0.125em rgba(255, 221, 87, 0.25); }

.bulma .select.is-danger:not(:hover)::after { border-color: #ff3860; }

.bulma .select.is-danger select { border-color: #ff3860; }

.bulma .select.is-danger select:hover, .bulma .select.is-danger select.is-hovered { border-color: #ff1f4b; }

.bulma .select.is-danger select:focus, .bulma .select.is-danger select.is-focused, .bulma .select.is-danger select:active, .bulma .select.is-danger select.is-active { box-shadow: 0 0 0 0.125em rgba(255, 56, 96, 0.25); }

.bulma .select.is-small { border-radius: 2px; font-size: 0.75rem; }

.bulma .select.is-medium { font-size: 1.25rem; }

.bulma .select.is-large { font-size: 1.5rem; }

.bulma .select.is-disabled::after { border-color: #7a7a7a; }

.bulma .select.is-fullwidth { width: 100%; }

.bulma .select.is-fullwidth select { width: 100%; }

.bulma .select.is-loading::after { margin-top: 0; position: absolute; right: 0.625em; top: 0.625em; transform: none; }

.bulma .select.is-loading.is-small:after { font-size: 0.75rem; }

.bulma .select.is-loading.is-medium:after { font-size: 1.25rem; }

.bulma .select.is-loading.is-large:after { font-size: 1.5rem; }

.bulma .file { align-items: stretch; display: flex; justify-content: flex-start; position: relative; }

.bulma .file.is-white .file-cta { background-color: white; border-color: transparent; color: #0a0a0a; }

.bulma .file.is-white:hover .file-cta, .bulma .file.is-white.is-hovered .file-cta { background-color: #f9f9f9; border-color: transparent; color: #0a0a0a; }

.bulma .file.is-white:focus .file-cta, .bulma .file.is-white.is-focused .file-cta { border-color: transparent; box-shadow: 0 0 0.5em rgba(255, 255, 255, 0.25); color: #0a0a0a; }

.bulma .file.is-white:active .file-cta, .bulma .file.is-white.is-active .file-cta { background-color: #f2f2f2; border-color: transparent; color: #0a0a0a; }

.bulma .file.is-black .file-cta { background-color: #0a0a0a; border-color: transparent; color: white; }

.bulma .file.is-black:hover .file-cta, .bulma .file.is-black.is-hovered .file-cta { background-color: #040404; border-color: transparent; color: white; }

.bulma .file.is-black:focus .file-cta, .bulma .file.is-black.is-focused .file-cta { border-color: transparent; box-shadow: 0 0 0.5em rgba(10, 10, 10, 0.25); color: white; }

.bulma .file.is-black:active .file-cta, .bulma .file.is-black.is-active .file-cta { background-color: black; border-color: transparent; color: white; }

.bulma .file.is-light .file-cta { background-color: whitesmoke; border-color: transparent; color: #363636; }

.bulma .file.is-light:hover .file-cta, .bulma .file.is-light.is-hovered .file-cta { background-color: #eeeeee; border-color: transparent; color: #363636; }

.bulma .file.is-light:focus .file-cta, .bulma .file.is-light.is-focused .file-cta { border-color: transparent; box-shadow: 0 0 0.5em rgba(245, 245, 245, 0.25); color: #363636; }

.bulma .file.is-light:active .file-cta, .bulma .file.is-light.is-active .file-cta { background-color: #e8e8e8; border-color: transparent; color: #363636; }

.bulma .file.is-dark .file-cta { background-color: #363636; border-color: transparent; color: whitesmoke; }

.bulma .file.is-dark:hover .file-cta, .bulma .file.is-dark.is-hovered .file-cta { background-color: #2f2f2f; border-color: transparent; color: whitesmoke; }

.bulma .file.is-dark:focus .file-cta, .bulma .file.is-dark.is-focused .file-cta { border-color: transparent; box-shadow: 0 0 0.5em rgba(54, 54, 54, 0.25); color: whitesmoke; }

.bulma .file.is-dark:active .file-cta, .bulma .file.is-dark.is-active .file-cta { background-color: #292929; border-color: transparent; color: whitesmoke; }

.bulma .file.is-primary .file-cta { background-color: #00d1b2; border-color: transparent; color: #fff; }

.bulma .file.is-primary:hover .file-cta, .bulma .file.is-primary.is-hovered .file-cta { background-color: #00c4a7; border-color: transparent; color: #fff; }

.bulma .file.is-primary:focus .file-cta, .bulma .file.is-primary.is-focused .file-cta { border-color: transparent; box-shadow: 0 0 0.5em rgba(0, 209, 178, 0.25); color: #fff; }

.bulma .file.is-primary:active .file-cta, .bulma .file.is-primary.is-active .file-cta { background-color: #00b89c; border-color: transparent; color: #fff; }

.bulma .file.is-link .file-cta { background-color: #3273dc; border-color: transparent; color: #fff; }

.bulma .file.is-link:hover .file-cta, .bulma .file.is-link.is-hovered .file-cta { background-color: #276cda; border-color: transparent; color: #fff; }

.bulma .file.is-link:focus .file-cta, .bulma .file.is-link.is-focused .file-cta { border-color: transparent; box-shadow: 0 0 0.5em rgba(50, 115, 220, 0.25); color: #fff; }

.bulma .file.is-link:active .file-cta, .bulma .file.is-link.is-active .file-cta { background-color: #2366d1; border-color: transparent; color: #fff; }

.bulma .file.is-info .file-cta { background-color: #209cee; border-color: transparent; color: #fff; }

.bulma .file.is-info:hover .file-cta, .bulma .file.is-info.is-hovered .file-cta { background-color: #1496ed; border-color: transparent; color: #fff; }

.bulma .file.is-info:focus .file-cta, .bulma .file.is-info.is-focused .file-cta { border-color: transparent; box-shadow: 0 0 0.5em rgba(32, 156, 238, 0.25); color: #fff; }

.bulma .file.is-info:active .file-cta, .bulma .file.is-info.is-active .file-cta { background-color: #118fe4; border-color: transparent; color: #fff; }

.bulma .file.is-success .file-cta { background-color: #23d160; border-color: transparent; color: #fff; }

.bulma .file.is-success:hover .file-cta, .bulma .file.is-success.is-hovered .file-cta { background-color: #22c65b; border-color: transparent; color: #fff; }

.bulma .file.is-success:focus .file-cta, .bulma .file.is-success.is-focused .file-cta { border-color: transparent; box-shadow: 0 0 0.5em rgba(35, 209, 96, 0.25); color: #fff; }

.bulma .file.is-success:active .file-cta, .bulma .file.is-success.is-active .file-cta { background-color: #20bc56; border-color: transparent; color: #fff; }

.bulma .file.is-warning .file-cta { background-color: #ffdd57; border-color: transparent; color: rgba(0, 0, 0, 0.7); }

.bulma .file.is-warning:hover .file-cta, .bulma .file.is-warning.is-hovered .file-cta { background-color: #ffdb4a; border-color: transparent; color: rgba(0, 0, 0, 0.7); }

.bulma .file.is-warning:focus .file-cta, .bulma .file.is-warning.is-focused .file-cta { border-color: transparent; box-shadow: 0 0 0.5em rgba(255, 221, 87, 0.25); color: rgba(0, 0, 0, 0.7); }

.bulma .file.is-warning:active .file-cta, .bulma .file.is-warning.is-active .file-cta { background-color: #ffd83d; border-color: transparent; color: rgba(0, 0, 0, 0.7); }

.bulma .file.is-danger .file-cta { background-color: #ff3860; border-color: transparent; color: #fff; }

.bulma .file.is-danger:hover .file-cta, .bulma .file.is-danger.is-hovered .file-cta { background-color: #ff2b56; border-color: transparent; color: #fff; }

.bulma .file.is-danger:focus .file-cta, .bulma .file.is-danger.is-focused .file-cta { border-color: transparent; box-shadow: 0 0 0.5em rgba(255, 56, 96, 0.25); color: #fff; }

.bulma .file.is-danger:active .file-cta, .bulma .file.is-danger.is-active .file-cta { background-color: #ff1f4b; border-color: transparent; color: #fff; }

.bulma .file.is-small { font-size: 0.75rem; }

.bulma .file.is-medium { font-size: 1.25rem; }

.bulma .file.is-medium .file-icon .fa { font-size: 21px; }

.bulma .file.is-large { font-size: 1.5rem; }

.bulma .file.is-large .file-icon .fa { font-size: 28px; }

.bulma .file.has-name .file-cta { border-bottom-right-radius: 0; border-top-right-radius: 0; }

.bulma .file.has-name .file-name { border-bottom-left-radius: 0; border-top-left-radius: 0; }

.bulma .file.has-name.is-empty .file-cta { border-radius: 4px; }

.bulma .file.has-name.is-empty .file-name { display: none; }

.bulma .file.is-boxed .file-label { flex-direction: column; }

.bulma .file.is-boxed .file-cta { flex-direction: column; height: auto; padding: 1em 3em; }

.bulma .file.is-boxed .file-name { border-width: 0 1px 1px; }

.bulma .file.is-boxed .file-icon { height: 1.5em; width: 1.5em; }

.bulma .file.is-boxed .file-icon .fa { font-size: 21px; }

.bulma .file.is-boxed.is-small .file-icon .fa { font-size: 14px; }

.bulma .file.is-boxed.is-medium .file-icon .fa { font-size: 28px; }

.bulma .file.is-boxed.is-large .file-icon .fa { font-size: 35px; }

.bulma .file.is-boxed.has-name .file-cta { border-radius: 4px 4px 0 0; }

.bulma .file.is-boxed.has-name .file-name { border-radius: 0 0 4px 4px; border-width: 0 1px 1px; }

.bulma .file.is-centered { justify-content: center; }

.bulma .file.is-fullwidth .file-label { width: 100%; }

.bulma .file.is-fullwidth .file-name { flex-grow: 1; max-width: none; }

.bulma .file.is-right { justify-content: flex-end; }

.bulma .file.is-right .file-cta { border-radius: 0 4px 4px 0; }

.bulma .file.is-right .file-name { border-radius: 4px 0 0 4px; border-width: 1px 0 1px 1px; order: -1; }

.bulma .file-label { align-items: stretch; display: flex; cursor: pointer; justify-content: flex-start; overflow: hidden; position: relative; }

.bulma .file-label:hover .file-cta { background-color: #eeeeee; color: #363636; }

.bulma .file-label:hover .file-name { border-color: #d5d5d5; }

.bulma .file-label:active .file-cta { background-color: #e8e8e8; color: #363636; }

.bulma .file-label:active .file-name { border-color: #cfcfcf; }

.bulma .file-input { height: 100%; left: 0; opacity: 0; outline: none; position: absolute; top: 0; width: 100%; }

.bulma .file-cta, .bulma .file-name { border-color: #dbdbdb; border-radius: 4px; font-size: 1em; padding-left: 1em; padding-right: 1em; white-space: nowrap; }

.bulma .file-cta { background-color: whitesmoke; color: #4a4a4a; }

.bulma .file-name { border-color: #dbdbdb; border-style: solid; border-width: 1px 1px 1px 0; display: block; max-width: 16em; overflow: hidden; text-align: left; text-overflow: ellipsis; }

.bulma .file-icon { align-items: center; display: flex; height: 1em; justify-content: center; margin-right: 0.5em; width: 1em; }

.bulma .file-icon .fa { font-size: 14px; }

.bulma .label { color: #363636; display: block; font-size: 1rem; font-weight: 700; }

.bulma .label:not(:last-child) { margin-bottom: 0.5em; }

.bulma .label.is-small { font-size: 0.75rem; }

.bulma .label.is-medium { font-size: 1.25rem; }

.bulma .label.is-large { font-size: 1.5rem; }

.bulma .help { display: block; font-size: 0.75rem; margin-top: 0.25rem; }

.bulma .help.is-white { color: white; }

.bulma .help.is-black { color: #0a0a0a; }

.bulma .help.is-light { color: whitesmoke; }

.bulma .help.is-dark { color: #363636; }

.bulma .help.is-primary { color: #00d1b2; }

.bulma .help.is-link { color: #3273dc; }

.bulma .help.is-info { color: #209cee; }

.bulma .help.is-success { color: #23d160; }

.bulma .help.is-warning { color: #ffdd57; }

.bulma .help.is-danger { color: #ff3860; }

.bulma .field:not(:last-child) { margin-bottom: 0.75rem; }

.bulma .field.has-addons { display: flex; justify-content: flex-start; }

.bulma .field.has-addons .control:not(:last-child) { margin-right: -1px; }

.bulma .field.has-addons .control:not(:first-child):not(:last-child) .button, .bulma .field.has-addons .control:not(:first-child):not(:last-child) .input, .bulma .field.has-addons .control:not(:first-child):not(:last-child) .select select { border-radius: 0; }

.bulma .field.has-addons .control:first-child:not(:only-child) .button, .bulma .field.has-addons .control:first-child:not(:only-child) .input, .bulma .field.has-addons .control:first-child:not(:only-child) .select select { border-bottom-right-radius: 0; border-top-right-radius: 0; }

.bulma .field.has-addons .control:last-child:not(:only-child) .button, .bulma .field.has-addons .control:last-child:not(:only-child) .input, .bulma .field.has-addons .control:last-child:not(:only-child) .select select { border-bottom-left-radius: 0; border-top-left-radius: 0; }

.bulma .field.has-addons .control .button:not([disabled]):hover, .bulma .field.has-addons .control .button:not([disabled]).is-hovered, .bulma .field.has-addons .control .input:not([disabled]):hover, .bulma .field.has-addons .control .input:not([disabled]).is-hovered, .bulma .field.has-addons .control .select select:not([disabled]):hover, .bulma .field.has-addons .control .select select:not([disabled]).is-hovered { z-index: 2; }

.bulma .field.has-addons .control .button:not([disabled]):focus, .bulma .field.has-addons .control .button:not([disabled]).is-focused, .bulma .field.has-addons .control .button:not([disabled]):active, .bulma .field.has-addons .control .button:not([disabled]).is-active, .bulma .field.has-addons .control .input:not([disabled]):focus, .bulma .field.has-addons .control .input:not([disabled]).is-focused, .bulma .field.has-addons .control .input:not([disabled]):active, .bulma .field.has-addons .control .input:not([disabled]).is-active, .bulma .field.has-addons .control .select select:not([disabled]):focus, .bulma .field.has-addons .control .select select:not([disabled]).is-focused, .bulma .field.has-addons .control .select select:not([disabled]):active, .bulma .field.has-addons .control .select select:not([disabled]).is-active { z-index: 3; }

.bulma .field.has-addons .control .button:not([disabled]):focus:hover, .bulma .field.has-addons .control .button:not([disabled]).is-focused:hover, .bulma .field.has-addons .control .button:not([disabled]):active:hover, .bulma .field.has-addons .control .button:not([disabled]).is-active:hover, .bulma .field.has-addons .control .input:not([disabled]):focus:hover, .bulma .field.has-addons .control .input:not([disabled]).is-focused:hover, .bulma .field.has-addons .control .input:not([disabled]):active:hover, .bulma .field.has-addons .control .input:not([disabled]).is-active:hover, .bulma .field.has-addons .control .select select:not([disabled]):focus:hover, .bulma .field.has-addons .control .select select:not([disabled]).is-focused:hover, .bulma .field.has-addons .control .select select:not([disabled]):active:hover, .bulma .field.has-addons .control .select select:not([disabled]).is-active:hover { z-index: 4; }

.bulma .field.has-addons .control.is-expanded { flex-grow: 1; flex-shrink: 1; }

.bulma .field.has-addons.has-addons-centered { justify-content: center; }

.bulma .field.has-addons.has-addons-right { justify-content: flex-end; }

.bulma .field.has-addons.has-addons-fullwidth .control { flex-grow: 1; flex-shrink: 0; }

.bulma .field.is-grouped { display: flex; justify-content: flex-start; }

.bulma .field.is-grouped > .control { flex-shrink: 0; }

.bulma .field.is-grouped > .control:not(:last-child) { margin-bottom: 0; margin-right: 0.75rem; }

.bulma .field.is-grouped > .control.is-expanded { flex-grow: 1; flex-shrink: 1; }

.bulma .field.is-grouped.is-grouped-centered { justify-content: center; }

.bulma .field.is-grouped.is-grouped-right { justify-content: flex-end; }

.bulma .field.is-grouped.is-grouped-multiline { flex-wrap: wrap; }

.bulma .field.is-grouped.is-grouped-multiline > .control:last-child, .bulma .field.is-grouped.is-grouped-multiline > .control:not(:last-child) { margin-bottom: 0.75rem; }

.bulma .field.is-grouped.is-grouped-multiline:last-child { margin-bottom: -0.75rem; }

.bulma .field.is-grouped.is-grouped-multiline:not(:last-child) { margin-bottom: 0; }

@media screen and (min-width: 769px), print { .bulma .field.is-horizontal { display: flex; } }

.bulma .field-label .label { font-size: inherit; }

@media screen and (max-width: 768px) { .bulma .field-label { margin-bottom: 0.5rem; } }

@media screen and (min-width: 769px), print { .bulma .field-label { flex-basis: 0; flex-grow: 1; flex-shrink: 0; margin-right: 1.5rem; text-align: right; }
  .bulma .field-label.is-small { font-size: 0.75rem; padding-top: 0.375em; }
  .bulma .field-label.is-normal { padding-top: 0.375em; }
  .bulma .field-label.is-medium { font-size: 1.25rem; padding-top: 0.375em; }
  .bulma .field-label.is-large { font-size: 1.5rem; padding-top: 0.375em; } }

.bulma .field-body .field .field { margin-bottom: 0; }

@media screen and (min-width: 769px), print { .bulma .field-body { display: flex; flex-basis: 0; flex-grow: 5; flex-shrink: 1; }
  .bulma .field-body .field { margin-bottom: 0; }
  .bulma .field-body > .field { flex-shrink: 1; }
  .bulma .field-body > .field:not(.is-narrow) { flex-grow: 1; }
  .bulma .field-body > .field:not(:last-child) { margin-right: 0.75rem; } }

.bulma .control { box-sizing: border-box; clear: both; font-size: 1rem; position: relative; text-align: left; }

.bulma .control.has-icons-left .input:focus ~ .icon, .bulma .control.has-icons-left .select:focus ~ .icon, .bulma .control.has-icons-right .input:focus ~ .icon, .bulma .control.has-icons-right .select:focus ~ .icon { color: #7a7a7a; }

.bulma .control.has-icons-left .input.is-small ~ .icon, .bulma .control.has-icons-left .select.is-small ~ .icon, .bulma .control.has-icons-right .input.is-small ~ .icon, .bulma .control.has-icons-right .select.is-small ~ .icon { font-size: 0.75rem; }

.bulma .control.has-icons-left .input.is-medium ~ .icon, .bulma .control.has-icons-left .select.is-medium ~ .icon, .bulma .control.has-icons-right .input.is-medium ~ .icon, .bulma .control.has-icons-right .select.is-medium ~ .icon { font-size: 1.25rem; }

.bulma .control.has-icons-left .input.is-large ~ .icon, .bulma .control.has-icons-left .select.is-large ~ .icon, .bulma .control.has-icons-right .input.is-large ~ .icon, .bulma .control.has-icons-right .select.is-large ~ .icon { font-size: 1.5rem; }

.bulma .control.has-icons-left .icon, .bulma .control.has-icons-right .icon { color: #dbdbdb; height: 2.25em; pointer-events: none; position: absolute; top: 0; width: 2.25em; z-index: 4; }

.bulma .control.has-icons-left .input, .bulma .control.has-icons-left .select select { padding-left: 2.25em; }

.bulma .control.has-icons-left .icon.is-left { left: 0; }

.bulma .control.has-icons-right .input, .bulma .control.has-icons-right .select select { padding-right: 2.25em; }

.bulma .control.has-icons-right .icon.is-right { right: 0; }

.bulma .control.is-loading::after { position: absolute !important; right: 0.625em; top: 0.625em; z-index: 4; }

.bulma .control.is-loading.is-small:after { font-size: 0.75rem; }

.bulma .control.is-loading.is-medium:after { font-size: 1.25rem; }

.bulma .control.is-loading.is-large:after { font-size: 1.5rem; }

.bulma .breadcrumb { font-size: 1rem; white-space: nowrap; }

.bulma .breadcrumb a { align-items: center; color: #3273dc; display: flex; justify-content: center; padding: 0 0.75em; }

.bulma .breadcrumb a:hover { color: #363636; }

.bulma .breadcrumb li { align-items: center; display: flex; }

.bulma .breadcrumb li:first-child a { padding-left: 0; }

.bulma .breadcrumb li.is-active a { color: #363636; cursor: default; pointer-events: none; }

.bulma .breadcrumb li + li::before { color: #b5b5b5; content: "\\0002f"; }

.bulma .breadcrumb ul, .bulma .breadcrumb ol { align-items: flex-start; display: flex; flex-wrap: wrap; justify-content: flex-start; }

.bulma .breadcrumb .icon:first-child { margin-right: 0.5em; }

.bulma .breadcrumb .icon:last-child { margin-left: 0.5em; }

.bulma .breadcrumb.is-centered ol, .bulma .breadcrumb.is-centered ul { justify-content: center; }

.bulma .breadcrumb.is-right ol, .bulma .breadcrumb.is-right ul { justify-content: flex-end; }

.bulma .breadcrumb.is-small { font-size: 0.75rem; }

.bulma .breadcrumb.is-medium { font-size: 1.25rem; }

.bulma .breadcrumb.is-large { font-size: 1.5rem; }

.bulma .breadcrumb.has-arrow-separator li + li::before { content: "\\02192"; }

.bulma .breadcrumb.has-bullet-separator li + li::before { content: "\\02022"; }

.bulma .breadcrumb.has-dot-separator li + li::before { content: "\\000b7"; }

.bulma .breadcrumb.has-succeeds-separator li + li::before { content: "\\0227B"; }

.bulma .card { background-color: white; box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1); color: #4a4a4a; max-width: 100%; position: relative; }

.bulma .card-header { background-color: transparent; align-items: stretch; box-shadow: 0 1px 2px rgba(10, 10, 10, 0.1); display: flex; }

.bulma .card-header-title { align-items: center; color: #363636; display: flex; flex-grow: 1; font-weight: 700; padding: 0.75rem; }

.bulma .card-header-title.is-centered { justify-content: center; }

.bulma .card-header-icon { align-items: center; cursor: pointer; display: flex; justify-content: center; padding: 0.75rem; }

.bulma .card-image { display: block; position: relative; }

.bulma .card-content { background-color: transparent; padding: 1.5rem; }

.bulma .card-footer { background-color: transparent; border-top: 1px solid #dbdbdb; align-items: stretch; display: flex; }

.bulma .card-footer-item { align-items: center; display: flex; flex-basis: 0; flex-grow: 1; flex-shrink: 0; justify-content: center; padding: 0.75rem; }

.bulma .card-footer-item:not(:last-child) { border-right: 1px solid #dbdbdb; }

.bulma .card .media:not(:last-child) { margin-bottom: 1.5rem; }

.bulma .dropdown { display: inline-flex; position: relative; vertical-align: top; }

.bulma .dropdown.is-active .dropdown-menu, .bulma .dropdown.is-hoverable:hover .dropdown-menu { display: block; }

.bulma .dropdown.is-right .dropdown-menu { left: auto; right: 0; }

.bulma .dropdown.is-up .dropdown-menu { bottom: 100%; padding-bottom: 4px; padding-top: initial; top: auto; }

.bulma .dropdown-menu { display: none; left: 0; min-width: 12rem; padding-top: 4px; position: absolute; top: 100%; z-index: 20; }

.bulma .dropdown-content { background-color: white; border-radius: 4px; box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1); padding-bottom: 0.5rem; padding-top: 0.5rem; }

.bulma .dropdown-item { color: #4a4a4a; display: block; font-size: 0.875rem; line-height: 1.5; padding: 0.375rem 1rem; position: relative; }

.bulma a.dropdown-item, .bulma button.dropdown-item { padding-right: 3rem; text-align: left; white-space: nowrap; width: 100%; }

.bulma a.dropdown-item:hover, .bulma button.dropdown-item:hover { background-color: whitesmoke; color: #0a0a0a; }

.bulma a.dropdown-item.is-active, .bulma button.dropdown-item.is-active { background-color: #3273dc; color: #fff; }

.bulma .dropdown-divider { background-color: #dbdbdb; border: none; display: block; height: 1px; margin: 0.5rem 0; }

.bulma .level { align-items: center; justify-content: space-between; }

.bulma .level code { border-radius: 4px; }

.bulma .level img { display: inline-block; vertical-align: top; }

.bulma .level.is-mobile { display: flex; }

.bulma .level.is-mobile .level-left, .bulma .level.is-mobile .level-right { display: flex; }

.bulma .level.is-mobile .level-left + .level-right { margin-top: 0; }

.bulma .level.is-mobile .level-item:not(:last-child) { margin-bottom: 0; margin-right: 0.75rem; }

.bulma .level.is-mobile .level-item:not(.is-narrow) { flex-grow: 1; }

@media screen and (min-width: 769px), print { .bulma .level { display: flex; }
  .bulma .level > .level-item:not(.is-narrow) { flex-grow: 1; } }

.bulma .level-item { align-items: center; display: flex; flex-basis: auto; flex-grow: 0; flex-shrink: 0; justify-content: center; }

.bulma .level-item .title, .bulma .level-item .subtitle { margin-bottom: 0; }

@media screen and (max-width: 768px) { .bulma .level-item:not(:last-child) { margin-bottom: 0.75rem; } }

.bulma .level-left, .bulma .level-right { flex-basis: auto; flex-grow: 0; flex-shrink: 0; }

.bulma .level-left .level-item.is-flexible, .bulma .level-right .level-item.is-flexible { flex-grow: 1; }

@media screen and (min-width: 769px), print { .bulma .level-left .level-item:not(:last-child), .bulma .level-right .level-item:not(:last-child) { margin-right: 0.75rem; } }

.bulma .level-left { align-items: center; justify-content: flex-start; }

@media screen and (max-width: 768px) { .bulma .level-left + .level-right { margin-top: 1.5rem; } }

@media screen and (min-width: 769px), print { .bulma .level-left { display: flex; } }

.bulma .level-right { align-items: center; justify-content: flex-end; }

@media screen and (min-width: 769px), print { .bulma .level-right { display: flex; } }

.bulma .list { background-color: white; border-radius: 4px; box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1); }

.bulma .list-item { display: block; padding: 0.5em 1em; }

.bulma .list-item:not(a) { color: #4a4a4a; }

.bulma .list-item:first-child { border-top-left-radius: 4px; border-top-right-radius: 4px; }

.bulma .list-item:last-child { border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; }

.bulma .list-item:not(:last-child) { border-bottom: 1px solid #dbdbdb; }

.bulma .list-item.is-active { background-color: #3273dc; color: #fff; }

.bulma a.list-item { background-color: whitesmoke; cursor: pointer; }

.bulma .media { align-items: flex-start; display: flex; text-align: left; }

.bulma .media .content:not(:last-child) { margin-bottom: 0.75rem; }

.bulma .media .media { border-top: 1px solid rgba(219, 219, 219, 0.5); display: flex; padding-top: 0.75rem; }

.bulma .media .media .content:not(:last-child), .bulma .media .media .control:not(:last-child) { margin-bottom: 0.5rem; }

.bulma .media .media .media { padding-top: 0.5rem; }

.bulma .media .media .media + .media { margin-top: 0.5rem; }

.bulma .media + .media { border-top: 1px solid rgba(219, 219, 219, 0.5); margin-top: 1rem; padding-top: 1rem; }

.bulma .media.is-large + .media { margin-top: 1.5rem; padding-top: 1.5rem; }

.bulma .media-left, .bulma .media-right { flex-basis: auto; flex-grow: 0; flex-shrink: 0; }

.bulma .media-left { margin-right: 1rem; }

.bulma .media-right { margin-left: 1rem; }

.bulma .media-content { flex-basis: auto; flex-grow: 1; flex-shrink: 1; text-align: left; }

@media screen and (max-width: 768px) { .bulma .media-content { overflow-x: auto; } }

.bulma .menu { font-size: 1rem; }

.bulma .menu.is-small { font-size: 0.75rem; }

.bulma .menu.is-medium { font-size: 1.25rem; }

.bulma .menu.is-large { font-size: 1.5rem; }

.bulma .menu-list { line-height: 1.25; }

.bulma .menu-list a { border-radius: 2px; color: #4a4a4a; display: block; padding: 0.5em 0.75em; }

.bulma .menu-list a:hover { background-color: whitesmoke; color: #363636; }

.bulma .menu-list a.is-active { background-color: #3273dc; color: #fff; }

.bulma .menu-list li ul { border-left: 1px solid #dbdbdb; margin: 0.75em; padding-left: 0.75em; }

.bulma .menu-label { color: #7a7a7a; font-size: 0.75em; letter-spacing: 0.1em; text-transform: uppercase; }

.bulma .menu-label:not(:first-child) { margin-top: 1em; }

.bulma .menu-label:not(:last-child) { margin-bottom: 1em; }

.bulma .message { background-color: whitesmoke; border-radius: 4px; font-size: 1rem; }

.bulma .message strong { color: currentColor; }

.bulma .message a:not(.button):not(.tag):not(.dropdown-item) { color: currentColor; text-decoration: underline; }

.bulma .message.is-small { font-size: 0.75rem; }

.bulma .message.is-medium { font-size: 1.25rem; }

.bulma .message.is-large { font-size: 1.5rem; }

.bulma .message.is-white { background-color: white; }

.bulma .message.is-white .message-header { background-color: white; color: #0a0a0a; }

.bulma .message.is-white .message-body { border-color: white; color: #4d4d4d; }

.bulma .message.is-black { background-color: #fafafa; }

.bulma .message.is-black .message-header { background-color: #0a0a0a; color: white; }

.bulma .message.is-black .message-body { border-color: #0a0a0a; color: #090909; }

.bulma .message.is-light { background-color: #fafafa; }

.bulma .message.is-light .message-header { background-color: whitesmoke; color: #363636; }

.bulma .message.is-light .message-body { border-color: whitesmoke; color: #505050; }

.bulma .message.is-dark { background-color: #fafafa; }

.bulma .message.is-dark .message-header { background-color: #363636; color: whitesmoke; }

.bulma .message.is-dark .message-body { border-color: #363636; color: #2a2a2a; }

.bulma .message.is-primary { background-color: #f5fffd; }

.bulma .message.is-primary .message-header { background-color: #00d1b2; color: #fff; }

.bulma .message.is-primary .message-body { border-color: #00d1b2; color: #021310; }

.bulma .message.is-link { background-color: #f6f9fe; }

.bulma .message.is-link .message-header { background-color: #3273dc; color: #fff; }

.bulma .message.is-link .message-body { border-color: #3273dc; color: #22509a; }

.bulma .message.is-info { background-color: #f6fbfe; }

.bulma .message.is-info .message-header { background-color: #209cee; color: #fff; }

.bulma .message.is-info .message-body { border-color: #209cee; color: #12537e; }

.bulma .message.is-success { background-color: #f6fef9; }

.bulma .message.is-success .message-header { background-color: #23d160; color: #fff; }

.bulma .message.is-success .message-body { border-color: #23d160; color: #0e301a; }

.bulma .message.is-warning { background-color: #fffdf5; }

.bulma .message.is-warning .message-header { background-color: #ffdd57; color: rgba(0, 0, 0, 0.7); }

.bulma .message.is-warning .message-body { border-color: #ffdd57; color: #3b3108; }

.bulma .message.is-danger { background-color: #fff5f7; }

.bulma .message.is-danger .message-header { background-color: #ff3860; color: #fff; }

.bulma .message.is-danger .message-body { border-color: #ff3860; color: #cd0930; }

.bulma .message-header { align-items: center; background-color: #4a4a4a; border-radius: 4px 4px 0 0; color: #fff; display: flex; font-weight: 700; justify-content: space-between; line-height: 1.25; padding: 0.75em 1em; position: relative; }

.bulma .message-header .delete { flex-grow: 0; flex-shrink: 0; margin-left: 0.75em; }

.bulma .message-header + .message-body { border-width: 0; border-top-left-radius: 0; border-top-right-radius: 0; }

.bulma .message-body { border-color: #dbdbdb; border-radius: 4px; border-style: solid; border-width: 0 0 0 4px; color: #4a4a4a; padding: 1.25em 1.5em; }

.bulma .message-body code, .bulma .message-body pre { background-color: white; }

.bulma .message-body pre code { background-color: transparent; }

.bulma .modal { align-items: center; display: none; flex-direction: column; justify-content: center; overflow: hidden; position: fixed; z-index: 40; }

.bulma .modal.is-active { display: flex; }

.bulma .modal-background { background-color: rgba(10, 10, 10, 0.86); }

.bulma .modal-content, .bulma .modal-card { margin: 0 20px; max-height: calc(100vh - 160px); overflow: auto; position: relative; width: 100%; }

@media screen and (min-width: 769px), print { .bulma .modal-content, .bulma .modal-card { margin: 0 auto; max-height: calc(100vh - 40px); width: 640px; } }

.bulma .modal-close { background: none; height: 40px; position: fixed; right: 20px; top: 20px; width: 40px; }

.bulma .modal-card { display: flex; flex-direction: column; max-height: calc(100vh - 40px); overflow: hidden; -ms-overflow-y: visible; }

.bulma .modal-card-head, .bulma .modal-card-foot { align-items: center; background-color: whitesmoke; display: flex; flex-shrink: 0; justify-content: flex-start; padding: 20px; position: relative; }

.bulma .modal-card-head { border-bottom: 1px solid #dbdbdb; border-top-left-radius: 6px; border-top-right-radius: 6px; }

.bulma .modal-card-title { color: #363636; flex-grow: 1; flex-shrink: 0; font-size: 1.5rem; line-height: 1; }

.bulma .modal-card-foot { border-bottom-left-radius: 6px; border-bottom-right-radius: 6px; border-top: 1px solid #dbdbdb; }

.bulma .modal-card-foot .button:not(:last-child) { margin-right: 0.5em; }

.bulma .modal-card-body { -webkit-overflow-scrolling: touch; background-color: white; flex-grow: 1; flex-shrink: 1; overflow: auto; padding: 20px; }

.bulma .navbar { background-color: white; min-height: 3.25rem; position: relative; z-index: 30; }

.bulma .navbar.is-white { background-color: white; color: #0a0a0a; }

.bulma .navbar.is-white .navbar-brand > .navbar-item, .bulma .navbar.is-white .navbar-brand .navbar-link { color: #0a0a0a; }

.bulma .navbar.is-white .navbar-brand > a.navbar-item:focus, .bulma .navbar.is-white .navbar-brand > a.navbar-item:hover, .bulma .navbar.is-white .navbar-brand > a.navbar-item.is-active, .bulma .navbar.is-white .navbar-brand .navbar-link:focus, .bulma .navbar.is-white .navbar-brand .navbar-link:hover, .bulma .navbar.is-white .navbar-brand .navbar-link.is-active { background-color: #f2f2f2; color: #0a0a0a; }

.bulma .navbar.is-white .navbar-brand .navbar-link::after { border-color: #0a0a0a; }

.bulma .navbar.is-white .navbar-burger { color: #0a0a0a; }

@media screen and (min-width: 1024px) { .bulma .navbar.is-white .navbar-start > .navbar-item, .bulma .navbar.is-white .navbar-start .navbar-link, .bulma .navbar.is-white .navbar-end > .navbar-item, .bulma .navbar.is-white .navbar-end .navbar-link { color: #0a0a0a; }
  .bulma .navbar.is-white .navbar-start > a.navbar-item:focus, .bulma .navbar.is-white .navbar-start > a.navbar-item:hover, .bulma .navbar.is-white .navbar-start > a.navbar-item.is-active, .bulma .navbar.is-white .navbar-start .navbar-link:focus, .bulma .navbar.is-white .navbar-start .navbar-link:hover, .bulma .navbar.is-white .navbar-start .navbar-link.is-active, .bulma .navbar.is-white .navbar-end > a.navbar-item:focus, .bulma .navbar.is-white .navbar-end > a.navbar-item:hover, .bulma .navbar.is-white .navbar-end > a.navbar-item.is-active, .bulma .navbar.is-white .navbar-end .navbar-link:focus, .bulma .navbar.is-white .navbar-end .navbar-link:hover, .bulma .navbar.is-white .navbar-end .navbar-link.is-active { background-color: #f2f2f2; color: #0a0a0a; }
  .bulma .navbar.is-white .navbar-start .navbar-link::after, .bulma .navbar.is-white .navbar-end .navbar-link::after { border-color: #0a0a0a; }
  .bulma .navbar.is-white .navbar-item.has-dropdown:focus .navbar-link, .bulma .navbar.is-white .navbar-item.has-dropdown:hover .navbar-link, .bulma .navbar.is-white .navbar-item.has-dropdown.is-active .navbar-link { background-color: #f2f2f2; color: #0a0a0a; }
  .bulma .navbar.is-white .navbar-dropdown a.navbar-item.is-active { background-color: white; color: #0a0a0a; } }

.bulma .navbar.is-black { background-color: #0a0a0a; color: white; }

.bulma .navbar.is-black .navbar-brand > .navbar-item, .bulma .navbar.is-black .navbar-brand .navbar-link { color: white; }

.bulma .navbar.is-black .navbar-brand > a.navbar-item:focus, .bulma .navbar.is-black .navbar-brand > a.navbar-item:hover, .bulma .navbar.is-black .navbar-brand > a.navbar-item.is-active, .bulma .navbar.is-black .navbar-brand .navbar-link:focus, .bulma .navbar.is-black .navbar-brand .navbar-link:hover, .bulma .navbar.is-black .navbar-brand .navbar-link.is-active { background-color: black; color: white; }

.bulma .navbar.is-black .navbar-brand .navbar-link::after { border-color: white; }

.bulma .navbar.is-black .navbar-burger { color: white; }

@media screen and (min-width: 1024px) { .bulma .navbar.is-black .navbar-start > .navbar-item, .bulma .navbar.is-black .navbar-start .navbar-link, .bulma .navbar.is-black .navbar-end > .navbar-item, .bulma .navbar.is-black .navbar-end .navbar-link { color: white; }
  .bulma .navbar.is-black .navbar-start > a.navbar-item:focus, .bulma .navbar.is-black .navbar-start > a.navbar-item:hover, .bulma .navbar.is-black .navbar-start > a.navbar-item.is-active, .bulma .navbar.is-black .navbar-start .navbar-link:focus, .bulma .navbar.is-black .navbar-start .navbar-link:hover, .bulma .navbar.is-black .navbar-start .navbar-link.is-active, .bulma .navbar.is-black .navbar-end > a.navbar-item:focus, .bulma .navbar.is-black .navbar-end > a.navbar-item:hover, .bulma .navbar.is-black .navbar-end > a.navbar-item.is-active, .bulma .navbar.is-black .navbar-end .navbar-link:focus, .bulma .navbar.is-black .navbar-end .navbar-link:hover, .bulma .navbar.is-black .navbar-end .navbar-link.is-active { background-color: black; color: white; }
  .bulma .navbar.is-black .navbar-start .navbar-link::after, .bulma .navbar.is-black .navbar-end .navbar-link::after { border-color: white; }
  .bulma .navbar.is-black .navbar-item.has-dropdown:focus .navbar-link, .bulma .navbar.is-black .navbar-item.has-dropdown:hover .navbar-link, .bulma .navbar.is-black .navbar-item.has-dropdown.is-active .navbar-link { background-color: black; color: white; }
  .bulma .navbar.is-black .navbar-dropdown a.navbar-item.is-active { background-color: #0a0a0a; color: white; } }

.bulma .navbar.is-light { background-color: whitesmoke; color: #363636; }

.bulma .navbar.is-light .navbar-brand > .navbar-item, .bulma .navbar.is-light .navbar-brand .navbar-link { color: #363636; }

.bulma .navbar.is-light .navbar-brand > a.navbar-item:focus, .bulma .navbar.is-light .navbar-brand > a.navbar-item:hover, .bulma .navbar.is-light .navbar-brand > a.navbar-item.is-active, .bulma .navbar.is-light .navbar-brand .navbar-link:focus, .bulma .navbar.is-light .navbar-brand .navbar-link:hover, .bulma .navbar.is-light .navbar-brand .navbar-link.is-active { background-color: #e8e8e8; color: #363636; }

.bulma .navbar.is-light .navbar-brand .navbar-link::after { border-color: #363636; }

.bulma .navbar.is-light .navbar-burger { color: #363636; }

@media screen and (min-width: 1024px) { .bulma .navbar.is-light .navbar-start > .navbar-item, .bulma .navbar.is-light .navbar-start .navbar-link, .bulma .navbar.is-light .navbar-end > .navbar-item, .bulma .navbar.is-light .navbar-end .navbar-link { color: #363636; }
  .bulma .navbar.is-light .navbar-start > a.navbar-item:focus, .bulma .navbar.is-light .navbar-start > a.navbar-item:hover, .bulma .navbar.is-light .navbar-start > a.navbar-item.is-active, .bulma .navbar.is-light .navbar-start .navbar-link:focus, .bulma .navbar.is-light .navbar-start .navbar-link:hover, .bulma .navbar.is-light .navbar-start .navbar-link.is-active, .bulma .navbar.is-light .navbar-end > a.navbar-item:focus, .bulma .navbar.is-light .navbar-end > a.navbar-item:hover, .bulma .navbar.is-light .navbar-end > a.navbar-item.is-active, .bulma .navbar.is-light .navbar-end .navbar-link:focus, .bulma .navbar.is-light .navbar-end .navbar-link:hover, .bulma .navbar.is-light .navbar-end .navbar-link.is-active { background-color: #e8e8e8; color: #363636; }
  .bulma .navbar.is-light .navbar-start .navbar-link::after, .bulma .navbar.is-light .navbar-end .navbar-link::after { border-color: #363636; }
  .bulma .navbar.is-light .navbar-item.has-dropdown:focus .navbar-link, .bulma .navbar.is-light .navbar-item.has-dropdown:hover .navbar-link, .bulma .navbar.is-light .navbar-item.has-dropdown.is-active .navbar-link { background-color: #e8e8e8; color: #363636; }
  .bulma .navbar.is-light .navbar-dropdown a.navbar-item.is-active { background-color: whitesmoke; color: #363636; } }

.bulma .navbar.is-dark { background-color: #363636; color: whitesmoke; }

.bulma .navbar.is-dark .navbar-brand > .navbar-item, .bulma .navbar.is-dark .navbar-brand .navbar-link { color: whitesmoke; }

.bulma .navbar.is-dark .navbar-brand > a.navbar-item:focus, .bulma .navbar.is-dark .navbar-brand > a.navbar-item:hover, .bulma .navbar.is-dark .navbar-brand > a.navbar-item.is-active, .bulma .navbar.is-dark .navbar-brand .navbar-link:focus, .bulma .navbar.is-dark .navbar-brand .navbar-link:hover, .bulma .navbar.is-dark .navbar-brand .navbar-link.is-active { background-color: #292929; color: whitesmoke; }

.bulma .navbar.is-dark .navbar-brand .navbar-link::after { border-color: whitesmoke; }

.bulma .navbar.is-dark .navbar-burger { color: whitesmoke; }

@media screen and (min-width: 1024px) { .bulma .navbar.is-dark .navbar-start > .navbar-item, .bulma .navbar.is-dark .navbar-start .navbar-link, .bulma .navbar.is-dark .navbar-end > .navbar-item, .bulma .navbar.is-dark .navbar-end .navbar-link { color: whitesmoke; }
  .bulma .navbar.is-dark .navbar-start > a.navbar-item:focus, .bulma .navbar.is-dark .navbar-start > a.navbar-item:hover, .bulma .navbar.is-dark .navbar-start > a.navbar-item.is-active, .bulma .navbar.is-dark .navbar-start .navbar-link:focus, .bulma .navbar.is-dark .navbar-start .navbar-link:hover, .bulma .navbar.is-dark .navbar-start .navbar-link.is-active, .bulma .navbar.is-dark .navbar-end > a.navbar-item:focus, .bulma .navbar.is-dark .navbar-end > a.navbar-item:hover, .bulma .navbar.is-dark .navbar-end > a.navbar-item.is-active, .bulma .navbar.is-dark .navbar-end .navbar-link:focus, .bulma .navbar.is-dark .navbar-end .navbar-link:hover, .bulma .navbar.is-dark .navbar-end .navbar-link.is-active { background-color: #292929; color: whitesmoke; }
  .bulma .navbar.is-dark .navbar-start .navbar-link::after, .bulma .navbar.is-dark .navbar-end .navbar-link::after { border-color: whitesmoke; }
  .bulma .navbar.is-dark .navbar-item.has-dropdown:focus .navbar-link, .bulma .navbar.is-dark .navbar-item.has-dropdown:hover .navbar-link, .bulma .navbar.is-dark .navbar-item.has-dropdown.is-active .navbar-link { background-color: #292929; color: whitesmoke; }
  .bulma .navbar.is-dark .navbar-dropdown a.navbar-item.is-active { background-color: #363636; color: whitesmoke; } }

.bulma .navbar.is-primary { background-color: #00d1b2; color: #fff; }

.bulma .navbar.is-primary .navbar-brand > .navbar-item, .bulma .navbar.is-primary .navbar-brand .navbar-link { color: #fff; }

.bulma .navbar.is-primary .navbar-brand > a.navbar-item:focus, .bulma .navbar.is-primary .navbar-brand > a.navbar-item:hover, .bulma .navbar.is-primary .navbar-brand > a.navbar-item.is-active, .bulma .navbar.is-primary .navbar-brand .navbar-link:focus, .bulma .navbar.is-primary .navbar-brand .navbar-link:hover, .bulma .navbar.is-primary .navbar-brand .navbar-link.is-active { background-color: #00b89c; color: #fff; }

.bulma .navbar.is-primary .navbar-brand .navbar-link::after { border-color: #fff; }

.bulma .navbar.is-primary .navbar-burger { color: #fff; }

@media screen and (min-width: 1024px) { .bulma .navbar.is-primary .navbar-start > .navbar-item, .bulma .navbar.is-primary .navbar-start .navbar-link, .bulma .navbar.is-primary .navbar-end > .navbar-item, .bulma .navbar.is-primary .navbar-end .navbar-link { color: #fff; }
  .bulma .navbar.is-primary .navbar-start > a.navbar-item:focus, .bulma .navbar.is-primary .navbar-start > a.navbar-item:hover, .bulma .navbar.is-primary .navbar-start > a.navbar-item.is-active, .bulma .navbar.is-primary .navbar-start .navbar-link:focus, .bulma .navbar.is-primary .navbar-start .navbar-link:hover, .bulma .navbar.is-primary .navbar-start .navbar-link.is-active, .bulma .navbar.is-primary .navbar-end > a.navbar-item:focus, .bulma .navbar.is-primary .navbar-end > a.navbar-item:hover, .bulma .navbar.is-primary .navbar-end > a.navbar-item.is-active, .bulma .navbar.is-primary .navbar-end .navbar-link:focus, .bulma .navbar.is-primary .navbar-end .navbar-link:hover, .bulma .navbar.is-primary .navbar-end .navbar-link.is-active { background-color: #00b89c; color: #fff; }
  .bulma .navbar.is-primary .navbar-start .navbar-link::after, .bulma .navbar.is-primary .navbar-end .navbar-link::after { border-color: #fff; }
  .bulma .navbar.is-primary .navbar-item.has-dropdown:focus .navbar-link, .bulma .navbar.is-primary .navbar-item.has-dropdown:hover .navbar-link, .bulma .navbar.is-primary .navbar-item.has-dropdown.is-active .navbar-link { background-color: #00b89c; color: #fff; }
  .bulma .navbar.is-primary .navbar-dropdown a.navbar-item.is-active { background-color: #00d1b2; color: #fff; } }

.bulma .navbar.is-link { background-color: #3273dc; color: #fff; }

.bulma .navbar.is-link .navbar-brand > .navbar-item, .bulma .navbar.is-link .navbar-brand .navbar-link { color: #fff; }

.bulma .navbar.is-link .navbar-brand > a.navbar-item:focus, .bulma .navbar.is-link .navbar-brand > a.navbar-item:hover, .bulma .navbar.is-link .navbar-brand > a.navbar-item.is-active, .bulma .navbar.is-link .navbar-brand .navbar-link:focus, .bulma .navbar.is-link .navbar-brand .navbar-link:hover, .bulma .navbar.is-link .navbar-brand .navbar-link.is-active { background-color: #2366d1; color: #fff; }

.bulma .navbar.is-link .navbar-brand .navbar-link::after { border-color: #fff; }

.bulma .navbar.is-link .navbar-burger { color: #fff; }

@media screen and (min-width: 1024px) { .bulma .navbar.is-link .navbar-start > .navbar-item, .bulma .navbar.is-link .navbar-start .navbar-link, .bulma .navbar.is-link .navbar-end > .navbar-item, .bulma .navbar.is-link .navbar-end .navbar-link { color: #fff; }
  .bulma .navbar.is-link .navbar-start > a.navbar-item:focus, .bulma .navbar.is-link .navbar-start > a.navbar-item:hover, .bulma .navbar.is-link .navbar-start > a.navbar-item.is-active, .bulma .navbar.is-link .navbar-start .navbar-link:focus, .bulma .navbar.is-link .navbar-start .navbar-link:hover, .bulma .navbar.is-link .navbar-start .navbar-link.is-active, .bulma .navbar.is-link .navbar-end > a.navbar-item:focus, .bulma .navbar.is-link .navbar-end > a.navbar-item:hover, .bulma .navbar.is-link .navbar-end > a.navbar-item.is-active, .bulma .navbar.is-link .navbar-end .navbar-link:focus, .bulma .navbar.is-link .navbar-end .navbar-link:hover, .bulma .navbar.is-link .navbar-end .navbar-link.is-active { background-color: #2366d1; color: #fff; }
  .bulma .navbar.is-link .navbar-start .navbar-link::after, .bulma .navbar.is-link .navbar-end .navbar-link::after { border-color: #fff; }
  .bulma .navbar.is-link .navbar-item.has-dropdown:focus .navbar-link, .bulma .navbar.is-link .navbar-item.has-dropdown:hover .navbar-link, .bulma .navbar.is-link .navbar-item.has-dropdown.is-active .navbar-link { background-color: #2366d1; color: #fff; }
  .bulma .navbar.is-link .navbar-dropdown a.navbar-item.is-active { background-color: #3273dc; color: #fff; } }

.bulma .navbar.is-info { background-color: #209cee; color: #fff; }

.bulma .navbar.is-info .navbar-brand > .navbar-item, .bulma .navbar.is-info .navbar-brand .navbar-link { color: #fff; }

.bulma .navbar.is-info .navbar-brand > a.navbar-item:focus, .bulma .navbar.is-info .navbar-brand > a.navbar-item:hover, .bulma .navbar.is-info .navbar-brand > a.navbar-item.is-active, .bulma .navbar.is-info .navbar-brand .navbar-link:focus, .bulma .navbar.is-info .navbar-brand .navbar-link:hover, .bulma .navbar.is-info .navbar-brand .navbar-link.is-active { background-color: #118fe4; color: #fff; }

.bulma .navbar.is-info .navbar-brand .navbar-link::after { border-color: #fff; }

.bulma .navbar.is-info .navbar-burger { color: #fff; }

@media screen and (min-width: 1024px) { .bulma .navbar.is-info .navbar-start > .navbar-item, .bulma .navbar.is-info .navbar-start .navbar-link, .bulma .navbar.is-info .navbar-end > .navbar-item, .bulma .navbar.is-info .navbar-end .navbar-link { color: #fff; }
  .bulma .navbar.is-info .navbar-start > a.navbar-item:focus, .bulma .navbar.is-info .navbar-start > a.navbar-item:hover, .bulma .navbar.is-info .navbar-start > a.navbar-item.is-active, .bulma .navbar.is-info .navbar-start .navbar-link:focus, .bulma .navbar.is-info .navbar-start .navbar-link:hover, .bulma .navbar.is-info .navbar-start .navbar-link.is-active, .bulma .navbar.is-info .navbar-end > a.navbar-item:focus, .bulma .navbar.is-info .navbar-end > a.navbar-item:hover, .bulma .navbar.is-info .navbar-end > a.navbar-item.is-active, .bulma .navbar.is-info .navbar-end .navbar-link:focus, .bulma .navbar.is-info .navbar-end .navbar-link:hover, .bulma .navbar.is-info .navbar-end .navbar-link.is-active { background-color: #118fe4; color: #fff; }
  .bulma .navbar.is-info .navbar-start .navbar-link::after, .bulma .navbar.is-info .navbar-end .navbar-link::after { border-color: #fff; }
  .bulma .navbar.is-info .navbar-item.has-dropdown:focus .navbar-link, .bulma .navbar.is-info .navbar-item.has-dropdown:hover .navbar-link, .bulma .navbar.is-info .navbar-item.has-dropdown.is-active .navbar-link { background-color: #118fe4; color: #fff; }
  .bulma .navbar.is-info .navbar-dropdown a.navbar-item.is-active { background-color: #209cee; color: #fff; } }

.bulma .navbar.is-success { background-color: #23d160; color: #fff; }

.bulma .navbar.is-success .navbar-brand > .navbar-item, .bulma .navbar.is-success .navbar-brand .navbar-link { color: #fff; }

.bulma .navbar.is-success .navbar-brand > a.navbar-item:focus, .bulma .navbar.is-success .navbar-brand > a.navbar-item:hover, .bulma .navbar.is-success .navbar-brand > a.navbar-item.is-active, .bulma .navbar.is-success .navbar-brand .navbar-link:focus, .bulma .navbar.is-success .navbar-brand .navbar-link:hover, .bulma .navbar.is-success .navbar-brand .navbar-link.is-active { background-color: #20bc56; color: #fff; }

.bulma .navbar.is-success .navbar-brand .navbar-link::after { border-color: #fff; }

.bulma .navbar.is-success .navbar-burger { color: #fff; }

@media screen and (min-width: 1024px) { .bulma .navbar.is-success .navbar-start > .navbar-item, .bulma .navbar.is-success .navbar-start .navbar-link, .bulma .navbar.is-success .navbar-end > .navbar-item, .bulma .navbar.is-success .navbar-end .navbar-link { color: #fff; }
  .bulma .navbar.is-success .navbar-start > a.navbar-item:focus, .bulma .navbar.is-success .navbar-start > a.navbar-item:hover, .bulma .navbar.is-success .navbar-start > a.navbar-item.is-active, .bulma .navbar.is-success .navbar-start .navbar-link:focus, .bulma .navbar.is-success .navbar-start .navbar-link:hover, .bulma .navbar.is-success .navbar-start .navbar-link.is-active, .bulma .navbar.is-success .navbar-end > a.navbar-item:focus, .bulma .navbar.is-success .navbar-end > a.navbar-item:hover, .bulma .navbar.is-success .navbar-end > a.navbar-item.is-active, .bulma .navbar.is-success .navbar-end .navbar-link:focus, .bulma .navbar.is-success .navbar-end .navbar-link:hover, .bulma .navbar.is-success .navbar-end .navbar-link.is-active { background-color: #20bc56; color: #fff; }
  .bulma .navbar.is-success .navbar-start .navbar-link::after, .bulma .navbar.is-success .navbar-end .navbar-link::after { border-color: #fff; }
  .bulma .navbar.is-success .navbar-item.has-dropdown:focus .navbar-link, .bulma .navbar.is-success .navbar-item.has-dropdown:hover .navbar-link, .bulma .navbar.is-success .navbar-item.has-dropdown.is-active .navbar-link { background-color: #20bc56; color: #fff; }
  .bulma .navbar.is-success .navbar-dropdown a.navbar-item.is-active { background-color: #23d160; color: #fff; } }

.bulma .navbar.is-warning { background-color: #ffdd57; color: rgba(0, 0, 0, 0.7); }

.bulma .navbar.is-warning .navbar-brand > .navbar-item, .bulma .navbar.is-warning .navbar-brand .navbar-link { color: rgba(0, 0, 0, 0.7); }

.bulma .navbar.is-warning .navbar-brand > a.navbar-item:focus, .bulma .navbar.is-warning .navbar-brand > a.navbar-item:hover, .bulma .navbar.is-warning .navbar-brand > a.navbar-item.is-active, .bulma .navbar.is-warning .navbar-brand .navbar-link:focus, .bulma .navbar.is-warning .navbar-brand .navbar-link:hover, .bulma .navbar.is-warning .navbar-brand .navbar-link.is-active { background-color: #ffd83d; color: rgba(0, 0, 0, 0.7); }

.bulma .navbar.is-warning .navbar-brand .navbar-link::after { border-color: rgba(0, 0, 0, 0.7); }

.bulma .navbar.is-warning .navbar-burger { color: rgba(0, 0, 0, 0.7); }

@media screen and (min-width: 1024px) { .bulma .navbar.is-warning .navbar-start > .navbar-item, .bulma .navbar.is-warning .navbar-start .navbar-link, .bulma .navbar.is-warning .navbar-end > .navbar-item, .bulma .navbar.is-warning .navbar-end .navbar-link { color: rgba(0, 0, 0, 0.7); }
  .bulma .navbar.is-warning .navbar-start > a.navbar-item:focus, .bulma .navbar.is-warning .navbar-start > a.navbar-item:hover, .bulma .navbar.is-warning .navbar-start > a.navbar-item.is-active, .bulma .navbar.is-warning .navbar-start .navbar-link:focus, .bulma .navbar.is-warning .navbar-start .navbar-link:hover, .bulma .navbar.is-warning .navbar-start .navbar-link.is-active, .bulma .navbar.is-warning .navbar-end > a.navbar-item:focus, .bulma .navbar.is-warning .navbar-end > a.navbar-item:hover, .bulma .navbar.is-warning .navbar-end > a.navbar-item.is-active, .bulma .navbar.is-warning .navbar-end .navbar-link:focus, .bulma .navbar.is-warning .navbar-end .navbar-link:hover, .bulma .navbar.is-warning .navbar-end .navbar-link.is-active { background-color: #ffd83d; color: rgba(0, 0, 0, 0.7); }
  .bulma .navbar.is-warning .navbar-start .navbar-link::after, .bulma .navbar.is-warning .navbar-end .navbar-link::after { border-color: rgba(0, 0, 0, 0.7); }
  .bulma .navbar.is-warning .navbar-item.has-dropdown:focus .navbar-link, .bulma .navbar.is-warning .navbar-item.has-dropdown:hover .navbar-link, .bulma .navbar.is-warning .navbar-item.has-dropdown.is-active .navbar-link { background-color: #ffd83d; color: rgba(0, 0, 0, 0.7); }
  .bulma .navbar.is-warning .navbar-dropdown a.navbar-item.is-active { background-color: #ffdd57; color: rgba(0, 0, 0, 0.7); } }

.bulma .navbar.is-danger { background-color: #ff3860; color: #fff; }

.bulma .navbar.is-danger .navbar-brand > .navbar-item, .bulma .navbar.is-danger .navbar-brand .navbar-link { color: #fff; }

.bulma .navbar.is-danger .navbar-brand > a.navbar-item:focus, .bulma .navbar.is-danger .navbar-brand > a.navbar-item:hover, .bulma .navbar.is-danger .navbar-brand > a.navbar-item.is-active, .bulma .navbar.is-danger .navbar-brand .navbar-link:focus, .bulma .navbar.is-danger .navbar-brand .navbar-link:hover, .bulma .navbar.is-danger .navbar-brand .navbar-link.is-active { background-color: #ff1f4b; color: #fff; }

.bulma .navbar.is-danger .navbar-brand .navbar-link::after { border-color: #fff; }

.bulma .navbar.is-danger .navbar-burger { color: #fff; }

@media screen and (min-width: 1024px) { .bulma .navbar.is-danger .navbar-start > .navbar-item, .bulma .navbar.is-danger .navbar-start .navbar-link, .bulma .navbar.is-danger .navbar-end > .navbar-item, .bulma .navbar.is-danger .navbar-end .navbar-link { color: #fff; }
  .bulma .navbar.is-danger .navbar-start > a.navbar-item:focus, .bulma .navbar.is-danger .navbar-start > a.navbar-item:hover, .bulma .navbar.is-danger .navbar-start > a.navbar-item.is-active, .bulma .navbar.is-danger .navbar-start .navbar-link:focus, .bulma .navbar.is-danger .navbar-start .navbar-link:hover, .bulma .navbar.is-danger .navbar-start .navbar-link.is-active, .bulma .navbar.is-danger .navbar-end > a.navbar-item:focus, .bulma .navbar.is-danger .navbar-end > a.navbar-item:hover, .bulma .navbar.is-danger .navbar-end > a.navbar-item.is-active, .bulma .navbar.is-danger .navbar-end .navbar-link:focus, .bulma .navbar.is-danger .navbar-end .navbar-link:hover, .bulma .navbar.is-danger .navbar-end .navbar-link.is-active { background-color: #ff1f4b; color: #fff; }
  .bulma .navbar.is-danger .navbar-start .navbar-link::after, .bulma .navbar.is-danger .navbar-end .navbar-link::after { border-color: #fff; }
  .bulma .navbar.is-danger .navbar-item.has-dropdown:focus .navbar-link, .bulma .navbar.is-danger .navbar-item.has-dropdown:hover .navbar-link, .bulma .navbar.is-danger .navbar-item.has-dropdown.is-active .navbar-link { background-color: #ff1f4b; color: #fff; }
  .bulma .navbar.is-danger .navbar-dropdown a.navbar-item.is-active { background-color: #ff3860; color: #fff; } }

.bulma .navbar > .container { align-items: stretch; display: flex; min-height: 3.25rem; width: 100%; }

.bulma .navbar.has-shadow { box-shadow: 0 2px 0 0 whitesmoke; }

.bulma .navbar.is-fixed-bottom, .bulma .navbar.is-fixed-top { left: 0; position: fixed; right: 0; z-index: 30; }

.bulma .navbar.is-fixed-bottom { bottom: 0; }

.bulma .navbar.is-fixed-bottom.has-shadow { box-shadow: 0 -2px 0 0 whitesmoke; }

.bulma .navbar.is-fixed-top { top: 0; }

.bulma .has-navbar-fixed-top, .bulma .has-navbar-fixed-top { padding-top: 3.25rem; }

.bulma .has-navbar-fixed-bottom, .bulma .has-navbar-fixed-bottom { padding-bottom: 3.25rem; }

.bulma .navbar-brand, .bulma .navbar-tabs { align-items: stretch; display: flex; flex-shrink: 0; min-height: 3.25rem; }

.bulma .navbar-brand a.navbar-item:focus, .bulma .navbar-brand a.navbar-item:hover { background-color: transparent; }

.bulma .navbar-tabs { -webkit-overflow-scrolling: touch; max-width: 100vw; overflow-x: auto; overflow-y: hidden; }

.bulma .navbar-burger { color: #4a4a4a; cursor: pointer; display: block; height: 3.25rem; position: relative; width: 3.25rem; margin-left: auto; }

.bulma .navbar-burger span { background-color: currentColor; display: block; height: 1px; left: calc(50% - 8px); position: absolute; transform-origin: center; transition-duration: 86ms; transition-property: background-color, opacity, transform; transition-timing-function: ease-out; width: 16px; }

.bulma .navbar-burger span:nth-child(1) { top: calc(50% - 6px); }

.bulma .navbar-burger span:nth-child(2) { top: calc(50% - 1px); }

.bulma .navbar-burger span:nth-child(3) { top: calc(50% + 4px); }

.bulma .navbar-burger:hover { background-color: rgba(0, 0, 0, 0.05); }

.bulma .navbar-burger.is-active span:nth-child(1) { transform: translateY(5px) rotate(45deg); }

.bulma .navbar-burger.is-active span:nth-child(2) { opacity: 0; }

.bulma .navbar-burger.is-active span:nth-child(3) { transform: translateY(-5px) rotate(-45deg); }

.bulma .navbar-menu { display: none; }

.bulma .navbar-item, .bulma .navbar-link { color: #4a4a4a; display: block; line-height: 1.5; padding: 0.5rem 0.75rem; position: relative; }

.bulma .navbar-item .icon:only-child, .bulma .navbar-link .icon:only-child { margin-left: -0.25rem; margin-right: -0.25rem; }

.bulma a.navbar-item, .bulma .navbar-link { cursor: pointer; }

.bulma a.navbar-item:focus, .bulma a.navbar-item:focus-within, .bulma a.navbar-item:hover, .bulma a.navbar-item.is-active, .bulma .navbar-link:focus, .bulma .navbar-link:focus-within, .bulma .navbar-link:hover, .bulma .navbar-link.is-active { background-color: #fafafa; color: #3273dc; }

.bulma .navbar-item { display: block; flex-grow: 0; flex-shrink: 0; }

.bulma .navbar-item img { max-height: 1.75rem; }

.bulma .navbar-item.has-dropdown { padding: 0; }

.bulma .navbar-item.is-expanded { flex-grow: 1; flex-shrink: 1; }

.bulma .navbar-item.is-tab { border-bottom: 1px solid transparent; min-height: 3.25rem; padding-bottom: calc(0.5rem - 1px); }

.bulma .navbar-item.is-tab:focus, .bulma .navbar-item.is-tab:hover { background-color: transparent; border-bottom-color: #3273dc; }

.bulma .navbar-item.is-tab.is-active { background-color: transparent; border-bottom-color: #3273dc; border-bottom-style: solid; border-bottom-width: 3px; color: #3273dc; padding-bottom: calc(0.5rem - 3px); }

.bulma .navbar-content { flex-grow: 1; flex-shrink: 1; }

.bulma .navbar-link:not(.is-arrowless) { padding-right: 2.5em; }

.bulma .navbar-link:not(.is-arrowless)::after { border-color: #3273dc; margin-top: -0.375em; right: 1.125em; }

.bulma .navbar-dropdown { font-size: 0.875rem; padding-bottom: 0.5rem; padding-top: 0.5rem; }

.bulma .navbar-dropdown .navbar-item { padding-left: 1.5rem; padding-right: 1.5rem; }

.bulma .navbar-divider { background-color: whitesmoke; border: none; display: none; height: 2px; margin: 0.5rem 0; }

@media screen and (max-width: 1023px) { .bulma .navbar > .container { display: block; }
  .bulma .navbar-brand .navbar-item, .bulma .navbar-tabs .navbar-item { align-items: center; display: flex; }
  .bulma .navbar-link::after { display: none; }
  .bulma .navbar-menu { background-color: white; box-shadow: 0 8px 16px rgba(10, 10, 10, 0.1); padding: 0.5rem 0; }
  .bulma .navbar-menu.is-active { display: block; }
  .bulma .navbar.is-fixed-bottom-touch, .bulma .navbar.is-fixed-top-touch { left: 0; position: fixed; right: 0; z-index: 30; }
  .bulma .navbar.is-fixed-bottom-touch { bottom: 0; }
  .bulma .navbar.is-fixed-bottom-touch.has-shadow { box-shadow: 0 -2px 3px rgba(10, 10, 10, 0.1); }
  .bulma .navbar.is-fixed-top-touch { top: 0; }
  .bulma .navbar.is-fixed-top .navbar-menu, .bulma .navbar.is-fixed-top-touch .navbar-menu { -webkit-overflow-scrolling: touch; max-height: calc(100vh - 3.25rem); overflow: auto; }
  .bulma .has-navbar-fixed-top-touch, .bulma .has-navbar-fixed-top-touch { padding-top: 3.25rem; }
  .bulma .has-navbar-fixed-bottom-touch, .bulma .has-navbar-fixed-bottom-touch { padding-bottom: 3.25rem; } }

@media screen and (min-width: 1024px) { .bulma .navbar, .bulma .navbar-menu, .bulma .navbar-start, .bulma .navbar-end { align-items: stretch; display: flex; }
  .bulma .navbar { min-height: 3.25rem; }
  .bulma .navbar.is-spaced { padding: 1rem 2rem; }
  .bulma .navbar.is-spaced .navbar-start, .bulma .navbar.is-spaced .navbar-end { align-items: center; }
  .bulma .navbar.is-spaced a.navbar-item, .bulma .navbar.is-spaced .navbar-link { border-radius: 4px; }
  .bulma .navbar.is-transparent a.navbar-item:focus, .bulma .navbar.is-transparent a.navbar-item:hover, .bulma .navbar.is-transparent a.navbar-item.is-active, .bulma .navbar.is-transparent .navbar-link:focus, .bulma .navbar.is-transparent .navbar-link:hover, .bulma .navbar.is-transparent .navbar-link.is-active { background-color: transparent !important; }
  .bulma .navbar.is-transparent .navbar-item.has-dropdown.is-active .navbar-link, .bulma .navbar.is-transparent .navbar-item.has-dropdown.is-hoverable:focus .navbar-link, .bulma .navbar.is-transparent .navbar-item.has-dropdown.is-hoverable:focus-within .navbar-link, .bulma .navbar.is-transparent .navbar-item.has-dropdown.is-hoverable:hover .navbar-link { background-color: transparent !important; }
  .bulma .navbar.is-transparent .navbar-dropdown a.navbar-item:focus, .bulma .navbar.is-transparent .navbar-dropdown a.navbar-item:hover { background-color: whitesmoke; color: #0a0a0a; }
  .bulma .navbar.is-transparent .navbar-dropdown a.navbar-item.is-active { background-color: whitesmoke; color: #3273dc; }
  .bulma .navbar-burger { display: none; }
  .bulma .navbar-item, .bulma .navbar-link { align-items: center; display: flex; }
  .bulma .navbar-item { display: flex; }
  .bulma .navbar-item.has-dropdown { align-items: stretch; }
  .bulma .navbar-item.has-dropdown-up .navbar-link::after { transform: rotate(135deg) translate(0.25em, -0.25em); }
  .bulma .navbar-item.has-dropdown-up .navbar-dropdown { border-bottom: 2px solid #dbdbdb; border-radius: 6px 6px 0 0; border-top: none; bottom: 100%; box-shadow: 0 -8px 8px rgba(10, 10, 10, 0.1); top: auto; }
  .bulma .navbar-item.is-active .navbar-dropdown, .bulma .navbar-item.is-hoverable:focus .navbar-dropdown, .bulma .navbar-item.is-hoverable:focus-within .navbar-dropdown, .bulma .navbar-item.is-hoverable:hover .navbar-dropdown { display: block; }
  .navbar.is-spaced .bulma .navbar-item.is-active .navbar-dropdown, .bulma .navbar-item.is-active .navbar-dropdown.is-boxed, .navbar.is-spaced .bulma .navbar-item.is-hoverable:focus .navbar-dropdown, .bulma .navbar-item.is-hoverable:focus .navbar-dropdown.is-boxed, .navbar.is-spaced .bulma .navbar-item.is-hoverable:focus-within .navbar-dropdown, .bulma .navbar-item.is-hoverable:focus-within .navbar-dropdown.is-boxed, .navbar.is-spaced .bulma .navbar-item.is-hoverable:hover .navbar-dropdown, .bulma .navbar-item.is-hoverable:hover .navbar-dropdown.is-boxed { opacity: 1; pointer-events: auto; transform: translateY(0); }
  .bulma .navbar-menu { flex-grow: 1; flex-shrink: 0; }
  .bulma .navbar-start { justify-content: flex-start; margin-right: auto; }
  .bulma .navbar-end { justify-content: flex-end; margin-left: auto; }
  .bulma .navbar-dropdown { background-color: white; border-bottom-left-radius: 6px; border-bottom-right-radius: 6px; border-top: 2px solid #dbdbdb; box-shadow: 0 8px 8px rgba(10, 10, 10, 0.1); display: none; font-size: 0.875rem; left: 0; min-width: 100%; position: absolute; top: 100%; z-index: 20; }
  .bulma .navbar-dropdown .navbar-item { padding: 0.375rem 1rem; white-space: nowrap; }
  .bulma .navbar-dropdown a.navbar-item { padding-right: 3rem; }
  .bulma .navbar-dropdown a.navbar-item:focus, .bulma .navbar-dropdown a.navbar-item:hover { background-color: whitesmoke; color: #0a0a0a; }
  .bulma .navbar-dropdown a.navbar-item.is-active { background-color: whitesmoke; color: #3273dc; }
  .navbar.is-spaced .bulma .navbar-dropdown, .bulma .navbar-dropdown.is-boxed { border-radius: 6px; border-top: none; box-shadow: 0 8px 8px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1); display: block; opacity: 0; pointer-events: none; top: calc(100% + (-4px)); transform: translateY(-5px); transition-duration: 86ms; transition-property: opacity, transform; }
  .bulma .navbar-dropdown.is-right { left: auto; right: 0; }
  .bulma .navbar-divider { display: block; }
  .bulma .navbar > .container .navbar-brand, .bulma .container > .navbar .navbar-brand { margin-left: -.75rem; }
  .bulma .navbar > .container .navbar-menu, .bulma .container > .navbar .navbar-menu { margin-right: -.75rem; }
  .bulma .navbar.is-fixed-bottom-desktop, .bulma .navbar.is-fixed-top-desktop { left: 0; position: fixed; right: 0; z-index: 30; }
  .bulma .navbar.is-fixed-bottom-desktop { bottom: 0; }
  .bulma .navbar.is-fixed-bottom-desktop.has-shadow { box-shadow: 0 -2px 3px rgba(10, 10, 10, 0.1); }
  .bulma .navbar.is-fixed-top-desktop { top: 0; }
  .bulma .has-navbar-fixed-top-desktop, .bulma .has-navbar-fixed-top-desktop { padding-top: 3.25rem; }
  .bulma .has-navbar-fixed-bottom-desktop, .bulma .has-navbar-fixed-bottom-desktop { padding-bottom: 3.25rem; }
  .bulma .has-spaced-navbar-fixed-top, .bulma .has-spaced-navbar-fixed-top { padding-top: 5.25rem; }
  .bulma .has-spaced-navbar-fixed-bottom, .bulma .has-spaced-navbar-fixed-bottom { padding-bottom: 5.25rem; }
  .bulma a.navbar-item.is-active, .bulma .navbar-link.is-active { color: #0a0a0a; }
  .bulma a.navbar-item.is-active:not(:focus):not(:hover), .bulma .navbar-link.is-active:not(:focus):not(:hover) { background-color: transparent; }
  .bulma .navbar-item.has-dropdown:focus .navbar-link, .bulma .navbar-item.has-dropdown:hover .navbar-link, .bulma .navbar-item.has-dropdown.is-active .navbar-link { background-color: #fafafa; } }

.bulma .hero.is-fullheight-with-navbar { min-height: calc(100vh - 3.25rem); }

.bulma .pagination { font-size: 1rem; margin: -0.25rem; }

.bulma .pagination.is-small { font-size: 0.75rem; }

.bulma .pagination.is-medium { font-size: 1.25rem; }

.bulma .pagination.is-large { font-size: 1.5rem; }

.bulma .pagination.is-rounded .pagination-previous, .bulma .pagination.is-rounded .pagination-next { padding-left: 1em; padding-right: 1em; border-radius: 290486px; }

.bulma .pagination.is-rounded .pagination-link { border-radius: 290486px; }

.bulma .pagination, .bulma .pagination-list { align-items: center; display: flex; justify-content: center; text-align: center; }

.bulma .pagination-previous, .bulma .pagination-next, .bulma .pagination-link, .bulma .pagination-ellipsis { font-size: 1em; justify-content: center; margin: 0.25rem; padding-left: 0.5em; padding-right: 0.5em; text-align: center; }

.bulma .pagination-previous, .bulma .pagination-next, .bulma .pagination-link { border-color: #dbdbdb; color: #363636; min-width: 2.25em; }

.bulma .pagination-previous:hover, .bulma .pagination-next:hover, .bulma .pagination-link:hover { border-color: #b5b5b5; color: #363636; }

.bulma .pagination-previous:focus, .bulma .pagination-next:focus, .bulma .pagination-link:focus { border-color: #3273dc; }

.bulma .pagination-previous:active, .bulma .pagination-next:active, .bulma .pagination-link:active { box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.2); }

.bulma .pagination-previous[disabled], .bulma .pagination-next[disabled], .bulma .pagination-link[disabled] { background-color: #dbdbdb; border-color: #dbdbdb; box-shadow: none; color: #7a7a7a; opacity: 0.5; }

.bulma .pagination-previous, .bulma .pagination-next { padding-left: 0.75em; padding-right: 0.75em; white-space: nowrap; }

.bulma .pagination-link.is-current { background-color: #3273dc; border-color: #3273dc; color: #fff; }

.bulma .pagination-ellipsis { color: #b5b5b5; pointer-events: none; }

.bulma .pagination-list { flex-wrap: wrap; }

@media screen and (max-width: 768px) { .bulma .pagination { flex-wrap: wrap; }
  .bulma .pagination-previous, .bulma .pagination-next { flex-grow: 1; flex-shrink: 1; }
  .bulma .pagination-list li { flex-grow: 1; flex-shrink: 1; } }

@media screen and (min-width: 769px), print { .bulma .pagination-list { flex-grow: 1; flex-shrink: 1; justify-content: flex-start; order: 1; }
  .bulma .pagination-previous { order: 2; }
  .bulma .pagination-next { order: 3; }
  .bulma .pagination { justify-content: space-between; }
  .bulma .pagination.is-centered .pagination-previous { order: 1; }
  .bulma .pagination.is-centered .pagination-list { justify-content: center; order: 2; }
  .bulma .pagination.is-centered .pagination-next { order: 3; }
  .bulma .pagination.is-right .pagination-previous { order: 1; }
  .bulma .pagination.is-right .pagination-next { order: 2; }
  .bulma .pagination.is-right .pagination-list { justify-content: flex-end; order: 3; } }

.bulma .panel { font-size: 1rem; }

.bulma .panel:not(:last-child) { margin-bottom: 1.5rem; }

.bulma .panel-heading, .bulma .panel-tabs, .bulma .panel-block { border-bottom: 1px solid #dbdbdb; border-left: 1px solid #dbdbdb; border-right: 1px solid #dbdbdb; }

.bulma .panel-heading:first-child, .bulma .panel-tabs:first-child, .bulma .panel-block:first-child { border-top: 1px solid #dbdbdb; }

.bulma .panel-heading { background-color: whitesmoke; border-radius: 4px 4px 0 0; color: #363636; font-size: 1.25em; font-weight: 300; line-height: 1.25; padding: 0.5em 0.75em; }

.bulma .panel-tabs { align-items: flex-end; display: flex; font-size: 0.875em; justify-content: center; }

.bulma .panel-tabs a { border-bottom: 1px solid #dbdbdb; margin-bottom: -1px; padding: 0.5em; }

.bulma .panel-tabs a.is-active { border-bottom-color: #4a4a4a; color: #363636; }

.bulma .panel-list a { color: #4a4a4a; }

.bulma .panel-list a:hover { color: #3273dc; }

.bulma .panel-block { align-items: center; color: #363636; display: flex; justify-content: flex-start; padding: 0.5em 0.75em; }

.bulma .panel-block input[type="checkbox"] { margin-right: 0.75em; }

.bulma .panel-block > .control { flex-grow: 1; flex-shrink: 1; width: 100%; }

.bulma .panel-block.is-wrapped { flex-wrap: wrap; }

.bulma .panel-block.is-active { border-left-color: #3273dc; color: #363636; }

.bulma .panel-block.is-active .panel-icon { color: #3273dc; }

.bulma a.panel-block, .bulma label.panel-block { cursor: pointer; }

.bulma a.panel-block:hover, .bulma label.panel-block:hover { background-color: whitesmoke; }

.bulma .panel-icon { display: inline-block; font-size: 14px; height: 1em; line-height: 1em; text-align: center; vertical-align: top; width: 1em; color: #7a7a7a; margin-right: 0.75em; }

.bulma .panel-icon .fa { font-size: inherit; line-height: inherit; }

.bulma .tabs { -webkit-overflow-scrolling: touch; align-items: stretch; display: flex; font-size: 1rem; justify-content: space-between; overflow: hidden; overflow-x: auto; white-space: nowrap; }

.bulma .tabs a { align-items: center; border-bottom-color: #dbdbdb; border-bottom-style: solid; border-bottom-width: 1px; color: #4a4a4a; display: flex; justify-content: center; margin-bottom: -1px; padding: 0.5em 1em; vertical-align: top; }

.bulma .tabs a:hover { border-bottom-color: #363636; color: #363636; }

.bulma .tabs li { display: block; }

.bulma .tabs li.is-active a { border-bottom-color: #3273dc; color: #3273dc; }

.bulma .tabs ul { align-items: center; border-bottom-color: #dbdbdb; border-bottom-style: solid; border-bottom-width: 1px; display: flex; flex-grow: 1; flex-shrink: 0; justify-content: flex-start; }

.bulma .tabs ul.is-left { padding-right: 0.75em; }

.bulma .tabs ul.is-center { flex: none; justify-content: center; padding-left: 0.75em; padding-right: 0.75em; }

.bulma .tabs ul.is-right { justify-content: flex-end; padding-left: 0.75em; }

.bulma .tabs .icon:first-child { margin-right: 0.5em; }

.bulma .tabs .icon:last-child { margin-left: 0.5em; }

.bulma .tabs.is-centered ul { justify-content: center; }

.bulma .tabs.is-right ul { justify-content: flex-end; }

.bulma .tabs.is-boxed a { border: 1px solid transparent; border-radius: 4px 4px 0 0; }

.bulma .tabs.is-boxed a:hover { background-color: whitesmoke; border-bottom-color: #dbdbdb; }

.bulma .tabs.is-boxed li.is-active a { background-color: white; border-color: #dbdbdb; border-bottom-color: transparent !important; }

.bulma .tabs.is-fullwidth li { flex-grow: 1; flex-shrink: 0; }

.bulma .tabs.is-toggle a { border-color: #dbdbdb; border-style: solid; border-width: 1px; margin-bottom: 0; position: relative; }

.bulma .tabs.is-toggle a:hover { background-color: whitesmoke; border-color: #b5b5b5; z-index: 2; }

.bulma .tabs.is-toggle li + li { margin-left: -1px; }

.bulma .tabs.is-toggle li:first-child a { border-radius: 4px 0 0 4px; }

.bulma .tabs.is-toggle li:last-child a { border-radius: 0 4px 4px 0; }

.bulma .tabs.is-toggle li.is-active a { background-color: #3273dc; border-color: #3273dc; color: #fff; z-index: 1; }

.bulma .tabs.is-toggle ul { border-bottom: none; }

.bulma .tabs.is-toggle.is-toggle-rounded li:first-child a { border-bottom-left-radius: 290486px; border-top-left-radius: 290486px; padding-left: 1.25em; }

.bulma .tabs.is-toggle.is-toggle-rounded li:last-child a { border-bottom-right-radius: 290486px; border-top-right-radius: 290486px; padding-right: 1.25em; }

.bulma .tabs.is-small { font-size: 0.75rem; }

.bulma .tabs.is-medium { font-size: 1.25rem; }

.bulma .tabs.is-large { font-size: 1.5rem; }

.bulma .column { display: block; flex-basis: 0; flex-grow: 1; flex-shrink: 1; padding: 0.75rem; }

.columns.is-mobile > .bulma .column.is-narrow { flex: none; }

.columns.is-mobile > .bulma .column.is-full { flex: none; width: 100%; }

.columns.is-mobile > .bulma .column.is-three-quarters { flex: none; width: 75%; }

.columns.is-mobile > .bulma .column.is-two-thirds { flex: none; width: 66.6666%; }

.columns.is-mobile > .bulma .column.is-half { flex: none; width: 50%; }

.columns.is-mobile > .bulma .column.is-one-third { flex: none; width: 33.3333%; }

.columns.is-mobile > .bulma .column.is-one-quarter { flex: none; width: 25%; }

.columns.is-mobile > .bulma .column.is-one-fifth { flex: none; width: 20%; }

.columns.is-mobile > .bulma .column.is-two-fifths { flex: none; width: 40%; }

.columns.is-mobile > .bulma .column.is-three-fifths { flex: none; width: 60%; }

.columns.is-mobile > .bulma .column.is-four-fifths { flex: none; width: 80%; }

.columns.is-mobile > .bulma .column.is-offset-three-quarters { margin-left: 75%; }

.columns.is-mobile > .bulma .column.is-offset-two-thirds { margin-left: 66.6666%; }

.columns.is-mobile > .bulma .column.is-offset-half { margin-left: 50%; }

.columns.is-mobile > .bulma .column.is-offset-one-third { margin-left: 33.3333%; }

.columns.is-mobile > .bulma .column.is-offset-one-quarter { margin-left: 25%; }

.columns.is-mobile > .bulma .column.is-offset-one-fifth { margin-left: 20%; }

.columns.is-mobile > .bulma .column.is-offset-two-fifths { margin-left: 40%; }

.columns.is-mobile > .bulma .column.is-offset-three-fifths { margin-left: 60%; }

.columns.is-mobile > .bulma .column.is-offset-four-fifths { margin-left: 80%; }

.columns.is-mobile > .bulma .column.is-0 { flex: none; width: 0%; }

.columns.is-mobile > .bulma .column.is-offset-0 { margin-left: 0%; }

.columns.is-mobile > .bulma .column.is-1 { flex: none; width: 8.33333%; }

.columns.is-mobile > .bulma .column.is-offset-1 { margin-left: 8.33333%; }

.columns.is-mobile > .bulma .column.is-2 { flex: none; width: 16.66667%; }

.columns.is-mobile > .bulma .column.is-offset-2 { margin-left: 16.66667%; }

.columns.is-mobile > .bulma .column.is-3 { flex: none; width: 25%; }

.columns.is-mobile > .bulma .column.is-offset-3 { margin-left: 25%; }

.columns.is-mobile > .bulma .column.is-4 { flex: none; width: 33.33333%; }

.columns.is-mobile > .bulma .column.is-offset-4 { margin-left: 33.33333%; }

.columns.is-mobile > .bulma .column.is-5 { flex: none; width: 41.66667%; }

.columns.is-mobile > .bulma .column.is-offset-5 { margin-left: 41.66667%; }

.columns.is-mobile > .bulma .column.is-6 { flex: none; width: 50%; }

.columns.is-mobile > .bulma .column.is-offset-6 { margin-left: 50%; }

.columns.is-mobile > .bulma .column.is-7 { flex: none; width: 58.33333%; }

.columns.is-mobile > .bulma .column.is-offset-7 { margin-left: 58.33333%; }

.columns.is-mobile > .bulma .column.is-8 { flex: none; width: 66.66667%; }

.columns.is-mobile > .bulma .column.is-offset-8 { margin-left: 66.66667%; }

.columns.is-mobile > .bulma .column.is-9 { flex: none; width: 75%; }

.columns.is-mobile > .bulma .column.is-offset-9 { margin-left: 75%; }

.columns.is-mobile > .bulma .column.is-10 { flex: none; width: 83.33333%; }

.columns.is-mobile > .bulma .column.is-offset-10 { margin-left: 83.33333%; }

.columns.is-mobile > .bulma .column.is-11 { flex: none; width: 91.66667%; }

.columns.is-mobile > .bulma .column.is-offset-11 { margin-left: 91.66667%; }

.columns.is-mobile > .bulma .column.is-12 { flex: none; width: 100%; }

.columns.is-mobile > .bulma .column.is-offset-12 { margin-left: 100%; }

@media screen and (max-width: 768px) { .bulma .column.is-narrow-mobile { flex: none; }
  .bulma .column.is-full-mobile { flex: none; width: 100%; }
  .bulma .column.is-three-quarters-mobile { flex: none; width: 75%; }
  .bulma .column.is-two-thirds-mobile { flex: none; width: 66.6666%; }
  .bulma .column.is-half-mobile { flex: none; width: 50%; }
  .bulma .column.is-one-third-mobile { flex: none; width: 33.3333%; }
  .bulma .column.is-one-quarter-mobile { flex: none; width: 25%; }
  .bulma .column.is-one-fifth-mobile { flex: none; width: 20%; }
  .bulma .column.is-two-fifths-mobile { flex: none; width: 40%; }
  .bulma .column.is-three-fifths-mobile { flex: none; width: 60%; }
  .bulma .column.is-four-fifths-mobile { flex: none; width: 80%; }
  .bulma .column.is-offset-three-quarters-mobile { margin-left: 75%; }
  .bulma .column.is-offset-two-thirds-mobile { margin-left: 66.6666%; }
  .bulma .column.is-offset-half-mobile { margin-left: 50%; }
  .bulma .column.is-offset-one-third-mobile { margin-left: 33.3333%; }
  .bulma .column.is-offset-one-quarter-mobile { margin-left: 25%; }
  .bulma .column.is-offset-one-fifth-mobile { margin-left: 20%; }
  .bulma .column.is-offset-two-fifths-mobile { margin-left: 40%; }
  .bulma .column.is-offset-three-fifths-mobile { margin-left: 60%; }
  .bulma .column.is-offset-four-fifths-mobile { margin-left: 80%; }
  .bulma .column.is-0-mobile { flex: none; width: 0%; }
  .bulma .column.is-offset-0-mobile { margin-left: 0%; }
  .bulma .column.is-1-mobile { flex: none; width: 8.33333%; }
  .bulma .column.is-offset-1-mobile { margin-left: 8.33333%; }
  .bulma .column.is-2-mobile { flex: none; width: 16.66667%; }
  .bulma .column.is-offset-2-mobile { margin-left: 16.66667%; }
  .bulma .column.is-3-mobile { flex: none; width: 25%; }
  .bulma .column.is-offset-3-mobile { margin-left: 25%; }
  .bulma .column.is-4-mobile { flex: none; width: 33.33333%; }
  .bulma .column.is-offset-4-mobile { margin-left: 33.33333%; }
  .bulma .column.is-5-mobile { flex: none; width: 41.66667%; }
  .bulma .column.is-offset-5-mobile { margin-left: 41.66667%; }
  .bulma .column.is-6-mobile { flex: none; width: 50%; }
  .bulma .column.is-offset-6-mobile { margin-left: 50%; }
  .bulma .column.is-7-mobile { flex: none; width: 58.33333%; }
  .bulma .column.is-offset-7-mobile { margin-left: 58.33333%; }
  .bulma .column.is-8-mobile { flex: none; width: 66.66667%; }
  .bulma .column.is-offset-8-mobile { margin-left: 66.66667%; }
  .bulma .column.is-9-mobile { flex: none; width: 75%; }
  .bulma .column.is-offset-9-mobile { margin-left: 75%; }
  .bulma .column.is-10-mobile { flex: none; width: 83.33333%; }
  .bulma .column.is-offset-10-mobile { margin-left: 83.33333%; }
  .bulma .column.is-11-mobile { flex: none; width: 91.66667%; }
  .bulma .column.is-offset-11-mobile { margin-left: 91.66667%; }
  .bulma .column.is-12-mobile { flex: none; width: 100%; }
  .bulma .column.is-offset-12-mobile { margin-left: 100%; } }

@media screen and (min-width: 769px), print { .bulma .column.is-narrow, .bulma .column.is-narrow-tablet { flex: none; }
  .bulma .column.is-full, .bulma .column.is-full-tablet { flex: none; width: 100%; }
  .bulma .column.is-three-quarters, .bulma .column.is-three-quarters-tablet { flex: none; width: 75%; }
  .bulma .column.is-two-thirds, .bulma .column.is-two-thirds-tablet { flex: none; width: 66.6666%; }
  .bulma .column.is-half, .bulma .column.is-half-tablet { flex: none; width: 50%; }
  .bulma .column.is-one-third, .bulma .column.is-one-third-tablet { flex: none; width: 33.3333%; }
  .bulma .column.is-one-quarter, .bulma .column.is-one-quarter-tablet { flex: none; width: 25%; }
  .bulma .column.is-one-fifth, .bulma .column.is-one-fifth-tablet { flex: none; width: 20%; }
  .bulma .column.is-two-fifths, .bulma .column.is-two-fifths-tablet { flex: none; width: 40%; }
  .bulma .column.is-three-fifths, .bulma .column.is-three-fifths-tablet { flex: none; width: 60%; }
  .bulma .column.is-four-fifths, .bulma .column.is-four-fifths-tablet { flex: none; width: 80%; }
  .bulma .column.is-offset-three-quarters, .bulma .column.is-offset-three-quarters-tablet { margin-left: 75%; }
  .bulma .column.is-offset-two-thirds, .bulma .column.is-offset-two-thirds-tablet { margin-left: 66.6666%; }
  .bulma .column.is-offset-half, .bulma .column.is-offset-half-tablet { margin-left: 50%; }
  .bulma .column.is-offset-one-third, .bulma .column.is-offset-one-third-tablet { margin-left: 33.3333%; }
  .bulma .column.is-offset-one-quarter, .bulma .column.is-offset-one-quarter-tablet { margin-left: 25%; }
  .bulma .column.is-offset-one-fifth, .bulma .column.is-offset-one-fifth-tablet { margin-left: 20%; }
  .bulma .column.is-offset-two-fifths, .bulma .column.is-offset-two-fifths-tablet { margin-left: 40%; }
  .bulma .column.is-offset-three-fifths, .bulma .column.is-offset-three-fifths-tablet { margin-left: 60%; }
  .bulma .column.is-offset-four-fifths, .bulma .column.is-offset-four-fifths-tablet { margin-left: 80%; }
  .bulma .column.is-0, .bulma .column.is-0-tablet { flex: none; width: 0%; }
  .bulma .column.is-offset-0, .bulma .column.is-offset-0-tablet { margin-left: 0%; }
  .bulma .column.is-1, .bulma .column.is-1-tablet { flex: none; width: 8.33333%; }
  .bulma .column.is-offset-1, .bulma .column.is-offset-1-tablet { margin-left: 8.33333%; }
  .bulma .column.is-2, .bulma .column.is-2-tablet { flex: none; width: 16.66667%; }
  .bulma .column.is-offset-2, .bulma .column.is-offset-2-tablet { margin-left: 16.66667%; }
  .bulma .column.is-3, .bulma .column.is-3-tablet { flex: none; width: 25%; }
  .bulma .column.is-offset-3, .bulma .column.is-offset-3-tablet { margin-left: 25%; }
  .bulma .column.is-4, .bulma .column.is-4-tablet { flex: none; width: 33.33333%; }
  .bulma .column.is-offset-4, .bulma .column.is-offset-4-tablet { margin-left: 33.33333%; }
  .bulma .column.is-5, .bulma .column.is-5-tablet { flex: none; width: 41.66667%; }
  .bulma .column.is-offset-5, .bulma .column.is-offset-5-tablet { margin-left: 41.66667%; }
  .bulma .column.is-6, .bulma .column.is-6-tablet { flex: none; width: 50%; }
  .bulma .column.is-offset-6, .bulma .column.is-offset-6-tablet { margin-left: 50%; }
  .bulma .column.is-7, .bulma .column.is-7-tablet { flex: none; width: 58.33333%; }
  .bulma .column.is-offset-7, .bulma .column.is-offset-7-tablet { margin-left: 58.33333%; }
  .bulma .column.is-8, .bulma .column.is-8-tablet { flex: none; width: 66.66667%; }
  .bulma .column.is-offset-8, .bulma .column.is-offset-8-tablet { margin-left: 66.66667%; }
  .bulma .column.is-9, .bulma .column.is-9-tablet { flex: none; width: 75%; }
  .bulma .column.is-offset-9, .bulma .column.is-offset-9-tablet { margin-left: 75%; }
  .bulma .column.is-10, .bulma .column.is-10-tablet { flex: none; width: 83.33333%; }
  .bulma .column.is-offset-10, .bulma .column.is-offset-10-tablet { margin-left: 83.33333%; }
  .bulma .column.is-11, .bulma .column.is-11-tablet { flex: none; width: 91.66667%; }
  .bulma .column.is-offset-11, .bulma .column.is-offset-11-tablet { margin-left: 91.66667%; }
  .bulma .column.is-12, .bulma .column.is-12-tablet { flex: none; width: 100%; }
  .bulma .column.is-offset-12, .bulma .column.is-offset-12-tablet { margin-left: 100%; } }

@media screen and (max-width: 1023px) { .bulma .column.is-narrow-touch { flex: none; }
  .bulma .column.is-full-touch { flex: none; width: 100%; }
  .bulma .column.is-three-quarters-touch { flex: none; width: 75%; }
  .bulma .column.is-two-thirds-touch { flex: none; width: 66.6666%; }
  .bulma .column.is-half-touch { flex: none; width: 50%; }
  .bulma .column.is-one-third-touch { flex: none; width: 33.3333%; }
  .bulma .column.is-one-quarter-touch { flex: none; width: 25%; }
  .bulma .column.is-one-fifth-touch { flex: none; width: 20%; }
  .bulma .column.is-two-fifths-touch { flex: none; width: 40%; }
  .bulma .column.is-three-fifths-touch { flex: none; width: 60%; }
  .bulma .column.is-four-fifths-touch { flex: none; width: 80%; }
  .bulma .column.is-offset-three-quarters-touch { margin-left: 75%; }
  .bulma .column.is-offset-two-thirds-touch { margin-left: 66.6666%; }
  .bulma .column.is-offset-half-touch { margin-left: 50%; }
  .bulma .column.is-offset-one-third-touch { margin-left: 33.3333%; }
  .bulma .column.is-offset-one-quarter-touch { margin-left: 25%; }
  .bulma .column.is-offset-one-fifth-touch { margin-left: 20%; }
  .bulma .column.is-offset-two-fifths-touch { margin-left: 40%; }
  .bulma .column.is-offset-three-fifths-touch { margin-left: 60%; }
  .bulma .column.is-offset-four-fifths-touch { margin-left: 80%; }
  .bulma .column.is-0-touch { flex: none; width: 0%; }
  .bulma .column.is-offset-0-touch { margin-left: 0%; }
  .bulma .column.is-1-touch { flex: none; width: 8.33333%; }
  .bulma .column.is-offset-1-touch { margin-left: 8.33333%; }
  .bulma .column.is-2-touch { flex: none; width: 16.66667%; }
  .bulma .column.is-offset-2-touch { margin-left: 16.66667%; }
  .bulma .column.is-3-touch { flex: none; width: 25%; }
  .bulma .column.is-offset-3-touch { margin-left: 25%; }
  .bulma .column.is-4-touch { flex: none; width: 33.33333%; }
  .bulma .column.is-offset-4-touch { margin-left: 33.33333%; }
  .bulma .column.is-5-touch { flex: none; width: 41.66667%; }
  .bulma .column.is-offset-5-touch { margin-left: 41.66667%; }
  .bulma .column.is-6-touch { flex: none; width: 50%; }
  .bulma .column.is-offset-6-touch { margin-left: 50%; }
  .bulma .column.is-7-touch { flex: none; width: 58.33333%; }
  .bulma .column.is-offset-7-touch { margin-left: 58.33333%; }
  .bulma .column.is-8-touch { flex: none; width: 66.66667%; }
  .bulma .column.is-offset-8-touch { margin-left: 66.66667%; }
  .bulma .column.is-9-touch { flex: none; width: 75%; }
  .bulma .column.is-offset-9-touch { margin-left: 75%; }
  .bulma .column.is-10-touch { flex: none; width: 83.33333%; }
  .bulma .column.is-offset-10-touch { margin-left: 83.33333%; }
  .bulma .column.is-11-touch { flex: none; width: 91.66667%; }
  .bulma .column.is-offset-11-touch { margin-left: 91.66667%; }
  .bulma .column.is-12-touch { flex: none; width: 100%; }
  .bulma .column.is-offset-12-touch { margin-left: 100%; } }

@media screen and (min-width: 1024px) { .bulma .column.is-narrow-desktop { flex: none; }
  .bulma .column.is-full-desktop { flex: none; width: 100%; }
  .bulma .column.is-three-quarters-desktop { flex: none; width: 75%; }
  .bulma .column.is-two-thirds-desktop { flex: none; width: 66.6666%; }
  .bulma .column.is-half-desktop { flex: none; width: 50%; }
  .bulma .column.is-one-third-desktop { flex: none; width: 33.3333%; }
  .bulma .column.is-one-quarter-desktop { flex: none; width: 25%; }
  .bulma .column.is-one-fifth-desktop { flex: none; width: 20%; }
  .bulma .column.is-two-fifths-desktop { flex: none; width: 40%; }
  .bulma .column.is-three-fifths-desktop { flex: none; width: 60%; }
  .bulma .column.is-four-fifths-desktop { flex: none; width: 80%; }
  .bulma .column.is-offset-three-quarters-desktop { margin-left: 75%; }
  .bulma .column.is-offset-two-thirds-desktop { margin-left: 66.6666%; }
  .bulma .column.is-offset-half-desktop { margin-left: 50%; }
  .bulma .column.is-offset-one-third-desktop { margin-left: 33.3333%; }
  .bulma .column.is-offset-one-quarter-desktop { margin-left: 25%; }
  .bulma .column.is-offset-one-fifth-desktop { margin-left: 20%; }
  .bulma .column.is-offset-two-fifths-desktop { margin-left: 40%; }
  .bulma .column.is-offset-three-fifths-desktop { margin-left: 60%; }
  .bulma .column.is-offset-four-fifths-desktop { margin-left: 80%; }
  .bulma .column.is-0-desktop { flex: none; width: 0%; }
  .bulma .column.is-offset-0-desktop { margin-left: 0%; }
  .bulma .column.is-1-desktop { flex: none; width: 8.33333%; }
  .bulma .column.is-offset-1-desktop { margin-left: 8.33333%; }
  .bulma .column.is-2-desktop { flex: none; width: 16.66667%; }
  .bulma .column.is-offset-2-desktop { margin-left: 16.66667%; }
  .bulma .column.is-3-desktop { flex: none; width: 25%; }
  .bulma .column.is-offset-3-desktop { margin-left: 25%; }
  .bulma .column.is-4-desktop { flex: none; width: 33.33333%; }
  .bulma .column.is-offset-4-desktop { margin-left: 33.33333%; }
  .bulma .column.is-5-desktop { flex: none; width: 41.66667%; }
  .bulma .column.is-offset-5-desktop { margin-left: 41.66667%; }
  .bulma .column.is-6-desktop { flex: none; width: 50%; }
  .bulma .column.is-offset-6-desktop { margin-left: 50%; }
  .bulma .column.is-7-desktop { flex: none; width: 58.33333%; }
  .bulma .column.is-offset-7-desktop { margin-left: 58.33333%; }
  .bulma .column.is-8-desktop { flex: none; width: 66.66667%; }
  .bulma .column.is-offset-8-desktop { margin-left: 66.66667%; }
  .bulma .column.is-9-desktop { flex: none; width: 75%; }
  .bulma .column.is-offset-9-desktop { margin-left: 75%; }
  .bulma .column.is-10-desktop { flex: none; width: 83.33333%; }
  .bulma .column.is-offset-10-desktop { margin-left: 83.33333%; }
  .bulma .column.is-11-desktop { flex: none; width: 91.66667%; }
  .bulma .column.is-offset-11-desktop { margin-left: 91.66667%; }
  .bulma .column.is-12-desktop { flex: none; width: 100%; }
  .bulma .column.is-offset-12-desktop { margin-left: 100%; } }

@media screen and (min-width: 1216px) { .bulma .column.is-narrow-widescreen { flex: none; }
  .bulma .column.is-full-widescreen { flex: none; width: 100%; }
  .bulma .column.is-three-quarters-widescreen { flex: none; width: 75%; }
  .bulma .column.is-two-thirds-widescreen { flex: none; width: 66.6666%; }
  .bulma .column.is-half-widescreen { flex: none; width: 50%; }
  .bulma .column.is-one-third-widescreen { flex: none; width: 33.3333%; }
  .bulma .column.is-one-quarter-widescreen { flex: none; width: 25%; }
  .bulma .column.is-one-fifth-widescreen { flex: none; width: 20%; }
  .bulma .column.is-two-fifths-widescreen { flex: none; width: 40%; }
  .bulma .column.is-three-fifths-widescreen { flex: none; width: 60%; }
  .bulma .column.is-four-fifths-widescreen { flex: none; width: 80%; }
  .bulma .column.is-offset-three-quarters-widescreen { margin-left: 75%; }
  .bulma .column.is-offset-two-thirds-widescreen { margin-left: 66.6666%; }
  .bulma .column.is-offset-half-widescreen { margin-left: 50%; }
  .bulma .column.is-offset-one-third-widescreen { margin-left: 33.3333%; }
  .bulma .column.is-offset-one-quarter-widescreen { margin-left: 25%; }
  .bulma .column.is-offset-one-fifth-widescreen { margin-left: 20%; }
  .bulma .column.is-offset-two-fifths-widescreen { margin-left: 40%; }
  .bulma .column.is-offset-three-fifths-widescreen { margin-left: 60%; }
  .bulma .column.is-offset-four-fifths-widescreen { margin-left: 80%; }
  .bulma .column.is-0-widescreen { flex: none; width: 0%; }
  .bulma .column.is-offset-0-widescreen { margin-left: 0%; }
  .bulma .column.is-1-widescreen { flex: none; width: 8.33333%; }
  .bulma .column.is-offset-1-widescreen { margin-left: 8.33333%; }
  .bulma .column.is-2-widescreen { flex: none; width: 16.66667%; }
  .bulma .column.is-offset-2-widescreen { margin-left: 16.66667%; }
  .bulma .column.is-3-widescreen { flex: none; width: 25%; }
  .bulma .column.is-offset-3-widescreen { margin-left: 25%; }
  .bulma .column.is-4-widescreen { flex: none; width: 33.33333%; }
  .bulma .column.is-offset-4-widescreen { margin-left: 33.33333%; }
  .bulma .column.is-5-widescreen { flex: none; width: 41.66667%; }
  .bulma .column.is-offset-5-widescreen { margin-left: 41.66667%; }
  .bulma .column.is-6-widescreen { flex: none; width: 50%; }
  .bulma .column.is-offset-6-widescreen { margin-left: 50%; }
  .bulma .column.is-7-widescreen { flex: none; width: 58.33333%; }
  .bulma .column.is-offset-7-widescreen { margin-left: 58.33333%; }
  .bulma .column.is-8-widescreen { flex: none; width: 66.66667%; }
  .bulma .column.is-offset-8-widescreen { margin-left: 66.66667%; }
  .bulma .column.is-9-widescreen { flex: none; width: 75%; }
  .bulma .column.is-offset-9-widescreen { margin-left: 75%; }
  .bulma .column.is-10-widescreen { flex: none; width: 83.33333%; }
  .bulma .column.is-offset-10-widescreen { margin-left: 83.33333%; }
  .bulma .column.is-11-widescreen { flex: none; width: 91.66667%; }
  .bulma .column.is-offset-11-widescreen { margin-left: 91.66667%; }
  .bulma .column.is-12-widescreen { flex: none; width: 100%; }
  .bulma .column.is-offset-12-widescreen { margin-left: 100%; } }

@media screen and (min-width: 1408px) { .bulma .column.is-narrow-fullhd { flex: none; }
  .bulma .column.is-full-fullhd { flex: none; width: 100%; }
  .bulma .column.is-three-quarters-fullhd { flex: none; width: 75%; }
  .bulma .column.is-two-thirds-fullhd { flex: none; width: 66.6666%; }
  .bulma .column.is-half-fullhd { flex: none; width: 50%; }
  .bulma .column.is-one-third-fullhd { flex: none; width: 33.3333%; }
  .bulma .column.is-one-quarter-fullhd { flex: none; width: 25%; }
  .bulma .column.is-one-fifth-fullhd { flex: none; width: 20%; }
  .bulma .column.is-two-fifths-fullhd { flex: none; width: 40%; }
  .bulma .column.is-three-fifths-fullhd { flex: none; width: 60%; }
  .bulma .column.is-four-fifths-fullhd { flex: none; width: 80%; }
  .bulma .column.is-offset-three-quarters-fullhd { margin-left: 75%; }
  .bulma .column.is-offset-two-thirds-fullhd { margin-left: 66.6666%; }
  .bulma .column.is-offset-half-fullhd { margin-left: 50%; }
  .bulma .column.is-offset-one-third-fullhd { margin-left: 33.3333%; }
  .bulma .column.is-offset-one-quarter-fullhd { margin-left: 25%; }
  .bulma .column.is-offset-one-fifth-fullhd { margin-left: 20%; }
  .bulma .column.is-offset-two-fifths-fullhd { margin-left: 40%; }
  .bulma .column.is-offset-three-fifths-fullhd { margin-left: 60%; }
  .bulma .column.is-offset-four-fifths-fullhd { margin-left: 80%; }
  .bulma .column.is-0-fullhd { flex: none; width: 0%; }
  .bulma .column.is-offset-0-fullhd { margin-left: 0%; }
  .bulma .column.is-1-fullhd { flex: none; width: 8.33333%; }
  .bulma .column.is-offset-1-fullhd { margin-left: 8.33333%; }
  .bulma .column.is-2-fullhd { flex: none; width: 16.66667%; }
  .bulma .column.is-offset-2-fullhd { margin-left: 16.66667%; }
  .bulma .column.is-3-fullhd { flex: none; width: 25%; }
  .bulma .column.is-offset-3-fullhd { margin-left: 25%; }
  .bulma .column.is-4-fullhd { flex: none; width: 33.33333%; }
  .bulma .column.is-offset-4-fullhd { margin-left: 33.33333%; }
  .bulma .column.is-5-fullhd { flex: none; width: 41.66667%; }
  .bulma .column.is-offset-5-fullhd { margin-left: 41.66667%; }
  .bulma .column.is-6-fullhd { flex: none; width: 50%; }
  .bulma .column.is-offset-6-fullhd { margin-left: 50%; }
  .bulma .column.is-7-fullhd { flex: none; width: 58.33333%; }
  .bulma .column.is-offset-7-fullhd { margin-left: 58.33333%; }
  .bulma .column.is-8-fullhd { flex: none; width: 66.66667%; }
  .bulma .column.is-offset-8-fullhd { margin-left: 66.66667%; }
  .bulma .column.is-9-fullhd { flex: none; width: 75%; }
  .bulma .column.is-offset-9-fullhd { margin-left: 75%; }
  .bulma .column.is-10-fullhd { flex: none; width: 83.33333%; }
  .bulma .column.is-offset-10-fullhd { margin-left: 83.33333%; }
  .bulma .column.is-11-fullhd { flex: none; width: 91.66667%; }
  .bulma .column.is-offset-11-fullhd { margin-left: 91.66667%; }
  .bulma .column.is-12-fullhd { flex: none; width: 100%; }
  .bulma .column.is-offset-12-fullhd { margin-left: 100%; } }

.bulma .columns { margin-left: -0.75rem; margin-right: -0.75rem; margin-top: -0.75rem; }

.bulma .columns:last-child { margin-bottom: -0.75rem; }

.bulma .columns:not(:last-child) { margin-bottom: calc(1.5rem - 0.75rem); }

.bulma .columns.is-centered { justify-content: center; }

.bulma .columns.is-gapless { margin-left: 0; margin-right: 0; margin-top: 0; }

.bulma .columns.is-gapless > .column { margin: 0; padding: 0 !important; }

.bulma .columns.is-gapless:not(:last-child) { margin-bottom: 1.5rem; }

.bulma .columns.is-gapless:last-child { margin-bottom: 0; }

.bulma .columns.is-mobile { display: flex; }

.bulma .columns.is-multiline { flex-wrap: wrap; }

.bulma .columns.is-vcentered { align-items: center; }

@media screen and (min-width: 769px), print { .bulma .columns:not(.is-desktop) { display: flex; } }

@media screen and (min-width: 1024px) { .bulma .columns.is-desktop { display: flex; } }

.bulma .columns.is-variable { --columnGap: 0.75rem; margin-left: calc(-1 * var(--columnGap)); margin-right: calc(-1 * var(--columnGap)); }

.bulma .columns.is-variable .column { padding-left: var(--columnGap); padding-right: var(--columnGap); }

.bulma .columns.is-variable.is-0 { --columnGap: 0rem; }

@media screen and (max-width: 768px) { .bulma .columns.is-variable.is-0-mobile { --columnGap: 0rem; } }

@media screen and (min-width: 769px), print { .bulma .columns.is-variable.is-0-tablet { --columnGap: 0rem; } }

@media screen and (min-width: 769px) and (max-width: 1023px) { .bulma .columns.is-variable.is-0-tablet-only { --columnGap: 0rem; } }

@media screen and (max-width: 1023px) { .bulma .columns.is-variable.is-0-touch { --columnGap: 0rem; } }

@media screen and (min-width: 1024px) { .bulma .columns.is-variable.is-0-desktop { --columnGap: 0rem; } }

@media screen and (min-width: 1024px) and (max-width: 1215px) { .bulma .columns.is-variable.is-0-desktop-only { --columnGap: 0rem; } }

@media screen and (min-width: 1216px) { .bulma .columns.is-variable.is-0-widescreen { --columnGap: 0rem; } }

@media screen and (min-width: 1216px) and (max-width: 1407px) { .bulma .columns.is-variable.is-0-widescreen-only { --columnGap: 0rem; } }

@media screen and (min-width: 1408px) { .bulma .columns.is-variable.is-0-fullhd { --columnGap: 0rem; } }

.bulma .columns.is-variable.is-1 { --columnGap: 0.25rem; }

@media screen and (max-width: 768px) { .bulma .columns.is-variable.is-1-mobile { --columnGap: 0.25rem; } }

@media screen and (min-width: 769px), print { .bulma .columns.is-variable.is-1-tablet { --columnGap: 0.25rem; } }

@media screen and (min-width: 769px) and (max-width: 1023px) { .bulma .columns.is-variable.is-1-tablet-only { --columnGap: 0.25rem; } }

@media screen and (max-width: 1023px) { .bulma .columns.is-variable.is-1-touch { --columnGap: 0.25rem; } }

@media screen and (min-width: 1024px) { .bulma .columns.is-variable.is-1-desktop { --columnGap: 0.25rem; } }

@media screen and (min-width: 1024px) and (max-width: 1215px) { .bulma .columns.is-variable.is-1-desktop-only { --columnGap: 0.25rem; } }

@media screen and (min-width: 1216px) { .bulma .columns.is-variable.is-1-widescreen { --columnGap: 0.25rem; } }

@media screen and (min-width: 1216px) and (max-width: 1407px) { .bulma .columns.is-variable.is-1-widescreen-only { --columnGap: 0.25rem; } }

@media screen and (min-width: 1408px) { .bulma .columns.is-variable.is-1-fullhd { --columnGap: 0.25rem; } }

.bulma .columns.is-variable.is-2 { --columnGap: 0.5rem; }

@media screen and (max-width: 768px) { .bulma .columns.is-variable.is-2-mobile { --columnGap: 0.5rem; } }

@media screen and (min-width: 769px), print { .bulma .columns.is-variable.is-2-tablet { --columnGap: 0.5rem; } }

@media screen and (min-width: 769px) and (max-width: 1023px) { .bulma .columns.is-variable.is-2-tablet-only { --columnGap: 0.5rem; } }

@media screen and (max-width: 1023px) { .bulma .columns.is-variable.is-2-touch { --columnGap: 0.5rem; } }

@media screen and (min-width: 1024px) { .bulma .columns.is-variable.is-2-desktop { --columnGap: 0.5rem; } }

@media screen and (min-width: 1024px) and (max-width: 1215px) { .bulma .columns.is-variable.is-2-desktop-only { --columnGap: 0.5rem; } }

@media screen and (min-width: 1216px) { .bulma .columns.is-variable.is-2-widescreen { --columnGap: 0.5rem; } }

@media screen and (min-width: 1216px) and (max-width: 1407px) { .bulma .columns.is-variable.is-2-widescreen-only { --columnGap: 0.5rem; } }

@media screen and (min-width: 1408px) { .bulma .columns.is-variable.is-2-fullhd { --columnGap: 0.5rem; } }

.bulma .columns.is-variable.is-3 { --columnGap: 0.75rem; }

@media screen and (max-width: 768px) { .bulma .columns.is-variable.is-3-mobile { --columnGap: 0.75rem; } }

@media screen and (min-width: 769px), print { .bulma .columns.is-variable.is-3-tablet { --columnGap: 0.75rem; } }

@media screen and (min-width: 769px) and (max-width: 1023px) { .bulma .columns.is-variable.is-3-tablet-only { --columnGap: 0.75rem; } }

@media screen and (max-width: 1023px) { .bulma .columns.is-variable.is-3-touch { --columnGap: 0.75rem; } }

@media screen and (min-width: 1024px) { .bulma .columns.is-variable.is-3-desktop { --columnGap: 0.75rem; } }

@media screen and (min-width: 1024px) and (max-width: 1215px) { .bulma .columns.is-variable.is-3-desktop-only { --columnGap: 0.75rem; } }

@media screen and (min-width: 1216px) { .bulma .columns.is-variable.is-3-widescreen { --columnGap: 0.75rem; } }

@media screen and (min-width: 1216px) and (max-width: 1407px) { .bulma .columns.is-variable.is-3-widescreen-only { --columnGap: 0.75rem; } }

@media screen and (min-width: 1408px) { .bulma .columns.is-variable.is-3-fullhd { --columnGap: 0.75rem; } }

.bulma .columns.is-variable.is-4 { --columnGap: 1rem; }

@media screen and (max-width: 768px) { .bulma .columns.is-variable.is-4-mobile { --columnGap: 1rem; } }

@media screen and (min-width: 769px), print { .bulma .columns.is-variable.is-4-tablet { --columnGap: 1rem; } }

@media screen and (min-width: 769px) and (max-width: 1023px) { .bulma .columns.is-variable.is-4-tablet-only { --columnGap: 1rem; } }

@media screen and (max-width: 1023px) { .bulma .columns.is-variable.is-4-touch { --columnGap: 1rem; } }

@media screen and (min-width: 1024px) { .bulma .columns.is-variable.is-4-desktop { --columnGap: 1rem; } }

@media screen and (min-width: 1024px) and (max-width: 1215px) { .bulma .columns.is-variable.is-4-desktop-only { --columnGap: 1rem; } }

@media screen and (min-width: 1216px) { .bulma .columns.is-variable.is-4-widescreen { --columnGap: 1rem; } }

@media screen and (min-width: 1216px) and (max-width: 1407px) { .bulma .columns.is-variable.is-4-widescreen-only { --columnGap: 1rem; } }

@media screen and (min-width: 1408px) { .bulma .columns.is-variable.is-4-fullhd { --columnGap: 1rem; } }

.bulma .columns.is-variable.is-5 { --columnGap: 1.25rem; }

@media screen and (max-width: 768px) { .bulma .columns.is-variable.is-5-mobile { --columnGap: 1.25rem; } }

@media screen and (min-width: 769px), print { .bulma .columns.is-variable.is-5-tablet { --columnGap: 1.25rem; } }

@media screen and (min-width: 769px) and (max-width: 1023px) { .bulma .columns.is-variable.is-5-tablet-only { --columnGap: 1.25rem; } }

@media screen and (max-width: 1023px) { .bulma .columns.is-variable.is-5-touch { --columnGap: 1.25rem; } }

@media screen and (min-width: 1024px) { .bulma .columns.is-variable.is-5-desktop { --columnGap: 1.25rem; } }

@media screen and (min-width: 1024px) and (max-width: 1215px) { .bulma .columns.is-variable.is-5-desktop-only { --columnGap: 1.25rem; } }

@media screen and (min-width: 1216px) { .bulma .columns.is-variable.is-5-widescreen { --columnGap: 1.25rem; } }

@media screen and (min-width: 1216px) and (max-width: 1407px) { .bulma .columns.is-variable.is-5-widescreen-only { --columnGap: 1.25rem; } }

@media screen and (min-width: 1408px) { .bulma .columns.is-variable.is-5-fullhd { --columnGap: 1.25rem; } }

.bulma .columns.is-variable.is-6 { --columnGap: 1.5rem; }

@media screen and (max-width: 768px) { .bulma .columns.is-variable.is-6-mobile { --columnGap: 1.5rem; } }

@media screen and (min-width: 769px), print { .bulma .columns.is-variable.is-6-tablet { --columnGap: 1.5rem; } }

@media screen and (min-width: 769px) and (max-width: 1023px) { .bulma .columns.is-variable.is-6-tablet-only { --columnGap: 1.5rem; } }

@media screen and (max-width: 1023px) { .bulma .columns.is-variable.is-6-touch { --columnGap: 1.5rem; } }

@media screen and (min-width: 1024px) { .bulma .columns.is-variable.is-6-desktop { --columnGap: 1.5rem; } }

@media screen and (min-width: 1024px) and (max-width: 1215px) { .bulma .columns.is-variable.is-6-desktop-only { --columnGap: 1.5rem; } }

@media screen and (min-width: 1216px) { .bulma .columns.is-variable.is-6-widescreen { --columnGap: 1.5rem; } }

@media screen and (min-width: 1216px) and (max-width: 1407px) { .bulma .columns.is-variable.is-6-widescreen-only { --columnGap: 1.5rem; } }

@media screen and (min-width: 1408px) { .bulma .columns.is-variable.is-6-fullhd { --columnGap: 1.5rem; } }

.bulma .columns.is-variable.is-7 { --columnGap: 1.75rem; }

@media screen and (max-width: 768px) { .bulma .columns.is-variable.is-7-mobile { --columnGap: 1.75rem; } }

@media screen and (min-width: 769px), print { .bulma .columns.is-variable.is-7-tablet { --columnGap: 1.75rem; } }

@media screen and (min-width: 769px) and (max-width: 1023px) { .bulma .columns.is-variable.is-7-tablet-only { --columnGap: 1.75rem; } }

@media screen and (max-width: 1023px) { .bulma .columns.is-variable.is-7-touch { --columnGap: 1.75rem; } }

@media screen and (min-width: 1024px) { .bulma .columns.is-variable.is-7-desktop { --columnGap: 1.75rem; } }

@media screen and (min-width: 1024px) and (max-width: 1215px) { .bulma .columns.is-variable.is-7-desktop-only { --columnGap: 1.75rem; } }

@media screen and (min-width: 1216px) { .bulma .columns.is-variable.is-7-widescreen { --columnGap: 1.75rem; } }

@media screen and (min-width: 1216px) and (max-width: 1407px) { .bulma .columns.is-variable.is-7-widescreen-only { --columnGap: 1.75rem; } }

@media screen and (min-width: 1408px) { .bulma .columns.is-variable.is-7-fullhd { --columnGap: 1.75rem; } }

.bulma .columns.is-variable.is-8 { --columnGap: 2rem; }

@media screen and (max-width: 768px) { .bulma .columns.is-variable.is-8-mobile { --columnGap: 2rem; } }

@media screen and (min-width: 769px), print { .bulma .columns.is-variable.is-8-tablet { --columnGap: 2rem; } }

@media screen and (min-width: 769px) and (max-width: 1023px) { .bulma .columns.is-variable.is-8-tablet-only { --columnGap: 2rem; } }

@media screen and (max-width: 1023px) { .bulma .columns.is-variable.is-8-touch { --columnGap: 2rem; } }

@media screen and (min-width: 1024px) { .bulma .columns.is-variable.is-8-desktop { --columnGap: 2rem; } }

@media screen and (min-width: 1024px) and (max-width: 1215px) { .bulma .columns.is-variable.is-8-desktop-only { --columnGap: 2rem; } }

@media screen and (min-width: 1216px) { .bulma .columns.is-variable.is-8-widescreen { --columnGap: 2rem; } }

@media screen and (min-width: 1216px) and (max-width: 1407px) { .bulma .columns.is-variable.is-8-widescreen-only { --columnGap: 2rem; } }

@media screen and (min-width: 1408px) { .bulma .columns.is-variable.is-8-fullhd { --columnGap: 2rem; } }

.bulma .tile { align-items: stretch; display: block; flex-basis: 0; flex-grow: 1; flex-shrink: 1; min-height: min-content; }

.bulma .tile.is-ancestor { margin-left: -0.75rem; margin-right: -0.75rem; margin-top: -0.75rem; }

.bulma .tile.is-ancestor:last-child { margin-bottom: -0.75rem; }

.bulma .tile.is-ancestor:not(:last-child) { margin-bottom: 0.75rem; }

.bulma .tile.is-child { margin: 0 !important; }

.bulma .tile.is-parent { padding: 0.75rem; }

.bulma .tile.is-vertical { flex-direction: column; }

.bulma .tile.is-vertical > .tile.is-child:not(:last-child) { margin-bottom: 1.5rem !important; }

@media screen and (min-width: 769px), print { .bulma .tile:not(.is-child) { display: flex; }
  .bulma .tile.is-1 { flex: none; width: 8.33333%; }
  .bulma .tile.is-2 { flex: none; width: 16.66667%; }
  .bulma .tile.is-3 { flex: none; width: 25%; }
  .bulma .tile.is-4 { flex: none; width: 33.33333%; }
  .bulma .tile.is-5 { flex: none; width: 41.66667%; }
  .bulma .tile.is-6 { flex: none; width: 50%; }
  .bulma .tile.is-7 { flex: none; width: 58.33333%; }
  .bulma .tile.is-8 { flex: none; width: 66.66667%; }
  .bulma .tile.is-9 { flex: none; width: 75%; }
  .bulma .tile.is-10 { flex: none; width: 83.33333%; }
  .bulma .tile.is-11 { flex: none; width: 91.66667%; }
  .bulma .tile.is-12 { flex: none; width: 100%; } }

.bulma .hero { align-items: stretch; display: flex; flex-direction: column; justify-content: space-between; }

.bulma .hero .navbar { background: none; }

.bulma .hero .tabs ul { border-bottom: none; }

.bulma .hero.is-white { background-color: white; color: #0a0a0a; }

.bulma .hero.is-white a:not(.button):not(.dropdown-item):not(.tag):not(.pagination-link.is-current), .bulma .hero.is-white strong { color: inherit; }

.bulma .hero.is-white .title { color: #0a0a0a; }

.bulma .hero.is-white .subtitle { color: rgba(10, 10, 10, 0.9); }

.bulma .hero.is-white .subtitle a:not(.button), .bulma .hero.is-white .subtitle strong { color: #0a0a0a; }

@media screen and (max-width: 1023px) { .bulma .hero.is-white .navbar-menu { background-color: white; } }

.bulma .hero.is-white .navbar-item, .bulma .hero.is-white .navbar-link { color: rgba(10, 10, 10, 0.7); }

.bulma .hero.is-white a.navbar-item:hover, .bulma .hero.is-white a.navbar-item.is-active, .bulma .hero.is-white .navbar-link:hover, .bulma .hero.is-white .navbar-link.is-active { background-color: #f2f2f2; color: #0a0a0a; }

.bulma .hero.is-white .tabs a { color: #0a0a0a; opacity: 0.9; }

.bulma .hero.is-white .tabs a:hover { opacity: 1; }

.bulma .hero.is-white .tabs li.is-active a { opacity: 1; }

.bulma .hero.is-white .tabs.is-boxed a, .bulma .hero.is-white .tabs.is-toggle a { color: #0a0a0a; }

.bulma .hero.is-white .tabs.is-boxed a:hover, .bulma .hero.is-white .tabs.is-toggle a:hover { background-color: rgba(10, 10, 10, 0.1); }

.bulma .hero.is-white .tabs.is-boxed li.is-active a, .bulma .hero.is-white .tabs.is-boxed li.is-active a:hover, .bulma .hero.is-white .tabs.is-toggle li.is-active a, .bulma .hero.is-white .tabs.is-toggle li.is-active a:hover { background-color: #0a0a0a; border-color: #0a0a0a; color: white; }

.bulma .hero.is-white.is-bold { background-image: linear-gradient(141deg, #e6e6e6 0%, white 71%, white 100%); }

@media screen and (max-width: 768px) { .bulma .hero.is-white.is-bold .navbar-menu { background-image: linear-gradient(141deg, #e6e6e6 0%, white 71%, white 100%); } }

.bulma .hero.is-black { background-color: #0a0a0a; color: white; }

.bulma .hero.is-black a:not(.button):not(.dropdown-item):not(.tag):not(.pagination-link.is-current), .bulma .hero.is-black strong { color: inherit; }

.bulma .hero.is-black .title { color: white; }

.bulma .hero.is-black .subtitle { color: rgba(255, 255, 255, 0.9); }

.bulma .hero.is-black .subtitle a:not(.button), .bulma .hero.is-black .subtitle strong { color: white; }

@media screen and (max-width: 1023px) { .bulma .hero.is-black .navbar-menu { background-color: #0a0a0a; } }

.bulma .hero.is-black .navbar-item, .bulma .hero.is-black .navbar-link { color: rgba(255, 255, 255, 0.7); }

.bulma .hero.is-black a.navbar-item:hover, .bulma .hero.is-black a.navbar-item.is-active, .bulma .hero.is-black .navbar-link:hover, .bulma .hero.is-black .navbar-link.is-active { background-color: black; color: white; }

.bulma .hero.is-black .tabs a { color: white; opacity: 0.9; }

.bulma .hero.is-black .tabs a:hover { opacity: 1; }

.bulma .hero.is-black .tabs li.is-active a { opacity: 1; }

.bulma .hero.is-black .tabs.is-boxed a, .bulma .hero.is-black .tabs.is-toggle a { color: white; }

.bulma .hero.is-black .tabs.is-boxed a:hover, .bulma .hero.is-black .tabs.is-toggle a:hover { background-color: rgba(10, 10, 10, 0.1); }

.bulma .hero.is-black .tabs.is-boxed li.is-active a, .bulma .hero.is-black .tabs.is-boxed li.is-active a:hover, .bulma .hero.is-black .tabs.is-toggle li.is-active a, .bulma .hero.is-black .tabs.is-toggle li.is-active a:hover { background-color: white; border-color: white; color: #0a0a0a; }

.bulma .hero.is-black.is-bold { background-image: linear-gradient(141deg, black 0%, #0a0a0a 71%, #181616 100%); }

@media screen and (max-width: 768px) { .bulma .hero.is-black.is-bold .navbar-menu { background-image: linear-gradient(141deg, black 0%, #0a0a0a 71%, #181616 100%); } }

.bulma .hero.is-light { background-color: whitesmoke; color: #363636; }

.bulma .hero.is-light a:not(.button):not(.dropdown-item):not(.tag):not(.pagination-link.is-current), .bulma .hero.is-light strong { color: inherit; }

.bulma .hero.is-light .title { color: #363636; }

.bulma .hero.is-light .subtitle { color: rgba(54, 54, 54, 0.9); }

.bulma .hero.is-light .subtitle a:not(.button), .bulma .hero.is-light .subtitle strong { color: #363636; }

@media screen and (max-width: 1023px) { .bulma .hero.is-light .navbar-menu { background-color: whitesmoke; } }

.bulma .hero.is-light .navbar-item, .bulma .hero.is-light .navbar-link { color: rgba(54, 54, 54, 0.7); }

.bulma .hero.is-light a.navbar-item:hover, .bulma .hero.is-light a.navbar-item.is-active, .bulma .hero.is-light .navbar-link:hover, .bulma .hero.is-light .navbar-link.is-active { background-color: #e8e8e8; color: #363636; }

.bulma .hero.is-light .tabs a { color: #363636; opacity: 0.9; }

.bulma .hero.is-light .tabs a:hover { opacity: 1; }

.bulma .hero.is-light .tabs li.is-active a { opacity: 1; }

.bulma .hero.is-light .tabs.is-boxed a, .bulma .hero.is-light .tabs.is-toggle a { color: #363636; }

.bulma .hero.is-light .tabs.is-boxed a:hover, .bulma .hero.is-light .tabs.is-toggle a:hover { background-color: rgba(10, 10, 10, 0.1); }

.bulma .hero.is-light .tabs.is-boxed li.is-active a, .bulma .hero.is-light .tabs.is-boxed li.is-active a:hover, .bulma .hero.is-light .tabs.is-toggle li.is-active a, .bulma .hero.is-light .tabs.is-toggle li.is-active a:hover { background-color: #363636; border-color: #363636; color: whitesmoke; }

.bulma .hero.is-light.is-bold { background-image: linear-gradient(141deg, #dfd8d9 0%, whitesmoke 71%, white 100%); }

@media screen and (max-width: 768px) { .bulma .hero.is-light.is-bold .navbar-menu { background-image: linear-gradient(141deg, #dfd8d9 0%, whitesmoke 71%, white 100%); } }

.bulma .hero.is-dark { background-color: #363636; color: whitesmoke; }

.bulma .hero.is-dark a:not(.button):not(.dropdown-item):not(.tag):not(.pagination-link.is-current), .bulma .hero.is-dark strong { color: inherit; }

.bulma .hero.is-dark .title { color: whitesmoke; }

.bulma .hero.is-dark .subtitle { color: rgba(245, 245, 245, 0.9); }

.bulma .hero.is-dark .subtitle a:not(.button), .bulma .hero.is-dark .subtitle strong { color: whitesmoke; }

@media screen and (max-width: 1023px) { .bulma .hero.is-dark .navbar-menu { background-color: #363636; } }

.bulma .hero.is-dark .navbar-item, .bulma .hero.is-dark .navbar-link { color: rgba(245, 245, 245, 0.7); }

.bulma .hero.is-dark a.navbar-item:hover, .bulma .hero.is-dark a.navbar-item.is-active, .bulma .hero.is-dark .navbar-link:hover, .bulma .hero.is-dark .navbar-link.is-active { background-color: #292929; color: whitesmoke; }

.bulma .hero.is-dark .tabs a { color: whitesmoke; opacity: 0.9; }

.bulma .hero.is-dark .tabs a:hover { opacity: 1; }

.bulma .hero.is-dark .tabs li.is-active a { opacity: 1; }

.bulma .hero.is-dark .tabs.is-boxed a, .bulma .hero.is-dark .tabs.is-toggle a { color: whitesmoke; }

.bulma .hero.is-dark .tabs.is-boxed a:hover, .bulma .hero.is-dark .tabs.is-toggle a:hover { background-color: rgba(10, 10, 10, 0.1); }

.bulma .hero.is-dark .tabs.is-boxed li.is-active a, .bulma .hero.is-dark .tabs.is-boxed li.is-active a:hover, .bulma .hero.is-dark .tabs.is-toggle li.is-active a, .bulma .hero.is-dark .tabs.is-toggle li.is-active a:hover { background-color: whitesmoke; border-color: whitesmoke; color: #363636; }

.bulma .hero.is-dark.is-bold { background-image: linear-gradient(141deg, #1f191a 0%, #363636 71%, #46403f 100%); }

@media screen and (max-width: 768px) { .bulma .hero.is-dark.is-bold .navbar-menu { background-image: linear-gradient(141deg, #1f191a 0%, #363636 71%, #46403f 100%); } }

.bulma .hero.is-primary { background-color: #00d1b2; color: #fff; }

.bulma .hero.is-primary a:not(.button):not(.dropdown-item):not(.tag):not(.pagination-link.is-current), .bulma .hero.is-primary strong { color: inherit; }

.bulma .hero.is-primary .title { color: #fff; }

.bulma .hero.is-primary .subtitle { color: rgba(255, 255, 255, 0.9); }

.bulma .hero.is-primary .subtitle a:not(.button), .bulma .hero.is-primary .subtitle strong { color: #fff; }

@media screen and (max-width: 1023px) { .bulma .hero.is-primary .navbar-menu { background-color: #00d1b2; } }

.bulma .hero.is-primary .navbar-item, .bulma .hero.is-primary .navbar-link { color: rgba(255, 255, 255, 0.7); }

.bulma .hero.is-primary a.navbar-item:hover, .bulma .hero.is-primary a.navbar-item.is-active, .bulma .hero.is-primary .navbar-link:hover, .bulma .hero.is-primary .navbar-link.is-active { background-color: #00b89c; color: #fff; }

.bulma .hero.is-primary .tabs a { color: #fff; opacity: 0.9; }

.bulma .hero.is-primary .tabs a:hover { opacity: 1; }

.bulma .hero.is-primary .tabs li.is-active a { opacity: 1; }

.bulma .hero.is-primary .tabs.is-boxed a, .bulma .hero.is-primary .tabs.is-toggle a { color: #fff; }

.bulma .hero.is-primary .tabs.is-boxed a:hover, .bulma .hero.is-primary .tabs.is-toggle a:hover { background-color: rgba(10, 10, 10, 0.1); }

.bulma .hero.is-primary .tabs.is-boxed li.is-active a, .bulma .hero.is-primary .tabs.is-boxed li.is-active a:hover, .bulma .hero.is-primary .tabs.is-toggle li.is-active a, .bulma .hero.is-primary .tabs.is-toggle li.is-active a:hover { background-color: #fff; border-color: #fff; color: #00d1b2; }

.bulma .hero.is-primary.is-bold { background-image: linear-gradient(141deg, #009e6c 0%, #00d1b2 71%, #00e7eb 100%); }

@media screen and (max-width: 768px) { .bulma .hero.is-primary.is-bold .navbar-menu { background-image: linear-gradient(141deg, #009e6c 0%, #00d1b2 71%, #00e7eb 100%); } }

.bulma .hero.is-link { background-color: #3273dc; color: #fff; }

.bulma .hero.is-link a:not(.button):not(.dropdown-item):not(.tag):not(.pagination-link.is-current), .bulma .hero.is-link strong { color: inherit; }

.bulma .hero.is-link .title { color: #fff; }

.bulma .hero.is-link .subtitle { color: rgba(255, 255, 255, 0.9); }

.bulma .hero.is-link .subtitle a:not(.button), .bulma .hero.is-link .subtitle strong { color: #fff; }

@media screen and (max-width: 1023px) { .bulma .hero.is-link .navbar-menu { background-color: #3273dc; } }

.bulma .hero.is-link .navbar-item, .bulma .hero.is-link .navbar-link { color: rgba(255, 255, 255, 0.7); }

.bulma .hero.is-link a.navbar-item:hover, .bulma .hero.is-link a.navbar-item.is-active, .bulma .hero.is-link .navbar-link:hover, .bulma .hero.is-link .navbar-link.is-active { background-color: #2366d1; color: #fff; }

.bulma .hero.is-link .tabs a { color: #fff; opacity: 0.9; }

.bulma .hero.is-link .tabs a:hover { opacity: 1; }

.bulma .hero.is-link .tabs li.is-active a { opacity: 1; }

.bulma .hero.is-link .tabs.is-boxed a, .bulma .hero.is-link .tabs.is-toggle a { color: #fff; }

.bulma .hero.is-link .tabs.is-boxed a:hover, .bulma .hero.is-link .tabs.is-toggle a:hover { background-color: rgba(10, 10, 10, 0.1); }

.bulma .hero.is-link .tabs.is-boxed li.is-active a, .bulma .hero.is-link .tabs.is-boxed li.is-active a:hover, .bulma .hero.is-link .tabs.is-toggle li.is-active a, .bulma .hero.is-link .tabs.is-toggle li.is-active a:hover { background-color: #fff; border-color: #fff; color: #3273dc; }

.bulma .hero.is-link.is-bold { background-image: linear-gradient(141deg, #1577c6 0%, #3273dc 71%, #4366e5 100%); }

@media screen and (max-width: 768px) { .bulma .hero.is-link.is-bold .navbar-menu { background-image: linear-gradient(141deg, #1577c6 0%, #3273dc 71%, #4366e5 100%); } }

.bulma .hero.is-info { background-color: #209cee; color: #fff; }

.bulma .hero.is-info a:not(.button):not(.dropdown-item):not(.tag):not(.pagination-link.is-current), .bulma .hero.is-info strong { color: inherit; }

.bulma .hero.is-info .title { color: #fff; }

.bulma .hero.is-info .subtitle { color: rgba(255, 255, 255, 0.9); }

.bulma .hero.is-info .subtitle a:not(.button), .bulma .hero.is-info .subtitle strong { color: #fff; }

@media screen and (max-width: 1023px) { .bulma .hero.is-info .navbar-menu { background-color: #209cee; } }

.bulma .hero.is-info .navbar-item, .bulma .hero.is-info .navbar-link { color: rgba(255, 255, 255, 0.7); }

.bulma .hero.is-info a.navbar-item:hover, .bulma .hero.is-info a.navbar-item.is-active, .bulma .hero.is-info .navbar-link:hover, .bulma .hero.is-info .navbar-link.is-active { background-color: #118fe4; color: #fff; }

.bulma .hero.is-info .tabs a { color: #fff; opacity: 0.9; }

.bulma .hero.is-info .tabs a:hover { opacity: 1; }

.bulma .hero.is-info .tabs li.is-active a { opacity: 1; }

.bulma .hero.is-info .tabs.is-boxed a, .bulma .hero.is-info .tabs.is-toggle a { color: #fff; }

.bulma .hero.is-info .tabs.is-boxed a:hover, .bulma .hero.is-info .tabs.is-toggle a:hover { background-color: rgba(10, 10, 10, 0.1); }

.bulma .hero.is-info .tabs.is-boxed li.is-active a, .bulma .hero.is-info .tabs.is-boxed li.is-active a:hover, .bulma .hero.is-info .tabs.is-toggle li.is-active a, .bulma .hero.is-info .tabs.is-toggle li.is-active a:hover { background-color: #fff; border-color: #fff; color: #209cee; }

.bulma .hero.is-info.is-bold { background-image: linear-gradient(141deg, #04a6d7 0%, #209cee 71%, #3287f5 100%); }

@media screen and (max-width: 768px) { .bulma .hero.is-info.is-bold .navbar-menu { background-image: linear-gradient(141deg, #04a6d7 0%, #209cee 71%, #3287f5 100%); } }

.bulma .hero.is-success { background-color: #23d160; color: #fff; }

.bulma .hero.is-success a:not(.button):not(.dropdown-item):not(.tag):not(.pagination-link.is-current), .bulma .hero.is-success strong { color: inherit; }

.bulma .hero.is-success .title { color: #fff; }

.bulma .hero.is-success .subtitle { color: rgba(255, 255, 255, 0.9); }

.bulma .hero.is-success .subtitle a:not(.button), .bulma .hero.is-success .subtitle strong { color: #fff; }

@media screen and (max-width: 1023px) { .bulma .hero.is-success .navbar-menu { background-color: #23d160; } }

.bulma .hero.is-success .navbar-item, .bulma .hero.is-success .navbar-link { color: rgba(255, 255, 255, 0.7); }

.bulma .hero.is-success a.navbar-item:hover, .bulma .hero.is-success a.navbar-item.is-active, .bulma .hero.is-success .navbar-link:hover, .bulma .hero.is-success .navbar-link.is-active { background-color: #20bc56; color: #fff; }

.bulma .hero.is-success .tabs a { color: #fff; opacity: 0.9; }

.bulma .hero.is-success .tabs a:hover { opacity: 1; }

.bulma .hero.is-success .tabs li.is-active a { opacity: 1; }

.bulma .hero.is-success .tabs.is-boxed a, .bulma .hero.is-success .tabs.is-toggle a { color: #fff; }

.bulma .hero.is-success .tabs.is-boxed a:hover, .bulma .hero.is-success .tabs.is-toggle a:hover { background-color: rgba(10, 10, 10, 0.1); }

.bulma .hero.is-success .tabs.is-boxed li.is-active a, .bulma .hero.is-success .tabs.is-boxed li.is-active a:hover, .bulma .hero.is-success .tabs.is-toggle li.is-active a, .bulma .hero.is-success .tabs.is-toggle li.is-active a:hover { background-color: #fff; border-color: #fff; color: #23d160; }

.bulma .hero.is-success.is-bold { background-image: linear-gradient(141deg, #12af2f 0%, #23d160 71%, #2ce28a 100%); }

@media screen and (max-width: 768px) { .bulma .hero.is-success.is-bold .navbar-menu { background-image: linear-gradient(141deg, #12af2f 0%, #23d160 71%, #2ce28a 100%); } }

.bulma .hero.is-warning { background-color: #ffdd57; color: rgba(0, 0, 0, 0.7); }

.bulma .hero.is-warning a:not(.button):not(.dropdown-item):not(.tag):not(.pagination-link.is-current), .bulma .hero.is-warning strong { color: inherit; }

.bulma .hero.is-warning .title { color: rgba(0, 0, 0, 0.7); }

.bulma .hero.is-warning .subtitle { color: rgba(0, 0, 0, 0.9); }

.bulma .hero.is-warning .subtitle a:not(.button), .bulma .hero.is-warning .subtitle strong { color: rgba(0, 0, 0, 0.7); }

@media screen and (max-width: 1023px) { .bulma .hero.is-warning .navbar-menu { background-color: #ffdd57; } }

.bulma .hero.is-warning .navbar-item, .bulma .hero.is-warning .navbar-link { color: rgba(0, 0, 0, 0.7); }

.bulma .hero.is-warning a.navbar-item:hover, .bulma .hero.is-warning a.navbar-item.is-active, .bulma .hero.is-warning .navbar-link:hover, .bulma .hero.is-warning .navbar-link.is-active { background-color: #ffd83d; color: rgba(0, 0, 0, 0.7); }

.bulma .hero.is-warning .tabs a { color: rgba(0, 0, 0, 0.7); opacity: 0.9; }

.bulma .hero.is-warning .tabs a:hover { opacity: 1; }

.bulma .hero.is-warning .tabs li.is-active a { opacity: 1; }

.bulma .hero.is-warning .tabs.is-boxed a, .bulma .hero.is-warning .tabs.is-toggle a { color: rgba(0, 0, 0, 0.7); }

.bulma .hero.is-warning .tabs.is-boxed a:hover, .bulma .hero.is-warning .tabs.is-toggle a:hover { background-color: rgba(10, 10, 10, 0.1); }

.bulma .hero.is-warning .tabs.is-boxed li.is-active a, .bulma .hero.is-warning .tabs.is-boxed li.is-active a:hover, .bulma .hero.is-warning .tabs.is-toggle li.is-active a, .bulma .hero.is-warning .tabs.is-toggle li.is-active a:hover { background-color: rgba(0, 0, 0, 0.7); border-color: rgba(0, 0, 0, 0.7); color: #ffdd57; }

.bulma .hero.is-warning.is-bold { background-image: linear-gradient(141deg, #ffaf24 0%, #ffdd57 71%, #fffa70 100%); }

@media screen and (max-width: 768px) { .bulma .hero.is-warning.is-bold .navbar-menu { background-image: linear-gradient(141deg, #ffaf24 0%, #ffdd57 71%, #fffa70 100%); } }

.bulma .hero.is-danger { background-color: #ff3860; color: #fff; }

.bulma .hero.is-danger a:not(.button):not(.dropdown-item):not(.tag):not(.pagination-link.is-current), .bulma .hero.is-danger strong { color: inherit; }

.bulma .hero.is-danger .title { color: #fff; }

.bulma .hero.is-danger .subtitle { color: rgba(255, 255, 255, 0.9); }

.bulma .hero.is-danger .subtitle a:not(.button), .bulma .hero.is-danger .subtitle strong { color: #fff; }

@media screen and (max-width: 1023px) { .bulma .hero.is-danger .navbar-menu { background-color: #ff3860; } }

.bulma .hero.is-danger .navbar-item, .bulma .hero.is-danger .navbar-link { color: rgba(255, 255, 255, 0.7); }

.bulma .hero.is-danger a.navbar-item:hover, .bulma .hero.is-danger a.navbar-item.is-active, .bulma .hero.is-danger .navbar-link:hover, .bulma .hero.is-danger .navbar-link.is-active { background-color: #ff1f4b; color: #fff; }

.bulma .hero.is-danger .tabs a { color: #fff; opacity: 0.9; }

.bulma .hero.is-danger .tabs a:hover { opacity: 1; }

.bulma .hero.is-danger .tabs li.is-active a { opacity: 1; }

.bulma .hero.is-danger .tabs.is-boxed a, .bulma .hero.is-danger .tabs.is-toggle a { color: #fff; }

.bulma .hero.is-danger .tabs.is-boxed a:hover, .bulma .hero.is-danger .tabs.is-toggle a:hover { background-color: rgba(10, 10, 10, 0.1); }

.bulma .hero.is-danger .tabs.is-boxed li.is-active a, .bulma .hero.is-danger .tabs.is-boxed li.is-active a:hover, .bulma .hero.is-danger .tabs.is-toggle li.is-active a, .bulma .hero.is-danger .tabs.is-toggle li.is-active a:hover { background-color: #fff; border-color: #fff; color: #ff3860; }

.bulma .hero.is-danger.is-bold { background-image: linear-gradient(141deg, #ff0561 0%, #ff3860 71%, #ff5257 100%); }

@media screen and (max-width: 768px) { .bulma .hero.is-danger.is-bold .navbar-menu { background-image: linear-gradient(141deg, #ff0561 0%, #ff3860 71%, #ff5257 100%); } }

.bulma .hero.is-small .hero-body { padding-bottom: 1.5rem; padding-top: 1.5rem; }

@media screen and (min-width: 769px), print { .bulma .hero.is-medium .hero-body { padding-bottom: 9rem; padding-top: 9rem; } }

@media screen and (min-width: 769px), print { .bulma .hero.is-large .hero-body { padding-bottom: 18rem; padding-top: 18rem; } }

.bulma .hero.is-halfheight .hero-body, .bulma .hero.is-fullheight .hero-body, .bulma .hero.is-fullheight-with-navbar .hero-body { align-items: center; display: flex; }

.bulma .hero.is-halfheight .hero-body > .container, .bulma .hero.is-fullheight .hero-body > .container, .bulma .hero.is-fullheight-with-navbar .hero-body > .container { flex-grow: 1; flex-shrink: 1; }

.bulma .hero.is-halfheight { min-height: 50vh; }

.bulma .hero.is-fullheight { min-height: 100vh; }

.bulma .hero-video { overflow: hidden; }

.bulma .hero-video video { left: 50%; min-height: 100%; min-width: 100%; position: absolute; top: 50%; transform: translate3d(-50%, -50%, 0); }

.bulma .hero-video.is-transparent { opacity: 0.3; }

@media screen and (max-width: 768px) { .bulma .hero-video { display: none; } }

.bulma .hero-buttons { margin-top: 1.5rem; }

@media screen and (max-width: 768px) { .bulma .hero-buttons .button { display: flex; }
  .bulma .hero-buttons .button:not(:last-child) { margin-bottom: 0.75rem; } }

@media screen and (min-width: 769px), print { .bulma .hero-buttons { display: flex; justify-content: center; }
  .bulma .hero-buttons .button:not(:last-child) { margin-right: 1.5rem; } }

.bulma .hero-head, .bulma .hero-foot { flex-grow: 0; flex-shrink: 0; }

.bulma .hero-body { flex-grow: 1; flex-shrink: 0; padding: 3rem 1.5rem; }

.bulma .section { padding: 3rem 1.5rem; }

@media screen and (min-width: 1024px) { .bulma .section.is-medium { padding: 9rem 1.5rem; }
  .bulma .section.is-large { padding: 18rem 1.5rem; } }

.bulma .footer { background-color: #fafafa; padding: 3rem 1.5rem 6rem; }

</style>
`;
