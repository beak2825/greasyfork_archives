// ==UserScript==
// @name           Information about teams for the match
// @version        1.0.5
// @description	  You can see team informations(Rating, XP, ASI) about any match
// @author         Shomi
// @include	   https://trophymanager.com/matches/*
// @namespace https://greasyfork.org/users/721529
// @grant       function
// @downloadURL https://update.greasyfork.org/scripts/419235/Information%20about%20teams%20for%20the%20match.user.js
// @updateURL https://update.greasyfork.org/scripts/419235/Information%20about%20teams%20for%20the%20match.meta.js
// ==/UserScript==

let weightR4 = [
	[0.51872935, 0.29081119, 0.57222393, 0.89735816, 0.84487852, 0.50887940, 0.50887940, 0.13637928, 0.05248024, 0.09388931, 0.57549122, 0.00000000, 0.00000000, 0.0],	// DC
	[0.45240063, 0.31762087, 0.68150374, 0.77724031, 0.74690951, 0.50072196, 0.45947168, 0.17663123, 0.23886264, 0.18410349, 0.46453393, 0.00000000, 0.00000000, 0.0],	// DL/R
	[0.43789335, 0.31844356, 0.53515723, 0.63671706, 0.59109742, 0.51311701, 0.53184426, 0.32421168, 0.06318165, 0.27931537, 0.50093723, 0.19317517, 0.07490902, 0.0],	// DMC
	[0.42311032, 0.32315966, 0.62271745, 0.53932111, 0.51442838, 0.49835997, 0.47896659, 0.26434782, 0.22586124, 0.32182902, 0.45537227, 0.23961054, 0.09291562, 0.0],	// DML/R
	[0.31849880, 0.36581214, 0.50091016, 0.31726444, 0.28029020, 0.52022170, 0.55763723, 0.60199246, 0.10044356, 0.51811057, 0.38320838, 0.38594825, 0.14966211, 0.0],	// MC
	[0.35409971, 0.34443972, 0.64417234, 0.30427501, 0.27956082, 0.49925481, 0.46093655, 0.32887111, 0.38695101, 0.47884837, 0.37465446, 0.39194758, 0.15198852, 0.0],	// ML/R
	[0.32272636, 0.35024067, 0.48762872, 0.22888914, 0.19049636, 0.52620414, 0.57842512, 0.53330409, 0.07523792, 0.55942740, 0.39986691, 0.53866926, 0.20888391, 0.0],	// OMC
	[0.36311066, 0.33106245, 0.61831416, 0.19830147, 0.17415753, 0.50049575, 0.47737842, 0.28937553, 0.34729042, 0.52834210, 0.39939218, 0.55684664, 0.21593269, 0.0],	// OML/R
	[0.40622753, 0.29744114, 0.39446722, 0.09952139, 0.07503885, 0.50402399, 0.58505850, 0.36932466, 0.05210389, 0.53677990, 0.51998862, 0.83588627, 0.32413803, 0.0],	// F
	[0.37313433, 0.37313433, 0.37313433, 0.74626866, 0.52238806, 0.74626866, 0.52238806, 0.52238806, 0.37313433, 0.22388060, 0.22388060]];	// GK

