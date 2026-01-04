// ==UserScript==
// @name         AtcoderDevotionGraph
// @namespace    http://atcoder.jp/
// @version      1.0.2
// @description  精進グラフを、通常のグラフの上に重ねて表示します
// @author       kemkemG0
// @include      *://atcoder.jp/users*
// @exclude      *://atcoder.jp/users/*?graph=rank
// @exclude      *://atcoder.jp/users/*?graph=dist
// @exclude      *://atcoder.jp/users/*/history*
// @grant        none
// @require      https://code.jquery.com/jquery-1.8.0.min.js
//@run-at        document-end

// @downloadURL https://update.greasyfork.org/scripts/416588/AtcoderDevotionGraph.user.js
// @updateURL https://update.greasyfork.org/scripts/416588/AtcoderDevotionGraph.meta.js
// ==/UserScript==

"use strict";

 let scriptsArray = $('script');
scriptsArray[14].remove(); // 対象のタグを消す記述 x[14]がグラフを読み込むjs
//なんでこれ必要？？  -->>一度読み込んだscriptタグはDOMから消しても効果は残るからそれを消すため
 let copyPage = $("html").clone().html();
$("html").remove();
document.write(copyPage);

//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##


{
    const element = document.getElementsByClassName('btn-text-group')[document.getElementsByClassName('btn-text-group').length - 1];
    const insertButton = Object.assign(document.createElement('button'), {
        className: '',
        id: 'shoujinButtonID',
        style: '\
    margin-left:100px;\
    appearance: none;\
    border: 0;\
    border-radius: 5px;\
    background: #20b2aa;\
    color: #fff;\
    padding: 5px 10px;\
    font-size: 16px;\
    '
    }
    );
    insertButton.textContent = "精進"
    element.appendChild(insertButton)
}

// const
const MARGIN_VAL_X = 86400 * 30;
const MARGIN_VAL_Y_LOW = 100;//
const MARGIN_VAL_Y_HIGH = 300;//自分の最高レート+表示する領域
const OFFSET_X = 50;//グラフの位置?
const OFFSET_Y = 5;
const DEFAULT_WIDTH = 640;
let canvas_status = document.getElementById("ratingStatus");
// <canvas id="ratingStatus" width="1280" height="160"
// style="max-width: 640px; max-height: 80px; height: 100%; width: 100%;"></canvas>
const STATUS_WIDTH = canvas_status.width - OFFSET_X - 10;
const STATUS_HEIGHT = canvas_status.height - OFFSET_Y - 5;
let canvas_graph = document.getElementById("ratingGraph");
/* <canvas id="ratingGraph"
 width="1280" height="720"
 style="max-width: 640px; max-height: 360px; height: 100%; width: 100%;"></canvas>*/
const PANEL_WIDTH = canvas_graph.width - OFFSET_X - 10;
const PANEL_HEIGHT = canvas_graph.height - OFFSET_Y - 30;
//HIGHEST:932　とかの吹き出しのサイズ
const HIGHEST_WIDTH = 80;
const HIGHEST_HEIGHT = 20;
const LABEL_FONT = "12px Lato";
const START_YEAR = 2010;
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const YEAR_SEC = 86400 * 365;
const STEP_SIZE = 400;//グラフのy軸のステップ数
const COLORS = [
    [0, "#808080", 0.15],
    [400, "#804000", 0.15],
    [800, "#008000", 0.15],
    [1200, "#00C0C0", 0.2],
    [1600, "#0000FF", 0.1],
    [2000, "#C0C000", 0.25],
    [2400, "#FF8000", 0.2],
    [2800, "#FF0000", 0.1]
];

//??????????????????
const STAR_MIN = 3200;
const PARTICLE_MIN = 3;
const PARTICLE_MAX = 20;
const LIFE_MAX = 30;
const EPS = 1e-9;

let cj = createjs;
let stage_graph, stage_status;
// graph
let panel_shape, border_shape;
let chart_container, line_shape, vertex_shapes, highest_shape;
let n, x_min, x_max, y_min, y_max;

//devoting graph
let devoting_panel_shape, devoting_border_shape;
let devoting_chart_container, devoting_line_shape, devoting_vertex_shapes, devoting_highest_shape;
let devoting_n, devoting_x_min, devoting_x_max, devoting_y_min, devoting_y_max;
let devoting_rating_history = []

