// ==UserScript==
// @name         DO player_faces
// @version      0.4
// @namespace    jed
// @description  dugout-online player face generation
// @author       Helamam
// @icon         https://i.ibb.co/kDL4QcD/premium1t.png
// @require	     http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @include      http*dugout-online.com/*
// @include      https://www.dugout-online.com/*
// @downloadURL https://update.greasyfork.org/scripts/512157/DO%20player_faces.user.js
// @updateURL https://update.greasyfork.org/scripts/512157/DO%20player_faces.meta.js
// ==/UserScript==
//page select ----------------------------------------------//

var page = document.URL;
var player_id = 0
var club_id = 0
var player_id_length = 0
var player_age = 0
var player_nation
var FP
var LP

var colorImg_value
var faceImg_value
var hairImg_value
var beardImg_value

var is_link_from_nt = false

var face = {
		color: 0, // value
		face: [0, 0], // color category, value
		hair: [0, 0], // color category, value
		beard: [0, 0] // color category, value
	}

// tipo de "_ready()" function
if (page.match('/home/none/')) {
	console.log("???")
	
}

// quando a página do player for aberta
if (page.match('/players/details/')) {
	get_club_id();
    get_player_id();
	get_player_nation();
	
	verify_club_id();
	
	set_player_face();
	edit_player_image();
}

function pid_length() {
	player_id_length = player_id.toString().length
}

function get_player_id() {
	var id_text = document.getElementsByClassName("player_id_txt")[0].outerText;
    var id_filter = /\(([^)]+)\)/;
    var id_numb = id_filter.exec(id_text);
    var id_remove_ID = id_numb[1].match(/(\d+)/);

	player_id = id_remove_ID[0]
	player_id = Number(player_id);
	pid_length();

	if (player_id_length == 6) {
		//console.log("6numb-length-id")
        // configura pra pegar realmente os 3 primeiros e 3 ultimos com 6 digitos
		FP = parseInt(player_id / 1000) // first 3 player_id digits
		LP = parseInt(player_id % 1000) // last 3 player_id digits
	}
	else if (player_id_length == 7) {
		//console.log("7numb-length-id")
        // configura pra pegar realmente os 3 primeiros e 3 ultimos com 7 digitos
        FP = parseInt(player_id / 10000) // first 3 player_id digits
		LP = parseInt(player_id % 1000) // last 3 player_id digits
	}
	else if (player_id_length == 8) {
		//console.log("8numb-length-id")
        // configura pra pegar realmente os 3 primeiros e 3 ultimos com 8 digitos
		FP = parseInt(player_id / 100000) // first 3 player_id digits
		LP = parseInt(player_id % 1000) // last 3 player_id digits
	}
    else if (player_id_length == 9) {
		//console.log("9numb-length-id")
        // configura pra pegar realmente os 3 primeiros e 3 ultimos com 9 digitos
		FP = parseInt(player_id / 1000000) // first 3 player_id digits
		LP = parseInt(player_id % 1000) // last 3 player_id digits
	}
	else{
		console.log("debug, < 6 ou > 9")
	}

    console.log(player_id)
	//console.log(player_id_length)
	console.log(String(FP).padStart(3, '0'))
	console.log(String(LP).padStart(3, '0'))
}

function get_club_id() {
	// Obter a URL atual
	var currentUrl = window.location.href;

	// Encontrar a posição de 'club_id/'
	var index = currentUrl.indexOf('club_id/');

	// Verificar se 'club_id/' foi encontrado na URL
	if (index !== -1) {
    // Avançar até o final de 'club_id/' para obter o valor que segue
    var startIndex = index + 'club_id/'.length;

    // Extrair o valor após 'club_id/'
    var clubIdValue = currentUrl.slice(startIndex);

    // Verificar se o valor é um número
    if (!isNaN(clubIdValue)) {
        // Agora, 'clubIdValue' contém o valor do 'club_id'
        console.log('Club ID:', clubIdValue);
    } else {
        console.error('Valor após "club_id/" não é um número válido.');
    }
	} else {
    console.error('"club_id/" não encontrado na URL.');
	}

	club_id = clubIdValue;
	club_id = Number(club_id);

}

