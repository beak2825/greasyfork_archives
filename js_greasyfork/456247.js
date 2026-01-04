// ==UserScript==
// @name         CCSF Schedule Planner Helper
// @namespace    https://github.com/ccsfsph/ccsf-schedule-planner-helper
// @version      0.4.2
// @description  This userscript helps student to choose course more convenient, extenions: instructor email, instructor scores and rates from RMP for every table, and seats capacity in potential page table
// @author       ccsfsph
// @match        *://ccsf.collegescheduler.com/*
// @match        *://*.ccsf.edu/*
// @icon         data:image/x-icon;base64,AAABAAMAMDAAAAEAIACoJQAANgAAACAgAAABACAAqBAAAN4lAAAQEAAAAQAgAGgEAACGNgAAKAAAADAAAABgAAAAAQAgAAAAAAAAJAAAAAAAAAAAAAAAAAAAAAAAAO+uABvvrgCd764A9O+uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAPTvrgCd764AG++uAJ3vrgD8764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD8764Anu+uAPLvrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A8u+uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrwD/768A/++vAP/vrwD/768A/++vAP/vrwD/768A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/768A/++sAP/tpgD/654A/+mYAP/olQD/6JQA/+iWAP/pmgD/66AA/+2nAP/vrQD/768A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/tpwD/6ZcA/+SHAP/ifQD/4HgA/+B3AP/gdgD/4HYA/+B3AP/gdwD/4XkA/+J+AP/liAD/6ZkA/+6pAP/vrwD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrwD/7qoA/+iVAP/ifwD/4HcA/+B2AP/gdQD/33UA/991AP/gdQD/4HUA/991AP/fdQD/4HUA/+B1AP/gdgD/4HcA/+OCAP/qmwD/760A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++vAP/sowD/5IYA/+B3AP/gdQD/4HUA/+F8Cf/liyf/6Z5L/+yuaP/utnf/77d4/+60c//sqmH/6JtE/+SJI//hegf/4HUA/+B1AP/heQD/55AA/+6rAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/+ufAP/ifwD/4HUA/+B2Af/kiCH/7bFu//bZuf/88eb//vz5//////////////////////////7//vv3//vv4v/21rP/7Kxl/+OEGf/gdQD/4HcA/+aNAP/uqwD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrwD/7KEA/+J+AP/fdQD/4oEU/+61dv/669r///79//////////////////////////////////////////////////////////////38//nkzv/rp1v/4XoH/+B3AP/nkwD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/tqAD/44MA/991AP/mkjX/99u8///+/P/////////////////////////////////////////////////////////////////////////////////++vX/8cKO/+J+EP/heQD/6p0A/++vAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/njwD/4HUA/+icR//669v///////////////////////////////////////////////////////////////////////////////////////////////////79//LImv/jgg7/6ZgA/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/768A/+yiAP/hegD/55c+//vt3v////////////////////////////////////////////////////////////////////////////////////////////////////////////78/P/1z4L/764E/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/+aNAP/jhiD/+OLK///////////////////////////////////////////////////+/v/+/Pf//vz1///9+//////////////////////////////////////////////////++vH/9MdP/++tAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/7agA/+OBBP/xxJL////////////////////////////////////////////++u//+eOp//XNZP/zw0P/88I+//THT//31Hr/++vB///9+P/////////////////////////////////++ez/9c5l/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrwD/6p0A/+eXO//99Oz///////////////////////////////////////zw0P/zxUj/768G/++tAP/vrQD/760A/++tAP/vrQD/8LIP//XPav/99+f///////////////////77//vpuv/zwT7/768D/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrwD/6JUB//LFlf///////////////////////////////////////PLX//K9M//vrQD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++tAP/0yVf//vnu///////99uP/9tJ0//CzEv/vrQD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrQD/6p0d//rq2v///////////////////////////////////fj/9cte/++tAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgP/99eD//rlrv/yvjP/760B/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/urAD/7rJL//76+P/////////////////////////////////77MT/8LMQ/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/8LEM//CxDP/vrQD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/urAD/88l4///////////////////////////////////////31oD/760A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrQD/+NuX///////////////////////////////////9+//0xlH/760A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgL/+eOn//////////////////////////////////358//wtzv/760A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrwL/+eOq//////////////////////////////////338v/sqDj/7qwA/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/+eCf//////////////////////////////////769//qoUX/7KIA/++vAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/7qkA/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrQD/99iG///////////////////////////////////////srmn/5YoA/++tAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++vAP/rnwD/44IA/+iWAP/uqwD/768A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrQD/9ctd///+/f/////////////////////////////////0zqb/4XoE/+eSAP/urAD/768A/++uAP/vrgD/764A/++uAP/vrwD/764A/+ufAP/ifwD/4HUA/+B4AP/liQD/7KQA/++vAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrQD/8rwu//746f/////////////////////////////////88uf/5pEz/+B2AP/liQD/658A/+6pAP/urAD/7qwA/+6qAP/sogD/55AA/+F8AP/geAX/5Icg/+B4BP/gdgD/4n4A/+mYAP/urAD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/77EJ//rntf//////////////////////////////////////9M+m/+F8Df/gdQD/4XkA/+OAAP/khQD/5IUA/+OBAP/hegD/4HYA/991AP/poE7/+unW/++5fv/igBP/33UA/+B4AP/mjQD/7qsA/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/760A//XLX////fv//////////////////////////////////vz6//HBjf/ifxH/33UA/+B1AP/gdgD/4HYA/+B1AP/fdQD/4HgE/+qhUP/77d7////////9/P/22br/55U6/+B3Af/mjgD/760A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A//CzE//76sD////////////////////////////////////////9+//22bn/6qNU/+SHH//ifxD/4n8Q/+OGHv/onEb/88mb//327////////////////////////PHm//C9df/vrhD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++tAP/zxUn//vnt/////////////////////////////////////////////vv5//vu3//548z/+eTN//vt3v/++vb////////////////////////////////////////+/P/546f/8LIP/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgP/99R6///9+v/////////////////////////////////////////////////////////////////////////////////////////////////////////////+/f/32Yj/768F/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/8LEL//jajv///fr///////////////////////////////////////////////////////////////////////////////////////////////////79//ngn//wshD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A//CxC//31X7//vrw/////////////////////////////////////////////////////////////////////////////////////////fj/+N2W//CzE//vrQD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrwT/9MZP//vtyf///vz////////////////////////////////////////////////////////////////////+//3z2v/1zmf/77AK/++tAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/760A//C1F//20Gz/++zE//778/////////////////////////////////////////////789v/88ND/99aA//G5Jf/vrQH/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrQD/8LMP//PBPv/20nX/+eCg//rouf/768L/++vB//rntf/5353/9tN3//PDRP/wtRX/760B/++tAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++tAP/vrQD/764B/++wB//wsQv/8LEK/++wBv/vrgH/760A/++tAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAPLvrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A8u+uAJ3vrgD8764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD8764Ane+uABvvrgCd764A9O+uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAPTvrgCd764AG4AAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAEAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAADvrgBx764A6u+uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgDq764Ace+uAOrvrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgDq764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/768A/++vAP/vrwD/768A/++vAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrwD/764A/+6qAP/sowD/6p0A/+qbAP/qnQD/7KIA/+2oAP/vrgD/768A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/+ylAP/nkQD/44EA/+F5AP/gdgD/4HUA/+B2AP/geAD/4n4A/+aMAP/roQD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++sAP/olgD/4XwA/+B2Af/igRT/5pI1/+mgTv/qpVb/6qFQ/+eWO//jhRz/4HcE/+F5AP/nkgD/7qwA/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/urAD/548A/+B3Af/lji3/8L+I//nlz//99/D//v37///+/f///fv//fjz//rr2//zy5//55g//+B4BP/njwD/760A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/+iTAP/hfAv/7bJw//vv4v/////////////////////////////////////////////////99u7/77uB/+J+Df/plwD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++vAP/roQD/4oEM//HDkP/+/Pn////////////////////////////////////////////////////////////+/fv/8sSO/+qbCf/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/760A/+aMAv/vuHz//v37/////////////////////////////vz3//768P/+/Pf////+///////////////////////+/fn/9c9o/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/tpQD/6Z09//zz6v///////////////////////vjo//jZiv/zw0T/8r4z//PDQ//31n7//fTd//////////////////335f/1zmX/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/768A/+ufBP/0zaH///////////////////////335v/0xkz/760B/++tAP/vrQD/760A/++tAP/yvjT//PHS///++//65a7/8r40/++uAf/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/7aol//vv4v//////////////////////99R6/++tAP/vrgD/764A/++uAP/vrgD/764A/++tAP/zxEb/9c5l//CyDf/vrQD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++tAP/yvk///vz6//////////////////335f/xuin/760A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrQD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/760A//XPbf//////////////////////++vG//CxDf/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrQD/9tN2///////////////////////437v/7akH/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrwD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++tAP/20Gv///////////////////////jhyP/pmw7/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/+yiAP/uqQD/768A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/760A//TGTP///fn//////////////////PLn/+eTLP/qnAD/764A/++vAP/vrwD/768A/++uAP/qmwD/4XsA/+SEAP/roQD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrQD/8bgi//303///////////////////////77p//+F7AP/nkAD/654A/+uhAP/qmwD/5owA/+F7BP/omEH/44Uc/+F6AP/olAD/7qsA/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrwP/+d+b///////////////////////88+n/6qNU/+B3Av/gdgD/4HcA/+B1AP/geAb/66he//zz6v/44cf/6JtG/+J+A//sowD/768A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++tAP/yvzj//ffn///////////////////////99ez/8seX/+qkVf/pnUj/7Kph//TPp//9+PL////////////99O3/9MyE//CzE//vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAf/20nT///35//////////////////////////////38//78+f///v7////////////////////////////99uH/8r0w/++tAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++wCv/32If//vz3/////////////////////////////////////////////////////////////vjq//XKW//vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++wCP/1zmf//fTc//////////////////////////////////////////////79//zuy//0xUr/764C/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++tAf/xuib/99V9//vsxf/++Oj//vz1//789v/++vH//fXg//rot//2z2r/8LYZ/++tAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++tAP/vrQD/8LIO//G7Kf/zwT3/88JB//K/Nv/xuCD/77AI/++tAP/vrQD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/760A/++tAP/vrQD/760A/++tAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgDp764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A6e+uAHHvrgDq764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAOrvrgBxgAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAEoAAAAEAAAACAAAAABACAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAA764A2++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrwD/768A/++uAP/vrgD/764A/++uAP/vrgD/764A2++uAP/vrgD/764A/++uAP/vrgD/768A/++tAP/tpgD/66EA/+yiAP/uqQD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/+ykAP/mjgX/5o8g/+eWNf/nlDD/5YwU/+iWAf/urAD/764A/++uAP/vrgD/764A/++uAP/vrgD/768A/+yjAP/omCv/88qe//vu4P/9+PL//fbu//nl0P/tsm7/6ZkK/++tAP/vrgD/764A/++uAP/vrgD/764A/+6rAP/roy//+eXR/////////vz//vnt//789P///////vv7//TKe//vrQH/764A/++uAP/vrgD/764A/++uAP/tqQf/9tWo///////++vD/9tN3//K8LP/zwT7/+uay//303v/1zWH/768C/++uAP/vrgD/764A/++uAP/vrQD/8LYq//306P//////+eCe/++uBP/vrQD/760A//C2Gv/xuib/764B/++uAP/vrgD/764A/++uAP/vrgD/760A//PCQv/+/Pf///////TLa//vrQD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++tAP/zwDn//vvy///////yxH3/7KQA/++uAP/urAD/6ZkA/+qcAP/vrQD/764A/++uAP/vrgD/764A/++uAP/vrgD/8LUW//zvz///////+eXO/+eWJ//mjAD/5owJ/+ytYv/rplT/6pwG/++uAP/vrgD/764A/++uAP/vrgD/764A/++tAP/1z2n///34///////66NX/88ug//bYuf/++fX//fj0//TIYv/vrQD/764A/++uAP/vrgD/764A/++uAP/vrgD/77AJ//fVev/++Or///////////////////35//rns//xuib/760A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgT/8r81//fUef/43ZX/99mI//TIUv/wsxD/760A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++tAP/vrQD/760A/++tAP/vrQD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A2++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A/++uAP/vrgD/764A2wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
// @run-at       document-start
// @license      GPL-3.0
// @connect      ratemyprofessors.com
// @connect      www.ratemyprofessors.com
// @connect      ccsf.edu
// @connect      www.ccsf.edu
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/456247/CCSF%20Schedule%20Planner%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/456247/CCSF%20Schedule%20Planner%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // *********************************************************
    // Welcome use CCSF Schedule Planner Helper
    // all code is open source at: https://github.com/ccsfsph/ccsf-schedule-planner-helper
    // document: http://ccsfsph.github.io/
    // ccsf-schedule-planner-helper use `GPL-3.0` as open source license
    // you should use code under the license
    // *********************************************************

    // TODO:
    // 1. Remember to fix the switch scheule not work problem, since we need to listen the button event
    // 2. when switch the page, we cannot get the status, that's why we use the setTimeout to listen the page refresh, but this will also cause another problem: when user change from saved schedule to current schuele, the page didn't redener again.

    // NOTE:
    // React
    // we can get the detail date from `span aria-label="xx"`
    // M - Monday
    // W - Wednesday

    const originFetch = fetch;
    // https://juejin.cn/post/7135590843544502308
    window.unsafeWindow.fetch = (url, options) => {
        console.debug('unsafeWindow.fetch, url: ', url);
        console.debug('unsafeWindow.fetch, options: ', options);
        return originFetch(url, options).then(async (response) => {
            console.debug('unsafeWindow.fetch, response ', response);
            if (url.indexOf('/generate') > -1) {
                console.debug('unsafeWindow.fetch, get the generate request success');
                // why we have to clone the origin response, otherwise the page cannot continue????
                const responseClone = response.clone();
                console.debug('unsafeWindow.fetch, responseClone ', responseClone);
                let res = await responseClone.json();
                console.debug('unsafeWindow.fetch, res ', res);
                localStorage.setItem('generate-request', JSON.stringify(res));
            }

            if (url.indexOf('/regblocks') > -1) {
                console.debug('unsafeWindow.fetch, get the generate request success');
                // why we have to clone the origin response, otherwise the page cannot continue????
                const responseClone = response.clone();
                console.debug('unsafeWindow.fetch, responseClone ', responseClone);
                let res = await responseClone.json();
                console.debug('unsafeWindow.fetch, res ', res);
                localStorage.setItem('regblocks', JSON.stringify(res));
            }

            return response;
        });
    };

    // tampermonkey documentation: https://www.tampermonkey.net/documentation.php
    // code example: https://wiki.greasespot.net/GM.xmlHttpRequest

    // ====================== base lib begin, load before business ======================

    // ---------------------- localStorage support expire Lib begin ----------------------
    // see: https://github.com/MrXujiang/xijs/blob/main/src/store/index.ts
    // a seal for localStorage, a lib support the expire time for localStorage
    // the origin version is ts, in js not support the dataType. I modify it
    const store = {
        //preId: 'xi-',
        preId: '',
        timeSign: '|-ts-|',
        status: {
            SUCCESS: 0,
            FAILURE: 1,
            OVERFLOW: 2,
            TIMEOUT: 3,
        },
        storage: localStorage || window.localStorage,
        getKey: function (key) {
            return this.preId + key;
        },
        set: function (
            key,
            value,
            time,
            cb,
        ) {
            let _status = this.status.SUCCESS,
                _key = this.getKey(key),
                _time;
            // set the expire time, if not provided, the default expire time is: 7 days
            try {
                _time = time
                    ? new Date(time).getTime() || time.getTime()
                    : new Date().getTime() + (1000 * 60 * 60 * 24 * 7);
            } catch (e) {
                _time = new Date().getTime() + (1000 * 60 * 60 * 24 * 7);
            }
            try {
                this.storage.setItem(_key, _time + this.timeSign + value);
            } catch (e) {
                _status = this.status.OVERFLOW;
            }
            cb && cb.call(this, _status, _key, value);
        },
        get: function (
            key,
            cb,
        ) {
            let status = this.status.SUCCESS,
                _key = this.getKey(key),
                value = null,
                timeSignLen = this.timeSign.length,
                that = this,
                index,
                time,
                result;
            try {
                value = that.storage.getItem(_key);
            } catch (e) {
                result = {
                    status: that.status.FAILURE,
                    value: null,
                };
                cb && cb.call(this, result.status, result.value);
                return result;
            }
            if (value) {
                index = value.indexOf(that.timeSign);
                time = +value.slice(0, index);
                if (time > new Date().getTime() || time == 0) {
                    value = value.slice(index + timeSignLen);
                } else {
                    (value = null), (status = that.status.TIMEOUT);
                    that.remove(key);
                }
            } else {
                status = that.status.FAILURE;
            }
            result = {
                status: status,
                value: value,
            };
            cb && cb.call(this, result.status, result.value);
            return result;
        },
        // delete from localStorage, if delete success, return the deleted content
        remove: function (
            key,
            cb,
        ) {
            let status = this.status.FAILURE,
                _key = this.getKey(key),
                value;
            try {
                value = this.storage.getItem(_key);
            } catch (e) {
                // dosomething
            }
            if (value) {
                try {
                    this.storage.removeItem(_key);
                    status = this.status.SUCCESS;
                } catch (e) {
                    // dosomething
                }
            }
            cb &&
            cb.call(
                this,
                status,
                status > 0
                    ? null
                    : value
                        ? value.slice(value.indexOf(this.timeSign) + this.timeSign.length)
                        : null,
            );
        },
    };
    // Test code
    // see https://github.com/MrXujiang/xijs/blob/main/src/store/index.md
    // store the object
    // let testStoreKey = 'A Test Key Name'
    // let testStoreValue = 'ccsfsph'
    // // store it first
    // store.set(testStoreKey, testStoreValue, Date.now() + 1000);
    // // get it instantly
    // console.log('get key ' + testStoreKey + ' from store ', store.get(testStoreKey));
    // setTimeout(() => {
    //     console.log('get the key later, ', store.get(testStoreKey));
    // }, 1000);

    // // callback after store success
    // store.set('kkkk123213', 'https://github.com/MrXujiang/xijs/blob/main/src/store/index.md', Date.now() + 1000, (status, key, value) => {
    //     console.log('store success, status', status);
    //     console.log('store success, key', key);
    //     console.log('store success, value', value);
    // });
    // ---------------------- localStorage support expire Lib end ----------------------

    // ====================== base lib end, load before business ======================

    // ====================== global constants begin ======================
    // use UPPER_CAMEL_CASE to identify this is a constant

    // identify whether use https or not, true to use https, false to use http
    const IS_USE_HTTPS = true;

    // how many ms to detect whether the user change the page for every times
    const pageRefreshInterval = 500;

    const RMP_AUTHORIZATION_KEY = 'Basic dGVzdDp0ZXN0';

    // ---------------------- constants for Schedule Plnnaer begin ----------------------
    // NOTE: since the website use 'React' to compile, the name of css may change for every compile,
    // may change the name of css every times when the website update
    // NOTE: Since the site use 'React' to build, with the page update, those css name may change.
    // So, we may need to update in the future
    // for table
    const TABLE_THEAD_CLASS_NAME = 'css-ri4373-headerCss';
    const TABLE_HEAD_TH_CELL_CLASS_NAME = 'css-17qtf8g-hideOnMobileCss';
    const TABLE_DATA_TD_CELL_CLASS_NAME = 'css-1p12g40-cellCss-hideOnMobileCss';
    // for `Sections` page bar name
    const TABLE_SWITCH_PAGE_BAR_CLASS_NAME = 'css-10ym66b-pagerCss';
    // `/courses/xxx` page for advanced filters
    const ADVANCED_FILTER_SAVE_BUTTON_CLASS_NAME = 'css-1m89de3-hoverStyles-hoverStyles-defaultStyle-centerBlockCss';
    const ADVANCED_FILTER_CLOSE_BUTTON_CLASS_NAME = 'css-vqzzza-closeCss';
    // ---------------------- constants for Schedule Plnnaer end ----------------------

    // ====================== global constants end ======================

    // ====================== global variables begin ======================
    // use like g_userStatus to identify this is a global variable

    var g_pageLoadFinish = false;

    // ---------------------- variables for Schedule Plnnaer begin ----------------------
    var href = '';

    var PAGE;

    // identify user in the chosen schedule page, build scheule page: Current Schedule / Register by CRN
    const PAGE_CURRENT_SCHEDULE = 'PAGE_CURRENT_SCHEDULE';
    // identify user is choosing the course, viewing the potential / possible schedule
    const PAGE_POTENTIAL_SCHEDULE = 'PAGE_POTENTIAL_SCHEDULE';
    // page contains /courses
    const PAGE_COURSE_SCHEDULE = 'PAGE_COURSE_SCHEDULE';
    const PAGE_UNKNOWN = 'PAGE_UNKNOWN';

    var g_instructorColumnIndex = 0;
    var g_seatsCapacityColumnIndex = 0;
    var g_instructorEmailColumnIndex = 0;
    var g_isUpdateLocationChangeFinish = false;
    var g_isSwitchSheduleUpdateFinish = true;
    var g_isSwitchCoursePageFinish = true;
    var g_tableHeadTotalCell = -1;
    var g_tableHeadCrnIndex = -1;
    var g_tableHeadSeatsOpenIndex = -1;
    // it seems the page use lazy load, which will cause the table didn't render soon, and cause not find the element.
    var g_isFirstLoadSuccess = false;
    var g_initCoursePageEventFlag = false;

    // ---------------------- variables for Schedule Plnnaer end ----------------------

    // ====================== global variables end ======================


    // ====================== global functions begin ======================

    // ---------------------- base function begin ----------------------

    function getRequestURLProtocol() {
        return IS_USE_HTTPS ? 'https://' : 'http://';
    }

    function getEmailHTML(email) {
        // <a href="mailto:jpotter@ccsf.edu">jpotter@ccsf.edu</a>
        return '<a href="mailto:' + email + '">' + email + '</a>';
    }

    // whther or not the user change location, return true if the location change, return false if the location doesn't change
    function isLocationChange() {
        updateGlobalPageByHref();
        console.debug("isLocationChange, href", href);
        console.debug("isLocationChange, location.href ", location.href);
        let flag = href !== location.href;
        console.debug("isLocationChange, flag ", flag);
        href = location.href;
        if (flag) {
            g_isUpdateLocationChangeFinish = false;
            console.debug("isLocationChange, location change");
        }
        if (flag && PAGE === PAGE_COURSE_SCHEDULE) {
            console.debug("isLocationChange, flag && PAGE === PAGE_COURSE_SCHEDULE")
            g_initCoursePageEventFlag = false;
        }
        return flag;
    }

    function updateGlobalPageByHref() {
        console.debug("invoke updateGlobalPageByHref...");
        let userDisplayURL = location.href;
        // https://ccsf.collegescheduler.com/terms/Spring%202023/options
        // https://ccsf.collegescheduler.com/
        // NOTE: ignore `/cart/edit` page, don't use indexOf
        if (userDisplayURL.indexOf('/options') !== -1 || userDisplayURL.indexOf('/currentschedule') !== -1 || userDisplayURL.endsWith('/cart') || userDisplayURL.endsWith('ccsf.collegescheduler.com/') || userDisplayURL.endsWith('ccsf.collegescheduler.com')) {
            PAGE = PAGE_CURRENT_SCHEDULE;
        }
        // https://ccsf.collegescheduler.com/terms/Spring%202023/courses/1581937
        else if (userDisplayURL.indexOf('/courses') !== -1) {
            PAGE = PAGE_COURSE_SCHEDULE;
        }
        // https://ccsf.collegescheduler.com/terms/Spring%202023/schedules/xxxxx
        else if (userDisplayURL.indexOf('/schedules/') !== -1) {
            PAGE = PAGE_POTENTIAL_SCHEDULE;
        }
        // didn't match
        else {
            PAGE = PAGE_UNKNOWN;
        }
        console.debug("updateGlobalPageByHref, PAGE ", PAGE)
    }

    function isTablePage() {
        return PAGE === PAGE_POTENTIAL_SCHEDULE || PAGE === PAGE_CURRENT_SCHEDULE || PAGE === PAGE_COURSE_SCHEDULE;
    }

    function updateUserSwitchPotentialSchedulePage() {
        let locationChangeFlag = isLocationChange();
        console.debug("updateUserSwitchPotentialSchedulePage, locationChangeFlag ", locationChangeFlag);
        if (locationChangeFlag && PAGE === PAGE_POTENTIAL_SCHEDULE) {
            console.debug("updateUserSwitchPotentialSchedulePage, locationChangeFlag && PAGE === PAGE_POTENTIAL_SCHEDULE")
            g_isSwitchSheduleUpdateFinish = false;
        }
        if (locationChangeFlag && PAGE === PAGE_COURSE_SCHEDULE) {
            console.debug("updateUserSwitchPotentialSchedulePage, locationChangeFlag && PAGE === PAGE_COURSE_SCHEDULE")
            g_isSwitchCoursePageFinish = false;
        }
    }

    /**
     * Convert professor's name from format like `Firstname Lastname` to `firstname-lastname`
     *
     * @param {String} professorName
     * @returns reversed name
     */
    function reverseProfessorName(professorName) {
        console.debug('reverseProfessorName, professorName', professorName);
        if (!professorName) {
            console.warn('reverseProfessorName, professorName is blank!!!')
            return;
        }

        // NOTE: New version use blank space for name instead, however, in the past, the name use `,` to split the name
        let separator = ' ';

        if (!professorName.includes(separator)) {
            console.warn(`reverseProfessorName, professorName no ' ' space in name ${professorName} try to look for ',' instead`);
            separator = ',';
            if (!professorName.includes(separator)) {
                console.error(`reverseProfessorName, professorName neither ' ' nor ',' in name ${professorName}`);
                return;
            }
        }

        let professorNameArray = professorName.split(separator);
        console.debug("reverseProfessorName, professorNameArray ", professorNameArray)
        if (separator === ' ') {
            let firstName = professorNameArray[0].trim().toLowerCase().replace(" ", "-");
            console.debug(`reverseProfessorName, professorName: ${professorName}, firstName: ${firstName}`)
            let lastName = professorNameArray[1].trim().toLowerCase().replace(" ", "-");
            console.debug(`reverseProfessorName, professorName: ${professorName}, lastName: ${lastName}`)
            let conversedProfessorName = firstName + '-' + lastName
            console.debug(`reverseProfessorName, professorName: ${professorName}, conversedProfessorName: ${conversedProfessorName}`)
            return conversedProfessorName;
        } else {
            // there are some exceptions, like `Collins Rawle, Shelly`, we should remove the blank symbol, and add an hypen `-`
            let lastName = professorNameArray[0].trim().toLowerCase().replace(" ", "-");
            console.debug(`reverseProfessorName, professorName: ${professorName}, lastName: ${lastName}`)
            let firstName = professorNameArray[1].trim().toLowerCase().replace(" ", "-");
            console.debug(`reverseProfessorName, professorName: ${professorName}, firstName: ${firstName}`)
            let conversedProfessorName = firstName + '-' + lastName
            console.debug(`reverseProfessorName, professorName: ${professorName}, conversedProfessorName: ${conversedProfessorName}`)
            return conversedProfessorName;
        }
    }

    // ---------------------- base function end ----------------------

    // ---------------------- Third-party API function begin ----------------------

    // ********************** CCSF API function begin **********************
    function getCCSFTeacherInfoURL(professorName) {
        // In Schedule Planner Page, it will display like `Conner, Constance`
        // however, the API need to get the format like 'constance-conner'
        return getRequestURLProtocol() + 'www.ccsf.edu/directory/' + reverseProfessorName(professorName);
    }

    // we found some information from third-party may be incorrect.
    // besides, we can also collect some useful information from here, not query form the third-part to make it faster
    const CCSF_INSTRUCTOR_EMAIL = {
        // origin is form https://www.ccsf.edu/directory/erlinda-legaspi but it's incorrect. we found a new one on homepage: https://sites.google.com/mail.ccsf.edu/legaspi-english/home
        'Legaspi, Erlinda': 'erlinda.legaspi@mail.ccsf.edu',
        'Nguyen, Sean': 'snguyen@ccsf.edu',
        'Potter, Jonathan': 'jpotter@ccsf.edu',
    }

    function getCCSFTeacherInfo(professorName, professorCellElement) {
        console.debug("getCCSFTeacherInfo, professorName ", professorName)
        // In most cases, the teacher's email will not change. We should cache it permantly
        console.debug('getCCSFTeacherInfo, try to get from constant, ', CCSF_INSTRUCTOR_EMAIL[professorName]);
        let cacheKeyName = professorName + '/email';
        let cacheInstrucotEmail = CCSF_INSTRUCTOR_EMAIL[professorName] || localStorage.getItem(cacheKeyName)
        if (cacheInstrucotEmail) {
            professorCellElement.innerHTML = getEmailHTML(cacheInstrucotEmail);
            return;
        }
        let teacherInfoURL = getCCSFTeacherInfoURL(professorName);
        console.debug('getCCSFTeacherInfo, teacherInfoURL ', teacherInfoURL);
        GM_xmlhttpRequest({
            method: "GET",
            url: teacherInfoURL,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.56',
                'Accept': 'text/html',
            },
            onload: function (response) {
                console.debug('getCCSFTeacherInfo, response ', response);
                let htmlText = response.responseText;
                console.debug('getCCSFTeacherInfo, htmlText ', htmlText);
                if (!htmlText) {
                    return;
                }
                /**
                 * the example of the html template
                 *
                 *   <div class="field field--name-field-email field--type-email field--label-above">
                 <div class="field__label">Email</div>
                 <div class="field__item"><a href="mailto:cconner@ccsf.edu">cconner@ccsf.edu</a></div>
                 </div>

                 well, how can get the `<a href="mailto:cconner@ccsf.edu">cconner@ccsf.edu</a>`
                 */
                    // TODO one day, I will use the regex to do it, haha
                let emailTextSymbol = '<div class="field__label">Email</div>';
                let emailTextSymbolLength = emailTextSymbol.length;
                console.debug('getCCSFTeacherInfo, emailTextSymbolLength ', emailTextSymbolLength);
                let emailBeginIndex = htmlText.indexOf(emailTextSymbol);
                console.debug('getCCSFTeacherInfo, emailBeginIndex ', emailBeginIndex);
                let beginFindIndex = emailBeginIndex + emailTextSymbolLength - 1;
                console.debug('getCCSFTeacherInfo, beginFindIndex ', beginFindIndex);
                let emailEndIndex = htmlText.indexOf('</div>', beginFindIndex);
                console.debug('getCCSFTeacherInfo, emailEndIndex ', emailEndIndex);
                let emailHTMLTextLength = emailEndIndex - emailBeginIndex;
                console.debug('getCCSFTeacherInfo, emailHTMLTextLength ', emailHTMLTextLength);
                let emailHTMLText = htmlText.substr(emailBeginIndex, emailHTMLTextLength)
                console.debug('getCCSFTeacherInfo, emailHTMLText ', emailHTMLText);
                // now, I get `<div class=\"field__label\">Email</div>\n              <div class=\"field__item\"><a href=\"mailto:cconner@ccsf.edu\">cconner@ccsf.edu</a>`
                // I need tot get cconner@ccsf.edu
                let emailHTMLText2 = emailHTMLText.replace('<div class=\"field__label\">Email</div>\n              <div class=\"field__item\">', "");
                // <a href="mailto:cconner@ccsf.edu">cconner@ccsf.edu</a>
                console.debug('getCCSFTeacherInfo, emailHTMLText2 ', emailHTMLText2);
                // see https://blog.csdn.net/zzti_erlie/article/details/89842391
                let emailRegex = /">(.*)<\/a>/;
                let email = emailRegex.exec(emailHTMLText2)[1].trim();
                console.debug('getCCSFTeacherInfo, email ', email);
                professorCellElement.innerHTML = getEmailHTML(email);
                localStorage.setItem(cacheKeyName, email)
            }
        });
    }

    // getCCSFTeacherInfo('Conner, Constance')
    // getCCSFTeacherInfo('Legaspi, Erlinda')
    // getCCSFTeacherInfo('potter, jonathan')
    // ********************** CCSF API function end **********************

    // ********************** RMP (Rate My Professors) API function end **********************

    // ********************** RMP (Rate My Professors) API function begin **********************
    function getProfessorsURL(legacyId) {
        return getRequestURLProtocol() + 'www.ratemyprofessors.com/professor?tid=' + legacyId;
    }

    function getRMPSearchProfessorAPI() {
        return getRequestURLProtocol() + 'www.ratemyprofessors.com/graphql';
    }

    function buildRMPSearchProfessorQuery(professorName) {
        return '{"query":"query NewSearchTeachersQuery(  $query: TeacherSearchQuery!) {  newSearch {    teachers(query: $query) {      didFallback      edges {        cursor        node {          id          legacyId          firstName          lastName          school {            name            id          }          department        }      }    }  }}","variables":{"query":{"text":"' + professorName + '","schoolID":"U2Nob29sLTE4NTA="}}}';
    }

    function buildRMPGetProfessorDetailQuery(id) {
        return '{"query":"query TeacherRatingsPageQuery(  $id: ID!) {  node(id: $id) {    __typename    ... on Teacher {      id      legacyId      firstName      lastName      school {        legacyId        name        id      }      lockStatus      ...StickyHeader_teacher      ...RatingDistributionWrapper_teacher      ...TeacherMetaInfo_teacher      ...TeacherInfo_teacher      ...SimilarProfessors_teacher      ...TeacherRatingTabs_teacher    }    id  }}fragment StickyHeader_teacher on Teacher {  ...HeaderDescription_teacher  ...HeaderRateButton_teacher}fragment RatingDistributionWrapper_teacher on Teacher {  ...NoRatingsArea_teacher  ratingsDistribution {    total    ...RatingDistributionChart_ratingsDistribution  }}fragment TeacherMetaInfo_teacher on Teacher {  legacyId  firstName  lastName  department  school {    name    city    state    id  }}fragment TeacherInfo_teacher on Teacher {  id  lastName  numRatings  ...RatingValue_teacher  ...NameTitle_teacher  ...TeacherTags_teacher  ...NameLink_teacher  ...TeacherFeedback_teacher  ...RateTeacherLink_teacher}fragment SimilarProfessors_teacher on Teacher {  department  relatedTeachers {    legacyId    ...SimilarProfessorListItem_teacher    id  }}fragment TeacherRatingTabs_teacher on Teacher {  numRatings  courseCodes {    courseName    courseCount  }  ...RatingsList_teacher  ...RatingsFilter_teacher}fragment RatingsList_teacher on Teacher {  id  legacyId  lastName  numRatings  school {    id    legacyId    name    city    state    avgRating    numRatings  }  ...Rating_teacher  ...NoRatingsArea_teacher  ratings(first: 20) {    edges {      cursor      node {        ...Rating_rating        id        __typename      }    }    pageInfo {      hasNextPage      endCursor    }  }}fragment RatingsFilter_teacher on Teacher {  courseCodes {    courseCount    courseName  }}fragment Rating_teacher on Teacher {  ...RatingFooter_teacher  ...RatingSuperHeader_teacher  ...ProfessorNoteSection_teacher}fragment NoRatingsArea_teacher on Teacher {  lastName  ...RateTeacherLink_teacher}fragment Rating_rating on Rating {  comment  flagStatus  createdByUser  teacherNote {    id  }  ...RatingHeader_rating  ...RatingSuperHeader_rating  ...RatingValues_rating  ...CourseMeta_rating  ...RatingTags_rating  ...RatingFooter_rating  ...ProfessorNoteSection_rating}fragment RatingHeader_rating on Rating {  date  class  helpfulRating  clarityRating  isForOnlineClass}fragment RatingSuperHeader_rating on Rating {  legacyId}fragment RatingValues_rating on Rating {  helpfulRating  clarityRating  difficultyRating}fragment CourseMeta_rating on Rating {  attendanceMandatory  wouldTakeAgain  grade  textbookUse  isForOnlineClass  isForCredit}fragment RatingTags_rating on Rating {  ratingTags}fragment RatingFooter_rating on Rating {  id  comment  adminReviewedAt  flagStatus  legacyId  thumbsUpTotal  thumbsDownTotal  thumbs {    userId    thumbsUp    thumbsDown    id  }  teacherNote {    id  }}fragment ProfessorNoteSection_rating on Rating {  teacherNote {    ...ProfessorNote_note    id  }  ...ProfessorNoteEditor_rating}fragment ProfessorNote_note on TeacherNotes {  comment  ...ProfessorNoteHeader_note  ...ProfessorNoteFooter_note}fragment ProfessorNoteEditor_rating on Rating {  id  legacyId  class  teacherNote {    id    teacherId    comment  }}fragment ProfessorNoteHeader_note on TeacherNotes {  createdAt  updatedAt}fragment ProfessorNoteFooter_note on TeacherNotes {  legacyId  flagStatus}fragment RateTeacherLink_teacher on Teacher {  legacyId  numRatings  lockStatus}fragment RatingFooter_teacher on Teacher {  id  legacyId  lockStatus  isProfCurrentUser}fragment RatingSuperHeader_teacher on Teacher {  firstName  lastName  legacyId  school {    name    id  }}fragment ProfessorNoteSection_teacher on Teacher {  ...ProfessorNote_teacher  ...ProfessorNoteEditor_teacher}fragment ProfessorNote_teacher on Teacher {  ...ProfessorNoteHeader_teacher  ...ProfessorNoteFooter_teacher}fragment ProfessorNoteEditor_teacher on Teacher {  id}fragment ProfessorNoteHeader_teacher on Teacher {  lastName}fragment ProfessorNoteFooter_teacher on Teacher {  legacyId  isProfCurrentUser}fragment SimilarProfessorListItem_teacher on RelatedTeacher {  legacyId  firstName  lastName  avgRating}fragment RatingValue_teacher on Teacher {  avgRating  numRatings  ...NumRatingsLink_teacher}fragment NameTitle_teacher on Teacher {  id  firstName  lastName  department  school {    legacyId    name    id  }  ...TeacherDepartment_teacher  ...TeacherBookmark_teacher}fragment TeacherTags_teacher on Teacher {  lastName  teacherRatingTags {    legacyId    tagCount    tagName    id  }}fragment NameLink_teacher on Teacher {  isProfCurrentUser  id  legacyId  firstName  lastName  school {    name    id  }}fragment TeacherFeedback_teacher on Teacher {  numRatings  avgDifficulty  wouldTakeAgainPercent}fragment TeacherDepartment_teacher on Teacher {  department  departmentId  school {    legacyId    name    id  }}fragment TeacherBookmark_teacher on Teacher {  id  isSaved}fragment NumRatingsLink_teacher on Teacher {  numRatings  ...RateTeacherLink_teacher}fragment RatingDistributionChart_ratingsDistribution on ratingsDistribution {  r1  r2  r3  r4  r5}fragment HeaderDescription_teacher on Teacher {  id  firstName  lastName  department  school {    legacyId    name    city    state    id  }  ...TeacherTitles_teacher  ...TeacherBookmark_teacher}fragment HeaderRateButton_teacher on Teacher {  ...RateTeacherLink_teacher}fragment TeacherTitles_teacher on Teacher {  department  school {    legacyId    name    id  }}","variables":{"id":"' + id + '"}}';
    }

    // set extParams a default value, otherwise it will display undefined
    function setInstructorElement(professorName, changeHerfElement, url, extParams = '') {
        console.debug('setInstructorElement, professorName', professorName);
        console.debug('setInstructorElement, changeHerfElement', changeHerfElement);
        console.debug('setInstructorElement, extParams', extParams);
        if (changeHerfElement) {
            // remove the origin innerHTML
            changeHerfElement.innerHTML = '';
            console.debug('searchProfessorByRMP, remove the origin innerHTML');
            let aElement = document.createElement('a');
            aElement.setAttribute('href', url);
            aElement.setAttribute('target', '_blank');
            // NOTE: DONT use innerText here, because I want to contain the html characters in extParams
            aElement.innerHTML = professorName + extParams;
            changeHerfElement.appendChild(aElement);
        }
    }

    function getProfessRateShowFormat(avgRating, numRatings, avgDifficulty) {
        console.debug(`getProfessRateShowFormat, avgRating ${avgRating}, numRatings ${numRatings}, avgDifficulty ${avgDifficulty}`)
        // TODO we should also use the numRatings, not only the avgRating
        // >= 4.8: orange
        // 4.0 - 4.7: purple
        // 3.0 - 3.9: blue
        // 2.0 - 2.9: green
        // < 2.0: grey (don't user white, since the in the page cannot see)
        if (avgRating >= 4.8) {
            avgRating = '<span style="color: orange;">' + avgRating + '</span>';
        } else if (avgRating >= 4.0) {
            avgRating = '<span style="color: purple;">' + avgRating + '</span>';
        } else if (avgRating >= 3.0) {
            avgRating = '<span style="color: blue;">' + avgRating + '</span>';
        } else if (avgRating >= 2.0) {
            avgRating = '<span style="color: green;">' + avgRating + '</span>';
        } else {
            avgRating = '<span style="color: grey;">' + avgRating + '</span>';
        }
        let showScores = avgRating + ' / 5';
        if (numRatings <= 0) {
            showScores = 'N/A';
        }
        if (avgDifficulty <= 0) {
            avgDifficulty = 'N/A';
        }
        let htmlFormat = '<br>' + showScores + '<br>' + numRatings + ' Ratings' + '<br>' + avgDifficulty + ' Difficulty';
        console.debug("getProfessRateShowFormat, htmlFormat ", htmlFormat)
        return htmlFormat;
    }

    function searchProfessorDataHandler(teacher, professorName, changeHerfElement, requestURL) {
        let teacherProperty = teacher.node;
        console.debug('searchProfessorByRMP, teacherProperty ', teacherProperty);
        // legacyId: 2445727
        let legacyId = teacherProperty.legacyId;
        console.debug('searchProfessorByRMP, legacyId ', legacyId);
        // department: "Computer amp Informational Tech."
        let department = teacherProperty.department;
        console.debug('searchProfessorByRMP, department ', department);
        // firstName: "Jonathan"
        let firstName = teacherProperty.firstName;
        console.debug('searchProfessorByRMP, firstName ', firstName);
        // lastName: "Potter"
        let lastName = teacherProperty.lastName;
        console.debug('searchProfessorByRMP, lastName ', lastName);
        // id: "VGVhY2hlci0yNDQ1NzI3"
        let id = teacherProperty.id;
        console.debug('searchProfessorByRMP, id ', id);

        let professionPageURL = getProfessorsURL(legacyId);
        console.debug('searchProfessorByRMP, professionPageURL ', professionPageURL);

        localStorage.setItem(professorName, JSON.stringify(teacherProperty));

        setInstructorElement(professorName, changeHerfElement, professionPageURL);

        // use the id to get the professor detail
        // TODO get from cache first, maybe have cache from local
        let searchProfessorDetailData = buildRMPGetProfessorDetailQuery(id);
        GM_xmlhttpRequest({
            method: "POST",
            url: requestURL,
            headers: {
                'Authorization': RMP_AUTHORIZATION_KEY,
                'Content-Type': 'text/plain',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.56',
                'Accept': 'application/json',
            },
            data: searchProfessorDetailData,
            onload: function (response) {
                console.debug('searchProfessorByRMP, professorDetail, response ', response);
                let jsonText = response.responseText;
                console.debug('searchProfessorByRMP, professorDetail, jsonText ', jsonText);
                let dataObj = JSON.parse(jsonText);
                console.debug('searchProfessorByRMP, professorDetail, dataObj ', dataObj);
                let professorDetail = dataObj.data.node;
                console.debug('searchProfessorByRMP, professorDetail ', professorDetail);

                if (!professorDetail) {
                    console.debug('searchProfessorByRMP, professorDetail is null ', professorDetail);
                    return;
                }

                // avgRating: 2.3
                let avgRating = professorDetail.avgRating;
                console.debug('searchProfessorByRMP, professorDetail, avgRating', avgRating);
                // avgDifficulty: 2
                let avgDifficulty = professorDetail.avgDifficulty;
                console.debug('searchProfessorByRMP, professorDetail, avgDifficulty', avgDifficulty);
                // numRatings: 4
                let numRatings = professorDetail.numRatings;
                console.debug('searchProfessorByRMP, professorDetail, numRatings', numRatings);

                store.set(id, jsonText);

                setInstructorElement(professorName, changeHerfElement, professionPageURL, getProfessRateShowFormat(avgRating, numRatings, avgDifficulty));
            }
        })
    }

    /**
     * NOTE: Some professors' name is different from their name on RMP or they have multi name on RMP.
     *
     * e.g. Luttrell, Maximilian have 'Max Luttrell' and 'Maximilian Luttrell'. But 'Max Luttrell' is a detailed one. So we should use this one.
     */
    const RMP_PROFESSOR_NAME_REFLECTION = {
        // 'Name On Schedule Planner': 'Name On RMP',
        'Luttrell, Maximilian': 'Max Luttrell',
        'Maximilian Luttrell': 'Max Luttrell',

        'Bacsierra, Benjamin': 'B Bacsierra',
        'Benjamin Bacsierra': 'B Bacsierra',

        'Cannon, Joseph': 'Joe Cannon',
        'Joseph Cannon': 'Joe Cannon',

        'Sam Johnson': 'Samuel Johnson',
        'Sean Laughlin': 'Sean M Laughlin',
        'Sheri Miraglia': 'Sheri J Miraglia',
        'David Palaita': 'David (vika) Palaita',
        'Shelly Collins Rawle': 'Shelly-Ann Collins Rawle',
        'Samuel Bowne': 'Sam Bowne',
        'Mike McKeever': 'M McKeever',
        'Dan Smith': 'Daniel Smith',
        'Jill Evans': 'Jill Evans (Johnsen)',
    }

    function searchProfessorByRMP(professorName, changeHerfElement) {
        console.debug('invoke searchProfessorByRMP');
        console.debug('searchProfessorByRMP, professorName', professorName);
        console.debug('searchProfessorByRMP, changeHerfElement', changeHerfElement);

        let requestURL = getRMPSearchProfessorAPI();
        console.debug('searchProfessorByRMP, requestURL', requestURL);
        let localStorageProfessorPropertyJSON = localStorage.getItem(professorName);
        console.debug('searchProfessorByRMP, localStorageProfessorPropertyJSON', localStorageProfessorPropertyJSON);

        if (localStorageProfessorPropertyJSON) {
            console.debug('searchProfessorByRMP, nice, found the data from localStorage, not invoke from third-party!');
            let localStorageProfessorProperty = JSON.parse(localStorageProfessorPropertyJSON);
            console.debug('searchProfessorByRMP, localStorageProfessorProperty', localStorageProfessorProperty);
            let url = getProfessorsURL(localStorageProfessorProperty.legacyId);
            console.debug('searchProfessorByRMP, url', url)
            setInstructorElement(professorName, changeHerfElement, url);
            // add data
            let id = localStorageProfessorProperty.id;
            console.debug('searchProfessorByRMP, id', id);
            // detail may expire, if expire, get from api
            let storeProfessorDetail = store.get(id);
            console.debug('searchProfessorByRMP, storeProfessorDetail', storeProfessorDetail);
            if (!storeProfessorDetail || !storeProfessorDetail.value) {
                console.debug('searchProfessorByRMP, !storeProfessorDetail || !storeProfessorDetail.value')
                let searchProfessorDetailData = buildRMPGetProfessorDetailQuery(id);
                GM_xmlhttpRequest({
                    method: "POST",
                    url: requestURL,
                    headers: {
                        'Authorization': RMP_AUTHORIZATION_KEY,
                        'Content-Type': 'text/plain',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.56',
                        'Accept': 'application/json',
                    },
                    data: searchProfessorDetailData,
                    onload: function (response) {
                        console.debug('searchProfessorByRMP, professorDetail, response', response);
                        let jsonText = response.responseText;
                        console.debug('searchProfessorByRMP, professorDetail, jsonText', jsonText);
                        let dataObj = JSON.parse(jsonText);
                        console.debug('searchProfessorByRMP, professorDetail, dataObj', dataObj);
                        let professorDetail = dataObj.data.node;
                        console.debug('searchProfessorByRMP, professorDetail', professorDetail);

                        if (!professorDetail) {
                            console.debug('searchProfessorByRMP, professorDetail is null', professorDetail);
                            return;
                        }

                        // avgRating: 2.3
                        let avgRating = professorDetail.avgRating;
                        console.debug('searchProfessorByRMP, professorDetail, avgRating', avgRating);

                        // avgDifficulty: 2
                        let avgDifficulty = professorDetail.avgDifficulty;
                        console.debug('searchProfessorByRMP, professorDetail, avgDifficulty', avgDifficulty);

                        // numRatings: 4
                        let numRatings = professorDetail.numRatings;
                        console.debug('searchProfessorByRMP, professorDetail, numRatings', numRatings);

                        store.set(id, jsonText);

                        setInstructorElement(professorName, changeHerfElement, url, getProfessRateShowFormat(avgRating, numRatings, avgDifficulty));
                    }
                });
                return;
            } else {
                let localStorageProfessorDetailJSON = storeProfessorDetail.value;
                console.debug('searchProfessorByRMP, localStorageProfessorDetailJSON', localStorageProfessorDetailJSON);

                let localStorageProfessorDetail = JSON.parse(localStorageProfessorDetailJSON);
                console.debug('searchProfessorByRMP, localStorageProfessorDetail', localStorageProfessorDetail);

                let avgRating = localStorageProfessorDetail.data.node.avgRating;
                console.debug('searchProfessorByRMP, avgRating', avgRating);

                let avgDifficulty = localStorageProfessorDetail.data.node.avgDifficulty;
                console.debug('searchProfessorByRMP, avgDifficulty', avgDifficulty);

                let numRatings = localStorageProfessorDetail.data.node.numRatings;
                console.debug('searchProfessorByRMP, numRatings', numRatings);

                setInstructorElement(professorName, changeHerfElement, url, getProfessRateShowFormat(avgRating, numRatings, avgDifficulty));
                return;
            }
        }

        let searchProfessorName = RMP_PROFESSOR_NAME_REFLECTION[professorName] || professorName;
        console.debug('searchProfessorByRMP, professorName', professorName)
        console.debug('searchProfessorByRMP, RMP_PROFESSOR_NAME_REFLECTION[professorName]', RMP_PROFESSOR_NAME_REFLECTION[professorName])
        console.debug('searchProfessorByRMP, searchProfessorName', searchProfessorName)

        let ignoreMultiResult = false;
        if (RMP_PROFESSOR_NAME_REFLECTION[professorName]) {
            ignoreMultiResult = true
        }

        let requestData = buildRMPSearchProfessorQuery(searchProfessorName);
        console.debug('searchProfessorByRMP, requestData', requestData);
        GM_xmlhttpRequest({
            method: "POST",
            url: requestURL,
            headers: {
                'Authorization': RMP_AUTHORIZATION_KEY,
                'Content-Type': 'text/plain',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.56',
                'Accept': 'application/json',
            },
            data: requestData,
            onload: function (response) {
                console.debug('searchProfessorByRMP, response', response);
                let jsonText = response.responseText;
                console.debug('searchProfessorByRMP, jsonText', jsonText);
                let dataObj = JSON.parse(jsonText);
                console.debug('searchProfessorByRMP, dataObj', dataObj);
                let teachers = dataObj.data.newSearch.teachers.edges;
                console.debug('searchProfessorByRMP, teachers', teachers);

                let teacher;
                if (teachers.length > 1) {
                    console.warn('searchProfessorByRMP, teachers.length > 1, teachers', teachers);
                    let sameNameProfessors = [];
                    for (let t of teachers) {
                        console.debug('searchProfessorByRMP, strictCheckName, t:', t);
                        let resultProfessorFirstName = t.node.firstName
                        let resultProfessorLastName = t.node.lastName
                        let resultProfessorLegacyId = t.node.legacyId
                        console.debug(`searchProfessorByRMP, resultProfessorFirstName: ${resultProfessorFirstName}, resultProfessorLastName: ${resultProfessorLastName}`)
                        let resultProfessorFullName = `${resultProfessorFirstName}${resultProfessorLastName}`.replaceAll(' ','').toLowerCase().trim();
                        let searchProfessorFullName = searchProfessorName.replaceAll(' ', '').toLowerCase().trim();
                        console.debug(`searchProfessorByRMP, resultProfessorFullName: ${resultProfessorFullName}, searchProfessorFullName: ${searchProfessorFullName}`)
                        if (resultProfessorFullName === searchProfessorFullName) {
                            console.debug('searchProfessorByRMP, strictCheckName, found! t:', t)
                            sameNameProfessors.push(t);

                            // If this name exists in constant pool, we should use it directly
                            if (ignoreMultiResult) {
                                console.debug('searchProfessorByRMP, strictCheckName, ignoreMultiResult, found! teacher:', t)
                                sameNameProfessors = [t];
                                break;
                            }
                        }
                    }

                    if (ignoreMultiResult) {
                        teacher = teachers[0];
                        console.debug(`searchProfessorByRMP, strictCheckName, ignoreMultiResult, found! teacher: ${teacher}`)
                    } else {
                        // order by legacyId (represent the time created in database)
                        teachers = sameNameProfessors.sort((a, b) => a.node.legacyId - b.node.legacyId);
                        console.debug('searchProfessorByRMP, teachers.length > 1, order by legacyId, teachers:', teachers)
                        teacher = teachers[0];
                        console.debug('searchProfessorByRMP, order by legacyId, teacher:', teacher)
                    }
                } else if (teachers.length === 1) {
                    teacher = teachers[0];
                }

                console.debug('searchProfessorByRMP, teacher', teacher);
                // cannot search any info for the teacher in RMP
                if (!teacher) {
                    console.warn(`searchProfessorByRMP, cannot search any info for teacher: ${professorName}`);
                    console.log('searchProfessorByRMP, try to search by LastName')

                    let professorLastName = professorName.split(',')[0];

                    console.debug('searchProfessorByRMP, professorLastName: ', professorLastName);
                    requestData = buildRMPSearchProfessorQuery(professorLastName);
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: requestURL,
                        headers: {
                            'Authorization': RMP_AUTHORIZATION_KEY,
                            'Content-Type': 'text/plain',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.56',
                            'Accept': 'application/json',
                        },
                        data: requestData,
                        onload: function (response) {
                            console.debug('searchProfessorByRMP2, response', response);
                            let jsonText = response.responseText;
                            console.debug('searchProfessorByRMP2, jsonText', jsonText);
                            let dataObj = JSON.parse(jsonText);
                            console.debug('searchProfessorByRMP2, dataObj', dataObj);
                            let teachers = dataObj.data.newSearch.teachers.edges;
                            console.debug('searchProfessorByRMP2, teachers', teachers);

                            if (teachers.length > 1) {
                                console.warn('searchProfessorByRMP2, teachers.length > 1, teachers', teachers);
                                return;
                            }
                            teacher = teachers[0];
                            console.debug('searchProfessorByRMP2, teacher', teacher);
                            // cannot search any info for the teacher in RMP
                            if (!teacher) {
                                console.warn(`searchProfessorByRMP2, cannot search any info for teacher: ${professorName}`);
                                console.log('searchProfessorByRMP2, try to search by FirstName')

                                let professorFirstName = professorName.split(',')[1];
                                console.debug('searchProfessorByRMP3, professorFirstName:', professorFirstName);
                                requestData = buildRMPSearchProfessorQuery(professorFirstName);
                                GM_xmlhttpRequest({
                                    method: "POST",
                                    url: requestURL,
                                    headers: {
                                        'Authorization': RMP_AUTHORIZATION_KEY,
                                        'Content-Type': 'text/plain',
                                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.56',
                                        'Accept': 'application/json',
                                    },
                                    data: requestData,
                                    onload: function (response) {
                                        console.debug('searchProfessorByRMP3, response', response);
                                        let jsonText = response.responseText;
                                        console.debug('searchProfessorByRMP3, jsonText', jsonText);
                                        let dataObj = JSON.parse(jsonText);
                                        console.debug('searchProfessorByRMP3, dataObj', dataObj);
                                        let teachers = dataObj.data.newSearch.teachers.edges;
                                        console.debug('searchProfessorByRMP3, teachers', teachers);

                                        if (teachers.length > 1) {
                                            console.warn('searchProfessorByRMP3, teachers.length > 1, teachers', teachers);
                                            return;
                                        }
                                        teacher = teachers[0];
                                        console.debug('searchProfessorByRMP3, teacher', teacher);
                                        // cannot search any info for the teacher in RMP
                                        if (!teacher) {
                                            console.warn(`searchProfessorByRMP3, cannot search any info for teacher: ${professorName}`);
                                            console.log('searchProfessorByRMP3, try to search by LastName')

                                            return;
                                        }
                                        searchProfessorDataHandler(teacher, professorName, changeHerfElement, requestURL)
                                    }
                                })
                            } else {
                                searchProfessorDataHandler(teacher, professorName, changeHerfElement, requestURL)
                            }
                        }
                    })
                } else {
                    searchProfessorDataHandler(teacher, professorName, changeHerfElement, requestURL)
                }
            }
        })
    }

    //searchProfessorByRMP('Conner, Constance')
    // ********************** RMP (Rate My Professors) API function end **********************

    // ---------------------- Third-party API function end ----------------------

    // ---------------------- Schedule Planner function begin ----------------------
    function getScheduleByCRN(crn) {
        console.debug('getScheduleByCRN, crn', crn);
        let scheduleJSONData = localStorage.getItem('generate-request');
        console.debug('getScheduleByCRN, scheduleJSONData' + scheduleJSONData);
        let scheduleData = JSON.parse(scheduleJSONData);
        console.debug('getScheduleByCRN, scheduleData', scheduleData);
        let scheduleDataSections = scheduleData.sections;
        for (let scheduleDataSection of scheduleDataSections) {
            console.debug('getScheduleByCRN, scheduleDataSection', scheduleDataSection);
            if (scheduleDataSection.id === crn) {
                console.debug('getScheduleByCRN, scheduleDataSection.id === crn, crn', crn);
                return scheduleDataSection;
            }
        }
    }

    function getRegBlocksByCRN(crn) {
        console.debug('getRegBlocksByCRN, parameter, crn', crn)
        let jsonData = localStorage.getItem('regblocks')
        console.debug('getRegBlocksByCRN, jsonData', jsonData)
        let data = JSON.parse(jsonData)
        console.debug('getRegBlocksByCRN, data', data)
        let scheduleDataSections = data.sections;
        for (let scheduleDataSection of scheduleDataSections) {
            console.debug('getRegBlocksByCRN, scheduleDataSection', scheduleDataSection);
            if (scheduleDataSection.id === crn) {
                console.debug('getRegBlocksByCRN, scheduleDataSection.id === crn, crn', crn);
                return scheduleDataSection;
            }
        }
    }

    // ---------------------- Schedule Planner function end ----------------------

    // ====================== global functions end ======================

    // TODO the format is not correctly displayed, when print out to console, the format will messy, emmm...
    console.log(`
    ____ ____ ____  _____ ____  ____  _   _ 
    / ___/ ___/ ___||  ___/ ___||  _ \| | | |
   | |  | |   \___ \| |_  \___ \| |_) | |_| |
   | |__| |___ ___) |  _|  ___) |  __/|  _  |
    \____\____|____/|_|   |____/|_|   |_| |_|
                                             
Welcome to use CCSFSPH :)
GitHub: https://github.com/ccsfsph/ccsf-schedule-planner-helper
Any question, feedback contact us at: https://github.com/ccsfsph/ccsf-schedule-planner-helper/issues
You can also contact us at: ccsfsph@gmail.com
`);
    console.log('load CCSFSPH success!');

    window.onload = function () {
        console.debug("window.onload()");

        g_pageLoadFinish = true;
        // TODO open the page, may be not render finish, it will cause cannot find the element, emmm....
    }

    // NOTE: only use setInterval method can work when the page location change,
    // I also try to use event listner, but it doesn't work, I guess because the website use href to change location instead of hash.
    // plus, click the `generate` button to change href address is not working as well (I am also curious why?)
    // This method can work, but low efficiency (sam left).
    setInterval(function () {
        console.debug("page detector works! invoke for every " + pageRefreshInterval + " ms");
        if (g_pageLoadFinish) {
            console.debug("page load finish, begin to render page");
            updateUserSwitchPotentialSchedulePage();
            let flag = (!g_isFirstLoadSuccess && isTablePage());
            console.debug("g_pageLoadFinish, flag, ", flag);

            if (PAGE === PAGE_COURSE_SCHEDULE) {
                console.debug("setInterval, PAGE === PAGE_COURSE_SCHEDULE, g_initCoursePageEventFlag:", g_initCoursePageEventFlag)
                if (!g_initCoursePageEventFlag) {
                    let barElementInitResult = false;
                    let switchTabElementInitResult = false;
                    let advancedFilterSaveButtonInitResult = false;
                    let advancedFilterCloseButtonInitResult = false;

                    let barElements = document.getElementsByClassName(TABLE_SWITCH_PAGE_BAR_CLASS_NAME);
                    console.debug("setInterval, barElements ", barElements);
                    if (barElements) {
                        let barElement = barElements[0];
                        console.debug("setInterval, barElement ", barElement);
                        if (barElement) {
                            let buttonElements = barElement.getElementsByTagName('button');
                            console.debug("setInterval, buttonElements ", buttonElements);
                            if (buttonElements) {
                                for (let buttonElement of buttonElements) {
                                    console.debug("setInterval, buttonElement ", buttonElement)
                                    buttonElement.onclick = function () {
                                        console.debug("setInterval, buttonElement.onclick")
                                        g_isSwitchCoursePageFinish = false;
                                        console.debug("setInterval, buttonElement.onclick, g_isSwitchCoursePageFinish = false")
                                    }
                                }
                                barElementInitResult = true;
                                console.debug("setInterval, barElementInitResult = true")
                            }
                        }
                    }

                    // switch tab
                    let switchTabListElements = document.getElementsByClassName("css-ta6bli-tabCss nav nav-tabs pull-left");
                    console.debug("setInterval, switchTabListElements ", switchTabListElements)
                    if (switchTabListElements) {
                        let switchTabListElement = switchTabListElements[0];
                        console.debug("setInterval, switchTabListElement ", switchTabListElement)
                        if (switchTabListElement) {
                            let switchTabListLiElements = switchTabListElement.getElementsByTagName("li")
                            console.debug("setInterval, switchTabListLiElements ", switchTabListLiElements)
                            if (switchTabListLiElements) {
                                for (let switchTabListLiElement of switchTabListLiElements) {
                                    console.debug("setInterval, switchTabListLiElement ", switchTabListLiElement)
                                    switchTabListLiElement.onclick = function () {
                                        console.debug("setInterval, switchTabListLiElement.onclick")
                                        g_isSwitchCoursePageFinish = false;
                                        console.debug("setInterval, switchTabListLiElement.onclick, g_isSwitchCoursePageFinish = false")
                                        // when click the switch tab, the switch page button event will be removed, since we need to rerender again!
                                        g_initCoursePageEventFlag = false;
                                        console.debug("setInterval, switchTabListLiElement.onclick, g_initCoursePageEventFlag = false");
                                    }
                                }
                                switchTabElementInitResult = true;
                                console.debug("setInterval, switchTabElementInitResult = true")
                            }
                        }
                    }

                    // Advanced Filters
                    // <button aria-label="" class=" css-1m89de3-hoverStyles-hoverStyles-defaultStyle-centerBlockCss" type="submit"><span aria-hidden="true" class="fa fa-check  css-i5lou9-iconCss"></span><span class="css-1q6wcnd-innerStyle">Save Filters</span></button>
                    let advancedFiltersElements = document.getElementsByClassName(ADVANCED_FILTER_SAVE_BUTTON_CLASS_NAME);
                    console.debug("setInterval, advancedFiltersElements ", advancedFiltersElements)
                    if (advancedFiltersElements) {
                        let advancedFiltersElement = advancedFiltersElements[0];
                        console.debug("setInterval, advancedFiltersElement ", advancedFiltersElement)
                        if (advancedFiltersElement) {
                            advancedFiltersElement.onclick = function () {
                                console.debug("setInterval, advancedFiltersElement.onclick")
                                g_isSwitchCoursePageFinish = false;
                                console.debug("setInterval, switchTabListLiElement.onclick, g_isSwitchCoursePageFinish = false")
                                // when click the switch tab, the switch page button event will be removed, since we need to rerender again!
                                g_initCoursePageEventFlag = false;
                                console.debug("setInterval, advancedFiltersElement.onclick, g_initCoursePageEventFlag = false");
                            }
                            advancedFilterSaveButtonInitResult = true;
                            console.debug("setInterval, advancedFilterSaveButtonInitResult = true")
                        }
                    }

                    // Advanced Filter close button
                    // <button type="button" aria-label="Close Advanced Filters Panel" class="css-vqzzza-closeCss"><span aria-hidden="true">×</span></button>
                    let advancedFiltersCloseElements = document.getElementsByClassName(ADVANCED_FILTER_CLOSE_BUTTON_CLASS_NAME);
                    console.debug("setInterval, advancedFiltersCloseElements ", advancedFiltersCloseElements)
                    if (advancedFiltersCloseElements) {
                        let advancedFiltersCloseElement = advancedFiltersCloseElements[0];
                        console.debug("setInterval, advancedFiltersCloseElement ", advancedFiltersCloseElement)
                        if (advancedFiltersCloseElement) {
                            advancedFiltersCloseElement.onclick = function () {
                                console.debug("setInterval, advancedFiltersCloseElement.onclick")
                                g_isSwitchCoursePageFinish = false;
                                console.debug("setInterval, advancedFiltersCloseElement.onclick, g_isSwitchCoursePageFinish = false")
                                // when click the switch tab, the switch page button event will be removed, since we need to rerender again!
                                g_initCoursePageEventFlag = false;
                                console.debug("setInterval, advancedFiltersCloseElement.onclick, g_initCoursePageEventFlag = false");
                            }
                            advancedFilterCloseButtonInitResult = true;
                            console.debug("setInterval, advancedFilterCloseButtonInitResult = true")
                        }
                    }

                    g_initCoursePageEventFlag = barElementInitResult && switchTabElementInitResult && advancedFilterSaveButtonInitResult && advancedFilterCloseButtonInitResult;
                }
            }

            if (isTablePage() && !g_isUpdateLocationChangeFinish || flag || !g_isSwitchCoursePageFinish) {
                handleSchedulePlannerPage();
            }
        } else {
            console.debug("page not load finish, waiting for next time invoke");
        }
    }, pageRefreshInterval);

    function getSeatsRateShowFormat(seatsRate) {
        console.debug(`getSeatsRateShowFormat, seatsRate ${seatsRate}`)
        let htmlFormat = ''

        // >= 90%: orange
        // 80% - 89.99%: purple
        // 70%: - 79.99%: blue
        // 60% - 69.99%: green
        // < 2.0: grey (don't user white, since the in the page cannot see)
        if (seatsRate >= 90) {
            htmlFormat = '<span style="color: orange;">' + seatsRate + '%' + '</span>';
        } else if (seatsRate >= 80) {
            htmlFormat = '<span style="color: purple;">' + seatsRate + '%' + '</span>';
        } else if (seatsRate >= 70) {
            htmlFormat = '<span style="color: blue;">' + seatsRate + '%' + '</span>';
        } else if (seatsRate >= 60) {
            htmlFormat = '<span style="color: green;">' + seatsRate + '%' + '</span>';
        } else {
            htmlFormat = '<span style="color: grey;">' + seatsRate + '%' + '</span>';
        }

        console.debug("getSeatsRateShowFormat, htmlFormat", htmlFormat)
        return htmlFormat
    }

    function showCurrentSchedule(tHeadElement, instructorRowIndex) {
        console.debug('showCurrentSchedule, parameter, tHeadElement ', tHeadElement);
        console.debug('showCurrentSchedule, parameter, instructorRowIndex ', instructorRowIndex);

        // now, let us get the real name for each row
        for (let tHeadElementRow of tHeadElement.rows) {
            console.debug('showCurrentSchedule, tHeadElementRow ', tHeadElementRow);
        }

        let tableElements = tHeadElement.parentElement;
        console.debug('showCurrentSchedule, tableElements ', tableElements);
        let tableBodyElements = tableElements.getElementsByTagName('tbody');
        console.debug('showCurrentSchedule, tableBodyElements ', tableBodyElements);
        let instructorName;

        // add column first
        // Actually, we should use the loop above. But i'm tired now... just copy it from showPotentialSchedule
        let tableHeadthRows = tHeadElement.rows[0];
        console.debug('showCurrentSchedule, tableHeadthRows', tableHeadthRows);
        let tableHeadColumnindex = -1;
        let instructorIndex = -1;
        let tableHeadthRowsThElements = tableHeadthRows.getElementsByTagName('th');
        let tableHeadTotalCell = tableHeadthRowsThElements.length;
        let instrcutorEmailCellIndex = -1;
        let seatsOpenCellIndex = -1;
        let crnCellIndex = -1;
        console.debug('showCurrentSchedule, tableHeadTotalCell ', tableHeadTotalCell);

        for (let tableHeadthRow of tableHeadthRowsThElements) {
            tableHeadColumnindex++;
            console.debug('showCurrentSchedule, tableHeadColumnindex', tableHeadColumnindex);
            console.debug('showCurrentSchedule, tableHeadthRow', tableHeadthRow);
            // display order: Seats Capacity、Seats Open、Seats Filled
            // first, add 'Seats Capacity' before 'Seats Open'
            if (tableHeadthRow.innerText === 'Instructor') {
                instructorIndex = tableHeadColumnindex;
            }
            if (tableHeadthRow.innerText === 'Instructor Email') {
                instrcutorEmailCellIndex = tableHeadColumnindex;
            }

            if (tableHeadthRow.innerText === 'Seats Open') {
                seatsOpenCellIndex = tableHeadColumnindex;
            }

            if (tableHeadthRow.innerText === 'CRN #') {
                crnCellIndex = tableHeadColumnindex;
            }
        }
        console.debug('showCurrentSchedule, instructorIndex', instructorIndex);

        if (instrcutorEmailCellIndex === -1) {
            tableHeadTotalCell += 1;
            // Add after `Instructor` column
            // NOTE: since the appendChild will at to the last, but insertCell cannot assign the tag name
            // let emailCapacityCell = tableHeadthRows.insertCell(instructorIndex + 1);
            let emailCapacityCell = document.createElement('th');
            emailCapacityCell.index = instructorIndex + 1;
            emailCapacityCell.setAttribute('class', TABLE_HEAD_TH_CELL_CLASS_NAME)
            tableHeadthRows.appendChild(emailCapacityCell)
            console.debug('showCurrentSchedule, emailCapacityCell', emailCapacityCell);
            emailCapacityCell.innerText = 'Instructor Email';
            g_instructorEmailColumnIndex = emailCapacityCell.cellIndex;
            g_tableHeadTotalCell = tableHeadTotalCell;
            g_instructorColumnIndex = instructorIndex;
            console.debug("showCurrentSchedule, g_tableHeadTotalCell, ", g_tableHeadTotalCell);
            console.debug("showCurrentSchedule, g_instructorEmailColumnIndex, ", g_instructorEmailColumnIndex);
        }

        // add instructor email here
        instructorEmailCellAddData(tHeadElement, instrcutorEmailCellIndex);

        for (let tableBodyElement of tableBodyElements) {
            console.debug('showCurrentSchedule, tableBodyElement ', tableBodyElement);
            let tableBodyElementTrs = tableBodyElement.getElementsByTagName('tr');
            console.debug('showCurrentSchedule, tableBodyElementTrs ', tableBodyElementTrs);
            // get the first only, contain the table head data
            let tableBodyElementTr = tableBodyElementTrs[0];
            console.debug('showCurrentSchedule, tableBodyElementTr ', tableBodyElementTr);
            let tableBodyElementTrTd = tableBodyElementTr.getElementsByTagName('td');
            console.debug('showCurrentSchedule, tableBodyElementTrTd ', tableBodyElementTrTd)

            let instrctorNameElement = tableBodyElementTrTd[instructorRowIndex];
            console.debug('showCurrentSchedule, instrctorNameElement ', instrctorNameElement);

            // add seatsTotal to seats open cell
            if (seatsOpenCellIndex !== -1) {
                console.debug('showCurrentSchedule, seatsOpenCellIndex', seatsOpenCellIndex)
                let seatsOpenElement = tableBodyElementTrTd[seatsOpenCellIndex]
                console.debug('showCurrentSchedule, seatsOpenElement', seatsOpenElement)
                let crnElement = tableBodyElementTrTd[crnCellIndex]
                console.debug('showCurrentSchedule, crnElement', crnElement)
                console.debug('showCurrentSchedule, crnElement.innerText', crnElement.innerText)
                console.debug('showCurrentSchedule, crnElement.innerText', getRegBlocksByCRN(crnElement.innerText))

                let regBlocks = getRegBlocksByCRN(crnElement.innerText)
                console.debug('showCurrentSchedule, regBlocks', regBlocks)

                let seatsCapacity = regBlocks.seatsCapacity
                console.debug('showCurrentSchedule, seatsCapacity', seatsCapacity)

                let seatsOpen = seatsOpenElement.innerText
                console.debug('showCurrentSchedule, seatsOpen', seatsOpen)

                // NOTE: Prevent duplicate click on search box
                if (!isNaN(seatsOpen)) {
                    let seatsRate = ((1 - (seatsOpen / seatsCapacity)) * 100).toFixed(2)
                    seatsOpenElement.innerHTML = seatsOpen + ' / ' + seatsCapacity + '<br>' + getSeatsRateShowFormat(seatsRate)
                }
            }

            let instrctorNameElementSpans = instrctorNameElement.getElementsByTagName('span');
            console.debug('showCurrentSchedule, instrctorNameElementSpans ', instrctorNameElementSpans);
            let instrctorNameElementSpan = instrctorNameElementSpans[0];
            console.debug('showCurrentSchedule, instrctorNameElementSpan ', instrctorNameElementSpan);
            if (!instrctorNameElementSpan) {
                console.debug('showCurrentSchedule, skip, !instrctorNameElementSpan ', instrctorNameElementSpan);
                continue;
            }
            instructorName = instrctorNameElementSpan.innerText;
            console.debug('showCurrentSchedule, instructorName', instructorName);
            searchProfessorByRMP(instructorName, instrctorNameElementSpan);
        }
    }

    function showPotentialSchedule(tHeadElement, instructorRowIndex) {
        console.debug('showPotentialSchedule, tHeadElement ', tHeadElement);
        console.debug('showPotentialSchedule, instructorRowIndex ', instructorRowIndex);
        let tableHeadthRows = tHeadElement.rows[0];
        console.debug('showPotentialSchedule, tableHeadthRows', tableHeadthRows);
        let tableHeadColumnindex = -1;
        let seatsOpenIndex = -1;
        let crnIndex = -1;
        let tableHeadthRowsThElements = tableHeadthRows.getElementsByTagName('th');
        let tableHeadTotalCell = tableHeadthRowsThElements.length;
        console.debug('showPotentialScheduleSwitchPage, tableHeadTotalCell ', tableHeadTotalCell);
        for (let tableHeadthRow of tableHeadthRowsThElements) {
            tableHeadColumnindex++;
            console.debug('showPotentialSchedule, tableHeadColumnindex', tableHeadColumnindex);
            console.debug('showPotentialSchedule, tableHeadthRow', tableHeadthRow);
            // display order: Seats Capacity、Seats Open、Seats Filled
            // first, add 'Seats Capacity' before 'Seats Open'
            if (tableHeadthRow.innerText === 'Seats Open') {
                seatsOpenIndex = tableHeadColumnindex;
            }
            if (tableHeadthRow.innerText === 'CRN #') {
                crnIndex = tableHeadColumnindex;
            }
            if (tableHeadthRow.innerText === 'Seats Open') {
                seatsOpenIndex = tableHeadColumnindex;
            }
        }
        console.debug('showPotentialSchedule, seatsOpenIndex', seatsOpenIndex);

        tableHeadTotalCell += 1;
        let seatsCapacityCell = tableHeadthRows.insertCell(seatsOpenIndex);
        console.debug('showPotentialSchedule, seatsCapacityCell', seatsCapacityCell);
        seatsCapacityCell.innerText = 'Seats Capacity';
        g_seatsCapacityColumnIndex = seatsCapacityCell.cellIndex;
        console.debug("showPotentialSchedule, g_seatsCapacityColumnIndex, ", g_seatsCapacityColumnIndex);

        tableHeadTotalCell += 1;
        // add after `Instructor`
        let instructorEmailCell = tableHeadthRows.insertCell(seatsOpenIndex);
        console.debug('showPotentialSchedule, instructorEmailCell ', instructorEmailCell);
        instructorEmailCell.innerText = 'Instructor Email';
        g_instructorEmailColumnIndex = instructorEmailCell.cellIndex;
        console.debug("showPotentialSchedule, g_instructorEmailColumnIndex ", g_instructorEmailColumnIndex);

        tableHeadTotalCell += 1;
        let instructorCell = tableHeadthRows.insertCell(seatsOpenIndex);
        console.debug('showPotentialSchedule, instructorCell', instructorCell);
        instructorCell.innerText = 'Instructor';
        g_instructorColumnIndex = instructorCell.cellIndex;
        console.debug("showPotentialSchedule, g_instructorColumnIndex, ", g_instructorColumnIndex);

        g_tableHeadTotalCell = tableHeadTotalCell;
        g_tableHeadCrnIndex = crnIndex;
        g_tableHeadSeatsOpenIndex = seatsOpenIndex;
        potentialSheduleCellAddData(tHeadElement)
    }

    function instructorEmailCellAddData(tHeadElement, instrcutorEmailCellIndex) {
        g_isSwitchSheduleUpdateFinish = true;
        let tableHeadTotalCell = g_tableHeadTotalCell;
        let instructorEmailColumnIndex = g_instructorEmailColumnIndex
        // begin to add the data
        let tableElement = tHeadElement.parentElement;
        console.debug('showPotentialSchedule, tableElement ', tableElement);
        let tableElementBodyElements = tableElement.getElementsByTagName('tbody');
        console.debug('showPotentialSchedule, tableElementBodyElements ', tableElementBodyElements);
        for (let tableElementBodyElement of tableElementBodyElements) {
            console.debug('showPotentialSchedule, tableElementBodyElement ', tableElementBodyElement);
            // add cell data
            let tableElementBodyElementTrElement = tableElementBodyElement.getElementsByTagName('tr')[0];
            console.debug('showPotentialSchedule, tableElementBodyElementTrElement ', tableElementBodyElementTrElement);
            let tableElementBodyElementTrElementCells = tableElementBodyElementTrElement.cells;
            console.debug('showPotentialSchedule, tableElementBodyElementTrElementCells, ', tableElementBodyElementTrElementCells);
            let tableElementBodyElementTrElementCellsTotalCell = tableElementBodyElementTrElementCells.length;
            console.debug('showPotentialSchedule, tableElementBodyElementTrElementCellsTotalCell, ', tableElementBodyElementTrElementCellsTotalCell);
            if (tableElementBodyElementTrElementCellsTotalCell === tableHeadTotalCell) {
                console.debug('showPotentialSchedule, skip this body, no change');
                continue;
            }

            let instructorColumnCell = tableElementBodyElementTrElementCells[g_instructorColumnIndex];
            console.debug('instructorColumnCell, ', instructorColumnCell);
            let instructorName = instructorColumnCell.innerText;
            console.debug('instructorName, ', instructorName);

            let instructorEmailCellValueElement = document.createElement('td');
            instructorEmailCellValueElement.setAttribute('class', TABLE_DATA_TD_CELL_CLASS_NAME)
            tableElementBodyElementTrElement.appendChild(instructorEmailCellValueElement)
            // let instructorEmailCellValueElement = tableElementBodyElementTrElement.insertCell(instructorEmailColumnIndex);
            console.debug('showPotentialSchedule, instructorEmailCellValueElement ', instructorEmailCellValueElement);
            instructorEmailCellValueElement.innerText = '';

            getCCSFTeacherInfo(instructorName, instructorEmailCellValueElement);

            // expand the cell for table body
            let tableElementBodyElementTdElements = tableElementBodyElement.getElementsByTagName('td');
            console.debug('showPotentialSchedule, tableElementBodyElementTdElements ', tableElementBodyElementTdElements);
            for (let tableElementBodyElementTdElement of tableElementBodyElementTdElements) {
                console.debug('showPotentialSchedule, tableElementBodyElementTdElement ', tableElementBodyElementTdElement);
                let tableElementBodyElementTdElementAttribute = tableElementBodyElementTdElement.getAttribute('colspan');
                if (tableElementBodyElementTdElementAttribute) {
                    console.debug('showPotentialSchedule, tableElementBodyElementTdElementAttribute ', tableElementBodyElementTdElementAttribute);
                    tableElementBodyElementTdElement.setAttribute('colspan', tableHeadTotalCell);
                }
            }
        }

        // expand the body foot cell colspan
        let tableElementFootElements = tableElement.getElementsByTagName('tfoot');
        console.debug('showPotentialSchedule, tableElementFootElements ', tableElementFootElements);
        for (let tableElementFootElement of tableElementFootElements) {
            console.debug('showPotentialSchedule, tableElementFootElement ', tableElementFootElement);
            let tableElementFootElementTdElements = tableElementFootElement.getElementsByTagName('td');
            console.debug('showPotentialSchedule, tableElementFootElementTdElements ', tableElementFootElementTdElements);
            for (let tableElementFootElementTdElement of tableElementFootElementTdElements) {
                console.debug('showPotentialSchedule, tableElementFootElementTdElement ', tableElementFootElementTdElement);
                let tableElementFootElementTdElementAttribute = tableElementFootElementTdElement.getAttribute('colspan');
                if (tableElementFootElementTdElementAttribute) {
                    console.debug('showPotentialSchedule, tableElementFootElementTdElementAttribute ', tableElementFootElementTdElementAttribute);
                    // because the show num is not in the last column, that's why need to -1
                    tableElementFootElementTdElement.setAttribute('colspan', tableHeadTotalCell - 1);
                }
            }
        }
    }

    function potentialSheduleCellAddData(tHeadElement) {
        g_isSwitchSheduleUpdateFinish = true;
        let tableHeadTotalCell = g_tableHeadTotalCell;
        let crnIndex = g_tableHeadCrnIndex;
        let seatsOpenIndex = g_tableHeadSeatsOpenIndex;
        let instructorEmailColumnIndex = g_instructorEmailColumnIndex;
        // begin to add the data
        let tableElement = tHeadElement.parentElement;
        console.debug('showPotentialSchedule, tableElement ', tableElement);
        let tableElementBodyElements = tableElement.getElementsByTagName('tbody');
        console.debug('showPotentialSchedule, tableElementBodyElements ', tableElementBodyElements);
        for (let tableElementBodyElement of tableElementBodyElements) {
            console.debug('showPotentialSchedule, tableElementBodyElement ', tableElementBodyElement);
            // add cell data
            let tableElementBodyElementTrElement = tableElementBodyElement.getElementsByTagName('tr')[0];
            console.debug('showPotentialSchedule, tableElementBodyElementTrElement ', tableElementBodyElementTrElement);
            let tableElementBodyElementTrElementCells = tableElementBodyElementTrElement.cells;
            console.debug('showPotentialSchedule, tableElementBodyElementTrElementCells, ', tableElementBodyElementTrElementCells);
            let tableElementBodyElementTrElementCellsTotalCell = tableElementBodyElementTrElementCells.length;
            console.debug('showPotentialSchedule, tableElementBodyElementTrElementCellsTotalCell, ', tableElementBodyElementTrElementCellsTotalCell);
            if (tableElementBodyElementTrElementCellsTotalCell === tableHeadTotalCell) {
                console.debug('showPotentialSchedule, skip this body, no change');
                continue;
            }
            let crn = '';
            let crnCell = tableElementBodyElementTrElementCells[crnIndex];
            console.debug('showPotentialSchedule, crnCell ', crnCell);
            crn = crnCell.innerText;
            console.debug('showPotentialSchedule, crn ', crn);

            let seatsCapacityCellValueElement = tableElementBodyElementTrElement.insertCell(seatsOpenIndex);
            console.debug('showPotentialSchedule, seatsCapacityCellValueElement ', seatsCapacityCellValueElement);
            seatsCapacityCellValueElement.innerText = getScheduleByCRN(crn).seatsCapacity;

            let instructorEmailCellValueElement = tableElementBodyElementTrElement.insertCell(seatsOpenIndex);
            console.debug('showPotentialSchedule, instructorEmailCellValueElement ', instructorEmailCellValueElement);
            instructorEmailCellValueElement.innerText = '';

            let instructorCellValueElement = tableElementBodyElementTrElement.insertCell(seatsOpenIndex);
            console.debug('showPotentialSchedule, instructorCellValueElement ', instructorCellValueElement);
            // I think we have better to get the instructor name from the ! 'show questions detail' button, but it doesn't matter. since that data get from api as well
            // and instructor may have multi one, use this to keep it normal
            let instructorName = getScheduleByCRN(crn).instructor[0].name;
            console.debug('showPotentialSchedule, instructorName', instructorName);
            instructorCellValueElement.innerText = instructorName;
            searchProfessorByRMP(instructorName, instructorCellValueElement);
            getCCSFTeacherInfo(instructorName, instructorEmailCellValueElement);

            // expand the cell for table body
            let tableElementBodyElementTdElements = tableElementBodyElement.getElementsByTagName('td');
            console.debug('showPotentialSchedule, tableElementBodyElementTdElements ', tableElementBodyElementTdElements);
            for (let tableElementBodyElementTdElement of tableElementBodyElementTdElements) {
                console.debug('showPotentialSchedule, tableElementBodyElementTdElement ', tableElementBodyElementTdElement);
                let tableElementBodyElementTdElementAttribute = tableElementBodyElementTdElement.getAttribute('colspan');
                if (tableElementBodyElementTdElementAttribute) {
                    console.debug('showPotentialSchedule, tableElementBodyElementTdElementAttribute ', tableElementBodyElementTdElementAttribute);
                    tableElementBodyElementTdElement.setAttribute('colspan', tableHeadTotalCell);
                }
            }
        }

        // expand the body foot cell colspan
        let tableElementFootElements = tableElement.getElementsByTagName('tfoot');
        console.debug('showPotentialSchedule, tableElementFootElements ', tableElementFootElements);
        for (let tableElementFootElement of tableElementFootElements) {
            console.debug('showPotentialSchedule, tableElementFootElement ', tableElementFootElement);
            let tableElementFootElementTdElements = tableElementFootElement.getElementsByTagName('td');
            console.debug('showPotentialSchedule, tableElementFootElementTdElements ', tableElementFootElementTdElements);
            for (let tableElementFootElementTdElement of tableElementFootElementTdElements) {
                console.debug('showPotentialSchedule, tableElementFootElementTdElement ', tableElementFootElementTdElement);
                let tableElementFootElementTdElementAttribute = tableElementFootElementTdElement.getAttribute('colspan');
                if (tableElementFootElementTdElementAttribute) {
                    console.debug('showPotentialSchedule, tableElementFootElementTdElementAttribute ', tableElementFootElementTdElementAttribute);
                    // because the show num is not in the last column, that's why need to -1
                    tableElementFootElementTdElement.setAttribute('colspan', tableHeadTotalCell - 1);
                }
            }
        }
    }

    // in potential schedule, user switch to differnt schedule
    function showPotentialScheduleSwitchPage(tHeadElement, instructorRowIndex) {
        console.debug('showPotentialScheduleSwitchPage, tHeadElement ', tHeadElement);
        console.debug('showPotentialScheduleSwitchPage, instructorRowIndex ', instructorRowIndex);
        // the table head will not change, only change the differnt course!
        let tableHeadthRows = tHeadElement.rows[0];
        console.debug('showPotentialSchedule, tableHeadthRows', tableHeadthRows);
    }

    function handleSchedulePlannerPage() {
        g_isUpdateLocationChangeFinish = true;
        let tHeadElements = document.getElementsByClassName(TABLE_THEAD_CLASS_NAME);
        if (tHeadElements) {
            console.debug(" schedule planner page ");
            console.debug('handleSchedulePlannerPage, tHeadElements ', tHeadElements);
            let tHeadElement = tHeadElements[0];
            if (!tHeadElement) {
                return console.debug('handleSchedulePlannerPage, no tHeadElement found');
            }
            // may have more table in one page, like the index page. current scheule and saved schedule
            for (let tHeadElement of tHeadElements) {
                console.debug('handleSchedulePlannerPage, tHeadElement ', tHeadElement);
                // the first row is the table title head
                let tHeadtrElement = tHeadElement.rows[0];
                console.debug('handleSchedulePlannerPage, tHeadtrElement ', tHeadtrElement);
                let tHeadtrElementCells = tHeadtrElement.cells;
                console.debug('handleSchedulePlannerPage, tHeadtrElementCells ', tHeadtrElementCells);
                // we should get the column index, and use the index to get the row for each instrutor name
                let instructorRowIndex = -1;
                for (let tHeadtrElementCell of tHeadtrElementCells) {
                    instructorRowIndex++;
                    console.debug('handleSchedulePlannerPage, tHeadtrElementCellIndex ', instructorRowIndex);
                    console.debug('handleSchedulePlannerPage, tHeadtrElementCell ', tHeadtrElementCell);
                    // try to find the text 'Instructor' Element
                    let cellText = tHeadtrElementCell.innerText;
                    console.debug('handleSchedulePlannerPage, tHeadtrElementCell, cellText', cellText);
                    if (cellText === 'Instructor') {
                        console.debug('handleSchedulePlannerPage, tHeadtrElementCell: found the Instructor element', tHeadtrElementCell);
                        break;
                    }
                }
                console.debug('handleSchedulePlannerPage, instructorRowIndex ' + instructorRowIndex);
                g_isFirstLoadSuccess = true;
                g_isSwitchCoursePageFinish = true;
                // may be we need to change another way to identify whther the column is exist in the table
                // the build scheuled page and enrolled page have different table title head
                // the index begin from zero, however the length starts with 1 when the index is zero!!
                // NOTE: in possible schedule page, if the user switch course, there is definitely one table body will change
                // therefore, we need to get the table head total cell num, and each body num, if one of them is different, we need to invoke it again
                // no found the instructor index, because the last cell is not instrctuor index
                if (instructorRowIndex == tHeadtrElementCells.length - 1) {
                    console.debug('handleSchedulePlannerPage, instructorRowIndex not found');
                    showPotentialSchedule(tHeadElement, instructorRowIndex);
                    return;
                }
                if (!g_isSwitchSheduleUpdateFinish) {
                    console.debug("handleSchedulePlannerPage, g_isSwitchSheduleUpdateFinish ", g_isSwitchSheduleUpdateFinish);
                    potentialSheduleCellAddData(tHeadElement);
                    return;
                }
                console.debug("handleSchedulePlannerPage, showCurrentSchedule ");
                showCurrentSchedule(tHeadElement, instructorRowIndex);
            }

        } else {
            console.debug("not in schedule planner page");
        }
    }

})();