// status
let border_status_shape;
let rating_text, place_text, diff_text, date_text, contest_name_text;
let particles;
let standings_url;
const username = document.getElementsByClassName("username")[0].textContent;
//クリエイトjsとやらをつかっている
//いい感じにキャンバスの大きさを設定してマウスオーバーもONにする
function initStage(stage, canvas) {
    let width = canvas.getAttribute('width');// <canvas width="">を取得
    let height = canvas.getAttribute('height');

    //最悪、なくても画質悪くなったが動いた よくわからん
    if (window.devicePixelRatio) {//ピクセル比 によって解像度を変える 本来は２のときに１にしたらぼやけた
        //縦横の設定
        canvas.setAttribute('width', Math.round(width * window.devicePixelRatio));//Math.round()は四捨五入
        canvas.setAttribute('height', Math.round(height * window.devicePixelRatio));
        stage.scaleX = stage.scaleY = window.devicePixelRatio;
    }
    //最大のキャンパスサイズ＝もとのキャンバスサイズにする
    canvas.style.maxWidth = width + "px";
    canvas.style.maxHeight = height + "px";
    canvas.style.width = canvas.style.height = "100%";
    stage.enableMouseOver();
}
//parent===stageに図形を追加し、その図形をreturnで参照渡し
function newShape(parent) {
    let s = new cj.Shape();
    parent.addChild(s);
    return s;
}
//上のテキストバージョン
function newText(parent, x, y, font) {
    let t = new cj.Text("", font, "#000");
    t.x = x;
    t.y = y;
    t.textAlign = "center";
    t.textBaseline = "middle";
    parent.addChild(t);
    return t;
}
//多分一番の大元
function init() {
    //rating_history はHTML内で取得してある
    //rating_history=[{"EndTime":時間(単位不明),"NewRating":11,"OldRating":0,"Place":5200,"ContestName":"コンテスト名","StandingsUrl":"/contests/m-solutions2020/standings?watching=kemkemG0"}];
    n = rating_history.length;
    devoting_n = devoting_rating_history.length;
    if (n == 0 ) return;

    //土台のステージ　これに図形とかを追加していくイメージ
    stage_graph = new cj.Stage("ratingGraph");// Stage("canvasのID");
    stage_status = new cj.Stage("ratingStatus");
    initStage(stage_graph, canvas_graph);
    initStage(stage_status, canvas_status);

    //グラフのサイズ決定
    x_min = 100000000000;
    x_max = 0;
    y_min = 10000;
    y_max = 0;
    for (let i = 0; i < n; i++) {
        x_min = Math.min(x_min, rating_history[i].EndTime);
        x_max = Math.max(x_max, rating_history[i].EndTime);
        y_min = Math.min(y_min, rating_history[i].NewRating);
        y_max = Math.max(y_max, rating_history[i].NewRating);
    }
    x_min -= MARGIN_VAL_X;//最初にコンテストに参加した日ー1ヶ月
    x_max += MARGIN_VAL_X;//最後にコンテストに参加した日＋1ヶ月
    y_min = Math.min(1500, Math.max(0, y_min - MARGIN_VAL_Y_LOW));//いい感じに高さも設定
    y_max += MARGIN_VAL_Y_HIGH;

    //精進グラフのサイズ決定
    devoting_x_min = 100000000000;
    devoting_x_max = 0;
    devoting_y_min = 10000;
    devoting_y_max = 0;
    for (let i = 0; i < devoting_rating_history.length; i++) {
        devoting_x_min = Math.min(devoting_x_min, devoting_rating_history[i].epoch_second);
        devoting_x_max = Math.max(devoting_x_max, devoting_rating_history[i].epoch_second);
        devoting_y_min = Math.min(devoting_y_min, devoting_rating_history[i].point);
        devoting_y_max = Math.max(devoting_y_max, devoting_rating_history[i].point);
    }
    devoting_x_min -= MARGIN_VAL_X;//最初にコンテストに参加した日ー1ヶ月
    devoting_x_max += MARGIN_VAL_X;//最後にコンテストに参加した日＋1ヶ月
    devoting_y_min = Math.min(1500, Math.max(0, devoting_y_min - MARGIN_VAL_Y_LOW));//いい感じに高さも設定
    devoting_y_max += MARGIN_VAL_Y_HIGH;

    //形を決める
    y_min = Math.min(y_min, devoting_y_min);
    y_max = Math.max(y_max, devoting_y_max);
    x_min = Math.min(x_min, devoting_x_min);
    x_max = Math.max(x_max, devoting_x_max);

    initBackground();//背景の描画
    initChart();//プロットと直線の描画
    initDevotingChart()
    stage_graph.update();

    initStatus();//グラフの上のコンテスト情報とかの描画
    stage_status.update();
    //マウスオーバー時のほわほわの管理
    cj.Ticker.setFPS(60);
    cj.Ticker.addEventListener("tick", handleTick);
    function handleTick(event) {
        updateParticles();
        stage_status.update();
    }
}

