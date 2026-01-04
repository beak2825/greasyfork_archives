// ==UserScript==
// @name         AuViDL [vkopt module]
// @namespace    http://tampermonkey.net/
// @version      3.0.7.7
// @description  Опции скачивания аудио и видео
// @author       KiberInfinity
// @match        https://vk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381610/AuViDL%20%5Bvkopt%20module%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/381610/AuViDL%20%5Bvkopt%20module%5D.meta.js
// ==/UserScript==

window.vkopt = (window.vkopt || {});

vkopt['audl'] = {
   css: function(){
      var codes = vk_lib.get_block_comments(function(){
      /*dl:
      .audio_row .audio_acts .audio_act.vk_audio_dl_btn{
         display:block;
      }
      .audio_row__action_get_link{
         float: right;
      }
      .audio_row .audio_acts .audio_act.vk_audio_dl_btn>div,
      .audio_row__action_get_link div{
         background-image: url(/images/blog/about_icons.png);
         width: 12px;
         height: 14px;
         background-position: 0px -309px;
      }

      .audio_row .audio_acts .audio_act.vk_audio_acts>div {
         margin: 6px 0 0 6px;
      }
      .audio_row .audio_acts .audio_act.vk_audio_dl_btn.dl_url_loading>div,
      .audio_row__action_get_link.dl_url_loading div{
         opacity:0.3;
         background: url(/images/upload_inv_mini.gif) no-repeat 0% 50%;
         width: 17px;
         margin-left: -2px;
      }
      .audio_row__action_get_link div,
      .audio_row__action_get_link.dl_url_loading div{
         margin: 5px auto;
      }

      .vk_audio_icon_dots .audio_row .audio_acts .audio_act.vk_audio_acts{
         display:block;
      }
      .vk_audio_icon_dots .audio_row .audio_acts .audio_act.vk_audio_acts>div {
         background: url(/images/icons/profile_dots.png) no-repeat 0 5px;
         height: 13px;
         width: 18px;
      }

      .vk_audio_icon_dots .audio_row .audio_acts .audio_act.vk_audio_dl_btn.vk_audio_acts>div{
         background: url(/images/icons/profile_dots.png) no-repeat 0 5px;
         height: 13px;
         width: 18px;
         transition: none;
      }
      .vk_audio_icon_dots .audio_row .audio_acts .audio_act.vk_audio_dl_btn.vk_audio_acts:hover>div{
         background-image: url(/images/blog/about_icons.png);
         width: 12px;
         height: 14px;
         margin-left:3px;
         margin-right:3px;
         background-position: 0px -309px;
      }
      .audio_row .audio_acts .audio_act.vk_audio_dl_btn.dl_url_loading>div,
      .audio_row .audio_acts .audio_act.vk_audio_dl_btn.dl_url_loading:hover>div{
         opacity:0.3;
         background: url(/images/upload_inv_mini.gif) no-repeat 0% 50%;
         width: 18px;
      }

      .audio_duration_wrap.vk_with_au_info .audio_duration{
         display: inline;
      }

      .audio_row.vk_info_loaded .vk_audio_size_info_wrap{
         display: table;
      }

      .vk_audio_size_info_wrap,
      .narrow_column .audios_module .vk_audio_size_info_wrap,
      .audio_row:hover .vk_audio_size_info_wrap
      {
         display: none;
      }
      .vk_audio_size_info_wrap span{
         display: block;
      }
      .vk_audio_size_info_wrap{
         line-height: 10px;
         margin-right: 3px;
         margin-top: 12px;
         height: 18px;
         float:right;
         font-size: 10px;
         color: #777;
      }
      .audio_w_covers .vk_audio_size_info_wrap{
         margin-top: 15px;
      }
      .vk_audio_size_info{
         display: table-cell;
         vertical-align: middle;
      }
      .audio_row.vk_info_loaded .audio_row__info {margin-left: 30px;}
      .wall_module .media_desc .vk_audio_size_info b {
         background:none
      }
      */
      });
      return codes.dl;
   },
   tpls: {},
   onSettings:{
      Media:{
         audio_dl: {
            title: 'seLinkAu',
            info: 'infoUseNetTrafic'
         },
         audio_size_info: {
            title: 'seAudioSizeAuto',
            info: 'infoUseNetTrafic',
            sub: {
               audio_wait_hover:{
                  title: 'seAudioSizeHover'
               }
            }
         }
      }
   },
   onInit: function(){
      vkopt.audl.tpls = vk_lib.get_block_comments(function(){
      /*size_info:
      <small class="vk_audio_size_info_wrap" id="vk_audio_size_info_{vals.id}">
         <div class="vk_audio_size_info">
            <span class="vk_audio_size">{vals.size}</span>
            <span class="vk_audio_kbps">{vals.kbps}</span>
         </div>
      </small>
      */
      });
      vkopt.audl.load_sizes_cache();
      vkbrowser.mozilla && vkopt.permissions.update();
   },
   onLibFiles: function(fn){
      if (fn == 'audioplayer.js'){
         Inj.Start('AudioPlayerHTML5.prototype._isHlsUrl', function(url,obj){
            if (obj && obj.get_url)
               obj.url = url;
         })
      }
   },
   onAudioRowItems: function(audioEl, audioObject, audio){
      var items = {actions:[]};
      if (vkopt.settings.get('audio_dl')){
         items.actions.push([
            'get_link',
            function(audioEl, audioObject, audio){
               vkopt.log(arguments);
               var filename=vkCleanFileName(unclean(audioObject.performer+' - '+audioObject.title));
               var dl_btn = geByClass1('_audio_row__action_get_link', audioEl);
               if (dl_btn.hasAttribute('url_ready')){
                  if (dl_btn.dataset["m3u8"]){
                     vkopt.hls.download(
                        dl_btn.dataset["m3u8"],
                        dl_btn.getAttribute('download'),
                        dl_btn.dataset["aid"]
                     );
                     return false;
                  }

                  var dlnk = se('<a href="'+dl_btn.href+'" download="'+filename+'.mp3" url_ready=1></a>');
                  utilsNode.appendChild(dlnk);
                  if (vkopt.audl.download_file(dlnk))
                     dlnk.click();
                  setTimeout(function(){
                     re(dlnk);
                  },200);
               }
               return true;
            },
            '<div></div>',// button content
            'data-aid="{vals.fullId}" data-reqaid="{vals.fullId}_{vals.actionHash}_{vals.urlHash}" id="vk_get_link_{vals.fullId}" href="" onmouseover="vkopt.audl.check_dl_url(this);"',//custom_attributes
            'a'
         ]);
      }
      return items;
   },
   processNode: function(node, params){
      if (!vkopt.settings.get('audio_dl')) return;
      if (!vkopt.audl.__full_audio_info_cache)
         vkopt.audl.__full_audio_info_cache = {};
      var cache = vkopt.audl.__full_audio_info_cache;

      var audios = geByClass('audio_row',node);
      if (!audios.length && hasClass(node, 'audio_row')) // если вызов из AutoList.prototype._drawRows, то на входе уже элемент audio_row
         audios = [node];

      for (var i = 0; i < audios.length; i++){
         var row = audios[i];
         var dur = geByClass1('audio_row__info', row);
         var info = null;
         try {
            info = JSON.parse(row.dataset["audio"]);
         } catch(e) {}
         if (!info) continue;
         var info_obj = AudioUtils.asObject(info);
         if (info_obj.url==""){                    // собираем очередь из аудио, которым требуется подгрузка инфы
            if (cache[info_obj.fullId])
               info_obj = cache[info_obj.fullId];
            else {
               var queue = vkopt.settings.get('audio_wait_hover') ? vkopt.audl.__hover_load_queue : vkopt.audl.__load_queue;
               var full_id_req = info_obj.fullId  + "_" + info_obj.actionHash + "_" + info_obj.urlHash;
               if (queue.indexOf(full_id_req) == -1 && vkopt.audl.__loading_queue.indexOf(full_id_req) == -1)
                  queue.push(full_id_req);
            }
         }

         if (info_obj.url)
            info_obj.url = vkopt.audl.decode_url(info_obj.url);

         //var name = unclean(info[4]+' - '+info[3]).replace(/<em>|<\/em>/g, ''); // зачищаем от тегов.
         //name = vkCleanFileName(name);

         var size = vkopt.audl._sizes_cache[info_obj.fullId];
         var sz_labels = size ? vkopt.audl.size_to_bitrare(size, info_obj.duration) : {};
         if (size){
            row.dataset['kbps'] = sz_labels.kbps_raw;
            row.dataset['filesize'] = size;
            addClass(row, 'vk_info_loaded');
         }

         var sz_info = se(vk_lib.tpl_process(vkopt.audl.tpls['size_info'], {
               id: info_obj.fullId,
               url: info_obj.url || '',
               size: sz_labels.size || '? Mb',
               kbps: sz_labels.kbps || '? Kbps'
            }));

         // Инфа о размере/битрейте
         if (vkopt.settings.get('audio_size_info')){
            if (!vkopt.settings.get('audio_wait_hover') && info_obj.url)
               vkopt_core.timeout( //setTimeout
                  (function(id, url){
                     return function(){
                        vkopt.audl.load_size_info(id, url);
                     }
                  })(info_obj.fullId, info_obj.url),
                  200
               );

            if (dur && !hasClass('vk_with_au_info',dur.parentNode)){
               dur.parentNode.insertBefore(sz_info, dur);
               addClass(dur.parentNode, 'vk_with_au_info');
            }
         }
      }

      // TODO: грузить инфу только при наведении на иконку меню/скачивания
      if (!vkopt.settings.get('audio_wait_hover') && (vkopt.settings.get('audio_size_info') || vkopt.settings.get('audio_dl'))) // URL'ы нужны только для этих опций
         vkopt.audl.load_audio_urls(); // запускаем процесс загрузки инфы об аудио из очереди
   },

   download_file: function(el){
     var result = true;
     if (el.hasAttribute('url_ready'))
        result = vkopt.permissions.check_dl_url(el, el.href);
     if (result) result = vkDownloadFile(el);
     return result;
   },
   check_dl_url: function(el){   // если на странице не было ссылок на аудио, то при наведении на кнопку загрузки ждём их появления в кэше.
      if (el.getAttribute('href') == ''){
         addClass(el,'dl_url_loading');
         var id = el.dataset["aid"];
         var req_id = el.dataset["reqaid"];
         function wait_and_set_url(){
            var info = vkopt.audl.__full_audio_info_cache[id];
            if (info){
               var name = unclean(info.performer + ' - ' + info.title);
               if (vkopt.settings.get('audio_clean_titles'))
                  name = vkopt.audio_clean_titles.remove_trash(name);

               var name = vkCleanFileName(name);
               var url = vkopt.audl.make_dl_url(info.url, name);

               if (/\.m3u8/.test(info.url)){
                  el.dataset["m3u8"] = info.url;
               }

               el.setAttribute('download', name+'.mp3');
               el.setAttribute('href', url);
               el.setAttribute('url_ready','1');
               removeClass(el,'dl_url_loading');
               //vkopt.permissions.request_on_click(el, url, vkopt.log);
               vkopt.audl.load_size_info(info.fullId, info.url);
            } else {
               setTimeout(function(){
                  wait_and_set_url();
               },300);
            }
         }
         wait_and_set_url();
         if (vkopt.settings.get('audio_wait_hover')){
            var info = vkopt.audl.__full_audio_info_cache[id];
            // если не в загруженной инфе и очередях загрузки
            var hq = vkopt.audl.__hover_load_queue;
            if (!info && vkopt.audl.__loading_queue.indexOf(req_id) == -1 &&  vkopt.audl.__load_queue.indexOf(req_id) == -1){
               var idx = hq.indexOf(req_id);
               if (idx == -1){ // не знаю возможно ли, но лучше добавлю проверку.
                  hq.push(req_id);
                  idx = hq.length - 1;
               }
               var start = Math.max(0, idx - 2);
               var end = Math.min(start + 5, hq.length) - start;
               var to_load = hq.splice(start, end);
               vkopt.audl.__load_queue = vkopt.audl.__load_queue.concat(to_load);
               vkopt.audl.load_audio_urls(); // запускаем процесс загрузки инфы об аудио из очереди
            }
         }
      }
   },
   make_dl_url: function(url, name){
      name = vkCleanFileName(name);
      /*
      // фикс-костыль, т.к для https://*.vk-cdn.net нет разрешений в манифесте.
      // если исправить в манифесте, то после обновления расширения, оно отключится у всех пользователей хрома)
      //url = vkopt.audl.decode_url(url);
      if (/^https:.+\.vk-cdn\.net\//i.test(url))
         url = url.replace(/^https:/,'http:');
      */
      var ext =  /\.m3u8/.test(url) ? '.m3u8' : '.mp3';
      return url + '#FILENAME/' + vkEncodeFileName(name) + ext;
   },
   _sizes_cache: {}, // надо бы его загонять в локальное хранилище, но например кэш размеров со списка в ~500 аудио занимает около 10кб. т.е его нужно будет как-то по умному чистить.
   info_thread_count: 0,
   save_sizes_cache:function(){
      clearTimeout(vkopt.audl._save_size_cache);
      vkopt.audl._save_size_cache = setTimeout(function(){
         var cache = vkopt.audl._sizes_cache;
         var len = 0;
         var max_items = vkopt_defaults.config.MAX_CACHE_AUDIO_SIZE_ITEMS;
         for (var key in cache) len++;
         if (len > max_items){
            var new_cache = {};
            var i = 0;
            for (var key in cache){
               i++;
               if (i > len - max_items)
                  new_cache[key] = cache[key];
            }
            cache = new_cache;
         }
         localStorage['vkopt_audio_sizes_cache'] = JSON.stringify(cache);
      },1500);
   },
   load_sizes_cache:function(){
      var sz_cache = {};
      try{
         sz_cache = JSON.parse(localStorage['vkopt_audio_sizes_cache'] || '{}');
      } catch(e){}
      vkopt.audl._sizes_cache = sz_cache;
   },
   clear_sizes_cache:function(){
      localStorage['vkopt_audio_sizes_cache'] = '{}';
   },
   size_to_bitrare: function(size, duration){
      var kbit = size / 128;
      var kbps = Math.ceil(Math.round(kbit/duration)/16)*16;
      return {
         size: vkFileSize(size, 1).replace(/([\d\.]+)/,'<b>$1</b>'),
         kbps: (kbps > 0 ? '<b>' + kbps + '</b> Kbps' : ''),
         kbps_raw: kbps
      }
   },
   load_size_info: function(id, url){
      if (vkopt.audl.info_thread_count >= vkopt_defaults.config.AUDIO_INFO_LOAD_THREADS_COUNT){
         var t = setInterval(function(){
            if (vkopt.audl.info_thread_count < vkopt_defaults.config.AUDIO_INFO_LOAD_THREADS_COUNT){
               clearInterval(t);
               vkopt.audl.load_size_info(id, url);
            }
         },50);
         return;
      }
      if (!vkopt.settings.get('audio_size_info')) return;

      var size = vkopt.audl._sizes_cache[id];
      var custom_duration = 0;
      var rb = true;
      var WAIT_TIME = 4000;
      var els = geByClass('_audio_row_' + id);
      var set_size_info = function(size){
         for (var i = 0; i < els.length; i++){
            var el = els[i];
            var info = AudioUtils.asObject(AudioUtils.getAudioFromEl(el));
            var size_el = geByClass1('vk_audio_size', el);
            var kbps_el = geByClass1('vk_audio_kbps', el);

            if (custom_duration){
               size = size/custom_duration*info.duration
            }
            var sz_info = vkopt.audl.size_to_bitrare(size, info.duration);
            val(size_el, sz_info.size);
            val(kbps_el, sz_info.kbps);

            el.dataset['kbps'] = sz_info.kbps_raw;
            el.dataset['filesize'] = size;
            addClass(el, 'vk_info_loaded');

            if (!vkopt.audl._sizes_cache[id]){
               if (sz_info.kbps_raw > 120){
                  vkopt.audl._sizes_cache[id] = size;
                  vkopt.audl.save_sizes_cache();
               } else {
                  vkopt.audl._sizes_cache[id] = false;
                  vkopt.audl.save_sizes_cache();
               }
            }
            return sz_info.kbps_raw > 120;
         }
      };
      var get_size = function(url){
         var reset=setTimeout(function(){
            vkopt.audl.info_thread_count--;
            rb = false;
         }, WAIT_TIME);
         vkopt.audl.info_thread_count++;
         XFR.post(url, {}, function(h, size){
            clearTimeout(reset);
            vkopt.log('get_size response:', id, size, h);
            if (rb){
               vkopt.audl.info_thread_count--;
            }
            if (size > 0){
               set_size_info(size);
            } else {
               // TODO: видать ссылка протухла. нужно подгрузить актуальный URL и снова запросить размер
            }
         }, true);

      }

      var need_load = true;
      if (size)
         need_load = !set_size_info(size);

      if (need_load && els.length){
         if (/\.m3u8/.test(url)){
            AjGet(url, function(r){
               var base = url.split('?')[0].match(/.+\//)[0];
               var info = [];
               r.replace(/#EXT-X-KEY:METHOD=([^\r\n]+)[\s\S]*?#EXTINF:(.+?),[\r\n]+(.+\.ts[^\r\n]+)/g,function(s,mtd,dur,lnk){
                  if (mtd=="NONE")
                     info.push({method:mtd, duration:dur, link:base+lnk})
               });
               var ts = info[Math.round(info.length/2)];
               custom_duration = parseFloat(ts.duration);
               get_size(ts.link);
            })
         } else {
            get_size(url);
         }
      }
   },
   __load_queue:[], // очередь загрузки инфы
   __hover_load_queue:[], // очередь, из которой будут аудио перемещаться в __load_queue, при наведении на иконку загрузки.
   __loading_queue:[], // очередь текущих аудио, по которым в данный момент грузится инфа
   __load_req_num: 1,
   __full_audio_info_cache: {},
   decode_url: function(url){
      var tmp = {};
      var orig = RegExp.prototype.test;
      RegExp.prototype.test = function(){return false}
      try{
         AudioPlayerHTML5.prototype._setAudioNodeUrl(tmp, url);
      }catch(e){}
      RegExp.prototype.test = orig;
      return tmp.src
   },
   load_audio_urls: function(){
      if (vkopt.audl.__load_queue.length == 0 || vkopt.audl.__loading_queue.length > 0) // если нет списка на подгрузку, или что-то уже грузится - игнорим вызов
         return;

      vkopt.audl.__loading_queue = vkopt.audl.__load_queue.splice(0,Math.min(vkopt.audl.__load_queue.length, vkRandomRange(5,10))); // больше 10 аудио не принимает.
      var load_info = function(){
         //TODO: удаление из __load_queue отсутствущих на странице аудио

         ajax.post("al_audio.php", {
            act : "reload_audio",
            ids :  vkopt.audl.__loading_queue.join(",")
         }, {
            onDone : function (data) {
               if (!data){ // вероятно косяк с детектом множества однотипных действий
                  console.log('Load audio info failed:', vkopt.audl.__load_req_num, vkopt.audl.__loading_queue.join(","));
                  setTimeout(function(){
                     console.log('try load again');
                     load_info();
                  }, 10000);
               } else {
                  //console.log('on done:', vkopt.audl.__load_req_num, data);
                  vkopt.audl.__loading_queue = [];
                  each(data, function (i, info) {

                     info = AudioUtils.asObject(info);
                     if (info.url)
                        info.url = vkopt.audl.decode_url(info.url);

                     vkopt.audl.__full_audio_info_cache[info.fullId] = info;
                     if (info.url)
                        vkopt.audl.load_size_info(info.fullId, info.url);
                  });
                  if (vkopt.audl.__load_queue.length > 0) // если в очереди есть аудио - продолжаем грузить
                     vkopt.audl.load_audio_urls();
               }
            }
         });
         vkopt.audl.__load_req_num++;
      };

      clearTimeout(vkopt.audl.__load_delay); // за короткий промежуток времени аудио могло появиться в разных местах. чуть ждём пока устаканится список.
      vkopt.audl.__load_delay = setTimeout(
         function(){
            load_info();
         },
         vkopt.audl.__load_req_num %20 == 0 ? 3500 : 350 // попытка избежать тетекта однотипных действий
      );
   },
   load_all: function(callback){ // пока не используется. добавлено чтоб не забыть о таком способе получения ссылок (в новом вк нет упоминаний об этом методе).
      var query = {
         act : 'load_audios_silent',
         id : (cur.allAudiosIndex == 'all' ? cur.id : cur.audioFriend),
         gid : cur.gid,
         claim : nav.objLoc.claim,  // Для silent-подгрузки похоже не работает ни на старой, ни на новой версии вк.
                                    // На старой версии по URL https://vk.com/audio?claim=1 показываются только те заблоченные, что попадают в видимый без подгрузки список.
         please_dont_ddos : 2
      };
      if (cur.club)
         query.club = cur.club;

      ajax.post('/al_audio.php', query, {
         onDone : (function (data, opts) {
            callback(data)
         })
      });
   }
}