// RECb weights		Str				Sta				Pac				Mar				Tac				Wor				Pos				Pas				Cro				Tec				Hea				Fin				Lon				Set
let weightRb = [
	[0.10493615, 0.05208547, 0.07934211, 0.14448971, 0.13159554, 0.06553072, 0.07778375, 0.06669303, 0.05158306, 0.02753168, 0.12055170, 0.01350989, 0.02549169, 0.03887550],	// DC
	[0.07715535, 0.04943315, 0.11627229, 0.11638685, 0.12893778, 0.07747251, 0.06370799, 0.03830611, 0.10361093, 0.06253997, 0.09128094, 0.01314110, 0.02449199, 0.03726305],	// DL/R
	[0.08219824, 0.08668831, 0.07434242, 0.09661001, 0.08894242, 0.08998026, 0.09281287, 0.08868309, 0.04753574, 0.06042619, 0.05396986, 0.05059984, 0.05660203, 0.03060871],	// DMC
	[0.06744248, 0.06641401, 0.09977251, 0.08253749, 0.09709316, 0.09241026, 0.08513703, 0.06127851, 0.10275520, 0.07985941, 0.04618960, 0.03927270, 0.05285911, 0.02697852],	// DML/R
	[0.07304213, 0.08174111, 0.07248656, 0.08482334, 0.07078726, 0.09568392, 0.09464529, 0.09580381, 0.04746231, 0.07093008, 0.04595281, 0.05955544, 0.07161249, 0.03547345],	// MC
	[0.06527363, 0.06410270, 0.09701305, 0.07406706, 0.08563595, 0.09648566, 0.08651209, 0.06357183, 0.10819222, 0.07386495, 0.03245554, 0.05430668, 0.06572005, 0.03279859],	// ML/R
	[0.07842736, 0.07744888, 0.07201150, 0.06734457, 0.05002348, 0.08350204, 0.08207655, 0.11181914, 0.03756112, 0.07486004, 0.06533972, 0.07457344, 0.09781475, 0.02719742],	// OMC
	[0.06545375, 0.06145378, 0.10503536, 0.06421508, 0.07627526, 0.09232981, 0.07763931, 0.07001035, 0.11307331, 0.07298351, 0.04248486, 0.06462713, 0.07038293, 0.02403557],	// OML/R
	[0.07738289, 0.05022488, 0.07790481, 0.01356516, 0.01038191, 0.06495444, 0.07721954, 0.07701905, 0.02680715, 0.07759692, 0.12701687, 0.15378395, 0.12808992, 0.03805251],	// F
	[0.07466384, 0.07466384, 0.07466384, 0.14932769, 0.10452938, 0.14932769, 0.10452938, 0.10344411, 0.07512610, 0.04492581, 0.04479831]];	// GK
// REC weights Str				   Sta				  Pac				 Mar				 Tac				 Wor				Pos				   Pas				  Cro				 Tec				Hea				   Fin				  Lon				 Set
let weightR = [
	[0.653962303361921, 0.330014238020285, 0.562994547223387, 0.891800163983125, 0.871069095865164, 0.454514672470839, 0.555697278549252, 0.42777598627972, 0.338218821750765, 0.134348455965202, 0.796916786677566, 0.048831870932616, 0.116363443378865, 0.282347752982916],	//DC
	[0.565605120229193, 0.430973382039533, 0.917125432457378, 0.815702528287723, 0.99022325015212, 0.547995876625372, 0.522203232914265, 0.309928898819518, 0.837365352274204, 0.483822472259513, 0.656901420858592, 0.137582588344562, 0.163658117596413, 0.303915447383549],	//DL/R
	[0.55838825558912, 0.603683502357502, 0.563792314670998, 0.770425088563048, 0.641965853834719, 0.675495235675077, 0.683863478201805, 0.757342915150728, 0.473070797767482, 0.494107823556837, 0.397547163237438, 0.429660916538242, 0.56364174077388, 0.224791093448809],	//DMC
	[0.582074038075056, 0.420032202680124, 0.7887541874616, 0.726221389774063, 0.722972329840151, 0.737617252827595, 0.62234458453736, 0.466946909655194, 0.814382915598981, 0.561877829393632, 0.367446981999576, 0.360623408340649, 0.390057769678583, 0.249517737311268],	//DML/R
	[0.578431939417021, 0.778134685048085, 0.574726322388294, 0.71400292078636, 0.635403391007978, 0.822308254446722, 0.877857040588335, 0.864265671245476, 0.433450219618618, 0.697164252367046, 0.412568516841575, 0.586627586272733, 0.617905053049757, 0.308426814834866],	//MC
	[0.497429376361348, 0.545347364699553, 0.788280917110089, 0.578724574327427, 0.663235306043286, 0.772537143243647, 0.638706135095199, 0.538453108494387, 0.887935381275257, 0.572515970409641, 0.290549550901104, 0.476180499897665, 0.526149424898544, 0.287001645266184],	//ML/R
	[0.656437768926678, 0.617260722143117, 0.656569986958435, 0.63741054520629, 0.55148452726771, 0.922379789905246, 0.790553566121791, 0.999688557334153, 0.426203575603164, 0.778770912265944, 0.652374065121788, 0.662264393455567, 0.73120100926333, 0.274563618133769],	//OMC
	[0.483341947292063, 0.494773052635464, 0.799434804259974, 0.628789194186491, 0.633847969631333, 0.681354437033551, 0.671233869875345, 0.536121458625519, 0.849389745477645, 0.684067723274814, 0.389732973354501, 0.499972692291964, 0.577231818355874, 0.272773352088982],	//OML/R
	[0.493917051093473, 0.370423904816088, 0.532148929996192, 0.0629206658586336, 0.0904950078155216, 0.415494774080483, 0.54106107545574, 0.468181146095801, 0.158106484131194, 0.461125738338018, 0.83399612271067, 0.999828328674183, 0.827171977606305, 0.253225855459207],	//F
//			   For  Rez    Vit  Ind  One  Ref Aer  Sar  Com    Deg    Aru
	[0.5, 0.333, 0.5, 1, 0.5, 1, 0.5, 0.5, 0.333, 0.333, 0.333]]; //GK


