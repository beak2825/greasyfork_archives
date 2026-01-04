// ==UserScript==
// @name         AtCoder Perf Graph
// @namespace    http://atcoder.jp/
// @version      1.0.3
// @description  レーティンググラフにパフォーマンスのグラフを重ねて表示します
// @author       nzm_ort
// @include      *://atcoder.jp/users*
// @exclude      *://atcoder.jp/users/*?graph=rank
// @exclude      *://atcoder.jp/users/*?graph=dist
// @exclude      *://atcoder.jp/users/*/history*
// @grant        none
// @require      https://code.jquery.com/jquery-1.8.0.min.js
// @run-at       document-end
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/476103/AtCoder%20Perf%20Graph.user.js
// @updateURL https://update.greasyfork.org/scripts/476103/AtCoder%20Perf%20Graph.meta.js
// ==/UserScript==
"use strict";

let scriptsArray = $('script');
scriptsArray[14].remove();
let copyPage = $("html").clone().html();
$("html").remove();
document.write(copyPage);

// 各値設定
{
    const element = document.getElementsByClassName('btn-text-group')[document.getElementsByClassName('btn-text-group').length - 1];
    const insertButton = Object.assign(document.createElement('button'), {
        className: '',
        id: 'onoffButton',
        style: '\
        margin-left:100px;\
        appearance: none;\
        border: 0;\
        border-radius: 5px;\
        background: #616161;\
        color: #fff;\
        padding: 5px 10px;\
        font-size: 16px;\
        n_clicks: 0;\
        '
    }
    );
    insertButton.textContent = "パフォーマンス ON/OFF切り替え"
    element.appendChild(insertButton)
}

// const
const MARGIN_VAL_X = 86400 * 30;
const MARGIN_VAL_Y_LOW = 100;//
const MARGIN_VAL_Y_HIGH = 300;
const OFFSET_X = 50;
const OFFSET_Y = 5;
const DEFAULT_WIDTH = 640;
let canvas_status = document.getElementById("ratingStatus");
const STATUS_WIDTH = canvas_status.width - OFFSET_X - 10;
const STATUS_HEIGHT = canvas_status.height - OFFSET_Y - 5;
let canvas_graph = document.getElementById("ratingGraph");
const PANEL_WIDTH = canvas_graph.width - OFFSET_X - 10;
const PANEL_HEIGHT = canvas_graph.height - OFFSET_Y - 30;

// highest吹き出しサイズ
const HIGHEST_WIDTH = 115;
const HIGHEST_HEIGHT = 20;
const LABEL_FONT = "12px Lato";
const START_YEAR = 2010;
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const YEAR_SEC = 86400 * 365;
const STEP_SIZE = 400;  // y軸のステップ数
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

//performance graph
let perf_panel_shape, perf_border_shape;
let perf_chart_container, perf_line_shape, perf_vertex_shapes, perf_highest_shape;
let perf_n, perf_x_min, perf_x_max, perf_y_min, perf_y_max;
let perf_rating_history = []

// status
let border_status_shape;
let rating_text, place_text, diff_text, date_text, contest_name_text, perf_text;
let particles;
let standings_url;
const username = document.getElementsByClassName("username")[0].textContent;

// キャンバスサイズなど設定
function initStage(stage, canvas) {
    let width = canvas.getAttribute('width');
    let height = canvas.getAttribute('height');
    console.log(height)

    if (window.devicePixelRatio) {
        //縦横の設定
        canvas.setAttribute('width', Math.round(width * 1));  // width*window.devicePixelRatioとすると検証で更新したときに2倍になってしまっていた(通常は問題ない？)
        canvas.setAttribute('height', Math.round(height * 1));  // width*window.devicePixelRatioとすると検証で更新したときに2倍になってしまっていた(通常は問題ない？)
        console.log(window.devicePixelRatio)
        stage.scaleX = stage.scaleY = 1;  // =window.devicePixelRatioとすると検証で更新したときに2倍になってしまっていた(通常は問題ない？)
    }

    //  minWidthも設定しないと検証で更新したときに小さくなってしまった(通常は問題なし？)
    canvas.style.maxWidth = width + "px";
    canvas.style.maxHeight = height + "px";
    canvas.style.minWidth = width + "px";
    canvas.style.minHeight = height + "px";
    canvas.style.width = canvas.style.height = "100%";
    stage.enableMouseOver();
}