vkopt['hls'] = {
   css: function(){
      return vk_lib.get_block_comments(function(){
      /*css:
         .vk_grab_progress {
             height: 3px;
             background: #6b96cf;
             position: absolute;
             bottom: 0px;
             width: 50%;
         }

         .vk_grab_progress:before {
             content: attr(data-progress)'%';
             position: absolute;
             right: 0px;
             font-size: 10px;
             margin-top: -5px;
             background: #6b96cf;
             padding: 1px 4px;
             color: #FFF;
             font-weight: bold;
             border-radius: 4px;
         }
      */
      }).css
   },
   grab: function(m3u8, opts){
      var
         onSegmentReady = opts.onSegmentReady || null,
         onDone = opts.onDone || null,
         onProgress = opts.onProgress || null;

      var url_create = window.URL.createObjectURL;
      var url_revoke = window.URL.revokeObjectURL;
      window.URL.createGrabObjectURL = function(ms) {
         if (ms instanceof MediaGrabSource){
            vkopt.log('coURL ', ms);
            ms.emit('sourceopen'); //new
            return 'test://';
         } else
            return url_create(ms);
      };
      window.URL.revokeGrabObjectURL = function(ms) {
         if (ms instanceof MediaGrabSource){
            vkopt.log('roURL ', ms);
            return true;
         } else
            return url_revoke(ms);
      };

      function HTML5MediaElement(){}
      HTML5MediaElement.prototype = Object.create(EventEmitter.prototype)
      var mel = new HTML5MediaElement();
      extend(mel,{
         addEventListener: mel.addListener,
         pause: function() {
            vkopt.log('Paused');
            mel.emit('pause');
            mel.emit('play');
            return false;
         },
         preload: 'auto',
         buffered: {},
         duration: 1,
         seeking: false,
         height: 1080,
         width: 1920,
         loop: false,
         played: {},
         removeAttribute: function(attr){},
         load: function(l){vkopt.log('Load:',this)},
         canPlayType: function(codec){vkopt.log('Got asked about:'+codec); return 'probably'},
         nodeName: 'audio',
         playbackQuality: {},
         getVideoPlaybackQuality: function() {return mel.playbackQuality},
         addTextTrack: function(tt){vkopt.log('Adding textTrack ',tt); return [{}]},
         textTracks: {
            addEventListener: function(e,cb) {
               vkopt.log('** Adding eventListener: '+e);
            }
         }
      })

      function SourceGrabBuffer(mimetype){
            EventEmitter.call(this);
            this._mimetype = mimetype;
            return this;
      }
      SourceGrabBuffer.prototype =  Object.create(EventEmitter.prototype);
      var sgb = SourceGrabBuffer.prototype;
      sgb.addEventListener = function(eventName, callback) {
         this.addListener(eventName, callback);
         //vkopt.log('sgb addEventListener '+eventName);
      }
      sgb.appendBuffer = function(data) {
         //vkopt.log('append: ', data.length, 'bytes ', this._mimetype);
         var that = this;
         onSegmentReady && onSegmentReady(data, this._mimetype);
         setTimeout(function(){
            that.emit('onupdateend');
            that.emit('updateend');
         },5);
      }
      Object.defineProperty(sgb, "buffered", {
          get: function buffered() {
               return [];
          }
      });
      Object.defineProperty(sgb, "mode", {
          get: function mode() {
               return '';
          }
      });
      SourceGrabBuffer.prototype.constructor = SourceGrabBuffer;

      function MediaGrabSource(){
         EventEmitter.call(this);
         this.readyState = 'closed';
         this._sb = {};
         return this;
      }
      MediaGrabSource.prototype =  Object.create(EventEmitter.prototype);
      var mgs = MediaGrabSource.prototype;
      extend(mgs,{
         addEventListener: function(eventName,callback) {
            //vkopt.log('MediaGrabSource addEventListener: '+eventName);
            this.addListener(eventName,callback);
            this.readyState = 'open';
            //vkopt.log(Object.keys(this._sb).length);
            if (eventName == 'sourceopen') {
               vkopt.log('Fired: '+eventName);
               //this.emit(eventName,this);
            }
         },
         removeEventListener: function(eventName,b) {
            this.removeListener(eventName,b);
         },
         addSourceBuffer: function(mimetype) {
            vkopt.log('MediaGrabSource new buffer for '+mimetype);
            var nb = new SourceGrabBuffer(mimetype);
            this._sb[mimetype] = nb;
            return nb;
         },
         endOfStream: function(error) {
            vkopt.log('** End of stream: '+error);
            mel.emit('ended');
            // onDone();
         },
         isTypeSupported: function(codec){return true}
      });
      Object.defineProperty(mgs, "sourceBuffers", {
          get: function sourceBuffers() {
               var a = [];
               for (var sb in this._sb) {
                  a.push(this._sb[sb]);
               }
               return a;
          }
      });
      MediaGrabSource.isTypeSupported = function(codec){return true}

      var get_module=function(js){
         var exports = {};
          eval(js);
          return exports;
      }
      var modify_hls = function(js){
         js = js.replace(/window\.MediaSource/g,'MediaGrabSource')
                .replace(/window\.SourceBuffer/g,'SourceGrabBuffer')
                .replace(/\.createObjectURL/g,'.createGrabObjectURL')
                .replace(/\.revokeObjectURL/g,'.revokeGrabObjectURL');
         return js;
      }

      var Hls = {};

      function downloadHls(url) {
         var
            startSN = 0,
            endSN = 0;

         var hls = new Hls({debug:false,autoStartLoad:true});
         hls.on(Hls.Events.MEDIA_ATTACHED, function () {
            vkopt.log("hls.js attached to grabber");
            hls.loadSource(url);
         });

         hls.on(Hls.Events.BUFFER_EOS,function(event_name, info){
            vkopt.log('GRABBER DONE: ',Hls.Events.FRAG_LOADED);
            onDone && onDone();

         });

         hls.on(Hls.Events.FRAG_LOADED,function(event_name, info){
            if (info && info.frag && info.frag.sn)
               setTimeout(function(){
                  onProgress && onProgress(info.frag.sn - startSN, endSN - startSN);
               },30);
         });

         hls.on(Hls.Events.MANIFEST_PARSED,function(n,m) {
            vkopt.log('manifest_parsed', m);
            startSN = m.levels[0].details.startSN
            endSN = m.levels[0].details.endSN
            mel.paused = false;
            mel.currentTime = 0;
            mel.emit('pause');
            mel.emit('playing');
         });
         hls.attachMedia(mel);
      }

      AjGet('/js/lib/hls.min.js', function(js){
         Hls = get_module(modify_hls(js)).Hls;
         downloadHls(m3u8);
      });
   },
   download: function(url, file_name, aid){
      var buff = {
         type: '',
         data:[]
      };

      var draw_progress = function(percent, aid){
         //vkopt.log(percent,'%');
         var els = geByClass('_audio_row_'+aid);
         for (var i = 0; i < els.length; i++){
            var bar = geByClass1('vk_grab_progress', els[i]);
            if (!bar){
               bar = se('<div class="vk_grab_progress"></div>');
               els[i].insertBefore(bar, els[i].firstChild);
            }
            show(bar);
            bar.dataset['progress'] = percent;
            bar.style.width = percent+'%';
         }
      };
      var hide_progress = function(aid){
         var els = geByClass('_audio_row_'+aid);
         for (var i = 0; i < els.length; i++){
            var bar = geByClass1('vk_grab_progress', els[i]);
            bar && re(bar);
         }
      };
      vkopt.hls.grab(url, {
         onSegmentReady: function(data, type){
            buff.type = type;
            buff.data.push(data);
         },
         onDone: function(){
            setTimeout(function(){
               hide_progress(aid);
            },500);
            var url_create = (window.URL || window.webkitURL || window.mozURL || window).createObjectURL;

            var data = new Blob(buff.data,{type:buff.type});
            var url = url_create(data)

            var dlnk = document.createElement('a');
            dlnk.href = url;
            dlnk.download = file_name;
            (window.utilsNode || document.body).appendChild(dlnk)
            dlnk.click();
            setTimeout(function(){
               re(dlnk);
               //url_revoke(url);
            },200);
         },
         onProgress: function(cur, total){
            if (total == 0) return;
            var pc = Math.round(cur/total*100);
            draw_progress(pc, aid);
         }
      });
   }

}