function getPer(x, l, r) {
    return (x - l) / (r - l);
}
function getColor(x) {
    for (let i = COLORS.length - 1; i >= 0; i--) {
        if (x >= COLORS[i][0]) return COLORS[i];
    }
    return [-1, "#000000", 0.1];
}
function initBackground() {

    panel_shape = newShape(stage_graph);//stage_graphに図形を追加、また panel_shapeはstage_graphの内部とつながってる(オブジェクトは参照渡し)
    panel_shape.x = OFFSET_X;
    panel_shape.y = OFFSET_Y;
    panel_shape.alpha = 0.3;

    border_shape = newShape(stage_graph);
    border_shape.x = OFFSET_X;
    border_shape.y = OFFSET_Y;

    //左の軸のレートの設定
    function newLabelY(s, y) {
        let t = new cj.Text(s, LABEL_FONT, "#000");
        t.x = OFFSET_X - 10;//理解
        t.y = OFFSET_Y + y;
        t.textAlign = "right";
        t.textBaseline = "middle";
        stage_graph.addChild(t);
    }
    //上と同様にX軸のラベルの設定
    function newLabelX(s, x, y) {
        let t = new cj.Text(s, LABEL_FONT, "#000");
        t.x = OFFSET_X + x;
        t.y = OFFSET_Y + PANEL_HEIGHT + 2 + y;
        t.textAlign = "center";
        t.textBaseline = "top";
        stage_graph.addChild(t);
    }

    //https://createjs.com/docs/easeljs/classes/Graphics.html Graphics Classのドキュメント
    let y1 = 0;
    // グラフの中の正方形のパネルを色を設定
    for (let i = COLORS.length - 1; i >= 0; i--) {
        let y2 = PANEL_HEIGHT - PANEL_HEIGHT * getPer(COLORS[i][0], y_min, y_max);
        if (y2 > 0 && y1 < PANEL_HEIGHT) {
            y1 = Math.max(y1, 0);                           //rect ( x, y, w , h )
            panel_shape.graphics.beginFill(COLORS[i][1]).rect(0, y1, PANEL_WIDTH, Math.min(y2, PANEL_HEIGHT) - y1);
        }
        y1 = y2;
    }
    //Y軸ラベルの設定
    for (let i = 0; i <= y_max; i += STEP_SIZE) {
        if (i >= y_min) {
            let y = PANEL_HEIGHT - PANEL_HEIGHT * getPer(i, y_min, y_max);
            newLabelY(String(i), y);
            border_shape.graphics.beginStroke("#FFF").setStrokeStyle(0.5);
            if (i == 2000) border_shape.graphics.beginStroke("#000");
            border_shape.graphics.moveTo(0, y).lineTo(PANEL_WIDTH, y);
        }
    }
    border_shape.graphics.beginStroke("#FFF").setStrokeStyle(0.5);

    let month_step = 6;
    for (let i = 3; i >= 1; i--) {
        if (x_max - x_min <= YEAR_SEC * i + MARGIN_VAL_X * 2) month_step = i;//初めてすぐの人は短めに
    }

    //X軸ラベルの設定
    let first_flag = true;
    for (let i = START_YEAR; i < 3000; i++) {
        let break_flag = false;
        for (let j = 0; j < 12; j += month_step) {
            let month = ('00' + (j + 1)).slice(-2);
            let unix = Date.parse(String(i) + "-" + month + "-01T00:00:00") / 1000;
            if (x_min < unix && unix < x_max) {
                let x = PANEL_WIDTH * getPer(unix, x_min, x_max);
                if (j == 0 || first_flag) {
                    newLabelX(MONTH_NAMES[j], x, 0);
                    newLabelX(String(i), x, 13);
                    first_flag = false;
                } else {
                    newLabelX(MONTH_NAMES[j], x, 0);
                }
                border_shape.graphics.mt(x, 0).lt(x, PANEL_HEIGHT)
            }
            if (unix > x_max) { break_flag = true; break; }
        }
        if (break_flag) break;
    }
    border_shape.graphics.s("#888").ss(1.5).rr(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 2);
}