function get_player_nation(){
	const playerHeaderDiv = document.querySelector('.player_header img');
	var imgSrc
	
	if (playerHeaderDiv) {
		imgSrc = playerHeaderDiv.getAttribute('src');
		console.log(imgSrc); // Exibe o src da imagem no console
	}
	
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/usa.png') {player_nation = 'unitedstates'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/aus.png') {player_nation = 'australia'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/ice.png') {player_nation = 'iceland'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/can.png') {player_nation = 'canada'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/arg.png') {player_nation = 'argentina'}
	
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/bol.png') {player_nation = 'bolivia'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/ven.png') {player_nation = 'venezuela'}
	
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/mex.png') {player_nation = 'mexico'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/brz.png') {player_nation = 'brazil'}	
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/chi.png') {player_nation = 'chile'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/uru.png') {player_nation = 'uruguay'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/col.png') {player_nation = 'colombia'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/per.png') {player_nation = 'peru'}

	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/chn.png') {player_nation = 'china'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/sko.png') {player_nation = 'skorea'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/jpn.png') {player_nation = 'japan'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/ban.png') {player_nation = 'bangladesh'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/tha.png') {player_nation = 'thailand'}
	
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/ind.png') {player_nation = 'india'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/isr.png') {player_nation = 'israel'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/alg.png') {player_nation = 'algeria'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/saf.png') {player_nation = 'safrica'}
	
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/bel.png') {player_nation = 'belgica'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/bih.png') {player_nation = 'bosnia'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/cro.png') {player_nation = 'croatia'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/den.png') {player_nation = 'denmark'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/eng.png') {player_nation = 'england'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/est.png') {player_nation = 'estonia'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/fin.png') {player_nation = 'finland'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/fra.png') {player_nation = 'france'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/ger.png') {player_nation = 'germany'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/ita.png') {player_nation = 'italy'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/lat.png') {player_nation = 'latvia'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/net.png') {player_nation = 'netherlands'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/nor.png') {player_nation = 'norway'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/nze.png') {player_nation = 'newzeland'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/pol.png') {player_nation = 'poland'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/por.png') {player_nation = 'portugal'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/rom.png') {player_nation = 'romenia'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/sam.png') {player_nation = 'serbia'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/slo.png') {player_nation = 'slovenia'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/spa.png') {player_nation = 'spain'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/swe.png') {player_nation = 'sweden'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/tur.png') {player_nation = 'turkey'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/sco.png') {player_nation = 'scotland'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/cze.png') {player_nation = 'czechia'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/svk.png') {player_nation = 'slovakia'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/aut.png') {player_nation = 'austria'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/bul.png') {player_nation = 'bulgaria'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/hun.png') {player_nation = 'hungria'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/alb.png') {player_nation = 'albania'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/ire.png') {player_nation = 'ireland'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/lit.png') {player_nation = 'lithuania'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/rus.png') {player_nation = 'russia'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/sui.png') {player_nation = 'switzerland'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/mtn.png') {player_nation = 'montenegro'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/gre.png') {player_nation = 'greece'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/mol.png') {player_nation = 'moldova'}
	if (imgSrc == 'https://www.dugout-online.com/images/flags_round/half/mal.png') {player_nation = 'malta'}
	
	console.log(player_nation);
}

// verifica se a club id é de um clube ou seleção
function verify_club_id() {
	const brazil = [13343, 13344, 13345, 13346] // NT, U21, U19, U17
	const nts_ids = [...brazil]
	
	if (nts_ids.includes(club_id)) {
		is_link_from_nt = true
	}
	else {
		is_link_from_nt = false
	}

	
}

function get_club_colors(){
	if (is_link_from_nt){
	}
	else{
		
	}
}

