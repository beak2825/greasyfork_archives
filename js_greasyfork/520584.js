// ==UserScript==
// @name         Word Text Replace
// @namespace    http://tampermonkey.net/
// @version      2.9
// @license MIT
// @description  Replace words. Store replacements in flexible json (loaded by url). Share config with other, best for reading books with translate. Traditional to simplified chinese option.
// @description:ru  Замена слов. Храните замены в гибком json (грузится по url). Делитель конфигом с другими, хорошо для чтения книг с переводчиком. Traditional to simplified chinese option.
// @author       Shuraken007
// @include https://*/*
// @include http://*/*
// @downloadURL https://update.greasyfork.org/scripts/520584/Word%20Text%20Replace.user.js
// @updateURL https://update.greasyfork.org/scripts/520584/Word%20Text%20Replace.meta.js
// ==/UserScript==

/* jshint esversion: 9 */
'use strict';

{
   const known_events = {
      config_update: "forse_update_replacements",
      turn_on_off: "swap_on_off",
   }

   const config = {
      "json_url": "https://api.npoint.io/adca32df1622919ca5bd",
      "traditional_to_simple_chinese": true,
      "default_priority_level": 1,
      "binds": {
         "click_interval": 3000,
         "n": 3,
         "m": 2,
         "events": {
            [known_events.config_update]: [4, 4, 6, 6],
            [known_events.turn_on_off]: [1, 1, 3, 3],
         }
      }
   };

   const script_start = Date.now();

   const loader_modes = {
      fast_load: 'restore_json_data_from_localStorage',
      force_load: 'always_load_by_url',
   };

   function validate_mode(mode) {
      let is_known_mode = false;
      for (const key of Object.keys(loader_modes)) {
         if (loader_modes[key] === mode) {
            is_known_mode = true;
            break;
         }
      }
      if (!is_known_mode) {
         throw new Error(`unknown ConfigLoader mode ${mode}`);
      }
   }

   class ConfigLoader {
      constructor() {
         this._mode = loader_modes.fast_load;
         this.loaded_urls = {};
         this.is_restored = false;
      }

      set_mode(mode) {
         validate_mode(mode);
         this._mode = mode;
      }

      async fast_load(url) {
         if (this._mode != loader_modes.fast_load) return null;
         let data = await localStorage.getItem(url);
         if (!data) return null;
         this.is_restored = true
         return data;
      }

      async load(url) {
         let data = await this.fast_load(url);
         if (!data) {
            data = await ConfigLoader.loadFile(url);
            localStorage.setItem(url, data);
         }

         this.loaded_urls[url] = true;
         return data
      }

      static async loadFile(url) {
         let response = await fetch(url);
         if (response.status == 200) {
            return response.text();
         } else {
            let msg =
               `loading: ${url}
            status: ${response.status}
            response: ${response.response}
            `;

            throw Error(msg);
         }
      }

      resetOnError() {
         for (const k of Object.keys(this.loaded_urls)) {
            localStorage.removeItem(k);
            console.log(`storage with key ${k} removed`);
         }
      }
   }

   const types = {
      Array: 'Array',
      Dict: 'Dict',
      String: 'String',
      Int: 'Int',
      Unknown: 'Unknown',
   };

   const known_keys = {
      urls: '__urls',
      include: '__include',
      level: '__level',
      contains: function (key) {
         return Object.values(this).includes(key);
      }
   };

   function get_type(x) {
      if (x instanceof Array) return types.Array;
      if (typeof x == 'object') return types.Dict;
      if (typeof x === 'string' || x instanceof String) return types.String;
      if (!Number.isNaN(x) && Number.isInteger(x)) return types.Int;

      return types.Unknown;
   }

   const ReplacementConverter = {
      replacer: function (_, value) {
         if (value instanceof RegExp)
            return ("__REGEXP " + value.toString());
         else
            return value;
      },
      reviver: function (_, value) {
         if (value.toString().indexOf("__REGEXP ") == 0) {
            let m = value.split("__REGEXP ")[1]
            return getRegFromString(m, false)
         } else
            return value;
      }
   }

   const storage_replacements = 'saved_replacements';
   class ConfigBuilder {
      constructor(config_loader) {
         this.url = window.location.href;
         this.config_loader = config_loader;
         this._mode = loader_modes.fast_load;
         this.is_restored = false;
      }

      set_mode(mode) {
         validate_mode(mode);
         this._mode = mode;
      }

      save(replacements) {
         let replacements_as_str = JSON.stringify(replacements, ReplacementConverter.replacer)
         localStorage.setItem(storage_replacements, replacements_as_str);
      }

      async get(url) {
         this.is_restored = false
         if (this._mode === loader_modes.fast_load) {
            let data = await localStorage.getItem(storage_replacements);
            if (data) {
               let replacements = JSON.parse(data, ReplacementConverter.reviver)
               this.is_restored = true
               return replacements
            }
         }

         let data = await this.config_loader.load(url);
         let json_data = JSON.parse(data);

         return this.build(json_data);
      }

      async build(json) {
         let known_nodes_map = new Map();
         this.collect_names(json, known_nodes_map);

         let replacements_by_priority_level = {};
         await this.collect_replacements(
            json,
            replacements_by_priority_level,
            known_nodes_map,
            config.default_priority_level
         );
         // console.log(replacements_by_priority_level)

         let replacements = this.union_replacements_by_level(replacements_by_priority_level);
         // console.log(replacements)
         return replacements;
      }

      collect_names(node, known_nodes_map) {
         for (const [k, v] of Object.entries(node)) {
            if (known_keys.contains(k)) continue;
            if (get_type(v) !== types.Dict) continue;
            this.collect_names(v, known_nodes_map);
            if (known_nodes_map.has(k)) {
               console.log(`key ${k} already added`);
            }
            known_nodes_map.set(k, v);
         }
      }

      check_url(pattern_arr) {
         let obj_type = get_type(pattern_arr);
         if (obj_type != types.Array) {
            throw new Error(`field ${known_keys.urls} exptect to be Array, got ${obj_type}`);
         }
         for (const url_pattern of pattern_arr) {
            let url_token = tokenToRegex(url_pattern, true);
            if (!url_token.test(this.url)) continue;
            return true;
         }
         return false;
      }

      validate_lvl(lvl, root) {
         let lvl_type = get_type(lvl);
         if (lvl_type !== types.Int) {
            console.log(`field ${known_keys.level} must be number, got ${lvl_type}
            root: ${root}`);
            return false;
         }
         return true;
      }

      validate_include(include, known_nodes_map, root) {
         if (include.includes('http')) return false;
         if (!known_nodes_map.has(include)) {
            console.log(`include '${include}' not founded
            root: ${root}`);
            return false;
         }
         if (root.hasOwnProperty(include)) {
            console.log(`current node already has key '${include}'
            root: ${root}`);
            return false;
         }
         return true;
      }

      isValidHttpUrl(string) {
         let url;

         try {
            url = new URL(string);
         } catch (_) {
            return false;
         }

         return url.protocol === "http:" || url.protocol === "https:";
      }

      async add_include(node_name, include, known_nodes_map, root) {
         let data;
         if (this.validate_include(include, known_nodes_map, root)) {
            data = known_nodes_map.get(include);
         } else if (this.isValidHttpUrl(include)) {
            try {
               data = await this.config_loader.load(include);
               data = JSON.parse(data);
            } catch (err) {
               // ignore error on invalid included json
               localStorage.removeItem(include);
               console.log(`error on loading url include ${include}`)
               return;
            }
         }
         if (!data) return;
         root[node_name] = data;
      }

      async collect_replacements(node, collection_by_lvl, known_nodes_map, priority_lvl, is_matched = false) {
         let urls = node[known_keys.urls];
         if (urls) {
            if (!this.check_url(urls)) return;
            is_matched = true;
         }
         let lvl = node[known_keys.level];
         if (lvl !== undefined) {
            if (this.validate_lvl(lvl, node)) priority_lvl = lvl;
         }
         let includes = node[known_keys.include];
         if (includes) {
            for (const [node_name, include] of Object.entries(includes)) {
               await this.add_include(node_name, include, known_nodes_map, node);
            }
         }
         for (const [k, v] of Object.entries(node)) {
            if (known_keys.contains(k)) continue;
            let val_type = get_type(v);
            if (val_type == types.Array) {
               this.add_random_entity(k, v, collection_by_lvl, priority_lvl);
            } else if (val_type == types.Dict) {
               await this.collect_replacements(v, collection_by_lvl, known_nodes_map, priority_lvl, is_matched);
            } else if (val_type === types.String) {
               this.add_basic_entity(k, v, collection_by_lvl, priority_lvl);
            }
         }
      }

      add_random_entity(key, value, collection_by_lvl, priority_lvl) {
         if (get_type(value) != types.Array) {
            throw Error(
               `value expected to be Array, got ${get_type(value)}
            value: ${value}`
            );
         }
         if (config.traditional_to_simple_chinese) {
            key = t2s(key);
            value = value.map(e => t2s(e));
         }
         key = tokenToRegex(key);
         this.add_replacement_to_collection(key, value, collection_by_lvl, priority_lvl);
      }

      add_basic_entity(key, value, collection_by_lvl, priority_lvl) {
         if (get_type(value) != types.String) {
            throw Error(
               `value expected to be str, got ${get_type(value)}
            value: ${value}`
            );
         }
         if (config.traditional_to_simple_chinese) {
            key = t2s(key);
            value = t2s(value);
         }
         key = tokenToRegex(key);
         this.add_replacement_to_collection(key, value, collection_by_lvl, priority_lvl);
      }

      add_replacement_to_collection(key, value, collection_by_lvl, priority_lvl) {
         if (!collection_by_lvl.hasOwnProperty(priority_lvl)) {
            collection_by_lvl[priority_lvl] = [];
         }
         let collection_arr = collection_by_lvl[priority_lvl];

         for (let i = 0; i < collection_arr.length; i++) {
            let k = collection_arr[i][0];
            let k_as_str = k.toString().replace(/^\//, "").replace(/\/$/, "");
            let key_as_str = key.toString().replace(/^\//, "").replace(/\/\w*?$/, "");
            if (key_as_str == k_as_str) {
               console.log(`key: ${key} was added earlier, overriding`);
               // collection_arr.splice(i, 1);
               return
            }
            if (key_as_str.includes(k_as_str)) {
               // console.log(`replacement ${key} contains earlier added ${k}, moving up`);
               collection_arr.splice(i, 0, [key, value]);
               return;
            }
         }
         collection_arr.push([key, value]);
      }

      sort_str_keys_as_numbers(a, b) {
         let x = Number(a);
         let y = Number(b);
         if (x < y) return -1;
         if (x > y) return 1;
         return 0;
      }

      union_replacements_by_level(collection_by_lvl) {
         let replacements = [];

         let keys = Object.keys(collection_by_lvl);
         for (let key of keys.sort(this.sort_str_keys_as_numbers)) {
            replacements.push(...collection_by_lvl[key]);
         }
         return replacements;
      }

      resetOnError() {
         console.log('removed storage_replacements')
         localStorage.removeItem(storage_replacements);
      }

   }

   function replaceText(node, replacements, replaced_nodes, runner) {
      let exclude_tags = ['SCRIPT', 'STYLE']
      if (node.tagName && exclude_tags.includes(node.tagName))
         return
      switch (node.nodeType) {
         case Node.ELEMENT_NODE:
            node.childNodes.forEach(n => replaceText(n, replacements, replaced_nodes, runner));
            break;
         case Node.TEXT_NODE: {
            let text = node.textContent;
            if (!text.trim()) break;
            // console.log(node.nodeType, node.nodeValue)
            let new_text = make_replacements(text, replacements);
            if (text.includes('Erode'))
               console.log(text)
            if (text != new_text) {
               // runner.ob_disconnect();
               node.textContent = new_text;
               if (replaced_nodes.has(node)) break;
               replaced_nodes.set(node, text);
               // runner.ob_connect();
               // console.log(`${text}->${new_text}`);
            }
            break;
         }
         case Node.DOCUMENT_NODE:
            node.childNodes.forEach(n => replaceText(n, replacements, replaced_nodes));
      }
   }

   function get_random(list) {
      return list[Math.floor((Math.random() * list.length))];
   }

   function make_replacements(text, replacements) {
      var are_letters_inserted = false;
      if (config.traditional_to_simple_chinese) {
         text = t2s(text);
      }
      for (let [regex, replacement] of replacements) {
         if (replacement instanceof Array) {
            replacement = get_random(replacement);
         }
         let not_glyph_letter_in_replacement = isLetter(replacement.charAt(0)) || isLetter(replacement.slice(-1));
         if (are_letters_inserted && not_glyph_letter_in_replacement) {
            text = replaceAllRespectSpaces(text, regex, replacement);
         } else {
            var new_text = text.replaceAll(regex, replacement);
            if (!are_letters_inserted && new_text != text && not_glyph_letter_in_replacement) {
               are_letters_inserted = true;
            }
            text = new_text;
         }
      }
      return text;
   }

   // prepareRegex by JoeSimmons
   // used to take a string and ready it for use in new RegExp()
   function prepareRegex(string, is_star_special = false) {
      // escape: []^&$.()?/\+{}|
      string = string.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g, '\\$1');
      if (!is_star_special) {
         string = string.replaceAll('*', '\\*')
      } else {
         // '*' -> '[^ ]*', but '\*' -> '*'
         string = string.replace(/\\?\*/g, function (fullMatch) {
            return fullMatch === '\\*' ? '*' : '[^ ]*';
         });
      }
      return string;
   }

   function getRegFromString(string, is_global_required) {
      var a = string.split("/");
      let modifiers = a.pop();
      a.shift();
      let pattern = a.join("/");
      if (is_global_required && !modifiers.includes('g')) {
         modifiers += 'g';
      }
      // console.log(`pattern: ${pattern}, modifiers: ${modifiers}`)
      return new RegExp(pattern, modifiers);
   }

   const rIsRegexp = /^\/(.+)\/(\w+)?$/;
   function tokenToRegex(string, is_prepared = false) {
      if (config.traditional_to_simple_chinese) {
         string = t2s(string);
      }
      if (string.match(rIsRegexp)) {
         // console.log(`user_regexp: ${string}`)
         return getRegFromString(string, true);
      }

      if (is_prepared) {
         string = prepareRegex(string, true);
         return new RegExp(string);
      }
      return string;
   }

   function isLetter(c) {
      return c.toLowerCase() != c.toUpperCase();
   }

   function is_space_required(text, index) {
      if (index == 0) { return false; }
      if (!isLetter(text.charAt(index - 1))) { return false; }
      return true;
   }

   function replaceAllRespectSpaces(text, re, replacement) {
      // if (!isLetter(replacement.charAt(0))) { return text; }
      if (get_type(re) === types.String) {
         re = new RegExp(prepareRegex(re));
      } else if (re instanceof RegExp && re.global) {
         re = new RegExp(re.source, re.flags.replace('g', ''));
      }
      var match;
      let i = 0;
      let old_text = text;
      while (true) {
         match = re.exec(text)
         if (!match) break;

         if (is_space_required(text, match.index)) {
            text = text.replace(match, " " + replacement);
         } else {
            text = text.replace(re, replacement);
         }

         let new_part = text.substring(match.index)
         let old_part = old_text.substring(match.index)
         if (new_part.includes(old_part) && new_part.length > old_part.length) {
            // console.log("recursive detected")
            break
         }

         old_text = text

         i++;
         if (i > 100) { throw Error(`re ${re} exceeded 100 iterations on ${text}`) }
      }
      return text;
   }

   // https://github.com/jyt0532/ChineseConverter/blob/master/transform.js
   // added more hieroglyphs to t2sArray from issue
   // added rIsChinese, change replacement to text.replace
   const t2sArray = { "夢": "梦", "緣": "缘", "丟": "丢", "並": "并", "採": "采", "亂": "乱", "亙": "亘", "亞": "亚", "嚲": "亸", "來": "来", "侖": "仑", "侶": "侣", "俁": "俣", "俠": "侠", "倀": "伥", "倆": "俩", "倉": "仓", "個": "个", "們": "们", "倫": "伦", "偉": "伟", "側": "侧", "偵": "侦", "偽": "伪", "傑": "杰", "傖": "伧", "傘": "伞", "備": "备", "傭": "佣", "傳": "传", "傴": "伛", "債": "债", "傷": "伤", "傾": "倾", "僂": "偻", "僅": "仅", "僉": "佥", "僑": "侨", "僕": "仆", "僥": "侥", "僨": "偾", "僱": "雇", "價": "价", "儀": "仪", "儂": "侬", "億": "亿", "當": "当", "儈": "侩", "儉": "俭", "儐": "傧", "儔": "俦", "儕": "侪", "盡": "尽", "償": "偿", "優": "优", "儲": "储", "儷": "俪", "羅": "罗", "攢": "攒", "儺": "傩", "儻": "傥", "儼": "俨", "兇": "凶", "兌": "兑", "兒": "儿", "兗": "兖", "內": "内", "兩": "两", "冊": "册", "塗": "涂", "凍": "冻", "凜": "凛", "瀆": "渎", "處": "处", "凱": "凯", "憑": "凭", "別": "别", "刪": "删", "剗": "刬", "剄": "刭", "則": "则", "剛": "刚", "剝": "剥", "剮": "剐", "剴": "剀", "創": "创", "鏟": "铲", "劃": "划", "劇": "剧", "劉": "刘", "劊": "刽", "劌": "刿", "劍": "剑", "劑": "剂", "勁": "劲", "動": "动", "務": "务", "勩": "勚", "勛": "勋", "勝": "胜", "勞": "劳", "勢": "势", "績": "绩", "勱": "劢", "勵": "励", "勸": "劝", "勻": "匀", "匭": "匦", "匯": "汇", "匱": "匮", "奩": "奁", "櫝": "椟", "區": "区", "協": "协", "卻": "却", "厙": "厍", "廳": "厅", "廁": "厕", "厭": "厌", "廠": "厂", "厲": "厉", "厴": "厣", "參": "参", "靉": "叆", "靆": "叇", "叢": "丛", "吳": "吴", "呂": "吕", "咼": "呙", "員": "员", "唄": "呗", "唚": "吣", "嗊": "唝", "啢": "唡", "問": "问", "啓": "启", "啞": "哑", "銜": "衔", "囉": "啰", "嘽": "啴", "喚": "唤", "喪": "丧", "喬": "乔", "單": "单", "喲": "哟", "嗆": "呛", "嗇": "啬", "嗎": "吗", "嗚": "呜", "嗩": "唢", "嗶": "哔", "嘆": "叹", "嘍": "喽", "嘔": "呕", "嘖": "啧", "嘗": "尝", "嘜": "唛", "嘩": "哗", "嘮": "唠", "嘯": "啸", "嘰": "叽", "嘵": "哓", "嘸": "呒", "噅": "咴", "噓": "嘘", "噝": "咝", "噠": "哒", "噥": "哝", "噦": "哕", "噯": "嗳", "噲": "哙", "噴": "喷", "噸": "吨", "嚀": "咛", "嚇": "吓", "嚌": "哜", "嚕": "噜", "嚙": "啮", "嚦": "呖", "嚨": "咙", "嚮": "响", "嚳": "喾", "嚴": "严", "嚶": "嘤", "囀": "啭", "囁": "嗫", "囅": "冁", "囈": "呓", "蘇": "苏", "囑": "嘱", "國": "国", "圇": "囵", "圍": "围", "園": "园", "圓": "圆", "圖": "图", "團": "团", "坰": "垧", "墶": "垯", "壋": "垱", "垵": "埯", "壩": "坝", "埡": "垭", "執": "执", "堅": "坚", "堊": "垩", "堖": "垴", "堝": "埚", "階": "阶", "堯": "尧", "報": "报", "場": "场", "壪": "塆", "塊": "块", "塋": "茔", "塏": "垲", "塒": "埘", "塢": "坞", "塤": "埙", "塵": "尘", "塹": "堑", "磚": "砖", "墊": "垫", "墜": "坠", "磽": "硗", "墮": "堕", "壇": "坛", "墳": "坟", "牆": "墙", "墾": "垦", "壓": "压", "壘": "垒", "壙": "圹", "壚": "垆", "壞": "坏", "壟": "垄", "壢": "坜", "壯": "壮", "壼": "壸", "壺": "壶", "壽": "寿", "夠": "够", "夾": "夹", "奐": "奂", "奧": "奥", "奪": "夺", "奮": "奋", "妝": "妆", "姍": "姗", "姦": "奸", "姪": "侄", "娛": "娱", "嫵": "妩", "婁": "娄", "婦": "妇", "婭": "娅", "嫿": "婳", "媧": "娲", "媯": "妫", "媼": "媪", "媽": "妈", "裊": "袅", "嫗": "妪", "嫻": "娴", "嬈": "娆", "嬋": "婵", "嬌": "娇", "嬙": "嫱", "嬡": "嫒", "嬤": "嬷", "嬪": "嫔", "嬰": "婴", "嬸": "婶", "懶": "懒", "孌": "娈", "孫": "孙", "學": "学", "孿": "孪", "宮": "宫", "寢": "寝", "實": "实", "寧": "宁", "審": "审", "寫": "写", "寬": "宽", "寵": "宠", "寶": "宝", "將": "将", "專": "专", "尋": "寻", "對": "对", "導": "导", "尷": "尴", "屓": "屃", "屆": "届", "屍": "尸", "屜": "屉", "屢": "屡", "層": "层", "屨": "屦", "屬": "属", "岡": "冈", "嶨": "峃", "嶢": "峣", "峴": "岘", "島": "岛", "峽": "峡", "嶮": "崄", "崍": "崃", "崗": "岗", "崬": "岽", "崢": "峥", "崳": "嵛", "嵐": "岚", "歲": "岁", "嶔": "嵚", "嶁": "嵝", "嶄": "崭", "嶇": "岖", "嶗": "崂", "嶠": "峤", "嶧": "峄", "嶴": "岙", "嶸": "嵘", "嶺": "岭", "嶼": "屿", "巋": "岿", "巒": "峦", "巔": "巅", "巰": "巯", "巹": "卺", "帥": "帅", "師": "师", "帳": "帐", "帶": "带", "幀": "帧", "幃": "帏", "幗": "帼", "幘": "帻", "幟": "帜", "幣": "币", "幫": "帮", "幬": "帱", "襴": "襕", "幹": "干", "幾": "几", "庫": "库", "廎": "庼", "廂": "厢", "廈": "厦", "蔭": "荫", "廚": "厨", "廝": "厮", "廟": "庙", "廡": "庑", "廢": "废", "廣": "广", "廩": "廪", "廬": "庐", "弳": "弪", "張": "张", "強": "强", "彈": "弹", "彌": "弥", "彎": "弯", "彠": "彟", "彥": "彦", "彫": "雕", "徑": "径", "從": "从", "徠": "徕", "複": "复", "徵": "征", "徹": "彻", "恆": "恒", "悅": "悦", "悵": "怅", "悶": "闷", "悽": "凄", "惱": "恼", "惲": "恽", "惻": "恻", "愛": "爱", "愜": "惬", "愨": "悫", "愴": "怆", "愷": "恺", "愾": "忾", "態": "态", "慍": "愠", "慘": "惨", "慚": "惭", "慟": "恸", "慣": "惯", "慪": "怄", "慫": "怂", "憖": "慭", "慮": "虑", "慳": "悭", "懾": "慑", "慶": "庆", "憂": "忧", "憊": "惫", "憐": "怜", "憒": "愦", "憚": "惮", "憤": "愤", "憫": "悯", "憮": "怃", "憲": "宪", "憶": "忆", "懇": "恳", "應": "应", "懌": "怿", "懍": "懔", "懨": "恹", "懟": "怼", "懣": "懑", "懲": "惩", "懷": "怀", "懸": "悬", "懺": "忏", "懼": "惧", "歡": "欢", "戀": "恋", "戇": "戆", "戔": "戋", "戧": "戗", "戩": "戬", "戲": "戏", "戰": "战", "戶": "户", "拋": "抛", "掗": "挜", "撏": "挦", "挾": "挟", "捫": "扪", "掃": "扫", "掄": "抡", "掙": "挣", "掛": "挂", "揀": "拣", "揚": "扬", "換": "换", "揮": "挥", "構": "构", "撳": "揿", "損": "损", "搖": "摇", "搗": "捣", "搶": "抢", "摑": "掴", "摜": "掼", "摟": "搂", "摯": "挚", "摳": "抠", "摶": "抟", "摻": "掺", "撈": "捞", "撐": "撑", "撓": "挠", "撟": "挢", "撣": "掸", "撥": "拨", "撫": "抚", "撲": "扑", "撻": "挞", "撾": "挝", "撿": "捡", "擁": "拥", "擄": "掳", "擇": "择", "擊": "击", "擋": "挡", "擔": "担", "攜": "携", "據": "据", "擠": "挤", "舉": "举", "擬": "拟", "擯": "摈", "擰": "拧", "擱": "搁", "擲": "掷", "擴": "扩", "擷": "撷", "擺": "摆", "擻": "擞", "擼": "撸", "擾": "扰", "攄": "摅", "攆": "撵", "攏": "拢", "攔": "拦", "攖": "撄", "攙": "搀", "攛": "撺", "攝": "摄", "攣": "挛", "攤": "摊", "攪": "搅", "攬": "揽", "敘": "叙", "敗": "败", "敵": "敌", "數": "数", "驅": "驱", "斂": "敛", "斃": "毙", "斕": "斓", "斬": "斩", "斷": "断", "暘": "旸", "曨": "昽", "時": "时", "晉": "晋", "晝": "昼", "暈": "晕", "暉": "晖", "暢": "畅", "暫": "暂", "暱": "昵", "曄": "晔", "曇": "昙", "曉": "晓", "曖": "暧", "曠": "旷", "曡": "叠", "曬": "晒", "書": "书", "會": "会", "朧": "胧", "東": "东", "柵": "栅", "桿": "杆", "梔": "栀", "梘": "枧", "條": "条", "梟": "枭", "檮": "梼", "棶": "梾", "棄": "弃", "棖": "枨", "棗": "枣", "棟": "栋", "棧": "栈", "棬": "桊", "棲": "栖", "椏": "桠", "楊": "杨", "楓": "枫", "楨": "桢", "業": "业", "極": "极", "榪": "杩", "榮": "荣", "榿": "桤", "盤": "盘", "槍": "枪", "槓": "杠", "檟": "槚", "槧": "椠", "槨": "椁", "槳": "桨", "規": "规", "樁": "桩", "樂": "乐", "樅": "枞", "樓": "楼", "標": "标", "樞": "枢", "樣": "样", "樸": "朴", "樹": "树", "樺": "桦", "橈": "桡", "橋": "桥", "機": "机", "橢": "椭", "橫": "横", "橰": "槔", "檁": "檩", "檉": "柽", "檔": "档", "檜": "桧", "檢": "检", "檣": "樯", "檳": "槟", "檸": "柠", "檻": "槛", "檾": "苘", "櫃": "柜", "櫓": "橹", "櫚": "榈", "櫛": "栉", "櫞": "橼", "櫟": "栎", "櫥": "橱", "櫧": "槠", "櫨": "栌", "櫪": "枥", "櫫": "橥", "櫬": "榇", "櫳": "栊", "櫸": "榉", "欞": "棂", "櫻": "樱", "欄": "栏", "權": "权", "欏": "椤", "欒": "栾", "欖": "榄", "欽": "钦", "歐": "欧", "歟": "欤", "歸": "归", "歿": "殁", "殘": "残", "殞": "殒", "殤": "殇", "殫": "殚", "殮": "殓", "殯": "殡", "殲": "歼", "殺": "杀", "殼": "壳", "毀": "毁", "毆": "殴", "醫": "医", "絨": "绒", "毿": "毵", "犛": "牦", "氈": "毡", "氌": "氇", "氣": "气", "氫": "氢", "氬": "氩", "氳": "氲", "氹": "凼", "決": "决", "沍": "冱", "沒": "没", "沖": "冲", "渢": "沨", "濔": "沵", "況": "况", "洩": "泄", "洶": "汹", "溮": "浉", "滻": "浐", "濜": "浕", "浹": "浃", "涇": "泾", "溳": "涢", "涼": "凉", "淚": "泪", "淥": "渌", "淨": "净", "淩": "凌", "淪": "沦", "淵": "渊", "淶": "涞", "淺": "浅", "渙": "涣", "減": "减", "渦": "涡", "測": "测", "渾": "浑", "湊": "凑", "湞": "浈", "湣": "愍", "湧": "涌", "湯": "汤", "漊": "溇", "溈": "沩", "準": "准", "溝": "沟", "溫": "温", "濕": "湿", "滄": "沧", "滅": "灭", "滌": "涤", "滎": "荥", "澦": "滪", "滬": "沪", "滯": "滞", "滲": "渗", "鹵": "卤", "滸": "浒", "滾": "滚", "滿": "满", "漁": "渔", "漚": "沤", "漢": "汉", "漣": "涟", "漬": "渍", "漲": "涨", "漵": "溆", "漸": "渐", "漿": "浆", "潁": "颍", "潑": "泼", "潔": "洁", "潛": "潜", "潤": "润", "潯": "浔", "潰": "溃", "潷": "滗", "潿": "涠", "澀": "涩", "澆": "浇", "澇": "涝", "澗": "涧", "澠": "渑", "澤": "泽", "澩": "泶", "澮": "浍", "澱": "淀", "濁": "浊", "濃": "浓", "濘": "泞", "濟": "济", "濤": "涛", "濫": "滥", "濰": "潍", "濱": "滨", "闊": "阔", "濺": "溅", "濼": "泺", "濾": "滤", "瀅": "滢", "瀉": "泻", "瀋": "渖", "瀏": "浏", "瀕": "濒", "瀘": "泸", "瀝": "沥", "瀟": "潇", "瀠": "潆", "瀦": "潴", "瀧": "泷", "瀨": "濑", "瀲": "潋", "瀾": "澜", "灃": "沣", "灄": "滠", "灑": "洒", "灕": "漓", "灘": "滩", "灝": "灏", "灣": "湾", "灤": "滦", "灧": "滟", "災": "灾", "為": "为", "烏": "乌", "烴": "烃", "無": "无", "煆": "煅", "輝": "辉", "煉": "炼", "煒": "炜", "煙": "烟", "煢": "茕", "煥": "焕", "煩": "烦", "煬": "炀", "熒": "荧", "熗": "炝", "熱": "热", "熲": "颎", "熾": "炽", "燁": "烨", "燄": "焰", "燈": "灯", "燉": "炖", "燒": "烧", "燙": "烫", "燜": "焖", "營": "营", "燦": "灿", "燭": "烛", "燴": "烩", "燻": "熏", "燼": "烬", "燾": "焘", "燿": "耀", "爍": "烁", "爐": "炉", "爛": "烂", "爭": "争", "爺": "爷", "爾": "尔", "牀": "床", "箋": "笺", "閘": "闸", "牘": "牍", "牽": "牵", "犖": "荦", "犢": "犊", "犧": "牺", "狀": "状", "獮": "狝", "狹": "狭", "狽": "狈", "猙": "狰", "猶": "犹", "猻": "狲", "獁": "犸", "獃": "呆", "獄": "狱", "獅": "狮", "獎": "奖", "獨": "独", "獪": "狯", "獫": "猃", "獰": "狞", "獲": "获", "獵": "猎", "獷": "犷", "獸": "兽", "獺": "獭", "獻": "献", "獼": "猕", "玀": "猡", "茲": "兹", "璵": "玙", "瑒": "玚", "玨": "珏", "瑲": "玱", "璫": "珰", "現": "现", "璡": "琎", "琿": "珲", "瑉": "珉", "瑋": "玮", "瑣": "琐", "瑤": "瑶", "瑩": "莹", "瑪": "玛", "璉": "琏", "璣": "玑", "璦": "瑷", "環": "环", "璽": "玺", "瓊": "琼", "瓏": "珑", "瓔": "璎", "瓚": "瓒", "甌": "瓯", "罌": "罂", "產": "产", "畝": "亩", "畢": "毕", "畫": "画", "異": "异", "疇": "畴", "痙": "痉", "瘂": "痖", "瘮": "瘆", "瘋": "疯", "瘍": "疡", "瘓": "痪", "瘞": "瘗", "瘡": "疮", "瘧": "疟", "瘻": "瘘", "療": "疗", "癆": "痨", "癇": "痫", "癉": "瘅", "癘": "疠", "癟": "瘪", "癡": "痴", "癢": "痒", "癤": "疖", "癥": "症", "癧": "疬", "癩": "癞", "癬": "癣", "癭": "瘿", "癮": "瘾", "癰": "痈", "癱": "瘫", "癲": "癫", "發": "发", "皚": "皑", "皸": "皲", "皺": "皱", "藹": "蔼", "礙": "碍", "襖": "袄", "罷": "罢", "頒": "颁", "辦": "办", "絆": "绊", "綁": "绑", "鎊": "镑", "謗": "谤", "盜": "盗", "盞": "盏", "監": "监", "盧": "卢", "蕩": "荡", "視": "视", "矓": "眬", "眾": "众", "睜": "睁", "飽": "饱", "鮑": "鲍", "輩": "辈", "貝": "贝", "鋇": "钡", "繃": "绷", "筆": "笔", "閉": "闭", "邊": "边", "編": "编", "貶": "贬", "變": "变", "辯": "辩", "辮": "辫", "鱉": "鳖", "賓": "宾", "餅": "饼", "睞": "睐", "瞘": "眍", "瞞": "瞒", "瞼": "睑", "矚": "瞩", "缽": "钵", "鉑": "铂", "駁": "驳", "補": "补", "財": "财", "蠶": "蚕", "蒼": "苍", "艙": "舱", "詫": "诧", "蟬": "蝉", "饞": "馋", "讒": "谗", "纏": "缠", "闡": "阐", "顫": "颤", "矯": "矫", "硜": "硁", "磑": "硙", "礄": "硚", "硤": "硖", "硨": "砗", "硯": "砚", "磣": "碜", "長": "长", "腸": "肠", "鈔": "钞", "車": "车", "陳": "陈", "襯": "衬", "稱": "称", "誠": "诚", "騁": "骋", "遲": "迟", "馳": "驰", "齒": "齿", "蟲": "虫", "躊": "踌", "籌": "筹", "綢": "绸", "醜": "丑", "鋤": "锄", "雛": "雏", "碩": "硕", "碭": "砀", "碸": "砜", "確": "确", "碼": "码", "磧": "碛", "磯": "矶", "礎": "础", "觸": "触", "闖": "闯", "錘": "锤", "純": "纯", "綽": "绰", "辭": "辞", "詞": "词", "賜": "赐", "聰": "聪", "蔥": "葱", "躥": "蹿", "竄": "窜", "錯": "错", "達": "达", "貸": "贷", "礦": "矿", "礪": "砺", "礫": "砾", "礬": "矾", "礱": "砻", "禕": "祎", "祿": "禄", "禍": "祸", "禎": "祯", "鄲": "郸", "膽": "胆", "誕": "诞", "黨": "党", "禱": "祷", "鄧": "邓", "遞": "递", "締": "缔", "顛": "颠", "點": "点", "電": "电", "釣": "钓", "調": "调", "諜": "谍", "禦": "御", "禪": "禅", "禮": "礼", "禰": "祢", "禿": "秃", "穠": "秾", "稅": "税", "稈": "秆", "稜": "棱", "釘": "钉", "頂": "顶", "錠": "锭", "訂": "订", "鬥": "斗", "讀": "读", "賭": "赌", "鍍": "镀", "鍛": "锻", "緞": "缎", "隊": "队", "頓": "顿", "鈍": "钝", "鵝": "鹅", "額": "额", "訛": "讹", "餓": "饿", "餌": "饵", "稟": "禀", "種": "种", "穀": "谷", "穌": "稣", "積": "积", "穎": "颖", "穡": "穑", "穢": "秽", "頹": "颓", "穩": "稳", "穭": "稆", "貳": "贰", "罰": "罚", "閥": "阀", "釩": "钒", "範": "范", "販": "贩", "飯": "饭", "訪": "访", "紡": "纺", "飛": "飞", "誹": "诽", "費": "费", "紛": "纷", "糞": "粪", "豐": "丰", "鋒": "锋", "風": "风", "馮": "冯", "縫": "缝", "諷": "讽", "鳳": "凤", "膚": "肤", "輻": "辐", "窩": "窝", "窪": "洼", "窮": "穷", "窯": "窑", "窶": "窭", "窺": "窥", "竅": "窍", "竇": "窦", "竊": "窃", "豎": "竖", "競": "竞", "輔": "辅", "賦": "赋", "負": "负", "訃": "讣", "縛": "缚", "該": "该", "鈣": "钙", "蓋": "盖", "趕": "赶", "贛": "赣", "鋼": "钢", "綱": "纲", "鎬": "镐", "鴿": "鸽", "閣": "阁", "鉻": "铬", "給": "给", "筍": "笋", "簹": "筜", "筧": "笕", "箏": "筝", "籙": "箓", "節": "节", "龔": "龚", "鞏": "巩", "貢": "贡", "鉤": "钩", "購": "购", "蠱": "蛊", "顧": "顾", "關": "关", "觀": "观", "館": "馆", "貫": "贯", "龜": "龟", "閨": "闺", "軌": "轨", "詭": "诡", "貴": "贵", "輥": "辊", "鍋": "锅", "過": "过", "築": "筑", "篋": "箧", "篠": "筱", "篤": "笃", "篩": "筛", "篳": "筚", "簀": "箦", "簍": "篓", "簑": "蓑", "簞": "箪", "簡": "简", "簣": "篑", "簫": "箫", "簷": "檐", "簽": "签", "簾": "帘", "駭": "骇", "韓": "韩", "號": "号", "閡": "阂", "鶴": "鹤", "賀": "贺", "轟": "轰", "鴻": "鸿", "紅": "红", "後": "后", "籃": "篮", "籐": "藤", "籜": "箨", "籟": "籁", "籠": "笼", "鑰": "钥", "籩": "笾", "籪": "簖", "籬": "篱", "籮": "箩", "籲": "吁", "粵": "粤", "護": "护", "華": "华", "話": "话", "還": "还", "緩": "缓", "黃": "黄", "謊": "谎", "賄": "贿", "諱": "讳", "誨": "诲", "繪": "绘", "葷": "荤", "夥": "伙", "貨": "货", "糝": "糁", "糢": "模", "糧": "粮", "糲": "粝", "糴": "籴", "糶": "粜", "糾": "纠", "紀": "纪", "紂": "纣", "約": "约", "紆": "纡", "紇": "纥", "紈": "纨", "紉": "纫", "紋": "纹", "納": "纳", "紐": "纽", "紓": "纾", "紕": "纰", "紖": "纼", "紗": "纱", "紘": "纮", "紙": "纸", "級": "级", "紜": "纭", "紝": "纴", "細": "细", "紱": "绂", "紲": "绁", "紳": "绅", "紵": "纻", "饑": "饥", "跡": "迹", "譏": "讥", "雞": "鸡", "緝": "缉", "輯": "辑", "薊": "蓟", "計": "计", "記": "记", "際": "际", "繼": "继", "莢": "荚", "頰": "颊", "賈": "贾", "鉀": "钾", "駕": "驾", "間": "间", "艱": "艰", "緘": "缄", "繭": "茧", "薦": "荐", "鑒": "鉴", "踐": "践", "賤": "贱", "見": "见", "鍵": "键", "紹": "绍", "紺": "绀", "紼": "绋", "紿": "绐", "絀": "绌", "終": "终", "組": "组", "絎": "绗", "結": "结", "絕": "绝", "縧": "绦", "絝": "绔", "絞": "绞", "絡": "络", "絢": "绚", "絰": "绖", "統": "统", "絲": "丝", "絳": "绛", "絹": "绢", "綃": "绡", "綆": "绠", "綈": "绨", "繡": "绣", "綌": "绤", "綏": "绥", "經": "经", "艦": "舰", "餞": "饯", "蔣": "蒋", "講": "讲", "醬": "酱", "膠": "胶", "驕": "骄", "鉸": "铰", "腳": "脚", "餃": "饺", "繳": "缴", "轎": "轿", "較": "较", "誡": "诫", "緊": "紧", "錦": "锦", "謹": "谨", "進": "进", "綜": "综", "綞": "缍", "綠": "绿", "綣": "绻", "綬": "绶", "維": "维", "綯": "绹", "綰": "绾", "網": "网", "綴": "缀", "綸": "纶", "綹": "绺", "綺": "绮", "綻": "绽", "綾": "绫", "綿": "绵", "緄": "绲", "緇": "缁", "緋": "绯", "緡": "缗", "緒": "绪", "緓": "绬", "緔": "绱", "緗": "缃", "緙": "缂", "緦": "缌", "緬": "缅", "緯": "纬", "緱": "缑", "緲": "缈", "練": "练", "緶": "缏", "緹": "缇", "荊": "荆", "莖": "茎", "鯨": "鲸", "驚": "惊", "頸": "颈", "靜": "静", "鏡": "镜", "舊": "旧", "駒": "驹", "鋸": "锯", "鵑": "鹃", "覺": "觉", "訣": "诀", "鈞": "钧", "軍": "军", "縕": "缊", "總": "总", "縈": "萦", "縉": "缙", "縊": "缢", "縋": "缒", "縐": "绉", "縑": "缣", "縗": "缞", "縝": "缜", "縞": "缟", "縟": "缛", "縣": "县", "縭": "缡", "縮": "缩", "縱": "纵", "縲": "缧", "纖": "纤", "縵": "缦", "縶": "絷", "縷": "缕", "縹": "缥", "繅": "缫", "繆": "缪", "繈": "襁", "繒": "缯", "織": "织", "繕": "缮", "繚": "缭", "駿": "骏", "開": "开", "顆": "颗", "課": "课", "褲": "裤", "誇": "夸", "虧": "亏", "繞": "绕", "繢": "缋", "繩": "绳", "韁": "缰", "繯": "缳", "繰": "缲", "繹": "绎", "繽": "缤", "繾": "缱", "纇": "颣", "纈": "缬", "纊": "纩", "續": "续", "纓": "缨", "纘": "缵", "纜": "缆", "饋": "馈", "蠟": "蜡", "臘": "腊", "萊": "莱", "賴": "赖", "藍": "蓝", "闌": "阑", "蘭": "兰", "讕": "谰", "覽": "览", "鐳": "镭", "類": "类", "離": "离", "鯉": "鲤", "麗": "丽", "罵": "骂", "羆": "罴", "羈": "羁", "羋": "芈", "羥": "羟", "羨": "羡", "義": "义", "習": "习", "翽": "翙", "翬": "翚", "隸": "隶", "聯": "联", "蓮": "莲", "連": "连", "鐮": "镰", "臉": "脸", "鏈": "链", "輛": "辆", "諒": "谅", "遼": "辽", "鐐": "镣", "臨": "临", "鄰": "邻", "鱗": "鳞", "賃": "赁", "齡": "龄", "鈴": "铃", "靈": "灵", "領": "领", "餾": "馏", "龍": "龙", "聾": "聋", "翹": "翘", "翺": "翱", "耬": "耧", "耮": "耢", "聖": "圣", "聞": "闻", "聲": "声", "聳": "耸", "聵": "聩", "聶": "聂", "職": "职", "聹": "聍", "聽": "听", "隴": "陇", "蘆": "芦", "顱": "颅", "虜": "虏", "魯": "鲁", "賂": "赂", "錄": "录", "陸": "陆", "驢": "驴", "鋁": "铝", "輪": "轮", "論": "论", "蘿": "萝", "邏": "逻", "鑼": "锣", "騾": "骡", "駱": "骆", "螞": "蚂", "馬": "马", "買": "买", "麥": "麦", "賣": "卖", "邁": "迈", "脈": "脉", "饅": "馒", "蠻": "蛮", "肅": "肃", "脅": "胁", "脛": "胫", "脫": "脱", "脹": "胀", "謾": "谩", "貓": "猫", "錨": "锚", "鉚": "铆", "貿": "贸", "麼": "么", "鎂": "镁", "門": "门", "錳": "锰", "謎": "谜", "覓": "觅", "閩": "闽", "鳴": "鸣", "銘": "铭", "謬": "谬", "腎": "肾", "腖": "胨", "膕": "腘", "腡": "脶", "腦": "脑", "腫": "肿", "膁": "肷", "膃": "腽", "膩": "腻", "膾": "脍", "膿": "脓", "臍": "脐", "臏": "膑", "臒": "癯", "謀": "谋", "鈉": "钠", "難": "难", "鬧": "闹", "餒": "馁", "釀": "酿", "鳥": "鸟", "鑷": "镊", "鎳": "镍", "臚": "胪", "臢": "臜", "髒": "脏", "臠": "脔", "臥": "卧", "臯": "皋", "與": "与", "興": "兴", "鋪": "铺", "艤": "舣", "鈕": "钮", "農": "农", "諾": "诺", "鷗": "鸥", "龐": "庞", "賠": "赔", "鵬": "鹏", "艫": "舻", "艷": "艳", "艸": "艹", "芻": "刍", "苧": "苎", "騙": "骗", "飄": "飘", "頻": "频", "貧": "贫", "蘋": "苹", "評": "评", "頗": "颇", "譜": "谱", "齊": "齐", "騎": "骑", "豈": "岂", "訖": "讫", "薘": "荙", "莊": "庄", "莧": "苋", "釺": "钎", "鉛": "铅", "遷": "迁", "謙": "谦", "錢": "钱", "鉗": "钳", "譴": "谴", "薔": "蔷", "鍬": "锹", "親": "亲", "輕": "轻", "頃": "顷", "請": "请", "趨": "趋", "軀": "躯", "萇": "苌", "蘀": "萚", "萬": "万", "萵": "莴", "葉": "叶", "葒": "荭", "葤": "荮", "葦": "苇", "藥": "药", "齲": "龋", "顴": "颧", "鵲": "鹊", "讓": "让", "饒": "饶", "韌": "韧", "認": "认", "軟": "软", "銳": "锐", "閏": "闰", "薩": "萨", "鰓": "鳃", "賽": "赛", "蒓": "莼", "蒔": "莳", "蓀": "荪", "蓧": "莜", "蓯": "苁", "蓽": "荜", "騷": "骚", "閃": "闪", "陝": "陕", "贍": "赡", "賞": "赏", "賒": "赊", "設": "设", "蔞": "蒌", "蔦": "茑", "蕁": "荨", "蕆": "蒇", "蕎": "荞", "蕒": "荬", "蕓": "芸", "蕕": "莸", "蕘": "荛", "蕢": "蒉", "蕪": "芜", "蕭": "萧", "蕷": "蓣", "詩": "诗", "蝕": "蚀", "識": "识", "駛": "驶", "適": "适", "釋": "释", "飾": "饰", "試": "试", "輸": "输", "贖": "赎", "術": "术", "薈": "荟", "薌": "芗", "薑": "姜", "薟": "莶", "薺": "荠", "藎": "荩", "藝": "艺", "藪": "薮", "藶": "苈", "雙": "双", "誰": "谁", "順": "顺", "說": "说", "飼": "饲", "頌": "颂", "訟": "讼", "誦": "诵", "訴": "诉", "雖": "虽", "隨": "随", "鎖": "锁", "藺": "蔺", "蘄": "蕲", "蘊": "蕴", "蘚": "藓", "蘞": "蔹", "蘢": "茏", "蘺": "蓠", "虛": "虚", "貪": "贪", "譚": "谭", "談": "谈", "討": "讨", "騰": "腾", "謄": "誊", "銻": "锑", "題": "题", "體": "体", "貼": "贴", "鐵": "铁", "蛺": "蛱", "蛻": "蜕", "蜆": "蚬", "銅": "铜", "頭": "头", "鴕": "鸵", "馱": "驮", "駝": "驼", "襪": "袜", "頑": "顽", "蝟": "猬", "蝦": "虾", "蝨": "虱", "蝸": "蜗", "螿": "螀", "螄": "蛳", "蟻": "蚁", "螢": "萤", "韋": "韦", "違": "违", "謂": "谓", "衛": "卫", "鎢": "钨", "誣": "诬", "霧": "雾", "誤": "误", "錫": "锡", "螻": "蝼", "蟄": "蛰", "蟈": "蝈", "蟎": "螨", "蠨": "蟏", "蟣": "虮", "蟯": "蛲", "蟶": "蛏", "蠅": "蝇", "蠆": "虿", "蠍": "蝎", "蠐": "蛴", "蠑": "蝾", "蠣": "蛎", "襲": "袭", "銑": "铣", "轄": "辖", "鍁": "锨", "鮮": "鲜", "鹹": "咸", "賢": "贤", "閑": "闲", "顯": "显", "險": "险", "餡": "馅", "鑲": "镶", "鄉": "乡", "詳": "详", "響": "响", "項": "项", "銷": "销", "衊": "蔑", "褘": "袆", "袞": "衮", "諧": "谐", "謝": "谢", "鋅": "锌", "釁": "衅", "鏽": "锈", "須": "须", "許": "许", "軒": "轩", "襏": "袯", "褌": "裈", "裝": "装", "褳": "裢", "選": "选", "詢": "询", "馴": "驯", "訓": "训", "訊": "讯", "遜": "逊", "鴉": "鸦", "鴨": "鸭", "訝": "讶", "閹": "阉", "鹽": "盐", "顏": "颜", "閻": "阎", "諺": "谚", "驗": "验", "鴦": "鸯", "陽": "阳", "養": "养", "褸": "褛", "褻": "亵", "襆": "幞", "襇": "裥", "雜": "杂", "襝": "裣", "襠": "裆", "襤": "褴", "覎": "觃", "覘": "觇", "覡": "觋", "遙": "遥", "謠": "谣", "頁": "页", "銥": "铱", "頤": "颐", "遺": "遗", "詣": "诣", "議": "议", "誼": "谊", "譯": "译", "陰": "阴", "銀": "银", "飲": "饮", "隱": "隐", "覥": "觍", "覦": "觎", "覬": "觊", "覯": "觏", "覷": "觑", "覲": "觐", "覿": "觌", "觴": "觞", "觶": "觯", "訁": "讠", "訌": "讧", "訐": "讦", "訒": "讱", "訕": "讪", "鷹": "鹰", "贏": "赢", "踴": "踊", "詠": "咏", "郵": "邮", "鈾": "铀", "誘": "诱", "輿": "舆", "魚": "鱼", "語": "语", "譽": "誉", "訥": "讷", "諶": "谌", "訩": "讻", "訶": "诃", "診": "诊", "註": "注", "證": "证", "詁": "诂", "詆": "诋", "詎": "讵", "詐": "诈", "詒": "诒", "詔": "诏", "詖": "诐", "詗": "诇", "詘": "诎", "詛": "诅", "讋": "詟", "詡": "诩", "詬": "诟", "詮": "诠", "詰": "诘", "詵": "诜", "詼": "诙", "詿": "诖", "預": "预", "馭": "驭", "鴛": "鸳", "轅": "辕", "遠": "远", "願": "愿", "躍": "跃", "閱": "阅", "雲": "云", "鄖": "郧", "隕": "陨", "運": "运", "醞": "酝", "韻": "韵", "載": "载", "贊": "赞", "贓": "赃", "鑿": "凿", "責": "责", "賊": "贼", "贈": "赠", "軋": "轧", "誄": "诔", "誅": "诛", "誆": "诓", "誑": "诳", "誒": "诶", "誚": "诮", "誥": "诰", "誶": "谇", "諂": "谄", "諄": "谆", "諉": "诿", "諍": "诤", "諏": "诹", "諑": "诼", "諗": "谂", "諛": "谀", "諝": "谞", "諞": "谝", "諡": "谥", "諢": "诨", "鍘": "铡", "齋": "斋", "輾": "辗", "賬": "账", "趙": "赵", "轍": "辙", "鍺": "锗", "這": "这", "貞": "贞", "針": "针", "鎮": "镇", "陣": "阵", "諤": "谔", "諦": "谛", "諫": "谏", "諭": "谕", "諳": "谙", "諸": "诸", "諼": "谖", "謁": "谒", "謅": "诌", "謐": "谧", "謔": "谑", "謖": "谡", "謨": "谟", "謫": "谪", "謳": "讴", "鄭": "郑", "質": "质", "鐘": "钟", "軸": "轴", "驟": "骤", "豬": "猪", "著": "着", "貯": "贮", "鑄": "铸", "譎": "谲", "譖": "谮", "譙": "谯", "譫": "谵", "譸": "诪", "譾": "谫", "讎": "雠", "讖": "谶", "讜": "谠", "讞": "谳", "駐": "驻", "轉": "转", "賺": "赚", "錐": "锥", "贅": "赘", "資": "资", "蹤": "踪", "鄒": "邹", "鑽": "钻", "豶": "豮", "貍": "狸", "貟": "贠", "鞀": "鼗", "靨": "靥", "贗": "赝", "賾": "赜", "貰": "贳", "貲": "赀", "貺": "贶", "貽": "贻", "賁": "贲", "賅": "赅", "賑": "赈", "賕": "赇", "賙": "赒", "賚": "赉", "賡": "赓", "賧": "赕", "賫": "赍", "贐": "赆", "賵": "赗", "賻": "赙", "贄": "贽", "贇": "赟", "黌": "黉", "鳧": "凫", "贔": "赑", "赬": "赪", "趲": "趱", "陘": "陉", "隉": "陧", "鄺": "邝", "鄔": "邬", "鄴": "邺", "躂": "跶", "踡": "蜷", "蹌": "跄", "蹕": "跸", "蹠": "跖", "蹣": "蹒", "郟": "郏", "鄶": "郐", "郤": "郄", "鄆": "郓", "酈": "郦", "蹺": "跷", "躉": "趸", "躋": "跻", "躑": "踯", "躒": "跞", "躓": "踬", "躕": "蹰", "躚": "跹", "躡": "蹑", "躦": "躜", "躪": "躏", "軑": "轪", "軔": "轫", "軛": "轭", "軤": "轷", "軫": "轸", "軲": "轱", "軹": "轵", "軺": "轺", "軻": "轲", "軼": "轶", "軾": "轼", "輅": "辂", "輇": "辁", "輈": "辀", "輊": "轾", "輒": "辄", "輜": "辎", "輞": "辋", "輟": "辍", "輦": "辇", "輬": "辌", "輳": "辏", "轀": "辒", "轂": "毂", "鶯": "莺", "驀": "蓦", "鎣": "蓥", "轆": "辘", "轔": "辚", "轡": "辔", "轢": "轹", "轤": "轳", "邇": "迩", "邐": "逦", "醱": "酦", "釃": "酾", "釅": "酽", "釓": "钆", "釔": "钇", "釕": "钌", "釗": "钊", "釙": "钋", "釤": "钐", "麅": "狍", "釧": "钏", "釵": "钗", "釷": "钍", "釹": "钕", "鈀": "钯", "鈁": "钫", "鈃": "钘", "鈄": "钭", "鈈": "钚", "鈐": "钤", "鈑": "钣", "鈒": "钑", "鈥": "钬", "鈦": "钛", "鈧": "钪", "鈮": "铌", "鈰": "铈", "鈳": "钶", "鈷": "钴", "鈸": "钹", "鈹": "铍", "鈺": "钰", "鈽": "钸", "鈿": "钿", "餳": "饧", "飩": "饨", "餼": "饩", "飪": "饪", "飫": "饫", "飭": "饬", "飴": "饴", "餉": "饷", "餑": "饽", "餘": "余", "餛": "馄", "餷": "馇", "餿": "馊", "饃": "馍", "饈": "馐", "饉": "馑", "饊": "馓", "饌": "馔", "饢": "馕", "鉈": "铊", "鉉": "铉", "鉍": "铋", "鉕": "钷", "鉞": "钺", "鉦": "钲", "鉬": "钼", "鉭": "钽", "鐦": "锎", "鉶": "铏", "鉺": "铒", "鉿": "铪", "銃": "铳", "銍": "铚", "銓": "铨", "銖": "铢", "銚": "铫", "銛": "铦", "銠": "铑", "銣": "铷", "銦": "铟", "閂": "闩", "閆": "闫", "闈": "闱", "閎": "闳", "閔": "闵", "閌": "闶", "闥": "闼", "閭": "闾", "閫": "阃", "鬮": "阄", "閬": "阆", "閾": "阈", "閶": "阊", "鬩": "阋", "閿": "阌", "閽": "阍", "閼": "阏", "闃": "阒", "闋": "阕", "闔": "阖", "闐": "阗", "闕": "阙", "闞": "阚", "爿": "丬", "銨": "铵", "銩": "铥", "銪": "铕", "銫": "铯", "銬": "铐", "銱": "铞", "銼": "锉", "鎇": "镅", "鋃": "锒", "鋌": "铤", "鋏": "铗", "鋙": "铻", "鐲": "镯", "鋝": "锊", "鋟": "锓", "鋣": "铘", "鋥": "锃", "鋦": "锔", "鋨": "锇", "鋩": "铓", "鋮": "铖", "鋯": "锆", "鋰": "锂", "鋱": "铽", "鋶": "锍", "錁": "锞", "錆": "锖", "錇": "锫", "錈": "锩", "錏": "铔", "錒": "锕", "錕": "锟", "錙": "锱", "錚": "铮", "錛": "锛", "錟": "锬", "錡": "锜", "錩": "锠", "錮": "锢", "錸": "铼", "鎿": "镎", "鍀": "锝", "鍃": "锪", "鍆": "钔", "鍇": "锴", "鍈": "锳", "鍔": "锷", "鍚": "钖", "鍠": "锽", "鍤": "锸", "鍥": "锲", "鍩": "锘", "騫": "骞", "鍰": "锾", "鍶": "锶", "鎄": "锿", "鎔": "镕", "鎘": "镉", "鎛": "镈", "鎡": "镃", "鎦": "镏", "鎧": "铠", "鎩": "铩", "鎪": "锼", "鎰": "镒", "鎲": "镋", "鎵": "镓", "鐫": "镌", "鏃": "镞", "鏇": "镟", "鏌": "镆", "鏍": "镙", "駔": "驵", "駟": "驷", "駙": "驸", "騶": "驺", "驛": "驿", "駑": "驽", "駘": "骀", "驍": "骁", "驊": "骅", "駢": "骈", "驪": "骊", "騏": "骐", "騍": "骒", "騅": "骓", "驂": "骖", "騭": "骘", "騖": "骛", "驁": "骜", "騮": "骝", "騸": "骟", "驃": "骠", "驄": "骢", "驏": "骣", "驥": "骥", "驤": "骧", "糸": "纟", "鏐": "镠", "鏑": "镝", "鏗": "铿", "鏘": "锵", "鏜": "镗", "鏝": "镘", "鏞": "镛", "鏢": "镖", "鏤": "镂", "鏨": "錾", "鏰": "镚", "鏵": "铧", "鏷": "镤", "鏹": "镪", "鐃": "铙", "鐋": "铴", "鐒": "铹", "鐓": "镦", "鐔": "镡", "鐙": "镫", "钁": "镢", "鐠": "镨", "鐧": "锏", "鐨": "镄", "頊": "顼", "鐶": "镮", "鐸": "铎", "鐺": "铛", "鐿": "镱", "鑊": "镬", "鑌": "镔", "鑔": "镲", "鑕": "锧", "鑞": "镴", "鑠": "铄", "鑣": "镳", "鑥": "镥", "鑭": "镧", "鑱": "镵", "鑹": "镩", "鑾": "銮", "韙": "韪", "韞": "韫", "韜": "韬", "閈": "闬", "闍": "阇", "闒": "阘", "闓": "闿", "闠": "阓", "闤": "阛", "靦": "腼", "霽": "霁", "靂": "雳", "靄": "霭", "靚": "靓", "颮": "飑", "颯": "飒", "颶": "飓", "颼": "飕", "飆": "飙", "齏": "齑", "於": "于", "鞽": "鞒", "韃": "鞑", "韉": "鞯", "韍": "韨", "韝": "鞴", "頇": "顸", "頎": "颀", "龕": "龛", "頏": "颃", "頜": "颌", "頡": "颉", "頦": "颏", "頮": "颒", "頲": "颋", "頴": "颕", "頷": "颔", "顎": "颚", "顒": "颙", "顓": "颛", "顙": "颡", "顢": "颟", "顥": "颢", "顬": "颥", "顰": "颦", "顳": "颞", "颭": "飐", "颸": "飔", "颻": "飖", "飀": "飗", "飣": "饤", "飥": "饦", "飿": "饳", "餄": "饸", "餎": "饹", "餏": "饻", "餕": "馂", "餖": "饾", "餚": "肴", "餜": "馃", "餶": "馉", "餺": "馎", "饁": "馌", "饗": "飨", "饜": "餍", "鳩": "鸠", "鳶": "鸢", "鴇": "鸨", "鴆": "鸩", "鴣": "鸪", "鶇": "鸫", "鸕": "鸬", "鴝": "鸲", "鴟": "鸱", "鷥": "鸶", "鴯": "鸸", "鷙": "鸷", "鴰": "鸹", "鵂": "鸺", "鸞": "鸾", "鵓": "鹁", "鸝": "鹂", "鵠": "鹄", "鵒": "鹆", "鷳": "鹇", "鵜": "鹈", "鵡": "鹉", "鶓": "鹋", "鵪": "鹌", "鵯": "鹎", "鶉": "鹑", "鶘": "鹕", "鶚": "鹗", "鶿": "鹚", "鶥": "鹛", "鶩": "鹜", "鷂": "鹞", "鶼": "鹣", "鸚": "鹦", "鷓": "鹧", "鷚": "鹨", "鷯": "鹩", "鷦": "鹪", "鷲": "鹫", "鷸": "鹬", "鸌": "鹱", "鷺": "鹭", "鸛": "鹳", "馹": "驲", "駰": "骃", "駸": "骎", "騂": "骍", "騌": "骔", "騤": "骙", "驌": "骕", "驦": "骦", "驫": "骉", "鯁": "鲠", "髏": "髅", "髕": "髌", "髖": "髋", "鬢": "鬓", "鬱": "郁", "魎": "魉", "魘": "魇", "魛": "鱽", "魢": "鱾", "魨": "鲀", "魴": "鲂", "魷": "鱿", "魺": "鲄", "麩": "麸", "鮁": "鲅", "鮃": "鲆", "鮊": "鲌", "鮋": "鲉", "鯀": "鲧", "鮍": "鲏", "鮎": "鲇", "鮐": "鲐", "鮒": "鲋", "鮓": "鲊", "鮚": "鲒", "鮜": "鲘", "鮞": "鲕", "鮦": "鲖", "鮪": "鲔", "鮫": "鲛", "鮭": "鲑", "鮳": "鲓", "鮶": "鲪", "鯷": "鳀", "鮺": "鲝", "鯇": "鲩", "鯊": "鲨", "鯒": "鲬", "鯔": "鲻", "鯕": "鲯", "鯖": "鲭", "鯗": "鲞", "鯛": "鲷", "醯": "酰", "鹺": "鹾", "鯝": "鲴", "鯡": "鲱", "鯢": "鲵", "鯤": "鲲", "鯧": "鲳", "鯪": "鲮", "鯫": "鲰", "鯰": "鲶", "鯴": "鲺", "鰺": "鲹", "鯽": "鲫", "鯿": "鳊", "鰁": "鳈", "鰂": "鲗", "鰃": "鳂", "鰈": "鲽", "鰉": "鳇", "鰍": "鳅", "鰏": "鲾", "鱷": "鳄", "鰒": "鳆", "鰮": "鳁", "鰜": "鳒", "鰟": "鳑", "鰠": "鳋", "鰣": "鲥", "鰥": "鳏", "鰨": "鳎", "鰩": "鳐", "鰭": "鳍", "鰱": "鲢", "鰲": "鳌", "鰳": "鳓", "鰵": "鳘", "鰷": "鲦", "鰹": "鲣", "鰻": "鳗", "齔": "龀", "齟": "龃", "齙": "龅", "齠": "龆", "齜": "龇", "齦": "龈", "齬": "龉", "齪": "龊", "齷": "龌", "黽": "黾", "黿": "鼋", "鼉": "鼍", "鱸": "鲈", "鱟": "鲎", "鱭": "鲚", "鱘": "鲟", "鱺": "鲡", "鱝": "鲼", "鰼": "鳛", "鰾": "鳔", "鱂": "鳉", "鱅": "鳙", "鱈": "鳕", "鱒": "鳟", "鱔": "鳝", "鱖": "鳜", "鱠": "鲙", "鱣": "鳣", "鱤": "鳡", "鱧": "鳢", "鱨": "鲿", "鱯": "鳠", "鶻": "鹘", "黷": "黩", "黲": "黪", "鼴": "鼹", "齇": "齄", "鳲": "鸤", "鴒": "鸰", "鴞": "鸮", "鴬": "鸴", "鴴": "鸻", "鵃": "鸼", "鵐": "鹀", "鵮": "鹐", "鵷": "鹓", "鵾": "鹍", "鶊": "鹒", "鶖": "鹙", "鶡": "鹖", "鶬": "鸧", "鶲": "鹟", "鶹": "鹠", "鶺": "鹡", "鷁": "鹢", "鷊": "鹝", "鷖": "鹥", "鷫": "鹔", "鸇": "鹯", "鸏": "鹲", "鸘": "鹴", "黶": "黡", "鼂": "鼌", "齕": "龁", "齗": "龂", "飈": "飚", "邨": "村", "鉅": "钜", "喎": "㖞", "撝": "㧑", "擓": "㧟", "殨": "㱮", "瞜": "䁖", "筴": "䇲", "䊷": "䌶", "紬": "䌷", "縳": "䌸", "絅": "䌹", "䋙": "䌺", "繸": "䍁", "䝼": "䞍", "鳾": "䴓", "鵁": "䴔", "鴷": "䴕", "鶄": "䴖", "鶪": "䴗", "鷈": "䴘", "鷿": "䴙", "俔": "伣", "倈": "俫", "剎": "刹", "龎": "厐", "叄": "叁", "吶": "呐", "壠": "垅", "奼": "姹", "弒": "弑", "悞": "悮", "戱": "戯", "挩": "捝", "搵": "揾", "槤": "梿", "梲": "棁", "榲": "榅", "熅": "煴", "瘲": "疭", "瞶": "瞆", "禡": "祃", "窵": "窎", "篔": "筼", "骯": "肮", "虆": "蔂", "薀": "蕰", "誾": "訚", "逕": "迳", "酇": "酂", "釒": "钅", "鍾": "锺", "霢": "霡", "颺": "飏", "飠": "饣", "䰾": "鲃", "䲁": "鳚", "礆": "硷", "恥": "耻", "囪": "囱", "惡": "恶", "琺": "珐", "廄": "厩", "扡": "扦", "甕": "瓮", "囂": "嚣", "紮": "扎", "佇": "伫", "諮": "谘", "槁": "藁", "醃": "腌", "齶": "腭", "遝": "沓", "蠔": "蚝", "秈": "籼", "餱": "糇", "雋": "隽", "線": "线", "蒞": "莅", "託": "讬", "訢": "䜣", "鉋": "铇", "眥": "眦", "鹼": "碱", "裡": "里", "闆": "板", "爲": "为", "衆": "众", "僞": "伪", "傯": "偬", "淒": "凄", "勳": "勋", "滷": "卤", "歷": "历", "疊": "叠", "吒": "咤", "譁": "哗", "齧": "啮", "阪": "坂", "壎": "埙", "復": "复", "嬀": "妫", "嫺": "娴", "嶽": "岳", "冪": "幂", "櫺": "棂", "潙": "沩", "遊": "游", "溼": "湿", "灩": "滟", "皰": "疱", "痾": "疴", "籤": "签", "糹": "纟", "絛": "绦", "鞝": "绱", "繮": "缰", "豔": "艳", "蓴": "莼", "虯": "虬", "嫋": "袅", "襉": "裥", "齎": "赍", "裏": "里", "鑑": "鉴", "鉢": "钵", "鐗": "锏", "杴": "锨", "閒": "闲", "黴": "霉", "飢": "饥", "鷽": "鸴", "鬆": "松", "嚐": "尝" };

   const rIsChinese = /\p{sc=Han}/u;
   function t2s(textStr) {
      if (!config.traditional_to_simple_chinese) {
         return textStr;
      } else if (typeof textStr === "undefined") {
         throw new Error("no input");
      } else if (typeof textStr != "string") {
         throw new Error("input is not string");
      } else if (!textStr.match(rIsChinese)) {
         return textStr;
      }
      var new_textStr = textStr.replace(/\p{sc=Han}/ug, function (m) {
         return t2sArray[m] || m;
      });
      // if (textStr != new_textStr) {
      //    console.log(`${textStr} -> ${new_textStr}`)
      // }
      return new_textStr;
   }

   /* how ClickDetector works:
      it get n, m values from config
      and splited screen on n*m rectangles
      each rectangle get it's own number
      left-> right, up->down
   
      n = 3, m = 2:
   
      -------------
      | 1 | 2 | 3 |
      |---|---|---|
      | 4 | 5 | 6 |
      -------------
   
      you setup click_interval
      and any chain of blocks:
      [1, 3, 6, 4] or [1, 1, 2, 2, 5, 5, 4, 4]
      if last clicks are same as you expected in chain: 
         event fired
   */

   class ClickDetector {
      constructor(n, m, click_interval, config) {
         this.n = n;
         this.m = m;
         this.click_interval = click_interval;
         this.s = [];
         this.config = config
      }

      get_index(event) {
         let x = event.clientX;
         let y = event.clientY;
         let w = window.innerWidth;
         let h = window.innerHeight;
         let i = ~~(x / ~~(w / this.n));
         let j = ~~(y / ~~(h / this.m));
         return j * this.n + i;
      }

      clean_array(min_val) {
         this.s = this.s.filter(x => x[0] >= min_val)
      }

      on_click(event) {
         // console.log(event)
         let index = this.get_index(event);
         let cur_time = Date.now();
         this.clean_array(cur_time - this.click_interval)
         this.s.push([cur_time, index]);

         for (const [indexes, callback] of this.config) {
            if (indexes.length > this.s.length) continue;
            if (!this.is_event_fired(indexes)) continue;
            // console.log('fired');
            this.s = [];
            callback()
            return
         }
      }

      is_event_fired(indexes) {
         let l_diff = this.s.length - indexes.length
         let prev_val;
         for (let i = 0; i < indexes.length; i++) {
            let expected_index = indexes[i] - 1;
            let got_index = this.s[l_diff + i][1]
            if (expected_index != got_index) return false;

            let cur_val = this.s[l_diff + i][0];
            if (prev_val && cur_val < prev_val) return false;
            prev_val = cur_val
         }

         return true;
      }
   }

   class ScriptRunner {
      constructor() {
         this.on = true;

         this.config_loader = new ConfigLoader();
         this.builder = new ConfigBuilder(this.config_loader);

         this.config_loader.set_mode(loader_modes.fast_load);
         this.builder.set_mode(loader_modes.fast_load);

         this.click_detector = new ClickDetector(
            config.binds.n,
            config.binds.m,
            config.binds.click_interval,
            this.prepare_event_config(config.binds.events)
         );
         this.replaced_nodes = new Map();

         this.replacements = null;
         this.promised_replacements = null
         this.observer = null
      }

      prepare_event_config(events) {
         let event_config = []
         for (const [callback_name, indexes] of Object.entries(events)) {
            let callback = () => { this[callback_name]() }
            event_config.push([indexes, callback])
         }
         return event_config
      }

      run_mutations(mutations) {
         if (!this.on) return;
         mutations.forEach(mutation => {
            if (mutation.type === "childList") {
               mutation.addedNodes.forEach(node => {
                  this.replace(node);
               });
            }
         });
      }

      preLoad() {
         this.promised_replacements = this.builder.get(config.json_url);
         this.observer = new MutationObserver(
            mutations => this.run_mutations(mutations)
         );
      }

      ob_disconnect() {
         this.observer.disconnect()
      }

      ob_connect() {
         this.observer.observe(document.body, { childList: true, subtree: true });
      }


      async onLoad() {
         this.replacements = await this.promised_replacements
            .catch(err => { this.onError(err) });

         // console.log(`main started in: ${Date.now() - script_start}`);
         // console.log("config loaded!");
         if (!this.replacements || this.replacements.size == 0) {
            console.log("no replacements for this site!");
            return;
         }

         if (!this.builder.is_restored) {
            this.builder.save(this.replacements);
         }

         this.ob_connect()

         this.replace();

         document.body.addEventListener('click',
            event => this.click_detector.on_click(event));

         if (!this.builder.is_restored && !this.config_loader.is_restored) return;
         this.forse_update_replacements();
      }

      replace(node = document.body) {
         if (!this.on) return;
         try {
            replaceText(node, this.replacements, this.replaced_nodes, this);
         } catch (err) {
            this.onError(err);
         }
      }

      revert_nodes() {
         if (!this.on) return;
         for (let [node, text] of this.replaced_nodes) {
            node.textContent = text;
         }
      }

      swap_on_off() {
         if (this.on) {
            this.revert_nodes()
            this.on = false
         } else {
            this.on = true
            this.replace()
         }
      }

      async forse_update_replacements() {
         this.config_loader.set_mode(loader_modes.force_load);
         this.builder.set_mode(loader_modes.force_load);

         this.replacements = await this.builder.get(config.json_url)
            .catch(err => { this.onError(err) });
         this.builder.save(this.replacements);

         this.revert_nodes();
         this.replace();
      }

      onError(err) {
         this.config_loader.resetOnError()
         this.builder.resetOnError()
         throw err
      }

   }

   let script_runner = new ScriptRunner();
   script_runner.preLoad();

   document.readyState !== 'loading'
      ? script_runner.onLoad()
      : addEventListener("DOMContentLoaded", () => { script_runner.onLoad(); });
}