function initChart() {
    chart_container = new cj.Container();//コンテナでまとめると、同時に動かせたりして良い
    stage_graph.addChild(chart_container);
    chart_container.shadow = new cj.Shadow("rgba(0,0,0,0.3)", 1, 2, 3);//チャートの下に影

    line_shape = newShape(chart_container);
    highest_shape = newShape(chart_container);
    vertex_shapes = new Array();

    //マウスおいたら丸が大きくなるやつ
    function mouseoverVertex(e) {
        vertex_shapes[e.target.i].scaleX = vertex_shapes[e.target.i].scaleY = 1.2;
        stage_graph.update();
        setStatus(rating_history[e.target.i], true);
    };
    function mouseoutVertex(e) {
        vertex_shapes[e.target.i].scaleX = vertex_shapes[e.target.i].scaleY = 1;
        stage_graph.update();
    };

    let highest_i = 0;
    for (let i = 0; i < n; i++) {
        if (rating_history[highest_i].NewRating < rating_history[i].NewRating) {
            highest_i = i;
        }
    }
    //historyの数だけ配列にpushしてイベントリスナーも設定
    for (let i = 0; i < n; i++) {
        vertex_shapes.push(newShape(chart_container));
        vertex_shapes[i].graphics.beginStroke("#FFF");
        if (i == highest_i) vertex_shapes[i].graphics.s("#000");//Highestなら外枠を黒に
        vertex_shapes[i].graphics.setStrokeStyle(0.5).beginFill(getColor(rating_history[i].NewRating)[1]).dc(0, 0, 3.5);

        vertex_shapes[i].x = OFFSET_X + PANEL_WIDTH * getPer(rating_history[i].EndTime, x_min, x_max);
        vertex_shapes[i].y = OFFSET_Y + (PANEL_HEIGHT - PANEL_HEIGHT * getPer(rating_history[i].NewRating, y_min, y_max));

        vertex_shapes[i].i = i;//なにこれ？？

        let hitArea = new cj.Shape();
        hitArea.graphics.f("#000").dc(1.5, 1.5, 6);
        vertex_shapes[i].hitArea = hitArea;
        vertex_shapes[i].addEventListener("mouseover", mouseoverVertex);
        vertex_shapes[i].addEventListener("mouseout", mouseoutVertex);
    }

    {//highest 関連
        let dx = 80;
        if ((x_min + x_max) / 2 < rating_history[highest_i].EndTime) dx = -80;
        let x = vertex_shapes[highest_i].x + dx;
        let y = vertex_shapes[highest_i].y - 16;
        highest_shape.graphics.s("#FFF").mt(vertex_shapes[highest_i].x, vertex_shapes[highest_i].y).lt(x, y);
        highest_shape.graphics.s("#888").f("#FFF").rr(x - HIGHEST_WIDTH / 2, y - HIGHEST_HEIGHT / 2, HIGHEST_WIDTH, HIGHEST_HEIGHT, 2);
        highest_shape.i = highest_i;
        let highest_text = newText(stage_graph, x, y, "12px Lato");
        highest_text.text = "Highest: " + rating_history[highest_i].NewRating;
        highest_shape.addEventListener("mouseover", mouseoverVertex);
        highest_shape.addEventListener("mouseout", mouseoutVertex);
    }


    for (let j = 0; j < 2; j++) {
        if (j == 0) line_shape.graphics.s("#AAA").ss(2);
        else line_shape.graphics.s("#FFF").ss(0.5);//線の種類を変えてる？　よくわからん

        line_shape.graphics.mt(vertex_shapes[0].x, vertex_shapes[0].y);
        for (let i = 0; i < n; i++) {
            line_shape.graphics.lt(vertex_shapes[i].x, vertex_shapes[i].y);
        }
    }
}
function initDevotingChart() {
    devoting_chart_container = new cj.Container();//コンテナでまとめると、同時に動かせたりして良い
    stage_graph.addChild(devoting_chart_container);//これは devoting_じゃない
    devoting_chart_container.shadow = new cj.Shadow("rgba(0,0,0,0.3)", 1, 2, 3);//チャートの下に影

    devoting_line_shape = newShape(devoting_chart_container);
    devoting_highest_shape = newShape(devoting_chart_container);
    devoting_vertex_shapes = new Array();

    //historyの数だけ配列にpushしてイベントリスナーも設定
    for (let i = 0; i < devoting_n; i++) {
        devoting_vertex_shapes.push(newShape(devoting_chart_container));
        devoting_vertex_shapes[i].graphics.beginStroke("#FFF");
        if (i == devoting_n - 1) {
            devoting_vertex_shapes[i].graphics.s("#000");
            devoting_vertex_shapes[i].graphics.setStrokeStyle(1).beginFill(getColor(devoting_rating_history[i].point)[1]).dc(0, 0, 2.5);
        }
        else {
            devoting_vertex_shapes[i].graphics.setStrokeStyle(0.5).beginFill(getColor(devoting_rating_history[i].point)[1]).dc(0, 0, 2);
        }
        devoting_vertex_shapes[i].x = OFFSET_X + PANEL_WIDTH * getPer(devoting_rating_history[i].epoch_second, x_min, x_max);//devotingじゃないほうに合わせる？
        devoting_vertex_shapes[i].y = OFFSET_Y + (PANEL_HEIGHT - PANEL_HEIGHT * getPer(devoting_rating_history[i].point, y_min, y_max));
        devoting_vertex_shapes[i].i = i;
        let hitArea = new cj.Shape();
        hitArea.graphics.f("#000").dc(1.5, 1.5, 6);
        devoting_vertex_shapes[i].hitArea = hitArea;
    }
    //チャートの線関連
    for (let index = 0; index < 2; index++) {
        if (index == 0) devoting_line_shape.graphics.s("#AAA").ss(2);
        else devoting_line_shape.graphics.s("#FFF").ss(0.5);
        devoting_line_shape.graphics.mt(devoting_vertex_shapes[0].x, devoting_vertex_shapes[0].y);
        for (let i = 0; i < devoting_rating_history.length; i++) {
            devoting_line_shape.graphics.lt(devoting_vertex_shapes[i].x, devoting_vertex_shapes[i].y);
        }
    }
}
function initStatus() {
    border_status_shape = newShape(stage_status);
    rating_text = newText(stage_status, OFFSET_X + 75, OFFSET_Y + STATUS_HEIGHT / 2, "48px 'Squada One'");
    place_text = newText(stage_status, OFFSET_X + 160, OFFSET_Y + STATUS_HEIGHT / 2.7, "16px Lato");
    diff_text = newText(stage_status, OFFSET_X + 160, OFFSET_Y + STATUS_HEIGHT / 1.5, "11px Lato");
    diff_text.color = '#888';
    date_text = newText(stage_status, OFFSET_X + 200, OFFSET_Y + STATUS_HEIGHT / 4, "14px Lato");
    contest_name_text = newText(stage_status, OFFSET_X + 200, OFFSET_Y + STATUS_HEIGHT / 1.6, "20px Lato");
    date_text.textAlign = contest_name_text.textAlign = "left";
    contest_name_text.maxWidth = STATUS_WIDTH - 200 - 10;
    {
        let hitArea = new cj.Shape(); hitArea.graphics.f("#000").r(0, -12, contest_name_text.maxWidth, 24);
        contest_name_text.hitArea = hitArea;
        contest_name_text.cursor = "pointer";
        contest_name_text.addEventListener("click", function () {
            location.href = standings_url;
        });
    }
    particles = new Array();
    for (let i = 0; i < PARTICLE_MAX; i++) {
        particles.push(newText(stage_status, 0, 0, "64px Lato"));
        particles[i].visible = false;
    }
    setStatus(rating_history[rating_history.length - 1], false);
}

