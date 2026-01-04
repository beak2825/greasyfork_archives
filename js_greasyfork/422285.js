// ==UserScript==
// @name Google Translate Dark
// @namespace Factral
// @version 1.3.6
// @description Translate Google Dark Theme
// @author Factral
// @homepageURL https://github.com/Factral/GoogleTranslateDarkTheme/
// @supportURL https://github.com/Factral/GoogleTranslateDarkTheme/issues/new/choose
// @license CC-BY-SA-4.0
// @grant GM_addStyle
// @run-at document-start
// @include https://translate.google.*/*
// @include https://translate.google.as*/*
// @include https://ogs.google.*/*
// @include https://translate.googleusercontent.*/*
// @downloadURL https://update.greasyfork.org/scripts/422285/Google%20Translate%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/422285/Google%20Translate%20Dark.meta.js
// ==/UserScript==

(function() {
let css = "";
if (location.href.startsWith("https://translate.google.")) {
  css += `
      /* More translations. Adding by Jack */
      .s0ijVb, .ydsGXd, .qt6jm { background-color: #161a1d; }
      .ydsGXd * { color: white; }
      .GAyS9e { all: unset !important; }
      .hX7wnb, .Bljmlb, .qt6jm { border-top-color: #131719 !important; }
      .U8K5nb { background-color: #363636 !important; color: #e6e6e6; }
      .jq25U {color: #bbb9b9;}

      /*backgrounds*/
      .jTj8gd.XzOhkf .a2Icud,#gb,.gb_qa .gb_Kd.gb_Sd.gb_Td,.RvYhPd.Q5Onnd, .RvYhPd.dtohSe,.RvYhPd::before,body, .frame, .ita-hwt-jfk-standard, .history-top-header .history-top-bar,.history-container .info-bar, .phrasebook-top-header, .phrasebook-container .nav-bar, .gb_fd .gb_F, .gb_3d,.RvYhPd,.MmZJl,.aCQag,.ccvoYb,.WFnNle,.I87fLc.XzOhkf,.ySES5, .myVd4c .ySES5,.yFQBKb,.kXN2zb, .zklE3, .BXabBd, .c5bTNd{
          background: #131719 !important;
      }
      .kiSRoe,.eYhTcb,.LpQB8e,.NdeSHd,.AzKM4,.B3AePc,.rJfKsc,.KskmCc,.EO28P,.KjuTac,.DNFg3e {
          background-color: #161a1d !important;
      }
      .Pt010b .a2Icud,.SMqeCb, .DLAnyc,.gb_rb.gb_rb,.UxtXRb,.ZwgMLb,.k5v5Nb,.rm1UF, .P6w8m:not(.BDJ8fb):not(.Jj6Lae),.ita-kd-dropdown-menu, .vk-box, .vk-btn, .ita-hwt-ime, .ita-hwt-buttons, .ita-hwt-candidates, .gb_Ic,.dykxn.MeCBDd.j33Gae,.oJweqc.KKjvXb,.QcsUad,.NWlwsb,.CLKk4c, .dOQF4b {
          background: #1b2022 !important;
      }
      .NBY4Kb,.j27i7,.tvua2,.uojYg,.RstnCb,.SL5JTc,.fMHXgc,  .CMhTbb {
          background: #1f2528 !important;
      }
      .tvua2:hover, .tvua2.BvgNAf {
          background-color: #181a1c !important;
      }
          
      .sUGHdf {
          background:#24292c;
      }
      .ordo2:hover,.ordo2:focus,.vk-btn.vk-sf-a,.tAzJq:hover,.kgnlhe.FwR7Pc, .MtFg0.FwR7Pc,.qSb8Pe:hover,.jCAhz.C1N51c, .jCAhz:hover,.JLqJ4b.C1N51c, .JLqJ4b:hover, .Xcmxjb.FwR7Pc {
          background-color: #353a3d !important;
      }
      .ordo2.KKjvXb,.WtlSJf.KKjvXb {
          background-color: #213342;
      }
      .JLqJ4b.C1N51c, .JLqJ4b:hover,.Xcmxjb.FwR7Pc {
          background-color: #458af9;
      }
      .QcsUad.BDJ8fb:not(.Jj6Lae),.oJweqc:hover {
          background-color: #1f2528 !important;
      }
      .gb_sa, .tVwEyf:hover:not(:disabled), .tVwEyf:focus:not(:disabled), .gt-cc-t {
          background: #1b2022 !important;
      }
      .vk-btn.vk-sf-h, .vk-btn.vk-sf-s, .ita-hwt-candidate-hover, .ita-hwt-jfk-standard.ita-hwt-jfk-hover,.WtlSJf:hover {
          background: #323639;
      }
      .ita-kd-menuitem-hover {
          background: #323639 !important;
      }
      .X4DQ0::after, .U0xwnf::after {
          background:transparent !important;
      }
      
      .Bcbxbe.FwR7Pc {
          background-color: #1e1e1e;
      }
      .ls-wrap .sugg-fade {
          background: -webkit-linear-gradient(left,rgba(255,255,255,0),#1b2022);
      }
      .ita-hwt-close {
          background-color: #e4dfdd;
      }
      .vLsFwd{
          background: transparent !important;
      }
      .jCVEDd {
          background: #22282b;
      }
          .bvzp8c{
              background-color: #161a1d !important;
          }
      
      
      
      
      
      /*bordes*/
      .jTj8gd.XzOhkf,.I87fLc.XzOhkf,.ordo2:focus, .FJCnk{
          border: 1px solid dimgray;
      }
      .LpQB8e, .iWzUVd{
          border-bottom: 1px solid #dadce00a;
      }
      .I87fLc:not(.XzOhkf) .ZShpvc,.I87fLc:not(.XzOhkf) .Dwvecf, .ZShpvc {
          border-top: 1px solid dimgray;
      }
      .jTj8gd.XzOhkf .Sp3AF,.Pt010b .Sp3AF {
          border-right: 1px solid dimgray;
      }

      .iq5YBc {
          border-bottom: 1px solid #1b2023;
      }
      
      .k5v5Nb {
          border-top: 1px solid #1b2023;
      }
      .Rj2Mlf:not(:disabled),.Rj2Mlf:hover:not(:disabled), .Rj2Mlf:active:not(:disabled)  {
         border-color: transparent !important;
      }
      .rm1UF{
       border-bottom-left-radius: 8px;
      }
      .ita-kd-dropdown-menu, .vk-box, .vk-btn, .vk-btn.vk-sf-h, .vk-btn.vk-sf-s, .ita-kd-separator, .ita-hwt-ime-st, .ita-hwt-buttons, .ita-hwt-candidates, .ita-hwt-candidate {
          border-color: #131719;
      }
      #gb {
          border-color: #1b2022;
      }
      .aCQag {
          border-bottom: 1px solid #131719;
      }
      .ccvoYb {
          border-top: 1px solid #131719;
      }
      .ySES5, .myVd4c .ySES5,.vk-btn.vk-sf-a {
          border-color: dimgray !important;
      }
      .v2OCrb,.gb_rb.gb_rb {
          border: 1px solid #dadce033;
      }

      .WFnNle,.zWtKC, .WtlSJf {
          border: 1px solid #00000040;
      }
      .gb_Bb{
          border-bottom: 1px solid #212629;
          border-top: 1px solid #212629;
      }

      
      
      /*colores de texto*/
      .VfPpkd-fmcmS-yrriRe:not(.VfPpkd-fmcmS-yrriRe-OWXEXe-OWB6Me) .VfPpkd-fmcmS-TvZj5c-OWXEXe-M1Soyc, .VfPpkd-fmcmS-yrriRe:not(.VfPpkd-fmcmS-yrriRe-OWXEXe-OWB6Me) .VfPpkd-fmcmS-TvZj5c-OWXEXe-UbuQg, .VFkSHe, .IHKo0e {
          color: #ffffff8a;
      }
      .uqiNJb,.AP34ab,.pt8wXd,.zRANPd:not(:disabled),.q6oraf .VfPpkd-rymPhb,.vxsGZ,.HswdMd,.mTQVx,.ZQWYD,.aWlm2e,.irVajb,.cfWmIb:not(.VfPpkd-fmcmS-yrriRe-OWXEXe-OWB6Me) .VfPpkd-fmcmS-wGMbrd,.aia4Ud,.ita-kd-menuitem, .vk-btn,.ita-hwt-candidate,.XMNbjd,.VK4HE:hover .dPxysd, .VK4HE:focus .dPxysd, .qTO0c:hover .dPxysd, .qTO0c:focus .dPxysd,.ordo2,.KskmCc, .AarNVd, .MXuJQd,.er8xn, .KmsAmb .tL9Q4c, .J0lOec,.uNr6ee,.fEU59c,.v2OCrb,.WFnNle,.qSb8Pe,.NqnNQd,.lRu31,.lrSgmd{
          color: #ddd !important;
      }
      .kgJkHd,.Rq5Gcb,.vk-btn.vk-sf-h,.vk-btn.vk-sf-a,.JJYS0b:hover .VfPpkd-jY41G-V67aGc, .JJYS0b:active .VfPpkd-jY41G-V67aGc, .JJYS0b:focus .VfPpkd-jY41G-V67aGc,.S6GkK,.tAzJq:hover,.kgnlhe.FwR7Pc, .MtFg0.FwR7Pc,.G3Fn7c  {
          color: white !important;
      }
      .HYAIUe{
          color: dimgray;
      }
      .ordo2.KKjvXb {
          color: #185abc;
      }
      .yUUmWd.VfPpkd-AznF2e-OWXEXe-auswjd .VfPpkd-jY41G-V67aGc {
          color: #1a73e8;
      }
      .TcXXXb, .yUUmWd .VfPpkd-jY41G-V67aGc,.JVGQzb,.VhOj3e, .nL5otb,.jCVEDd,.W5CUef,.LYeNu {
          color: #acacac !important;
      }
      .q7sDqe:not(:disabled) .VfPpkd-kBDsod, .q7sDqe:not(:disabled), .SSgGrd:not(:disabled), .xUPQqb, .RSggmb, .nYkDR, .ZTPlmc  {
          color: #a6a6a6;
      }
      .ita-kd-menuitem-hover, .ita-hwt-jfk, .phrasebook-container .language-chip,.gb_rb.gb_rb, .LjDxcd:hover:not(:disabled), .LjDxcd.VfPpkd-ksKsZd-mWPk3d-OWXEXe-AHe6Kc-XpnDCe:not(:disabled), .LjDxcd:not(.VfPpkd-ksKsZd-mWPk3d):focus:not(:disabled), .LjDxcd:active:not(:disabled)  {
          color: #ddd !important;
      }
      .notification-container .notification-body, .GR2kEe {
          color: #ffffff87;
      }
      .sl-sugg .goog-inline-block.jfk-button-checked, .tl-sugg .goog-inline-block.jfk-button-checked {
          color: #4285f4 !important;
      }
      .myVd4c .TcXXXb {
          color: #1a73e8 !important;
      }
      .qSb8Pe.KKjvXb{
          color: #185abc !important;
      }
      .yFQBKb{
          color: #ddd !important;
      }
      .Xcmxjb.FwR7Pc{
          color: transparent !important;
      }
      
      
      
      /*variados*/
      .NdeSHd{
          box-shadow: 0 -1px 3px #262728cf;
      }
      .ita-hwt-enter-img.ita-hwt-enter-img-dark.ita-kd-img.ita-hwt-enter-img-white{
          filter: invert(7%);
      }
      ::-webkit-scrollbar { width: 8px; height: 3px;}
      ::-webkit-scrollbar-track-piece { background-color: #131719;}
      ::-webkit-scrollbar-thumb { height: 50px; background-color: #666; border-radius: 3px;}
      ::-webkit-resizer { background-color: #666;}
      
      .swap>.jfk-button-img, .src-tts .jfk-button-img, .speech-button .jfk-button-img, .clear .jfk-button-img, .starbutton .jfk-button-img, .copybutton .jfk-button-img, .ttsbutton-res .jfk-button-img, .vk-t-btn, .gt-clear .jfk-button-img, .language_list_item_wrapper.item-emphasized:not(.item-selected) .language_list_item_icon, .ita-hwt-grip, .ita-kd-img, .history-top-header .close-button, .phrasebook-top-header .close-button, .gt-is-mobile .gt-is-ca, .trans-verified-button, .gt-lc.gt-lc-mobile .gt-def-num, .gt-cc-t .gt-cc-bc .big-clear-button .jfk-button-img, .gt-cc-t .gt-cc-tc .gt-ct-tts.trans-listen-button .jfk-button-img {
          filter: invert(1);
      }
      `;
}
if (location.href.startsWith("https://translate.google.as")) {
  css += `
          .Pt010b .Sp3AF{
              border-left: 1px solid dimgray;
              border-right: none !important;
          }
      `;
}
if (location.href.startsWith("https://translate.google.") || location.href.startsWith("https://ogs.google.")) {
  css += `
      .gb_qa svg, .gb_Cc svg, .gb_Zc, .gb_Oc .gb_7d,.gb_k .gb_lb {
          color:#ddd !important;
      }
      
      /* Profile chooser & Headers */
      /* Backgrounds */
      .gb_l.gb_8a.gb_9a, .gb_l.gb_9a.gb_ab, .gb_Ud, .gb_l.gb_5a,.gb_E,.gb_vb.gb_vb,.gb_Mb.gb_Mb {
          background: #131719 !important;
      }
      .gb_Ub>.gb_Tb, .gb_Rb, .gb_Eb.gb_Eb, .gb_db.gb_eb, .gb_ja, .gb_Ec.gb_oa, .gb_Mc, .gb_Qc, .gb_5e, .gb_wb.gb_wb, .gb_Ib.gb_Ib, .gb_Jb.gb_Jb   .gb_Ub>.gb_Tb:hover, .gb_l .gb_jb, .gb_kb:hover, .gb_kb:focus, .gb_kb:hover:focus,.gb_Cb.gb_Cb, .gb_Db.gb_Db  {
          background: #161a1d;
      }
      
      
      .gb_Vb>.gb_Ub:hover,.gb_ub:hover, .gb_Eb.gb_Eb:hover,  .gb_ja:hover, .gb_5e.gb_6e, .gb_wb.gb_wb:hover, .gb_Ib.gb_Ib:hover, .gb_Jb.gb_Jb:hover, .gb_Rb>.gb_Qb:hover, .gb_Qb:hover,.gb_Nb>.gb_Mb:focus,.gb_Nb>.gb_Mb:hover:focus,.gb_Nb>.gb_Mb:hover,  .gb_Db.gb_Db:hover,.gb_ub:focus, .gb_ub:hover:focus, .gb_Sb.gb_Vb:hover, .gb_Sb.gb_Vb:focus, .gb_Sb.gb_Vb:hover:focus,.gb_Mb>.gb_Lb:hover{
          background: #323639 !important;
      }
      
      
      /* Colors */
      .gb_l .gb_tb, .gb_8b, .gb_sa svg, .gb_Ic svg, .gb_9c .gb_ne, .gb_Tc .gb_ne, .gb_Cb:hover,.gb_l .gb_ub, .gb_Ab.gb_Ab, .gb_9b, .gb_sb>svg.gb_tb, .gb_Fb>svg.gb_Hb, .gb_Ib>svg.gb_Jb, .gb_Mb.gb_Mb, .gb_db.gb_eb, .gb_ta svg, .gb_Ec svg, .gb_1c .gb_ge, .gb_Qc .gb_ge, .gb_l .gb_qb, .gb_wb.gb_wb, .gb_Ib.gb_Ib, .gb_ob>svg.gb_pb, .gb_Bb>svg.gb_Cb, .gb_Db>svg.gb_Eb {
          color: #ddd;
      }
      .gb_zb.gb_zb, .gb_Db.gb_Db, .gb_Lb.gb_Lb, .gb_5e, .gb_5e.gb_6e .gb_pf, .gb_pf,.gb_0b {
          color: white !important;
      }
      .gb_cc, .gb_ac, .gb_Cb.gb_Cb, .gb_dc, .gb_bc, .gb_pf.gb_pf, .gb_l .gb_sb, .gb_7b {
          color: #ffffff87;
      }
      .gb_pf::placeholder {
          color: #ffffff87 !important;
      }
      
      /* Border colors */
      .Pt010b,.gb_zb.gb_zb, .gb_Qb, .gb_Kb, .gb_Lb.gb_Lb, .gb_Ab.gb_Ab, .gb_Rb, .gb_Mb.gb_Mb, .gb_ja, .gb_wb.gb_wb, .gb_Hb, .gb_Ib.gb_Ib, .gb_Jb.gb_Jb,.gb_Cb.gb_Cb, .gb_Db.gb_Db  {
          border-color: #1b2022;
      }
      /*
      .gb_Ab.gb_Ab:hover, .gb_Mb.gb_Mb:hover, .gb_ja:hover, .gb_wb.gb_wb:hover, .gb_Ib.gb_Ib:hover, .gb_Jb.gb_Jb:hover {
          border-color: #323639;
      }*/
      
      /* Other */
      .gb_xb::after {
          white-space: pre-line;
          color: white;
      }
      
      /*lo que he agregado peepega*/
      
      .gb_l .gb_mb,.gb_1b  {
          color:#ddd;
      }
      
      .gb_sb.gb_sb, .gb_Db.gb_Db, .gb_Eb.gb_Eb  {
          background-color: #1b2023;
          border: 1px solid #dddddd08;
      }
      
      .gb_sb:hover,.gb_sb:focus, .gb_sb:hover:focus,.gb_Mb>.gb_Lb:active, .gb_Mb>.gb_Lb:focus:active  {
          background-color: #353a3d;
      }
      
      .ita-kd-menuitem.ita-kd-menuitem-hover {
          background: #323639 !important;
          color: #ddd !important;
      }
      
      .gb_Cb {
          border-bottom: 1px solid #dddddd12;
          border-top: 1px solid #dddddd12;
      }
      
      .gb_tb {
              margin: 9px 33px;
      }
      
      .gb_5b {
          color: #acacac;
      }
      
      
      /* App launcher */
      /* Backgrounds */
      .EHzcec,.gb_l.gb_1a.gb_2a  {
          background: #131719;
          border: 1px solid #dddddd12;
      }
      .tX9u1b:hover, .NQV3m {
          background: #1b2022;
      }
      
      .tX9u1b:hover .Rq5Gcb {
          background: transparent;
      }
      .NQV3m:hover {
          background: #323739;
      }
      /* Colors */
      .Rq5Gcb, .NQV3m {
          color: white;
      }
      
      /* Border colors */
      .dGrefb, .NQV3m {
          border-color: #1b2022;
      }
      .NQV3m:hover {
          border-color: #323639;
      }
      
      
      .gb_Tb.gb_Vb {
          background-color: #1b2023;
          border: 1px solid #dadce017;
          color: #ddd;
      }
      
      
      /*ype */
      
      .gb_Cc {
          background-color: #131719;
      }
      .gb_qa a, .gb_Cc a {
          color: #ddd !important;
      }
      `;
}
if (location.href.startsWith("https://translate.googleusercontent.")) {
  css += `
      /* traduccion de documentos*/
      
      
      body, td {
          color: white;
          background: #131719;
      }
      
      ::-webkit-scrollbar { width: 8px; height: 3px;}
      ::-webkit-scrollbar-track-piece { background-color: #131719;}
      ::-webkit-scrollbar-thumb { height: 50px; background-color: #666; border-radius: 3px;}
      ::-webkit-resizer { background-color: #666;}
      
      .spinner-container, .spinner-container p  {
          background:#282d30;
          color:white;
      }
      `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
