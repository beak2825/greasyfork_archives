// ==UserScript==
// @name         GAS Dark Theme | Google Apps Script
// @namespace    https://t.me/yevhen_g_feedback
// @version      0.5
// @description  Dark theme for Google Apps Script Web IDE
// @author       i_muhozhuk
// @license      MIT
// @match        https://script.google.com/home/projects/*
// @icon         https://ssl.gstatic.com/images/icons/product/script_chrome_only-256.png
// @iconURL      https://ssl.gstatic.com/images/icons/product/script_chrome_only-256.png
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/443815/GAS%20Dark%20Theme%20%7C%20Google%20Apps%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/443815/GAS%20Dark%20Theme%20%7C%20Google%20Apps%20Script.meta.js
// ==/UserScript==

const textMainColor = 'rgb(200 200 200)'
const textInActiveColor = 'rgb(100 100 100)'
const textActiveColor = 'rgb(33 150 243)' //rgb(26 115 232)
const backgroundMainColor = 'rgb(20 20 20)'
const backgroundMainColorActive = 'rgb(42 42 42)'
const borderColor = 'Dimgrey'

//////////////////// body
GM_addStyle(` body { background-color: ` + backgroundMainColor + ` !important; color: ` + textMainColor + ` !important; }  `);


//////////////////// header
GM_addStyle(`  .gb_na, .gb_oa, .gb_pa, .gb_ua { background: ` + backgroundMainColor + ` !important; }  `); // Top background
GM_addStyle(`  .UGZzee { color: #2196f3 !important; }   `); // project name
GM_addStyle(`  .Gn5yxe { background: #28394f !important; }   `); // deploy button


//////////////////// Deploy popup window
GM_addStyle(`  .dF8OKd.dF8OKd .VfPpkd-k2Wrsb { color: ` + textMainColor + ` !important; }  `); // text New deployment
GM_addStyle(`  .rVN4tc { color: ` + textMainColor + ` !important; }  `); // text _Select type_ _Configuration_
GM_addStyle(`  .OR6HJc { color: ` + textMainColor + ` !important; }  `); // text _Please select a deployment type_
GM_addStyle(`  .Dkym0 .VfPpkd-StrnGf-rymPhb-b9t22c { color: ` + textMainColor + ` !important; }  `); // Left part with selected deploymeny types
GM_addStyle(`  .UqoNDb { color: ` + textMainColor + ` !important; }   `); // right part Sections headlines
GM_addStyle(`  .VfPpkd-O1htCb-OWXEXe-INsAgc .VfPpkd-TkwUic.VfPpkd-NSFCdd-i5vt6e-OWXEXe-mWPk3d .VfPpkd-NLUYnc-V67aGc-OWXEXe-TATcMc-KLRBe,
    .VfPpkd-O1htCb-OWXEXe-INsAgc .VfPpkd-TkwUic .VfPpkd-NSFCdd-i5vt6e-OWXEXe-mWPk3d .VfPpkd-NLUYnc-V67aGc-OWXEXe-TATcMc-KLRBe
    { color: ` + textMainColor + ` !important; }  `); // inactive field titles
GM_addStyle(`  .ReCbLb:not(.VfPpkd-O1htCb-OWXEXe-OWB6Me).VfPpkd-O1htCb-OWXEXe-XpnDCe .VfPpkd-NLUYnc-V67aGc { color: ` + textActiveColor + ` !important; }  `); // active field titles
GM_addStyle(`  .ReCbLb:not(.VfPpkd-O1htCb-OWXEXe-OWB6Me) .VfPpkd-uusGie-fmcmS { color: ` + textMainColor + ` !important; }  `); // field values
GM_addStyle(`  .VfPpkd-xl07Ob-XxIAqe { background-color: ` + backgroundMainColor + ` !important; }  `); // dropdown list - inactive line background
GM_addStyle(`  .s8kOBc .VfPpkd-StrnGf-rymPhb { color: ` + textMainColor + ` !important; }  `); // dropdown list - inactive item text
GM_addStyle(`  .s8kOBc .VfPpkd-StrnGf-rymPhb .VfPpkd-StrnGf-rymPhb-ibnC6b.VfPpkd-StrnGf-rymPhb-ibnC6b-OWXEXe-gk6SMd { background-color: ` + backgroundMainColorActive + ` !important; }  `); // dropdown list - active line background
GM_addStyle(`  .s8kOBc .VfPpkd-StrnGf-rymPhb .VfPpkd-StrnGf-rymPhb-ibnC6b-OWXEXe-gk6SMd { color: ` + textMainColor + ` !important; }  `); // dropdown list - active item text
GM_addStyle(`  .WdTuBd { background: #343434 !important; }  `); // text _This can also be used a library._
GM_addStyle(`  .ei1fj  { color: ` + textMainColor + ` !important; }  `); // description of the library and additions
GM_addStyle(`  .z80M1.N2RpBe::before { border-right: 2px solid ` + textMainColor + ` !important; border-bottom: 2px solid ` + textMainColor + ` !important; }  `); // checkmarks on selected deployment types

