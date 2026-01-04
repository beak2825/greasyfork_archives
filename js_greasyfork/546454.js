// ==UserScript==
// @name         Image to Pixel By Agents_K OWOP only [Translated into 31 languages]
// @namespace    owop-autopixel
// @version      3.2.0
// @description  OWOP: place image pixels automatically with 2-pass verify. Draggable UI. Full translations for a wide language list. Language menu paginated (13/page).
// @match        *://ourworldofpixels.com/*
// @match        *://*.ourworldofpixels.com/*
// @run-at       document-idle
// @grant        none
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546454/Image%20to%20Pixel%20By%20Agents_K%20OWOP%20only%20%5BTranslated%20into%2031%20languages%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/546454/Image%20to%20Pixel%20By%20Agents_K%20OWOP%20only%20%5BTranslated%20into%2031%20languages%5D.meta.js
// ==/UserScript==

(function () {
  'use strict';
  if (window.top !== window.self) return;

  const IS_OWOP = /(^|\.)ourworldofpixels\.com$/i.test(location.hostname);
  if (!IS_OWOP) return;
  console.log('[AutoPixel] v3.2.0 → OWOP');

  /* ---------------- I18N (full translations) ---------------- */
  // NOTE: Title kept as a product name in English across languages.
  const I18N = {
    fr:{lang_label:'Langage',back:'Retour',title:'Image to Pixel By Agents_K',local_image:'Image locale',x_world:'X (monde)',y_world:'Y (monde)',take_xy:'Prendre X/Y depuis la souris',scale_label:'Échelle de l’image (%)',scale_info:(p,w,h)=>`Échelle : ${p}% • Taille posée : ${w}×${h}`,block_label:'Taille du bloc (px)',block_info:n=>`Bloc : ${n}×${n} (${n*n} px)`,rate_label:'Débit (pixels / seconde)',rate_info:r=>`Débit : ${r} px/s`,start:'Démarrer',stop:'Arrêter',reset:'Réinitialiser progression',waiting_img:'En attente d’une image…',loading_img:'Chargement image…',loaded_img:(w,h)=>`Image ${w}×${h} chargée. Ajustez échelle/bloc/taux, mettez X/Y, puis Démarrer.`,owop_not_ready_mouse:'OWOP pas prêt. Attendez que la carte soit chargée.',need_image_first:'Chargez d’abord une image.',owop_timeout:'OWOP n’est pas prêt (timeout). Rechargez la page.',started_pass1:'Démarré (passe 1/2)…',verifying_pass2:'Vérification (passe 2/2)…',stopped:'Arrêté.',progress_reset:'Progression réinitialisée.',status_scan:(pass,qlen,prog)=>`${pass} • file : ${qlen} • scan : ${prog}%`,pass12:'Passe 1/2',pass22:'Passe 2/2',done:'Terminé ✅',failed_load:'Échec du chargement de l’image (voir console).'},
    en:{lang_label:'Language',back:'Back',title:'Image to Pixel By Agents_K',local_image:'Local image',x_world:'X (world)',y_world:'Y (world)',take_xy:'Take X/Y from mouse',scale_label:'Image scale (%)',scale_info:(p,w,h)=>`Scale: ${p}% • Placed size: ${w}×${h}`,block_label:'Block size (px)',block_info:n=>`Block: ${n}×${n} (${n*n} px)`,rate_label:'Rate (pixels per second)',rate_info:r=>`Rate: ${r} px/s`,start:'Start',stop:'Stop',reset:'Reset progress',waiting_img:'Waiting for an image…',loading_img:'Loading image…',loaded_img:(w,h)=>`Image ${w}×${h} loaded. Adjust scale/block/rate, set X/Y, then Start.`,owop_not_ready_mouse:'OWOP not ready. Wait for the map to load.',need_image_first:'Please load an image first.',owop_timeout:'OWOP not ready (timeout). Reload the page.',started_pass1:'Started (pass 1/2)…',verifying_pass2:'Verifying (pass 2/2)…',stopped:'Stopped.',progress_reset:'Progress reset.',status_scan:(pass,qlen,prog)=>`${pass} • queue: ${qlen} • scan: ${prog}%`,pass12:'Pass 1/2',pass22:'Pass 2/2',done:'Done ✅',failed_load:'Failed to load image (see console).'},
    zh:{lang_label:'语言',back:'返回',title:'Image to Pixel By Agents_K',local_image:'本地图像',x_world:'X（世界）',y_world:'Y（世界）',take_xy:'从鼠标获取 X/Y',scale_label:'图像缩放 (%)',scale_info:(p,w,h)=>`比例：${p}% • 放置尺寸：${w}×${h}`,block_label:'块大小 (px)',block_info:n=>`块：${n}×${n}（${n*n} 像素）`,rate_label:'速率（像素/秒）',rate_info:r=>`速率：${r} 像素/秒`,start:'开始',stop:'停止',reset:'重置进度',waiting_img:'正在等待图像…',loading_img:'正在加载图像…',loaded_img:(w,h)=>`图像 ${w}×${h} 已加载。调整比例/块/速率，设置 X/Y，然后开始。`,owop_not_ready_mouse:'OWOP 尚未就绪。请等待地图加载。',need_image_first:'请先加载图像。',owop_timeout:'OWOP 未就绪（超时）。请刷新页面。',started_pass1:'已开始（第 1/2 步）…',verifying_pass2:'正在验证（第 2/2 步）…',stopped:'已停止。',progress_reset:'进度已重置。',status_scan:(pass,qlen,prog)=>`${pass} • 队列：${qlen} • 扫描：${prog}%`,pass12:'第 1/2 步',pass22:'第 2/2 步',done:'完成 ✅',failed_load:'图像加载失败（见控制台）。'},
    hi:{lang_label:'भाषा',back:'वापस',title:'Image to Pixel By Agents_K',local_image:'स्थानीय छवि',x_world:'X (विश्व)',y_world:'Y (विश्व)',take_xy:'माउस से X/Y लें',scale_label:'छवि स्केल (%)',scale_info:(p,w,h)=>`पैमाना: ${p}% • रखा आकार: ${w}×${h}`,block_label:'ब्लॉक आकार (px)',block_info:n=>`ब्लॉक: ${n}×${n} (${n*n} px)`,rate_label:'दर (पिक्सल/सेकंड)',rate_info:r=>`दर: ${r} px/s`,start:'शुरू करें',stop:'रोकें',reset:'प्रगति रीसेट',waiting_img:'छवि की प्रतीक्षा…',loading_img:'छवि लोड हो रही है…',loaded_img:(w,h)=>`छवि ${w}×${h} लोड। स्केल/ब्लॉक/दर समायोजित करें, X/Y सेट करें, फिर शुरू करें।`,owop_not_ready_mouse:'OWOP तैयार नहीं है। मानचित्र लोड होने दें।',need_image_first:'पहले छवि लोड करें।',owop_timeout:'OWOP तैयार नहीं (टाइमआउट)। पेज रीलोड करें।',started_pass1:'शुरू (पास 1/2)…',verifying_pass2:'जाँच (पास 2/2)…',stopped:'रुका।',progress_reset:'प्रगति रीसेट।',status_scan:(pass,qlen,prog)=>`${pass} • कतार: ${qlen} • स्कैन: ${prog}%`,pass12:'पास 1/2',pass22:'पास 2/2',done:'पूर्ण ✅',failed_load:'छवि लोड विफल (कंसोल देखें)।'},
    es:{lang_label:'Idioma',back:'Volver',title:'Image to Pixel By Agents_K',local_image:'Imagen local',x_world:'X (mundo)',y_world:'Y (mundo)',take_xy:'Tomar X/Y del ratón',scale_label:'Escala de imagen (%)',scale_info:(p,w,h)=>`Escala: ${p}% • Tamaño colocado: ${w}×${h}`,block_label:'Tamaño de bloque (px)',block_info:n=>`Bloque: ${n}×${n} (${n*n} px)`,rate_label:'Tasa (píxeles por segundo)',rate_info:r=>`Tasa: ${r} px/s`,start:'Iniciar',stop:'Detener',reset:'Reiniciar progreso',waiting_img:'Esperando una imagen…',loading_img:'Cargando imagen…',loaded_img:(w,h)=>`Imagen ${w}×${h} cargada. Ajusta escala/bloque/tasa, establece X/Y y pulsa Iniciar.`,owop_not_ready_mouse:'OWOP no está listo. Espera a que cargue el mapa.',need_image_first:'Primero carga una imagen.',owop_timeout:'OWOP no está listo (timeout). Recarga la página.',started_pass1:'Iniciado (paso 1/2)…',verifying_pass2:'Verificando (paso 2/2)…',stopped:'Detenido.',progress_reset:'Progreso reiniciado.',status_scan:(pass,qlen,prog)=>`${pass} • cola: ${qlen} • escaneo: ${prog}%`,pass12:'Paso 1/2',pass22:'Paso 2/2',done:'Hecho ✅',failed_load:'Error al cargar la imagen (ver consola).'},
    ar:{lang_label:'اللغة',back:'رجوع',title:'Image to Pixel By Agents_K',local_image:'صورة محلية',x_world:'X (العالم)',y_world:'Y (العالم)',take_xy:'أخذ X/Y من الفأرة',scale_label:'مقياس الصورة (%)',scale_info:(p,w,h)=>`المقياس: ${p}% • الحجم الموضوع: ${w}×${h}`,block_label:'حجم الكتلة (px)',block_info:n=>`كتلة: ${n}×${n} (${n*n} بكسل)`,rate_label:'المعدل (بكسل/ثانية)',rate_info:r=>`المعدل: ${r} بكسل/ث`,start:'بدء',stop:'إيقاف',reset:'إعادة ضبط التقدم',waiting_img:'بانتظار صورة…',loading_img:'جارٍ تحميل الصورة…',loaded_img:(w,h)=>`تم تحميل الصورة ${w}×${h}. اضبط المقياس/الكتلة/المعدل، ثم عيّن X/Y وابدأ.`,owop_not_ready_mouse:'‏OWOP غير جاهز. انتظر تحميل الخريطة.',need_image_first:'يرجى تحميل صورة أولاً.',owop_timeout:'‏OWOP غير جاهز (انتهت المهلة). أعد تحميل الصفحة.',started_pass1:'تم البدء (المرحلة 1/2)…',verifying_pass2:'جارٍ التحقق (المرحلة 2/2)…',stopped:'تم الإيقاف.',progress_reset:'تمت إعادة ضبط التقدم.',status_scan:(pass,qlen,prog)=>`${pass} • الطابور: ${qlen} • الفحص: ${prog}%`,pass12:'المرحلة 1/2',pass22:'المرحلة 2/2',done:'تم ✅',failed_load:'فشل تحميل الصورة (راجع وحدة التحكم).'},
    bn:{lang_label:'ভাষা',back:'ফিরে যান',title:'Image to Pixel By Agents_K',local_image:'লোকাল ছবি',x_world:'X (বিশ্ব)',y_world:'Y (বিশ্ব)',take_xy:'মাউস থেকে X/Y নিন',scale_label:'ছবির স্কেল (%)',scale_info:(p,w,h)=>`স্কেল: ${p}% • বসানো আকার: ${w}×${h}`,block_label:'ব্লক সাইজ (px)',block_info:n=>`ব্লক: ${n}×${n} (${n*n} px)`,rate_label:'হার (পিক্সেল/সেকেন্ড)',rate_info:r=>`হার: ${r} px/s`,start:'শুরু',stop:'থামান',reset:'অগ্রগতি রিসেট',waiting_img:'একটি ছবির জন্য অপেক্ষা…',loading_img:'ছবি লোড হচ্ছে…',loaded_img:(w,h)=>`ছবি ${w}×${h} লোড হয়েছে। স্কেল/ব্লক/হার ঠিক করুন, X/Y দিন, তারপর শুরু করুন।`,owop_not_ready_mouse:'OWOP প্রস্তুত নয়। ম্যাপ লোড হওয়া পর্যন্ত অপেক্ষা করুন।',need_image_first:'প্রথমে একটি ছবি লোড করুন।',owop_timeout:'OWOP প্রস্তুত নয় (টাইমআউট)। পেজ রিলোড করুন।',started_pass1:'শুরু হয়েছে (পর্ব 1/2)…',verifying_pass2:'যাচাই হচ্ছে (পর্ব 2/2)…',stopped:'বন্ধ হয়েছে।',progress_reset:'অগ্রগতি রিসেট হয়েছে।',status_scan:(pass,qlen,prog)=>`${pass} • কিউ: ${qlen} • স্ক্যান: ${prog}%`,pass12:'পর্ব 1/2',pass22:'পর্ব 2/2',done:'সম্পন্ন ✅',failed_load:'ছবি লোড ব্যর্থ (কনসোল দেখুন)।'},
    pt:{lang_label:'Idioma',back:'Voltar',title:'Image to Pixel By Agents_K',local_image:'Imagem local',x_world:'X (mundo)',y_world:'Y (mundo)',take_xy:'Pegar X/Y do mouse',scale_label:'Escala da imagem (%)',scale_info:(p,w,h)=>`Escala: ${p}% • Tamanho colocado: ${w}×${h}`,block_label:'Tamanho do bloco (px)',block_info:n=>`Bloco: ${n}×${n} (${n*n} px)`,rate_label:'Taxa (pixels por segundo)',rate_info:r=>`Taxa: ${r} px/s`,start:'Iniciar',stop:'Parar',reset:'Redefinir progresso',waiting_img:'Aguardando uma imagem…',loading_img:'Carregando imagem…',loaded_img:(w,h)=>`Imagem ${w}×${h} carregada. Ajuste escala/bloco/taxa, defina X/Y e Iniciar.`,owop_not_ready_mouse:'OWOP não está pronto. Aguarde o mapa carregar.',need_image_first:'Carregue uma imagem primeiro.',owop_timeout:'OWOP não está pronto (tempo esgotado). Recarregue a página.',started_pass1:'Iniciado (passo 1/2)…',verifying_pass2:'Verificando (passo 2/2)…',stopped:'Parado.',progress_reset:'Progresso redefinido.',status_scan:(pass,qlen,prog)=>`${pass} • fila: ${qlen} • varredura: ${prog}%`,pass12:'Passo 1/2',pass22:'Passo 2/2',done:'Concluído ✅',failed_load:'Falha ao carregar imagem (veja o console).'},
    ru:{lang_label:'Язык',back:'Назад',title:'Image to Pixel By Agents_K',local_image:'Локальное изображение',x_world:'X (мир)',y_world:'Y (мир)',take_xy:'Взять X/Y с мыши',scale_label:'Масштаб изображения (%)',scale_info:(p,w,h)=>`Масштаб: ${p}% • Размер размещения: ${w}×${h}`,block_label:'Размер блока (px)',block_info:n=>`Блок: ${n}×${n} (${n*n} px)`,rate_label:'Скорость (пикселей/с)',rate_info:r=>`Скорость: ${r} px/с`,start:'Старт',stop:'Стоп',reset:'Сбросить прогресс',waiting_img:'Ожидание изображения…',loading_img:'Загрузка изображения…',loaded_img:(w,h)=>`Изображение ${w}×${h} загружено. Настройте масштаб/блок/скорость, задайте X/Y и запускайте.`,owop_not_ready_mouse:'OWOP не готов. Подождите загрузки карты.',need_image_first:'Сначала загрузите изображение.',owop_timeout:'OWOP не готов (тайм-аут). Обновите страницу.',started_pass1:'Запущено (этап 1/2)…',verifying_pass2:'Проверка (этап 2/2)…',stopped:'Остановлено.',progress_reset:'Прогресс сброшен.',status_scan:(pass,qlen,prog)=>`${pass} • очередь: ${qlen} • скан: ${prog}%`,pass12:'Этап 1/2',pass22:'Этап 2/2',done:'Готово ✅',failed_load:'Не удалось загрузить изображение (см. консоль).'},
    ur:{lang_label:'زبان',back:'واپس',title:'Image to Pixel By Agents_K',local_image:'مقامی تصویر',x_world:'X (دنیا)',y_world:'Y (دنیا)',take_xy:'ماؤس سے X/Y لیں',scale_label:'تصویر کا اسکیل (%)',scale_info:(p,w,h)=>`اسکیل: ${p}% • رکھا گیا سائز: ${w}×${h}`,block_label:'بلاک سائز (px)',block_info:n=>`بلاک: ${n}×${n} (${n*n} px)`,rate_label:'شرح (پکسل/سیکنڈ)',rate_info:r=>`شرح: ${r} px/s`,start:'شروع',stop:'روکیں',reset:'پیش رفت ری سیٹ',waiting_img:'تصویر کا انتظار…',loading_img:'تصویر لوڈ ہو رہی ہے…',loaded_img:(w,h)=>`تصویر ${w}×${h} لوڈ ہوگئی۔ اسکیل/بلاک/شرح ٹھیک کریں، X/Y سیٹ کریں اور شروع کریں۔`,owop_not_ready_mouse:'OWOP تیار نہیں۔ نقشہ لوڈ ہونے دیں۔',need_image_first:'پہلے تصویر لوڈ کریں۔',owop_timeout:'OWOP تیار نہیں (ٹائم آؤٹ)۔ صفحہ ری لوڈ کریں۔',started_pass1:'شروع (مرحلہ 1/2)…',verifying_pass2:'تصدیق (مرحلہ 2/2)…',stopped:'روک دیا۔',progress_reset:'پیش رفت ری سیٹ ہوگئی۔',status_scan:(pass,qlen,prog)=>`${pass} • قطار: ${qlen} • اسکین: ${prog}%`,pass12:'مرحلہ 1/2',pass22:'مرحلہ 2/2',done:'مکمل ✅',failed_load:'تصویر لوڈ ناکام (کنسول دیکھیں)۔'},
    id:{lang_label:'Bahasa',back:'Kembali',title:'Image to Pixel By Agents_K',local_image:'Gambar lokal',x_world:'X (dunia)',y_world:'Y (dunia)',take_xy:'Ambil X/Y dari mouse',scale_label:'Skala gambar (%)',scale_info:(p,w,h)=>`Skala: ${p}% • Ukuran ditempatkan: ${w}×${h}`,block_label:'Ukuran blok (px)',block_info:n=>`Blok: ${n}×${n} (${n*n} px)`,rate_label:'Laju (piksel/detik)',rate_info:r=>`Laju: ${r} px/det`,start:'Mulai',stop:'Berhenti',reset:'Setel ulang progres',waiting_img:'Menunggu gambar…',loading_img:'Memuat gambar…',loaded_img:(w,h)=>`Gambar ${w}×${h} dimuat. Atur skala/blok/laju, set X/Y lalu Mulai.`,owop_not_ready_mouse:'OWOP belum siap. Tunggu peta memuat.',need_image_first:'Muat gambar terlebih dahulu.',owop_timeout:'OWOP belum siap (habis waktu). Muat ulang halaman.',started_pass1:'Dimulai (tahap 1/2)…',verifying_pass2:'Memverifikasi (tahap 2/2)…',stopped:'Dihentikan.',progress_reset:'Progres disetel ulang.',status_scan:(pass,qlen,prog)=>`${pass} • antrean: ${qlen} • pindai: ${prog}%`,pass12:'Tahap 1/2',pass22:'Tahap 2/2',done:'Selesai ✅',failed_load:'Gagal memuat gambar (lihat konsol).'},
    ms:{lang_label:'Bahasa',back:'Kembali',title:'Image to Pixel By Agents_K',local_image:'Imej setempat',x_world:'X (dunia)',y_world:'Y (dunia)',take_xy:'Ambil X/Y dari tetikus',scale_label:'Skala imej (%)',scale_info:(p,w,h)=>`Skala: ${p}% • Saiz diletakkan: ${w}×${h}`,block_label:'Saiz blok (px)',block_info:n=>`Blok: ${n}×${n} (${n*n} px)`,rate_label:'Kadar (piksel/saat)',rate_info:r=>`Kadar: ${r} px/s`,start:'Mula',stop:'Henti',reset:'Tetap semula kemajuan',waiting_img:'Menunggu imej…',loading_img:'Memuat imej…',loaded_img:(w,h)=>`Imej ${w}×${h} dimuat. Laras skala/blok/kadar, tetapkan X/Y lalu mula.`,owop_not_ready_mouse:'OWOP belum sedia. Tunggu peta dimuat.',need_image_first:'Sila muat imej dahulu.',owop_timeout:'OWOP belum sedia (tamat masa). Muat semula halaman.',started_pass1:'Dimulakan (tahap 1/2)…',verifying_pass2:'Mengesahkan (tahap 2/2)…',stopped:'Dihentikan.',progress_reset:'Kemajuan ditetap semula.',status_scan:(pass,qlen,prog)=>`${pass} • baris gilir: ${qlen} • imbas: ${prog}%`,pass12:'Tahap 1/2',pass22:'Tahap 2/2',done:'Selesai ✅',failed_load:'Gagal memuat imej (lihat konsol).'},
    de:{lang_label:'Sprache',back:'Zurück',title:'Image to Pixel By Agents_K',local_image:'Lokales Bild',x_world:'X (Welt)',y_world:'Y (Welt)',take_xy:'X/Y von der Maus übernehmen',scale_label:'Bildskalierung (%)',scale_info:(p,w,h)=>`Skala: ${p}% • Platzierte Größe: ${w}×${h}`,block_label:'Blockgröße (px)',block_info:n=>`Block: ${n}×${n} (${n*n} px)`,rate_label:'Rate (Pixel pro Sekunde)',rate_info:r=>`Rate: ${r} px/s`,start:'Start',stop:'Stopp',reset:'Fortschritt zurücksetzen',waiting_img:'Warten auf ein Bild…',loading_img:'Bild wird geladen…',loaded_img:(w,h)=>`Bild ${w}×${h} geladen. Skala/Block/Rate anpassen, X/Y setzen und starten.`,owop_not_ready_mouse:'OWOP nicht bereit. Bitte auf Karten-Ladevorgang warten.',need_image_first:'Bitte zuerst ein Bild laden.',owop_timeout:'OWOP nicht bereit (Zeitüberschreitung). Seite neu laden.',started_pass1:'Gestartet (Durchgang 1/2)…',verifying_pass2:'Überprüfung (Durchgang 2/2)…',stopped:'Angehalten.',progress_reset:'Fortschritt zurückgesetzt.',status_scan:(pass,qlen,prog)=>`${pass} • Warteschlange: ${qlen} • Scan: ${prog}%`,pass12:'Durchgang 1/2',pass22:'Durchgang 2/2',done:'Fertig ✅',failed_load:'Bild konnte nicht geladen werden (siehe Konsole).'},
    ja:{lang_label:'言語',back:'戻る',title:'Image to Pixel By Agents_K',local_image:'ローカル画像',x_world:'X（ワールド）',y_world:'Y（ワールド）',take_xy:'マウスから X/Y を取得',scale_label:'画像スケール（%）',scale_info:(p,w,h)=>`スケール：${p}% • 配置サイズ：${w}×${h}`,block_label:'ブロックサイズ（px）',block_info:n=>`ブロック：${n}×${n}（${n*n} px）`,rate_label:'速度（ピクセル/秒）',rate_info:r=>`速度：${r} px/s`,start:'開始',stop:'停止',reset:'進行状況をリセット',waiting_img:'画像を待機中…',loading_img:'画像を読み込み中…',loaded_img:(w,h)=>`画像 ${w}×${h} を読み込みました。スケール/ブロック/速度を調整し、X/Y を設定して開始。`,owop_not_ready_mouse:'OWOP は準備できていません。マップの読み込みを待ってください。',need_image_first:'まず画像を読み込んでください。',owop_timeout:'OWOP は準備できていません（タイムアウト）。ページを再読み込みしてください。',started_pass1:'開始（1/2）…',verifying_pass2:'検証中（2/2）…',stopped:'停止しました。',progress_reset:'進行状況をリセットしました。',status_scan:(pass,qlen,prog)=>`${pass} • キュー: ${qlen} • スキャン: ${prog}%`,pass12:'1/2',pass22:'2/2',done:'完了 ✅',failed_load:'画像の読み込みに失敗しました（コンソール参照）。'},
    tr:{lang_label:'Dil',back:'Geri',title:'Image to Pixel By Agents_K',local_image:'Yerel görsel',x_world:'X (dünya)',y_world:'Y (dünya)',take_xy:'X/Y’yi fareden al',scale_label:'Görsel ölçeği (%)',scale_info:(p,w,h)=>`Ölçek: ${p}% • Yerleştirilen boyut: ${w}×${h}`,block_label:'Blok boyutu (px)',block_info:n=>`Blok: ${n}×${n} (${n*n} px)`,rate_label:'Hız (piksel/saniye)',rate_info:r=>`Hız: ${r} px/sn`,start:'Başlat',stop:'Durdur',reset:'İlerlemeyi sıfırla',waiting_img:'Görsel bekleniyor…',loading_img:'Görsel yükleniyor…',loaded_img:(w,h)=>`Görsel ${w}×${h} yüklendi. Ölçek/blok/hızı ayarla, X/Y gir ve Başlat.`,owop_not_ready_mouse:'OWOP hazır değil. Haritanın yüklenmesini bekleyin.',need_image_first:'Lütfen önce bir görsel yükleyin.',owop_timeout:'OWOP hazır değil (zaman aşımı). Sayfayı yenileyin.',started_pass1:'Başlatıldı (aşama 1/2)…',verifying_pass2:'Doğrulanıyor (aşama 2/2)…',stopped:'Durduruldu.',progress_reset:'İlerleme sıfırlandı.',status_scan:(pass,qlen,prog)=>`${pass} • kuyruk: ${qlen} • tarama: ${prog}%`,pass12:'Aşama 1/2',pass22:'Aşama 2/2',done:'Bitti ✅',failed_load:'Görsel yüklenemedi (konsola bakın).'},
    ko:{lang_label:'언어',back:'뒤로',title:'Image to Pixel By Agents_K',local_image:'로컬 이미지',x_world:'X(월드)',y_world:'Y(월드)',take_xy:'마우스에서 X/Y 가져오기',scale_label:'이미지 배율 (%)',scale_info:(p,w,h)=>`배율: ${p}% • 배치 크기: ${w}×${h}`,block_label:'블록 크기 (px)',block_info:n=>`블록: ${n}×${n} (${n*n} px)`,rate_label:'속도 (픽셀/초)',rate_info:r=>`속도: ${r} px/s`,start:'시작',stop:'중지',reset:'진행 초기화',waiting_img:'이미지 대기 중…',loading_img:'이미지 로딩 중…',loaded_img:(w,h)=>`이미지 ${w}×${h} 로드됨. 배율/블록/속도 조정 후 X/Y 설정하고 시작하세요.`,owop_not_ready_mouse:'OWOP이 준비되지 않았습니다. 지도가 로드될 때까지 기다리세요.',need_image_first:'먼저 이미지를 로드하세요.',owop_timeout:'OWOP 준비 안 됨(시간 초과). 페이지를 새로고침하세요.',started_pass1:'시작됨 (1/2)…',verifying_pass2:'검증 중 (2/2)…',stopped:'중지됨.',progress_reset:'진행이 초기화되었습니다.',status_scan:(pass,qlen,prog)=>`${pass} • 대기열: ${qlen} • 스캔: ${prog}%`,pass12:'1/2',pass22:'2/2',done:'완료 ✅',failed_load:'이미지 로드 실패(콘솔 참조).'},
    it:{lang_label:'Lingua',back:'Indietro',title:'Image to Pixel By Agents_K',local_image:'Immagine locale',x_world:'X (mondo)',y_world:'Y (mondo)',take_xy:'Prendi X/Y dal mouse',scale_label:'Scala immagine (%)',scale_info:(p,w,h)=>`Scala: ${p}% • Dimensione posizionata: ${w}×${h}`,block_label:'Dimensione blocco (px)',block_info:n=>`Blocco: ${n}×${n} (${n*n} px)`,rate_label:'Velocità (pixel al secondo)',rate_info:r=>`Velocità: ${r} px/s`,start:'Avvia',stop:'Arresta',reset:'Reimposta avanzamento',waiting_img:'In attesa di un’immagine…',loading_img:'Caricamento immagine…',loaded_img:(w,h)=>`Immagine ${w}×${h} caricata. Regola scala/blocco/velocità, imposta X/Y e poi Avvia.`,owop_not_ready_mouse:'OWOP non pronto. Attendi il caricamento della mappa.',need_image_first:'Carica prima un’immagine.',owop_timeout:'OWOP non pronto (timeout). Ricarica la pagina.',started_pass1:'Avviato (passaggio 1/2)…',verifying_pass2:'Verifica (passaggio 2/2)…',stopped:'Arrestato.',progress_reset:'Avanzamento reimpostato.',status_scan:(pass,qlen,prog)=>`${pass} • coda: ${qlen} • scansione: ${prog}%`,pass12:'Passaggio 1/2',pass22:'Passaggio 2/2',done:'Fatto ✅',failed_load:'Caricamento immagine non riuscito (vedi console).'},
    vi:{lang_label:'Ngôn ngữ',back:'Quay lại',title:'Image to Pixel By Agents_K',local_image:'Ảnh cục bộ',x_world:'X (thế giới)',y_world:'Y (thế giới)',take_xy:'Lấy X/Y từ chuột',scale_label:'Tỉ lệ ảnh (%)',scale_info:(p,w,h)=>`Tỉ lệ: ${p}% • Kích thước đặt: ${w}×${h}`,block_label:'Kích thước khối (px)',block_info:n=>`Khối: ${n}×${n} (${n*n} px)`,rate_label:'Tốc độ (pixel/giây)',rate_info:r=>`Tốc độ: ${r} px/s`,start:'Bắt đầu',stop:'Dừng',reset:'Đặt lại tiến độ',waiting_img:'Đang chờ ảnh…',loading_img:'Đang tải ảnh…',loaded_img:(w,h)=>`Ảnh ${w}×${h} đã tải. Chỉnh tỉ lệ/khối/tốc độ, đặt X/Y rồi Bắt đầu.`,owop_not_ready_mouse:'OWOP chưa sẵn sàng. Vui lòng đợi bản đồ tải xong.',need_image_first:'Hãy tải ảnh trước.',owop_timeout:'OWOP chưa sẵn sàng (hết thời gian). Tải lại trang.',started_pass1:'Đã bắt đầu (bước 1/2)…',verifying_pass2:'Đang kiểm tra (bước 2/2)…',stopped:'Đã dừng.',progress_reset:'Đã đặt lại tiến độ.',status_scan:(pass,qlen,prog)=>`${pass} • hàng đợi: ${qlen} • quét: ${prog}%`,pass12:'Bước 1/2',pass22:'Bước 2/2',done:'Hoàn tất ✅',failed_load:'Tải ảnh thất bại (xem bảng điều khiển).'},
    ta:{lang_label:'மொழி',back:'பின் செல்ல',title:'Image to Pixel By Agents_K',local_image:'உள்ளூர் படம்',x_world:'X (உலகம்)',y_world:'Y (உலகம்)',take_xy:'மவுசிலிருந்து X/Y எடுக்க',scale_label:'பட அளவு (%)',scale_info:(p,w,h)=>`அளவு: ${p}% • வைக்கப்படும் அளவு: ${w}×${h}`,block_label:'தொகுதி அளவு (px)',block_info:n=>`தொகுதி: ${n}×${n} (${n*n} px)`,rate_label:'வீதம் (பிக்சல்/விநா)',rate_info:r=>`வீதம்: ${r} px/s`,start:'தொடங்கு',stop:'நிறுத்து',reset:'முன்னேற்றத்தை மீட்டமை',waiting_img:'ஒரு படத்துக்காக காத்திருக்கிறது…',loading_img:'படம் ஏற்றப்படுகிறது…',loaded_img:(w,h)=>`படம் ${w}×${h} ஏற்றப்பட்டது. அளவு/தொகுதி/வீதத்தை மாற்றி, X/Y அமைத்து தொடங்கு.`,owop_not_ready_mouse:'OWOP தயார் இல்லை. வரைபடம் ஏற்றப்படும் வரை காத்திருங்கள்.',need_image_first:'முதலில் ஒரு படத்தை ஏற்றவும்.',owop_timeout:'OWOP தயார் இல்லை (நேரம் முடிந்தது). பக்கத்தை மீட்டமை.',started_pass1:'தொடங்கியது (படி 1/2)…',verifying_pass2:'சரிபார்க்கப்படுகிறது (படி 2/2)…',stopped:'நிறுத்தப்பட்டது.',progress_reset:'முன்னேற்றம் மீட்டமைக்கப்பட்டது.',status_scan:(pass,qlen,prog)=>`${pass} • வரிசை: ${qlen} • ஸ்கேன்: ${prog}%`,pass12:'படி 1/2',pass22:'படி 2/2',done:'முடிந்தது ✅',failed_load:'படம் ஏற்றல் தோல்வி (கன்சோலைப் பார்க்கவும்).'},
    fa:{lang_label:'زبان',back:'بازگشت',title:'Image to Pixel By Agents_K',local_image:'تصویر محلی',x_world:'X (جهان)',y_world:'Y (جهان)',take_xy:'X/Y را از ماوس بگیر',scale_label:'مقیاس تصویر (%)',scale_info:(p,w,h)=>`مقیاس: ${p}% • اندازهٔ قرار داده‌شده: ${w}×${h}`,block_label:'اندازهٔ بلوک (px)',block_info:n=>`بلوک: ${n}×${n} (${n*n} پیکسل)`,rate_label:'نرخ (پیکسل/ثانیه)',rate_info:r=>`نرخ: ${r} px/s`,start:'شروع',stop:'توقف',reset:'بازنشانی پیشرفت',waiting_img:'در انتظار تصویر…',loading_img:'در حال بارگذاری تصویر…',loaded_img:(w,h)=>`تصویر ${w}×${h} بارگذاری شد. مقیاس/بلوک/نرخ را تنظیم کنید، X/Y را بگذارید و شروع کنید.`,owop_not_ready_mouse:'‏OWOP آماده نیست. منتظر بارگذاری نقشه بمانید.',need_image_first:'ابتدا یک تصویر بارگذاری کنید.',owop_timeout:'‏OWOP آماده نیست (مهلت تمام شد). صفحه را دوباره بارگذاری کنید.',started_pass1:'شروع شد (گام 1/2)…',verifying_pass2:'در حال بررسی (گام 2/2)…',stopped:'متوقف شد.',progress_reset:'پیشرفت بازنشانی شد.',status_scan:(pass,qlen,prog)=>`${pass} • صف: ${qlen} • اسکن: ${prog}%`,pass12:'گام 1/2',pass22:'گام 2/2',done:'انجام شد ✅',failed_load:'بارگذاری تصویر ناموفق بود (کنسول را ببینید).'},
    te:{lang_label:'భాష',back:'వెనక్కి',title:'Image to Pixel By Agents_K',local_image:'లోకల్ చిత్రం',x_world:'X (లోకం)',y_world:'Y (లోకం)',take_xy:'మౌస్ నుండి X/Y తీసుకోండి',scale_label:'చిత్ర స్కేలు (%)',scale_info:(p,w,h)=>`స్కేలు: ${p}% • ఉంచే పరిమాణం: ${w}×${h}`,block_label:'బ్లాక్ పరిమాణం (px)',block_info:n=>`బ్లాక్: ${n}×${n} (${n*n} px)`,rate_label:'రేటు (పిక్సెల్స్/సెకన్)',rate_info:r=>`రేటు: ${r} px/s`,start:'ప్రారంభించండి',stop:'ఆపండి',reset:'పురోగతిని రీసెట్ చేయండి',waiting_img:'చిత్రానికి ఎదురుచూస్తోంది…',loading_img:'చిత్రం లోడ్ అవుతోంది…',loaded_img:(w,h)=>`చిత్రం ${w}×${h} లోడైంది. స్కేలు/బ్లాక్/రేటు సవరించి, X/Y సెట్ చేసి ప్రారంభించండి.`,owop_not_ready_mouse:'OWOP సిద్ధంగా లేదు. మ్యాప్ లోడ్ అయ్యే వరకు వేచి ఉండండి.',need_image_first:'ముందుగా చిత్రాన్ని లోడ్ చేయండి.',owop_timeout:'OWOP సిద్ధంగా లేదు (టైమ్‌ఔట్). పేజీని రీలోడ్ చేయండి.',started_pass1:'ప్రారంభించబడింది (దశ 1/2)…',verifying_pass2:'ధృవీకరిస్తోంది (దశ 2/2)…',stopped:'ఆపబడింది.',progress_reset:'పురోగతి రీసెట్ చేయబడింది.',status_scan:(pass,qlen,prog)=>`${pass} • క్యూ: ${qlen} • స్కాన్: ${prog}%`,pass12:'దశ 1/2',pass22:'దశ 2/2',done:'పూర్తైంది ✅',failed_load:'చిత్ర లోడ్ విఫలమైంది (కన్సోల్ చూడండి).'},
    mr:{lang_label:'भाषा',back:'मागे',title:'Image to Pixel By Agents_K',local_image:'स्थानिक प्रतिमा',x_world:'X (जग)',y_world:'Y (जग)',take_xy:'माऊसवरून X/Y घ्या',scale_label:'प्रतिमा प्रमाण (%)',scale_info:(p,w,h)=>`प्रमाण: ${p}% • ठेवलेला आकार: ${w}×${h}`,block_label:'ब्लॉक आकार (px)',block_info:n=>`ब्लॉक: ${n}×${n} (${n*n} px)`,rate_label:'दर (पिक्सेल/से.)',rate_info:r=>`दर: ${r} px/s`,start:'प्रारंभ',stop:'थांबवा',reset:'प्रगती रीसेट',waiting_img:'प्रतिमेची प्रतीक्षा…',loading_img:'प्रतिमा लोड होत आहे…',loaded_img:(w,h)=>`प्रतिमा ${w}×${h} लोड झाली. प्रमाण/ब्लॉक/दर समायोजित करा, X/Y सेट करा आणि प्रारंभ करा.`,owop_not_ready_mouse:'OWOP तयार नाही. नकाशा लोड होईपर्यंत थांबा.',need_image_first:'प्रथम प्रतिमा लोड करा.',owop_timeout:'OWOP तयार नाही (टाइमआउट). पृष्ठ रीलोड करा.',started_pass1:'सुरू (टप्पा 1/2)…',verifying_pass2:'पडताळणी (टप्पा 2/2)…',stopped:'थांबवले.',progress_reset:'प्रगती रीसेट केली.',status_scan:(pass,qlen,prog)=>`${pass} • रांग: ${qlen} • स्कॅन: ${prog}%`,pass12:'टप्पा 1/2',pass22:'टप्पा 2/2',done:'पूर्ण ✅',failed_load:'प्रतिमा लोड अयशस्वी (कन्सोल पहा).'},
    wuu:{lang_label:'语言',back:'返回',title:'Image to Pixel By Agents_K',local_image:'本地图像',x_world:'X（世界）',y_world:'Y（世界）',take_xy:'从鼠标获取 X/Y',scale_label:'图像缩放 (%)',scale_info:(p,w,h)=>`比例：${p}% • 放置尺寸：${w}×${h}`,block_label:'块大小 (px)',block_info:n=>`块：${n}×${n}（${n*n} 像素）`,rate_label:'速率（像素/秒）',rate_info:r=>`速率：${r} 像素/秒`,start:'开始',stop:'停止',reset:'重置进度',waiting_img:'正在等待图像…',loading_img:'正在加载图像…',loaded_img:(w,h)=>`图像 ${w}×${h} 已加载。调整比例/块/速率，设置 X/Y，然后开始。`,owop_not_ready_mouse:'OWOP 尚未就绪。',need_image_first:'请先加载图像。',owop_timeout:'OWOP 未就绪（超时）。',started_pass1:'已开始（第 1/2 步）…',verifying_pass2:'正在验证（第 2/2 步）…',stopped:'已停止。',progress_reset:'进度已重置。',status_scan:(pass,qlen,prog)=>`${pass} • 队列：${qlen} • 扫描：${prog}%`,pass12:'第 1/2 步',pass22:'第 2/2 步',done:'完成 ✅',failed_load:'图像加载失败。'},
    jv:{lang_label:'Basa',back:'Mbalik',title:'Image to Pixel By Agents_K',local_image:'Gambar lokal',x_world:'X (donya)',y_world:'Y (donya)',take_xy:'Jupuk X/Y saka mouse',scale_label:'Skala gambar (%)',scale_info:(p,w,h)=>`Skala: ${p}% • Ukuran dipasang: ${w}×${h}`,block_label:'Ukuran blok (px)',block_info:n=>`Blok: ${n}×${n} (${n*n} px)`,rate_label:'Laju (piksel/detik)',rate_info:r=>`Laju: ${r} px/s`,start:'Miwiwi',stop:'Mandheg',reset:'Reset kemajuan',waiting_img:'Nunggu gambar…',loading_img:'Ngunggah gambar…',loaded_img:(w,h)=>`Gambar ${w}×${h} wis dimuat. Atur skala/blok/laju, setel X/Y banjur mulai.`,owop_not_ready_mouse:'OWOP durung siap. Enteni peta memuat.',need_image_first:'Kaping pisan muat gambar dhisik.',owop_timeout:'OWOP durung siap (wates wektu). Muat maneh kaca.',started_pass1:'Diwiwiti (tahap 1/2)…',verifying_pass2:'Mriksa (tahap 2/2)…',stopped:'Mandheg.',progress_reset:'Kemajuan direset.',status_scan:(pass,qlen,prog)=>`${pass} • antrian: ${qlen} • pindai: ${prog}%`,pass12:'Tahap 1/2',pass22:'Tahap 2/2',done:'Rampung ✅',failed_load:'Gagal muat gambar (delengen konsol).'},
    pa:{lang_label:'ਭਾਸ਼ਾ',back:'ਵਾਪਸ',title:'Image to Pixel By Agents_K',local_image:'ਸਥਾਨਕ ਚਿੱਤਰ',x_world:'X (ਸੰਸਾਰ)',y_world:'Y (ਸੰਸਾਰ)',take_xy:'ਮਾਊਸ ਤੋਂ X/Y ਲਵੋ',scale_label:'ਚਿੱਤਰ ਸਕੇਲ (%)',scale_info:(p,w,h)=>`ਸਕੇਲ: ${ਪ}% • ਰੱਖਿਆ ਆਕਾਰ: ${w}×${h}`,block_label:'ਬਲਾਕ ਆਕਾਰ (px)',block_info:n=>`ਬਲਾਕ: ${n}×${n} (${n*n} px)`,rate_label:'ਦਰ (ਪਿਕਸਲ/ਸੈ.)',rate_info:r=>`ਦਰ: ${r} px/s`,start:'ਸ਼ੁਰੂ',stop:'ਰੋਕੋ',reset:'ਤਰੱਕੀ ਰੀਸੈੱਟ',waiting_img:'ਚਿੱਤਰ ਦੀ ਉਡੀਕ…',loading_img:'ਚਿੱਤਰ ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ…',loaded_img:(w,h)=>`ਚਿੱਤਰ ${w}×${h} ਲੋਡ ਹੋ ਗਿਆ। ਸਕੇਲ/ਬਲਾਕ/ਦਰ ਸਹੀ ਕਰੋ, X/Y ਸੈੱਟ ਕਰੋ ਅਤੇ ਸ਼ੁਰੂ ਕਰੋ।`,owop_not_ready_mouse:'OWOP ਤਿਆਰ ਨਹੀਂ। ਨਕਸ਼ਾ ਲੋਡ ਹੋਣ ਦਿਓ।',need_image_first:'ਪਹਿਲਾਂ ਚਿੱਤਰ ਲੋਡ ਕਰੋ।',owop_timeout:'OWOP ਤਿਆਰ ਨਹੀਂ (ਟਾਈਮਆਉਟ)। ਸਫ਼ਾ ਰੀਲੋਡ ਕਰੋ।',started_pass1:'ਸ਼ੁਰੂ ਕੀਤਾ (ਚਰਨ 1/2)…',verifying_pass2:'ਜਾਂਚ (ਚਰਨ 2/2)…',stopped:'ਰੋਕਿਆ ਗਿਆ।',progress_reset:'ਤਰੱਕੀ ਰੀਸੈੱਟ ਹੋਈ।',status_scan:(pass,qlen,prog)=>`${pass} • ਕਤਾਰ: ${qlen} • ਸਕੈਨ: ${prog}%`,pass12:'ਚਰਨ 1/2',pass22:'ਚਰਨ 2/2',done:'ਮੁਕੰਮਲ ✅',failed_load:'ਚਿੱਤਰ ਲੋਡ ਫੇਲ (ਕਨਸੋਲ ਵੇਖੋ)।'},
    gu:{lang_label:'ભાષા',back:'પાછા',title:'Image to Pixel By Agents_K',local_image:'સ્થાનિક છબી',x_world:'X (વિશ્વ)',y_world:'Y (વિશ્વ)',take_xy:'માઉસમાંથી X/Y લો',scale_label:'છબી સ્કેલ (%)',scale_info:(p,w,h)=>`સ્કેલ: ${p}% • મૂકાયેલ કદ: ${w}×${h}`,block_label:'બ્લોક કદ (px)',block_info:n=>`બ્લોક: ${n}×${n} (${n*n} px)`,rate_label:'દર (પિક્સેલ/સે.)',rate_info:r=>`દર: ${r} px/s`,start:'શરૂ કરો',stop:'બંધ કરો',reset:'પ્રગતિ રીસેટ',waiting_img:'છબીની રાહ જોવામાં…',loading_img:'છબી લોડ થઈ રહી છે…',loaded_img:(w,h)=>`છબી ${w}×${h} લોડ થઈ. સ્કેલ/બ્લોક/દર સમાયોજિત કરો, X/Y સેટ કરીને શરૂ કરો.`,owop_not_ready_mouse:'OWOP તૈયાર નથી. નકશો લોડ થવા રાહ જુઓ.',need_image_first:'સૌપ્રથમ છબી લોડ કરો.',owop_timeout:'OWOP તૈયાર નથી (ટાઈમઆઉટ). પેજ ફરીથી લોડ કરો.',started_pass1:'શરૂ થયું (પગલું 1/2)…',verifying_pass2:'તપાસ (પગલું 2/2)…',stopped:'બંધ કરી દેવામાં આવ્યું.',progress_reset:'પ્રગતિ રીસેટ થઈ.',status_scan:(pass,qlen,prog)=>`${pass} • કતાર: ${qlen} • સ્કેન: ${prog}%`,pass12:'પગલું 1/2',pass22:'પગલું 2/2',done:'પૂર્ણ ✅',failed_load:'છબી લોડ નિષ્ફળ (કોન્સોલ જુઓ).'},
    pl:{lang_label:'Język',back:'Wróć',title:'Image to Pixel By Agents_K',local_image:'Obraz lokalny',x_world:'X (świat)',y_world:'Y (świat)',take_xy:'Pobierz X/Y z myszy',scale_label:'Skala obrazu (%)',scale_info:(p,w,h)=>`Skala: ${p}% • Rozmiar docelowy: ${w}×${h}`,block_label:'Rozmiar bloku (px)',block_info:n=>`Blok: ${n}×${n} (${n*n} px)`,rate_label:'Szybkość (piksele/s)',rate_info:r=>`Szybkość: ${r} px/s`,start:'Start',stop:'Stop',reset:'Resetuj postęp',waiting_img:'Oczekiwanie na obraz…',loading_img:'Wczytywanie obrazu…',loaded_img:(w,h)=>`Obraz ${w}×${h} wczytany. Dostosuj skalę/blok/szybkość, ustaw X/Y i Start.`,owop_not_ready_mouse:'OWOP niegotowy. Poczekaj na załadowanie mapy.',need_image_first:'Najpierw wczytaj obraz.',owop_timeout:'OWOP niegotowy (limit czasu). Odśwież stronę.',started_pass1:'Uruchomiono (etap 1/2)…',verifying_pass2:'Weryfikacja (etap 2/2)…',stopped:'Zatrzymano.',progress_reset:'Postęp zresetowano.',status_scan:(pass,qlen,prog)=>`${pass} • kolejka: ${qlen} • skan: ${prog}%`,pass12:'Etap 1/2',pass22:'Etap 2/2',done:'Gotowe ✅',failed_load:'Nie udało się wczytać obrazu (patrz konsola).'},
    uk:{lang_label:'Мова',back:'Назад',title:'Image to Pixel By Agents_K',local_image:'Локальне зображення',x_world:'X (світ)',y_world:'Y (світ)',take_xy:'Взяти X/Y з миші',scale_label:'Масштаб зображення (%)',scale_info:(p,w,h)=>`Масштаб: ${p}% • Розмір розміщення: ${w}×${h}`,block_label:'Розмір блоку (px)',block_info:n=>`Блок: ${n}×${n} (${n*n} px)`,rate_label:'Швидкість (пікселів/с)',rate_info:r=>`Швидкість: ${r} px/с`,start:'Пуск',stop:'Зупинити',reset:'Скинути прогрес',waiting_img:'Очікування зображення…',loading_img:'Завантаження зображення…',loaded_img:(w,h)=>`Зображення ${w}×${h} завантажено. Відкоригуйте масштаб/блок/швидкість, задайте X/Y і запускайте.`,owop_not_ready_mouse:'OWOP не готовий. Зачекайте завантаження карти.',need_image_first:'Спершу завантажте зображення.',owop_timeout:'OWOP не готовий (тайм-аут). Перезавантажте сторінку.',started_pass1:'Запущено (крок 1/2)…',verifying_pass2:'Перевірка (крок 2/2)…',stopped:'Зупинено.',progress_reset:'Прогрес скинуто.',status_scan:(pass,qlen,prog)=>`${pass} • черга: ${qlen} • скан: ${prog}%`,pass12:'Крок 1/2',pass22:'Крок 2/2',done:'Готово ✅',failed_load:'Не вдалося завантажити зображення (див. консоль).'},
    ml:{lang_label:'ഭാഷ',back:'തിരികെ',title:'Image to Pixel By Agents_K',local_image:'പ്രാദേശിക ചിത്രം',x_world:'X (ലോകം)',y_world:'Y (ലോകം)',take_xy:'മൗസിൽ നിന്ന് X/Y എടുക്കുക',scale_label:'ചിത്രത്തിന്റെ സ്‌കെയിൽ (%)',scale_info:(p,w,h)=>`സ്‌കെയിൽ: ${p}% • വയ്ക്കുന്ന വലിപ്പം: ${w}×${h}`,block_label:'ബ്ലോക്ക് വലുപ്പം (px)',block_info:n=>`ബ്ലോക്ക്: ${n}×${n} (${n*n} px)`,rate_label:'നിരക്ക് (പിക്സൽ/സെ)',rate_info:r=>`നിരക്ക്: ${r} px/s`,start:'ആരംഭിക്കുക',stop:'നിർത്തുക',reset:'പുരോഗതി പുനഃസജ്ജമാക്കുക',waiting_img:'ചിത്രത്തിനായി കാത്തിരിക്കുന്നു…',loading_img:'ചിത്രം ലോഡാകുന്നു…',loaded_img:(w,h)=>`ചിത്രം ${w}×${h} ലോഡായി. സ്‌കെയിൽ/ബ്ലോക്ക്/നിരക്ക് ക്രമപ്പെടുത്തി, X/Y സജ്ജമാക്കി ആരംഭിക്കുക.`,owop_not_ready_mouse:'OWOP തയ്യാറല്ല. മാപ്പ് ലോഡാകുന്നത് വരെ കാത്തിരിക്കുക.',need_image_first:'ആദ്യം ഒരു ചിത്രം ലോഡുചെയ്യുക.',owop_timeout:'OWOP തയ്യാറല്ല (ടൈംഔട്ട്). പേജ് വീണ്ടും ലോഡുചെയ്യുക.',started_pass1:'ആരംഭിച്ചു (ഘട്ടം 1/2)…',verifying_pass2:'പരിശോധിക്കുന്നു (ഘട്ടം 2/2)…',stopped:'നിർത്തി.',progress_reset:'പുരോഗതി പുനഃസജ്ജമാക്കി.',status_scan:(pass,qlen,prog)=>`${pass} • നിര: ${qlen} • സ്കാൻ: ${prog}%`,pass12:'ഘട്ടം 1/2',pass22:'ഘട്ടം 2/2',done:'പൂർത്തിയായി ✅',failed_load:'ചിത്രം ലോഡുചെയ്യൽ പരാജയപ്പെട്ടു (കൺസോൾ കാണുക).'},
    kn:{lang_label:'ಭಾಷೆ',back:'ಹಿಂದಕ್ಕೆ',title:'Image to Pixel By Agents_K',local_image:'ಸ್ಥಳೀಯ ಚಿತ್ರ',x_world:'X (ಲೋಕ)',y_world:'Y (ಲೋಕ)',take_xy:'ಮೌಸ್‌ನಿಂದ X/Y ಪಡೆಯಿರಿ',scale_label:'ಚಿತ್ರದ ಪ್ರಮಾಣ (%)',scale_info:(p,w,h)=>`ಪ್ರಮಾಣ: ${p}% • ಇಡಲಾದ ಗಾತ್ರ: ${w}×${h}`,block_label:'ಬ್ಲಾಕ್ ಗಾತ್ರ (px)',block_info:n=>`ಬ್ಲಾಕ್: ${n}×${n} (${n*n} px)`,rate_label:'ದರ (ಪಿಕ್ಸೆಲ್/ಸೆ)',rate_info:r=>`ದರ: ${r} px/s`,start:'ಪ್ರಾರಂಭಿಸಿ',stop:'ನಿಲ್ಲಿಸಿ',reset:'ಪ್ರಗತಿ ಮರುಹೊಂದಿಸಿ',waiting_img:'ಚಿತ್ರಕ್ಕಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ…',loading_img:'ಚಿತ್ರ ಲೋಡ್ ಆಗುತ್ತಿದೆ…',loaded_img:(w,h)=>`ಚಿತ್ರ ${w}×${h} ಲೋಡ್ ಆಯಿತು. ಪ್ರಮಾಣ/ಬ್ಲಾಕ್/ದರ ಸರಿಪಡಿಸಿ, X/Y ಹೊಂದಿಸಿ ಮತ್ತು ಪ್ರಾರಂಭಿಸಿ.`,owop_not_ready_mouse:'OWOP ಸಿದ್ಧವಿಲ್ಲ. ನಕ್ಷೆ ಲೋಡ್ ಆಗುವವರೆಗೆ ಕಾಯಿರಿ.',need_image_first:'ಮೊದಲು ಚಿತ್ರವನ್ನು ಲೋಡ್ ಮಾಡಿ.',owop_timeout:'OWOP ಸಿದ್ಧವಿಲ್ಲ (ಟೈಮ್‌ಔಟ್). ಪುಟವನ್ನು ಮರುಲೋಡ್ ಮಾಡಿ.',started_pass1:'ಪ್ರಾರಂಭವಾಯಿತು (ಹಂತ 1/2)…',verifying_pass2:'ಪರಿಶೀಲನೆ (ಹಂತ 2/2)…',stopped:'ನಿಲ್ಲಿಸಲಾಗಿದೆ.',progress_reset:'ಪ್ರಗತಿ ಮರುಹೊಂದಿಸಲಾಗಿದೆ.',status_scan:(pass,qlen,prog)=>`${pass} • ಸರತಿ: ${qlen} • ಸ್ಕ್ಯಾನ್: ${prog}%`,pass12:'ಹಂತ 1/2',pass22:'ಹಂತ 2/2',done:'ಮುಗಿದಿದೆ ✅',failed_load:'ಚಿತ್ರ ಲೋಡ್ ವಿಫಲ (ಕನ್ಸೋಲ್ ನೋಡಿ).'},
    my:{lang_label:'ဘာသာ',back:'နောက်သို့',title:'Image to Pixel By Agents_K',local_image:'ဒေသဆိုင်ရာပုံ',x_world:'X (ကမ္ဘာ)',y_world:'Y (ကမ္ဘာ)',take_xy:'မောက်စ်မှ X/Y ယူရန်',scale_label:'ပုံ အရွယ် (%)',scale_info:(p,w,h)=>`အရွယ်: ${p}% • တင်မည့် အရွယ်: ${w}×${h}`,block_label:'ဘလော့က အရွယ် (px)',block_info:n=>`ဘလော့က: ${n}×${n} (${n*n} px)`,rate_label:'နှုန်း (px/စက္ကန့်)',rate_info:r=>`နှုန်း: ${r} px/s`,start:'စတင်',stop:'ရပ်',reset:'တိုးတက်မှု ပြန်စ',waiting_img:'ပုံကို စောင့်နေ…',loading_img:'ပုံကို တင်နေသည်…',loaded_img:(w,h)=>`ပုံ ${w}×${h} တင်ပြီး။ အရွယ်/ဘလော့က/နှုန်း ချိန်ပြီး X/Y သတ်မှတ်ပြီး စတင်ပါ။`,owop_not_ready_mouse:'OWOP မပြင်ဆင်ရသေးပါ။ မြေပုံတင်နေသည်ကို စောင့်ပါ။',need_image_first:'ပထမဦးဆုံး ပုံတင်ပါ။',owop_timeout:'OWOP မပြင်ဆင်ရသေး (အချိန်လွန်)။ စာမျက်နှာကို ပြန်ဖွင့်ပါ။',started_pass1:'စတင်ပြီး (အဆင့် 1/2)…',verifying_pass2:'စစ်ဆေးနေပါသည် (အဆင့် 2/2)…',stopped:'ရပ်နားပြီး',progress_reset:'တိုးတက်မှု ပြန်စတင်။',status_scan:(pass,qlen,prog)=>`${pass} • စီရင်: ${qlen} • စကန်: ${prog}%`,pass12:'အဆင့် 1/2',pass22:'အဆင့် 2/2',done:'ပြီးဆုံး ✅',failed_load:'ပုံတင်မှု မအောင်မြင် (console ကိုကြည့်ပါ)'}
  };

  /* ---------------- Language list (paged) ---------------- */
  const LANGS = [
    { code:'en', label:'Anglais / English', flag:'🇺🇸' },
    { code:'zh', label:'Mandarin (中文)', flag:'🇨🇳' },
    { code:'hi', label:'Hindi (हिन्दी)', flag:'🇮🇳' },
    { code:'es', label:'Español', flag:'🇪🇸' },
    { code:'fr', label:'Français', flag:'🇫🇷' },
    { code:'ar', label:'العربية', flag:'🇸🇦' },
    { code:'bn', label:'বাংলা', flag:'🇧🇩' },
    { code:'pt', label:'Português', flag:'🇵🇹' },
    { code:'ru', label:'Русский', flag:'🇷🇺' },
    { code:'ur', label:'اردو', flag:'🇵🇰' },
    { code:'id', label:'Bahasa Indonesia', flag:'🇮🇩' },
    { code:'ms', label:'Bahasa Melayu', flag:'🇲🇾' },
    { code:'de', label:'Deutsch', flag:'🇩🇪' },
    { code:'ja', label:'日本語', flag:'🇯🇵' },
    { code:'tr', label:'Türkçe', flag:'🇹🇷' },
    { code:'ko', label:'한국어', flag:'🇰🇷' },
    { code:'it', label:'Italiano', flag:'🇮🇹' },
    { code:'vi', label:'Tiếng Việt', flag:'🇻🇳' },
    { code:'ta', label:'தமிழ்', flag:'🇮🇳' },
    { code:'fa', label:'فارسی', flag:'🇮🇷' },
    { code:'te', label:'తెలుగు', flag:'🇮🇳' },
    { code:'mr', label:'मराठी', flag:'🇮🇳' },
    { code:'wuu', label:'吴语 (Wu)', flag:'🇨🇳' },
    { code:'jv', label:'Basa Jawa', flag:'🇮🇩' },
    { code:'pa', label:'ਪੰਜਾਬੀ', flag:'🇵🇰' },
    { code:'gu', label:'ગુજરાતી', flag:'🇮🇳' },
    { code:'pl', label:'Polski', flag:'🇵🇱' },
    { code:'uk', label:'Українська', flag:'🇺🇦' },
    { code:'ml', label:'മലയാളം', flag:'🇮🇳' },
    { code:'kn', label:'ಕನ್ನಡ', flag:'🇮🇳' },
    { code:'my', label:'မြန်မာ', flag:'🇲🇲' }
  ];
  const PAGE_SIZE = 13;

  const langKey = 'apxLang';
  let LANG = localStorage.getItem(langKey) || 'fr';
  if (!I18N[LANG]) LANG = 'en';
  let langPage = parseInt(localStorage.getItem('apxLangPage') || '0', 10) || 0;
  const RTL = new Set(['ar','fa','ur']);

  const t = (k, ...a) => {
    const pack = I18N[LANG] || I18N.en;
    const v = pack[k] !== undefined ? pack[k] : I18N.en[k];
    return typeof v === 'function' ? v(...a) : v;
  };

  /* ---------------- Styles ---------------- */
  const css = `
#apxPanel{position:fixed !important;top:12px;right:12px;z-index:2147483647 !important;background:#111a;border:1px solid #333;border-radius:12px;padding:10px 12px;color:#eee;font:13px/1.35 system-ui,Segoe UI,Roboto,Arial;width:340px;box-shadow:0 8px 24px rgba(0,0,0,.35)}
#apxTitle{margin:0 0 8px;font-size:14px;font-weight:700;user-select:none;border-bottom:1px solid #2a2a2a;position:relative;cursor:move;padding:4px 36px 4px 2px}
#apxTitleLeft{display:inline-block;max-width:calc(100% - 38px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#apxLangBtn{position:absolute;right:4px;top:4px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border:none;background:transparent;color:#eee;cursor:pointer;padding:0;z-index:2147483647}
#apxLangBtn .emoji{font-size:18px;line-height:1}
#apxLangMenu{position:fixed;min-width:300px;background:#0f1013;border:1px solid #333;border-radius:12px;padding:8px 10px 10px;box-shadow:0 12px 28px rgba(0,0,0,.45);display:none;z-index:2147483647}
#apxLangMenu.open{display:block}
#apxLangMenu .head{display:flex;align-items:center;justify-content:center;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #252525;font-weight:700;font-size:13px}
#apxLangList{}
#apxLangMenu .opt{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:10px;cursor:pointer}
#apxLangMenu .opt:hover{background:#1b1d22}
#apxLangMenu .flag{font-size:16px}
#apxLangMenu .footer{display:flex;align-items:center;justify-content:space-between;margin-top:8px;gap:8px}
#apxLangPager{display:flex;align-items:center;gap:6px}
#apxLangPrev,#apxLangNext{border:1px solid #444;border-radius:10px;padding:8px 10px;background:#17181a;color:#eee;cursor:pointer}
#apxLangPageLbl{color:#aaa;min-width:70px;text-align:center}
#apxLangBack{border:1px solid #444;border-radius:10px;padding:8px 10px;background:#17181a;color:#eee;cursor:pointer;width:33%;text-align:center;margin-left:auto}
#apxPanel .row{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px}
#apxPanel .wide{grid-column:1 / -1}
#apxPanel label{display:flex;flex-direction:column;gap:6px;position:relative;z-index:1}
#apxPanel input[type="number"],#apxPanel input[type="file"],#apxPanel input[type="range"],#apxPanel button:not(#apxLangBtn){width:100%;box-sizing:border-box;border-radius:8px;border:1px solid #444;background:#17181a;color:#eee;padding:6px 8px}
#apxPanel .small{color:#bbb;font-size:12px}
#apxStatus{margin-top:6px;font-size:12px;color:#bbb}
#apxLed{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px;background:#d33;vertical-align:middle}
#apxLed.on{background:#2ecc71}
`;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);

  /* ---------------- UI ---------------- */
  const panel = document.createElement('div');
  panel.id = 'apxPanel';
  panel.innerHTML = `
  <h3 id="apxTitle">
    <span id="apxTitleLeft"></span>
    <button id="apxLangBtn" type="button" aria-label="Language"><span class="emoji">🌐</span></button>
    <div id="apxLangMenu" role="menu" aria-label="Language menu">
      <div class="head"><span id="apxLangHeader"></span></div>
      <div id="apxLangList"></div>
      <div class="footer">
        <div id="apxLangPager">
          <button id="apxLangPrev" type="button">▲</button>
          <span id="apxLangPageLbl">1/1</span>
          <button id="apxLangNext" type="button">▼</button>
        </div>
        <button id="apxLangBack" type="button"></button>
      </div>
    </div>
  </h3>
  <div class="row">
    <label class="wide"><span class="i18n" data-k="local_image"></span>
      <input type="file" id="apxFile" accept="image/*">
    </label>
    <label><span class="i18n" data-k="x_world"></span>
      <input type="number" id="apxX" step="1" value="0">
    </label>
    <label><span class="i18n" data-k="y_world"></span>
      <input type="number" id="apxY" step="1" value="0">
    </label>
    <button id="apxSetMouse" class="wide"></button>
  </div>
  <div class="row">
    <label class="wide"><span class="i18n" data-k="scale_label"></span>
      <input type="range" id="apxScale" min="10" max="400" step="10" value="100">
      <span class="small" id="apxScaleInfo"></span>
    </label>
    <label class="wide"><span class="i18n" data-k="block_label"></span>
      <input type="range" id="apxBlock" min="1" max="15" step="2" value="3">
      <span class="small" id="apxBlockInfo"></span>
    </label>
    <label class="wide"><span class="i18n" data-k="rate_label"></span>
      <input type="range" id="apxRate" min="1" max="60" step="1" value="15">
      <span class="small" id="apxRateInfo"></span>
    </label>
  </div>
  <div class="row">
    <button id="apxStart" style="grid-column:1/2"></button>
    <button id="apxStop"  style="grid-column:2/2"></button>
    <button id="apxReset" class="wide"></button>
  </div>
  <div id="apxStatus"><span id="apxLed"></span><span id="apxMsg"></span></div>
`;
  document.body.append(panel);

  const $ = (sel) => panel.querySelector(sel);
  const titleLeft = $('#apxTitleLeft');
  const langBtn = $('#apxLangBtn'),
        langMenu = $('#apxLangMenu'),
        langHeader = $('#apxLangHeader'),
        langList = $('#apxLangList'),
        langBack = $('#apxLangBack'),
        langPrev = $('#apxLangPrev'),
        langNext = $('#apxLangNext'),
        langPageLbl = $('#apxLangPageLbl');

  const led = $('#apxLed'), msg = $('#apxMsg');
  const setStatus = (on, text) => { led.classList.toggle('on', !!on); msg.textContent = text || ''; };

  function applyDir(){
    const dir = RTL.has(LANG) ? 'rtl' : 'ltr';
    panel.dir = dir;
    langMenu.dir = dir;
  }

  // Position / paging
  function placeLangMenu() {
    const r = langBtn.getBoundingClientRect();
    langMenu.style.left = Math.max(8, r.right - 300) + 'px';
    langMenu.style.top = (r.bottom + 6) + 'px';
  }
  function totalPages(){ return Math.max(1, Math.ceil(LANGS.length / PAGE_SIZE)); }
  function clampPage(){ const tp=totalPages(); if(langPage<0) langPage=0; if(langPage>=tp) langPage=tp-1; }
  function buildLangList(){
    clampPage();
    langList.innerHTML='';
    const start = langPage * PAGE_SIZE;
    const slice = LANGS.slice(start, start + PAGE_SIZE);
    slice.forEach(({code,label,flag})=>{
      const opt=document.createElement('div');
      opt.className='opt';
      opt.innerHTML=`<span class="flag">${flag}</span><span class="name">${label}</span>${code===LANG?'<span style="margin-left:auto;opacity:.8">✓</span>':''}`;
      opt.addEventListener('click',(e)=>{
        e.stopPropagation();
        LANG=code; localStorage.setItem(langKey,LANG);
        applyTexts(); applyDir();
        buildLangList();
      });
      langList.append(opt);
    });
    langPageLbl.textContent = `${langPage+1}/${totalPages()}`;
    localStorage.setItem('apxLangPage', String(langPage));
  }
  function openLang(){ langHeader.textContent=t('lang_label'); langBack.textContent=t('back'); buildLangList(); placeLangMenu(); langMenu.classList.add('open'); }
  function closeLang(){ langMenu.classList.remove('open'); }
  langBtn.addEventListener('click',(e)=>{ e.stopPropagation(); if(langMenu.classList.contains('open')) closeLang(); else openLang(); });
  langBack.addEventListener('click',(e)=>{ e.stopPropagation(); closeLang(); });
  langPrev.addEventListener('click',(e)=>{ e.stopPropagation(); langPage--; buildLangList(); });
  langNext.addEventListener('click',(e)=>{ e.stopPropagation(); langPage++; buildLangList(); });
  document.addEventListener('click',(e)=>{ if(!panel.contains(e.target)) closeLang(); }, true);
  window.addEventListener('resize',()=>{ if(langMenu.classList.contains('open')) placeLangMenu(); });

  /* ---------------- Draggable panel ---------------- */
  const MIN_TOP=4;
  (function(){
    const title=document.getElementById('apxTitle');
    let dragging=false,sx=0,sy=0,sl=0,st=0;
    try{ const sv=localStorage.getItem('apxPanelPos'); if(sv){ const {left,top}=JSON.parse(sv); panel.style.left=left+'px'; panel.style.top=Math.max(MIN_TOP,top)+'px'; panel.style.right='auto'; } }catch(_){}
    title.addEventListener('mousedown',(e)=>{
      if (e.target.closest('#apxLangBtn') || e.target.closest('#apxLangMenu')) return;
      dragging=true;
      const r=panel.getBoundingClientRect(); sx=e.clientX; sy=e.clientY; sl=r.left; st=r.top;
      window.addEventListener('mousemove',onMove); window.addEventListener('mouseup',onUp); e.preventDefault();
    });
    function onMove(e){ if(!dragging) return; panel.style.left=(sl+(e.clientX-sx))+'px'; panel.style.top=Math.max(MIN_TOP,(st+(e.clientY-sy)))+'px'; panel.style.right='auto'; }
    function onUp(){ if(!dragging) return; dragging=false; window.removeEventListener('mousemove',onMove); window.removeEventListener('mouseup',onUp); const r=panel.getBoundingClientRect(); try{localStorage.setItem('apxPanelPos',JSON.stringify({left:r.left,top:r.top}))}catch(_){} }
  })();

  /* ---------------- Image buffer ---------------- */
  let srcBmp=null, srcW=0, srcH=0, scalePct=100, tgtW=0, tgtH=0, imgData=null, hasImage=false;
  const imgC=document.createElement('canvas'), imgCtx=imgC.getContext('2d',{willReadFrequently:true});

  async function loadBitmap(file){
    if (window.createImageBitmap) { try{ return await createImageBitmap(file); }catch(e){ console.warn('createImageBitmap failed',e); } }
    return await new Promise((resolve, reject)=>{
      const url=URL.createObjectURL(file); const img=new Image(); img.decoding='async';
      img.onload=()=>{ URL.revokeObjectURL(url); resolve(img); };
      img.onerror=()=>{ URL.revokeObjectURL(url); reject(new Error('Image load error')); };
      img.src=url;
    });
  }
  function rebuildScaled(){
    if(!srcBmp) return;
    tgtW=Math.max(1,Math.round(srcW*scalePct/100));
    tgtH=Math.max(1,Math.round(srcH*scalePct/100));
    imgC.width=tgtW; imgC.height=tgtH;
    imgCtx.imageSmoothingEnabled=false;
    imgCtx.clearRect(0,0,tgtW,tgtH);
    imgCtx.drawImage(srcBmp,0,0,srcW,srcH,0,0,tgtW,tgtH);
    imgData=imgCtx.getImageData(0,0,tgtW,tgtH);
    $('#apxScaleInfo').textContent=t('scale_info',scalePct,tgtW,tgtH);
  }
  function getImgRGB(ix,iy){ if(!imgData) return null; if(ix<0||iy<0||ix>=tgtW||iy>=tgtH) return null; const p=(iy*tgtW+ix)*4,d=imgData.data; if(d[p+3]<10) return null; return [d[p],d[p+1],d[p+2]]; }
  $('#apxFile').addEventListener('change', async (e)=>{ const f=e.target.files?.[0]; if(!f) return; try{ setStatus(false,t('loading_img')); const bmp=await loadBitmap(f); srcBmp=bmp; srcW=('width'in bmp)?bmp.width:bmp.naturalWidth; srcH=('height'in bmp)?bmp.height:bmp.naturalHeight; rebuildScaled(); hasImage=true; setStatus(false,t('loaded_img',srcW,srcH)); }catch(err){ console.error('[AutoPixel] load error →', err); hasImage=false; setStatus(false,t('failed_load')); alert(t('failed_load')); } });

  /* ---------------- OWOP API ---------------- */
  function waitForOWOP(maxMs=30000){ return new Promise((res,rej)=>{ const t0=Date.now(); const iv=setInterval(()=>{ if(window.OWOP&&OWOP.world){clearInterval(iv);res();} else if(Date.now()-t0>maxMs){clearInterval(iv);rej(new Error('OWOP timeout'));}},100);}); }
  let owopSetMode=null;
  function owopPlace(wx,wy,rgb){ try{ if(owopSetMode==='array') return OWOP.world.setPixel(wx,wy,rgb); if(owopSetMode==='args') return OWOP.world.setPixel(wx,wy,rgb[0],rgb[1],rgb[2]); try{ const r1=OWOP.world.setPixel(wx,wy,rgb); owopSetMode='array'; return r1; }catch(_){ const r2=OWOP.world.setPixel(wx,wy,rgb[0],rgb[1],rgb[2]); owopSetMode='args'; return r2; } }catch(_){ return false; } }
  function owopGet(wx,wy){ try{ const p=OWOP.world.getPixel(wx,wy); if(!p) return null; if(Array.isArray(p)) return p; if(typeof p.r==='number') return [p.r,p.g,p.b]; }catch(_){ } return null; }

  /* ---------------- Queue & scanning ---------------- */
  const state={ x0:0, y0:0, block:3, rate:15, running:false, pass:1 };
  const queue=[]; const Q_MAX=5000, Q_LOW=500, BACKOFF=600;
  let scanX=0, scanY=0, scannedAll=false;

  function feedQueue(){
    if(!imgData||scannedAll) return;
    while(queue.length<Q_MAX && !scannedAll){
      const b=state.block;
      for(let dy=0;dy<b;dy++){
        for(let dx=0;dx<b;dx++){
          const ix=scanX+dx, iy=scanY+dy;
          if(ix>=tgtW||iy>=tgtH) continue;
          const rgb=getImgRGB(ix,iy); if(!rgb) continue;
          queue.push({wx:state.x0+ix, wy:state.y0+iy, r:rgb[0], g:rgb[1], b:rgb[2], due:0, tries:0});
          if(queue.length>=Q_MAX) break;
        }
        if(queue.length>=Q_MAX) break;
      }
      scanX+=state.block;
      if (scanX>=tgtW){ scanX=0; scanY+=state.block; }
      if (scanY>=tgtH){ scannedAll=true; }
    }
  }

  /* ---------------- Verification pass ---------------- */
  let vX=0,vY=0,verifyDone=true;
  function beginVerify(){ vX=0; vY=0; verifyDone=false; }
  function owopFeedVerify(){
    if(!imgData||verifyDone) return;
    while(queue.length<Q_MAX && !verifyDone){
      const rgb=getImgRGB(vX,vY);
      if(rgb){
        const cur=owopGet(state.x0+vX, state.y0+vY);
        if(!(cur && cur[0]===rgb[0] && cur[1]===rgb[1] && cur[2]===rgb[2])){
          queue.push({wx:state.x0+vX, wy:state.y0+vY, r:rgb[0], g:rgb[1], b:rgb[2], due:0, tries:0});
        }
      }
      vX++; if(vX>=tgtW){ vX=0; vY++; }
      if(vY>=tgtH){ verifyDone=true; }
    }
  }

  /* ---------------- Placement loop ---------------- */
  function rgbEq(a,b){ return a && b && a[0]===b[0] && a[1]===b[1] && a[2]===b[2]; }
  let tickTimer=null;
  function setRate(){ if(tickTimer) clearInterval(tickTimer); const iv=Math.max(10, Math.round(1000/state.rate)); tickTimer=setInterval(tick,iv); }

  function tick(){
    if(!state.running) return;
    const now=performance.now();
    let idx=-1; for(let i=0;i<queue.length;i++){ if(queue[i].due<=now){ idx=i; break; } }
    if(idx===-1) return;
    const tsk=queue.splice(idx,1)[0];
    const want=[tsk.r,tsk.g,tsk.b];
    const cur=owopGet(tsk.wx,tsk.wy);
    let ok = cur && rgbEq(cur,want) ? true : !!owopPlace(tsk.wx,tsk.wy,want);
    if(!ok){ tsk.tries++; tsk.due=now + BACKOFF*Math.min(6,tsk.tries); queue.push(tsk); }
    const prog=scannedAll?100:Math.floor(((scanY*tgtW+scanX)/(tgtW*tgtH))*100);
    const pass=(state.pass===1)?t('pass12'):t('pass22');
    setStatus(true, t('status_scan', pass, queue.length, prog));
  }

  /* ---------------- Watcher ---------------- */
  setInterval(()=>{
    if(!state.running) return;
    if(state.pass===1){
      if(!scannedAll && queue.length<Q_LOW) feedQueue();
      if(queue.length===0 && scannedAll){
        state.pass=2; beginVerify(); setStatus(true,t('verifying_pass2'));
        if(queue.length<Q_LOW) owopFeedVerify();
      }
    } else {
      if(!verifyDone && queue.length<Q_LOW) owopFeedVerify();
      if(verifyDone && queue.length===0){ stopAll(); setStatus(false,t('done')); }
    }
  },200);

  /* ---------------- UI events ---------------- */
  $('#apxSetMouse').addEventListener('click', ()=>{
    if (window.OWOP && OWOP.mouse){
      $('#apxX').value = OWOP.mouse.tileX;
      $('#apxY').value = OWOP.mouse.tileY;
    } else {
      alert(t('owop_not_ready_mouse'));
    }
  });

  function startAll(){
    if(!imgData){ alert(t('need_image_first')); return; }
    state.x0 = parseInt($('#apxX').value||'0',10)||0;
    state.y0 = parseInt($('#apxY').value||'0',10)||0;
    state.block = parseInt($('#apxBlock').value||'3',10)||3; if(state.block%2===0){ state.block++; $('#apxBlock').value=String(state.block); }
    state.rate  = Math.max(1, parseInt($('#apxRate').value||'15',10));
    queue.length=0; scanX=scanY=0; scannedAll=false; state.pass=1; verifyDone=true;
    feedQueue(); setRate(); setStatus(true,t('started_pass1')); state.running=true;
  }
  function stopAll(){ state.running=false; if(tickTimer) clearInterval(tickTimer); setStatus(false,t('stopped')); }
  $('#apxStart').addEventListener('click', async ()=>{ try{ await waitForOWOP(); startAll(); }catch(_){ alert(t('owop_timeout')); } });
  $('#apxStop').addEventListener('click', stopAll);
  $('#apxReset').addEventListener('click', ()=>{ stopAll(); queue.length=0; scanX=scanY=0; scannedAll=false; verifyDone=true; setStatus(false,t('progress_reset')); });

  $('#apxBlock').addEventListener('input', ()=>{ let v=parseInt($('#apxBlock').value,10)||1; if(v%2===0) v++; $('#apxBlock').value=String(v); state.block=v; $('#apxBlockInfo').textContent=t('block_info',v); });
  $('#apxScale').addEventListener('input', ()=>{ scalePct=parseInt($('#apxScale').value,10)||100; rebuildScaled(); });
  $('#apxRate').addEventListener('input',  ()=>{ state.rate=Math.max(1,parseInt($('#apxRate').value,10)||15); $('#apxRateInfo').textContent=t('rate_info',state.rate); if(state.running) setRate(); });

  /* ---------------- Textes init ---------------- */
  function applyTexts(){
    titleLeft.textContent=t('title');
    panel.querySelectorAll('.i18n').forEach(el=>{ el.textContent=t(el.getAttribute('data-k')); });
    $('#apxSetMouse').textContent=t('take_xy');
    $('#apxStart').textContent=t('start');
    $('#apxStop').textContent=t('stop');
    $('#apxReset').textContent=t('reset');
    $('#apxScaleInfo').textContent=t('scale_info',scalePct,tgtW,tgtH);
    $('#apxBlockInfo').textContent=t('block_info',state.block);
    $('#apxRateInfo').textContent=t('rate_info',state.rate);
    if(!hasImage) setStatus(false,t('waiting_img'));
  }
  applyTexts(); applyDir(); buildLangList();

})();