vkopt['videoview'] = {
   onSettings:{
      Media:{
         vid_dl: {
            title: 'seLinkVi'
         }
      }
   },
   css: function(){
      return vk_lib.get_block_comments(function(){
      /*css:
      .vk_mv_down_icon {
         background: url(/images/icons/video_icon.png?3) no-repeat;
         background-position: 0 -52px;
         height: 19px;
         width: 20px;
         transform: rotate(90deg);
      }
      .vk_mv_down_links_tt {
         background: rgba(0,0,0,0.6);
         border: 1px solid rgba(255,255,255,0.4);
      }

      .vk_mv_down_links_tt.eltt.eltt_bottom:before {
         border-bottom-color: transparent;
      }
      .vk_mv_down_links_tt.eltt.eltt_bottom:after {
         border-bottom-color: rgba(255, 255, 255, 0.4);
         margin-bottom: 1px;
      }
      .vk_mv_down_links_tt.eltt.eltt_bottom .eltt_arrow{
         border-bottom-color: #000;
      }
      .vk_mv_down_links_tt a {
         display: block;
         padding: 3px 10px;
         color: #FFF;
         white-space: nowrap;
      }
      .vk_mv_down_links_tt a.size_loaded{
         padding-right: 80px;
      }
      .vk_mv_down_links_tt a .vk_vid_size_info.progress_inv_mini{
         position: absolute;
         margin-top: 6px;
         right: 3px;
      }
      .vk_mv_down_links_tt a.size_loaded .vk_vid_size_info{
         position: absolute;
         right: 10px;
      }
      #mv_top_controls{
         z-index: 1000;
      }
      .vk_vid_size_info b{
         color: #FFF;
         padding-left: 10px;
      }
      */
      }).css
   },
   onInit: function(){
      vkopt.videoview.tpls = vk_lib.get_block_comments(function(){
         /*dl_btn:
         <div class="mv_top_button" id="vk_mv_down_icon" role="button" tabindex="0" aria-label="{lng.ToggleLinksView}">
         <div class="vk_mv_down_icon"></div>
         </div>
         */
         /*dl_link:
         <a href="{vals.url}" download="{vals.name}" onclick="return vkopt.videoview.download_file(this)" onmouseover="vkopt.videoview.get_size(this)">{vals.caption}<span class="vk_vid_size_info"></span></a>
         */
         /*ext_link:
         <a class="vk_vid_external_view" href="{vals.url}">{vals.source_name}</a>
         */
      });
   },
   onLibFiles: function(fn){
      if (fn == 'videoview.js'){
        Inj.Start('Videoview.showVideo', function(){
           vkopt.videoview.on_show(arguments);
        });
      }
   },
   /*
   onResponseAnswer: function(answer, url, q){
      // запихиваем свой обработчик в момент получения данных о видео.
      if (url == '/al_video.php' && q.act == 'show'){
         vkopt.videoview.check_show_args(answer);
      }
   },
   */
   _cur_mv_data: null,
   update_dl_btn: function(html){
     re('vk_mv_down_icon'); // убиваем кнопку, т.к не выходит убить тултип таким образом: data(ge('vk_mv_down_icon'), 'ett').destroy();
     if (!html)
        return null;
      if (!ge('vk_mv_down_icon') && ge('mv_top_controls')){
         var btn = se(vk_lib.tpl_process(vkopt.videoview.tpls['dl_btn'], {}));
         ge('mv_top_controls').appendChild(btn);
      }
      // создаём новое тултип-меню
      vkopt.videoview._links_tt = new ElementTooltip(btn,{
                 cls: "vk_mv_down_links_tt",
                 forceSide: "bottom",
                 elClassWhenTooltip: "vk_mv_down_links_shown",
                 content: html,
                 offset: [-3, 0],
                 setPos: function(){
                    return  {
                     left: 0,
                     top: 36,
                     arrowPosition: 21
                    }
                 }
      });
   },
   get_vars: function(opt, video_id){
      var vars = null;
      if (opt && opt.player){
         var params_arr = opt.player.params;
         if (params_arr){
            vars = {};
            var full_vid = function(vars){
               return vars.oid+'_'+vars.vid
            };
            if (params_arr.length > 0 && full_vid(vars) != video_id){ //mvcur.videoRaw
               vkopt.log('wrong video data. search other...');
               for (var i = 0; i < params_arr.length; i++){
                  if (full_vid(params_arr[i]) == video_id){ // нашли данные о нужном видео
                     vars = params_arr[i];
                     break;
                  }
               }
            }

         }
      }
      return vars;
   },
   check_show_args: function(args){
      //args = [videoRaw, title, html, js, desc, serviceBtns, opt]
      var videoRaw = args[0],
          js = args[3],
          opt = args[5],
          rx = /(var\s*isInline)/;
      if (opt && opt.player){// новый формат ответа, JSON с данными о плеере находится в 6-ом аргументе.
         var vars = vkopt.videoview.get_vars(opt,videoRaw);
         vkopt.videoview.on_player_data(vars);
      }
      else if (js && rx.test(args[3])){ // старый формат ответа, vars находится в третьем аргументе.
         //vkopt.log('video data:', args[3]);
         args[3] = js.replace(rx, '\n   vkopt.videoview.on_player_data(vars);\n $1');
      } else
         vkopt.videoview.on_player_data(null);
   },
   on_show: function(args){
      vkopt.log('vkopt.videoview.on_show', args);
      vkopt.videoview.check_show_args(args);
   },
   download_file: function(el){
     var result = vkopt.permissions.check_dl_url(el, el.href);
     if (result) result = vkDownloadFile(el);
     return result;
   },
   on_player_data: function(vars){
      vkopt.log('Video data:', vars, mvcur.mvData.videoRaw);
      if (!vkopt.settings.get('vid_dl')) return;
      vkopt.videoview._cur_mv_data = vars;
      vkopt.videoview.update_dl_btn();
      if (!vars || !vars.md_title || (vars.extra && !vars.hls && !vars.postlive_mp4)){
         setTimeout(function(){
            var p, ifr;
            p = ge('mv_player_box');
            p && (ifr = geByTag1('iframe', p));
            if (ifr)
               vkopt.videoview.on_iframe_player(ifr.src)
            else
               vkopt.videoview.on_iframe_player(vars)
         }, 300);
         return; // нет данных - выходим.
      }

      var links = vkopt.videoview.get_video_links(vars);
      var filename = vkCleanFileName(unclean(vars.md_title));
      var html = '';
      for (var i = 0; i < links.length; i++){
         html += vk_lib.tpl_process(vkopt.videoview.tpls['dl_link'], {
            url: links[i].url + (links[i].ext ? '#FILENAME/' + vkEncodeFileName(filename + '_' + links[i].quality) + links[i].ext : ''),
            name: filename + '_' + links[i].quality + links[i].ext,
            caption: links[i].quality
         })
      }

      vkopt.videoview.update_dl_btn(html);
   },
   get_ext_links: function(url, title, cb){
      vkopt.log('External player:', url);
      if (isString(url)) {
         if (url.indexOf('ivi.ru') > -1){
            vkopt.videoview.get_ivi_links(url, function(links, vid){
                  var html = '';
                  var filename = vkCleanFileName(title);
                  html += vk_lib.tpl_process(vkopt.videoview.tpls['ext_link'], {
                     url: 'http://www.ivi.ru/watch/' + vid,
                     source_name:'ivi.ru'
                  });

                  for (var i = 0; i < links.length; i++){
                     html += vk_lib.tpl_process(vkopt.videoview.tpls['dl_link'], {
                        url: links[i].url,
                        name: filename + '_' + links[i].quality + '.mp4',
                        caption: links[i].quality
                     })
                  }
                  cb && cb(html, links);
            })
         } else
         if (url.indexOf('youtube.com') > -1){
            vkopt.videoview.yt.get_links(url, function(links, vid){
                  var html = '';
                  var filename = vkCleanFileName(title);
                  html += vk_lib.tpl_process(vkopt.videoview.tpls['ext_link'], {
                     url: 'http://youtube.com/watch?v=' + vid,
                     source_name: 'YouTube'
                  });
                  for (var i = 0; i < links.length; i++){
                     html += vk_lib.tpl_process(vkopt.videoview.tpls['dl_link'], {
                        url: links[i].url,
                        name: filename + '_' + links[i].quality + '.mp4',
                        caption: links[i].quality
                     })
                  }
                  cb && cb(html, links);
            })
         } else
            cb && cb('', []);
      } else
         cb && cb('', []);
   },
   on_iframe_player: function(url){
      vkopt.videoview.get_ext_links(url, unclean(mvcur.mvData.title), function(html, link){
         vkopt.videoview.update_dl_btn(html);
      });
   },
   get_size: function(el){
      if (!el || !el.href || hasClass(el,'size_loaded') || /\.m3u8/.test(el.href)) return;
      var WAIT_TIME = 4000;
      var szel = geByTag1('span', el);

      var set_size_info = function(size){
         removeClass(szel,'progress_inv_mini');
         if (size != null)
            szel.innerHTML = vkFileSize(size, 1).replace(/([\d\.]+)/,'<b>$1</b>');
         if (size > 500)
            addClass(el, 'size_loaded');
      }
      szel.innerHTML = '';
      addClass(szel,'progress_inv_mini');
      var reset=setTimeout(function(){
         set_size_info(null);
      }, WAIT_TIME);

      XFR.post(el.href, {}, function(h, size){
         clearTimeout(reset);
         if (size > 0){
            set_size_info(size);
         } else {
            // TODO: видать ссылка протухла. нужно подгрузить актуальный URL и снова запросить размер
         }
      }, true);
   },
   get_video_url: function(vars, q) {
      return vars.live_mp4 ? vars.live_mp4 : vars.extra_data ? vars.extra_data : vars["cache" + q] || vars["url" + q]
   },
   get_video_links: function(vars){
      var list = [];

      // 'ffmpeg -i "'+vars.hls+'" -c copy video.ts'
      if (vars.hls)
         list.push({url: vars.hls, quality: 'hls', ext: '.m3u8'});

      //if (vars.hls_raw)
      //   list.push({text: vars.hls_raw, quality: 'hls_raw', ext: '.m3u8'});

      if (vars.postlive_mp4)
         list.push({url: vars.postlive_mp4, quality: 'mp4', ext: '.mp4'});

      if (vars.live_mp4)
         list.push({url: vars.live_mp4, quality: 'live_mp4', ext: '.mp4'});

      if (vars.extra_data && (vars.extra_data != (vars.author_id+'_'+vars.vid)))
         list.push({url: vars.extra_data, quality: 'extra'});

      var q = [240, 360, 480, 720, 1080];
      for (var i = 0; i <= vars.hd; i++){
         var qname = q[i] || 0;
         vars["url" + qname] && list.push({url: vars["url" + qname], quality: qname+'p', ext: '.mp4'});
         vars["cache" + qname] &&  list.push({url: vars["cache" + qname], quality: qname+'p_alt', ext: '.mp4'})
      }
      return list;
   },
   yt: {
      decode_data : function (qa) { // декодирование URL-encoded объектов
      	if (!qa)
      		return {};
      	var exclude = {
      		'url' : 1,
      		'type' : 1,
      		'ttsurl' : 1
      	};
      	var query = {},
      	dec = function (str) {
      		try {
      			return decodeURIComponent(str);
      		} catch (e) {
      			return str;
      		}
      	};
      	qa = qa.split('&');
      	for (var i = 0; i < qa.length; i++) {
      		var a = qa[i];
      		var t = a.split('=');
      		if (t[0]) {
      			var key = dec(t[0]);
      			var v = exclude[key] ? [dec(t[1] + '')] : dec(t[1] + '').split(',');
      			query[key] = [];
      			for (var j = 0; j < v.length; j++) {
      				if (v[j].indexOf('&') != -1 && v[j].indexOf('=') != -1 && !exclude[key])
      					v[j] = vkopt.videoview.yt.decode_data(v[j]);
      				query[key].push(v[j]);
      			}
      			if (query[key].length == 1)
      				query[key] = query[key][0];
      		}
      	}
      	return query;
      },
      video_itag_formats: { //YouTube formats list
         '0': '240p.flv',
         '5': '240p.flv',
         '6': '360p.flv',
         '34': '360p.flv',
         '35': '480p.flv',

         '13': '144p.3gp (small)',
         '17': '144p.3gp (medium)',
         '36': '240p.3gp',

         '160': '240p.mp4 (no audio)',
         '18': '360p.mp4',
         '135': '480p.mp4 (no audio)',
         '22': '720p.mp4',
         '37': '1080p.mp4',
         '137': '1080p.mp4 (no audio)',
         '38': '4k.mp4',
         '82': '360p.mp4',//3d?
         //'83': '480p.mp4',//3d?
         '84': '720p.mp4',//3d?
         //'85': '1080p.mp4',//3d?

         '242': '240p.WebM (no audio)',
         '43': '360p.WebM',
         '44': '480p.WebM',
         '244': '480p.WebM (low, no audio)',
         '45': '720p.WebM',
         '247': '720p.WebM (no audio)',
         '46': '1080p.WebM',
         '248': '1080p.WebM (no audio)',
         '100':'360p.WebM',//3d?
         //'101':'480p.WebM',//3d?
         '102':'720p.WebM',//3d?
         //'103':'1080p.WebM',//3d?

         '139': '48kbs.aac',
         '140': '128kbs.aac',
         '141': '256kbs.aac',

         '171': '128kbs.ogg',
         '172': '172kbs.ogg'
      },
      get_links : function (url, callback) {
      	var vid = String(url).split('?')[0].split('/').pop();
      	var req_url = (vk_ext_api.ready ? 'http:' : location.protocol) + '//www.youtube.com/get_video_info?video_id=' + vid;

      	XFR.post(req_url, {}, function (t) {
            /*
            var decode_s = function (a) {
               var mod = {
                  del_left : function (a, b) {
                     a.splice(0, b)
                  },
                  calc : function (a, b) {
                     var c = a[0];
                     a[0] = a[b % a.length];
                     a[b] = c
                  },
                  reverse : function (a) {
                     a.reverse()
                  }
               };
               a = a.split("");
               mod.calc(a, 19);
               mod.reverse(a);
               mod.del_left(a, 1);
               mod.reverse(a);
               mod.del_left(a, 1);
               mod.calc(a, 7);
               mod.reverse(a);
               mod.calc(a, 38);
               mod.del_left(a, 3);
               return a.join("")
            };
            */
            var obj = vkopt.videoview.yt.decode_data(t);
            vkopt.log('YT raw data:', obj);
      		var map = (obj.fmt_url_map || obj.url_encoded_fmt_stream_map  || obj.adaptive_fmts);
      		if (!map) {
      			callback([], vid);
      			return;
      		}
      		var links = [];
      		for (var i = 0; i < map.length; i++) {

               if (!map[i].sig && map[i].s)
                  continue; //map[i].sig = decode_s(map[i].s);

      			var format = vkopt.videoview.yt.video_itag_formats[map[i].itag];
      			var info = (map[i].type + '').split(';')[0] + ' ' + (obj.fmt_list[i] + '').split('/')[1];
      			if (!format)
      				vkopt.log('YT ' + map[i].itag + ': \n' + (map[i].stereo3d ? '3D/' : '') + info, 1);
      			format = (map[i].stereo3d ? '3D/' : '') + (format || info);
      			obj.title = isArray(obj.title) ? obj.title.join('') : obj.title;
      			var url = map[i].url;
               if (url.indexOf('&signature=') == -1 && map[i].sig)
                  url += '&signature=' + map[i].sig;
               url += '&quality=' + map[i].quality + (obj.title ? '&title=' + encodeURIComponent(obj.title.replace(/\+/g, ' ')) : '');
               links.push({
      				url : url,
      				quality : format,
      				info : info
      			});
               // adaptive_fmts
      		}
      		callback(links, vid);
      	});
      }
   },
   get_ivi_links:function(url,callback){
      var vid = isNumeric(url) ? url : (url.match(/(?:videoId|id)=(\d+)/) || [])[1];
      if (!vid)
         return;
      // 'http://www.ivi.ru/watch/'+vid
      //  https://www.ivi.ru/embeds/video/?id=126872&app_version=340&autostart=1
      var app_ver = 340;
      var rnd=Math.random()*1000000000000;
      var data={
         "method" : "da.content.get",
         "params" : [
            vid,
            {
               "sourceid" : "",
               "utmfullinfo" : "",
               "_domain" : "www.ivi.ru",
               "app_version" : app_ver,
               "_url" : "https://www.ivi.ru/embeds/video/?id="+vid+"&app_version="+app_ver+"&autostart=1",
               "site" : "s132",
               "campaignid" : "",
               "uid" : rnd+""
            }
         ]
      };



      var ondone=function(r) {
         var vars=JSON.parse(r);
         var links=vars.result.files;
         if (!links){
            callback([]);
            return;
         }
         var res=[];
         for (var i=0; i<links.length; i++){
            if (links[i].content_format!='Flash-Access')
               res.push({
                  url: links[i].url,
                  quality: links[i].content_format
               });
         }
         callback(res, vid);
         //console.log(r);
      };
      // old: https://api.digitalaccess.ru/api/json/
      // new: https://api.ivi.ru/light/?r=266.3667255532756&app_version=340
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://api.ivi.ru/light/?r='+Math.random()*1000+'6&app_version='+app_ver, true);
      xhr.onreadystatechange = function(){
         if (xhr.readyState == 4) {
            ondone(xhr.responseText);
         }
      };
      xhr.send(JSON.stringify(data));
   }
};