// 図形の追加
function newShape(parent) {
    let s = new cj.Shape();
    parent.addChild(s);
    return s;
}
// テキストの追加
function newText(parent, x, y, font) {
    let t = new cj.Text("", font, "#000");
    t.x = x;
    t.y = y;
    t.textAlign = "center";
    t.textBaseline = "middle";
    parent.addChild(t);
    return t;
}

// 描画などもろもろ実行
function init(click_num) {
    // rating_history: ratingの変化情報
    // console.log(rating_history)で確認できる
    n = rating_history.length;
    perf_n = perf_rating_history.length;
    if (n == 0 ) return;

    // stage
    stage_graph = new cj.Stage("ratingGraph");  // Stage("canvasのID");
    stage_status = new cj.Stage("ratingStatus");
    initStage(stage_graph, canvas_graph);
    initStage(stage_status, canvas_status);

    //グラフサイズ
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
    x_min -= MARGIN_VAL_X; //最初にコンテストに参加した日ー1ヶ月
    x_max += MARGIN_VAL_X; //最後にコンテストに参加した日＋1ヶ月
    y_min = Math.min(1500, Math.max(0, y_min - MARGIN_VAL_Y_LOW));
    y_max += MARGIN_VAL_Y_HIGH;

    //  パフォーマンスグラフのサイズ
    //  x軸(日付)については、レーティンググラフと一緒なのでy軸のみ決定(パフォーマンスデータからmaxとminを取得)
    perf_y_min = 10000;
    perf_y_max = 0;
    for (let i = 0; i < perf_rating_history.length; i++) {
        perf_y_min = Math.min(perf_y_min, perf_rating_history[i].Performance);
        perf_y_max = Math.max(perf_y_max, perf_rating_history[i].Performance);
    }
    perf_y_min = Math.min(1500, Math.max(0, perf_y_min - MARGIN_VAL_Y_LOW));
    perf_y_max += MARGIN_VAL_Y_HIGH;

    // 偶数回クリックなら、パフォーマンスグラフが表示されている
    // レーティンググラフとパフォーマンスグラフから表示する高さを決定
    // 奇数回クリックの場合は、パフォグラフは表示されないのでレーティンググラフの高さをy軸に設定
    if (click_num%2===0){
        y_min = Math.min(y_min, perf_y_min);
        y_max = Math.max(y_max, perf_y_max);
    }

    initBackground();  // 背景の描画
    initChart(click_num);  // プロットと直線の描画
    initPerfChart(click_num)  // パフォーマンスグラフ描画
    stage_graph.update();

    initStatus(click_num);  // コンテスト情報描画
    stage_status.update();

    //マウスオーバー時のアニメーション
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
    panel_shape = newShape(stage_graph);
    panel_shape.x = OFFSET_X;
    panel_shape.y = OFFSET_Y;
    panel_shape.alpha = 0.3;

    border_shape = newShape(stage_graph);
    border_shape.x = OFFSET_X;
    border_shape.y = OFFSET_Y;

    // 左軸
    function newLabelY(s, y) {
        let t = new cj.Text(s, LABEL_FONT, "#000");
        t.x = OFFSET_X - 10;
        t.y = OFFSET_Y + y;
        t.textAlign = "right";
        t.textBaseline = "middle";
        stage_graph.addChild(t);
    }
    // x軸ラベル
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
    // グラフ中の(レートの)色設定
    for (let i = COLORS.length - 1; i >= 0; i--) {
        let y2 = PANEL_HEIGHT - PANEL_HEIGHT * getPer(COLORS[i][0], y_min, y_max);
        if (y2 > 0 && y1 < PANEL_HEIGHT) {
            y1 = Math.max(y1, 0);                           //rect ( x, y, w , h )
            panel_shape.graphics.beginFill(COLORS[i][1]).rect(0, y1, PANEL_WIDTH, Math.min(y2, PANEL_HEIGHT) - y1);
        }
        y1 = y2;
    }
    // y軸ラベル
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

    // x軸ラベル
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

function initChart(click_num4) {
    chart_container = new cj.Container();
    stage_graph.addChild(chart_container);
    chart_container.shadow = new cj.Shadow("rgba(0,0,0,0.3)", 1, 2, 3);  // 影

    line_shape = newShape(chart_container);
    highest_shape = newShape(chart_container);
    vertex_shapes = new Array();

    //  マウスホバー時のアニメーション
    function mouseoverVertex(e) {
        vertex_shapes[e.target.i].scaleX = vertex_shapes[e.target.i].scaleY = 1.2;
        stage_graph.update();
        setStatus(rating_history[e.target.i], perf_rating_history[e.target.i], true, click_num4);
    };
    function mouseoutVertex(e) {
        vertex_shapes[e.target.i].scaleX = vertex_shapes[e.target.i].scaleY = 1;
        stage_graph.update();
    };

    // 最高レーティング取得
    let highest_i = 0;
    for (let i = 0; i < n; i++) {
        if (rating_history[highest_i].NewRating < rating_history[i].NewRating) {
            highest_i = i;
        }
    }

    // rating-graph-plot(点、線は下で別に描画)
    for (let i = 0; i < n; i++) {
        vertex_shapes.push(newShape(chart_container));
        vertex_shapes[i].graphics.beginStroke("#FFF");
        if (i == highest_i) vertex_shapes[i].graphics.s("#000");//Highestなら外枠を黒に
        vertex_shapes[i].graphics.setStrokeStyle(0.5).beginFill(getColor(rating_history[i].NewRating)[1]).dc(0, 0, 3.5);

        vertex_shapes[i].x = OFFSET_X + PANEL_WIDTH * getPer(rating_history[i].EndTime, x_min, x_max);
        vertex_shapes[i].y = OFFSET_Y + (PANEL_HEIGHT - PANEL_HEIGHT * getPer(rating_history[i].NewRating, y_min, y_max));
        //console.log(rating_history[i].EndTime)
        vertex_shapes[i].i = i;

        let hitArea = new cj.Shape();
        hitArea.graphics.f("#000").dc(1.5, 1.5, 6);
        vertex_shapes[i].hitArea = hitArea;
        vertex_shapes[i].addEventListener("mouseover", mouseoverVertex);
        vertex_shapes[i].addEventListener("mouseout", mouseoutVertex);
    }

    {//highest
        let dx = 80;
        if ((x_min + x_max) / 2 < rating_history[highest_i].EndTime) dx = -80;
        let x = vertex_shapes[highest_i].x + dx;
        let y = vertex_shapes[highest_i].y - 16;
        highest_shape.graphics.s("#FFF").mt(vertex_shapes[highest_i].x, vertex_shapes[highest_i].y).lt(x, y);
        highest_shape.graphics.s("#888").f("#FFF").rr(x - HIGHEST_WIDTH / 2, y - HIGHEST_HEIGHT / 2, HIGHEST_WIDTH, HIGHEST_HEIGHT, 2);
        highest_shape.i = highest_i;
        let highest_text = newText(stage_graph, x, y, "12px Lato");
        highest_text.text = "Highest(Rate): " + rating_history[highest_i].NewRating;
        highest_shape.addEventListener("mouseover", mouseoverVertex);
        highest_shape.addEventListener("mouseout", mouseoutVertex);
    }

    // 線を描画(点と点をつなぐ)
    for (let j = 0; j < 2; j++) {
        if (j == 0) line_shape.graphics.s("#AAA").ss(2);
        else line_shape.graphics.s("#000").ss(0.5);

        line_shape.graphics.mt(vertex_shapes[0].x, vertex_shapes[0].y);
        for (let i = 0; i < n; i++) {
            line_shape.graphics.lt(vertex_shapes[i].x, vertex_shapes[i].y);
        }
    }
}

// パフォーマンスグラフの描画(基本はレーティンググラフと同様)
function initPerfChart(click_num2) {
    perf_chart_container = new cj.Container();
    stage_graph.addChild(perf_chart_container);
    perf_chart_container.shadow = new cj.Shadow("rgba(0,0,0,0.3)", 1, 2, 3);

    perf_line_shape = newShape(perf_chart_container);
    perf_highest_shape = newShape(perf_chart_container);
    perf_vertex_shapes = new Array();

    function mouseoverVertex(e) {
        perf_vertex_shapes[e.target.i].scaleX = perf_vertex_shapes[e.target.i].scaleY = 1.2;
        stage_graph.update();
        setStatus(rating_history[e.target.i], perf_rating_history[e.target.i], true, click_num2);
    };
    function mouseoutVertex(e) {
        perf_vertex_shapes[e.target.i].scaleX = perf_vertex_shapes[e.target.i].scaleY = 1;
        stage_graph.update();
    };

    // 最高パフォーマンスの取得
    let highest_i_perf = 0;
    for (let i = 0; i < n; i++) {
        if (perf_rating_history[highest_i_perf].Performance < perf_rating_history[i].Performance) {
            highest_i_perf = i;
        }
    }

    // performance-graph-plot
    for (let i = 0; i < perf_n; i++) {
        perf_vertex_shapes.push(newShape(perf_chart_container));
        perf_vertex_shapes[i].graphics.beginStroke("#FFF");
        if (i == highest_i_perf) {
            perf_vertex_shapes[i].graphics.s("#000");
            perf_vertex_shapes[i].graphics.setStrokeStyle(1).beginFill(getColor(perf_rating_history[i].Performance)[1]).dc(0, 0, 2.5);
        }
        else {
            perf_vertex_shapes[i].graphics.setStrokeStyle(0.5).beginFill(getColor(perf_rating_history[i].Performance)[1]).dc(0, 0, 2.8);
        }
        perf_vertex_shapes[i].x = OFFSET_X + PANEL_WIDTH * getPer(rating_history[i].EndTime, x_min, x_max);
        perf_vertex_shapes[i].y = OFFSET_Y + (PANEL_HEIGHT - PANEL_HEIGHT * getPer(perf_rating_history[i].Performance, y_min, y_max));
        perf_vertex_shapes[i].i = i;
        let hitArea = new cj.Shape();
        hitArea.graphics.f("#000").dc(1.5, 1.5, 6);
        perf_vertex_shapes[i].hitArea = hitArea;
        perf_vertex_shapes[i].addEventListener("mouseover", mouseoverVertex);
        perf_vertex_shapes[i].addEventListener("mouseout", mouseoutVertex);

    }

    {//highest-perf
        let dx_perf = 80;
        if ((x_min + x_max) / 2 < rating_history[highest_i_perf].EndTime) dx_perf = -80;
        let x = perf_vertex_shapes[highest_i_perf].x + dx_perf;
        let y = perf_vertex_shapes[highest_i_perf].y - 16;
        perf_highest_shape.graphics.s("#FFF").mt(perf_vertex_shapes[highest_i_perf].x, perf_vertex_shapes[highest_i_perf].y).lt(x, y);
        perf_highest_shape.graphics.s("#888").f("#FFF").rr(x - HIGHEST_WIDTH / 2, y - HIGHEST_HEIGHT / 2, HIGHEST_WIDTH, HIGHEST_HEIGHT, 2);
        perf_highest_shape.i = highest_i_perf;
        var highest_perf_text = newText(stage_graph, x, y, "12px Lato");
        highest_perf_text.text = "Highest(Perf): " + perf_rating_history[highest_i_perf].Performance;
        perf_highest_shape.addEventListener("mouseover", mouseoverVertex);
        perf_highest_shape.addEventListener("mouseout", mouseoutVertex);
    }

    // 線を描画
    for (let index = 0; index < 2; index++) {
        if (index == 0) perf_line_shape.graphics.s("#AAA").ss(2);
        else perf_line_shape.graphics.s("#F00").ss(0.5);
        perf_line_shape.graphics.mt(perf_vertex_shapes[0].x, perf_vertex_shapes[0].y);
        for (let i = 0; i < perf_rating_history.length; i++) {
            perf_line_shape.graphics.lt(perf_vertex_shapes[i].x, perf_vertex_shapes[i].y);
        }
    }

    // 最高パフォの吹き出し描画
    if (click_num2%2===0){
        perf_chart_container.visible = true
        highest_perf_text.text = "Highest(Perf): " + perf_rating_history[highest_i_perf].Performance;;
        stage_graph.update();
    }
    else{
        perf_chart_container.visible = false
        highest_perf_text.text = "";
        stage_graph.update();
    }
}

// status情報初期化関数
function initStatus(click_num5) {
    border_status_shape = newShape(stage_status);
    rating_text = newText(stage_status, OFFSET_X + 75, OFFSET_Y + STATUS_HEIGHT / 2, "48px 'Squada One'");
    perf_text = newText(stage_status, OFFSET_X + 75, OFFSET_Y + STATUS_HEIGHT / 2+25, "16px 'Squada One'")
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
    setStatus(rating_history[rating_history.length - 1], perf_rating_history[perf_rating_history.length-1], false, click_num5);
}

function getRatingPer(x) {
    let pre = COLORS[COLORS.length - 1][0] + STEP_SIZE;
    for (let i = COLORS.length - 1; i >= 0; i--) {
        if (x >= COLORS[i][0]) return (x - COLORS[i][0]) / (pre - COLORS[i][0]);
        pre = COLORS[i][0];
    }
    return 0;
}

function getOrdinal(x) {
    let s = ["th", "st", "nd", "rd"], v = x % 100;
    return x + (s[(v - 20) % 10] || s[v] || s[0]);
}
function getDiff(x) {
    let sign = x == 0 ? 'ﾂｱ' : (x < 0 ? '-' : '+');
    return sign + Math.abs(x);
}

// status更新
function setStatus(data, data2, particle_flag, click_num3) {
    let date = new Date(data.EndTime * 1000);
    let rating = data.NewRating, old_rating = data.OldRating;
    let place = data.Place;
    let contest_name = data.ContestName;
    let perf = data2.Performance;
    let tmp = getColor(rating); let color = tmp[1], alpha = tmp[2];
    border_status_shape.graphics.c().s(color).ss(1).rr(OFFSET_X, OFFSET_Y, STATUS_WIDTH, STATUS_HEIGHT, 2);
    rating_text.text = rating;
    rating_text.color = color;
    perf_text.text = "perf: " + perf;
    place_text.text = getOrdinal(place);
    diff_text.text = getDiff(rating - old_rating);
    date_text.text = date.toLocaleDateString();
    contest_name_text.text = contest_name;
    if (particle_flag) {
        let particle_num = parseInt(Math.pow(getRatingPer(rating), 2) * (PARTICLE_MAX - PARTICLE_MIN) + PARTICLE_MIN);
        setParticles(particle_num, color, alpha, rating);
    }
    standings_url = data.StandingsUrl;

    // 偶数回クリック(パフォグラフが表示されている)ならレートのしたにパフォを表示
    if (click_num3%2===0){
        perf_text.text = "perf: " + perf;
        stage_graph.update();
    }
    // 奇数回なら表示しない
    else{
        perf_text.text = ""
        stage_graph.update();
    }
}

// ホバー時のレート変化アニメーション
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

// main関数
async function main() {

    //get json\
    try {
        let parser = new DOMParser();
        json = await (await fetch(`https://atcoder.jp/users/${username}/history/json`)).json();
        page = parser.parseFromString(await (await fetch(`https://atcoder.jp/users/${username}/history`)).text(),"text/html").getElementById("history").children[1].children;
    } catch (reaseon) { console.log('try失敗') }
    {
        // rated参加ならデータに追加
        for (let i = 0; i < json.length; i++) {
            let rated = json[i].IsRated;
            if (rated){
                json[i].Performance=Number(page[i].children[3].innerText);
                perf_rating_history.push({ ...json[i] });
            }
        // パフォが低いものはマイナスパフォになってることがあるのでマイナスの場合は0としておく
        for (let i = 0; i < perf_rating_history.length; i++) {
            if (perf_rating_history[i].Performance<0){
                perf_rating_history[i].Performance = 0;
            }
        }
        }
        // console.log(perf_rating_history)
    }

    // 描画関数実行
    // onoffボタンがクリックされたら切り替え
    init(0);
    let clickCount1 = 0;
    let onoffButton = document.getElementById('onoffButton');
    onoffButton.addEventListener('click', function () {
        clickCount1 += 1
        init(clickCount1);
        // console.log(clickCount1)
        // console.log(perf_chart_container.visible)
    })
}

main();