function set_player_face() {
	// uses player id, FP and LP variables to define an 'unique' and unchangable face
	
	//var FirstDigit = Number / 100
	//var LastDigit = Number % 10
	
	//ALGORITMO FACE
	// color: FP + LP (LAST DIGIT)
	// face: FP + LP (FIRST DIGIT) [category = color]
	// hair: FP + LP (LAST DIGIT) [category = color]
	// beard: FP + LP (FIRST DIGIT) [category = color]
	
	var color_alg = parseInt((FP + LP) % 10)
	var face_alg = parseInt((FP + LP) / 100)
	var hair_alg = parseInt((FP + LP) % 10)
	var beard_alg = parseInt((FP + LP) / 100)
	
	if (face_alg >= 9){
		face_alg = 9
	}
	
	if (color_alg >= 9){
		 color_alg = 9
	}
	
	if (hair_alg >= 9){
		hair_alg = 9
	}
	
	if (beard_alg >= 9){
		beard_alg = 9
	}
	
	if (player_nation == 'unitedstates' || player_nation == 'australia' || player_nation == 'canada' || player_nation == 'iceland' || player_nation == 'argentina'){
		console.log('group 1');
		
		if(color_alg == 2){color_alg = 1} if(color_alg == 4){color_alg = 5}
	}
	else if (player_nation == 'bolivia' || player_nation == 'venezuela'){
		console.log('group 2');
		
		if(color_alg == 0){color_alg = 2} if(color_alg == 1){color_alg = 2} if(color_alg == 3){color_alg = 2} if(color_alg == 9){color_alg = 2} if(color_alg == 9){color_alg = 2} if(color_alg == 8){color_alg = 2}
	}
	else if (player_nation == 'mexico' || player_nation == 'brazil' || player_nation == 'chile' || player_nation == 'uruguay' || player_nation == 'colombia', player_nation == 'peru'){
		console.log('group 3');
	}
	else if (player_nation == 'china' || player_nation == 'skorea' || player_nation == 'japan' || player_nation == 'bangladesh' || player_nation == 'thailand'){
		console.log('group 4');
		if(color_alg == 0){color_alg = 3} if(color_alg == 1){color_alg = 4} if(color_alg == 2){color_alg = 3} if(color_alg == 9){color_alg = 4} if(color_alg == 8){color_alg = 3} if(color_alg == 7){color_alg = 4} if(color_alg == 6){color_alg = 3}
	}
	else if (player_nation == 'india' || player_nation == 'israel' || player_nation == 'algeria' || player_nation == 'safrica'){
		if(color_alg == 7){color_alg = 6} if(color_alg == 4){color_alg = 6} if(color_alg == 2){color_alg = 5}
	}
	else{ // all europe
		console.log('group 6');
		if(color_alg == 9){color_alg = 8} if(color_alg == 7){color_alg = 6} if(color_alg == 4){color_alg = 3} if(color_alg == 2){color_alg = 1}
	}
	face.color = color_alg
	
	face.face = face_alg
	face.hair = hair_alg
	face.beard = beard_alg
	
	const colorImgUrls = [
	  'https://i.ibb.co/zHVGjDT/color-0.png',
	  'https://i.ibb.co/d047w9t/color-1.png',
	  'https://i.ibb.co/vBcF4C0/color-2.png',
	  'https://i.ibb.co/hfSgMRt/color-3.png',
	  'https://i.ibb.co/hRWZLZ4/color-4.png',
	  'https://i.ibb.co/F044fxg/color-5.png',
	  'https://i.ibb.co/QfC5Yfs/color-6.png',
	  'https://i.ibb.co/BBfpgTV/color-7.png',
	  'https://i.ibb.co/6DLKrMF/color-8.png',
	  'https://i.ibb.co/d5k0tY6/color-9.png'
];
	colorImg_value = colorImgUrls[face.color];

	const faceImgUrls = [
	  ['https://i.ibb.co/syxRWBW/0-0.png', 'https://i.ibb.co/5vqvbtx/0-1.png', 'https://i.ibb.co/mBcDKzv/0-2.png', 'https://i.ibb.co/FstzCnJ/0-3.png', 'https://i.ibb.co/x14jvwM/0-4.png', 'https://i.ibb.co/6NF79V9/0-5.png', 'https://i.ibb.co/LRqfSb7/0-6.png', 'https://i.ibb.co/7W76p1x/0-7.png', 'https://i.ibb.co/KK6BQhw/0-8.png', 'https://i.ibb.co/PNRn2GY/0-9.png'],
	  ['https://i.ibb.co/gyTz7Kc/1-0.png', 'https://i.ibb.co/8DKL9mR/1-1.png', 'https://i.ibb.co/H2Nb4Ms/1-2.png', 'https://i.ibb.co/HqrjQjx/1-3.png', 'https://i.ibb.co/ZLqfp38/1-4.png', 'https://i.ibb.co/k55mSBZ/1-5.png', 'https://i.ibb.co/6sRR48X/1-6.png', 'https://i.ibb.co/pQtrDVg/1-7.png', 'https://i.ibb.co/L5m1Hw8/1-8.png', 'https://i.ibb.co/fMFVgPN/1-9.png'],
	  ['https://i.ibb.co/2ZWv3MN/2-0.png', 'https://i.ibb.co/647fj1n/2-1.png', 'https://i.ibb.co/r7hCbV8/2-2.png', 'https://i.ibb.co/sC2b4gV/2-3.png', 'https://i.ibb.co/t3QqbSn/2-4.png', 'https://i.ibb.co/hsw4QGB/2-5.png', 'https://i.ibb.co/m0xt6LC/2-6.png', 'https://i.ibb.co/LR0sJjw/2-7.png', 'https://i.ibb.co/kgbzB6B/2-8.png', 'https://i.ibb.co/Scq4vnP/2-9.png'],
	  ['https://i.ibb.co/wJ0PcZq/3-0.png', 'https://i.ibb.co/J2R9YJc/3-1.png', 'https://i.ibb.co/qxgX4v6/3-2.png', 'https://i.ibb.co/tYwDDwD/3-3.png', 'https://i.ibb.co/yFM2LtQ/3-4.png', 'https://i.ibb.co/8cScnNJ/3-5.png', 'https://i.ibb.co/DQCXWFC/3-6.png', 'https://i.ibb.co/RSxvSKK/3-7.png', 'https://i.ibb.co/8Nr5gQy/3-8.png', 'https://i.ibb.co/2KQfTpq/3-9.png'],
	  ['https://i.ibb.co/6Z4MS67/4-0.png', 'https://i.ibb.co/W5sy4L7/4-1.png', 'https://i.ibb.co/4sSZK84/4-2.png', 'https://i.ibb.co/1XfVq6m/4-3.png', 'https://i.ibb.co/7ghNzWy/4-4.png', 'https://i.ibb.co/QMDxy8c/4-5.png', 'https://i.ibb.co/dQv4NGw/4-6.png', 'https://i.ibb.co/XDzHZxh/4-7.png', 'https://i.ibb.co/ByNtH0s/4-8.png', 'https://i.ibb.co/1X1LW7S/4-9.png'],
	  ['https://i.ibb.co/WtB7NNJ/5-0.png', 'https://i.ibb.co/qrWtsHt/5-1.png', 'https://i.ibb.co/VwG4pbd/5-2.png', 'https://i.ibb.co/mHZ7DX2/5-3.png', 'https://i.ibb.co/sRYqccF/5-4.png', 'https://i.ibb.co/3CDXGsS/5-5.png', 'https://i.ibb.co/SnFdDG6/5-6.png', 'https://i.ibb.co/BrWR70z/5-7.png', 'https://i.ibb.co/0s4jRmG/5-8.png', 'https://i.ibb.co/zSSMNBb/5-9.png'],
	  ['https://i.ibb.co/Tw0DcyZ/6-0.png', 'https://i.ibb.co/V3SJBFj/6-1.png', 'https://i.ibb.co/r52fVTZ/6-2.png', 'https://i.ibb.co/BGYkJ7w/6-3.png', 'https://i.ibb.co/R3kXhLc/6-4.png', 'https://i.ibb.co/B4Jfq33/6-5.png', 'https://i.ibb.co/HhhTbC5/6-6.png', 'https://i.ibb.co/TY1x7s4/6-7.png', 'https://i.ibb.co/gSYjgDz/6-8.png', 'https://i.ibb.co/Bq5hhv1/6-9.png'],
	  ['https://i.ibb.co/R9gjssd/7-0.png', 'https://i.ibb.co/ccykb7x/7-1.png', 'https://i.ibb.co/SQHVXNX/7-2.png', 'https://i.ibb.co/Vx2XCVf/7-3.png', 'https://i.ibb.co/0ZCY5sh/7-4.png', 'https://i.ibb.co/2vs5ZLz/7-5.png', 'https://i.ibb.co/nDL4T8g/7-6.png', 'https://i.ibb.co/KFnD5bQ/7-7.png', 'https://i.ibb.co/k6kw156/7-8.png', 'https://i.ibb.co/b1dcBbN/7-9.png'],
	  ['https://i.ibb.co/R6fZBWZ/8-0.png', 'https://i.ibb.co/sQbH0QN/8-1.png', 'https://i.ibb.co/hyrZ4SX/8-2.png', 'https://i.ibb.co/zSh5mT2/8-3.png', 'https://i.ibb.co/55ZKMQN/8-4.png', 'https://i.ibb.co/RgLD3KX/8-5.png', 'https://i.ibb.co/FK6DcQv/8-6.png', 'https://i.ibb.co/tPBs4BD/8-7.png', 'https://i.ibb.co/YtyTC2j/8-8.png', 'https://i.ibb.co/WP7PQdq/8-9.png'],
	  ['https://i.ibb.co/3mqY950/9-0.png', 'https://i.ibb.co/KzwRM7x/9-1.png', 'https://i.ibb.co/MnJfpcb/9-2.png', 'https://i.ibb.co/cYXszgT/9-3.png', 'https://i.ibb.co/YTDdXf0/9-4.png', 'https://i.ibb.co/TK1ZpJx/9-5.png', 'https://i.ibb.co/CtBQRPC/9-6.png', 'https://i.ibb.co/9qwcQFH/9-7.png', 'https://i.ibb.co/XygHWWQ/9-8.png', 'https://i.ibb.co/0KqkYsg/9-9.png']
	];
	faceImg_value = faceImgUrls[color_alg][face_alg];
		
	console.log(color_alg, face_alg);
	console.log(faceImgUrls[color_alg][face_alg]);
		
	
	// 1-africa 2-europe 3-asia
	const hairImgUrls = [
		['https://i.ibb.co/F6PVRx6/hair-0.png', 'https://i.ibb.co/C8rt35q/hair-1.png', 'https://i.ibb.co/VtWbZD4/hair-2.png', 'https://i.ibb.co/KFnSD0G/hair-3.png', 'https://i.ibb.co/fv7vytS/hair-4.png', 'https://i.ibb.co/Ltf5PKq/hair-5.png', 'https://i.ibb.co/pJ2cvG8/hair-6.png', 'https://i.ibb.co/DYZmZBf/hair-7.png', 'https://i.ibb.co/gSxqvWR/hair-8.png', 'https://i.ibb.co/dWNh3px/hair-9.png'],
		['https://i.ibb.co/NFDQnG1/hair-0.png', 'https://i.ibb.co/tmKwn27/hair-1.png', 'https://i.ibb.co/VYbF9Yx/hair-2.png', 'https://i.ibb.co/RT8x6Rd/hair-3.png', 'https://i.ibb.co/LtbJdzT/hair-4.png', 'https://i.ibb.co/55qS4L8/hair-5.png', 'https://i.ibb.co/3Rdy5wK/hair-6.png', 'https://i.ibb.co/tXsPqFV/hair-7.png', 'https://i.ibb.co/CWVTp8q/hair-8.png', 'https://i.ibb.co/Z881wF6/hair-9.png'],
		['https://i.ibb.co/f4dsYLW/hair-0.png', 'https://i.ibb.co/0smXcP9/hair-1.png', 'https://i.ibb.co/ngjLJT2/hair-2.png', 'https://i.ibb.co/Jct1HWQ/hair-3.png', 'https://i.ibb.co/tLrxNTx/hair-4.png', 'https://i.ibb.co/7ngkGHw/hair-5.png', 'https://i.ibb.co/VQCcZ82/hair-6.png', 'https://i.ibb.co/Wxrz9CN/hair-7.png', 'https://i.ibb.co/vm6Tr6d/hair-8.png', 'https://i.ibb.co/6PvSB3C/hair-9.png']
	];
	if(color_alg == 0) {hairImg_value = hairImgUrls[1][face.hair];}
	if(color_alg == 1) {hairImg_value = hairImgUrls[1][face.hair];}
	if(color_alg == 2) {hairImg_value = hairImgUrls[1][face.hair];}
	if(color_alg == 3) {hairImg_value = hairImgUrls[2][face.hair];}
	if(color_alg == 4) {hairImg_value = hairImgUrls[2][face.hair];}
	if(color_alg == 5) {hairImg_value = hairImgUrls[1][face.hair];}
	if(color_alg == 6) {hairImg_value = hairImgUrls[0][face.hair];}
	if(color_alg == 7) {hairImg_value = hairImgUrls[0][face.hair];}
	if(color_alg == 8) {hairImg_value = hairImgUrls[0][face.hair];}
	if(color_alg == 9) {hairImg_value = hairImgUrls[0][face.hair];}
	

	const beardImgUrls = [
	  'https://i.ibb.co/RB6y808/color-0.png',
	  'https://i.ibb.co/Sn2CsgB/color-1.png',
	  'https://i.ibb.co/w7DbZC0/color-2.png',
	  'https://i.ibb.co/nrq2BXP/color-3.png',
	  'https://i.ibb.co/wcGpHtS/color-4.png',
	  'https://i.ibb.co/mSd2skV/color-5.png',
	  'https://i.ibb.co/7zYVVLQ/color-6.png',
	  'https://i.ibb.co/pzLPs5b/color-7.png',
	  'https://i.ibb.co/D8NzFR3/color-8.png',
	  'https://i.ibb.co/VWBBjb9/color-9.png'
	];
	beardImg_value = beardImgUrls[face.beard];
}