//// Manage deployments
GM_addStyle(`  .P2Hi5d { color: ` + textMainColor + ` !important; }  `); // left part. Active and archived deployment names
GM_addStyle(`  .cfWmIb:not(.VfPpkd-fmcmS-yrriRe-OWXEXe-OWB6Me) .VfPpkd-fmcmS-wGMbrd { color: ` + textMainColor + ` !important; }  `); // Description field value enabled
GM_addStyle(`  .ReCbLb.VfPpkd-O1htCb-OWXEXe-OWB6Me .VfPpkd-uusGie-fmcmS { color: ` + textInActiveColor + ` !important; }  `); // Version field value disabled
GM_addStyle(`  .cfWmIb.VfPpkd-fmcmS-yrriRe-OWXEXe-OWB6Me .VfPpkd-fmcmS-wGMbrd { color: ` + textInActiveColor + ` !important; }  `); // Description field value disabled
GM_addStyle(`  .htsTJ { color: ` + textMainColor + ` !important; }  `); // text Google Workspace Add-on
GM_addStyle(`  .FjocWc { color: ` + textMainColor + ` !important; background: ` + backgroundMainColor + ` !important;}  `); // unselected field title Deployments
GM_addStyle(`  .uDEFOc.nnGvjf .FjocWc { color: ` + textActiveColor + ` !important; }  `); // selected field title Deployments
GM_addStyle(`  .sL3KDe { color: ` + textMainColor + ` !important; }  `); // field value Deployments
GM_addStyle(`  .Xw7Kb .VfPpkd-StrnGf-rymPhb-b9t22c { color: ` + textMainColor + ` !important; }  `); // text dropdown list


//////////////////// left frame with icons and titles of tab names
GM_addStyle(`  .td5WLe { background-color: ` + backgroundMainColor + ` !important; border-right: 1px solid ` + borderColor + ` !important;}  `); // left vertical frame - tab names background and dividing line
GM_addStyle(`  .ZHQ5U.ZHQ5U { border-top: 1px solid ` + borderColor + ` !important;}  `); // dividing line horizontal under the name of the project
GM_addStyle(`  .LDouke { border-left: 1px solid  ` + borderColor + ` !important;}  `); // left vertical frame - dividing line vertical to the left of the code window
GM_addStyle(`  .voS0mf { border-bottom: 1px solid  ` + borderColor + ` !important;}  `); // left vertical frame - dividing line vertical above the window with the code
GM_addStyle(`  .hmN6tf { border-bottom: 1px solid ` + borderColor + ` !important;}  `); // left vertical frame - dividing line under Files and Services
GM_addStyle(`  .GLLFQe:not(:first-child) { border-top: 1px solid  ` + borderColor + ` !important;}  `); // left vertical frame - dividing line above Libraries
GM_addStyle(`  .R5rHwb { color: ` + textMainColor + ` !important; }  `); // unactive tab title background
GM_addStyle(`  .hcgnWc::before { background-color: ` + textInActiveColor + ` !important; }  `); // active tab title background
GM_addStyle(`  .kcW8jf:hover::before { background-color: ` + backgroundMainColorActive + ` !important; }  `); // hover tab title background
GM_addStyle(`  .hcgnWc .b7QOjc, .hcgnWc .R5rHwb, .hcgnWc:hover .b7QOjc, .hcgnWc:hover .R5rHwb, .hcgnWc:focus .b7QOjc, .hcgnWc:focus .R5rHwb { color: ` + backgroundMainColor + ` !important; }  `); // tab icon current active
GM_addStyle(`  .kcW8jf:hover .b7QOjc, .kcW8jf:hover .R5rHwb, .kcW8jf:focus .b7QOjc, .kcW8jf:focus .R5rHwb { color: ` + textActiveColor + ` !important; }  `); // tab icon and tab names HOVER:


