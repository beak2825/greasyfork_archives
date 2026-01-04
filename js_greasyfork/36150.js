// ==UserScript==
// @name         ConCon Collector Plus
// @namespace    https://www.TakeAsh.net/
// @author       take-ash
// @description  modify 'ConCon Collector' site
// @version      2025-04-05_05:00
// @match        https://concon-collector.com/*
// @match        https://c4.concon-collector.com/*
// @match        http://concon-collector.com/*
// @match        http://c4.concon-collector.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=concon-collector.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36150/ConCon%20Collector%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/36150/ConCon%20Collector%20Plus.meta.js
// ==/UserScript==

(async (w, d) => {
  if (!location.host.match(/concon-collector\.com$/)) { return; }
  const loadScript = (src) => new Promise((resolve, reject) => {
    const script = d.createElement('script');
    script.onload = () => { resolve((/([^\/]+)$/.exec(src))[1]); };
    script.onerror = reject;
    script.src = src;
    d.head.appendChild(script);
  });
  const results = await Promise.all([
    'https://www.takeash.net/js/modules/PrepareElement.js',
  ].map((src) => loadScript(src)));
  console.log(results);

  /**
    コンフィグデフォルト値
  */
  function configDefault() {
    this['.MyUserId'] = { 'type': 'n', 'value': 0, 'desc': '自分のユーザーID', };
    this.ChangeVisitedLinkColor = { 'type': 'b', 'value': 1, 'desc': '訪問済みリンクの色を変更する', };
    this.VisitedLinkColor = { 'type': 'c', 'value': '#7FCF00', 'desc': '訪問済みリンクの色', };
    this.AddInventorySubMenu = { 'type': 'b', 'value': 1, 'desc': '「所持品」サブメニューを追加する', };
    this.AddReliefSubMenu = { 'type': 'b', 'value': 1, 'desc': '「救援」サブメニューを追加する', };
    this.AddOnDemandSubMenu = { 'type': 'b', 'value': 1, 'desc': '「随時」サブメニューを追加する', };
    this.AddDailySubMenu = { 'type': 'b', 'value': 1, 'desc': '「デイリー」サブメニューを追加する', };
    this.AddEventSubMenu = { 'type': 'b', 'value': 0, 'desc': '「イベント」サブメニューを追加する', };
    this.ShortenMenu = { 'type': 'b', 'value': 1, 'desc': '共通メニューを短縮する', };
    this.OpenNewBoss = { 'type': 'b', 'value': 1, 'desc': '「救援要請」で新しいタブを開く', };
    this.ShrinkRelief = { 'type': 'b', 'value': 0, 'desc': '「救援要請」を縮める', };
    this.HighlightExploreBoss = { 'type': 'b', 'value': 0, 'desc': '「探索」ボスを強調する', };
    this.AddReliefRequestLink = { 'type': 'b', 'value': 1, 'desc': '「発見済一覧」に「救援要請」リンクを追加', };
    this.OpenNewYell = { 'type': 'b', 'value': 1, 'desc': '「エールを送る」で新しいタブを開く', };
    this.AddBossLogLink = { 'type': 'b', 'value': 1, 'desc': '普通γクラスタの救援要請ページに戦闘履歴へのリンクを追加する', };
    this.focusAttackForGamma = {
      'type': 'sel', 'value': '', 'desc': 'γクラスタ救援ページ自動フォーカス',
      'options': { '自動フォーカスしない': '', '「攻撃する」にフォーカス': '1', '「10回攻撃する」にフォーカス': '10' },
    };
    this.focusAttackForDGamma = {
      'type': 'sel', 'value': '', 'desc': '分散型γクラスタ討伐ページ自動フォーカス(自分)',
      'options': { '自動フォーカスしない': '', '「攻撃する」にフォーカス': '1', '「10回攻撃する」にフォーカス': '10' },
    };
    this.focusRescueForDGamma = {
      'type': 'sel', 'value': '', 'desc': '分散型γクラスタ討伐ページ自動フォーカス(仲間)',
      'options': { '自動フォーカスしない': '', '「救援する」にフォーカス': '1' },
    };
    this.focusReliefRequest = { 'type': 'b', 'value': 1, 'desc': '救援要請を「送る」ボタンにフォーカスする', };
    this.AutoKillDGamma = {
      'type': 'sel', 'value': '100', 'desc': '指定時間が経過していたら分散型γクラスタを攻撃する',
      'options': { '攻撃しない': '0', '10分': '10', '20分': '20', '30分': '30', '45分': '45', '1時間': '60', '1時間20分': '80', '1時間40分': '100', '2時間': '120', '3時間': '180', '4時間': '240', '6時間': '360', '8時間': '480', '12時間': '720', '16時間': '960', '20時間': '1200', '23時間30分': '1410' },
    };
    this.AlertVolumeOnDGammaTimeUp = {
      'type': 'sel', 'value': 0.0, 'desc': '分散型γクラスタについて指定時間が経過したときに鳴らす警告音量',
      'options': { '鳴らさない': '0.0', '25%': '0.25', '50%': '0.5', '75%': '0.75', '100%': '1.0' },
    };
    this.AutoFightOnSuppression = { 'type': 'b', 'value': 1, 'desc': '「制圧」で「戦う」を自動選択', };
    this.foldBooks = { 'type': 'b', 'value': 1, 'desc': 'アイテムページで教本リストを折り畳む', };
    this.focusUseItem = { 'type': 'b', 'value': 0, 'desc': 'アイテムページで「使う」に自動フォーカス', };
    this.focusGenerate = { 'type': 'b', 'value': 0, 'desc': '狐魂生成装置で自動フォーカス', };
    this.AddCCViewLink = { 'type': 'b', 'value': 1, 'desc': '狐魂アイコンにプレビューページへのリンクを追加する', };
    this.SelectSameConConOnDblClick = { 'type': 'b', 'value': 1, 'desc': 'ダブルクリックで同じ狐魂を選択する', };
    this.AddInchingPage = { 'type': 'b', 'value': 1, 'desc': 'ページリストに微調整ボタンを追加', };
    this.ReplacePlate = { 'type': 'b', 'value': 1, 'desc': 'プレートを差し替える', };
    this.PlateRed = { 'type': 'cp', 'value': 'Mcd/#505000/#580000', 'desc': 'レッドプレートのカラーパターン', };
    this.PlateGreen = { 'type': 'cp', 'value': 'Mcd/#505050/#580000', 'desc': 'グリーンプレートのカラーパターン', };
    this.PlateBlue = { 'type': 'cp', 'value': 'Chk/#00243d/#505050', 'desc': 'ブループレートのカラーパターン', };
    this.PlateCyan = { 'type': 'cp', 'value': 'StrV/#002119/#000000/#381c12', 'desc': 'シアンプレートのカラーパターン', };
    this.PlatePurple = { 'type': 'cp', 'value': 'Wave/#443007/#000000/#505050', 'desc': 'パープルプレートのカラーパターン', };
    this.PlatePeach = { 'type': 'cp', 'value': 'Dot/#7f0000/#bf3f3f/#7f0000', 'desc': 'ピーチプレートのカラーパターン', };
    this.PlateGrass = { 'type': 'cp', 'value': 'StrV/#3fbf3f/#007f00', 'desc': 'グラスプレートのカラーパターン', };
    this.PlateMarine = { 'type': 'cp', 'value': 'Dot/#00007f/#3f3fbf', 'desc': 'マリンプレートのカラーパターン', };
    this.PlateSunLight = { 'type': 'cp', 'value': 'Chk/#bfbf2f/#9f9f28', 'desc': 'サンライトプレートのカラーパターン', };
    this.PlateSky = { 'type': 'cp', 'value': 'Star/#3fbfbf/#2f9f9f', 'desc': 'スカイプレートのカラーパターン', };
    this.PlateLilac = { 'type': 'cp', 'value': 'Vrtx/#bf3fbf/#9f2f9f', 'desc': 'ライラックプレートのカラーパターン', };
    this.PlateBrown = { 'type': 'cp', 'value': 'Mcd/#a52a2a/#6e1c1c', 'desc': 'ブラウンプレートのカラーパターン', };
    this.PlateOliveDrab = { 'type': 'cp', 'value': 'Mcd/#6b8e23/#475e17', 'desc': 'オリーブドラブプレートのカラーパターン', };
    this.PlateCadetBlue = { 'type': 'cp', 'value': 'Mcd/#5f9ea0/#3f696a', 'desc': 'カデットブループレートのカラーパターン', };
    this.PlateFrenchBeige = { 'type': 'cp', 'value': 'Mcd/#a67b5b/#6e523c', 'desc': 'フレンチベージュプレートのカラーパターン', };
    this.PlateMossGreen = { 'type': 'cp', 'value': 'Mcd/#777e41/#4f542b', 'desc': 'モスグリーンプレートのカラーパターン', };
    this.PlateSlateGrey = { 'type': 'cp', 'value': 'Mcd/#708090/#4a5560', 'desc': 'スレートグレープレートのカラーパターン', };
    this.PlateOrange = { 'type': 'cp', 'value': 'Mcd/#ffa500/#aa6e00', 'desc': 'オレンジプレートのカラーパターン', };
    this.PlateRoyalBlue = { 'type': 'cp', 'value': 'Mcd/#4169e1/#2b4696', 'desc': 'ロイヤルブループレートのカラーパターン', };
    this.PlateLawnGreen = { 'type': 'cp', 'value': 'Mcd/#7cfc00/#52a800', 'desc': 'ローングリーンプレートのカラーパターン', };
    this.PlateBlack = { 'type': 'cp', 'value': 'Chk/#101010/#000000/#202020/#000000', 'desc': 'ブラックプレートのカラーパターン', };
    this.PlateSilver = { 'type': 'cp', 'value': 'StrH/#3f3f48/#2f2f38/#50505a/#3f3f48/#2f2f38', 'desc': 'シルバープレートのカラーパターン', };
    this.PlateGray = { 'type': 'cp', 'value': 'Mcd/#7f7f8f/#54545f', 'desc': 'グレイプレートのカラーパターン', };
    this.ShowAp = { 'type': 'b', 'value': 1, 'desc': 'APのリアルタイム表示', };
    this.ShowApOnTitle = { 'type': 'b', 'value': 1, 'desc': 'APをタイトルに表示', };
    this.EnableAutoLink = { 'type': 'b', 'value': 1, 'desc': 'プロフィールのキーワードを差し替える', };
  };

  /**
    カラーパターンオブジェクト
  */
  function ColorPattern(colors) {
    this.patternTypeList = {
      'Mcd': 'マケドニア', 'Chk': 'チェック', 'StrV': 'ストライプ(縦)', 'StrH': 'ストライプ(横)',
      'Dot': '水玉', 'Star': '五芒星', 'Wave': '波紋', 'Vrtx': '渦巻',
    };
    this.maxColors = 5;
    this.separator = '/';
    let patternType = 'Mcd';
    let cols = ['#505000', '#580000',];
    let validColors = cols.length;
    if (colors instanceof Array) {
      patternType = colors.shift();
      cols = colors;
    } else if (typeof colors == 'string') {
      cols = colors.split(new RegExp(quotemeta(this.separator)));
      patternType = cols.shift();
    }
    this.patternType = this.patternTypeList[patternType] ? patternType : 'Mcd';
    this.length = Math.min(cols.length, this.maxColors);
    this.colors = cols.slice(0, this.length);
    this.toString = function() {
      return this.patternType + this.separator +
        this.colors.join(this.separator);
    };
  };

  /**
    コンフィグウィンドウに編集用要素を配置する関数群
  */
  let makeEditElms = {
    'b': function(name, conf) {
      let value = conf['value'] * 1;
      return '<input type="radio" ' +
        'name="' + name + '" id="' + name + '_off" ' +
        'value="0" ' + (value ? '' : 'checked="1"') + ' >' +
        '<label for="' + name + '_off">Off</label> ' +
        '<input type="radio" ' +
        'name="' + name + '" id="' + name + '_on" ' +
        'value="1" ' + (value ? 'checked="1"' : '') + ' >' +
        '<label for="' + name + '_on">On</label>';
    },
    'n': function(name, conf) {
      return '<input type="number" ' +
        'name="' + name + '" id="' + name + '" ' +
        'value="' + conf['value'] + '"' +
        (typeof conf['min'] == 'undefined' ? '' : ' min="' + conf['min'] + '"') +
        (typeof conf['max'] == 'undefined' ? '' : ' max="' + conf['max'] + '"') +
        (typeof conf['step'] == 'undefined' ? '' : ' step="' + conf['step'] + '"') +
        '>';
    },
    'c': function(name, conf) {
      return '<input type="color" ' +
        'name="' + name + '" id="' + name + '" ' +
        'value="' + conf['value'] + '" >';
    },
    'sel': function(name, conf) {
      let ret = '';
      ret += '<select name="' + name + '" id="' + name + '" >';
      for (let opt in conf.options) {
        ret += '<option value="' + conf.options[opt] + '" ' +
          (conf.options[opt] == conf['value'] ? 'Selected="1" ' : '') + '>' + opt + '</option>';
      }
      ret += '</select> ';
      return ret;
    },
    'cp': function(name, conf) {
      let cp = new ColorPattern(conf['value']);
      let ret = '';
      ret += '<select name="' + name + '_P" id="' + name + '_P" >';
      for (let ptn in cp.patternTypeList) {
        ret += '<option value="' + ptn + '" ' +
          (ptn == cp.patternType ? 'Selected="1" ' : '') + '>' +
          cp.patternTypeList[ptn] +
          '</option>';
      }
      ret += '</select> ';
      ret += '<input type="button" ' +
        'name="btn' + name + '" id="btn' + name + '" ' +
        'value="テスト" ><br>';
      ret += '<input type="range" ' +
        'name="' + name + '_N" id="' + name + '_N" ' +
        'value="' + cp.length + '" ' +
        'min="1" max="' + cp.maxColors + '" step="1" ><br>';
      for (let i = 0; i < cp.maxColors; ++i) {
        ret += '<input type="color" ' +
          'name="' + name + '_C' + i + '" id="' + name + '_C' + i + '" ' +
          'value="' + (cp.colors[i] || '#000000') + '" >';
      }
      return ret;
    },
  };

  /**
    コンフィグウィンドウの内容を読み出す関数群
  */
  let configExporters = {
    'b': function(doc, id) {
      let elm = doc.getElementById(id + '_on');
      let ret = elm.checked ? elm.value : doc.getElementById(id + '_off').value;
      return ret;
    },
    'n': function(doc, id) {
      let ret = doc.getElementById(id).value;
      return ret;
    },
    'c': function(doc, id) {
      let ret = doc.getElementById(id).value;
      return ret;
    },
    'sel': function(doc, id) {
      let selectElm = doc.getElementById(id);
      return selectElm.options[selectElm.selectedIndex].value;
    },
    'cp': function(doc, id) {
      let ret = '';
      let selectElm = doc.getElementById(id + '_P');
      ret += selectElm.options[selectElm.selectedIndex].value;
      let n = doc.getElementById(id + '_N').value * 1.0;
      for (let i = 0; i < n; ++i) {
        ret += '/' + doc.getElementById(id + '_C' + i).value;
      }
      return ret;
    },
  };

  /**
    コンフィグウィンドウに値を設定する関数群
  */
  let configImporters = {
    'b': function(doc, id, value) {
      for (let i = 0, state; state = ["_on", "_off"][i]; ++i) {
        let elm = doc.getElementById(id + state);
        elm.checked = elm.value == value ? true : false;
      }
    },
    'n': function(doc, id, value) {
      doc.getElementById(id).value = value;
    },
    'c': function(doc, id, value) {
      doc.getElementById(id).value = value;
    },
    'sel': function(doc, id, value) {
      let selectElm = doc.getElementById(id);
      for (let i = 0, opt; opt = selectElm.options[i]; ++i) {
        opt.selected = opt.value == value;
      }
    },
    'cp': function(doc, id, value) {
      let cp = new ColorPattern(value);
      let selectElm = doc.getElementById(id + '_P');
      for (let i = 0, opt; opt = selectElm.options[i]; ++i) {
        opt.selected = opt.value == cp.patternType;
      }
      doc.getElementById(id + '_N').value = cp.length;
      for (let i = 0; i < cp.maxColors; ++i) {
        doc.getElementById(id + '_C' + i).value = (cp.colors[i] || '#000000');
      }
    },
  };

  /**
    プレートパターン描画関数群
  */
  let platePatternDrawer = {
    'Mcd': function(cp, ctx, width, height) {
      ctx.translate(width / 2, height / 2);
      let r = width > height ? width : height;
      let deltaTheta = Math.PI / (7.0 + cp.colors.length * 2);
      let colorIndex = 0;
      for (let theta = -deltaTheta / 1.5; theta < Math.PI * 2; theta += deltaTheta) {
        let x1 = r * Math.cos(theta);
        let y1 = r * Math.sin(theta);
        let x2 = r * Math.cos(theta + deltaTheta);
        let y2 = r * Math.sin(theta + deltaTheta);
        colorIndex = (++colorIndex) % cp.colors.length;
        ctx.fillStyle = cp.colors[colorIndex];
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.fill();
      }
    },
    'Chk': function(cp, ctx, width, height) {
      let r = (width < height ? width : height) / (7.0 + cp.colors.length * 2);
      for (let y = 0; y < height + r; y += r) {
        let colorIndex = Math.round(y / r) % cp.colors.length;
        for (let x = 0; x < width + r; x += r) {
          colorIndex = (++colorIndex) % cp.colors.length;
          ctx.fillStyle = cp.colors[colorIndex];
          ctx.fillRect(x, y, r, r);
        }
      }
    },
    'StrV': function(cp, ctx, width, height) {
      let r = (width < height ? width : height) / (7.0 + cp.colors.length * 2);
      let colorIndex = 0;
      for (let x = 0; x < width + r; x += r) {
        colorIndex = (++colorIndex) % cp.colors.length;
        ctx.fillStyle = cp.colors[colorIndex];
        ctx.fillRect(x, 0, r, height);
      }
    },
    'StrH': function(cp, ctx, width, height) {
      let r = (width < height ? width : height) / (7.0 + cp.colors.length * 2);
      let colorIndex = 0;
      for (let y = 0; y < height + r; y += r) {
        colorIndex = (++colorIndex) % cp.colors.length;
        ctx.fillStyle = cp.colors[colorIndex];
        ctx.fillRect(0, y, width, r);
      }
    },
    'Dot': function(cp, ctx, width, height) {
      if (cp.colors.length > 1) {
        let r = (width < height ? width : height) / (7.0 + cp.colors.length * 2);
        for (let y = 0; y < height + r; y += r) {
          let colorIndex = Math.round(y / r) % (cp.colors.length - 1) + 1;
          for (let x = 0; x < width + r; x += r) {
            colorIndex = (colorIndex) % (cp.colors.length - 1) + 1;
            ctx.fillStyle = cp.colors[colorIndex];
            ctx.beginPath();
            ctx.arc(x, y, r / 3, 0, 2 * Math.PI, true);
            ctx.fill();
          }
        }
      }
    },
    'Star': function(cp, ctx, width, height) {
      let head = 5;
      if (cp.colors.length > 1) {
        let r = (width < height ? width : height) / (7.0 + cp.colors.length * 2);
        let r2 = r / 2;
        for (let y = 0; y < height + r; y += r) {
          let colorIndex = Math.round(y / r) % (cp.colors.length - 1) + 1;
          for (let x = 0; x < width + r; x += r) {
            colorIndex = (colorIndex) % (cp.colors.length - 1) + 1;
            ctx.fillStyle = cp.colors[colorIndex];
            ctx.beginPath();
            ctx.moveTo(x + r2, y);
            for (let p = 0; p < head; ++p) {
              let angle = p * 4 / head * Math.PI;
              ctx.lineTo(x + r2 * Math.cos(angle), y + r2 * Math.sin(angle));
            }
            ctx.closePath();
            ctx.fill();
          }
        }
      }
    },
    'Wave': function(cp, ctx, width, height) {
      if (cp.colors.length > 1) {
        let r = (width < height ? width : height) / (7.0 + cp.colors.length * 2);
        for (let y = 0; y < height + r; y += r) {
          let colorIndex = Math.round(y / r) % cp.colors.length;
          for (let x = 0; x < width + r; x += r) {
            colorIndex = (++colorIndex) % cp.colors.length;
            ctx.fillStyle = cp.colors[colorIndex];
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI, true);
            ctx.fill();
          }
        }
      }
    },
    'Vrtx': function(cp, ctx, width, height) {
      ctx.translate(width / 2, height / 2);
      let head = 5;
      let colorIndex = 0;
      let dr = (width < height ? width : height) / (13.0 + cp.colors.length * 2);
      let angle2 = 1 / 6 / head * Math.PI;
      let angle3 = 0;
      for (let r = width > height ? width : height; r > 0; r -= dr) {
        angle3 += angle2;
        colorIndex = (++colorIndex) % cp.colors.length;
        ctx.fillStyle = cp.colors[colorIndex];
        ctx.beginPath();
        ctx.moveTo(r * Math.cos(angle3), r * Math.sin(angle3));
        for (let p = 1; p < head; ++p) {
          let angle = p * 2 / head * Math.PI + angle3;
          ctx.lineTo(r * Math.cos(angle), r * Math.sin(angle));
        }
        ctx.closePath();
        ctx.fill();
      }
    },
  };

  let cccp_config = loadConfig();

  /**
    背景色 => 勢力 変換テーブル
  */
  let powers = { 'rgb(88, 0, 0)': '炎', 'rgb(80, 80, 0)': '光', 'rgb(0, 64, 0)': '風', };

  /**
    マケドニアプレート
    背景色 => CSS クラス名
  */
  let macedonianPlates = {
    'rgb(127, 0, 0)': 'PlateRed',
    'rgb(0, 127, 0)': 'PlateGreen',
    'rgb(0, 0, 127)': 'PlateBlue',
    'rgb(0, 79, 79)': 'PlateCyan',
    'rgb(79, 0, 79)': 'PlatePurple',
    'rgb(191, 63, 63)': 'PlatePeach',
    'rgb(63, 191, 63)': 'PlateGrass',
    'rgb(63, 63, 191)': 'PlateMarine',
    'rgb(191, 191, 47)': 'PlateSunLight',
    'rgb(63, 191, 191)': 'PlateSky',
    'rgb(191, 63, 191)': 'PlateLilac',
    'rgb(165, 42, 42)': 'PlateBrown',
    'rgb(107, 142, 35)': 'PlateOliveDrab',
    'rgb(95, 158, 160)': 'PlateCadetBlue',
    'rgb(166, 123, 91)': 'PlateFrenchBeige',
    'rgb(119, 126, 65)': 'PlateMossGreen',
    'rgb(112, 128, 144)': 'PlateSlateGrey',
    'rgb(255, 165, 0)': 'PlateOrange',
    'rgb(65, 105, 225)': 'PlateRoyalBlue',
    'rgb(124, 252, 0)': 'PlateLawnGreen',
    'rgb(16, 16, 16)': 'PlateBlack',
    'rgb(63, 63, 72)': 'PlateSilver',
    'rgb(127, 127, 143)': 'PlateGray',
  };

  const uriHost = location.origin;
  const viewUrlBase = uriHost + '/view/default/';
  const icon40UrlBase = uriHost + '/img/pc/card40/';
  const icon60UrlBase = uriHost + '/img/pc/card/';
  const icon200UrlBase = uriHost + '/img/pc/card200/';
  const profileUrlBase = uriHost + '/profile/default/';
  const tinamiUserUrlBase = 'https://www.tinami.com/creator/profile/';
  const tinamiPicUrlBase = 'https://www.tinami.com/view/';
  const tinamiTagUrlBase = 'https://www.tinami.com/search/list?keyword=';
  const pixivUserUrlBase = 'https://www.pixiv.net/member.php?id=';
  const pixivPicUrlBase = 'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=';
  const pixivTagUrlBase = 'https://www.pixiv.net/search.php?s_mode=s_tag&word=';
  const nijieUserUrlBase = 'https://nijie.info/members.php?id=';
  const nijiePicUrlBase = 'https://nijie.info/view.php?id=';
  const nijieTagUrlBase = 'https://nijie.info/search.php?word=';
  const twitterSearchUrlBase = 'https://twitter.com/search?q=';
  const cccpLatestUrl = 'https://www.takeash.net/Etc/CCCollector/CCCP/CCCP.user.js';

  const keySender = 'ConCon Collector Plus';
  const commandNextRidHelp = 'nextRidHelp';
  const commandNextRidKill = 'nextRidKill';
  const keyAutoRidHelp = '_CCCP_AutoRidHelp';

  /**
    レア狐魂情報
  */
  let rareCCInfo = {
    'u10.gif': { 'name': '右近', 'title': '', 'power': '風', 'group': '1', 'rarity': 3, 'viewID': '1', 'nextFur': 0, },
    'u11.gif': { 'name': '左近', 'title': '', 'power': '風', 'group': '1', 'rarity': 3, 'viewID': '2', 'nextFur': 0, },
    'u12.gif': { 'name': '狐松明', 'title': '', 'power': '炎', 'group': '1', 'rarity': 3, 'viewID': '3', 'nextFur': 0, },
    'u13.gif': { 'name': 'イズナ', 'title': '', 'power': '風', 'group': '1', 'rarity': 4, 'viewID': '4', 'nextFur': 0, },
    'u17.gif': { 'name': 'こっくりさん', 'title': '', 'power': '炎', 'group': '1', 'rarity': 4, 'viewID': '8', 'nextFur': 0, },
    'u18.gif': { 'name': 'ユルグ', 'title': '青狐', 'power': '風', 'group': '10', 'rarity': 4, 'viewID': '9', 'nextFur': 0, },
    'u19.gif': { 'name': 'バロウバロウ', 'title': '野狐', 'power': '風', 'group': '10', 'rarity': 4, 'viewID': '10', 'nextFur': 0, },
    'u21.gif': { 'name': '木蓮', 'title': '白狐', 'power': '光', 'group': '1', 'rarity': 3, 'viewID': '12', 'nextFur': 0, },
    'u22.gif': { 'name': '平八', 'title': '賢狐', 'power': '風', 'group': '10', 'rarity': 3, 'viewID': '13', 'nextFur': 0, },
    'u23.png': { 'name': 'サンケ', 'title': '十字狐', 'power': '光', 'group': '1', 'rarity': 3, 'viewID': '14', 'nextFur': 0, },
    'u24.gif': { 'name': 'チロンナップ', 'title': '赤狐', 'power': '炎', 'group': '10', 'rarity': 3, 'viewID': '15', 'nextFur': 0, },
    'u25.gif': { 'name': 'チロンヌップ', 'title': '黒狐', 'power': '風', 'group': '10', 'rarity': 3, 'viewID': '16', 'nextFur': 0, },
    'u26.gif': { 'name': 'チロンノップ', 'title': '白狐', 'power': '光', 'group': '10', 'rarity': 3, 'viewID': '17', 'nextFur': 0, },
    'u27.gif': { 'name': 'ゾロ', 'title': '剣狐', 'power': '炎', 'group': '1', 'rarity': 3, 'viewID': '18', 'nextFur': 670, },
    'u28.gif': { 'name': 'ヴィクセン', 'title': '悪狐', 'power': '炎', 'group': '10', 'rarity': 3, 'viewID': '19', 'nextFur': 0, },
    'u29.gif': { 'name': 'コルルトホテフ', 'title': '悪狐', 'power': '炎', 'group': '1', 'rarity': 4, 'viewID': '20', 'nextFur': 0, },
    'u31.gif': { 'name': '八百万尾', 'title': '', 'power': '光', 'group': '1', 'rarity': 4, 'viewID': '22', 'nextFur': 0, },
    'u37.gif': { 'name': '伊丹狐', 'title': '', 'power': '光', 'group': '10', 'rarity': 5, 'viewID': '28', 'nextFur': 384, },
    'u38.gif': { 'name': '稲川狐', 'title': '', 'power': '風', 'group': '1', 'rarity': 3, 'viewID': '29', 'nextFur': 0, },
    'u39.gif': { 'name': '武狐', 'title': '', 'power': '炎', 'group': '10', 'rarity': 4, 'viewID': '30', 'nextFur': 0, },
    'u40.gif': { 'name': 'オトラ', 'title': '', 'power': '炎', 'group': '10', 'rarity': 5, 'viewID': '31', 'nextFur': 0, },
    'u41.gif': { 'name': '久兵衛', 'title': '', 'power': '風', 'group': '10', 'rarity': 5, 'viewID': '32', 'nextFur': 0, },
    'u42.gif': { 'name': 'ヘヴェリウス', 'title': '星狐', 'power': '光', 'group': '1', 'rarity': 4, 'viewID': '33', 'nextFur': 0, },
    's1.gif': { 'name': '櫨坊', 'title': '', 'power': '風', 'group': 'ショップ', 'rarity': 3, 'viewID': '34', 'nextFur': 0, },
    's3.gif': { 'name': 'ポン・ドゥドゥ', 'title': '', 'power': '光', 'group': 'ショップ', 'rarity': 3, 'viewID': '36', 'nextFur': 0, },
    'u1.gif': { 'name': 'ウィル', 'title': '鬼火の', 'power': '炎', 'group': '初期開始時', 'rarity': 3, 'viewID': '37', 'nextFur': 0, },
    'u2.gif': { 'name': 'フラウ', 'title': '閃光の', 'power': '光', 'group': '初期開始時', 'rarity': 3, 'viewID': '38', 'nextFur': 0, },
    'u3.gif': { 'name': 'カイン', 'title': '順風の', 'power': '風', 'group': '初期開始時', 'rarity': 3, 'viewID': '39', 'nextFur': 0, },
    'sg0.gif': { 'name': 'ぶんえいたん', 'title': '', 'power': '－', 'group': 'シリアル', 'rarity': 4, 'viewID': '40', 'nextFur': 0, },
    'sg1.gif': { 'name': 'ぶんえいたん(炎)', 'title': '', 'power': '炎', 'group': 'シリアル', 'rarity': 4, 'viewID': '40', 'nextFur': 0, },
    'sg2.gif': { 'name': 'ぶんえいたん(光)', 'title': '', 'power': '光', 'group': 'シリアル', 'rarity': 4, 'viewID': '40', 'nextFur': 0, },
    'sg3.gif': { 'name': 'ぶんえいたん(風)', 'title': '', 'power': '風', 'group': 'シリアル', 'rarity': 4, 'viewID': '40', 'nextFur': 0, },
  };

  /**
    AP/SP表示用インターバルID保持用
  */
  let APSPTimerId;

  /**
    プロフィール自動リンク用
  */
  let autoLinker = [
    {
      'name': 'web',
      'reg': /https?:[^\s<]+/g,
      'href': function(keyword) {
        return keyword;
      },
      'text': function(keyword) {
        return keyword;
      },
    },
    {
      'name': 'twitter',
      'reg': /@[a-zA-Z0-9_]+/g,
      'href': function(keyword) {
        return 'https://twitter.com/' + keyword.substr(1);
      },
      'text': function(keyword) {
        return keyword;
      },
    },
  ];

  /**
    プロフィール自動リンク(ブラケット記法)
    [[alias>keyword:param]]
  */
  let autoLinkerBracket = {
    'CCIcon40': function(keyword, param, alias) {
      alias = alias || rareCCInfo[param] && rareCCInfo[param].name || keyword + ':' + param;
      let viewID = getViewIdFromIconId(param);
      return '<a href="' + viewUrlBase + viewID + '" >' +
        '<img src="' + icon40UrlBase + param + '" alt="' + alias + '" title="' + alias + '" ></a>';
    },
    'CCIcon60': function(keyword, param, alias) {
      alias = alias || rareCCInfo[param] && rareCCInfo[param].name || keyword + ':' + param;
      let viewID = getViewIdFromIconId(param);
      return '<a href="' + viewUrlBase + viewID + '" >' +
        '<img src="' + icon60UrlBase + param + '" alt="' + alias + '" title="' + alias + '" ></a>';
    },
    'CCUser': function(keyword, param, alias) {
      alias = alias || keyword + ':' + param;
      let url = profileUrlBase + param;
      return '<a href="' + url + '" title="' + url + '" >' + alias + '</a>';
    },
    'TinamiUser': function(keyword, param, alias) {
      alias = alias || keyword + ':' + param;
      let url = tinamiUserUrlBase + param;
      return '<a href="' + url + '" title="' + url + '" target="_blank" >' + alias + '</a>';
    },
    'TinamiPic': function(keyword, param, alias) {
      alias = alias || keyword + ':' + param;
      let url = tinamiPicUrlBase + param;
      return '<a href="' + url + '" title="' + url + '" target="_blank" >' + alias + '</a>';
    },
    'TinamiTag': function(keyword, param, alias) {
      alias = alias || keyword + ':' + param;
      let url = tinamiTagUrlBase + encodeURIComponent(param);
      return '<a href="' + url + '" title="' + tinamiTagUrlBase + param + '" target="_blank" >' + alias + '</a>';
    },
    'PixivUser': function(keyword, param, alias) {
      alias = alias || keyword + ':' + param;
      let url = pixivUserUrlBase + param;
      return '<a href="' + url + '" title="' + url + '" target="_blank" >' + alias + '</a>';
    },
    'PixivPic': function(keyword, param, alias) {
      alias = alias || keyword + ':' + param;
      let url = pixivPicUrlBase + param;
      return '<a href="' + url + '" title="' + url + '" target="_blank" >' + alias + '</a>';
    },
    'PixivTag': function(keyword, param, alias) {
      alias = alias || keyword + ':' + param;
      let url = pixivTagUrlBase + encodeURIComponent(param);
      return '<a href="' + url + '" title="' + pixivTagUrlBase + param + '" target="_blank" >' + alias + '</a>';
    },
    /*
      'NijieUser': function( keyword, param, alias ){
        alias = alias || keyword + ':' + param;
        let url = nijieUserUrlBase + param;
        return '<a href="' + url + '" title="' + url + '" target="_blank" >' + alias + '</a>';
      },
      'NijiePic': function( keyword, param, alias ){
        alias = alias || keyword + ':' + param;
        let url = nijiePicUrlBase + param;
        return '<a href="' + url + '" title="' + url + '" target="_blank" >' + alias + '</a>';
      },
      'NijieTag': function( keyword, param, alias ){
        alias = alias || keyword + ':' + param;
        let url = nijieTagUrlBase + encodeURIComponent(param);
        return '<a href="' + url + '" title="' + nijieTagUrlBase + param + '" target="_blank" >' + alias + '</a>';
      },
    */
    'TwitterSearch': function(keyword, param, alias) {
      alias = alias || keyword + ':' + param;
      let url = twitterSearchUrlBase + encodeURIComponent(param);
      return '<a href="' + url + '" title="' + twitterSearchUrlBase + param + '" target="_blank" >' + alias + '</a>';
    },
  };

  /**
    プロフィール用自動差し替え(プラグイン記法)
  */
  let replacingPlugin = {
    'color': function(plugin, param, target) {
      let params = param.split(/\s*,\s*/);
      return params ?
        '<span style="' +
        (params[0] ? 'color:' + params[0] + ';' : '') +
        (params[1] ? 'background-color:' + params[1] + ';' : '') +
        '" >' + target + '</span>' :
        target;
    },
  };

  addMetaElement();
  addCCCPStyle();

  /* ページ共通処理 */
  /* 共通メニューにリンクを追加 */
  const commonMenu = getNodesByXpath('//div[@class="common_menu"]/div')[0];
  if (commonMenu) {
    if (cccp_config.AddInventorySubMenu.value == 1) {
      commonMenu.removeChild(commonMenu.lastChild);
      commonMenu.removeChild(commonMenu.lastChild);
      addSubMenu(commonMenu, { textContent: '所持品', href: '/inventory' }, [
        { href: '/use/potion/aW52ZW50b3J5', textContent: 'AP回復薬', },
        { href: '/use/gavel/6', textContent: '小槌', },
        { href: '/use/gavel/7', textContent: '大槌', },
        { href: '/use/whitewheat/45', textContent: 'ホワイトウィート', },
      ]);
    }
    if (cccp_config.AddReliefSubMenu.value == 1) {
      addSubMenu(commonMenu, '救援', [
        { href: '/chat', target: 'chatPage', textContent: 'チャット', },
        { href: '/relief', target: 'reliefPage', textContent: '救援', },
        { href: '/rid/list', target: 'ridPage', textContent: '分散', },
      ]);
    }
    if (cccp_config.AddOnDemandSubMenu.value == 1) {
      addSubMenu(commonMenu, '随時', [
        { href: '/shop/absorber', textContent: '砂時計', },
        { href: '/message/boss', textContent: 'ボス履歴', },
      ]);
    }
    if (cccp_config.AddDailySubMenu.value == 1) {
      addSubMenu(commonMenu, 'デイリー', [
        { href: '/eshop/limited', textContent: '日替わり限定品', },
        { href: '/blackmarket/potion', textContent: 'AP回復薬 - 闇市', },
        { href: '/use/gamma/23', textContent: 'γ抗体(中) - 所持品', },
        { href: '/use/gamma/24', textContent: 'γ抗体(大) - 所持品', },
        { href: '/loginbonus', textContent: 'ログインボーナス', },
      ]);
    }
    if (cccp_config.AddEventSubMenu.value == 1) {
      addSubMenu(commonMenu, { textContent: '呼び声イベント', href: '/eventlog/xmas2023' }, [
        { href: '/use/xmas2023/81', textContent: '福引券', },
        { href: '/use/xmas2023cake/82', textContent: '小ケーキ', },
        { href: '/use/xmas2023cake/83', textContent: '中ケーキ', },
        { href: '/use/xmas2023cake/84', textContent: '大ケーキ', },
        { href: '/use/xmas2023cake/85', textContent: '特大ケーキ', },
      ]);
    }
    addMenuItem(commonMenu, { href: 'javascript:void(0);', textContent: '設定', events: { click: openConfig, }, });
    if (cccp_config.ShortenMenu.value == 1) {
      let links = commonMenu.getElementsByTagName('a');
      for (let i = 0, lnk; lnk = links[i]; ++i) {
        lnk.title = lnk.textContent;
        lnk.textContent = lnk.textContent.slice(0, 1);
      }
    }
  }

  /* 固定情報エリア追加 */
  let infoAreaElm = d.createElement('div');
  infoAreaElm.id = 'infoArea';
  infoAreaElm.className = 'infoArea';
  d.getElementsByTagName('body')[0].appendChild(infoAreaElm);

  if (cccp_config.ShowAp.value == 1 && location.pathname != '/help/alllist') {
    let apInfoElm = d.createElement('p');
    apInfoElm.id = 'ApInfo';
    apInfoElm.className = 'ApSpInfo';
    apInfoElm.innerHTML = '<span class="keyword">AP</span> ' +
      '<span id="apCurrent">0</span>/<span id="apMax">00</span> ' +
      '(<span id="apSec">00</span>)<br>' +
      '<span class="keyword">全回復</span> <span id="apFull">00:00</span>';
    infoAreaElm.appendChild(apInfoElm);
  }

  addCCViewLink();

  /* ページ個別処理 */
  location.pathname.match(/\/([^\/]+\/?[^\/]*)/);
  let page = RegExp.$1;
  addApInfo(page);
  replaceBackPanel(page);
  switch (page) {
    case 'status':
      getMyUserId();
      break;
    case 'relief':
    case 'relief/default':
    case 'rid/list':
      modBossPage();
      addRidKillAll(page);
      setAutoKill(page);
      addReliefRequest(page);
      break;
    case 'explore/coop':
    case 'rid/attack':
      setAttackFocus(page);
      break;
    case 'explore/relief':
    case 'rid/relief':
      setReliefFocus(page);
      break;
    case 'chat':
    case 'chat/default':
      modBossPage();
      changeBossStyleInChat();
      showChatLength();
      break;
    case 'friend':
    case 'friend/default':
    case 'friend/profile':
    case 'profile/default':
      addRateDiffForPage(page);
    case 'friend/yell':
    case 'friend/yellmessage':
    case 'status/yell':
      addAutoLink(page);
      modFriendPage(page);
      break;
    case 'explore/relief':
      modExpReliefPage(page);
      break;
    case 'conv':
    case 'conv/default':
      modConvPage(page);
      break;
    case 'battle':
      getMyRate(page);
    case 'battle/ranking':
      addRateDiffForPage(page);
      break;
    case 'battle/user':
      modPreBattlePage(page);
      break;
    case 'view/default':
      addNextFurLink(page);
      break;
    case 'ridt/session':
      selectFightOnSuppression(page);
      break;
    case 'inventory':
    case 'inventory/default':
      foldBooks(page);
      break;
    case 'use/item':
      setUseFocus(page);
      break;
    case 'use/moultto':
    case 'use/moultcto':
      addCheckBoxForMoult(page);
      break;
    case 'use/generator':
      setGenerateFocus(page);
      break;
    case 'use/storage':
      setVotingFocus(page);
      break;
    case 'use/gamma':
      addAdjustGammaButton(page);
      break;
    case 'use/salvation':
    case 'use/salvationc':
    case 'blackmarket/recycle':
    case 'blackmarket/recyclec':
    case 'departure':
    case 'departure/default':
      selectSameConConOnDblClick(page);
      addInchingPage(page);
      break;
    case 'use/xmas2023':
    case 'use/xmas2023cake':
      addRadioLabel(page);
      break;
  }

  /**
    クッキーからコンフィグ設定を読み込む
  */
  function loadConfig() {
    let key = '_CCCP_Config';
    let config = getCookie(key);
    setCookie(key, config, 30);
    return decodeConfig(config);
  }

  /**
    コンフィグ文字列をオブジェクト化する
    http://chupacabra.sakura.ne.jp/?p=320
  */
  function decodeConfig(configString) {
    let conf = new configDefault();
    let configPairs = configString.split(/_/);
    for (let i = 0, pair; pair = configPairs[i]; ++i) {
      pair.match(/(.*):(.*)/);
      let key = RegExp.$1;
      let val = RegExp.$2;
      let prop = conf[key];
      if (prop) {
        prop['value'] = val;
      }
    }
    return conf;
  }

  /**
   * コンフィグオブジェクトを文字列化
   *
   * @param {configDefault} config - コンフィグオブジェクト
   * @returns {string} コンフィグ文字列
   */
  function encodeConfig(config) {
    return Object.keys(cccp_config)
      .map(function(prop) { return prop + ':' + config[prop].value; })
      .join('_');
  }

  /**
    コンフィグ設定画面を開く
  */
  function openConfig() {
    let htmlBody = '<html lang="ja">\n';
    htmlBody += '<head>\n';
    htmlBody += '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\n';
    htmlBody += '<link rel="stylesheet" type="text/css" href="' + uriHost + '/css/pc/cm.css"/>\n';
    htmlBody += '<meta http-equiv="Content-Script-Type" content="text/javascript"/>\n';
    htmlBody += '<title>CCCP Config</title>\n';
    htmlBody += '</head>\n';
    htmlBody += '<body class="configBody">\n';
    htmlBody += '<h1 class="config"><a href="' + cccpLatestUrl + '" target="_blank" >CCCP Config</a></h1>\n';
    htmlBody += '<table>';
    for (let prop in cccp_config) {
      let hide = prop.charAt(0) != '.' ?
        '' :
        'style="display:none;"';
      let conf = cccp_config[prop];
      htmlBody += '<tr class="config" ' + hide + '><th ' + (
        prop.match(/^Plate/) ? 'class="' + prop.replace(/^Plate/, 'plate') + '" ' : ''
      ) + '>' + conf['desc'] + '</th>' +
        '<td>' + makeEditElms[conf['type']](prop, conf) + '</td></tr>\n'
    }
    htmlBody += '<tr class="config"><td colspan="2" align="center"><input id="btnSave" type="button" value="設定" > <input id="btnCancel" type="button" value="キャンセル" ></td></tr>';
    htmlBody += '</table>';
    htmlBody += '<table>';
    htmlBody += '<tr class="config"><td><textarea id="configString" name="configString" cols="60" rows="8" ></textarea></td>';
    htmlBody += '<td align="center"><input id="btnExport" type="button" value="設定を文字列化" ><br><input id="btnImport" type="button" value="文字列を設定に適用" ><br><input id="btnInitialize" type="button" value="設定を既定値に戻す" ></td></tr>';
    htmlBody += '</table>';
    htmlBody += '</body>';
    htmlBody += '</html>';
    let winConfig = w.open('', 'configPage');
    let docNew = winConfig.document;
    docNew.open('text/html; charset=UTF-8');
    docNew.write(htmlBody);
    docNew.close();
    addCCCPStyle(docNew, 1);
    docNew.getElementById('btnSave').addEventListener('click', (function(win) {
      return function() {
        setCookie('_CCCP_Config', encodeConfig(getConfigWin(win)), 30);
        win.close();
      };
    })(winConfig), false);
    docNew.getElementById('btnCancel').addEventListener('click', (function(win) {
      return function() {
        win.close();
      };
    })(winConfig), false);
    docNew.getElementById('btnExport').addEventListener('click', (function(win) {
      let doc = win.document;
      return function() {
        doc.getElementById('configString').value = encodeConfig(getConfigWin(win));
      };
    })(winConfig), false);
    docNew.getElementById('btnImport').addEventListener('click', (function(win) {
      let doc = win.document;
      return function() {
        let configString = doc.getElementById('configString').value;
        setConfigWin(win, decodeConfig(configString));
      };
    })(winConfig), false);
    docNew.getElementById('btnInitialize').addEventListener('click', (function(win) {
      return function() {
        setConfigWin(win, new configDefault());
      };
    })(winConfig), false);
    Object.keys(cccp_config).filter((prop) => prop.match(/^Plate/))
      .forEach((prop) => {
        docNew.getElementById('btn' + prop).addEventListener(
          'click',
          () => {
            const doc = winConfig.document;
            const style = {};
            style[`.${prop.replace(/^plate/, 'Plate')}`] = {
              backgroundImage: `url(${createPlatePattern(configExporters['cp'](doc, prop))})`,
            };
            addStyle(style, doc);
          });
      });
    let alertElm = createAlertElement(docNew);
    docNew.getElementsByTagName('body')[0].appendChild(alertElm);
    let playAlertButton = docNew.createElement('input');
    playAlertButton.type = 'button';
    playAlertButton.value = 'テスト';
    playAlertButton.addEventListener('click', (function(win) {
      return function() {
        let volumeElm = docNew.getElementById('AlertVolumeOnDGammaTimeUp');
        alertElm.volume = volumeElm.options[volumeElm.selectedIndex].value - 0;
        alertElm.play();
      };
    })(winConfig), false);
    docNew.getElementById('AlertVolumeOnDGammaTimeUp').parentNode.appendChild(playAlertButton);
    return false;
  }

  /**
   * コンフィグウィンドウの設定内容を読み取りオブジェクト化する。
   *
   * @param {window} win - コンフィグが表示されているウィンドウ
   * @returns {configDefault} コンフィグオブジェクト
   */
  function getConfigWin(win) {
    let doc = win.document;
    return Object.keys(cccp_config)
      .reduce(
        function(conf, prop) {
          conf[prop].value = configExporters[cccp_config[prop].type](doc, prop);
          return conf;
        },
        new configDefault()
      );
  }

  /**
    コンフィグウィンドウに設定値を反映させる
  */
  function setConfigWin(win, config) {
    let doc = win.document;
    for (let prop in config) {
      let t = config[prop]['type'];
      configImporters[t](doc, prop, config[prop]['value']);
      if (t == 'cp') {
        doc.getElementById('btn' + prop).click();
      }
    }
  }

  /**
    共通メニューに項目を追加
  */
  function addMenuItem(commonMenu, props) {
    commonMenu.appendChild(d.createTextNode(' / '));
    props.tag = 'a';
    commonMenu.appendChild(prepareElement(props));
  }

  function addSubMenu(commonMenu, title, items) {
    commonMenu.appendChild(d.createTextNode(' / '));
    const subMenu = prepareElement({ tag: 'span', classes: ['sub_menu_title'] });
    if (typeof title == 'string') {
      subMenu.title = title;
      subMenu.appendChild(d.createTextNode(title.slice(0, 1)));
    } else {
      title.tag = 'a';
      subMenu.appendChild(prepareElement(title));
    }
    subMenu.appendChild(prepareSubMenu(items));
    commonMenu.appendChild(subMenu);
  }

  function prepareSubMenu(items) {
    return items.reduce(
      (list, item) => {
        item.tag = 'a';
        list.appendChild(prepareElement({ tag: 'li', children: [item] }));
        return list;
      },
      prepareElement({ tag: 'ul', classes: ['sub_menu_body'] })
    );
  }

  /**
    Meta 要素 (Content-Script-Type) 追加
  */
  function addMetaElement() {
    d.head.appendChild(prepareElement({
      tag: 'meta',
      httpEquiv: 'Content-Script-Type',
      content: 'text/javascript',
    }));
  }

  /**
    CSS 追加
  */
  function addCCCPStyle(doc, forConfig) {
    const styles = {
      'div.infoArea': { position: 'fixed', top: '0.2em', right: '0.4em', },
      'tr.convHeader': { textAlign: 'center', },
      'td.convNumeric': { textAlign: 'right', },
      'td.convMessage': { textAlign: 'center', },
      '.configBody': { marginLeft: '0.5em', marginRight: '0.5em', },
      '.config': { backgroundColor: '#606080', },
      '.ApSpInfo': {
        textAlign: 'right', padding: '0.4em',
        backgroundPosition: 'center',
      },
      '.common_menu': {
        position: 'sticky', top: '0em',
        backgroundColor: '#202020', display: 'flex',
        justifyContent: 'space-between',
      },
      '.sub_menu_title': { position: 'relative', },
      '.sub_menu_body': {
        position: 'absolute', display: 'none',
        backgroundColor: '#303030', left: '0%', top: '90%',
        margin: '0.0em', padding: '0.2em', listStyle: 'none',
      },
      '.sub_menu_title:hover .sub_menu_body': { display: 'block', },
      '.hide': { display: 'none', },
    };
    if (cccp_config.ReplacePlate.value == 1 || forConfig) {
      Object.keys(cccp_config).filter((p) => p.match(/^Plate\w+/))
        .forEach((p) => {
          styles[`.${p}`] = {
            backgroundImage: `url(${createPlatePattern(cccp_config[p].value)})`,
            backgroundPosition: 'center',
          };
        });
    }
    if (cccp_config.ChangeVisitedLinkColor.value == 1) {
      styles['a:visited'] = { color: cccp_config.VisitedLinkColor.value, };
    }
    if (cccp_config.ShrinkRelief.value == 1) {
      styles['#relief > div'] = {
        borderStyle: 'solid', borderWidth: '1px 0 0 0',
        margin: '4px', height: '1.25em',
      };
    }
    addStyle(styles, doc);
  }

  /**
    現在のAPの表示
  */
  function addApInfo(page) {
    if (cccp_config.ShowAp.value == 0 || location.pathname == '/help/alllist') {
      return;
    }
    let apInfo = [0, 0, 0];	// [ startTime(ms), apStart, apMax ]
    let startTime = new Date();
    let apInfoStr = getCookie('_CCCP_ApInfo');
    if (apInfoStr) {
      apInfo = apInfoStr.split(/_/);
      startTime = new Date(apInfo[0] * 1.0);
    }
    let apElm;
    switch (page) {
      case 'status':
        apElm = d.getElementById('ap');
        if (apElm) {
          apInfo[1] = apElm.textContent || apElm.innerText;
          let apLimitElm = d.getElementById('ap_limit');
          apInfo[2] = apLimitElm.textContent || apLimitElm.innerText;
          startTime = new Date();
        }
        break;
      case 'explore':
      case 'explore/default':
      case 'explore/away':
        apElm = getIteratorByXpath('//tr[./td/span[text()="AP"]]/td[4]').iterateNext() ||
          getIteratorByXpath('//tr[./td/span[text()="AP"]]/td[2]').iterateNext();
        if (apElm) {
          apElm.innerHTML.match(/^(\d+)/);
          apInfo[1] = RegExp.$1 * 1.0;
          startTime = new Date();
        }
        break;
      case 'explore/coop':
      case 'rid':
      case 'rid/attack':
        apElm = getIteratorByXpath('//div[./span[text()="現在AP"]]').iterateNext();
        if (apElm) {
          apElm.textContent.match(/AP\s*(\d+)/);
          apInfo[1] = RegExp.$1 * 1.0;
          startTime = new Date();
        }
        break;
    }
    apInfo[0] = startTime.getTime();
    setCookie('_CCCP_ApInfo', apInfo.join('_'));
    let apFull = new Date((apInfo[2] - apInfo[1]) * 60 * 1000 + startTime.getTime());
    APSPTimerId = setInterval((function(apInfoElm, startTime, apStart, apMax, apFull, title) {
      return function() {
        let now = new Date();
        let diffSec = Math.round((now.getTime() - startTime.getTime()) / 1000);
        let apCurrentElm = d.getElementById('apCurrent');
        let apMaxElm = d.getElementById('apMax');
        let apSecElm = d.getElementById('apSec');
        let apFullElm = d.getElementById('apFull');
        let apCurrent = Math.min(apStart + Math.floor(diffSec / 60), apMax);
        let backColors = {
          3: '#800000', 15: '#604000', 30: '#505000', 100: '#406000', 300: '#004060', 9999: '#404040',
        };
        if (apCurrent < apMax) {
          for (let a in backColors) {
            if (apCurrent < a) {
              apInfoElm.style.backgroundColor = backColors[a];
              apInfoElm.style.backgroundImage = '';
              break;
            }
          }
          apCurrentElm.className = '';
        } else {
          apInfoElm.style.backgroundColor = backColors[9999];
          apInfoElm.style.backgroundImage = 'url(' + createPlatePattern('Mcd/#505000/#580000') + ')';
          apCurrentElm.className = 'limit_ap';
        }
        apCurrentElm.textContent = apCurrent;
        apMaxElm.textContent = apMax;
        apSecElm.textContent = apCurrent < apMax ?
          String(diffSec % 60).padStart(2, '0') :
          '--';
        apFullElm.textContent = apCurrent < apMax ?
          `${String(apFull.getHours()).padStart(2, '0')}:${String(apFull.getMinutes()).padStart(2, '0')}` :
          '--:--';
        if (cccp_config.ShowApOnTitle.value == 1) {
          d.title = '(' + apCurrent + ') ' + title;
        }
      };
    })(d.getElementById('ApInfo'), startTime, apInfo[1] * 1.0, apInfo[2] * 1.0, apFull, d.title), 1000);
  }

  /**
   * status ページで自分のユーザー ID を取得し Cookie に保存する。
   */
  function getMyUserId() {
    const linkProfile = getNodesByXpath('//a[text()="プロフィール"]')[0];
    if (!linkProfile) { return; }
    cccp_config['.MyUserId'].value = linkProfile.href.replace(/^.*\/default\//, '');
    setCookie('_CCCP_Config', encodeConfig(cccp_config), 30);
  }

  /**
    ボスページを修正
    救援ページを新しいタブで開く
  */
  function modBossPage() {
    if (cccp_config.OpenNewBoss.value == 0) {
      return;
    }
    let coopLinks = d.getElementsByTagName('a');
    for (let i = 0, coopLink; coopLink = coopLinks[i]; ++i) {
      if (!coopLink.href.match(/\/(explore\/coop|rid\/attack)\//)) {
        continue;
      }
      coopLink.target = 'coopPage';
      let firstChild = coopLink.childNodes[0];
      if (!cccp_config.HighlightExploreBoss.value ||
        firstChild.nodeType != Node.TEXT_NODE ||
        !firstChild.nodeValue.match(/^([\s\S]*-\s)(探索)((\s-\sグループ救援)?\s-\sあと)$/)) {
        continue;
      }
      firstChild.nodeValue = RegExp.$1;
      let bossType = RegExp.$2;
      let tail = RegExp.$3;
      let nextNode = coopLink.childNodes[1];
      let exploreSpan = d.createElement('span');
      exploreSpan.className = 'caution';
      exploreSpan.appendChild(d.createTextNode(bossType));
      coopLink.insertBefore(exploreSpan, nextNode);
      coopLink.insertBefore(d.createTextNode(tail), nextNode);
    }
  }

  /**
    γクラスタページを修正
    攻撃ボタンに自動フォーカスする
  */
  function setAttackFocus(page) {
    if (page == 'rid/attack') {
      if (getCookie('_CCCP_AutoRidKill')) {
        const button = getAttackButton(10);
        if (!button) {
          (w.opener || w.parent).postMessage(
            { sender: keySender, command: commandNextRidKill, },
            location.origin
          );
        } else {
          button.click();
        }
        return;
      }
      if (cccp_config.AutoKillDGamma.value > 0) {
        const restTimeElm = getNodesByXpath('//div[./span[text()="残り時間"]]')[0];
        const currentApElm = getNodesByXpath('//div[./span[text()="現在AP"]]')[0];
        if (restTimeElm && currentApElm) {
          const mRestTime = (restTimeElm.textContent || restTimeElm.innerText).match(/((?<hour>\d+)時間)?(?<min>\d+)分/);
          const elapsedTime = 1440 - (parseInt(mRestTime.groups.hour) * 60 + parseInt(mRestTime.groups.min));
          const mAp = (currentApElm.textContent || currentApElm.innerText).match(/(?<ap>\d+)/);
          const currentAp = parseInt(mAp.groups.ap);
          if (elapsedTime >= cccp_config.AutoKillDGamma.value && currentAp >= 3) {
            const button = getAttackButton(10);
            if (button) {
              setTimeout(() => { button.click(); }, 1000);
              return;
            }
          }
        }
      }
    }
    const confValue = page == 'explore/coop'
      ? cccp_config.focusAttackForGamma.value
      : cccp_config.focusAttackForDGamma.value;
    if (confValue != '') {
      const button = getAttackButton(confValue);
      if (button) {
        setFocus(button);
        return;
      }
    }
    if (cccp_config.focusRescueForDGamma.value != '') {
      const buttonRescue = getNodesByXpath('//input[@type="submit" and @value="救援する"]')[0];
      if (buttonRescue) {
        setFocus(buttonRescue);
        return;
      }
      if (cccp_config.focusAttackForGamma.value != 0) {
        const toRescueList = getNodesByXpath('//a[contains(@href, "/relief")]')[0];
        if (toRescueList) {
          setFocus(toRescueList);
          return;
        }
      }
    }
  }

  function getAttackButton(times) {
    return (times == 10 ? ['10回攻撃する', '攻撃する'] : ['攻撃する']).reduce(
      (acc, cur) => {
        const input = getNodesByXpath(`//input[@type="submit" and @value="${cur}"]`)[0];
        if (input) { acc.push(input); }
        return acc;
      },
      []
    ).shift();
  }

  function addRidKillAll(page) {
    if (page != 'rid/list') { return; }
    const thHP = getNodesByXpath('//th[text()="HP"]')[0];
    if (!thHP) { return; }
    const coopLinks = getNodesByXpath('//a[contains(@href,"/rid/attack/")]');
    const nextCoopLink = () => {
      ok: {
        const coopLink = coopLinks.shift();
        if (!coopLink) { break ok; }
        coopLink.click();
        return;
      }
      setCookie('_CCCP_AutoRidKill', '');
    };
    w.addEventListener(
      'message',
      (event) => {
        const isValidMessage = event.origin == location.origin
          && event.data.sender == keySender
          && event.data.command == commandNextRidKill;
        if (!isValidMessage) { return; }
        nextCoopLink();
      }
    );
    thHP.innerHTML = null;
    thHP.appendChild(prepareElement({
      tag: 'button',
      type: 'button',
      textContent: 'Kill All',
      events: {
        click: (event) => {
          setCookie('_CCCP_AutoRidKill', 1);
          nextCoopLink();
        },
      },
    }));
  }

  /**
    分散型γ発見済一覧ページに自動攻撃をセット
  */
  function setAutoKill(page) {
    const autoKillTime = cccp_config.AutoKillDGamma.value - 0;
    if (page != 'rid/list' || autoKillTime <= 0) {
      return;
    }
    const alertVolume = cccp_config.AlertVolumeOnDGammaTimeUp.value - 0;
    const alertElm = d.getElementById('AlertSound') || createAlertElement(d);
    d.body.appendChild(alertElm);
    const thRestTime = getNodesByXpath('//th[text()="残り時間"]')[0];
    if (!thRestTime) { return; }
    thRestTime.textContent = 'Auto Kill';
    getNodesByXpath('//td/a[contains(@href, "rid/attack")]')
      .forEach((dGammaElm, i) => {
        const mRidId = dGammaElm.href.match(/rid\/attack\/(\d+)/);
        const ridId = 'rid' + mRidId[1];
        const elapsedTimeTd = getNodesByXpath('./td[3]', dGammaElm.parentNode.parentNode)[0];
        const mElapsedTime = elapsedTimeTd.textContent.match(/((\d+)時間)?(\d+)分|(\d+)日/);
        const hour = (mElapsedTime[2] | 0) - 0;
        const min = (mElapsedTime[3] | 0) - 0;
        const day = (mElapsedTime[4] | 0) - 0;
        const elapsedTime = 1440 - (day * 24 * 60 + hour * 60 + min);
        const elapsedTimeElm = d.createElement('span');
        elapsedTimeElm.id = ridId;
        elapsedTimeElm.textContent = elapsedTime;
        elapsedTimeTd.textContent = null;
        elapsedTimeTd.appendChild(elapsedTimeElm);
        elapsedTimeTd.appendChild(d.createTextNode('/\u200b' + (autoKillTime + i)));
        if (elapsedTime > autoKillTime + i) {
          w.open(dGammaElm.href, 'coopPage');
        } else {
          const timerId = setInterval(
            ((elapsedTimeElm, elapsedTime) => {
              return () => {
                elapsedTimeElm.textContent = elapsedTime++;
              };
            })(elapsedTimeElm, elapsedTime),
            60000
          );
          setTimeout(
            ((aTag, timerId, elapsedTimeElm, limit, alertElm, alertVolume) => {
              return () => {
                clearInterval(timerId);
                elapsedTimeElm.textContent = limit;
                aTag.target = 'coopPage';
                aTag.click();
                if (alertVolume > 0) {
                  alertElm.play();
                }
              }
            })(dGammaElm, timerId, elapsedTimeElm, autoKillTime + i, alertElm, alertVolume),
            (autoKillTime - elapsedTime + i) * 60000
          );
        }
      });
  }

  /**
    発見済一覧に救援要請リンクを追加
  */
  function addReliefRequest(page) {
    const openNewBoss = cccp_config.OpenNewBoss.value != 0;
    if (page != 'rid/list' || cccp_config.AddReliefRequestLink.value == 0) { return; }
    const thRequest = getNodesByXpath('//th[text()="救援"]')[0];
    if (!thRequest) { return; }
    const coopLinks = getNodesByXpath('//a[contains(@href,"/rid/attack/")]');
    const nextCoopLink = () => {
      ok: {
        const coopLink = coopLinks.shift();
        if (!coopLink) { break ok; }
        const reliefLink = getNodesByXpath('.//a[contains(@href,"/rid/relief/")]', coopLink.parentNode.parentNode)[0];
        if (!reliefLink) { break ok; }
        reliefLink.click();
        return;
      }
    };
    w.addEventListener(
      'message',
      (event) => {
        const isValidMessage = event.origin == location.origin
          && event.data.sender == keySender
          && event.data.command == commandNextRidHelp;
        if (!isValidMessage) { return; }
        nextCoopLink();
      }
    );
    const autoRidHelp = parseCookie(keyAutoRidHelp) || [];
    const newHandler = (type) => {
      return (event) => {
        autoRidHelp[type] = event.target.checked;
        setCookie(keyAutoRidHelp, JSON.stringify(autoRidHelp));
      }
    };
    thRequest.parentNode.appendChild(prepareElement({
      tag: 'th',
      children: [
        {
          tag: 'button',
          type: 'button',
          textContent: 'Help All',
          events: {
            click: (event) => {
              nextCoopLink();
            },
          },
        },
        {
          tag: 'div',
          style: { width: 'max-content', },
          children: [
            {
              tag: 'input',
              type: 'checkbox',
              title: '仲間',
              checked: autoRidHelp[1],
              events: { change: newHandler(1), },
            },
            {
              tag: 'input',
              type: 'checkbox',
              title: 'グループ',
              checked: autoRidHelp[2],
              events: { change: newHandler(2), },
            },
            {
              tag: 'input',
              type: 'checkbox',
              title: 'チャット',
              checked: autoRidHelp[3],
              events: { change: newHandler(3), },
            },
          ],
        },
      ],
    }));
    coopLinks.forEach((coopLink) => {
      const m = coopLink.href.match(/\/rid\/attack\/(\d+)/);
      coopLink.parentNode.parentNode.appendChild(prepareElement({
        tag: 'td',
        children: [
          {
            tag: 'a',
            href: `${uriHost}/rid/relief/${m[1]}`,
            textContent: 'Help',
            target: openNewBoss ? 'coopPage' : null,
          },
        ],
      }));
      coopLink.textContent = coopLink.textContent.replace(/([0-9,]+\/)([0-9,]+)/, '$1\u200b$2');
      const itemTd = getNodesByXpath('.//td[6]', coopLink.parentNode.parentNode)[0];
      itemTd.textContent = itemTd.textContent.replace(/(の|な)/, '$1\u200b');
    });
    const divBox = prepareElement({
      tag: 'div',
      style: { display: 'flex', },
    });
    const tableDBoss = d.querySelector('table');
    tableDBoss.parentNode.insertBefore(divBox, tableDBoss);
    divBox.appendChild(tableDBoss);
    tableDBoss.style.wordBreak = null;
    tableDBoss.style.lineHeight = '1.5em';
    tableDBoss.style.width = '60%';
    divBox.appendChild(prepareElement({
      tag: 'iframe',
      name: 'coopPage',
      style: { flex: 1, },
    }));
    nextCoopLink();
  }

  /**
   * 救援要請を「送る」ボタンにフォーカス
   *
   * @param {string} page - ページのパス
   */
  function setReliefFocus(page) {
    if (cccp_config.focusReliefRequest.value == 0) { return; }
    const autoRidHelp = parseCookie(keyAutoRidHelp) || [];
    let clicked = false;
    getNodesByXpath('//input[@value="送る"]')
      .reverse()
      .forEach((input) => {
        const type = parseInt(getNodesByXpath('.//input[@name="type"]', input.parentNode)[0].value);
        if (autoRidHelp[type]) {
          clicked = true;
          input.click();
        } else {
          input.focus();
        }
      });
    if (!clicked && autoRidHelp.some(value => value)) {
      (w.opener || w.parent).postMessage(
        { sender: keySender, command: commandNextRidHelp, },
        location.origin
      );
    }
  }

  /**
   * チャットページのボスリンクを未訪問/訪問済みで色を変える
   */
  function changeBossStyleInChat() {
    let spans = getIteratorByXpath('//div[contains(@class,"log2")]//span[contains(@class,"addition")]');
    let spanList = [];
    let span = null;
    while (span = spans.iterateNext()) {
      spanList.push(span);
    }
    spanList.forEach(function(span) {
      span.classList.remove('addition');
      if (span.firstChild.nodeName != '#text' ||
        !span.firstChild.nodeValue ||
        span.firstChild.nodeValue.substr(0, 3) != 'Lv.') {
        return;
      }
      let spanExploreBoss = d.createElement('span');
      spanExploreBoss.classList.add('caution');
      spanExploreBoss.appendChild(span.replaceChild(spanExploreBoss, span.firstChild));
    });
    addStyle({ 'a:link': { color: '#00ffff', }, });
    let path = '/profile/default/' + cccp_config['.MyUserId'].value;
    let myDivs = getIteratorByXpath('//div[contains(@class,"log2")]/div[.//a[substring(@href, string-length(@href) - string-length("' + path + '") + 1) = "' + path + '"]]'); /* ends-with(path) */
    let div = null;
    while (div = myDivs.iterateNext()) {
      div.style.backgroundColor = '#000060';
    }
  }

  /**
   * チャットの入力文字数を表示
   */
  function showChatLength() {
    const textarea = getNodesByXpath('//form[@id="f1"]//textarea')[0];
    if (!textarea) { return; }
    const submit = getNodesByXpath('//form[@id="f1"]//input[@type="submit"]')[0];
    if (!submit) { return; }
    const spanLen = d.createElement('span');
    spanLen.id = 'lenChat';
    spanLen.textContent = '0/100';
    submit.parentNode.appendChild(spanLen);
    const chatWatcher = function(event) {
      spanLen.textContent = `${textarea.value.length}/100`;
      if (textarea.value.length > 100) {
        spanLen.classList.add('error_message');
      } else {
        spanLen.classList.remove('error_message');
      }
    };
    textarea.addEventListener('input', chatWatcher, false);
  }

  /**
    プロフィールの自動リンク
  */
  function addAutoLink(page) {
    if (cccp_config.EnableAutoLink.value == 0) {
      return;
    }
    let profElm;
    if (page == 'profile/default') {
      profElm = getNodesByXpath('.//div[@id="all"]/div/div[contains(@style,"margin:4px;width:560px;")]/div')[0];
    } else if (page == 'profile/default' || page == 'friend/profile') {
      profElm = getNodesByXpath('.//div[@id="all"]/div[2]/div[9]')[0];
    } else if (page == 'friend/yell' || page == 'friend/yellmessage') {
      profElm = getNodesByXpath('.//div[@id="all"]/div[2]/div[last()]')[0];
      if (profElm.style.backgroundColor) {
        profElm = undefined;
      }
    }
    if (profElm) {
      let profHtml = profElm.innerHTML.replace(
        /\[\[(?:([^&:\[\]]+)&gt;)?([^&:\[\]]+):([^&:\[\]]+)\]\]/g,
        function(whole, alias, keyword, param) {
          let aLinker = autoLinkerBracket[keyword];
          return aLinker ?
            aLinker(keyword, param, alias) :
            whole;
        }
      );
      // リンク化済みの部分を削除
      let profBase = profHtml.replace(/<a\s[^>]+>[\s\S]+?<\/a>/gi, '');
      for (let i = 0, alinker; alinker = autoLinker[i]; ++i) {
        let anchors = profBase.match(alinker.reg);
        if (anchors) {
          for (let j = 0, anchor; anchor = anchors[j]; ++j) {
            profHtml = profHtml.replace(
              anchor,
              '<a href="' + alinker.href(anchor) + '" target="_blank">' +
              alinker.text(anchor) + '</a>'
            );
          }
        }
      }
      profHtml = profHtml.replace(
        /&amp;([^\(]+)\(([^\)]+)\)\{([^\}]+)\};/g,
        function(whole, plugin, param, target) {
          let replacer = replacingPlugin[plugin];
          return replacer ?
            replacer(plugin, param, target) :
            whole;
        }
      );
      profElm.innerHTML = profHtml;
    }
  }

  /**
    仲間ページを修正
    <ul>
    <li>エールページを新しいタブで開く</li>
    <li>相手とのレート差を表示</li>
    </ul>
  */
  function modFriendPage(page) {
    if (cccp_config.OpenNewYell.value == 1) {
      let friendForms = d.getElementsByTagName('form');
      for (let i = 0, form; form = friendForms[i]; ++i) {
        if (form.action.match(/\/friend\/yell\//)) {
          form.target = 'yellPage';
        }
      }
    }
    if (page == 'status/yell') {
      let checkElm = d.createElement('input');
      checkElm.id = 'enableYellDelete';
      checkElm.type = 'checkbox';
      checkElm.checked = false;
      checkElm.addEventListener('change', modYellDeleteButton, false);
      let checkLabel = d.createElement('label');
      checkLabel.htmlFor = 'enableYellDelete';
      checkLabel.textContent = '削除ボタン有効化';
      let yellElm = getIteratorByXpath('//div[contains(./span, "残りエールボーナス回数")]').iterateNext();
      yellElm.appendChild(checkElm);
      yellElm.appendChild(checkLabel);
      modYellDeleteButton();
    }
  }

  /**
    狐魂アイコンにプレビューページへのリンクを追加
  */
  function addCCViewLink() {
    if (cccp_config.AddCCViewLink.value == 0) {
      return;
    }
    let imgs = d.getElementsByTagName('img');
    for (let i = 0, img; img = imgs[i]; ++i) {
      if (
        img.src.match(/^https?:\/\/\w*\.concon-collector\.com\/.+\/card(40|200)?\/(.+)$/)
      ) {
        let iconID = RegExp.$2;
        iconID = iconID.replace(/-\d+\./, '-1.');		// フクベラ
        let viewID = getViewIdFromIconId(iconID);
        let title = rareCCInfo[iconID] ?
          rareCCInfo[iconID].name :
          img.alt || 'unknown';
        if (viewID > 0) {
          img.title = title;
          if (img.parentNode.tagName != 'A') {
            let anchElm = d.createElement('a');
            anchElm.href = viewUrlBase + viewID;
            img.parentNode.replaceChild(anchElm, img);
            anchElm.appendChild(img);
          }
        }
      }
    }
  }

  /**
    iconID から viewID を得る
  */
  function getViewIdFromIconId(iconID) {
    let viewID = rareCCInfo[iconID] && rareCCInfo[iconID].viewID;
    if (!viewID) {
      iconID.match(/^[^\d]+(\d+)(-\d+|[a-zA-Z])?\.\w+$/);
      viewID = RegExp.$1 || -1;
    }
    return viewID;
  }

  /**
    狐魂プレビューページに換毛先へのリンクを追加。
  */
  function addNextFurLink(page) {
    let imgs = d.getElementsByTagName('img');
    let iconID = '';
    let nextFurID = 0;
    let ccName = '';
    for (let i = 0, img; img = imgs[i]; ++i) {
      if (img.src.match(/^https?:\/\/\w*\.concon-collector\.com\/.+\/card(40|200)?\/(.+)$/)) {
        iconID = RegExp.$2.replace(/-\d+\./, '-1.');		// フクベラ等
        nextFurID = rareCCInfo[iconID] && rareCCInfo[iconID].nextFur;
        ccName = img.alt;
        break;
      }
    }
  }

  /**
    エール削除ボタンの無効化/有効化
  */
  function modYellDeleteButton() {
    let enableYellDeleteElm = d.getElementById('enableYellDelete');
    let isDisable = !enableYellDeleteElm.checked;
    let friendForms = d.getElementsByTagName('form');
    for (let i = 0, form; form = friendForms[i]; ++i) {
      if (form.action.match(/\/friend\/yelldelete/)) {
        // エール削除ボタンを無効化
        let deleteElm = getIteratorByXpath('.//input[@type="submit"]', form).iterateNext();
        deleteElm.disabled = isDisable;
      }
    }
  }

  /**
    救援要請ページを修正
    救援用URLを自動選択
  */
  function modExpReliefPage(page) {
    let rescueUrl = getIteratorByXpath('//input[@type="text"]').iterateNext();
    rescueUrl.style.width = '400px';
    rescueUrl.select();
    if (cccp_config.AddBossLogLink.value != 0) {
      let elmAnchor = d.createElement('a');
      elmAnchor.href = rescueUrl.value.replace(/(^.*\/explore\/)coop(\/\d+)([0-9a-f\/]+)/, '$1bosslog$2/0');
      elmAnchor.appendChild(d.createTextNode('Boss Log'));
      let elmDiv = rescueUrl.parentNode;
      elmDiv.innerHTML = elmDiv.innerHTML.replace(/(救援用URL<\/span>)/, '$1 ' + elmAnchor.outerHTML);
    }
  }

  /**
    合成ページを修正
    狐魂をカウント
  */
  function modConvPage(page) {
    let tables = d.getElementsByTagName('table');
    let baseConCon = getConConInfo(tables[0]);
    for (let i = 1, tbl; tbl = tables[i]; ++i) {
      let inpElm = tbl.getElementsByTagName('input')[0];
      if (inpElm.type == 'checkbox') {
        inpElm.addEventListener('change', calcConvertedLevel, false);
      }
    }
    let ccInfoElm = d.createElement('table');
    ccInfoElm.style.backgroundColor = baseConCon.color;
    ccInfoElm.id = 'CCInfo';
    ccInfoElm.border = 1;
    infoAreaElm.appendChild(ccInfoElm);
    calcConvertedLevel();
    /*
    if (getStringByXpath('//body/div/div[2]/table/tbody/tr/td[2]').match(/Lv.(\d+)\((\d+)%\)\s→\s(\d+)\((\d+)%\)/)) {
      let prevLvl = RegExp.$1 * 1.0;
      let prevExp = RegExp.$2 * 1.0;
      let nextLvl = RegExp.$3 * 1.0;
      let nextExp = RegExp.$4 * 1.0;
      prompt('成長値', (nextLvl - prevLvl) * 100 + nextExp - prevExp);
    }
    */
  }

  /**
    狐魂の属性を得る。
  */
  function getConConInfo(tbl) {
    let reLevel = new RegExp(/Lv.(\d+)\((\d+)%\)\/?(\d+)?/);
    let concon = {};
    concon.color = getStyleValue(tbl, 'background-color');
    getStringByXpath('./tbody/tr/td[not(@style)]', tbl).match(reLevel);
    concon.level = RegExp.$1 * 1.0;
    concon.percent = RegExp.$2 * 1.0;
    concon.limit = RegExp.$3 * 1.0;
    return concon;
  }

  /**
    カウント結果をフォーマットする。
  */
  function formatConvResult(base, sum) {
    let result = '';
    result += '<tr><th colspan="2">ベース</th><th colspan="2">同色</th><th colspan="2">異色</th></tr>';
    result += '<tr class="convHeader"><td>Lv</td><td>%</td><td>Lv</td><td>個</td><td>Lv</td><td>個</td></tr>';
    result += '<tr><td class="convNumeric">' + base.level + '</td><td class="convNumeric">' + base.percent + '</td>';
    result += '<td class="convNumeric">' + sum[true]['level'] + '</td><td class="convNumeric">' + sum[true]['num'] + '</td>';
    result += '<td class="convNumeric">' + sum[false]['level'] + '</td><td class="convNumeric">' + sum[false]['num'] + '</td></tr>';
    result += '<tr><th colspan="6"><input type="button" value="合成する" onclick="' +
      "let forms = d.getElementsByTagName('form');" +
      "for( let i=0,f; f=forms[i]; ++i ){" +
      "	if ( f.action == '" + uriHost + "/conv/default' ){" +
      "		f.submit();" +
      "		break;" +
      "	}" +
      "}" +
      '"></th></tr>';
    return result;
  }

  /**
    チェックボックスが変化したら再カウントする。
  */
  function calcConvertedLevel() {
    let tables = d.getElementsByTagName('table');
    let baseConCon = getConConInfo(tables[0]);
    if (baseConCon.limit) {
      setCookie('_CCCP_BaseLimit', baseConCon.limit);
    } else {
      baseConCon.limit = getCookie('_CCCP_BaseLimit') * 1.0;
    }
    let sum = {
    /* 同色 */ true: { 'level': 0, 'num': 0, },
    /* 異色 */ false: { 'level': 0, 'num': 0, },
    };
    for (let i = 1, tbl; tbl = tables[i]; ++i) {
      if (tbl.id == 'CCInfo') {
        continue;
      }
      let input = getIteratorByXpath('./tbody/tr/td//input', tbl).iterateNext();
      if (input.type == 'hidden' || input.type == 'checkbox' && input.checked) {
        let concon = getConConInfo(tbl);
        let s = sum[concon.color == baseConCon.color];
        s['level'] += concon.level;
        s['num']++;
      }
    }
    let infoElm = d.getElementById('CCInfo');
    infoElm.innerHTML = formatConvResult(baseConCon, sum);
  }

  /**
    自分のレートをクッキーに保存する
  */
  function getMyRate(page) {
    let myRate = getStringByXpath('//div[contains( ./span, "レート" )]');
    myRate.match(/レート\s*(.+)\s*$/);
    myRate = RegExp.$1.replace(/,/g, '') * 1.0;
    setCookie('_CCCP_MyRate', myRate, 30);
  }

  /**
    自分と相手とのレート差を表示する
    レートを含む要素を抽出
  */
  function addRateDiffForPage(page) {
    let myRate = getCookie('_CCCP_MyRate') * 1.0 || 0;
    let rivalElms = [];
    let anchors;
    switch (page) {
      case 'friend/profile':
      case 'profile/default':
        rivalElms = [getIteratorByXpath('//div[contains( ./span, "Lv.")]').iterateNext()];
        break;
      case 'friend':
      case 'friend/default':
      case 'battle/ranking':
        anchors = d.getElementsByTagName('a');
        for (let i = 0, anchor; anchor = anchors[i]; ++i) {
          if (anchor.pathname.match(/\/profile\/default\//)) {
            rivalElms.push(anchor.parentNode);
          }
        }
        break;
      case 'battle':
        anchors = d.getElementsByTagName('a');
        for (let i = 0, anchor; anchor = anchors[i]; ++i) {
          if (anchor.pathname.match(/\/battle\/user\//)) {
            rivalElms.push(anchor.parentNode);
          }
        }
        break;
    }
    for (let i = 0, rivalElm; rivalElm = rivalElms[i]; ++i) {
      addRateDiffForElement(rivalElm, myRate);
    }
  }

  /**
    自分と相手とのレート差を表示する
    レートを含む要素に差を追加
  */
  function addRateDiffForElement(elm, myRate) {
    if (elm.textContent.match(/レート\s+([\d,]+)\s*/)) {
      let rivalRate = RegExp.$1.replace(/,/g, '') * 1.0;
      let rateDiff = rivalRate - myRate;
      let rateDiffHtml = '(<span class="' +
        (rateDiff > 0 ? 'up_value' : 'down_value') +
        '">' + addFigure(rateDiff) + '</span>)';
      elm.innerHTML = elm.innerHTML.replace(
        /(<span\s+class="keyword">レート<\/span>\s+[\d,]+)/,
        '$1 ' + rateDiffHtml
      );
    }
  }

  /**
    対戦相手確認ページを修正
    レート差を表示する
  */
  function modPreBattlePage(page) {
    let myRateElm = getIteratorByXpath('//div[contains( ./span, "レート" )]').iterateNext();
    if (!myRateElm) {
      return;
    }
    myRateElm.textContent.match(/([0-9,]+)\s*$/);
    let myRate = RegExp.$1.replace(/,/, '') * 1.0;
    setCookie('_CCCP_MyRate', myRate, 30);
    //	alert(myRate + '\n' + d.cookie);
    let rivalRateElm = getIteratorByXpath('//tr[contains( ./td/span, "レート" )]').iterateNext();
    rivalRateElm.textContent.match(/([0-9,]+)\s*$/);
    let rivalRate = RegExp.$1.replace(/,/, '') * 1.0;
    let rateDiff = rivalRate - myRate;
    //	let fame = Math.round( rateDiff / 12 + 9 );
    let fame = rateDiff > 0 ?
      rateDiff * (30 - 10) / (270 - 0) + 10 :
      rateDiff * (10 - 1) / (0 - (-270)) + 10;
    fame = Math.round(fame > 30 ? 30 : (fame < 1 ? 1 : fame));
    let startBattleElm = getIteratorByXpath('//div[./input/@value="対戦する"]').iterateNext();
    startBattleElm.innerHTML +=
      ' <span class="keyword">レート差</span> ' +
      '<span class="' +
      (rateDiff > 0 ? 'up_value' : 'down_value') +
      '">' + addFigure(rateDiff) + '</span>' +
      ' <span class="keyword">勝利時獲得名声</span> ' + fame;
  }

  /**
    制圧ページの「戦う」を自動選択
  */
  function selectFightOnSuppression(page) {
    if (cccp_config.AutoFightOnSuppression.value == 0) {
      return;
    }
    let fightInputElm = getIteratorByXpath('//input[@type="radio" and @name="command" and @value="1"]').iterateNext();
    if (fightInputElm) {
      fightInputElm.checked = true;
    }
  }

  /**
   * 教本リストを折り畳む
   *
   * @param {string} page
   */
  function foldBooks(page) {
    if (cccp_config.foldBooks.value == 0) {
      return;
    }
    getNodesByXpath('//div/ul/li/ul/li[ul]').forEach((li, index) => {
      let cb = d.createElement('input');
      cb.type = 'checkbox';
      cb.id = 'books_pow' + index;
      let label = d.createElement('label');
      label.htmlFor = cb.id;
      label.appendChild(li.firstChild);
      li.insertBefore(label, li.firstChild);
      li.insertBefore(cb, li.firstChild);
      cb.addEventListener(
        'change',
        function(ev) {
          let ul = getNodesByXpath('./ul', this.parentNode)[0];
          if (!ul) { return; }
          if (this.checked) {
            ul.classList.remove('hide');
          } else {
            ul.classList.add('hide');
          }
        },
        false
      );
      getNodesByXpath('./ul', li).forEach(ul => ul.classList.add('hide'));
    });
  }

  /**
    アイテムページで「使う」リンクにフォーカス
  */
  function setUseFocus(page) {
    if (cccp_config.focusUseItem.value == 0) {
      return;
    }
    let useLink = getIteratorByXpath('//a[text()="使う"]').iterateNext();
    if (!useLink) {
      return;
    }
    setFocus(useLink);
  }

  /**
   * 狐魂データストレージページで「決定」ボタン/「続けて投票」リンクにフォーカス
   *
   * @param {*} page
   */
  function setVotingFocus(page) {
    let element = getIteratorByXpath('//input[@value="決定"]').iterateNext() ||
      getIteratorByXpath('//a[text()="続けて投票"]').iterateNext();
    if (!element) {
      return;
    }
    setFocus(element);
  }

  /**
    換毛ページで適用ボタンの有効/無効切り替えチェックボックスを追加
    未適用の換毛だった場合は有効, 適用済みの換毛だった場合は無効
  */
  function addCheckBoxForMoult(page) {
    let useDiv = getIteratorByXpath('//div[contains(@class, "use_choice")]/form/div[input[@value="よろしい"]]').iterateNext();
    if (!useDiv) {
      return;
    }
    let ccImgs = getIteratorByXpath('//div[contains(@class, "detail")]/a[1]/img');
    ccImgs.iterateNext().src.match(/(\d+)(?:-\d+)?\.[0-9a-zA-Z]+$/);
    let beforeCC = parseInt(RegExp.$1);
    ccImgs.iterateNext().src.match(/(\d+)(?:-\d+)?\.[0-9a-zA-Z]+$/);
    let afterCC = parseInt(RegExp.$1);
    let isNew = beforeCC < afterCC;
    let applyButton = getIteratorByXpath('//div[contains(@class, "use_choice")]/form/div/input[@value="よろしい"]').iterateNext();
    applyButton.disabled = !isNew;
    let checkBox = d.createElement('input');
    checkBox.type = 'checkBox';
    checkBox.checked = isNew;
    checkBox.addEventListener(
      'change',
      function() { applyButton.disabled = !this.checked; },
      false
    );
    useDiv.appendChild(checkBox);
  }

  /**
    狐魂生成装置ページで「起動する」ボタンにフォーカス
  */
  function setGenerateFocus(page) {
    if (cccp_config.focusGenerate.value == 0) {
      return;
    }
    let generateButton = getIteratorByXpath('//input[@type="submit" and contains(@value, "起動する")]').iterateNext();
    if (!generateButton) {
      return;
    }
    setFocus(generateButton);
  }

  /**
   * 中毒度に合わせて使用個数を設定するボタンを追加
   *
   * @param {string} page
   */
  function addAdjustGammaButton(page) {
    const deGamma = location.pathname == '/use/gamma/23' ? 40 :
      location.pathname == '/use/gamma/24' ? 100 :
        0;
    if (!deGamma) { return; }
    const buttonDrink = d.querySelector('input[value="飲む"]');
    if (!buttonDrink) { return; }
    const buttonAdjust = d.createElement('button');
    const result = d.createElement('span');
    [d.createTextNode(' '), buttonAdjust, d.createTextNode(' '), result]
      .forEach(child => buttonDrink.parentNode.appendChild(child));
    buttonAdjust.textContent = 'Adjust';
    buttonAdjust.addEventListener(
      'click',
      (event) => {
        event.preventDefault();
        const addiction = getNodesByXpath('//span[text()="現在中毒度"]')[0].parentNode.lastChild.textContent.replace(/,/g, '') * 1;
        let ag = Math.min(Math.floor(addiction / deGamma), getNodesByXpath('//span[text()="所持数"]')[0].parentNode.lastChild.textContent * 1);
        while ((addiction - ag * deGamma) % 100 && ag > 0) { --ag; }
        if (ag <= 0) {
          result.textContent = 'No solution';
          result.classList.add('error_message');
          return;
        }
        const form = buttonDrink.parentNode.parentNode;
        form.firstChild.firstChild.textContent = `${ag}個 `;
        form.action = form.action.replace(/\d+$/, ag);
        result.textContent = 'Adjusted';
        result.classList.add('up_value');
      },
      false
    );
  }

  function selectSameConConOnDblClick(page) {
    if (cccp_config.SelectSameConConOnDblClick.value == 0) { return; }
    const trs = getNodesByXpath('//tr');
    const handler = (event) => {
      const currentTr = event.currentTarget;
      const ccId = currentTr.dataset.ccId;
      const checked = !getNodesByXpath('.//input[@type="checkbox"]', currentTr)[0].checked;
      trs.forEach(tr => {
        if (tr.dataset.ccId != ccId) { return; }
        getNodesByXpath('.//input[@type="checkbox"]', tr)[0].checked = checked;
      });
    };
    trs.forEach(tr => {
      const ccImg = getNodesByXpath('.//img', tr)[0];
      if (!ccImg) { return; }
      const m = /([-a-z0-9]+)\.\w+$/.exec(ccImg.src);
      tr.dataset.ccId = m[1];
      tr.addEventListener('dblclick', handler);
    });
  }

  function addInchingPage(page) {
    if (cccp_config.AddInchingPage.value == 0) { return; }
    const divPageList = getNodesByXpath('//div[@class="page_list"]')[0];
    if (!divPageList) { return; }
    const regPathname = /^(?<base>\/(use\/salvationc?\/\d+|blackmarket\/recyclec?)\/\d+\/\d+\/)(?<page>\d+)$/;
    const createHandler = (param) => {
      return (event) => {
        const m = regPathname.exec(location.pathname);
        if (!m) { return; }
        let newPage = m.groups.page * 1.0 + param;
        if (newPage < 0) { newPage = 0; }
        location = [location.protocol, '//', location.host, m.groups.base, newPage, location.search].join('');
      };
    };
    const buttonPrev = prepareElement({
      tag: 'button',
      textContent: '-10',
      events: { click: createHandler(-10), },
    });
    const buttonNext = prepareElement({
      tag: 'button',
      textContent: '+10',
      events: { click: createHandler(10), },
    });
    [d.createTextNode(' '), buttonPrev, d.createTextNode(' '), buttonNext]
      .forEach(node => { divPageList.appendChild(node); });
  }

  function addRadioLabel(page) {
    getNodesByXpath('//input[@type="radio"]')
      .forEach((input) => {
        const div = input.parentNode;
        const label = prepareElement({
          tag: 'label',
          textContent: div.textContent,
        });
        div.textContent = null;
        label.insertBefore(input, label.lastChild);
        div.appendChild(label);
      });
  }

  /**
    狐魂の背景を差し替え
  */
  function replaceBackPanel(page) {
    if (cccp_config.ReplacePlate.value == 0) {
      return;
    }
    replaceBackPanelForElements(d.getElementsByTagName('div'));
    replaceBackPanelForElements(d.getElementsByTagName('table'));
    replaceBackPanelForElements(d.getElementsByTagName('li'));
  }

  /**
    背景を指定パターンに差し替える
  */
  function replaceBackPanelForElements(elms) {
    for (let i = 0, elm; elm = elms[i]; ++i) {
      let col = getStyleValue(elm, 'background-color');
      if (col && macedonianPlates[col]) {
        elm.className += ' ' + macedonianPlates[col];
      }
    }
  }

  /**
   * XPath で指定したノードリストを得る。
   *
   * @param {string} xpath
   * @param {node} context
   * @returns ヒットしたノードのリスト。ヒットしなかった場合は空リストを返す。
   */
  function getNodesByXpath(xpath, context) {
    const itr = d.evaluate(
      xpath,
      context || d,
      null,
      XPathResult.ORDERED_NODE_ITERATOR_TYPE,
      null
    );
    let nodes = [];
    let node = null;
    while (node = itr.iterateNext()) {
      nodes.push(node);
    }
    return nodes;
  }

  /**
    XPath で指定したイテレータを得る。
  */
  function getIteratorByXpath(xpath, context) {
    return d.evaluate(
      xpath,
      context || d,
      null,
      XPathResult.ORDERED_NODE_ITERATOR_TYPE,
      null
    );
  }

  /**
    XPath で指定した要素のテキスト値を得る。
  */
  function getStringByXpath(xpath, context) {
    let nodeTmp = d.evaluate(
      'string(' + xpath + ')',
      context || d,
      null,
      XPathResult.STRING_TYPE,
      null
    );
    return !nodeTmp ?
      "" :
      nodeTmp.stringValue;
  }

  /**
    要素のスタイル値を得る。
    http://kurusugawa.jp/2008/03/03/javascriptでcssのプロパティ値を取得する方法/
  */
  function getStyleValue(element, cssProperty) {
    return d.defaultView.getComputedStyle(element, null).getPropertyValue(cssProperty);
  }

  /**
    ハッシュキーを基に検索用正規表現オブジェクトを作成する。
  */
  function makeRegWithDic(dic) {
    let keys = "";
    for (let k in dic) {
      keys += '|' + quotemeta(k);
    }
    return new RegExp('(' + keys.slice(1) + ')', 'gm');
  }

  /**
    英数以外をエスケープ
    http://blog.livedoor.jp/dankogai/archives/51058313.html
  */
  function quotemeta(str) {
    return str.replace(/([^0-9A-Za-z_])/g, '\\$1');
  }

  /**
    3桁区切りのカンマを追加
    http://webdev.seesaa.net/article/22769178.html
  */
  function addFigure(str) {
    let num = new String(str).replace(/,/g, "");
    while (num != (num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2")));
    return num;
  }

  /**
    プレートパターン PNG のデータ URI を作成する
    @param {String} pattern カラーパターン文字列
    @returns {String} PNG のデータ URI
  */
  function createPlatePattern(pattern) {
    let cp = new ColorPattern(pattern);
    let width = 800;
    let height = 400;
    let canvasElm = d.createElement('canvas');
    canvasElm.width = width;
    canvasElm.height = height;
    //	d.getElementsByTagName('body')[0].appendChild(canvasElm);
    if (!canvasElm || !canvasElm.getContext) {
      return;
    }
    let ctx = canvasElm.getContext('2d');
    ctx.fillStyle = cp.colors[0];
    ctx.fillRect(0, 0, width, height);
    platePatternDrawer[cp.patternType](cp, ctx, width, height);
    return canvasElm.toDataURL('PNG');
  }

  function getCookie(key) {
    const m = d.cookie.match(new RegExp(`${key}\\s*=\\s*(?<value>[^;]+)`));
    return !m
      ? null
      : m.groups.value;
  }

  function setCookie(key, value, expireDate) {
    let cookieStr = key + '=' + value + ';path=/';
    if (expireDate > 0) {
      expireDate = new Date(new Date().getTime() + 60 * 60 * 24 * expireDate * 1000).toGMTString();
      cookieStr += ';expires=' + expireDate;
    }
    d.cookie = cookieStr;
  }

  function parseCookie(key) {
    const cookie = getCookie(key);
    return cookie
      ? JSON.parse(cookie)
      : null;
  }

  function setFocus(element) {
    element.setAttribute('autofocus', true);
    if (typeof element.focus == 'function') {
      element.focus();
    } else if (typeof element.select == 'function') {
      element.select();
    }
  }

  function createAlertElement(doc) {
    const alertElm = prepareElement({
      tag: 'audio',
      id: 'AlertSound',
      preload: 'auto',
      volume: cccp_config.AlertVolumeOnDGammaTimeUp.value - 0,
    }, doc);
    const urlBase = `${location.protocol}//www.takeash.net/Etc/CCCollector/CCCP/resources/machine_call.`;
    [
      { ext: 'ogg', type: 'audio/ogg' },
      { ext: 'm4a', type: 'audio/mp4' },
      { ext: 'mp3', type: 'audio/mp3' },
    ].forEach((src) => {
      alertElm.appendChild(prepareElement({
        tag: 'source',
        src: urlBase + src.ext,
        type: src.type,
      }, doc));
    });
    return alertElm;
  }

})(window, document);

// EOF
