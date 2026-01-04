// ==UserScript==
// @name         Chat google - green
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Přebarví chatovací okna v google chatu do zeleného módu
// @match        https://chat.google.com/*
// @author       Tomáš Kunc
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/545584/Chat%20google%20-%20green.user.js
// @updateURL https://update.greasyfork.org/scripts/545584/Chat%20google%20-%20green.meta.js
// ==/UserScript==

GM_addStyle(`
/* CSS Document *//* pozadí chatu */
.Bl2pUd, .lFJYcb, .GNlxbc, .Fv5sh.qZWhtc, .yroP3c, .pqeofd{
	background-color: #92c78b !important;
}


/* padding zpráv */
.rogmqd{
	padding: 5px;
}


/*pozadí zpráv ostatních */
.nF6pT.yqoUIf .rogmqd, .nF6pT.yqoUIf .wdoEHc {
    background-color: #fff;
}


/* pozadí zodpovězené zprávy */
.GoAOqc{
	background-color: #f5e7de !important;
}

/* pozadí mé zprávy  */
.nF6pT.yqoUIf.Pxe3Yd:not(.xOWoLe) .rogmqd{
	background-color: #deffcc !important;
}

/* pozadí zodpovězené zprávy v mé zprávě */
.nF6pT.yqoUIf.Pxe3Yd:not(.xOWoLe) .rogmqd .GoAOqc {
	/*background-color: #c8ebb4 !important;*/
	background-color: #c1e9ab !important;
}


/* tagy */
.uuB9Nd{
	background-color: transparent !important;
}

/* svg zavináč u tagu */
.uuB9Nd .kqu4n {
    fill: #0011ff !important;
}

/* předěl u odpovědi ve vláknu, čas zprávy */
.vdRKO, .pqeofd, .b8Cb3d, .Ao1xUb .njhDLd{
	color: #000 !important;
}

/* nepřečtené nebo hyperlinky */
.ktmas, .NMm5M, .MsqITd, .yZwuLe, .iu7yI, .wb7G0e, .vdRKO.rX27Db{
	color: #0011ff !important;
}

/* linka u předělu ve vláknu */
.NpKaQd{
	background-color: #000 !important;
}

/* linka u odpovědí vedoucích do vlákna */
.a4hVOb {
    stroke: #000000;
}

/*button připíchnuté*/
.VFqcYc {
	background-color: #ff0000;
}

/* špendlík připíchnuté */
.S1EwJb {
    fill: #fff;
}

/* text připíchnuté */
.UywwFc-vQzf8d{
		color: #fff !important;
}

.nF6pT.yqoUIf.ErBBte.xwGG3b .rogmqd{
    border: 0px;
}

/* obarvení zprávy v chatu na kterou se dostanu z vyhledávání nebo z jiné konverzace*/
.nF6pT.yqoUIf.r1BIN.xwGG3b .rogmqd{
	  border: 3px solid #000000;
    background: #cbcbcb;
}

/* editovaná zpráva */
.tGGH5c .BScnzc{
	background: #d3e1f7;
}

`);