function funFix2(i) {
	i = (Math.round(i * 100) / 100).toFixed(2);
	return i;
}

function funFix3(i) {
	i = (Math.round(i * 1000) / 1000).toFixed(3);
	return i;
}

//New data

const calculateREREC = (positionIndex, skills, SI, rou) => {
    console.log(skills)
	let rou2 = (3 / 100) * (100 - (100) * Math.pow(Math.E, -rou * 0.035));
	if (positionIndex == 9) var weight = 48717927500;
	else var weight = 263533760000;
	let rec = 0;			// RERECb
	let ratingR = 0;		// RatingR4
	let ratingR4 = 0;		// RatingR4 + routine
	let skillSum = 0;

	for (let i = 0; i < skills.length; i++) {
		skillSum += parseInt(skills[i]);
	}

	let remainder = Math.round((Math.pow(2, Math.log(weight * SI) / Math.log(Math.pow(2, 7))) - skillSum) * 10) / 10;		// RatingR4 remainder

	// All position
	let remainderWeight = 0;		// REREC remainder weight sum
	let remainderWeight2 = 0;		// RatingR4 remainder weight sum
	let not20 = 0;					// 20以外のスキル数


	weightR[positionIndex].forEach((value, index) => {
		rec += skills[index] * weightRb[positionIndex][index];
		ratingR += skills[index] * weightR4[positionIndex][index];
		if (skills[index] != 20) {
			remainderWeight += weightRb[positionIndex][index];
			remainderWeight2 += weightR4[positionIndex][index];
			not20++;
		}
	})
	if (remainder / not20 > 0.9 || not20 == 0) {
		if (positionIndex == 9) not20 = 11;
		else not20 = 14;
		remainderWeight = 1;
		remainderWeight2 = 5;
	}


	rec = funFix3((rec + remainder * remainderWeight / not20 - 2) / 3);

	ratingR += remainder * remainderWeight2 / not20;
	ratingR4 = funFix2(ratingR + rou2 * 5);
	ratingR = funFix2(ratingR);
	return [rec, ratingR, ratingR4];
};

//Old data
const GetPlayerData = (playerID, position) => {
	$.ajaxSetup({async: false});
	let player;
	$.post("/ajax/tooltip.ajax.php", {
		"player_id": playerID
	}, function (responseText) {
		let data = JSON.parse(responseText);
		let skills = [];
		const checkSkills = data.player.skills.filter(skill => skill.value)
		if (position === 9) {
			skills = [checkSkills[0].value, checkSkills[2].value, checkSkills[4].value, checkSkills[1].value, checkSkills[3].value, checkSkills[5].value, checkSkills[6].value, checkSkills[7].value, checkSkills[8].value, checkSkills[9].value, checkSkills[10].value]
		} else {
			for (let i = 0; i <= data.player.skills.length; i = i + 2) {
				if (data.player.skills[i]) {
					skills.push(data.player.skills[i].value)
				}
			}
			for (let i = 1; i <= data.player.skills.length; i = i + 2) {
				if (data.player.skills[i]) {
					skills.push(data.player.skills[i].value)
				}
			}
		}

		skills.forEach((skill, index) => {
            //if(skills[index] = 0) skills[index] = 1;
			if (typeof (skill) === 'string') {
				if (skill.includes('silver')) {
					skills[index] = 19
				} else {
					skills[index] = 20
				}
			}
		})
		player = {
			skills,
            number: data.player.no,
			id: data.player.player_id,
			position,
			ASI: Number(data.player.skill_index.split(',').join('')),
			xp: Number(data.player.routine.split(',').join('')),
			age: Number(data.player.age) * 12 + Number(data.player.months)
		};

	});
	return player;
}

const average = (players, column) => {
	const total = players.reduce((carry, player) => {
		carry = carry + player[column]
		return carry;
	}, 0)
	return (total / 11)
}

const toFixed = (num, decimals) => {
	return num.toFixed(decimals)
}