//////////////////// tab Overview
GM_addStyle(` .DqxlK { color: ` + textMainColor + ` !important; }  `); // text _Project Details_
GM_addStyle(` .Hjavoc, .ISlbqe { color: ` + textMainColor + ` !important; }  `); // text upper part of the tab Overview
GM_addStyle(` .JJYS0b.VfPpkd-AznF2e-OWXEXe-auswjd .VfPpkd-jY41G-V67aGc { color: ` + textMainColor + ` !important; }  `); // tabs _All_ _Head_

GM_addStyle(`  .z9lUof { background-color: ` + backgroundMainColor + ` !important; }  `); // Summaru
GM_addStyle(`  .Y7MQLd { background-color: ` + backgroundMainColor + ` !important; }  `); // Health chart


//////////////////// tab Editor
GM_addStyle(`  .y2Opbf { color: ` + textMainColor + ` !important; }  `); // headlines _Files Libraries Services_
GM_addStyle(`  .StrnGf-VfPpkd-rymPhb { color: ` + textMainColor + ` !important; }  `); // file names
GM_addStyle(`  .asc_FolderRoot { background: ` + backgroundMainColor + ` !important; }  `); // file names background
GM_addStyle(`  .UeVsd { color: ` + textActiveColor + ` !important; background: ` + backgroundMainColorActive + ` !important; }  `); // file names highlited
GM_addStyle(` .rgrYqe:hover .VfPpkd-kBDsod, .rgrYqe.u3bW4e .VfPpkd-kBDsod, .rgrYqe.iWO5td .VfPpkd-kBDsod { color: ` + textMainColor + ` !important;}  `); // plus icon (create a new File on the left)
GM_addStyle(` .wIlPPc:hover .VfPpkd-kBDsod, .wIlPPc.u3bW4e .VfPpkd-kBDsod, .wIlPPc.iWO5td .VfPpkd-kBDsod { color: ` + textMainColor + ` !important;}  `); // plus icon (create a new Libraries and Services on the left)
GM_addStyle(` .z80M1 { color: ` + textMainColor + ` !important;}  `); // dropdown menu to create new Script file or HTML file
GM_addStyle(` .z80M1.FwR7Pc { background-color: ` + backgroundMainColorActive + ` !important;}  `); // active dropdown menu to create new Script file or HTML file
GM_addStyle(` .JAPqpe, .z80M1 { background: ` + backgroundMainColor + ` !important;}  `); // background active dropdown menu to create new Script file or HTML file

//// file options
GM_addStyle(`  .DPvwYc { color: ` + textMainColor + ` !important }  `); // three dots icon (Kebab menu or More options icon)
GM_addStyle(`  .z80M1.RDPZE { color: ` + textInActiveColor + ` !important; }  `); // file context menu Inactive item
GM_addStyle(`  .cC1eCc .VfPpkd-P5QLlc { background-color: ` + backgroundMainColor + ` !important; }  `); // Message box Delete File
GM_addStyle(`  .T3JSJe.T3JSJe .VfPpkd-k2Wrsb { color: Coral !important; }  `); // Message box delete file - Title
GM_addStyle(`  .cC1eCc .VfPpkd-cnG4Wd { color: ` + textMainColor + ` !important; }  `); // Message box delete file - message text

//// actions bar
GM_addStyle(`  .IVKqHd.kQidhf[disabled] .VfPpkd-kBDsod { color: ` + textInActiveColor + ` !important; }  `); // undo redo save run buttons disabled
GM_addStyle(`  .IVKqHd.kQidhf .VfPpkd-kBDsod { color: ` + textMainColor + ` !important; }  `); // undo redo save run buttons enabled
GM_addStyle(`  .IVKqHd.kQidhf:hover .VfPpkd-kBDsod { color: ` + textActiveColor + ` !important; }  `); // undo redo save run buttons enebled hover

