//
// Written by Glenn Wiking
// Script Version: 0.1.1a
// Date of issue: 01/09/15
// Date of resolution: 01/09/15
//
// ==UserScript==
// @name        ShadeRoot OneDrive
// @namespace   SROD
// @version     0.1.1a
// @grant       none
// @icon        https://i.imgur.com/lf3dfmi.png
// @description	Eye-friendly magic in your browser for OneDrive

// @include     http://*onedrive.live.com*
// @include     https://*onedrive.live.com*
// @include		http://shaderoot.host56.com/exp/Files%20-%20OneDrive.htm

// @downloadURL https://update.greasyfork.org/scripts/17059/ShadeRoot%20OneDrive.user.js
// @updateURL https://update.greasyfork.org/scripts/17059/ShadeRoot%20OneDrive.meta.js
// ==/UserScript==

function ShadeRootOneDrive(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootOneDrive(
	'body {display: none;}'
	+
	'.o365cs-base.o365cs-topnavBGColor-2 {background-color: #093B93 !important;}'
	+
	'.Files-leftNav, .CommandBar {border-right: 1px solid #11387D !important; background-color: #0B2047 !important;}'
	+
	'.LeftPane-quotaDivider {border-color: #1842A7 !important;}'
	+
	'.o365cs-base .o365cs-navMenuButton, .o365cs-base .o365cs-topnavText, .o365cs-base .o365cs-topnavText:hover {color: #80BAEC !important;}'
	+
	'.o365cs-base .ms-bgc-tp, .o365cs-base .ms-bgc-tp-h, .o365cs-base.ms-bgc-tp {background-color: #0A56C8 !important;}'
	+
	'.o365cs-base .ms-bgc-tdr, .o365cs-base .ms-bgc-tdr-h:hover {background-color: #10307D !important;}'
	+
	'.od-SearchBox {background-color: #071A3F !important; color: #7EB9F3 !important;}'
	+
	'.od-SearchBox--active, .od-SearchBox:hover {background-color: #081227 !important; color: #7EB9F3 !important;}'
	+
	'a.LeftNav-link:hover:not(.LeftNav-is-active), a.LeftNav-subLink:hover:not(.LeftNav-is-active), a.LeftNav-link.LeftNav-is-active, a.LeftNav-subLink.LeftNav-is-active {background: #144896 !important;}'
	+
	'a.LeftNav-link:hover, a.LeftNav-link, .LeftNav-basicLink, .ms-font-su, .ms-font-xl, .ms-font-xxl {color: #7ED1FF !important;}'
	+
	'a.LeftNav-link, a.LeftNav-subLink {color: #4478C6 !important;}'
	+
	'a.LeftNav-link:hover, a.LeftNav-subLink:hover, .ms-font-m, .ms-font-m-plus, .ms-font-s, .ms-font-s-plus, .ms-font-xs, .LeftPane-quotaLink, .od-SearchBox-input, input[type="text"] {color: #87ABE1 !important;}'
	+
	'.CommandBarItem:hover {background-color: #0F2862 !important;}'
	+
	'.od-FolderCoverTile-empty, .ItemTile-dragDropIcon {box-shadow: 0px 0px 0px 1px #1539A1 !important; background-color: #0A275A !important;}'
	+
	'.ItemTile.is-folder .ItemTile-namePlate {background-color: #094AB2 !important; color: #87B3DE !important; border-top: 1px solid #175099 !important;}'
	+
	'.ItemTile-frame {box-shadow: 0px 0px 0px 2px #0F45B3 !important;}'
	+
	'.ItemTile.is-folder .ItemTile-namePlate::before {border-top: 1px solid #174A8D !important;}'
	+
	'.ItemTile-folderBeakHighlight::before {background-color: #0C62B6 !important;}'
	+
	'.od-FolderCoverTile-item4, .od-FolderCoverTile-item3 {background-color: #105EB6 !important; box-shadow: 0px 0px 0px 1px #0F5EAB !important;}'
	+
	'.od-FolderCoverTile-item2 {background-color: #0D6AA5 !important; box-shadow: 0px 0px 0px 1px #1855BF !important;}'
	+
	'.ItemTile.is-file, .ItemTile.is-file .ThumbnailTile-thumbnail, .ItemTile.is-file .od-ImageStackTile, .ItemTile.is-folder .ThumbnailTile-thumbnail, .ItemTile.is-folder .od-ImageStackTile, .ItemTile.is-media, .ItemTile.is-media .ThumbnailTile-thumbnail, .ItemTile.is-media .od-ImageStackTile {background-color: #094AB2 !important;}'
	+
	'.xlg .od-ItemContent-title, .xxlg .od-ItemContent-title, .xxxlg .od-ItemContent-title {color: #4484C3 !important;}'
	+
	'.ItemTile.is-file .ItemTile-fileContainer {border: 1px solid #1539A1; !important;}'
	+
	'.ItemTile-fileContainer {background-color: #0A275A !important;}'
	+
	'.ItemTile.is-file .ItemTile-namePlate {border-top: 1px solid #1B5AAB !important;}'
	+
	'.ItemTile-namePlate {background-color: #094AB2 !important; color: #87B3DE !important;}'
	+
	'.od-FolderCoverTile-item0, .od-FolderCoverTile-item1 {background-color: #225096 !important; box-shadow: 0px 0px 0px 1px #0B4AC9 !important;}'
	+
	'.NotificationBase.ModalDialog .InnerContainer .UserContent {color: #99C3E1 !important;}'
	+
	'.ItemCheck, .InfoPane-sectionContent {color: rgb(30, 93, 140) !important;}'
	+
	'.ItemCheck, .ItemTile.is-file .ThumbnailTile-thumbnail img, .ItemTile.is-file .od-ImageStack-tile img {opacity: .7 !important;}'
	+
	'.o365cs-base .o365cs-topnavLinkBackground-2 {background-color: #0A56C8 !important;}'
	+
	'.Footer {border-top: 1px solid #144A9B !important;}'
	+
	'.ms-ContextualMenu.is-open {background-color: #154BA9 !important; border: 1px solid #1E5EB9 !important;}'
	+
	'a.od-ContextualMenu-item {background-color: rgb(4, 49, 108) !important;}'
	+
	'.Files-infoPane {border-left: 1px solid #174E84 !important;}'
	+
	'.Files-infoPane {background: #0E2E66 !important;}'
	+
	'.ItemTile-fileContainer {border: 1px solid #092D56 !important;}'
	+
	'.ContextualMenu hr {border-color: #124F8A !important;}'
	+
	'.ms-ContextualMenu, .ms-ContextualMenu a, a.od-ContextualMenu-item {color: #A0C9F2 !important;}'
	+
	'a.od-ContextualMenu-item:active, a.od-ContextualMenu-item:hover {background-color: #0354B0 !important; color: #A4C6F3 !important;}'
	+
	'.DetailsRow.is-selected {background: #0D3F77 !important;}'
	+
	'.DetailsRow-cell > a, .DetailsRow-cell > a:visited {color: #9BBEE4 !important;}'
	+
	'.od-Panel {background: #0B2047 !important;}'
	+
	'.od-FolderTree-row.is-selected {background: #0078D7 !important;}'
	+
	'.od--isNonMobile .od-FolderTree-row:hover {background: #0078D7 !important;'
	+
	'a.od-EditableText-readOnlyArea--interactive:focus, a.od-EditableText-readOnlyArea--interactive:hover {border-color: #2077D8 !important; color: #9AC9E7 !important;}'
	+
	'.NotificationBase.ModalDialog.UI_Dialog_BG {background-color: rgba(11, 24, 44, 0.75) !important;}'
	+
	'.NotificationBase .leftMenu, .NotificationBase .sd_menu {background-color: rgb(6, 46, 98) !important;}'
	+
	'.NotificationBase .leftMenu .ips_entity.sd_menu_selected, .NotificationBase .leftMenu .sd_menu_tab.sd_menu_selected, .NotificationBase .sd_menu .ips_entity.sd_menu_selected, .NotificationBase .sd_menu .sd_menu_tab.sd_menu_selected {background-color: #0E4B87 !important;}'
	+
	'.sd_menu_tab {color: #83B6E9 !important;}'
	+
	'.sd_menu_tab a, .sd_menu_perms .ips_level, .sd_header, h3, .sd_subheader_text {color: #93BDED !important;}'
	+
	'.sd_menu_subheader, .sd_menu_perms .ips_scope_header {color: #4E8FF0 !important;}'
	+
	'.sd_menu_perms .ips_scope_header, .sd_email_statement, .sd_header_sec, .sd_subheader {color: rgb(55, 143, 243) !important;}'
	+
	'.cpv2 .cp_inputArea {background: rgb(6, 46, 98) !important;}'
	+
	'.cpv2 .cp_inputArea {border: 1px solid #22427B !important;}'
	+
	'.cpv2 .cp_primaryInput, .NotificationBase textarea {background: #062E62 !important;}'
	+
	'.cpv2 .cp_inputArea:hover {border-color: #1F67B9 !important;}'
	+
	'.NotificationBase textarea {border: 1px solid #114F9F !important; color: #90C1E0 !important;}'
	+
	'.NotificationBase button, .NotificationBase input[type="button"] {border: 1px solid #2D60C8 !important;}'
	+
	'.NotificationBase input.default {background-color: #094AB2 !important; color: #9CBEDB !important;}'
	+
	'.NotificationBase input[type="button"] {background-color: #062E62 !important; border: 1px solid rgb(45, 96, 200) !important; color: #9CABC8 !important;}'
	+
	'.cpv2 .cp_clist {background: #1658AE !important;}'
	+
	'.NotificationBase .emailContent .t_bci, .NotificationBase .emailContent .t_blc, .NotificationBase .sd_contact_picker .t_bci, .NotificationBase .sd_contact_picker .t_blc {background-color: #064083 !important;}'
	+
	'.NotificationBase .emailContent .CL_Highlight .t_elnk.CL_Matched_Text, .NotificationBase .emailContent .cpv2 .CL_Highlight, .NotificationBase .emailContent .cpv2 .CL_Highlight div, .NotificationBase .sd_contact_picker .CL_Highlight .t_elnk.CL_Matched_Text, .NotificationBase .sd_contact_picker .cpv2 .CL_Highlight, .NotificationBase .sd_contact_picker .cpv2 .CL_Highlight div, .cpv2 .CL_Row {color: #91C0E9 !important;}'
	+
	'.cpv2 .cp_Contact a {color: #96C3E4 !important;}'
	+
	'.DetailsHeader-cell.isSortable:hover .DetailsHeader-cell .cellMenuLink.is-focused, .DetailsHeader-cell .cellText.is-focused, .od-focus--enabled .DetailsHeader-cell .cellText.is-focused {box-shadow: 0px 0px 0px 1px #22598F inset !important; background: #174A96 !important;}'
	+
	'.DetailsHeader {border-bottom: 1px solid #0E399F !important;}'
	+
	'.DetailsRow.is-selected {background: #0D3F77 !important; color: #99C1DB !important;}'
	+
	'.ms-ModalOverlay {background-color: rgba(10, 28, 53, 0.75) !important;}'
	+
	'.o365cs-nav-contextMenu {background-color: #0C4484 !important; border-left: 1px solid #2C69C5 !important; border-right: 1px solid #2C69C5 !important; border-bottom: 1px solid #2C69C5 !important; box-shadow: 0px 0px 10px rgba(4, 15, 33, 0.74) !important;}'
	+
	'.o365cs-base .ms-bcl-nl, .o365cs-base .ms-bcl-nl-h:hover {border-color: #073760 !important;}'
	+
	'.o365cs-base .ms-fcl-b, .o365cs-base .ms-fcl-b-h:hover {color: #A4CCE9 !important;}'
	+
	'.o365cs-base .ms-bgc-nl, .o365cs-base .ms-bgc-nl-h:hover {background-color: #0B2F57 !important;}'
	+
	'.o365cs-base .ms-bgc-nl, .o365cs-base .ms-bgc-nl-h:hover {background-color: #095EA7;}'
	+
	'.StorageInfo-leftNav {border-right: 1px solid #11387D !important; background-color: #0B2047 !important;}'
	+
	'.ProgressBar-track {background-color: #253242 !important;}'
	+
	'.StorageInfo-plans-list tr:last-child .StorageInfo-plans-row-divider {border-color: #184587 !important;}'
	+
	'.lg .StorageInfo-plans, .xlg .StorageInfo-plans, .xxlg .StorageInfo-plans, .xxxlg .StorageInfo-plans {color: #AFD0EC !important;}'
	+
	'.StorageInfo-plans-type-text, .StorageInfo-title {color: #358CE1 !important;}'
	+
	'html[dir="ltr"] .StorageInfo-leftNav {border-right: 1px solid #16468F !important;}'
	+
	'.StorageInfo-leftNav, .c_ln, .t_lnkpi {background-color: #0B2047 !important;}'
	+
	'.c_n li.active > .link, .c_n li.active > a {background: #1C5EB4 !important;}'
	+
	'.t_lnkpi a {color: #89BDE3 !important;}'
	+
	'.c_ln h2 {color: #57A1E9 !important;}'
	+
	'#c_content {background: #020B18 !important;}'
	+
	'body#options {color: #A8D4F0 !important; background-color: #134F93 !important;}'
	+
	'.c_hcnlto .c_c, .c_hcnlto .c_cme {background-color: #093B93 !important;}'
	+
	'.spm table {color: #99BEE7 !important;}'
	+
	'.spm table tr.spmNote td {border-bottom: 1px solid #165A93 !important; color: #4E94C0 !important;}'
	+
	'.spm table {border-color: #21578D !important;}'
	+
	'.spm table td, .spm table th {border-bottom: 1px solid #1A51A5 !important;}'
	+
	'.uo_total {color: #3D78D8 !important;}'
	+
	'.c_n .link:hover, .c_n a:hover {background: #1C5EB4 !important;}'
	+
	'.t_lnkpi a:hover {color: rgba(209, 235, 255, 1) !important;}'
	+
	'#uxp_ftr_control {border-top: 1px solid #093671 !important; color: #A8C9E4 !important; background-color: #07295C !important;}'
	+
	'#uxp_ftr_control ul li span {color: #469AE1 !important;}'
	+
	'.t_lnksi a {color: #9DCDF6 !important;}'
);