function getRatingPer(x) {
    let pre = COLORS[COLORS.length - 1][0] + STEP_SIZE;
    for (let i = COLORS.length - 1; i >= 0; i--) {
        if (x >= COLORS[i][0]) return (x - COLORS[i][0]) / (pre - COLORS[i][0]);
        pre = COLORS[i][0];
    }
    return 0;
}
//@#//@#//@#//@#//@#//@#//@#//  関係ない  //@#//@#//@#//@#//@#//@#//@#//@#//@#//@#
function getOrdinal(x) {
    let s = ["th", "st", "nd", "rd"], v = x % 100;
    return x + (s[(v - 20) % 10] || s[v] || s[0]);
}
function getDiff(x) {
    let sign = x == 0 ? 'ﾂｱ' : (x < 0 ? '-' : '+');
    return sign + Math.abs(x);
}
function setStatus(data, particle_flag) {
    let date = new Date(data.EndTime * 1000);
    let rating = data.NewRating, old_rating = data.OldRating;
    let place = data.Place;
    let contest_name = data.ContestName;
    let tmp = getColor(rating); let color = tmp[1], alpha = tmp[2];
    border_status_shape.graphics.c().s(color).ss(1).rr(OFFSET_X, OFFSET_Y, STATUS_WIDTH, STATUS_HEIGHT, 2);
    rating_text.text = rating;
    rating_text.color = color;
    place_text.text = getOrdinal(place);
    diff_text.text = getDiff(rating - old_rating);
    date_text.text = date.toLocaleDateString();
    contest_name_text.text = contest_name;
    if (particle_flag) {
        let particle_num = parseInt(Math.pow(getRatingPer(rating), 2) * (PARTICLE_MAX - PARTICLE_MIN) + PARTICLE_MIN);
        setParticles(particle_num, color, alpha, rating);
    }
    standings_url = data.StandingsUrl;
}
//Particle は マウスオーバー時のくるくるのやつｗ
function setParticle(particle, x, y, color, alpha, star_flag) {
    particle.x = x;
    particle.y = y;
    let ang = Math.random() * Math.PI * 2;
    let speed = Math.random() * 4 + 4;
    particle.vx = Math.cos(ang) * speed;
    particle.vy = Math.sin(ang) * speed;
    particle.rot_speed = Math.random() * 20 + 10;
    particle.life = LIFE_MAX;
    particle.visible = true;
    particle.color = color;

    if (star_flag) {
        particle.text = "★";
    } else {
        particle.text = "@";
    }
    particle.alpha = alpha;
}
function setParticles(num, color, alpha, rating) {
    for (let i = 0; i < PARTICLE_MAX; i++) {
        if (i < num) {
            setParticle(particles[i], rating_text.x, rating_text.y, color, alpha, rating >= STAR_MIN);
        } else {
            particles[i].life = 0;
            particles[i].visible = false;
        }
    }
}
function updateParticle(particle) {
    if (particle.life <= 0) {
        particle.visible = false;
        return;
    }
    particle.x += particle.vx;
    particle.vx *= 0.9;
    particle.y += particle.vy;
    particle.vy *= 0.9;
    particle.life--;
    particle.scaleX = particle.scaleY = particle.life / LIFE_MAX;
    particle.rotation += particle.rot_speed;
}
function updateParticles() {
    for (let i = 0; i < PARTICLE_MAX; i++) {
        if (particles[i].life > 0) {
            updateParticle(particles[i]);
        }
    }
}
//@#//@#//@#//@#//@#//@#//@#//  関係ない  //@#//@#//@#//@#//@#//@#//@#//@#//@#//@#