GM_addStyle(`  .VfPpkd-LgbsSe { color: ` + textMainColor + ` !important; }  `); // run debug execute journal text
GM_addStyle(`  .LjDxcd:hover:not(:disabled), .LjDxcd.VfPpkd-ksKsZd-mWPk3d-OWXEXe-AHe6Kc-XpnDCe:not(:disabled),
               .LjDxcd:not(.VfPpkd-ksKsZd-mWPk3d):focus:not(:disabled), .LjDxcd:active:not(:disabled) { color: ` + textActiveColor + ` !important; }  `); // on HOVER: run debug execute journal text

GM_addStyle(`  .jgvuAb.iWO5td .ncFHed { background-color: ` + backgroundMainColor + ` !important; }  `); // function name dropdown text background-color
GM_addStyle(`  .VsRsme .vRMGwf, .Q45Bi { color: ` + textMainColor + ` !important; }  `); // function name dropdown text color

GM_addStyle(`  .ncFHed .MocG8c.KKjvXb { background-color: ` + backgroundMainColorActive + ` !important; color: ` + textMainColor + ` !important; }  `); // function name dropdown text background HOVER
GM_addStyle(`  .kPlv1.kPlv1, .kPlv1:focus:not(:disabled), .kPlv1:hover:not(:disabled) { background-color: ` + backgroundMainColorActive + ` !important; }  `); // _Execution log_ button checked background-color

GM_addStyle(`  .oLvPce { color: ` + textMainColor + ` !important; }  `); // text _Execution log_ the one under the code
GM_addStyle(`  .ptNZqd { background-color: ` + backgroundMainColor + ` !important; color: ` + textMainColor + ` !important; } `); // Execution log
GM_addStyle(`  .Vod31b { color: ` + textMainColor + ` !important; } `); // text _To view logs, select a function and click the "Run" button in the toolbar._
GM_addStyle(`  .E1XeTd { background-image: linear-gradient(#000f 0%,#202020 10%,#0000 100%),linear-gradient(#fff1,#00000001); } `); // Execution log gradient background
GM_addStyle(`  .fHhrY.ptNZqd:not(:first-child), .ptNZqd+.fHhrY { border-top: 1px solid ` + borderColor + ` !important; } `); // Execution log - horizontal lines
GM_addStyle(`  .fHhrY { color: ` + textMainColor + ` !important; } `); // text Notice output lines

GM_addStyle(`  .IVKqHd.C9y3Me .TQNnQ { fill: ` + textMainColor + ` !important; }  `); // debug icon
GM_addStyle(`  .IVKqHd.C9y3Me:hover .TQNnQ { fill: LightGrey !important; }  `); // debug icon on HOVER
GM_addStyle(`  .VsRsme .e2CuFe, .VsRsme.u3bW4e .e2CuFe { border-color: ` + textMainColor + ` transparent !important; }  `); // dropdown menu of functions selection icon
GM_addStyle(`  .VsRsme:hover .e2CuFe, .VsRsme.u3bW4e .e2CuFe { border-color: LightGrey transparent !important; }  `); // dropdown menu of functions selection icon on HOVER

// Debugger
GM_addStyle(`  .nNP6Nb { color: ` + textMainColor + ` !important; }  `); // Header Debugger
GM_addStyle(`  .tZBfzd { color: ` + textMainColor + ` !important; }  `); // Header Call stack Variables
GM_addStyle(`  .gu6X1e { background-image: linear-gradient(#000f 0%,#000f 10%,#0000 100%),linear-gradient(#fff1,#00000001); !important; }  `); // gradient background
GM_addStyle(`  .sxNWcf { color: ` + textMainColor + ` !important; }  `); // functions text
GM_addStyle(`  .NFrsBd.NFrsBd { color: ` + textMainColor + ` !important; }   `); // function name
GM_addStyle(`  .rmCevc { color: #aa57f3 !important; }  `); // functions text
GM_addStyle(`  .iW53ef { color: lightgreen !important; }  `); // string variable color


