// ==UserScript==
// @name         Quick Ref+
// @namespace    https://greasyfork.org/en/users/1349307-jellyworlddoesntexist
// @version      1.0.0
// @description  Enhancements for the Quick Ref page. Clicks on all the pets so you don't have to, displays an action bar, and makes things cute.
// @author       jellyworlddoesntexist
// @match        https://www.neopets.com/quickref.phtml
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505947/Quick%20Ref%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/505947/Quick%20Ref%2B.meta.js
// ==/UserScript==

(function () {
  /**
   * Inject CSS to style the pet grid
   */
  const style = document.createElement('style');
  style.innerHTML = `
  html {
    scroll-behavior: smooth;
  }

  div.pet_more {
    border: 0 !important;
    width: auto !important;
  }

  h3.pet_notices_header {
    display: none;
  }

  div[id$="_details"] {
    display: block !important;
  }

  .pet_more {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  div.pet_notices {
    height: auto !important;
    flex: 1;
  }

  div.pet_notices div {
    background-size: 60px !important;
    background-position: left !important;
    height: 80px !important;
    padding-left: 75px !important;
    padding-top: 0 !important;
    display: table-cell;
    vertical-align: middle;
  }

  span.pet_notice_spacer {
    height: 0 !important;
  }

  div.pet_notices br + a {
    display: inline-block;
    margin-top: 5px;
  }

  .content .contentModule {
    border: 0;
  }

  :is(.contentModuleHeader, .contentModuleHeaderAlt) a {
    color: inherit !important;
  }

  :is(.contentModuleHeader, .contentModuleHeaderAlt) {
    font-weight: normal;
    font-size: 14px;
    line-height: 1.3 !important;
    height: unset !important;
    padding: 0 !important;
    background: #eee;
    background-size: 20px;
    background-position: center;
    color: #000;
  }

  .pet-header-wrapper {
    backdrop-filter: blur(50px);
    padding: 10px;
    background: #ffffffab;
    height: 100%;
    margin-bottom: -1px;
    display: flex;
    align-items: center;
    gap: 5px;
    line-height: 1;
  }

  .content .contentModuleTable {
    border-width: 1px;
  }

  .content .contentModuleTable td[style="padding: 3px"] {
    padding: 10px !important;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 180px 300px 1fr;
    gap: 15px;
  }

  div.pet_info {
    width: 100% !important;
    height: unset !important;
    margin: 0 !important;
  }

  div.pet_image {
    width: 100% !important;
    aspect-ratio: 1;
    height: auto !important;
    border: 0 !important;
  }

  table.pet_stats {
    width: 180px !important;
  }

  .sf[style*="width: 240px;"] {
    width: 100% !important;
    margin-inline: auto;
  }

  .content > p[style="margin-bottom: 0"] {
    display: none;
  }

  #nav {
    display: flex !important;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: center;
    gap: 10px;
    margin-block: 20px !important;
  }

  #nav tr {
    display: contents;
  }

  #nav td {
    display: inline-grid;
    gap: 5px;
    width: unset !important;
    height: unset !important;
    box-sizing: border-box;
    grid-template-areas:
        "img menu"
        "status status";
    grid-template-rows: 50px 1fr;
    align-items: flex-start;
  }

  #nav td:not(:has(.status-wrapper)) {
    row-gap: 0;
  }

  #nav td.active_pet {
    background: none !important;
    position: relative;
  }

  #nav td.active_pet::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 36px;
    aspect-ratio: 1;
    background: no-repeat url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg id='a' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 26.87655 26.87655'%3E%3Cpolygon points='2.9455 23.93105 2.9455 2.9455 23.93105 2.9455 2.9455 23.93105' fill='silver'/%3E%3Cline x1='1.41421' y1='25.46233' x2='25.46233' y2='1.41421' fill='none' stroke='%23fff' stroke-linecap='square' stroke-miterlimit='10' stroke-width='2'/%3E%3Cpath d='M9.58881,6.64649l1.89025.279c.15786.02357.28805.13429.3382.28558.04988.15129.00904.31819-.10387.43001l-1.37089,1.35636.32504,1.91683c.02631.15786-.03947.31682-.16992.41165-.13018.09483-.30257.10524-.44454.03015l-1.68771-.90114-1.68798.90114c-.14197.07509-.31436.06304-.44454-.03015-.13018-.09373-.19596-.25379-.16965-.41165l.3234-1.91683-1.37061-1.35636c-.11319-.11182-.15266-.27873-.10387-.43001.04851-.15129.18006-.26201.33793-.28558l1.88915-.279.84577-1.74033c.07126-.14471.21706-.23679.37904-.23679.1617,0,.30915.09209.37876.23679l.84605,1.74033Z' fill='%23fff'/%3E%3C/svg%3E") center / cover;
    pointer-events: none;
  }

  #nav td a.pet_menu_launcher {
    margin-right: 0 !important;
  }

  .status-wrapper {
    grid-area: status;
    display: grid;
    gap: 5px;
    text-align: center;
    font-size: 10px;
    line-height: 1;
  }

  .status-badge {
    padding: 3px !important;
    border-radius: 2px;
    display: block;
    background: #eee;
  }

  .active-icon {
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    display: inline-block;
    width: 20px;
    aspect-ratio: 1;
  }

  .active-icon--active {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512'%3E%3Cpath d='M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z'/%3E%3C/svg%3E");
  }

  .active-icon--inactive {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512'%3E%3Cpath d='M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z'/%3E%3C/svg%3E");
    opacity: 0.3;
  }

  .active-icon--inactive:hover {
    opacity: 0.7;
  }

  .pet-actions {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin-inline: auto;
  }

  .pet-action {
    width: 32px;
    aspect-ratio: 1;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.3;
  }

  .pet-action:hover {
    opacity: 0.8;
  }

  .pet-action--neolodge {
    background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg id='a' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 25 25'%3E%3Cpath d='M23.5388,12.03069c.25803.23044.28562.625.05518.88283s-.62561.28136-.88283.05477l-1.46138-1.28915v7.69535c0,1.72651-1.39809,3.125-3.1248,3.125H6.87538c-1.72671,0-3.12561-1.39849-3.12561-3.125v-7.69535l-1.46057,1.28915c-.25803.23044-.65239.20306-.88283-.05477s-.20367-.65624.05437-.88283L12.08554,2.65569c.23856-.20691.59396-.20691.82847,0l10.6248,9.375ZM6.87538,21.2495h11.2496c1.03538,0,1.8752-.83983,1.8752-1.875v-8.80072l-7.5-6.61717-7.5,6.61717v8.80072c0,1.03518.83983,1.875,1.8752,1.875ZM8.12283,14.06475l.32476-2.78461c.02416-.202.19187-.35247.39724-.35247.21177,0,.38658.16433.39653.37628l.15065,2.58296c.0064.10269.08883.18121.19116.18121.10304,0,.18832-.07852.19187-.18121l.15065-2.59309c.00995-.20537.18121-.36278.38658-.36278s.37237.16096.38658.36278l.15065,2.59309c.0064.10269.08883.18121.19116.18121.10304,0,.18832-.07852.19187-.18121l.15065-2.58296c.0135-.21195.18761-.37628.39653-.37628.20182,0,.37308.15048.39653.35247l.32547,2.78461c0,1.0059-.70139,1.84746-1.64227,2.06296v2.35361c0,.30113-.24659.54736-.54719.54736-.30131,0-.54719-.24623-.54719-.54736v-2.35361c-.94087-.2155-1.64227-1.05706-1.64227-2.06296ZM14.77494,18.48132v-2.18945c-.60617,0-1.09508-.48927-1.09508-1.09473v-1.26581c0-2.15854,1.41273-2.94201,1.72044-3.08574.03766-.01706.07888-.02736.12365-.02736.19116,0,.34537.15403.34537.34554v7.31754c0,.30113-.24659.54736-.54719.54736-.30131,0-.54719-.24623-.54719-.54736Z'/%3E%3C/svg%3E");
  }

  .pet-action--customise {
    background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg id='a' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 25 25'%3E%3Cpath d='M8.50574,2.5c.05087,0,.09781.00393.14475.00787.03514-.00393.06634-.00787.10148-.00787h7.5c.03514,0,.07027.00393.10148.00787.04694-.00393.09387-.00787.14475-.00787h.24596c1.08192,0,2.12896.37497,2.96885,1.05858l3.08973,2.5312,1.69132,1.38295-.39438.48432.39438-.48432c.53519.43738.61333,1.22247.17595,1.75766l-2.76956,3.38683c-.43764.53519-1.22273.61333-1.75792.17569l-1.39055-1.13672v8.65639c0,1.207-.98044,2.18743-2.18743,2.18743h-8.12513c-1.207,0-2.18743-.98044-2.18743-2.18743v-8.65639l-1.39448,1.14065c-.53126.43764-1.32027.3595-1.75792-.17569L.33,9.23432c-.43738-.53126-.35924-1.32027.17595-1.75766l1.69525-1.38688,3.08973-2.5312c.83989-.68361,1.88693-1.05858,2.96885-1.05858h.24596ZM6.08388,4.52355l-3.09366,2.5312-1.69132,1.38662,2.77349,3.39076,1.69132-1.38688.71874-.58973c.18749-.15235.44918-.18749.66394-.08207.21502.10541.35557.3241.35557.56639v9.97273c0,.51946.41798.93743.93743.93743h8.12906c.51946,0,.93743-.41798.93743-.93743v-9.97273c0-.24229.13662-.46492.35531-.56639.21895-.10148.47671-.07027.6642.08207l.71874.58973,1.69132,1.38688,2.76956-3.38683-1.69132-1.38662-3.09366-2.53147c-.61333-.50372-1.38295-.77722-2.1759-.77722h-.24596c0,.00393-.00787.00393-.01573.0118-.01967.01547-.03907.04668-.05087.08575-.45705,1.74219-2.04295,3.02732-3.92962,3.02732s-3.47257-1.28514-3.92962-3.02732c-.0118-.03907-.0312-.07027-.05087-.08575-.00787-.00787-.01573-.0118-.01573-.0118h-.24596c-.79295,0-1.56257.27349-2.1759.77722v-.00367ZM12.50197,5.62513c1.22273,0,2.26558-.78141,2.65235-1.87513h-5.3047c.38677,1.09372,1.42962,1.87513,2.65235,1.87513Z'/%3E%3C/svg%3E");
  }

  .pet-action--abilities {
    background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg id='a' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 25 25'%3E%3Cpath d='M16.58197,9.22278c2.41793,1.40995,4.0429,4.02717,4.0429,7.02722,0,2.18743-.86323,4.17584-2.26951,5.63667-.40618.41798-.98044.61333-1.56624.61333h-8.57825c-.58186,0-1.16006-.19535-1.56257-.61333-1.40995-1.46082-2.27318-3.44923-2.27318-5.63667,0-3.00005,1.62497-5.61726,4.0429-7.02722.20296-.11721.33197-.3283.33197-.56272V3.75h-.62513c-.34351,0-.62487-.28136-.62487-.62487,0-.34377.28136-.62513.62487-.62513h8.75026c.34351,0,.62487.28136.62487.62513,0,.34351-.28136.62487-.62487.62487h-.62513v4.91006c0,.23442.12901.44551.33197.56272ZM10,8.66399c0,.70721-.39464,1.3166-.95317,1.64071-2.05082,1.19153-3.42196,3.41016-3.42196,5.9453,0,1.85153.73054,3.53131,1.92207,4.76951.12115.12508.34377.23049.66394.23049h8.57825c.32017,0,.54279-.10541.66394-.23049,1.19153-1.2382,1.92207-2.91798,1.92207-4.76951,0-2.53514-1.37115-4.75378-3.42196-5.94923-.55853-.3241-.95317-.92957-.95317-1.64071V3.75h-5v4.91399Z'/%3E%3Cpath d='M12.07809,11.91418c.0666-.17569.23442-.2929.42217-.2929.18722,0,.35505.11721.42165.2929l.82809,2.2071,2.20684.82809c.17621.06634.29316.23442.29316.42191s-.11695.35557-.29316.42191l-2.20684.82809-.82809,2.2071c-.0666.17569-.23442.2929-.42165.2929-.18775,0-.35557-.11721-.42217-.2929l-.82809-2.2071-2.20684-.82809c-.17621-.06634-.29316-.23442-.29316-.42191s.11695-.35557.29316-.42191l2.20684-.82809.82809-2.2071Z'/%3E%3C/svg%3E");
  }

  .pet-action--equip {
    background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg id='a' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 25 25'%3E%3Cpath d='M7.0067,11.11807l6.87487,6.87513c.24229.24229.24229.6406,0,.88289l-1.24974,1.25c-.20715.20689-.53126.24203-.77722.08575l-3.01605-1.91787-1.28488,1.28514.24596,1.23453c.03933.20689-.0236.41798-.17202.56639l-.93717.93743c-.24229.24203-.64086.24203-.88316,0l-3.12461-3.12513c-.24229-.24203-.24229-.6406,0-.88263l.93717-.9377c.14842-.14842.36344-.21082.56639-.17175l1.23453.24596,1.2854-1.2812-1.9184-3.01552c-.15628-.24622-.12115-.57033.08601-.77748l1.25026-1.25c.24229-.24203.64034-.24203.88263,0v-.00393ZM7.94439,16.69233l-1.87539,1.87513c-.14842.14842-.36291.21082-.56639.17175l-1.234-.24596-.25802.25776,2.2425,2.24224.2575-.25776-.24596-1.23453c-.03933-.20689.0236-.41798.17202-.56639l1.87487-1.87487c.20715-.20715.53126-.24229.77722-.08601l3.01552,1.91787.45312-.45312-5.99224-5.99224-.45312.45312,1.9184,3.01579c.15576.24596.12062.57033-.08601.77722ZM22.31507,2.68456c.14475.14055.20715.34377.17621.54306l-.49245,2.96098c-.10541.6406-.41011,1.23427-.87109,1.69525l-8.95605,8.95212-.88263-.88289,8.95973-8.95212c.27743-.27349.46098-.6288.52339-1.01558l.3477-2.09776-2.09776.3477c-.38651.06267-.74208.24622-1.01951.52339l-8.95605,8.95238-.88263-.88289L17.11997,3.87216c.46098-.45705,1.05465-.76568,1.69551-.87109l2.96098-.49219c.19876-.0312.40224.0312.54279.17569h-.0042Z'/%3E%3C/svg%3E");
  }

  .pet-action--lookup {
    background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg id='a' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 25 25'%3E%3Cpath d='M1.25,6.87487v-.62487c0-1.37901,1.12099-2.5,2.5-2.5h17.5c1.37901,0,2.5,1.12099,2.5,2.5v12.5c0,1.37901-1.12099,2.5-2.5,2.5H3.75c-1.37901,0-2.5-1.12099-2.5-2.5V6.87487ZM3.75,5c-.69147,0-1.25.55853-1.25,1.25h20c0-.69147-.55853-1.25-1.25-1.25H3.75ZM22.5,7.5H2.5v11.25c0,.69147.55853,1.25,1.25,1.25h17.5c.69147,0,1.25-.55853,1.25-1.25V7.5ZM14.37513,10.62513c0-.34377.2811-.62513.62487-.62513h5c.34377,0,.62487.28136.62487.62513,0,.34351-.2811.62487-.62487.62487h-5c-.34377,0-.62487-.28136-.62487-.62487ZM14.37513,13.12513c0-.34377.2811-.62513.62487-.62513h5c.34377,0,.62487.28136.62487.62513,0,.34351-.2811.62487-.62487.62487h-5c-.34377,0-.62487-.28136-.62487-.62487ZM14.37513,15.62513c0-.34377.2811-.62513.62487-.62513h5c.34377,0,.62487.28136.62487.62513,0,.34351-.2811.62487-.62487.62487h-5c-.34377,0-.62487-.28136-.62487-.62487ZM4.19775,16.43796l3.42434-1.47277,3.52132,2.97585-.7778-3.45465-.13536-.57779,3.04049-1.85056h-3.48697l-.67679-2.49906-1.91723,2.5122h-3.00918l1.80106,1.68692s-1.78389,2.67988-1.78389,2.67988Z'/%3E%3C/svg%3E");
  }

  .pet-action--lookup--edit {
    background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg id='a' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 25 25'%3E%3Cpath d='M22.01013,12.18016c.24186-.24186.63976-.24186.88162,0l.67487.67877c.24186.24186.24186.63976,0,.88162l-.96745.96745-1.5604-1.5604.97135-.96745ZM20.15716,14.03313l1.5604,1.5604-4.14676,4.14676c-.08192.08192-.17945.13653-.28867.16384l-1.91149.47592.47982-1.91149c.02731-.10923.08582-.21065.16384-.28867l4.14676-4.14676h-.0039ZM23.77338,11.29853c-.72949-.72949-1.91539-.72949-2.64878,0l-5.99583,5.99583c-.24186.24186-.4096.54224-.49153.86992l-.72949,2.92184c-.05461.21455.0078.43691.16384.59295s.3784.21845.59295.16384l2.92184-.72949c.32768-.08192.62806-.25356.86992-.49153l5.99583-5.99583c.72949-.72949.72949-1.91539,0-2.64877l-.67877-.67877h0Z'/%3E%3Cpath d='M.00073,5.63429v12.48318c0,1.37705,1.11958,2.49664,2.49664,2.49664h10.08017l.31208-1.24832H2.49737c-.69048,0-1.24832-.55784-1.24832-1.24832V6.88261h19.97308v2.71509c.3979-.15604.82311-.23016,1.24832-.21846v-3.74495c0-1.37705-1.11959-2.49664-2.49664-2.49664H2.49737C1.12032,3.13766.00073,4.25724.00073,5.63429ZM1.24905,5.63429c0-.69048.55784-1.24832,1.24832-1.24832h17.47645c.69048,0,1.24832.55784,1.24832,1.24832H1.24905ZM13.10807,10.00341c0,.34329.28087.62416.62416.62416h4.99327c.34329,0,.62416-.28087.62416-.62416s-.28087-.62416-.62416-.62416h-4.99327c-.34329,0-.62416.28087-.62416.62416ZM13.10807,12.50004c0,.34329.28087.62416.62416.62416h3.59672l1.24832-1.24832h-4.84503c-.34329,0-.62416.28087-.62416.62416ZM13.10807,14.99668c0,.34329.28087.62416.62416.62416h1.10398l1.24832-1.24832h-2.3523c-.34329,0-.62416.28087-.62416.62416ZM2.9181,16.43796l3.42434-1.47277,3.52132,2.97585-.7778-3.45465-.13536-.57779,3.04049-1.85056h-3.48697l-.67679-2.49906-1.91723,2.5122h-3.00918l1.80106,1.68692s-1.78389,2.67988-1.78389,2.67988Z' isolation='isolate' opacity='.4'/%3E%3C/svg%3E");
  }

  .pet-action--homepage--edit {
    background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg id='a' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 25 25'%3E%3Cpath d='M22.01013,12.18016c.24186-.24186.63976-.24186.88162,0l.67487.67877c.24186.24186.24186.63976,0,.88162l-.96745.96745-1.5604-1.5604.97135-.96745ZM20.15716,14.03313l1.5604,1.5604-4.14676,4.14676c-.08192.08192-.17945.13653-.28867.16384l-1.91149.47592.47982-1.91149c.02731-.10923.08582-.21065.16384-.28867l4.14676-4.14676h-.0039ZM23.77338,11.29853c-.72949-.72949-1.91539-.72949-2.64878,0l-5.99583,5.99583c-.24186.24186-.4096.54224-.49153.86992l-.72949,2.92184c-.05461.21455.0078.43691.16384.59295s.3784.21845.59295.16384l2.92184-.72949c.32768-.08192.62806-.25356.86992-.49153l5.99583-5.99583c.72949-.72949.72949-1.91539,0-2.64877l-.67877-.67877h0Z'/%3E%3Cpath d='M.00073,5.63429C.00073,4.25724,1.12032,3.13766,2.49737,3.13766h14.97981c1.37705,0,2.49664,1.11958,2.49664,2.49664v4.84503l-1.24832,1.24832v-6.09335c0-.69048-.55784-1.24832-1.24832-1.24832H2.49737c-.69048,0-1.24832.55784-1.24832,1.24832v12.48318c0,.69048.55784,1.24832,1.24832,1.24832h10.39224l-.31208,1.24832H2.49737C1.12032,20.61411.00073,19.49452.00073,18.11747V5.63429ZM2.80945,6.88261c0-.51883.41741-.93624.93624-.93624s.93624.41741.93624.93624-.41741.93624-.93624.93624-.93624-.41741-.93624-.93624ZM6.5544,6.88261c0-.51883.41741-.93624.93624-.93624s.93624.41741.93624.93624-.41741.93624-.93624.93624-.93624-.41741-.93624-.93624ZM10.29935,6.88261c0-.51883.41741-.93624.93624-.93624s.93624.41741.93624.93624-.41741.93624-.93624.93624-.93624-.41741-.93624-.93624Z' isolation='isolate' opacity='.4'/%3E%3C/svg%3E");
  }

  `;

  document.head.appendChild(style);

  /**
   * Sort the pet grid
   */
  const tileTable = document.getElementById('nav');
  const petTiles = Array.from(tileTable.getElementsByTagName('td'));

  petTiles.forEach(function (tile) {
    const petImage = tile.querySelector('img');
    const petName = petImage ? petImage.getAttribute('title') : '';
    const toggle = tile.querySelector('.pet_toggler');
    petImage.setAttribute('src', 'https://images.neopets.com/blank.gif');
    tile.setAttribute('data-pet', petName);
    toggle.removeAttribute('onClick');
    toggle.setAttribute('href', `#${petName}_details`);
  });

  petTiles.sort(function (a, b) {
    if (a.classList.contains('active_pet')) {
      return -1;
    } else if (b.classList.contains('active_pet')) {
      return 1;
    } else {
      return a.getAttribute('data-pet').localeCompare(b.getAttribute('data-pet'));
    }
  });

  const sortedRow = document.createElement('tr');

  petTiles.forEach(function (tile) {
    sortedRow.appendChild(tile);
  });

  tileTable.appendChild(sortedRow);

  const tbody = tileTable.querySelector('tbody');
  tbody && tbody.remove();

  /**
   * Check the pet's status based on an image
   */
  function hasStatusImage(petName, image) {
    const petDetails = document.getElementById(petName + '_details');
    if (!petDetails) return false;

    const status = petDetails.querySelector('.sf[style*="' + image + '"]');

    return status;
  }

  /**
   * Get the remaining Neolodge duration of a pet
   */
  function neolodgeDuration(petName) {
    const petDetails = document.getElementById(petName + '_details');
    const status = petDetails.querySelector('.sf[style*="onholiday.gif"]');

    if (status) {
      const statusText = status.innerText;
      const time = statusText.match(/\d+ (day|hour|minute|second)s?/g);

      if (statusText.includes('checking into')) {
        return 'Check-in';
      } else if (statusText.includes('checking out')) {
        return 'Checkout';
      } else if (time) {
        if (time[0] === '0 days') {
          return time[1];
        } else if (time[0] === '0 days' && time[1] === '0 hours') {
          return time[2];
        } else {
          return time[0];
        }
      } else {
        return 'Unknown';
      }
    }
  }

  /**
   * Create and format the Neolodge status badge
   */
  function neolodgeStatusBadge(petName) {
    const el = document.createElement('span');
    const elText = neolodgeDuration(petName);
    el.classList.add('status-badge');
    el.classList.add('nl-status');
    el.innerText = elText;

    if (elText.includes('Checking')) {
      el.style.color = '#777';
      el.style.fontStyle = 'italic';
    }

    // Color code the status based on the time left
    if (elText.includes('hour') || elText.includes('minute')) {
      el.style.backgroundColor = '#fd9696';
    } else if (parseInt(elText.split(' ')[0]) < 2) {
      el.style.backgroundColor = '#fdc196';
    } else if (parseInt(elText.split(' ')[0]) < 3) {
      el.style.backgroundColor = '#fdf196';
    }

    // Fix pluralization issues due to bad Neopets copy
    if (parseInt(elText.split(' ')[0]) === 1) {
      el.innerText = elText.slice(0, -1);
    }

    return el;
  }

  /**
   * Create and format the Dying status badge
   */
  function hungerStatusBadge() {
    const el = document.createElement('span');
    el.classList.add('status-badge');
    el.classList.add('hunger-status');
    el.innerText = 'Dying';
    el.style.backgroundColor = '#fd9696';
    return el;
  }

  /**
   * Create and format the "Sick" status badge
   */
  function sickStatusBadge() {
    const el = document.createElement('span');
    el.classList.add('status-badge');
    el.classList.add('sick-status');
    el.innerText = 'Sick';
    el.style.backgroundColor = '#fd9696';
    return el;
  }

  /**
   * Create an icon bar of pet actions
   */
  function petActionBar(petName) {
    const petActions = document.createElement('div');
    petActions.classList.add('pet-actions');

    const actions = [
      {
        action: 'neolodge',
        url: `https://www.neopets.com/book_neolodge.phtml?pet_name=${petName}&hotel_rate=5&nights=28`,
        title: 'Book in Neolodge for 28 days (140 NP)',
      },
      {
        action: 'customise',
        url: `https://www.neopets.com/customise/?view=${petName}`,
        title: 'Customise',
      },
      {
        action: 'abilities',
        url: `https://www.neopets.com/abilities.phtml?pet_name=${petName}`,
        title: 'View Abilities',
      },
      {
        action: 'equip',
        url: `https://www.neopets.com/dome/neopets.phtml?pet=${petName}`,
        title: 'Equip Battledome Items',
      },
      {
        action: 'lookup',
        url: `https://www.neopets.com/petlookup.phtml?pet=${petName}`,
        title: 'View Pet Lookup',
      },
      {
        action: 'lookup--edit',
        url: `https://www.neopets.com/neopet_desc.phtml?edit_petname=${petName}`,
        title: 'Edit Pet Lookup',
      },
      {
        action: 'homepage--edit',
        url: `https://www.neopets.com/editpage.phtml?pet_name=${petName}`,
        title: 'Edit Pet Homepage',
      }
    ];

    actions.forEach(function (action) {
      const actionLink = document.createElement('a');
      actionLink.classList.add('pet-action');
      actionLink.classList.add(`pet-action--${action.action}`);
      actionLink.href = action.url;
      actionLink.title = action.title;
      petActions.appendChild(actionLink);
    });

    // If the pet is in the Neolodge, remove the action
    if (hasStatusImage(petName, 'onholiday.gif')) {
      petActions.querySelector('.pet-action--neolodge').remove();
    }

    return petActions;
  }

  /**
   * Add status badges to the pet tiles
   */
  petTiles.forEach(function (tile) {
    const petName = tile.getAttribute('data-pet');

    // Create the status wrapper
    const statusWrapper = document.createElement('div');
    statusWrapper.classList.add('status-wrapper');
    tile.appendChild(statusWrapper);

    // Is the pet sick? :(
    if (hasStatusImage(petName, 'redcross.gif')) {
      statusWrapper.appendChild(sickStatusBadge(petName));
    }

    if (hasStatusImage(petName, 'onholiday.gif')) {
      statusWrapper.appendChild(neolodgeStatusBadge(petName));
    } else {
      // Is the pet starving? :(
      if (hasStatusImage(petName, 'foo_delight_fishbone.gif')) {
        statusWrapper.appendChild(hungerStatusBadge());
      }
    }

    // If the statusWrapper is empty, remove it
    if (!statusWrapper.children.length) {
      statusWrapper.remove();
    }
  });

  /**
   * Add JN links for hospital cures
   */
  const hospitalLinks = document.querySelectorAll('.sf a[href="/hospital.phtml"]');
  hospitalLinks.forEach(function (link) {
    const cureLink = document.createElement('a');
    cureLink.setAttribute('href', 'https://www.jellyneo.net/?go=diseasescures#known');
    cureLink.setAttribute('target', '_blank');
    cureLink.style.display = 'inline-block';
    cureLink.style.marginTop = '5px';
    cureLink.innerText = 'Find the cure on JellyNeo';
    link.after(cureLink);
  });

  const petCards = document.querySelectorAll('.contentModule[id$="_details"]');

  /**
   * Create an active/inactive indicator icon
   */
  function activeIcon(petHeader, petName) {
    // Check if the pet is active
    let isPetActive = false;

    if (document.querySelector(`td.active_pet[data-pet="${petName}"]`)) {
      petHeader.classList.add('active-pet');
      isPetActive = true;
    }

    // Add a link to make the pet active
    const activeIconEl = isPetActive ? 'span' : 'a';
    const activeIcon = document.createElement(activeIconEl);
    activeIcon.classList.add('active-icon');

    if (isPetActive) {
      activeIcon.classList.add('active-icon--active');
      activeIcon.title = 'Active Pet';
    } else {
      activeIcon.href = `https://www.neopets.com/process_changepet.phtml?new_active_pet=${petName}`;
      activeIcon.classList.add('active-icon--inactive');
      activeIcon.title = 'Make Active';
    }

    return activeIcon;
  }

  /**
   * Style the pet cards
   */
  petCards.forEach(function (card) {
    const petName = card.id.replace('_details', '');
    const petImage = card.querySelector('.pet_image');
    const petHeader = card.querySelector('th[class^="contentModuleHeader"]');
    const petStatusBox = card.querySelector('.pet_more');

    /**
     * Add a cute header to each card that is themed with the pet's image
     * Add an active/inactive icon to the header
     */

    const headerWrapper = document.createElement('div');
    headerWrapper.classList.add('pet-header-wrapper');

    headerWrapper.appendChild(activeIcon(petHeader, petName));

    const headerContents = Array.from(petHeader.childNodes);
    headerContents.forEach(function (node) {
      headerWrapper.appendChild(node);
    });

    petHeader.appendChild(headerWrapper);
    petHeader.style.backgroundImage = petImage.style.backgroundImage;

    // Add the pet action bar
    petStatusBox.appendChild(petActionBar(petName));
  });

})();