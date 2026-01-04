// ==UserScript==
// @name        99dmg Profile Finder
// @description	Fügt Links zum schnellen Finden von Spielerprofilen ein
// @version     1.1
// @author	Lefty
// @namespace   https://github.com/leftyms
// @match       *://csgo.99damage.de/de/leagues/teams/*
// @match       *://csgo.99damage.de/de/users/*
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34154/99dmg%20Profile%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/34154/99dmg%20Profile%20Finder.meta.js
// ==/UserScript==

jQuery.noConflict()(function($) {
	"use strict";
	//Steam
	const STEAM_ICON_BASE64 = "AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAQAEAAAAAAAAAAAAAAAEAAAAAAAB1c3QAm6yhAFFWUwDA1cgAtra2ALm/vACPlpEAfHx8AGtvbQCMjIwAXltdAMXKxwANCQwAHBsbAP///wAJBgcA////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHw8PDw8PDw8PDw8PDw8PHw8PDwcLCwANDw8PDw8PDw8PDwoODQ0DAA8PDw8PDw8PDwoDCgQEDQMPDw8PDw8PDwEODg4ODg0ODw8PDw8PDw8ODg4ODg4NDgsNDw8PDw8PDg4ODg4NBQ4ODgAPDw8PDw4OAAAFDg4ODg4ODgYNDw8CDw8PDw0ODg4ODg4ODgoPDw8PDw8PCQ4OBAwMDAgODw8PDw8PDw8DDgwBDgENDgoPDw8PDw8PAg4MDg4ODA4KDw8PDw8PDw0ODAEOAQ0ODw8PDw8PDw8NCw4MDAwOCw8PDw8PDw8PDwILDg4OCwwPHw8PDw8PDw8PDQ0CDQ8PH4ABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIABAAA=";
	const STEAM_ICON = createIcon(STEAM_ICON_BASE64);
	const STEAM_URL_PLAYER = "https://steamcommunity.com/search/users/#text=";
	const STEAM_URL_TEAM = "https://steamcommunity.com/search/groups/#text=";
	const STEAM_TITLE = "Steam-Suche";
	
	//FaceIt
	const FI_ICON_BASE64 = "AAABAAIAEBAAAAEAIABoBAAAJgAAACAgAAABACAAqBAAAI4EAAAoAAAAEAAAACAAAAABACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADA0L/wwNC/8MDQv/DA0L/wsMCv8MDQv/DQ4M/w0ODP8NDgz/DQ4M/wwNC/8LDAr/DA0L/wwNC/8MDQv/DA0L/wwNC/8MDQv/CwwK/wwNC/8ODw3/EBEP/xESEP8SExH/EhMR/xESEP8QEQ//Dg8N/wwNC/8LDAr/DA0L/wwNC/8MDQv/CwwK/wwNC/8PEA7/EhMR/xQVE/8VFhT/FRYU/xYXFf8VFhT/FBUT/xITEf8PEA7/DA0L/wsMCv8MDQv/CwwK/wwNC/8PEA7/EhMR/xUWFP8XGBb/GBkX/xkaGP8ZGhj/GBkX/xcYFv8VFhT/DyZF/wk0c/8MDQv/DA0L/wsMCv8ODw3/EhMR/xUWFP8XGBb/GRoY/xobGf8bHBr/Gxwa/xkhKv8POnv/BFfV/wBl/v8EUcX/Dg8N/wsMCv8MDQv/EBEP/xQVE/8XGBb/GRoY/xscGv8cHh3/Fi9W/wpJrv8BYPb/AGL+/wBi/v8AYv7/BE/F/xARD/8MDQv/DQ4M/xESEP8VFhT/GBkX/xgiMv8PO4j/BFTe/wBc/P8AXPz/AFz8/wBc/P8AXPz/AFz8/wVLxP8REhD/DQ4M/w0ODP8SExH/Dytg/wdEuv8AVvn/AFf8/wBX/P8AV/z/AFf8/wBX/P8AV/z/AFf8/wBX/P8FR8T/EhMR/w0ODP8NDgz/EhMR/xYXF/8ZGhv/Gx0d/x0eH/8eICD/HyEh/x8hIf8eICD/GyY2/wxk8f8Laf7/DlXG/xITEf8NDgz/DQ4M/xESEP8VFhT/GBkX/xscGv8cHRv/Hh8d/x4fHf8eHx3/Hh8d/xwdG/8UO3f/CWf+/wxTxv8REhD/DQ4M/wwNC/8QEQ//FBUT/xcYFv8ZGhj/Gxwa/xwdG/8dHhz/HR4c/xwdG/8bHBr/GRsa/wpRxf8IUMX/EBEP/wwNC/8LDAr/Dg8N/xITEf8VFhT/FxgW/xkaGP8bHBr/Gxwa/xscGv8aGxn/GRoY/xcYFv8SITf/B0u9/w4PDf8LDAr/CwwK/wwNC/8PEA7/EhMR/xUWFP8XGBb/GBkX/xkaGP8ZGhj/GBkX/xcYFv8VFhT/EhMR/wwhQv8MDQv/DA0L/wwNC/8LDAr/DA0L/w8QDv8SExH/FBUT/xUWFP8VFhT/FRYU/xUWFP8UFRP/EhMR/w8QDv8MDQv/CwwK/wwNC/8MDQv/DA0L/wsMCv8MDQv/Dg8N/xARD/8REhD/EhMR/xITEf8REhD/EBEP/w4PDf8MDQv/CwwK/wwNC/8MDQv/DA0L/wwNC/8MDQv/CwwK/wsMCv8MDQv/DQ4M/w0ODP8NDgz/DQ4M/wwNC/8LDAr/CwwK/wwNC/8MDQv/DA0L/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoAAAAIAAAAEAAAAABACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADA0L/wwNC/8MDQv/DA0L/wwNC/8MDQv/DA0L/wwNC/8MDQv/DA0L/wsMCv8LDAr/DA0L/wwNC/8MDQv/DA0L/wwNC/8MDQv/DA0L/wwNC/8LDAr/CwwK/wsMCv8MDQv/DA0L/wwNC/8MDQv/DA0L/wwNC/8MDQv/DA0L/wwNC/8MDQv/DA0L/wwNC/8MDQv/DA0L/wwNC/8MDQv/DA0L/wsMCv8LDAr/DA0L/w0ODP8ODw3/Dg8N/w4PDf8PEA7/DxAO/w8QDv8ODw3/Dg8N/w0ODP8MDQv/DA0L/wsMCv8MDQv/DA0L/wwNC/8MDQv/DA0L/wwNC/8MDQv/DA0L/wwNC/8MDQv/DA0L/wwNC/8MDQv/DA0L/wsMCv8LDAr/DA0L/w0ODP8PEA7/DxAO/xARD/8QEQ//ERIQ/xESEP8REhD/ERIQ/xARD/8QEQ//DxAO/w4PDf8NDgz/DA0L/wsMCv8LDAr/CwwK/wwNC/8MDQv/DA0L/wwNC/8MDQv/DA0L/wwNC/8MDQv/DA0L/wwNC/8LDAr/DA0L/w0ODP8ODw3/EBEP/xESEP8REhD/EhMR/xITEf8TFBL/ExQS/xMUEv8TFBL/EhMR/xITEf8REhD/ERIQ/xARD/8ODw3/DQ4M/wwNC/8LDAr/CwwK/wwNC/8MDQv/DA0L/wwNC/8MDQv/DA0L/wwNC/8MDQv/CwwK/wwNC/8ODw3/DxAO/xARD/8REhD/EhMR/xMUEv8UFRP/FBUT/xUWFP8VFhT/FRYU/xUWFP8UFRP/FBUT/xMU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QP8KZvf/Cmn+/wpp/v8Kaf7/D0CN/xITEf8QEQ//Dg8N/wwNC/8LDAr/Dg8N/xARD/8SExH/FBUT/xUWFP8XGBb/GBkX/xobGf8bHBr/HB0b/x0eHP8dHhz/Hh8d/x4fHf8eHx3/Hh8d/x4fHf8eHx3/HR4c/xwdG/8cHRv/Gxwa/xFAiv8IZv7/CGb+/whm/v8OP43/EhMR/xARD/8ODw3/DA0L/wsMCv8NDgz/DxAO/xESEP8TFBL/FRYU/xYXFf8YGRf/GRoY/xobGf8bHBr/HB0b/x0eHP8dHhz/HR4c/x0eHP8eHx3/HR4c/x0eHP8cHRv/HB0b/xscGv8aGxn/GRwe/wpX1f8GZP7/BmT+/w09jP8REhD/DxAO/w0ODP8LDAr/CwwK/wwNC/8ODw3/EBEP/xITEf8UFRP/FRYU/xcYFv8YGRf/GRoY/xobGf8bHBr/HB0b/xwdG/8cHRv/HR4c/x0eHP8dHhz/HB0b/xwdG/8bHBr/GhsZ/xkaGP8YGRf/EyhI/wVi+v8EY/7/Cj2M/xERD/8ODw3/DA0L/wsMCv8MDQv/CwwK/w0ODP8PEA7/ERIQ/xMUEv8VFhT/FhcV/xcYFv8YGRf/GRoY/xobGf8bHBr/Gxwa/xwdG/8cHRv/HB0b/xwdG/8bHBr/Gxwa/xobGf8ZGhj/GBkX/xcYFv8WFxX/DECW/wNi/v8KO4z/EBAP/w0ODP8MDQv/DA0L/wwNC/8LDAr/DA0L/w4PDf8QEQ//EhMR/xQVE/8VFhT/FhcV/xcYFv8YGRf/GRoY/xobGf8aGxn/Gxwa/xobGf8bHBr/GhsZ/xobGf8aGxn/GRoY/xgZF/8XGBb/FhcV/xUWFP8TGB3/BVbd/wk6i/8PDw3/DA0L/wsMCv8MDQv/DA0L/wsMCv8LDAr/DQ4M/w8QDv8REhD/EhMR/xQVE/8VFhT/FhcV/xcYFv8YGRf/GBkX/xkaGP8ZGhj/GRoY/xkaGP8ZGhj/GRoY/xgZF/8YGRf/FxgW/xYXFf8VFhT/FBUT/xITEf8NJk7/CDiJ/w0ODP8LDAr/DA0L/wwNC/8MDQv/DA0L/wsMCv8LDAr/DQ4M/w8QDv8REhD/EhMR/xQVE/8VFhT/FRYU/xYXFf8XGBb/FxgW/xgZF/8YGRf/GBkX/xgZF/8YGRf/FxgW/xYXFf8WFxX/FRYU/xQVE/8SExH/ERIQ/xAQDv8NFiT/DA0L/wsMCv8MDQv/DA0L/wwNC/8MDQv/CwwK/wsMCv8MDQv/Dg8N/w8QDv8REhD/EhMR/xMUEv8UFRP/FRYU/xUWFP8WFxX/FhcV/xYXFf8WFxX/FhcV/xYXFf8VFhT/FRYU/xQVE/8TFBL/EhMR/xESEP8PEA7/Dg8N/wwNC/8LDAr/DA0L/wwNC/8MDQv/DA0L/wwNC/8MDQv/DA0L/wsMCv8MDQv/DQ4M/w8QDv8QEQ//ERIQ/xITEf8TFBL/FBUT/xQVE/8VFhT/FRYU/xUWFP8VFhT/FBUT/xQVE/8TFBL/EhMR/xESEP8QEQ//DxAO/w0ODP8MDQv/CwwK/wwNC/8MDQv/DA0L/wwNC/8MDQv/DA0L/wwNC/8MDQv/DA0L/wsMCv8LDAr/DQ4M/w4PDf8PEA7/EBEP/xESEP8SExH/EhMR/xMUEv8TFBL/ExQS/xMUEv8SExH/EhMR/xESEP8QEQ//DxAO/w4PDf8NDgz/DA0L/wsMCv8MDQv/DA0L/wwNC/8MDQv/DA0L/wwNC/8MDQv/DA0L/wwNC/8MDQv/CwwK/wsMCv8LDAr/DA0L/w0ODP8ODw3/DxAO/xARD/8QEQ//ERIQ/xESEP8REhD/EBEP/xARD/8QEQ//DxAO/w4PDf8NDgz/DA0L/wsMCv8LDAr/DA0L/wwNC/8MDQv/DA0L/wwNC/8MDQv/DA0L/wwNC/8MDQv/DA0L/wwNC/8MDQv/DA0L/wsMCv8LDAr/CwwK/wwNC/8NDgz/Dg8N/w4PDf8ODw3/DxAO/w8QDv8ODw3/Dg8N/w4PDf8NDgz/DA0L/wsMCv8LDAr/CwwK/wwNC/8MDQv/DA0L/wwNC/8MDQv/DA0L/wwNC/8MDQv/DA0L/wwNC/8MDQv/DA0L/wwNC/8MDQv/DA0L/wwNC/8MDQv/CwwK/wsMCv8LDAr/DA0L/wwNC/8MDQv/DA0L/wwNC/8MDQv/CwwK/wsMCv8LDAr/CwwK/wsMCv8MDQv/DA0L/wwNC/8MDQv/DA0L/wwNC/8MDQv/DA0L/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
	const FI_ICON = createIcon(FI_ICON_BASE64);
	const FI_URL_PLAYER = "https://www.faceit.com/en/search/player/";
	const FI_URL_TEAM = "https://www.faceit.com/en/search/team/";
	const FI_TITLE = "FaceIt-Suche";
	
	//ESEA
	const ESEA_ICON_BASE64 = "AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAABMLAAATCwAAAAAAAAAAAAAAAAAAbrhc/0inMv9JqDP/Sak0/0mpNP9JqDP/Sak0/0mpM/9JqDL/SqYz/6XTmf93u2b/Sagy/0mpNP8AAAAAicuA//////+30qT/XJky/0KGEf9BhQ//QYQO/0GEDv9ChhH/VZUp/8nevP//////baRJ/0GGDP9BhA3/Sak0/0inMv+yz5////////T48f+uzpr/ZqI//0WOE/9EjRP/d6xQ/+bw4P///////f78/2OhO/9DixD/QoYO/0mpM/9JqDP/SI4a/83hwP////////////n8+P+716r/s9Kg//3+/P////////////X58v9Xmir/RI4Q/0WJE/9JqTT/Sak0/0mOGv9iozr/9fny///////////////////////////////////////y9+//UZkk/0WREP9KjRr/Sakz/0mpNP9PkiH/RpUW/4e6a//w9uz/////////////////////////////////5vHg/0aVGv9GlBL/T5Ij/0mpM/9JqTT/VJgt/02cJP+01aP/zuTD/4e8av+lzZH/0ubH//P48P/////////////////F37j/c7FS/1KZLP9JqDP/SKcy/3KtVf/P5cX////////////K4r3/Rpoc/0aaHf9apTb/iL5r/7LVoP/Z6tH////////////W6c7/esRv/5fRjv/8/fv//////////////////////6PPkP9Hnh//R54d/0eeHf9Hnh7/Rp0g/12qO/+Dvmj/u9yw/9Lrzv/U7NH/2+3W/9Dnx//Q58b/0OfH/9Dnxv+12af/ertg/3e5Xf93uV3/d7lb/2WwRf9HoyP/SKIi/2u0WP9JsTv/SLA7/264YP9IpCb/SKUm/0ikKP9IpSj/TKYq/9brz/////////////////+43Kz/SKUn/0moJf94wG7/SbU//0q2P/9/xnr/Sawr/0msK/9JrCv/Sasr/0mpK/9arz//5fPh////////////pdSW/0ioK/9JrC3/gMZ6/0m1P/9Ktj//hsyG/0mwMP9JsDD/SbAx/0mwL/9KsDD/Sqwv/3K9Xv/7/fr//////5nPiv9KrC//SrAx/4bLhv9Jtj//SbU//4zPj/9Jszb/SrM2/0m0Nf9Ksjf/SrM0/0mxNf9IrzP/qdif//////+Ny37/SrA1/0qyNf+Mz4//SbU//0m1P/+P0pX/j9KU/4/SlP+P0ZT/j9KT/47Rk/+O0JL/i82O/4DDev/t9+z/r9qt/4bLh/+O0ZL/jtGT/0q2QP8AAAAASrZA/0m2P/9Ktj//SbU//0q2QP9Jtj//SrZA/0m2P/9Ksz3/ecRv/4HId/9KtD7/SbU//0q1P/8AAAAAgAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAP//gAH//w==";
	const ESEA_ICON = createIcon(ESEA_ICON_BASE64);
	const ESEA_URL_PLAYER = "https://play.esea.net/index.php?s=search&source=users&query=";
	const ESEA_URL_TEAM = "https://play.esea.net/index.php?s=search&source=teams&query=";
	const ESEA_TITLE = "ESEA-Suche";
	
	const GOOGLE_ICON_BASE64 = "AAABAAIAEBAAAAEAIABoBAAAJgAAACAgAAABACAAqBAAAI4EAAAoAAAAEAAAACAAAAABACAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///zD9/f2W/f392P39/fn9/f35/f391/39/ZT+/v4uAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v7+Cf39/Zn///////////////////////////////////////////39/ZX///8IAAAAAAAAAAAAAAAA/v7+Cf39/cH/////+v35/7TZp/92ul3/WKs6/1iqOv9yuFn/rNWd//j79v///////f39v////wgAAAAAAAAAAP39/Zn/////7PXp/3G3WP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP+Or1j//vDo///////9/f2VAAAAAP///zD/////+vz5/3G3V/9TqDT/WKo6/6LQkf/U6cz/1urO/6rUm/+Zo0r/8IZB//adZ////v7///////7+/i79/f2Y/////4nWzf9Lqkj/Vqo4/9Xqzv///////////////////////ebY//SHRv/0hUL//NjD///////9/f2U/f392v////8sxPH/Ebzt/43RsP/////////////////////////////////4roL/9IVC//i1jf///////f391/39/fr/////Cr37/wW8+/+16/7/////////////////9IVC//SFQv/0hUL/9IVC//SFQv/3pnX///////39/fn9/f36/////wu++/8FvPv/tuz+//////////////////SFQv/0hUL/9IVC//SFQv/0hUL/96p7///////9/f35/f392/////81yfz/CrL5/2uk9v///////////////////////////////////////////////////////f392P39/Zn/////ks/7/zdS7P84Rur/0NT6///////////////////////9/f////////////////////////39/Zb+/v4y//////n5/v9WYu3/NUPq/ztJ6/+VnPT/z9L6/9HU+v+WnfT/Ul7t/+Hj/P////////////////////8wAAAAAP39/Z3/////6Or9/1hj7v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v9sdvD////////////9/f2YAAAAAAAAAAD///8K/f39w//////5+f7/paz2/11p7v88Suv/Okfq/1pm7v+iqfX/+fn+///////9/f3B/v7+CQAAAAAAAAAAAAAAAP///wr9/f2d///////////////////////////////////////////9/f2Z/v7+CQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/jL9/f2Z/f392/39/fr9/f36/f392v39/Zj///8wAAAAAAAAAAAAAAAAAAAAAPAPAADAAwAAgAEAAIABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIABAACAAQAAwAMAAPAPAAAoAAAAIAAAAEAAAAABACAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/g3+/v5X/f39mf39/cj9/f3q/f39+f39/fn9/f3q/f39yP39/Zn+/v5W////DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/iT9/f2c/f399f/////////////////////////////////////////////////////9/f31/f39mv7+/iMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/gn9/f2K/f39+////////////////////////////////////////////////////////////////////////////f39+v39/Yf///8IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+/v4k/f390v////////////////////////////////////////////////////////////////////////////////////////////////39/dD///8iAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////MP39/er//////////////////////////+r05v+v16H/gsBs/2WxSf9Wqjj/Vqk3/2OwRv99vWX/pdKV/97u2P////////////////////////////39/ej+/v4vAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/iT9/f3q/////////////////////+v15/+Pxnv/VKk2/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/36+Z//d7tf///////////////////////39/ej///8iAAAAAAAAAAAAAAAAAAAAAAAAAAD///8K/f390//////////////////////E4bn/XKw+/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1apN/+x0pv///////////////////////39/dD///8IAAAAAAAAAAAAAAAAAAAAAP39/Yv/////////////////////sdij/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/YKU1/8qOPv/5wZ////////////////////////39/YcAAAAAAAAAAAAAAAD+/v4l/f39+////////////////8Lgt/9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9utlT/n86N/7faqv+426v/pdKV/3u8ZP9UqDX/U6g0/3egN//jiUH/9IVC//SFQv/82MP//////////////////f39+v7+/iMAAAAAAAAAAP39/Z3////////////////q9Ob/W6w+/1OoNP9TqDT/U6g0/1OoNP9nskz/zOXC/////////////////////////////////+Dv2v+osWP/8YVC//SFQv/0hUL/9IVC//WQVP/++fb//////////////////f39mgAAAAD+/v4O/f399v///////////////4LHj/9TqDT/U6g0/1OoNP9TqDT/dblc//L58P/////////////////////////////////////////////8+v/3p3f/9IVC//SFQv/0hUL/9IVC//rIqf/////////////////9/f31////DP7+/ln////////////////f9v7/Cbz2/zOwhv9TqDT/U6g0/2KwRv/v9+z///////////////////////////////////////////////////////738//1kFT/9IVC//SFQv/0hUL/9plg///////////////////////+/v5W/f39nP///////////////4jf/f8FvPv/Bbz7/yG1s/9QqDz/vN2w//////////////////////////////////////////////////////////////////rHqP/0hUL/9IVC//SFQv/0hUL//vDn//////////////////39/Zn9/f3L////////////////R878/wW8+/8FvPv/Bbz7/y7C5P/7/fr//////////////////////////////////////////////////////////////////ere//SFQv/0hUL/9IVC//SFQv/718H//////////////////f39yP39/ez///////////////8cwvv/Bbz7/wW8+/8FvPv/WNL8///////////////////////////////////////0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//rIqv/////////////////9/f3q/f39+v///////////////we9+/8FvPv/Bbz7/wW8+/993P3///////////////////////////////////////SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/+cGf//////////////////39/fn9/f36////////////////B737/wW8+/8FvPv/Bbz7/33c/f//////////////////////////////////////9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/6xaX//////////////////f39+f39/e3///////////////8cwvv/Bbz7/wW8+/8FvPv/WdP8///////////////////////////////////////0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//vVv//////////////////9/f3q/f39y////////////////0bN/P8FvPv/Bbz7/wW8+/8hrvn/+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////39/cj9/f2c////////////////ht/9/wW8+/8FvPv/FZP1/zRJ6/+zuPf//////////////////////////////////////////////////////////////////////////////////////////////////////////////////f39mf7+/lr////////////////d9v7/B7n7/yB38f81Q+r/NUPq/0hV7P/u8P3////////////////////////////////////////////////////////////////////////////////////////////////////////////+/v5X////D/39/ff///////////////9tkPT/NUPq/zVD6v81Q+r/NUPq/2Fs7//y8v7////////////////////////////////////////////09f7//////////////////////////////////////////////////f399f7+/g0AAAAA/f39n////////////////+Tm/P89Suv/NUPq/zVD6v81Q+r/NUPq/1Bc7f/IzPn/////////////////////////////////x8v5/0xY7P+MlPP////////////////////////////////////////////9/f2cAAAAAAAAAAD+/v4n/f39/P///////////////7W69/81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v9ZZe7/k5v0/6609/+vtff/lJv0/1pm7v81Q+r/NUPq/zVD6v+GjvL//v7//////////////////////////////f39+/7+/iQAAAAAAAAAAAAAAAD9/f2N/////////////////////6Cn9f81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v+BivL////////////////////////////9/f2KAAAAAAAAAAAAAAAAAAAAAP7+/gv9/f3V/////////////////////7W69/8+S+v/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/P0zr/7q/+P///////////////////////f390v7+/gkAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/ib9/f3r/////////////////////+Xn/P94gfH/NkTq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NkTq/3Z/8f/l5/z///////////////////////39/er+/v4kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/jL9/f3r///////////////////////////k5vz/nqX1/2p08P9IVez/OEbq/zdF6v9GU+z/aHLv/5qh9f/i5Pz////////////////////////////9/f3q////MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/ib9/f3V/////////////////////////////////////////////////////////////////////////////////////////////////f390v7+/iQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wr9/f2N/f39/P///////////////////////////////////////////////////////////////////////////f39+/39/Yv+/v4JAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+/v4n/f39n/39/ff//////////////////////////////////////////////////////f399v39/Z3+/v4lAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v7+Dv7+/lr9/f2c/f39y/39/e39/f36/f39+v39/ez9/f3L/f39nP7+/ln+/v4OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/AA///AAD//AAAP/gAAB/wAAAP4AAAB8AAAAPAAAADgAAAAYAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAABgAAAAcAAAAPAAAAD4AAAB/AAAA/4AAAf/AAAP/8AAP//wAP/"
	const GOOGLE_ICON = createIcon(GOOGLE_ICON_BASE64);
	const GOOGLE_URL_PLAYER = "https://www.google.de/search?q=site%3Acsgo.99damage.de%2Fde%2Fleagues%2Fteams+%2B\""
	const GOOGLE_TITLE = "Google-Teamsuche";
	
	const ICON_CLASS = "profileIcon"; //used in class-tag
	const TYPE_PLAYER = "spieler";
	const TYPE_TEAM = "team";
	
	const TEAM_URL = new RegExp("https?:\/\/csgo\.99damage\.de\/de\/leagues\/teams\/.*");
	const PLAYER_URL = new RegExp("https?:\/\/csgo\.99damage\.de\/de\/users\/.*");
	
	const searchURL = "site:csgo.99damage.de/de/leagues/teams +\"NamenloserLefty\"";
	
	function createIcon(icon_base64){
		var icon = document.createElement("img");
		$(icon).attr({src: "data:image/x-icon;base64,"+icon_base64, height: 16, width: 16});
		
		return icon;
	}
	
	function createIconLink(icon, url, name, title){		
		var iconLink = document.createElement("a");
		$(iconLink).attr({"href": url+name, "target": "_blank", "class": ICON_CLASS, "title": title, "alt": title});
		$(iconLink).html(icon);
		
		return iconLink;
	}
	
	function createSteamLink(type, name){
		if(type == TYPE_PLAYER){
			return createIconLink(STEAM_ICON.cloneNode(), STEAM_URL_PLAYER, name, STEAM_TITLE);
		}else if(type == TYPE_TEAM){
			return createIconLink(STEAM_ICON.cloneNode(), STEAM_URL_TEAM, name, STEAM_TITLE);
		}else{
			throw "[Exception 001: Unknown Type]";
		}
	}
	
	function createFaceItLink(type, name){
		if(type == TYPE_PLAYER){
			return createIconLink(FI_ICON.cloneNode(), FI_URL_PLAYER, name, FI_TITLE);
		}else if(type == TYPE_TEAM){
			return createIconLink(FI_ICON.cloneNode(), FI_URL_TEAM, name, FI_TITLE);
		}else{
			throw "[Exception 002: Unbknown Type]";
		}
	}
	
	function createESEALink(type, name){
		if(type == TYPE_PLAYER){
			return createIconLink(ESEA_ICON.cloneNode(), ESEA_URL_PLAYER, name, ESEA_TITLE);
		}else if(type == TYPE_TEAM){
			return createIconLink(ESEA_ICON.cloneNode(), ESEA_URL_TEAM, name, ESEA_TITLE);
		}else{
			throw "[Exception 003: Unbknown Type]";
		}
	}
	
	function createGoogleLink(type, name){
		var name = name+"\""; //für spezifische Google-Url
		
		if(type == TYPE_PLAYER){
			return createIconLink(GOOGLE_ICON.cloneNode(), GOOGLE_URL_PLAYER, name, GOOGLE_TITLE);
		}else{
			throw "[Exception 102: Unbknown Type]";
		}
	}
	
	function createProfileLinksOnTeamSite(){
			const PLAYER_TABLE = $($("#content table")[0]).children();
			if(PLAYER_TABLE == null || PLAYER_TABLE.length == 0){
				throw "[Exception 004: Player Table not found]";
			}

			$(PLAYER_TABLE).children().each(function(i){ //each tr element
				if(i>0){
					$(this).children().each(function(j){ //each td element
						if(j%3 == 0){ //1. column per row
							var playerName = $(this).children().html();
							$(this).append(createSteamLink(TYPE_PLAYER, playerName));
							$(this).append(createFaceItLink(TYPE_PLAYER, playerName));
							$(this).append(createESEALink(TYPE_PLAYER, playerName));
						}
					});
				}
			});
	}
	
	function createTeamLinksOnTeamSite(){
		const TEAM_NAME_ELEMENT = $("#content h2")[0];
		if(TEAM_NAME_ELEMENT == null || TEAM_NAME_ELEMENT.length == 0){
			throw "[Exception 005: TeamName could not be found]";
		}
		var teamName = $(TEAM_NAME_ELEMENT).html().split('(')[0];
		$(TEAM_NAME_ELEMENT).append(createSteamLink(TYPE_TEAM, teamName));
		$(TEAM_NAME_ELEMENT).append(createFaceItLink(TYPE_TEAM, teamName));
		$(TEAM_NAME_ELEMENT).append(createESEALink(TYPE_TEAM, teamName));
	}
	
	function createProfileLinksOnProfileSite(){
		const PLAYER_NAME_ELEMENT = $(".user-profile")[0];
		
		if(PLAYER_NAME_ELEMENT == null || PLAYER_NAME_ELEMENT.length == 0){
			throw "[Exception 101: ProfileName could not be found]";
		}
		
		var playerName = $(PLAYER_NAME_ELEMENT).html();
		
		$(PLAYER_NAME_ELEMENT).append(createGoogleLink(TYPE_PLAYER, playerName));
		$(PLAYER_NAME_ELEMENT).append(createSteamLink(TYPE_PLAYER, playerName));
		$(PLAYER_NAME_ELEMENT).append(createFaceItLink(TYPE_PLAYER, playerName));
		$(PLAYER_NAME_ELEMENT).append(createESEALink(TYPE_PLAYER, playerName));
	}
	try{
		var url = window.location.href;
		
		if(TEAM_URL.exec(url)){
			createTeamLinksOnTeamSite();
			createProfileLinksOnTeamSite();
			
			$(".profileIcon").css("marginLeft", 2);
			
			console.log("99dmg Profile Finder successfully loaded");
		}else if(PLAYER_URL.exec(url)){
			createProfileLinksOnProfileSite();
			
			$(".profileIcon").css("marginLeft", 2);
			console.log("99dmg Profile Finder successfully loaded");
		}else{
			throw "[Exception 901: Script was not supposed to be executed]";
		}
	}catch(err){
		console.log(err+" If this Exception persists disable 99dmg Profile Finder and wait for an update.");
	}
})();