//////////////////// code frame text colors
GM_addStyle(`  .monaco-editor, .monaco-editor-background, .monaco-editor .inputarea.ime-input { background-color: ` + backgroundMainColor + ` !important; }  `); // background
GM_addStyle(`  .monaco-editor .margin { background-color: ` + backgroundMainColor + ` !important; }  `); // line numbers background
GM_addStyle(`  .monaco-editor .line-numbers.active-line-number { color: LightGrey !important; }  `); // active line number

GM_addStyle(` .mtk11 { color: #888888 !important; } `); // single line comment
GM_addStyle(` .mtk12 { color: #888888 !important; } `); // multi line comment
GM_addStyle(` .mtk19 { color: #cc7832 !important; } `); // declaration and conditional statement keyword
GM_addStyle(` .mtk17 { color: #cc7832 !important; } `); // declaration and conditional statement keyword
GM_addStyle(` .mtk16 { color: #b589cc !important; } `); // variable name
GM_addStyle(` .mtk31 { color: #ffc66d !important; } `); // class
GM_addStyle(` .mtk1 { color: #bbbbbb !important; } `); // operator and parentheses
GM_addStyle(` .mtk7 { color: #6a8759 !important; } `); // text
GM_addStyle(` .mtk15 { color: #b589cc !important; } `); // Angle Brackets
GM_addStyle(` .mtk4 { color: #4dc8ff !important; } `); // html
GM_addStyle(` .mtk5 { color: #729fc0 !important; } `); // href
GM_addStyle(` .mtk3 { color: #888888 !important; } `); // <!DOCTYPE

// unused var
GM_addStyle(` .squiggly-inline-unnecessary {
    opacity: 0.7;
    text-decoration-line: underline;
    text-decoration-style: wavy;
} `);

// links on used var head
GM_addStyle(` .monaco-editor .peekview-widget .head {
    color: #b589cc !important;
    background-color: #1b1b1b !important;
} `);

// links on used var head links text
GM_addStyle(` .monaco-editor .peekview-widget .head .peekview-title .filename {
    color: #LightBlue !important;
} `);

//// area borders, cursor, selected text, block quotes... code frame

GM_addStyle(` .monaco-editor .view-overlays .current-line { border: 2px solid #333333 !important; }  `);

GM_addStyle(` .monaco-editor .selected-text { background-color: #ffdd00 !important; }

.monaco-editor .focused .selectionHighlight { background-color: rgba(225, 239, 252, 0.2) !important; color: #ffffff !important;}
.monaco-editor .selectionHighlight { background-color: rgba(200, 200, 255, 0.15) !important; }

.monaco-editor .focused .selected-text { background-color: rgba(173, 214, 255, 0.3) !important; }
.monaco-editor .selected-text { background-color: #e5ebf1 !important; }

.monaco-editor .cursors-layer .cursor { background-color: #cccccc !important; border-color: #cccccc !important; color: #ffffff !important; }

.monaco-editor .bracket-match { background-color: rgba(150, 150, 0, 0.2) !important; }
.monaco-editor .bracket-match { border: 1px solid #777700 !important; }

.monaco-editor .lines-content .cigr { box-shadow: 1px 0 0 0 ` + backgroundMainColorActive + ` inset !important; }
.monaco-editor .lines-content .cigra { box-shadow: 1px 0 0 0 ` + borderColor + ` inset !important; }
.monaco-editor .line-numbers { color: ` + textInActiveColor + ` !important; }

.monaco-editor .contentWidgets .codicon.codicon-light-bulb { background-color: ` + backgroundMainColor + ` !important; }
`); // Top background



//////////////////// Triggers tab
GM_addStyle(` .N3bjuf { background-color: ` + backgroundMainColor + ` !important; }  `); // Triggers Headline text background
GM_addStyle(` .dcch3 { color: ` + textActiveColor + ` !important;}  `); // Triggers Headline text
GM_addStyle(` .Od4E9e { color: ` + textMainColor + ` !important;}  `); // text _No results_
GM_addStyle(` .ksBjEc:not(:disabled) { color: ` + textActiveColor + ` !important;}  `); // text of link button _create a new trigger_
GM_addStyle(` .ksBjEc:hover:not(:disabled) { color: ` + textMainColor + ` !important;}  `); // hover: text of link button _create a new trigger_