//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##//##

async function main() {
    //get json
    let allJson;
    try {
        const res = await fetch("https://kenkoooo.com/atcoder/atcoder-api/results?user=" + username);
        allJson = await res.json()
        console.log(allJson.length)
    } catch (reaseon) { console.log('try失敗') }
    {
        let isExist = {};
        for (let i = 0; i < allJson.length; i++) {//なぜか負のポイントがあったから追加
            if (allJson[i].result === 'AC' && 0 <= allJson[i].point && allJson[i].point <= 3000 && isExist[allJson[i].problem_id] === undefined) {
                devoting_rating_history.push({ ...allJson[i] });
                isExist[allJson[i].problem_id] = 0;
            }
        }
    }
    function compare(a, b) { return a.epoch_second - b.epoch_second; }//比較関数
    devoting_rating_history.sort(compare);//時間順にソート

    for (let i = 0; i < devoting_rating_history.length - 1; i++) {//合計の累積和的な
        devoting_rating_history[i + 1].point += devoting_rating_history[i].point;
        devoting_rating_history[i].point /= 100;
    }
    devoting_rating_history[devoting_rating_history.length - 1].point /= 100;
    //今までの累積和/100　が高さ

    let shoujinButtonID = document.getElementById('shoujinButtonID');
    shoujinButtonID.addEventListener('click', function () {
        devoting_chart_container.visible = !devoting_chart_container.visible;
        stage_graph.update();
    });

    init();

}

main();