// ==UserScript==
// @name         TypingTube Diffculty Calclator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://typing-tube.net/movie/show/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426539/TypingTube%20Diffculty%20Calclator.user.js
// @updateURL https://update.greasyfork.org/scripts/426539/TypingTube%20Diffculty%20Calclator.meta.js
// ==/UserScript==

document.getElementsByTagName('title')[0].textContent = document.getElementsByTagName('title')[0].textContent.replace("Typing Tube ","")

let speed_sum
let notes_sum
let rensou = {}
let speed_list = {}
let persent = []
var persent2 = []
let pp_list_sum
getScorePerChar=function () {

	//TypingLog(詳細記録)
    latency_kpm_rkpm_log = Array(lyrics_array.length-1).fill([0,0,0]); //[反応時間,打鍵速度,初速抜き打鍵速度]
    clear_time_log = Array(lyrics_array.length-1).fill(0); //[ライン毎の入力経過時間]
	escape_word_length_log = Array(lyrics_array.length-1).fill(["",0,0]); //[逃した文字,文字数, completeしてたら1。それ以外は0。]
    line_score_log = Array(lyrics_array.length-1).fill(0); //[そのラインで獲得したスコア]
    line_typing_count_miss_count_log = Array(lyrics_array.length-1).fill([0,0,0]); //[打鍵数,ミス打鍵数,コンボ]
    line_typinglog_log = Array(lyrics_array.length-1).fill([]);//line_typinglogのlog。[line_typinglog.push([c , 1 , headtime+practice_time , kana_mode]);


	total_notes_kana_mode = 0
	total_notes_roma_mode = 0
	kana_notes_list = []
	roma_notes_list = []
	line_difficulty_data_roma = []
	line_difficulty_data_kana = []
    line_length = 0;

const typing_array_length = typing_array.length
for (let i=0; i<typing_array_length; i++){
let line_notes_roma=0
let line_notes_kana=0
let line_daku_handaku=0
let line_speed = 0
//typing_arrayのi番号がend行と同じ番号なら総合打鍵数に含まない
if(lyrics_array[i][1]!='end' && typing_array[i] != ''){
    line_length++;
    if(logcount == 0){
        logcount = i+1
        logcount_save = i+1
    }
    line_speed = lyrics_array[i+1][0]-lyrics_array[i][0]

    //かな入力
    line_daku_handaku=(typing_array_kana[i].join('').match( /[ゔ|が|ぎ|ぐ|げ|ご|ざ|じ|ず|ぜ|ぞ|だ|ぢ|づ|で|ど|ば|び|ぶ|べ|ぼ|ぱ|ぴ|ぷ|ぺ|ぽ]/g ) || [] ).length
    line_notes_kana=typing_array_kana[i].join('').replace(/ /g,"").length
    total_notes_kana_mode += (line_notes_kana+line_daku_handaku)

    //ローマ字入力
    line_notes_roma = typing_array_roma[i].join('').replace(/ /g,"").length
    total_notes_roma_mode += line_notes_roma






}else if(lyrics_array[i][1]=='end'){

    median_roma_speed = median(line_difficulty_data_roma);
    median_kana_speed = median(line_difficulty_data_kana);
    max_roma_speed = Math.max(...line_difficulty_data_roma)
    max_kana_speed = Math.max(...line_difficulty_data_kana)

    score_per_char = 200000 / (total_notes_roma_mode + abridgement_word_length)
    map_info_generator()
    break;
}
    kana_notes_list.push(line_notes_kana+line_daku_handaku)
    roma_notes_list.push(line_notes_roma)
    line_difficulty_data_roma.push(line_speed > 0 ? Math.round((line_notes_roma/line_speed) * 100) / 100 : 0)
    line_difficulty_data_kana.push(line_speed > 0 ? Math.round(((line_notes_kana+line_daku_handaku)/line_speed) * 100) / 100 : 0)

};
speed_sum = line_difficulty_data_roma.reduce(function(sum, element){
  return sum + element;
}, 0);
console.log(speed_sum)
notes_sum = roma_notes_list.reduce(function(sum, element){
  return sum + element;
}, 0);

for(let i=0;i<line_difficulty_data_roma.length;i++){
rensou[i] = [roma_notes_list[i],line_difficulty_data_roma[i]]
}
rensou = Object.keys(rensou).map((k)=>({ count: k, value: rensou[k] }));
console.log(rensou)
speed_list = rensou.concat().sort((a, b) => b.value[1] - a.value[1])
console.log(speed_list)
/*
rensou.sort(function(a,b){
        if( a[1] > b[1] ) return -1;
        if( a[1] < b[1] ) return 1;
        return 0;
});

for(let i=0;i<line_difficulty_data_roma.length;i++){
if(line_difficulty_data_roma[i]>0){
persent.push([(roma_notes_list[i] / notes_sum) * 100,(line_difficulty_data_roma[i] / speed_sum) * 100])
}
}
persent.sort(function(a,b){
        if( a[1] > b[1] ) return -1;
        if( a[1] < b[1] ) return 1;
        return 0;
});
console.log(persent)
let points = 0
let hosei_speed = 1
let hosei_notes = 1
let d
for(let i=0;i<rensou.length;i++){
if(i > 0 && i != rensou.length){
hosei_speed -= persent[i][1]/100
hosei_notes -= persent[i][0]/100
}
d = Math.pow(rensou[i][1],1.1)
d = d*hosei_speed
d = d*hosei_notes
if(!isNaN(d)){
points += d
}
}
console.log(points)
*/

let pp_list = []
for(let i=0;i<speed_list.length;i++){
const Before_line = speed_list[i].count-1 > -1 ? speed_list[speed_list[i].count-1].value[1] : 1
const now = speed_list[i].value[1]
if(now != 0){
pp_list.push(now*((Before_line/1000)+1))
}
}
console.log(pp_list)
pp_list_sum = pp_list.reduce(function(sum, element){
  return sum + element;
}, 0);

for(var d=0;d<pp_list.length;d++){
persent2.push((pp_list[d] / pp_list_sum) * 100)
}
var pp = 0
var buff = 1
for(let i=0;i<pp_list.length;i++){
//let speed_buff = 0
//speed_buff = Math.pow(Math.max(1,pp_list[i]/0.0075) * 5 - 4,2)/1000000000000;
const point = pp_list[i]*buff
 buff += Math.pow((pp_list[i]/0.00075) * 10,2)/1000000000000
pp += point
//buff += (pp_list[i]/1000)
//buff *= speed_buff*persent2[i]

}
pp = (pp/pp_list.length)*60
console.log((pp/60).toFixed(2)+" // "+pp.toFixed(2))
	console.log("pp→"+pp.toFixed(2))
//配列⇒オブジェクト　で元に戻す
    return score_per_char;
      }