GM_addStyle(`  .XEfnH:hover:not(.Uathie), .XEfnH:focus:not(.Uathie), .XEfnH[aria-selected=true] { background-color: ` + backgroundMainColorActive + ` !important;}  `); // selected trigger row background
GM_addStyle(`  .SBFkwd { background: ` + backgroundMainColor + ` !important; border-top: 1px solid ` + borderColor + ` !important; } `); // lower left corner - number of rows on page and dividing line
GM_addStyle(`  .MocG8c { color: ` + textMainColor + ` !important;}  `); // lower left corner - Rows per page: number
GM_addStyle(`  .e2CuFe { ` + textMainColor + ` transparent;
    border-top-color: ` + textMainColor + `;
    border-right-color: transparent;
    border-bottom-color: ` + textMainColor + `;
    border-left-color: transparent;}  `); // number of rows on page - dropdown arror icon
GM_addStyle(`  .ncFHed { background: ` + backgroundMainColor + ` !important; } `); // lower frame - number of rows on page - dropdown
GM_addStyle(`  .OaLLmb .mUbCce.RDPZE .Ce1Y1c { color: ` + textMainColor + ` !important; } `); // lower frame - number of rows on page - pagination icons

//// Add Trigger message box
GM_addStyle(`  .g3VIld { background-color: ` + backgroundMainColor + ` !important; }  `); // Add Trigger

//// filter bar
GM_addStyle(` .wYnUv { color: ` + textActiveColor + ` !important; }   `); // filter bar initial text and plus icon
GM_addStyle(` .PK2PH { color: ` + textActiveColor + ` !important; }   `); // filter bar initial text
GM_addStyle(` .PK2PH { border: 1px dashed ` + textMainColor + ` !important; }   `); // filter bar dashed border
GM_addStyle(` .HDWFpc { background: ` + backgroundMainColorActive + ` !important; }   `); // filter bar dashed border


//////////////////// Executions
GM_addStyle(` .Y1Vbl { color: ` + textMainColor + ` !important; }  `); // Executions headline
GM_addStyle(` .ZBGfLd { background-color: ` + backgroundMainColor + ` !important; color: ` + textMainColor + ` !important; }  `); // Executions headline
GM_addStyle(` .AwADOd .nfFC5c { background-color: ` + backgroundMainColor + ` !important; color: ` + textMainColor + ` !important; }  `); // Table header
GM_addStyle(` .CtOYUe { background-color: ` + backgroundMainColor + ` !important; }  `); // tabular section without header
GM_addStyle(` .nN3Fac { background-color: rgb(0 0 0 / 38%); color: rgb(230 112 104) !important; }  `); // error text and background
GM_addStyle(` .HkUAA { color: ` + textMainColor + ` !important; }  `); // error text funk name
GM_addStyle(` .fHhrY:focus { background: Black !important;}  `); // error text FOCUS
GM_addStyle(` .bJ65Td { color: ` + textMainColor + ` !important;}  `); // text _No results_
GM_addStyle(` .Iqn3ce { color: ` + textInActiveColor + ` !important; }   `); // text _Try adjusting your filter criteria._

//// filter
GM_addStyle(` .QXubtf .jBmls { background-color: ` + backgroundMainColor + ` !important; }  `); // filter dropdown list
GM_addStyle(` .VOEIyf, .VOEIyf .jBmls, .oKubKe  { color: ` + textMainColor + ` !important; }  `); // filter dropdown list
GM_addStyle(` .oKubKe[aria-selected="true"] { background-color: ` + backgroundMainColorActive + ` !important; color: ` + textMainColor + ` !important;}  `); // filter dropdown list active item


//////////////////// Project Settings
GM_addStyle(` .hz7xXd { color: ` + textMainColor + ` !important; }   `); // Headline
GM_addStyle(` .HTsFI { color: ` + textMainColor + ` !important; }   `); // subtitles
GM_addStyle(` .HjuXVb { color: ` + textMainColor + ` !important; }   `); // Settings description
GM_addStyle(` .MlG5Jc { color: ` + textMainColor + ` !important; }   `); // Settings opions