function edit_player_image(){
	// get generated face (from draw_face) and apply on player's img
	var playerImg = document.querySelector("img[src='https://www.dugout-online.com/images/club/profile/player-pic-default.png']");

	// badge img
	var badge = document.createElement("img");
	badge.src = "https://www.dugout-online.com/inc/show_custom_badge.php?id="+club_id; 
	badge.style.position = "absolute";
	badge.style.top = "0";
	badge.style.left = "0";
	//badge.style.transform = 'translate(82px, 62px)';
	//badge.style.transform = 'translateY(' + 12 + 'px)';
	badge.width = "60";
	badge.height = "60";	

	// color img
	var colorImg = document.createElement("img");
	colorImg.src = colorImg_value; 
	colorImg.style.position = "absolute";
	colorImg.style.top = "0";
	colorImg.style.left = "0";
	
	// eyebrows img
	var faceImg = document.createElement("img");
	faceImg.src = faceImg_value; 
	faceImg.style.position = "absolute";
	faceImg.style.top = "0";
	faceImg.style.left = "0";
	
	// eyes img
	var hairImg = document.createElement("img");
	hairImg.src = hairImg_value;
	hairImg.style.position = "absolute" ;
	hairImg.style.top = "0";
	hairImg.style.left = "0";
	
	// nose img
	var beardImg = document.createElement("img");
	beardImg.src = beardImg_value;
	beardImg.style.position = "absolute";
	beardImg.style.top = "0";
	beardImg.style.left = "0";
	
	// shirt img
	var shirtImg = document.createElement("img");
	shirtImg.src = "https://i.ibb.co/zHB3JBV/shirt-base.png"; 
	shirtImg.style.position = "absolute";
	shirtImg.style.top = "0";
	shirtImg.style.left = "0";
	
	// border img
	var borderImg = document.createElement("img");
	borderImg.src = "https://i.ibb.co/P5HfC1f/border.png";
	borderImg.style.position = "absolute";
	borderImg.style.top = "0";
	borderImg.style.left = "0";

	// Adicionar a imagem de sobreposição ao mesmo contêiner do jogador
	playerImg.parentNode.appendChild(colorImg);
	playerImg.parentNode.appendChild(faceImg);
	playerImg.parentNode.appendChild(hairImg);
	//playerImg.parentNode.appendChild(beardImg);
	playerImg.parentNode.appendChild(shirtImg);
	playerImg.parentNode.appendChild(borderImg);
	//playerImg.parentNode.appendChild(badge);

	// bg
	playerImg.src = "https://i.ibb.co/3TyM4gg/bg.png";
}