vkopt['videos'] = {
   css: function(){
      return vk_lib.get_block_comments(function(){
      /*css:
      .video_thumb_actions>div.vk_video_thumb_action_link .icon {
         background-image: url("/images/icons/pv_actions.png");
         background-size: cover;
         background-position: 1px 3px;
      }
      .video_thumb_actions>div.vk_video_thumb_action_link.vk_cant_get_link,
      .video_thumb_actions>div.vk_video_thumb_action_link.vk_cant_get_link:hover {
         opacity:0.2;
         cursor: default;
      }

      .video_thumb_actions>div.vk_video_thumb_action_link {
         display: inline-block;
      }
      .vk_video_thumb_action_link a {
         display: block;
         line-height: 14px;
      }
      .video_thumb_actions>div.vk_video_thumb_action_link:active {
         position: static;
      }
      .video_thumb_actions>div.vk_video_thumb_action_link.vk_links_loading .icon {
          background: url(/images/upload_inv_mini.gif) 50% 50% no-repeat;
      }
      .videoplayer_settings_menu_sublist_item.vk_wg_dl_item{
         justify-content: flex-start;
      }
      #vk_wg_dl_menu{
         width: 160px;
      }
      .videoplayer_settings_menu_list_icon.vk_wg_dl_icon {
         width: 18px;
         height: 16px;
         display: inline-block;
         margin-right: 23px;
         vertical-align: top;
         background-image: url(/images/icons/pv_actions.png?3);
         background-position: 0 0px;
      }
      */
      }).css
   },
   onLibFiles: function(fn){
      if (fn == 'video.js'){
         Inj.End('Video.buildVideoEl', function(){
            if (this.result)
               vkopt.videos.processNode(this.result);
         })
      }

      if ((fn == 'videoplayer.js') && window.playerParams)
         setTimeout(vkopt.videos.widget_player, 10);
   },
   onInit: function(){
      vkopt.videos.tpls = vk_lib.get_block_comments(function(){
         /*dl_btn:
         <div class="vk_video_thumb_action_link" onclick="return vkopt.videos.show_links(event, this, '{vals.video}','{vals.list=}');">
            <div class="icon"></div>
         </div>
         */
         /*wg_show_dl:
         <div class="videoplayer_settings_menu_list_item" role="menuitemradio" tabindex="0" onclick="toggle('vk_wg_dl_menu')">
            <div class="videoplayer_settings_menu_list_icon vk_wg_dl_icon"></div>
            <div class="videoplayer_settings_menu_list_title">{lng.download}</div>
         </div>
         */
         /*wg_sub_menu:
         <div class="videoplayer_settings_menu_sublist" id="vk_wg_dl_menu" style="display:none">
            <div class="videoplayer_settings_menu_sublist_header" onclick="hide('vk_wg_dl_menu')">{lng.download}</div>
            <div class="videoplayer_settings_menu_sublist_divider"></div>
            <div class="videoplayer_settings_menu_sublist_items">
               {vals.content}
            </div>
         </div>
         */
         /*wg_dl_item:
         <a class="videoplayer_settings_menu_sublist_item vk_wg_dl_item" role="menuitemradio" tabindex="0" href="{vals.url}" download="{vals.name}" onclick="return vkopt.videoview.download_file(this)" onmouseover="vkopt.videoview.get_size(this)">
            {vals.caption}
            <span class="vk_vid_size_info"></span>
         </a>
         */
      });
   },
   processNode: function(node, params){
      if (!vkopt.settings.get('vid_dl')) return;
      if (!node) return;
      var nodes = geByClass('video_thumb_actions',node);
      for (var i = 0; i < nodes.length; i++){
         var acts = nodes[i];
         if (geByClass1('vk_video_thumb_action_link', acts))
            continue;

         var vid_el = gpeByClass('video_item', acts);
         if (!vid_el)
            continue;

         var a = (geByTag1('a',vid_el) || {}).href || '';
         var ids = a.match(/video(-?\d+_\d+)(?:\?list=([a-f0-9]+))?/);
         if (!ids)
            continue;


         acts.appendChild(
            se(
               vk_lib.tpl_process(vkopt.videos.tpls['dl_btn'], {
                  video: ids[1],
                  list: ids[2] || ''
               })
            )
         );
      }
   },
   widget_player: function(){
      if (!vkopt.settings.get('vid_dl')) return;
      var
         vars = vkopt.videoview.get_vars({player:playerParams},nav.objLoc.oid+'_'+nav.objLoc.id),
         menu = geByClass1('videoplayer_settings_menu_list');
      if (!vars || !menu) return;


      var links = vkopt.videoview.get_video_links(vars);
      var filename = vkCleanFileName(unclean(vars.md_title));
      var html = '';
      for (var i = 0; i < links.length; i++){
         html += vk_lib.tpl_process(vkopt.videos.tpls['wg_dl_item'], {
            url: links[i].url + (links[i].ext ? '#FILENAME/' + vkEncodeFileName(filename + '_' + links[i].quality) + links[i].ext : ''),
            name: filename + '_' + links[i].quality + links[i].ext,
            caption: links[i].quality
         })
      }

      var dl_menu = se(
         vk_lib.tpl_process(vkopt.videos.tpls['wg_sub_menu'], {
            content: html
         })
      );
      menu.parentNode.appendChild(dl_menu);
      menu.insertBefore(se(vk_lib.tpl_process(vkopt.videos.tpls['wg_show_dl'],{})),menu.firstChild)

   },
   show_links: function(ev, el, video, list){
      cancelEvent(ev);
      if (hasClass(el,'vk_links_loading') || hasClass(el,'vk_links_loaded'))
         return false;
      addClass(el,'vk_links_loading');

      var on_links_ready = function(html, links){
         if (links.length){
            removeClass(el,'vk_links_loading');
            addClass(el,'vk_links_loaded');
            el.dl_ett = new ElementTooltip(el,{
               cls: "vk_mv_down_links_tt",
               forceSide: "bottom",
               elClassWhenTooltip: "vk_mv_down_links_shown",
               content: html,
               offset: [-3, 0],
               setPos: function(){
                  return  {
                     left: 33,
                     top: 34,
                     arrowPosition: 21
                  }
               }
            });
            el.dl_ett.show();
         }
      }
      var failed = function(){
         addClass(el, 'vk_cant_get_link')
      }

      ajax.post('al_video.php', {act: "show", list: list, video: video}, {
         onDone: function(title, vid_box, js, html, data){
            if (vid_box && /<iframe/i.test(vid_box)){
               var ifr, p = se(vid_box);
               p && (ifr = geByTag1('iframe', p));
               if (ifr && ifr.src){
                   vkopt.videoview.get_ext_links(ifr.src, unclean(title), function(html, links){
                     if (links.length)
                        on_links_ready(html, links);
                     else
                        failed();
                  });
               } else
                  failed();
            } else {
               var vars = vkopt.videoview.get_vars(data, video);
               if (!vars) return failed();
               var links = vkopt.videoview.get_video_links(vars);
               var filename = vkCleanFileName(unclean(vars.md_title));
               var html = '';
               for (var i = 0; i < links.length; i++){
                  html += vk_lib.tpl_process(vkopt.videoview.tpls['dl_link'], {
                     url: links[i].url + (links[i].ext ? '#FILENAME/' + vkEncodeFileName(filename + '_' + links[i].quality) + links[i].ext : ''),
                     name: filename + '_' + links[i].quality + links[i].ext,
                     caption: links[i].quality
                  })
               }
               on_links_ready(html, links);
            }


            //vkMsg(html, 5000);
            //vkopt.log('MV_DATA:', data);
         }
      })
      return false;
   }
}

if (window.vkopt_core_ready){
   vkopt_core.plugins.delayed_run('audl');
   vkopt_core.plugins.delayed_run('hls');
   vkopt_core.plugins.delayed_run('videoview');
   vkopt_core.plugins.delayed_run('videos');
}