const ShowInfo = () => {
if(document.querySelector('#tabs_content')){
    document.querySelector('#tabs_content').style.paddingLeft = 0;
    document.querySelector('#tabs_content').style.paddingRight = 0;
	const playersEl = [...document.getElementsByClassName("player_field")[0].getElementsByClassName("pog")];

    const quarter = document.querySelectorAll('.quarter');
    [...quarter].forEach(q => {
        q.style.margin = 0;
        q.style.width = '245px'
        const list = q.querySelector('.player_list');
        list.style.padding = 0;
        list.style.width = '100%'
    });

	let homePlayers = [];
	let awayPlayers = [];
	playersEl.forEach((el, index) => {
			let position = 0;
			if (el.classList.contains('gk')) position = 9;
			else if (el.classList.contains('d')) {
				position = ['237px', '47px'].includes(el.style.marginTop) ? 1 : 0
			} else if (el.classList.contains('dm')) {
				position = ['237px', '47px'].includes(el.style.marginTop) ? 3 : 2
			} else if (el.classList.contains('m')) {
				position = ['237px', '47px'].includes(el.style.marginTop) ? 5 : 4
			} else if (el.classList.contains('om')) {
				position = ['237px', '47px'].includes(el.style.marginTop) ? 7 : 6
			} else position = 8
			let playerID = el.getAttribute("player_id");
			let player = GetPlayerData(playerID, position);
			player.rating = calculateREREC(position, player.skills, player.ASI, player.xp);
			player.ratingRec = Number(player.rating[2]);
			if (index <= 10) {
                homePlayers.push(player);
                [...quarter[0].querySelectorAll('li')].forEach(list => {
                    list.dataset.convert = '1234'
                    const id = list.querySelector('a').getAttribute("href").replace('/players/', '');
                    if(id === player.id) {
                        list.querySelector('.favposition').querySelector('span').innerHTML = player.number;
                        list.querySelector('.icons').style.width = '140px';
                        const ratingEl = document.createElement('div');
                        list.style.height = '22px';
                        list.style.position = 'relative'
                        ratingEl.style.position = 'absolute';
                        ratingEl.style.right = 0;
                        ratingEl.innerHTML = player.rating[2];
                        list.appendChild(ratingEl);
                    }
                })
            }
			else {
                awayPlayers.push(player);
                [...quarter[1].querySelectorAll('li')].forEach(list => {
                    const id = list.querySelector('a').getAttribute("href").replace('/players/', '');
                    if(id === player.id) {
                        list.querySelector('.favposition').querySelector('span').innerHTML = player.number;
                        list.querySelector('.icons').style.width = '140px';
                        const ratingEl = document.createElement('div');
                        list.style.height = '22px';
                        list.style.position = 'relative'
                        ratingEl.style.position = 'absolute';
                        ratingEl.style.right = 0;
                        ratingEl.innerHTML = player.rating[2];
                        list.appendChild(ratingEl);
                    }
                })
            }
		}
	);
	let newdiv = document.createElement("div");
	newdiv.style.paddingTop = '33px';
    newdiv.id = 'teamRatings';
	let html = ``;
	[homePlayers, awayPlayers].forEach((team, index) => {
		const colors = index ? [127, 30, 45] : [35, 45, 125];
		html += `<div
					class="${index ? 'away' : 'home'} color"
					style="background-color:rgb(${colors.join()});height: auto">
						<b style="color: gold;">
							Rating:${toFixed(average(team, 'ratingRec'), 2)}
							XP:${toFixed(average(team, 'xp'), 1)}
							Age:${toFixed(average(team, 'age') / 12, 1)}
							ASI:${toFixed(average(team, 'ASI'), 0)}
						</b>
					</div>`
	});
	newdiv.innerHTML = html;
    const teamRatings = document.querySelector('#teamRatings');
    if(!teamRatings) {
	    document.getElementsByClassName("nameplate")[0].appendChild(newdiv);
    } else {
        teamRatings.parentNode.replaceChild(newdiv, teamRatings);
    }
  }
}

let field = false;
let interval = setInterval(() => {
    if(document.querySelector(".player_field") && !field){
        field = true;
        ShowInfo();
        //clearInterval(interval);
    }
    if(document.querySelector(".player_field")){
       const dataset = document.querySelector('.quarter').querySelector('li').dataset.convert;
       if(!dataset) ShowInfo();
    }
}, 100)
