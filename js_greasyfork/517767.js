// ==UserScript==
// @name Twitter/X Timeline Sync
// @description Tracks and syncs your last reading position on Twitter/X, with manual and automatic options. Ideal for keeping track of new posts without losing your place. Uses Tweet ID for precise positioning and supports reposts.
// @description:de Verfolgt und synchronisiert Ihre letzte Leseposition auf Twitter/X, mit manuellen und automatischen Optionen. Perfekt, um neue Beiträge im Blick zu behalten, ohne die aktuelle Position zu verlieren. Verwendet Tweet-ID für präzise Positionierung und Unterstützung für Reposts.
// @description:es Rastrea y sincroniza tu última posición de lectura en Twitter/X, con opciones manuales y automáticas. Ideal para mantener el seguimiento de las publicaciones nuevas sin perder tu posición. Usa ID de Tweet para posicionamiento preciso y soporte para reposts.
// @description:fr Suit et synchronise votre dernière position de lecture sur Twitter/X, avec des options manuelles et automatiques. Idéal pour suivre les nouveaux posts sans perdre votre place actuelle. Utilise l'ID du Tweet pour un positionnement précis et prise en charge des reposts.
// @description:zh-CN 跟踪并同步您在 Twitter/X 上的最后阅读位置，提供手动和自动选项。完美解决在查看新帖子时不丢失当前位置的问题。使用 Tweet ID 进行精确位置定位和对转发的支持。
// @description:ru Отслеживает и синхронизирует вашу последнюю позицию чтения на Twitter/X с ручными и автоматическими опциями. Идеально подходит для просмотра новых постов без потери текущей позиции. Использует ID твита для точного позиционирования и поддержкой репостов.
// @description:ja Twitter/X での最後の読み取り位置を追跡して同期します。手動および自動オプションを提供します。新しい投稿を見逃さずに現在の位置を維持するのに最適です。ツイートIDを使用して正確な位置特定を行い、リポストをサポートします。
// @description:pt-BR Rastrea e sincroniza sua última posição de lectura no Twitter/X, com opções manuais e automáticas. Perfeito para acompanhar novos posts sem perder sua posição atual. Usa ID do Tweet para posicionamiento preciso e suporte a reposts.
// @description:hi Twitter/X पर आपकी अंतिम पठन स्थिति को ट्रैक और सिंक करता है, मैनुअल और स्वचालित विकल्पों के साथ। नई पोस्ट देखते समय अपनी वर्तमान स्थिति को खोए बिना इसे ट्रैक करें। सटीक स्थिति के लिए ट्वीट ID का उपयोग करता है और रीपोस्ट समर्थन के साथ।
// @description:ar يتتبع ويزامن آخر موضع قراءة لك على Twitter/X، مع خيارات يدوية وتلقائية. مثالي لتتبع المشاركات الجديدة دون فقدان موضعك الحالي. يستخدم معرف التغريدة لتحديد الموضع بدقة ودعم إعادة النشر.
// @description:it Traccia e sincronizza la tua ultima posizione di lettura su Twitter/X, con opzioni manuali e automatiche. Ideale per tenere traccia dei nuovi post senza perdere la posizione attuale. Usa l'ID del Tweet per un posizionamento preciso e supporto per i repost.
// @description:ko Twitter/X에서 마지막 읽기 위치를 추적하고 동기화합니다. 수동 및 자동 옵션 포함. 새로운 게시물을 확인하면서 현재 위치를 잃지 않도록 이상적입니다. 트윗 ID를 사용하여 정확한 위치 지정을 하고, 리포스트를 지원합니다。
// @icon https://x.com/favicon.ico
// @namespace http://tampermonkey.net/
// @version 2026.1.18
// @author Copiis
// @license MIT
// @match https://x.com/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_registerMenuCommand
// @description If you find this script useful and would like to support my work, consider making a small donation!
// @description Bitcoin (BTC): bc1quc5mkudlwwkktzhvzw5u2nruxyepef957p68r7
// @description PayPal: https://www.paypal.com/paypalme/Coopiis?country.x=DE&locale.x=de_DE
// @downloadURL https://update.greasyfork.org/scripts/517767/TwitterX%20Timeline%20Sync.user.js
// @updateURL https://update.greasyfork.org/scripts/517767/TwitterX%20Timeline%20Sync.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Übersetzungen für alle Popup-Nachrichten
    const translations = {
        en: {
            noValidPosition: "❌ No valid reading position to download.",
            alreadyDownloaded: "ℹ️ This reading position has already been downloaded.",
            downloadSuccess: "✅ Reading position downloaded as {fileName}.",
            downloadFailed: "❌ Download failed. Reading position copied to clipboard. Please paste it into a .json file manually.",
            downloadClipboardFailed: "❌ Download and clipboard copy failed. Please save manually.",
            noPositionFound: "ℹ️ Scroll to set a reading position.",
            scriptError: "❌ Error loading the script.",
            invalidPosition: "❌ Invalid reading position.",
            fileSelectError: "❌ Please select a JSON file.",
            fileReadError: "❌ Error reading the file.",
            fileDialogError: "❌ Error opening file dialog.",
            fileLoadSuccess: "✅ Reading position successfully loaded!",
            buttonsError: "❌ Error displaying buttons.",
            oldPositionWarning: "⚠️ The saved reading position is older than 24 hours. Continue searching?",
            searchPopup: "🔍 Searching for position: @{authorHandler} - Tweet: {tweetId}... Press Space to cancel.",
            searchNoPosition: "❌ No reading position available.",
            searchScrollPrompt: "ℹ️ Please scroll or click the magnifier.",
            tweetIdNotFound: "❌ Tweet ID not found, using closest post by timestamp.",
            postDeletedFallback: "ℹ️ Post possibly deleted - using closest post by timestamp.",
            newPostsDetectionDelayed: "ℹ️ No new posts detected after checking. Please refresh or scroll to load them.",
            autoDownloadToggled: "ℹ️ Auto-download {status}.",
            enabled: "enabled",
            disabled: "disabled",
            fallbackSearchCancelled: "ℹ️ Fallback search cancelled.",
            redirectToHome: "ℹ️ Redirecting to home to search for reading position.",
            saveError: "❌ Save failed after retries. Data may be lost."
        },
        de: {
            noValidPosition: "❌ Keine gültige Leseposition zum Downloaden.",
            alreadyDownloaded: "ℹ️ Diese Leseposition wurde bereits heruntergeladen.",
            downloadSuccess: "✅ Leseposition als {fileName} heruntergeladen.",
            downloadFailed: "❌ Download fehlgeschlagen. Leseposition wurde in die Zwischenablage kopiert. Bitte manuell in eine .json-Datei einfügen.",
            downloadClipboardFailed: "❌ Download und Kopieren fehlgeschlagen. Bitte manuell speichern.",
            noPositionFound: "ℹ️ Scrolle, um eine Leseposition zu setzen.",
            scriptError: "❌ Fehler beim Laden des Skripts.",
            invalidPosition: "❌ Ungültige Leseposition.",
            fileSelectError: "❌ Bitte wähle eine JSON-Datei aus.",
            fileReadError: "❌ Fehler beim Lesen der Datei.",
            fileDialogError: "❌ Fehler beim Öffnen des Datei-Dialogs.",
            fileLoadSuccess: "✅ Leseposition erfolgreich geladen!",
            buttonsError: "❌ Fehler beim Anzeigen der Buttons.",
            oldPositionWarning: "⚠️ Die gespeicherte Leseposition ist älter als 24 Stunden. Suche fortsetzen?",
            searchPopup: "🔍 Suche läuft für Position: @{authorHandler} - Tweet: {tweetId}... Drücke Space zum Abbrechen.",
            searchNoPosition: "❌ Keine Leseposition vorhanden.",
            searchScrollPrompt: "ℹ️ Bitte scrollen oder Lupe klicken.",
            tweetIdNotFound: "❌ Tweet-ID nicht gefunden, verwende zeitlich nächsten Post.",
            postDeletedFallback: "ℹ️ Beitrag möglicherweise gelöscht - verwende zeitlich nächsten Post.",
            newPostsDetectionDelayed: "ℹ️ Keine neuen Beiträge nach Prüfung erkannt. Bitte die Seite aktualisieren oder scrollen, um sie zu laden.",
            autoDownloadToggled: "ℹ️ Automatischer Download {status}.",
            enabled: "aktiviert",
            disabled: "deaktiviert",
            fallbackSearchCancelled: "ℹ️ Fallback-Suche abgebrochen.",
            redirectToHome: "ℹ️ Weiterleitung zur Startseite, um die Leseposition zu suchen.",
            saveError: "❌ Speichern fehlgeschlagen nach Wiederholungen. Daten könnten verloren gehen."
        },
        // ... (alle anderen Sprachen bleiben unverändert, um den Code nicht unnötig zu verlängern)
        es: {
            noValidPosition: "❌ No hay posición de lectura válida para descargar.",
            alreadyDownloaded: "ℹ️ Esta posición de lectura ya ha sido descargada.",
            downloadSuccess: "✅ Posición de lectura descargada como {fileName}.",
            downloadFailed: "❌ Falló la descarga. La posición de lectura se copió al portapapeles. Pégala manualmente en un archivo .json.",
            downloadClipboardFailed: "❌ Falló la descarga y la copia al portapapeles. Por favor, guarda manualmente.",
            noPositionFound: "ℹ️ Desplázate para establecer una posición de lectura.",
            scriptError: "❌ Error al cargar el script.",
            invalidPosition: "❌ Posición de lectura no válida.",
            fileSelectError: "❌ Por favor, selecciona un archivo JSON.",
            fileReadError: "❌ Error al leer el archivo.",
            fileDialogError: "❌ Error al abrir el diálogo de archivo.",
            fileLoadSuccess: "✅ ¡Posición de lectura cargada con éxito!",
            buttonsError: "❌ Error al mostrar los botones.",
            searchPopup: "🔍 Buscando posición: @{authorHandler} - Tweet: {tweetId}... Presiona ESPACIO para cancelar.",
            searchNoPosition: "❌ No hay posición de lectura disponible.",
            searchScrollPrompt: "ℹ️ Por favor, desplázate o haz clic en la lupa.",
            tweetIdNotFound: "❌ ID de Tweet no encontrado, usando el post más cercano por timestamp.",
            postDeletedFallback: "ℹ️ Publicación posiblemente eliminada - usando el post más cercano por timestamp.",
            newPostsDetectionDelayed: "ℹ️ No se detectaron nuevas publicaciones después de verificar. Por favor, actualiza o desplázate para cargarlas.",
            autoDownloadToggled: "ℹ️ Descarga automática {status}.",
            enabled: "activada",
            disabled: "desactivada",
            fallbackSearchCancelled: "ℹ️ Búsqueda fallback cancelada.",
            saveError: "❌ Falló el guardado después de reintentos. Los datos podrían perderse."
        },
        // (Weitere Sprachen: fr, zh-CN, ru, ja, pt-BR, hi, ar, it, ko – unverändert, da keine Änderungen nötig)
        fr: {
            noValidPosition: "❌ Aucune position de lecture valide à télécharger.",
            alreadyDownloaded: "ℹ️ Cette position de lecture a déjà été téléchargée.",
            downloadSuccess: "✅ Position de lecture téléchargée sous {fileName}.",
            downloadFailed: "❌ Échec du téléchargement. Position de lecture copiée dans le presse-papiers. Veuillez la coller manuellement dans un fichier .json.",
            downloadClipboardFailed: "❌ Échec du téléchargement et de la copie dans le presse-papiers. Veuillez sauvegarder manuellement.",
            noPositionFound: "ℹ️ Faites défiler pour définir une position de lecture.",
            scriptError: "❌ Erreur lors du chargement du script.",
            invalidPosition: "❌ Position de lecture invalide.",
            fileSelectError: "❌ Veuillez sélectionner un fichier JSON.",
            fileReadError: "❌ Erreur lors de la lecture du fichier.",
            fileDialogError: "❌ Erreur lors de l'ouverture de la boîte de dialogue.",
            fileLoadSuccess: "✅ Position de lecture chargée avec succès !",
            buttonsError: "❌ Erreur lors de l'affichage des boutons.",
            searchPopup: "🔍 Recherche en cours pour position: @{authorHandler} - Tweet: {tweetId}... Appuyez sur ESPACE pour annuler.",
            searchNoPosition: "❌ Aucune position de lecture disponible.",
            searchScrollPrompt: "ℹ️ Veuillez faire défiler ou cliquer sur la loupe.",
            tweetIdNotFound: "❌ ID de Tweet non trouvé, utilisant le post le plus proche par timestamp.",
            postDeletedFallback: "ℹ️ Post éventuellement supprimé - utilisant le post le plus proche par timestamp.",
            newPostsDetectionDelayed: "ℹ️ Aucun nouveau post détecté après vérification. Veuillez actualiser ou défiler pour les charger.",
            autoDownloadToggled: "ℹ️ Téléchargement automatique {status}.",
            enabled: "activé",
            disabled: "désactivé",
            fallbackSearchCancelled: "ℹ️ Recherche de fallback annulée.",
            saveError: "❌ Échec de la sauvegarde après réessais. Les données pourraient être perdues."
        },
        'zh-CN': {
            noValidPosition: "❌ 没有有效的阅读位置可以下载。",
            alreadyDownloaded: "ℹ️ 此阅读位置已下载。",
            downloadSuccess: "✅ 阅读位置已下载为 {fileName}。",
            downloadFailed: "❌ 下载失败。阅读位置已复制到剪贴板。请手动粘贴到 .json 文件中。",
            downloadClipboardFailed: "❌ 下载和剪贴板复制失败。请手动保存。",
            noPositionFound: "ℹ️ 滚动以设置阅读位置。",
            scriptError: "❌ 加载脚本时出错。",
            invalidPosition: "❌ 无效的阅读位置。",
            fileSelectError: "❌ 请选择一个 JSON 文件。",
            fileReadError: "❌ 读取文件时出错。",
            fileDialogError: "❌ 打开文件对话框时出错。",
            fileLoadSuccess: "✅ 阅读位置加载成功！",
            buttonsError: "❌ 显示按钮时出错。",
            searchPopup: "🔍 正在搜索位置: @{authorHandler} - Tweet: {tweetId}... 按空格键取消。",
            searchNoPosition: "❌ 没有可用的阅读位置。",
            searchScrollPrompt: "ℹ️ 请滚动或点击放大镜。",
            tweetIdNotFound: "❌ 未找到推文ID，使用时间戳最近的帖子。",
            postDeletedFallback: "ℹ️ 帖子可能已删除 - 使用时间戳最近的帖子。",
            newPostsDetectionDelayed: "ℹ️ 检查后未检测到新帖子。请刷新或滚动以加载它们。",
            autoDownloadToggled: "ℹ️ 自动下载 {status}。",
            enabled: "启用",
            disabled: "禁用",
            fallbackSearchCancelled: "ℹ️ Fallback搜索已取消。",
            saveError: "❌ 重试后保存失败。数据可能丢失。"
        },
        ru: {
            noValidPosition: "❌ Нет действительной позиции чтения для загрузки.",
            alreadyDownloaded: "ℹ️ Эта позиция чтения уже была загружена.",
            downloadSuccess: "✅ Позиция чтения загружена как {fileName}.",
            downloadFailed: "❌ Не удалось выполнить загрузку. Позиция чтения скопирована в буфер обмена. Пожалуйста, вставьте вручную в файл .json.",
            downloadClipboardFailed: "❌ Не удалось выполнить загрузку и копирование в буфер обмена. Пожалуйста, сохраните вручную.",
            noPositionFound: "ℹ️ Прокрутите, чтобы установить позицию чтения.",
            scriptError: "❌ Ошибка при загрузке скрипта.",
            invalidPosition: "❌ Недействительная позиция чтения.",
            fileSelectError: "❌ Пожалуйста, выберите файл JSON.",
            fileReadError: "❌ Ошибка при чтении файла.",
            fileDialogError: "❌ Ошибка при открытии диалогового окна.",
            fileLoadSuccess: "✅ Позиция чтения успешно загружена!",
            buttonsError: "❌ Ошибка при отображении кнопок.",
            searchPopup: "🔍 Поиск позиции: @{authorHandler} - Tweet: {tweetId}... Нажмите ПРОБЕЛ для отмены.",
            searchNoPosition: "❌ Позиция чтения недоступна.",
            searchScrollPrompt: "ℹ️ Прокрутите или нажмите на лупу.",
            tweetIdNotFound: "❌ ID твита не найден, использование ближайшего поста по временной метке.",
            postDeletedFallback: "ℹ️ Пост возможно удален - использование ближайшего поста по временной метке.",
            newPostsDetectionDelayed: "ℹ️ После проверки новых постов не обнаружено. Пожалуйста, обновите или прокрутите, чтобы загрузить их.",
            autoDownloadToggled: "ℹ️ Автоматическая загрузка {status}.",
            enabled: "включено",
            disabled: "отключено",
            fallbackSearchCancelled: "ℹ️ Fallback-поиск отменен.",
            saveError: "❌ Сохранение не удалось после повторных попыток. Данные могут быть потеряны."
        },
        ja: {
            noValidPosition: "❌ ダウンロードする有効な読み取り位置がありません。",
            alreadyDownloaded: "ℹ️ この読み取り位置はすでにダウンロードされています。",
            downloadSuccess: "✅ 読み取り位置が{fileName}としてダウンロードされました。",
            downloadFailed: "❌ ダウンロードに失敗しました。読み取り位置がクリップボードにコピーされました。手動で.jsonファイルに貼り付けてください。",
            downloadClipboardFailed: "❌ ダウンロードおよびクリップボードへのコピーに失敗しました。手動で保存してください。",
            noPositionFound: "ℹ️ スクロールして読み取り位置を設定してください。",
            scriptError: "❌ スクリプトの読み込み中にエラーが発生しました。",
            invalidPosition: "❌ 無効な読み取り位置です。",
            fileSelectError: "❌ JSONファイルを選択してください。",
            fileReadError: "❌ ファイルの読み込み中にエラーが発生しました。",
            fileDialogError: "❌ ファイルダイアログのオープン中にエラーが発生しました。",
            fileLoadSuccess: "✅ 読み取り位置が正常にロードされました！",
            buttonsError: "❌ ボタンの表示中にエラーが発生しました。",
            searchPopup: "🔍 位置を検索中: @{authorHandler} - Tweet: {tweetId}... スペースキーを押してキャンセル。",
            searchNoPosition: "❌ 読み取り位置がありません。",
            searchScrollPrompt: "ℹ️ スクロールするか、虫眼鏡をクリックしてください。",
            tweetIdNotFound: "❌ ツイートIDが見つかりません。タイムスタンプに最も近い投稿を使用します。",
            postDeletedFallback: "ℹ️ 投稿が削除された可能性 - タイムスタンプに最も近い投稿を使用。",
            newPostsDetectionDelayed: "ℹ️ チェック後、新しい投稿は検出されませんでした。ページを更新するかスクロールしてロードしてください。",
            autoDownloadToggled: "ℹ️ 自動ダウンロード {status}。",
            enabled: "有効",
            disabled: "無効",
            fallbackSearchCancelled: "ℹ️ Fallback検索がキャンセルされました。",
            saveError: "❌ リトライ後、保存に失敗しました。データが失われる可能性があります。"
        },
        'pt-BR': {
            noValidPosition: "❌ Nenhuma posição de leitura válida para download.",
            alreadyDownloaded: "ℹ️ Esta posição de leitura já foi baixada.",
            downloadSuccess: "✅ Posição de leitura baixada como {fileName}.",
            downloadFailed: "❌ Falha no download. Posição de leitura copiada para a área de transferência. Cole manualmente em um arquivo .json.",
            downloadClipboardFailed: "❌ Falha no download e na cópia para a área de transferência. Por favor, salve manualmente.",
            noPositionFound: "ℹ️ Role para definir uma posição de leitura.",
            scriptError: "❌ Erro ao carregar o script.",
            invalidPosition: "❌ Posição de leitura inválida.",
            fileSelectError: "❌ Por favor, selecione um arquivo JSON.",
            fileReadError: "❌ Erro ao ler o arquivo.",
            fileDialogError: "❌ Erro ao abrir o diálogo de arquivo.",
            fileLoadSuccess: "✅ Posição de leitura carregada com sucesso!",
            buttonsError: "❌ Erro ao exibir os botões.",
            searchPopup: "🔍 Pesquisando posição: @{authorHandler} - Tweet: {tweetId}... Pressione ESPAÇO para cancelar.",
            searchNoPosition: "❌ Nenhuma posição de leitura disponível.",
            searchScrollPrompt: "ℹ️ Role ou clique na lupa.",
            tweetIdNotFound: "❌ ID do Tweet não encontrado, usando o post mais próximo por timestamp.",
            postDeletedFallback: "ℹ️ Post possivelmente deletado - usando o post mais próximo por timestamp.",
            newPostsDetectionDelayed: "ℹ️ Nenhum novo post detectado após verificação. Por favor, atualize ou role para carregá-los.",
            autoDownloadToggled: "ℹ️ Download automático {status}.",
            enabled: "ativado",
            disabled: "desativado",
            fallbackSearchCancelled: "ℹ️ Pesquisa fallback cancelada.",
            saveError: "❌ Falha no salvamento após tentativas. Os dados podem ser perdidos."
        },
        hi: {
            noValidPosition: "❌ डाउनलोड करने के लिए कोई वैध पढ़ने की स्थिति नहीं है।",
            alreadyDownloaded: "ℹ️ यह पढ़ने की स्थिति पहले ही डाउनलोड की जा चुकी है।",
            downloadSuccess: "✅ पढ़ने की स्थिति {fileName} के रूप में डाउनलोड की गई।",
            downloadFailed: "❌ डाउनलोड विफल। पढ़ने की स्थिति क्लिपबोर्ड में कॉपी की गई है। कृपया इसे मैन्युअल रूप से .json फ़ाइल में पेस्ट करें।",
            downloadClipboardFailed: "❌ डाउनलोड और क्लिपबोर्ड कॉपी विफल। कृपया मैन्युअल रूप से सहेजें।",
            noPositionFound: "ℹ️ पढ़ने की स्थिति सेट करने के लिए स्क्रॉल करें।",
            scriptError: "❌ स्क्रिप्ट लोड करने में त्रुटि।",
            invalidPosition: "❌ अमान्य पढ़ने की स्थिति।",
            fileSelectError: "❌ कृपया एक JSON फ़ाइल चुनें।",
            fileReadError: "❌ फ़ाइल पढ़ने में त्रुटि।",
            fileDialogError: "❌ फ़ाइल डायलॉग खोलने में त्रुटि।",
            fileLoadSuccess: "✅ पढ़ने की स्थिति सफलतापूर्वक लोड की गई!",
            buttonsError: "❌ बटनों को प्रदर्शित करने में त्रुटि।",
            searchPopup: "🔍 खोज चल रही है स्थिति के लिए: @{authorHandler} - Tweet: {tweetId}... रद्द करने के लिए स्पेस दबाएं।",
            searchNoPosition: "❌ कोई पढ़ने की स्थिति उपलब्ध नहीं है।",
            searchScrollPrompt: "ℹ️ कृपया स्क्रॉल करें या मैग्नीफायर पर क्लिक करें।",
            tweetIdNotFound: "❌ ट्वीट ID नहीं मिला, टाइमस्टैम्प के सबसे नजदीकी पोस्ट का उपयोग कर रहा है।",
            postDeletedFallback: "ℹ️ पोस्ट संभवतः हटा दी गई - टाइमस्टैम्प के सबसे नजदीकी पोस्ट का उपयोग कर रहा है।",
            newPostsDetectionDelayed: "ℹ️ जाँच के बाद कोई नए पोस्ट नहीं पाए गए। कृपया पेज रिफ्रेश करें या स्क्रॉल करें ताकि उन्हें लोड किया जा सके।",
            autoDownloadToggled: "ℹ️ स्वचालित डाउनलोड {status}।",
            enabled: "सक्षम",
            disabled: "अक्षम",
            fallbackSearchCancelled: "ℹ️ Fallback खोज रद्द की गई।",
            saveError: "❌ पुन: प्रयासों के बाद सहेजने में विफल। डेटा खो सकता है।"
        },
        ar: {
            noValidPosition: "❌ لا توجد مواضع قراءة صالحة للتحميل.",
            alreadyDownloaded: "ℹ️ تم تحميل موضع القراءة هذا بالفعل.",
            downloadSuccess: "✅ تم تحميل موضع القراءة باسم {fileName}.",
            downloadFailed: "❌ فشل التحميل. تم نسخ موضع القراءة إلى الحافظة. يرجى لصقه يدويًا في ملف .json.",
            downloadClipboardFailed: "❌ فشل التحميل والنسخ إلى الحافظة. يرجى الحفظ يدويًا.",
            noPositionFound: "ℹ️ قم بالتمرير لتحديد موضع القراءة.",
            scriptError: "❌ خطأ أثناء تحميل السكربت.",
            invalidPosition: "❌ موضع قراءة غير صالح.",
            fileSelectError: "❌ يرجى اختيار ملف JSON.",
            fileReadError: "❌ خطأ أثناء قراءة الملف.",
            fileDialogError: "❌ خطأ أثناء فتح حوار الملف.",
            fileLoadSuccess: "✅ تم تحميل موضع القراءة بنجاح!",
            buttonsError: "❌ خطأ أثناء عرض الأزرار.",
            searchPopup: "🔍 جارٍ البحث عن الموقع: @{authorHandler} - Tweet: {tweetId}... اضغط على مفتاح المسافة للإلغاء.",
            searchNoPosition: "❌ لا يوجد موضع قراءة متاح.",
            searchScrollPrompt: "ℹ️ يرجى التمرير أو النقر على العدسة المكبرة.",
            tweetIdNotFound: "❌ معرف التغريدة غير موجود، باستخدام المنشور الأقرب حسب الطابع الزمني.",
            postDeletedFallback: "ℹ️ المنشور ربما محذوف - باستخدام المنشور الأقرب حسب الطابع الزمني.",
            newPostsDetectionDelayed: "ℹ️ لم يتم الكشف عن مشاركات جديدة بعد التحقق. يرجى تحديث الصفحة أو التمرير لتحميلها.",
            autoDownloadToggled: "ℹ️ التحميل التلقائي {status}.",
            enabled: "مفعل",
            disabled: "معطل",
            fallbackSearchCancelled: "ℹ️ بحث Fallback ملغى.",
            saveError: "❌ فشل الحفظ بعد المحاولات. قد تفقد البيانات."
        },
        it: {
            noValidPosition: "❌ Nessuna posizione di lettura valida da scaricare.",
            alreadyDownloaded: "ℹ️ Questa posizione di lettura è già stata scaricata.",
            downloadSuccess: "✅ Posizione di lettura scaricata come {fileName}.",
            downloadFailed: "❌ Download fallito. Posizione di lettura copiata negli appunti. Incollala manualmente in un file .json.",
            downloadClipboardFailed: "❌ Download e copia negli appunti falliti. Salva manualmente.",
            noPositionFound: "ℹ️ Scorri per impostare una posizione di lettura.",
            scriptError: "❌ Errore durante il caricamento dello script.",
            invalidPosition: "❌ Posizione di lettura non valida.",
            fileSelectError: "❌ Seleziona un file JSON.",
            fileReadError: "❌ Errore durante la lettura del file.",
            fileDialogError: "❌ Errore durante l'apertura della finestra di dialogo.",
            fileLoadSuccess: "✅ Posizione di lettura caricata con successo!",
            buttonsError: "❌ Errore durante la visualizzazione dei pulsanti.",
            searchPopup: "🔍 Ricerca in corso per posizione: @{authorHandler} - Tweet: {tweetId}... Premi SPAZIO per annullare.",
            searchNoPosition: "❌ Nessuna posizione di lettura disponibile.",
            searchScrollPrompt: "ℹ️ Scorri o fai clic sulla lente d'ingrandimento.",
            tweetIdNotFound: "❌ ID del Tweet non trovato, utilizzo del post più vicino per timestamp.",
            postDeletedFallback: "ℹ️ Post possibilmente eliminato - utilizzo del post più vicino per timestamp.",
            newPostsDetectionDelayed: "ℹ️ Nessun nuovo post rilevato dopo il controllo. Per favore aggiorna o scorri per caricarli.",
            autoDownloadToggled: "ℹ️ Download automatico {status}.",
            enabled: "abilitato",
            disabled: "disabilitato",
            fallbackSearchCancelled: "ℹ️ Ricerca fallback annullata.",
            saveError: "❌ Salvataggio fallito dopo i tentativi. I dati potrebbero essere persi."
        },
        ko: {
            noValidPosition: "❌ 다운로드할 유효한 읽기 위치가 없습니다.",
            alreadyDownloaded: "ℹ️ 이 읽기 위치는 이미 다운로드되었습니다.",
            downloadSuccess: "✅ 읽기 위치가 {fileName}으로 다운로드되었습니다.",
            downloadFailed: "❌ 다운로드 실패. 읽기 위치가 클립보드에 복사되었습니다. .json 파일에 수동으로 붙여넣으세요.",
            downloadClipboardFailed: "❌ 다운로드 및 클립보드 복사 실패. 수동으로 저장하세요.",
            noPositionFound: "ℹ️ 읽기 위치를 설정하려면 스크롤하세요.",
            scriptError: "❌ 스크립트 로드 중 오류가 발생했습니다.",
            invalidPosition: "❌ 유효하지 않은 읽기 위치입니다.",
            fileSelectError: "❌ JSON 파일을 선택하세요.",
            fileReadError: "❌ 파일 읽기 중 오류가 발생했습니다.",
            fileDialogError: "❌ 파일 대화 상자를 여는 중 오류가 발생했습니다.",
            fileLoadSuccess: "✅ 읽기 위치가 성공적으로 로드되었습니다!",
            buttonsError: "❌ 버튼 표시 중 오류가 발생했습니다.",
            searchPopup: "🔍 위치 검색 중: @{authorHandler} - Tweet: {tweetId}... 취소하려면 스페이스바를 누르세요.",
            searchNoPosition: "❌ 사용 가능한 읽기 위치가 없습니다.",
            searchScrollPrompt: "ℹ️ 스크롤하거나 돋보기를 클릭하세요.",
            tweetIdNotFound: "❌ 트윗 ID를 찾을 수 없습니다. 타임스탬프에 가장 가까운 게시물을 사용합니다.",
            postDeletedFallback: "ℹ️ 게시물이 삭제되었을 수 있음 - 타임스탬프에 가장 가까운 게시물을 사용.",
            newPostsDetectionDelayed: "ℹ️ 확인 후 새로운 게시물이 감지되지 않았습니다. 페이지를 새로 고침하거나 스크롤하여 로드하세요.",
            autoDownloadToggled: "ℹ️ 자동 다운로드 {status}。",
            enabled: "활성화됨",
            disabled: "비활성화됨",
            fallbackSearchCancelled: "ℹ️ Fallback 검색이 취소되었습니다。",
            saveError: "❌ 재시도 후 저장 실패. 데이터가 손실될 수 있습니다."
        }
    };

    // Funktion zur Erkennung der Benutzersprache
    function getUserLanguage() {
        const lang = (navigator.language || navigator.languages[0] || 'en').toLowerCase();
        const langCode = lang.split('-')[0];
        return Object.keys(translations).find(key => key.toLowerCase().startsWith(langCode)) || 'en';
    }

    function getTranslatedMessage(key, lang, params = {}) {
        const translation = translations[lang] || translations['en'];
        let message = translation[key] || translations['en'][key] || key;
        Object.keys(params).forEach(param => {
            message = message.replace(`{${param}}`, params[param]);
        });
        return message;
    }

    function getSelectorFallback(element, selectors) {
        for (const selector of selectors) {
            const found = element.querySelector(selector);
            if (found) return found;
        }
        return null;
    }

    function debounce(fn, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
        };
    }

    async function getCurrentUserHandle() {
        return new Promise((resolve) => {
            const tryFromNav = () => {
                const navLink = document.querySelector('a[data-testid="AppTabBar_Profile_Link"][href^="/"]');
                if (navLink) {
                    const href = navLink.getAttribute("href");
                    const match = href.match(/^\/([^/]+)/);
                    if (match && match[1] && !['i', 'home', 'explore', 'messages', 'notifications'].includes(match[1])) {
                        return match[1];
                    }
                }
                return null;
            };
            const tryFromLocalStorage = () => {
                const storedHandle = localStorage.getItem('currentUserHandle');
                if (storedHandle && !['i', 'home', 'explore', 'messages', 'notifications'].includes(storedHandle)) {
                    return storedHandle;
                }
                return "unknown";
            };
            const saveHandle = (handle) => {
                if (handle && handle !== "unknown" && !['i', 'home', 'explore', 'messages', 'notifications'].includes(handle)) {
                    localStorage.setItem('currentUserHandle', handle);
                }
            };
            let handle = tryFromNav();
            if (handle && /^[a-zA-Z0-9_]{1,15}$/.test(handle)) {
                saveHandle(handle);
                resolve(handle);
                return;
            }
            const observer = new MutationObserver(() => {
                handle = tryFromNav();
                if (handle && /^[a-zA-Z0-9_]{1,15}$/.test(handle)) {
                    saveHandle(handle);
                    observer.disconnect();
                    resolve(handle);
                }
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
            setTimeout(() => {
                if (!handle) {
                    observer.disconnect();
                    handle = tryFromLocalStorage();
                    if (!/^[a-zA-Z0-9_]{1,15}$/.test(handle)) {
                        handle = "unknown";
                    }
                    console.warn("⚠️ Benutzerhandle konnte nicht ermittelt werden, Fallback auf:", handle);
                    resolve(handle);
                }
            }, 10000);
        });
    }

    const DEBUG = false;
    let isSlowScrollMode = false;
    let largeScrollCount = 0;
    const maxLargeScrolls = 5; // Nach 5 großen Scrolls automatisch in Slow-Mode wechseln
    let searchDirection = 'down'; // Standardrichtung: nach unten (neuere Posts zuerst)
    let scrollCyclePhase = 0;     // 0 = initial, 1 = nach oben, 2 = nach unten (Zyklus)
    let hasCompletedCycle = false;
    let stagnantScrollCount = 0;
    let lastScrollHeight = 0;
    let totalLoadedPosts = 0;
    let lastReadPost = null;
    let isAutoScrolling = false;
    let isSearching = false;
    let isFallbackSearching = false;
    let isSearchCancelled = false;
    let isScriptActivated = false;
    let currentPost = null;
    let lastHighlightedPost = null;
    let downloadedPosts = new Set(GM_getValue('downloadedPosts', []));
    let popup = null;
    let postCache = new Map(); // Map<HTMLElement, {tweetId, authorHandler, timestamp, isRepost}>
    let pendingNewPosts = 0;

    function updatePostCache(post) {
        if (!postCache.has(post)) {
            postCache.set(post, {
                tweetId: getPostTweetId(post),
                authorHandler: getPostAuthorHandler(post),
                timestamp: getPostTimestamp(post),
                isRepost: isPostRepost(post)
            });
        }
        return postCache.get(post);
    }

    function saveDownloadedPosts() {
        GM_setValue('downloadedPosts', Array.from(downloadedPosts));
    }

    const STORAGE_KEY = (account) => `lastReadPost_${account}`;
    const AUTO_DOWNLOAD_KEY = 'autoDownloadEnabled';
    let autoDownloadEnabled = GM_getValue(AUTO_DOWNLOAD_KEY, false);

    async function saveLastReadPost(postData) {
    if (!postData || !postData.account || !postData.tweetId) {
        console.warn("⚠️ Ungültige Daten – Speichern abgebrochen", postData);
        return;
    }

    const storageKey = STORAGE_KEY(postData.account);
    const historyKey = `postHistory_${postData.account}`;

    try {
        // Aktuelle Position speichern
        GM_setValue(storageKey, JSON.stringify(postData));

        // Historie laden + neuen Eintrag anhängen
        let history = GM_getValue(historyKey, []);
        history.push({
            ...postData,
            savedAt: new Date().toISOString()
        });

        // Nur die neuesten 50 behalten
        if (history.length > 50) {
            history = history.slice(-50);
        }

        GM_setValue(historyKey, history);

        console.log(`💾 Position + Historie gespeichert (${history.length}/50 Einträge)`);

    } catch (err) {
        console.error("❌ Fehler beim Speichern:", err);
        showPopup("saveError", 6000);
    }
}

    function toggleAutoDownload() {
        autoDownloadEnabled = !autoDownloadEnabled;
        GM_setValue(AUTO_DOWNLOAD_KEY, autoDownloadEnabled);
        const status = autoDownloadEnabled ? getTranslatedMessage('enabled', getUserLanguage()) : getTranslatedMessage('disabled', getUserLanguage());
        showPopup('autoDownloadToggled', 3000, { status });
    }

    GM_registerMenuCommand(`Auto-Download ${autoDownloadEnabled ? 'Disable' : 'Enable'}`, toggleAutoDownload);

    async function redirectToHomeAndSearch(fromFile = false) {
    if (window.location.href.includes("/home")) {
        startRefinedSearchForLastReadPost(fromFile);
        return;
    }
    showPopup("redirectToHome", 3000);
    // Geändert: Direkt den "Home"-Button als Hauptmethode verwenden (data-testid="AppTabBar_Home_Link")
    const homeButton = document.querySelector('a[data-testid="AppTabBar_Home_Link"]');
    if (homeButton) {
        homeButton.click();
        setTimeout(() => {
            if (window.location.href.includes("/home")) {
                startRefinedSearchForLastReadPost(fromFile);
            } else {
                console.error("❌ Weiterleitung zur Startseite fehlgeschlagen.");
                showPopup("scriptError", 5000);
            }
        }, 1000);
    } else {
        // Fallback: Harter Redirect, falls der Home-Button nicht gefunden wird
        console.error("❌ Home-Button nicht gefunden.");
        window.location.href = "https://x.com/home";
        setTimeout(() => startRefinedSearchForLastReadPost(fromFile), 1000);
    }
}

    async function loadLastReadPostFromFile() {
    try {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.style.display = "none";
        document.body.appendChild(input);

        input.addEventListener("change", async (event) => {
            const file = event.target.files[0];
            if (!file) {
                showPopup("fileSelectError", 5000);
                document.body.removeChild(input);
                return;
            }

            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const data = JSON.parse(e.target.result);

                    if (!data || !data.current || !data.current.tweetId || !data.current.authorHandler) {
                        showPopup("invalidPosition", 5000);
                        document.body.removeChild(input);
                        return;
                    }

                    const account = await getCurrentUserHandle();

                    // Aktuelle Position übernehmen
                    lastReadPost = {
                        ...data.current,
                        account
                    };

                    // Historie übernehmen (max. 50 Einträge)
                    const historyKey = `postHistory_${account}`;
                    let importedHistory = data.history || [];
                    if (importedHistory.length > 50) {
                        importedHistory = importedHistory.slice(-50);
                    }

                    GM_setValue(historyKey, importedHistory);
                    GM_setValue(STORAGE_KEY(account), JSON.stringify(lastReadPost));

                    showPopup("fileLoadSuccess", 4000);

                    updateHighlightedPost();

                    if (!isScriptActivated) {
                        isScriptActivated = true;
                        observeForNewPosts();
                    }

                    redirectToHomeAndSearch(true);

                } catch (err) {
                    console.error("❌ JSON Parse Fehler:", err);
                    showPopup("fileReadError", 5000);
                } finally {
                    document.body.removeChild(input);
                }
            };

            reader.readAsText(file);
        });

        input.click();

    } catch (err) {
        console.error("❌ Datei-Dialog Fehler:", err);
        showPopup("fileDialogError", 5000);
    }
}

    async function loadLastReadPost(callback) {
    try {
        const account = await getCurrentUserHandle();
        const storageKey = STORAGE_KEY(account);
        const historyKey = `postHistory_${account}`;
        const storedPost = GM_getValue(storageKey, null);
        const storedHistory = GM_getValue(historyKey, []);
        if (storedPost) {
            const parsedPost = JSON.parse(storedPost);
            if (parsedPost.tweetId && parsedPost.authorHandler && parsedPost.timestamp) {
                // Neu: Historie laden und bereinigen (älter als 7 Tage entfernen)
                const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
                const filteredHistory = storedHistory.filter(h => new Date(h.timestamp).getTime() > sevenDaysAgo);
                GM_setValue(historyKey, filteredHistory);
                console.log(`📜 Geladene Post-Historie: ${filteredHistory.length} Einträge.`);
                callback(parsedPost);
            } else {
                console.log(`⏹️ Keine gültige Leseposition für Account ${account} gefunden.`);
                callback(null);
            }
        } else {
            console.log(`⏹️ Keine gespeicherte Leseposition für Account ${account} gefunden.`);
            callback(null);
        }
    } catch (err) {
        console.error("❌ Fehler beim Laden der Leseposition:", err);
        callback(null);
    }
}

    async function downloadLastReadPost() {
    if (!window.location.href.includes("/home")) {
        console.log("⏹️ Download übersprungen: Nicht auf der Home-Seite.");
        return;
    }

    try {
        if (!lastReadPost || !lastReadPost.tweetId || !lastReadPost.authorHandler) {
            showPopup("noValidPosition", 5000);
            return;
        }

        const postKey = `${lastReadPost.tweetId}-${lastReadPost.authorHandler}`;
        if (downloadedPosts.has(postKey)) {
            showPopup("alreadyDownloaded", 5000);
            return;
        }

        const account = await getCurrentUserHandle();
        const historyKey = `postHistory_${account}`;
        const history = GM_getValue(historyKey, []);

        // Nur die neuesten 50 Einträge exportieren
        const exportHistory = history.slice(-50);

        // ────────────────────────────────────────────────
        // NEUER DATEINAME – ohne Tweet-ID
        // ────────────────────────────────────────────────
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10);                    // 2026-01-18
        const timeStr = now.toISOString().slice(11, 16).replace(':', '');  // 1435

        const postAuthor = lastReadPost.authorHandler || 'unknown';

        const fileName = `${account}_${postAuthor}_${dateStr}_${timeStr}.json`;
        // ────────────────────────────────────────────────

        const exportData = {
            account: account,
            current: { ...lastReadPost },
            history: exportHistory,
            exportedAt: now.toISOString(),
            version: "1.0"
        };

        const fileContent = JSON.stringify(exportData, null, 2);
        const blob = new Blob([fileContent], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();

        downloadedPosts.add(postKey);
        saveDownloadedPosts();

        showPopup("downloadSuccess", 8000, { fileName });

        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 3000);

    } catch (err) {
        console.error("❌ Download-Fehler:", err);
        showPopup("downloadFailed", 10000);
    }
}

    async function loadNewestLastReadPost() {
        return new Promise(resolve => {
            loadLastReadPost(async (storedPost) => {
                const account = await getCurrentUserHandle();
                if (storedPost && storedPost.tweetId && storedPost.authorHandler) {
                    lastReadPost = storedPost;
                    console.log(`✅ Leseposition für Account ${account} geladen:`, lastReadPost);
                } else {
                    console.warn(`⚠️ Keine Leseposition für Account ${account} gefunden.`);
                    showPopup("noPositionFound", 5000);
                }
                resolve();
            });
        });
    }

    let lastScrollY = window.scrollY;

    async function initializeScript() {
    console.log("🔧 Lade Leseposition...");
    try {
        await loadNewestLastReadPost();
        console.log("✅ Initialisierung erfolgreich.");
        window.addEventListener("scroll", debounce(() => {
            if (!isScriptActivated) {
                isScriptActivated = true;
                console.log("🛠️ Skript durch Scrollen aktiviert.");
                observeForNewPosts();
            }
            if (isAutoScrolling || isSearching || isFallbackSearching) {
                console.log("⏹️ Scroll-Ereignis ignoriert: Auto-Scrolling, Suche oder Fallback-Suche aktiv.");
                return;
            }
            if (window.scrollY < 50 && window.location.href.includes("/home")) {
                const newPostsIndicator = getNewPostsIndicator();
                if (newPostsIndicator && !newPostsIndicator.dataset.processed) {
                    console.log("🆕 Neue Beiträge erkannt, da Benutzer oben auf der Seite ist.");
                    isSearching = true;
                    clickNewPostsIndicator(newPostsIndicator);
                    waitForNewPosts(() => {
                        console.log("🛠️ Neue Beiträge geladen, starte Suche nach letzter Leseposition.");
                        startRefinedSearchForLastReadPost();
                    });
                }
            }
            markTopVisiblePost(true);
        }, 150), { passive: true });
        window.addEventListener("focus", () => {
            if (!isScriptActivated || isSearching || isFallbackSearching || isAutoScrolling) {
                console.log("⏹️ Fokus-Event übersprungen: Skript nicht aktiviert, Suche oder Auto-Scrolling aktiv.");
                return;
            }
            if (window.scrollY < 50 && window.location.href.includes("/home")) {
                console.log("🛠️ Fenster fokussiert, prüfe auf neue Beiträge.");
                setTimeout(() => {
                    const newPostsIndicator = getNewPostsIndicator();
                    if (newPostsIndicator && !newPostsIndicator.dataset.processed) {
                        console.log("🆕 Neue Beiträge erkannt bei Fokus.");
                        isSearching = true;
                        clickNewPostsIndicator(newPostsIndicator);
                        waitForNewPosts(() => {
                            console.log("🛠️ Neue Beiträge geladen, starte Suche nach letzter Leseposition.");
                            if (lastReadPost && lastReadPost.tweetId) {
                                const posts = Array.from(document.querySelectorAll('article'));
                                const foundPost = posts.find(post => {
                                    const tweetId = getPostTweetId(post);
                                    const author = getPostAuthorHandler(post);
                                    return tweetId === lastReadPost.tweetId && author === lastReadPost.authorHandler;
                                });
                                if (foundPost) {
                                    console.log("🎯 Leseposition bereits im DOM, scrolle direkt.");
                                    scrollToPostWithHighlight(foundPost);
                                    isSearching = false;
                                } else {
                                    console.log("⚠️ Leseposition nicht im DOM, starte Suche.");
                                    startRefinedSearchForLastReadPost();
                                }
                            } else {
                                console.log("⏹️ Keine Leseposition vorhanden, überspringe Suche.");
                                isSearching = false;
                            }
                        });
                    }
                }, 1000);
            }
        });
        const checkNewPostsInterval = setInterval(() => {
            if (!isScriptActivated || isSearching || isFallbackSearching || isAutoScrolling || window.scrollY >= 50 || !window.location.href.includes("/home")) return;
            const newPostsIndicator = getNewPostsIndicator();
            if (newPostsIndicator && !newPostsIndicator.dataset.processed) {
                console.log("🆕 Neue Beiträge erkannt über Intervall, da Benutzer oben ist.");
                isSearching = true;
                clickNewPostsIndicator(newPostsIndicator);
                waitForNewPosts(() => {
                    console.log("🛠️ Neue Beiträge geladen, starte Suche nach letzter Leseposition.");
                    if (lastReadPost && lastReadPost.tweetId) {
                        const posts = Array.from(document.querySelectorAll('article'));
                        const foundPost = posts.find(post => {
                            const tweetId = getPostTweetId(post);
                            const author = getPostAuthorHandler(post);
                            return tweetId === lastReadPost.tweetId && author === lastReadPost.authorHandler;
                        });
                        if (foundPost) {
                            console.log("🎯 Leseposition bereits im DOM, scrolle direkt.");
                            scrollToPostWithHighlight(foundPost);
                            isSearching = false;
                        } else {
                            console.log("⚠️ Leseposition nicht im DOM, starte Suche.");
                            startRefinedSearchForLastReadPost();
                        }
                    } else {
                        console.log("⏹️ Keine Leseposition vorhanden, überspringe Suche.");
                        isSearching = false;
                    }
                });
            }
        }, 3000);
        window.addEventListener("unload", () => clearInterval(checkNewPostsInterval));
        const debouncedDownload = debounce(() => {
            if (autoDownloadEnabled && lastReadPost && isScriptActivated && !isSearching && !isFallbackSearching && window.location.href.includes("/home")) {
                const postKey = `${lastReadPost.tweetId}-${lastReadPost.authorHandler}`;
                if (!downloadedPosts.has(postKey)) {
                    console.log("🛠️ Starte Auto-Download der Leseposition.");
                    downloadLastReadPost();
                } else {
                    console.log("⏹️ Auto-Download übersprungen: Leseposition bereits heruntergeladen:", postKey);
                }
            }
        }, 1000);
        window.addEventListener('blur', debouncedDownload);
        window.addEventListener('beforeunload', () => {
            if (autoDownloadEnabled && lastReadPost && isScriptActivated && !isSearching && !isFallbackSearching && window.location.href.includes("/home")) {
                const postKey = `${lastReadPost.tweetId}-${lastReadPost.authorHandler}`;
                if (!downloadedPosts.has(postKey)) {
                    console.log("🛠️ Starte Auto-Download vor Schließen.");
                    downloadLastReadPost();
                } else {
                    console.log("⏹️ Auto-Download vor Schließen übersprungen: Leseposition bereits heruntergeladen:", postKey);
                }
            }
        });
    } catch (err) {
        console.error("❌ Fehler bei der Initialisierung:", err);
        showPopup("scriptError", 5000);
    }
}

    function initializeWhenDOMReady() {
        console.log("🚀 Initialisiere Skript...");
        const observer = new MutationObserver((mutations, obs) => {
            if (document.body) {
                obs.disconnect();
                initializeScript().then(() => {
                    createButtons();
                }).catch(err => {
                    console.error("❌ Fehler bei der Initialisierung:", err);
                    showPopup("scriptError", 5000);
                });
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    window.addEventListener("load", initializeWhenDOMReady);

    function updateHighlightedPost() {
        if (!lastReadPost || !lastReadPost.tweetId || !lastReadPost.authorHandler) {
            console.log("⏹️ Keine gültige Leseposition für glühenden Rahmen.");
            return;
        }
        const lastReadElement = Array.from(document.querySelectorAll("article")).find(post => {
            const tweetId = getPostTweetId(post);
            const author = getPostAuthorHandler(post);
            return tweetId === lastReadPost.tweetId && author === lastReadPost.authorHandler;
        });
        if (lastReadElement) {
            if (lastHighlightedPost && lastHighlightedPost !== lastReadElement) {
                lastHighlightedPost.style.boxShadow = "none";
            }
            lastReadElement.style.boxShadow = "0 0 20px 10px rgba(246, 146, 25, 0.9)";
            lastHighlightedPost = lastReadElement;
            console.log("🟠 Glühender Rand auf aktuelle Leseposition gesetzt:", lastReadPost);
        } else {
            console.log("⚠️ Leseposition nicht im DOM gefunden, glühender Rand nicht gesetzt:", lastReadPost);
        }
    }

    async function markTopVisiblePost(save = true) {
    if (!window.location.href.includes("/home")) {
        console.log("⏹️ Speicherung übersprungen: Nicht auf der Home-Seite.");
        return;
    }
    if (isSearching || isFallbackSearching) {
        console.log("⏹️ markTopVisiblePost übersprungen: Suche oder Fallback-Suche läuft.");
        return;
    }
    const topPost = getTopVisiblePost();
    if (!topPost) {
        console.log("❌ Kein sichtbarer Beitrag.");
        return;
    }
    const postTweetId = getPostTweetId(topPost);
    const postTimestamp = getPostTimestamp(topPost);
    const postAuthorHandler = getPostAuthorHandler(topPost);
    const isRepost = isPostRepost(topPost);
    if (postTweetId && postAuthorHandler && postTimestamp) {
        const account = await getCurrentUserHandle();
        const newPost = {
            tweetId: postTweetId,
            timestamp: postTimestamp,
            authorHandler: postAuthorHandler,
            isRepost,
            account
        };
        let shouldUpdate = true;
        if (lastReadPost && lastReadPost.timestamp && save) {
            const currentTime = new Date(lastReadPost.timestamp).getTime();
            const newTime = new Date(postTimestamp).getTime();
            const currentId = BigInt(lastReadPost.tweetId);
            const newId = BigInt(postTweetId);
            if (newTime <= currentTime && newId <= currentId) {
                shouldUpdate = false;
                console.log("⏹️ Leseposition nicht aktualisiert: Neuer Post ist älter oder gleich alt:", newPost);
            }
        }
        if (lastReadPost && lastReadPost.tweetId && lastReadPost.authorHandler) {
            const lastReadElement = Array.from(document.querySelectorAll("article")).find(post => {
                const tweetId = getPostTweetId(post);
                const author = getPostAuthorHandler(post);
                return tweetId === lastReadPost.tweetId && author === lastReadPost.authorHandler;
            });
            if (lastReadElement && lastReadElement !== lastHighlightedPost) {
                if (lastHighlightedPost) {
                    lastHighlightedPost.style.boxShadow = "none";
                }
                lastReadElement.style.boxShadow = "0 0 20px 10px rgba(246, 146, 25, 0.9)";
                lastHighlightedPost = lastReadElement;
                console.log("🟠 Glühender Rand auf aktuelle Leseposition gesetzt:", lastReadPost);
            }
        } else if (shouldUpdate) {
            if (lastHighlightedPost && lastHighlightedPost !== topPost) {
                lastHighlightedPost.style.boxShadow = "none";
            }
            topPost.style.boxShadow = "0 0 20px 10px rgba(246, 146, 25, 0.9)";
            lastHighlightedPost = topPost;
        }
        if (shouldUpdate && save && isScriptActivated) {
            lastReadPost = newPost;
            currentPost = newPost;
            console.log("💾 Neue Leseposition gesetzt:", lastReadPost);
            await saveLastReadPost(lastReadPost);
            updateHighlightedPost();
        }
    } else {
        console.log("⚠️ Keine gültige Tweet-ID, Autoren-Handle oder Timestamp gefunden für Beitrag:", topPost);
    }
}

    function waitForNewPosts(callback) {
    const timelineContainer = document.querySelector('div[data-testid="primaryColumn"]') || document.body;
    let loadAttempts = 0;
    const maxLoadAttempts = 80; // Erhöht für längere Wartezeiten
    const initialPostCount = document.querySelectorAll('article').length;
    const initialCellCount = document.querySelectorAll('div[data-testid="cellInnerDiv"]').length;
    let callbackTriggered = false;
    const observer = new MutationObserver((mutations) => {
        if (callbackTriggered || isSearchCancelled) return;
        const currentPostCount = document.querySelectorAll('article').length;
        const currentCellCount = document.querySelectorAll('div[data-testid="cellInnerDiv"]').length;
        if (currentPostCount > initialPostCount || currentCellCount > initialCellCount) {
            console.log("🆕 Neue Beiträge oder Zellen im DOM erkannt, starte Suche.");
            callbackTriggered = true;
            observer.disconnect();
            setTimeout(() => {
                callback();
            }, 1200); // Erhöhte Verzögerung für stabile Ladezeiten
        }
    });
    observer.observe(timelineContainer, {
        childList: true,
        subtree: true,
        attributes: false
    });
    const timeoutCheck = setInterval(() => {
        loadAttempts++;
        const currentPostCount = document.querySelectorAll('article').length;
        const currentCellCount = document.querySelectorAll('div[data-testid="cellInnerDiv"]').length;
        if (callbackTriggered || isSearchCancelled) {
            clearInterval(timeoutCheck);
            return;
        }
        if (currentPostCount > initialPostCount || currentCellCount > initialCellCount) {
            console.log("🆕 Neue Beiträge über Timeout erkannt, starte Suche.");
            callbackTriggered = true;
            observer.disconnect();
            clearInterval(timeoutCheck);
            setTimeout(() => {
                callback();
            }, 1200);
        } else if (loadAttempts >= maxLoadAttempts) {
            console.warn("⚠️ Keine neuen Posts nach maximalen Versuchen geladen, starte Suche mit aktuellen Posts.");
            callbackTriggered = true;
            observer.disconnect();
            clearInterval(timeoutCheck);
            setTimeout(() => {
                callback();
            }, 1200);
        } else {
            const currentScrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
            const viewportHeight = window.innerHeight;
            const scrollStep = viewportHeight * 0.6; // Leicht erhöhter Schritt gegen Stagnation
            window.scrollBy({ top: scrollStep, behavior: "smooth" });
        }
    }, 1000); // Erhöhtes Intervall für weniger aggressive Scrolls
    window.addEventListener("unload", () => {
        observer.disconnect();
        clearInterval(timeoutCheck);
        isSearching = false;
        isFallbackSearching = false;
    }, { once: true });
}

    function startNewPostsCheckInterval() {
        const interval = setInterval(() => {
            if (!isScriptActivated || isSearching || isFallbackSearching || isAutoScrolling || !window.location.href.includes("/home")) return;
            const newPostsIndicator = getNewPostsIndicator();
            if (newPostsIndicator && !newPostsIndicator.dataset.processed) {
                console.log("🆕 Neue Beiträge über Intervall erkannt und sichtbar.");
                isSearching = true;
                clickNewPostsIndicator(newPostsIndicator);
                waitForNewPosts(() => {
                    console.log("🛠️ Neue Beiträge geladen, starte Suche nach letzter Leseposition.");
                    startRefinedSearchForLastReadPost();
                });
            }
        }, 3000);
        window.addEventListener("unload", () => clearInterval(interval));
    }

    function getTopVisiblePost() {
        const posts = Array.from(document.querySelectorAll("article"));
        return posts.find(post => {
            const rect = post.getBoundingClientRect();
            return rect.top >= 0 && rect.bottom > 0;
        });
    }

    function getPostTweetId(post) {
        const linkElement = post.querySelector('a[role="link"][href*="/status/"]');
        if (!linkElement) return null;
        const href = linkElement.getAttribute("href");
        const match = href.match(/\/status\/(\d+)/);
        return match ? match[1] : null;
    }

    function getPostTimestamp(post) {
        const timeElement = post.querySelector('time[datetime]');
        return timeElement ? timeElement.getAttribute("datetime") : null;
    }

    function isPostRepost(post) {
        const repostPathPattern = /M4\.75 3\.79l4\.603 4\.3-1\.706 1\.82L6 8\.38v7\.37c0 \.97\.784 1\.75 1\.75 1\.75H13V20H7\.75c-2\.347 0-4\.25-1\.9-4\.25-4\.25V8\.38L1\.853 9\.91\.147 8\.09l4\.603-4\.3zm11\.5 2\.71H11V4h5\.25c2\.347 0 4\.25 1\.9 4\.25 4\.25v7\.37l1\.647-1\.53 1\.706 1\.82-4\.603 4\.3-4\.603-4\.3 1\.706-1\.82L18 15\.62V8\.25c0-\.97-\.784-1\.75-1\.75-1\.75z/i;
        const svgIndicator = post.querySelector('svg[viewBox="0 0 24 24"]');
        if (svgIndicator) {
            const path = svgIndicator.querySelector('path');
            if (path && repostPathPattern.test(path.getAttribute('d'))) {
                return true;
            }
        }
        const repostTextPattern = /\b(reposted|hat repostet|retweeté|retwittato|リポストしました|перепостил|republicou|إعادة نشر|repostado|리트윗|reposted by|repostet by|retweeted by)\b/i;
        const textElement = getSelectorFallback(post, ['span[data-testid="socialContext"]', 'span[class*="css-"][dir="ltr"]']);
        return textElement && repostTextPattern.test(textElement.textContent.toLowerCase().trim());
    }

    // Verbesserte getPostAuthorHandler mit besserer Regex für Handles (erweitert auf internationale Zeichen)
    function getPostAuthorHandler(post) {
    const isRepost = isPostRepost(post);
    const handlerElement = post.querySelector('a[role="link"][href*="/"]:not([href*="/status/"])');
    if (!handlerElement) return null;
    const href = handlerElement.getAttribute("href") || "";
    const text = handlerElement.textContent || "";
    let handle = null;
    if (href) {
        const match = href.match(/^\/([^/]+)/);
        if (match && match[1] && !['i', 'home', 'explore', 'messages', 'notifications'].includes(match[1])) {
            handle = match[1];
        }
    }
    if (!handle && text.startsWith('@') && text.length > 1) {
        handle = text.slice(1);
    }
    // Verbesserte Regex: Unterstützt internationale Zeichen (z.B. Unicode-Buchstaben) und max. 15 Zeichen
    return handle && /^[a-zA-Z0-9_\p{L}]{1,15}$/u.test(handle) ? handle : null;
}

    function getVisiblePosts() {
        const posts = Array.from(document.querySelectorAll("article"));
        return posts.filter(post => {
            const rect = post.getBoundingClientRect();
            return rect.top < window.innerHeight && rect.bottom > 0;
        }).map(post => ({
            element: post,
            tweetId: getPostTweetId(post),
            timestamp: getPostTimestamp(post),
            authorHandler: getPostAuthorHandler(post),
            isRepost: isPostRepost(post)
        }));
    }

    async function startRefinedSearchForLastReadPost(fromFile = false) {
    if (DEBUG) console.log("🔍 Starte optimierte Suche für letzte Leseposition...");
    isSearching = true;
    isSearchCancelled = false;
    if (!isScriptActivated) {
        showPopup("searchScrollPrompt", 5000);
        isSearching = false;
        return;
    }
    let storedData = null;
    const account = await getCurrentUserHandle();
    if (!fromFile) {
        await loadLastReadPost(async (data) => { // Neu: loadLastReadPost lädt nun auch Historie
            if (!data) {
                if (DEBUG) console.log(`❌ Keine Leseposition für Account ${account} gefunden.`);
                showPopup("searchNoPosition", 5000);
                isSearching = false;
                return;
            }
            storedData = data;
            if (DEBUG) console.log(`✅ Geladene Leseposition für Account ${account}:`, storedData);
        });
    } else {
        storedData = lastReadPost;
    }
    if (!storedData || !storedData.tweetId || !storedData.authorHandler || !storedData.timestamp) {
        if (DEBUG) console.log("❌ Ungültige Leseposition:", storedData);
        showPopup("invalidPosition", 5000);
        isSearching = false;
        return;
    }
    lastReadPost = storedData;
    const positionAge = Date.now() - new Date(storedData.timestamp).getTime();
    const ageThreshold = 24 * 60 * 60 * 1000;
    if (positionAge > ageThreshold) {
        const continueSearch = confirm(getTranslatedMessage('oldPositionWarning', getUserLanguage()));
        if (!continueSearch) {
            if (DEBUG) console.log("⏹️ Suche abgebrochen: Benutzer hat alte Position abgelehnt.");
            findAndSetClosestPost();
            isSearching = false;
            return;
        }
    }
    if (DEBUG) console.log(`🔍 Suche für Account ${account}:`, lastReadPost);
    const posts = Array.from(document.querySelectorAll('article'));
    for (const post of posts) {
        const postTweetId = getPostTweetId(post);
        const postAuthor = getPostAuthorHandler(post);
        if (postTweetId === lastReadPost.tweetId && postAuthor === lastReadPost.authorHandler) {
            if (DEBUG) console.log("🎯 Beitrag bereits im DOM gefunden, scrolle direkt.");
            scrollToPostWithHighlight(post);
            lastReadPost.found = true;
            markTopVisiblePost(true);
            isSearching = false;
            return;
        }
    }
    if (DEBUG) console.log("⚠️ Post nicht im aktuellen DOM gefunden, starte Scroll-Suche.");
    popup = createSearchPopup(lastReadPost);
    if (!popup) {
        console.error("❌ Popup konnte nicht erstellt werden.");
        isSearching = false;
        return;
    }
    const checkedTweetIds = new Set();
    const targetTime = new Date(lastReadPost.timestamp).getTime();
    const targetId = BigInt(lastReadPost.tweetId);
    const timeDiffThreshold = 4 * 60 * 60 * 1000;
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const post = entry.target;
                const postTweetId = getPostTweetId(post);
                const postAuthor = getPostAuthorHandler(post);
                if (postTweetId === lastReadPost.tweetId && postAuthor === lastReadPost.authorHandler) {
                    if (DEBUG) console.log("🎯 Beitrag via IntersectionObserver gefunden:", lastReadPost);
                    scrollToPostWithHighlight(post);
                    lastReadPost.found = true;
                    markTopVisiblePost(true);
                    isSearching = false;
                    if (popup) popup.remove();
                    window.removeEventListener("keydown", handleSpaceKey);
                    io.disconnect();
                }
            }
        });
    }, { threshold: 0.2 });
    function handleSpaceKey(event) {
        if (event.code === "Space" && (isSearching || isFallbackSearching)) {
            isSearchCancelled = true;
            showPopup("fallbackSearchCancelled", 5000);
            if (DEBUG) console.log("⏹️ Suche gestoppt durch Benutzer.");
            isSearching = false;
            isFallbackSearching = false;
            if (popup) popup.remove();
            window.removeEventListener("keydown", handleSpaceKey);
            io.disconnect();
        }
    }
    window.addEventListener("keydown", handleSpaceKey);
    function getTimestampFromTweetId(tweetId) {
        const TWITTER_EPOCH = 1288834974657;
        const timestamp = (Number(tweetId >> 22n) + TWITTER_EPOCH);
        return timestamp;
    }
    let scrollCount = 0;
    const search = async () => {
        scrollCount++;
        if (scrollCount > 150) {
            console.warn("⚠️ Maximale Scroll-Versuche erreicht, starte Fallback.");
            showPopup("tweetIdNotFound", 5000);
            findAndSetClosestPost();
            isSearching = false;
            if (popup) popup.remove();
            window.removeEventListener("keydown", handleSpaceKey);
            io.disconnect();
            return;
        }
        if (isSearchCancelled) {
            if (DEBUG) console.log("⏹️ Suche abgebrochen durch Benutzer.");
            isSearching = false;
            if (popup) popup.remove();
            window.removeEventListener("keydown", handleSpaceKey);
            io.disconnect();
            return;
        }
        if (!isSearching) {
            if (DEBUG) console.log("⏹️ Suche bereits beendet.");
            if (popup) popup.remove();
            window.removeEventListener("keydown", handleSpaceKey);
            io.disconnect();
            return;
        }
        let posts = getVisiblePosts().map(p => p.element);
        totalLoadedPosts = Array.from(document.querySelectorAll('article')).length;
        if (DEBUG) console.log(`🔍 Prüfe ${posts.length} sichtbare Posts (Gesamt: ${totalLoadedPosts}). Scroll-Versuch: ${stagnantScrollCount + 1}, Zyklusphase: ${scrollCyclePhase}`);
        if (totalLoadedPosts > 1500) {
            if (DEBUG) console.log("⚠️ Über 1500 Posts geladen – Suche abgebrochen.");
            showPopup("tweetIdNotFound", 5000);
            findAndSetClosestPost();
            isSearching = false;
            if (popup) popup.remove();
            window.removeEventListener("keydown", handleSpaceKey);
            io.disconnect();
            return;
        }
        if (posts.length === 0) {
            if (DEBUG) console.log("⚠️ Keine sichtbaren Posts im DOM, warte auf Laden...");
            const currentScrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
            if (currentScrollHeight === lastScrollHeight) {
                stagnantScrollCount++;
                if (stagnantScrollCount > 20) {
                    if (DEBUG) console.log("⚠️ Suche abgebrochen: Keine neuen Posts nach 20 Versuchen.");
                    showPopup("tweetIdNotFound", 5000);
                    findAndSetClosestPost();
                    isSearching = false;
                    if (popup) popup.remove();
                    window.removeEventListener("keydown", handleSpaceKey);
                    io.disconnect();
                    return;
                }
            } else {
                stagnantScrollCount = 0;
            }
            lastScrollHeight = currentScrollHeight;
            let scrollStep = calculateScrollStep();
            window.scrollBy({ top: scrollStep, behavior: "smooth" });
            await new Promise(resolve => setTimeout(resolve, 300));
            requestAnimationFrame(() => setTimeout(search, 300));
            return;
        }
        posts.forEach(post => io.observe(post));
        let found = false;
        for (const post of posts) {
            const cached = updatePostCache(post);
            const postTweetId = cached.tweetId;
            const postAuthor = cached.authorHandler;
            if (checkedTweetIds.has(postTweetId)) continue;
            checkedTweetIds.add(postTweetId);
            if (postTweetId === lastReadPost.tweetId && postAuthor === lastReadPost.authorHandler) {
                if (DEBUG) console.log("🎯 Beitrag gefunden:", lastReadPost);
                scrollToPostWithHighlight(post);
                lastReadPost.found = true;
                markTopVisiblePost(true);
                isSearching = false;
                if (popup) popup.remove();
                window.removeEventListener("keydown", handleSpaceKey);
                io.disconnect();
                found = true;
                return;
            }
        }
        if (found) return;
        const allLoadedPosts = Array.from(document.querySelectorAll('article'));
        const allLoadedIds = allLoadedPosts
            .map(post => {
                const tweetId = getPostTweetId(post);
                return tweetId && !isNaN(tweetId) ? BigInt(tweetId) : null;
            })
            .filter(id => id !== null);
        let oldestLoadedId = BigInt(0);
        let newestLoadedId = BigInt(0);
        if (allLoadedIds.length > 0) {
            oldestLoadedId = allLoadedIds.reduce((min, id) => (id < min ? id : min), allLoadedIds[0]);
            newestLoadedId = allLoadedIds.reduce((max, id) => (id > max ? id : max), allLoadedIds[0]);
            if (DEBUG) console.log(`🛠️ Älteste geladene ID: ${oldestLoadedId}, Neueste geladene ID: ${newestLoadedId}, Ziel-ID: ${targetId}`);
        }
        if (allLoadedIds.length > 0) {
            if (targetId > newestLoadedId && scrollCyclePhase === 0) {
                searchDirection = 'up';
                scrollCyclePhase = 1;
                if (DEBUG) console.log("⚠️ Lesestelle neuer als alle geladenen Posts, wechsle zu Phase 1: nach oben.");
            } else if (targetId < oldestLoadedId && scrollCyclePhase === 1) {
                searchDirection = 'down';
                scrollCyclePhase = 2;
                hasCompletedCycle = true;
                if (DEBUG) console.log("⚠️ Lesestelle älter als alle geladenen Posts, wechsle zu Phase 2: nach unten.");
            } else if (hasCompletedCycle && scrollCyclePhase === 2) {
                if (DEBUG) console.log("⚠️ Zyklus abgeschlossen, keine passende Position gefunden.");
                showPopup("tweetIdNotFound", 5000);
                findAndSetClosestPost();
                isSearching = false;
                if (popup) popup.remove();
                window.removeEventListener("keydown", handleSpaceKey);
                io.disconnect();
                return;
            }
        }
        const idDiff = Math.abs(Number(newestLoadedId - targetId));
        if (allLoadedIds.length > 0 && (oldestLoadedId <= targetId && targetId <= newestLoadedId) || idDiff < 1000000000000000n) {
            isSlowScrollMode = true;
            if (DEBUG) console.log("🛠️ Lesestelle zwischen oder nah an geladenen Posts, aktiviere Slow-Scroll-Mode.");
        } else if (largeScrollCount < maxLargeScrolls) {
            isSlowScrollMode = false;
        }
        const currentScrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
        if (currentScrollHeight === lastScrollHeight) {
            stagnantScrollCount++;
            if (stagnantScrollCount > 20) {
                if (DEBUG) console.log("⚠️ Suche abgebrochen: Keine neuen Posts nach 20 Versuchen.");
                showPopup("tweetIdNotFound", 5000);
                findAndSetClosestPost();
                isSearching = false;
                if (popup) popup.remove();
                window.removeEventListener("keydown", handleSpaceKey);
                io.disconnect();
                return;
            }
        } else {
            stagnantScrollCount = 0;
        }
        lastScrollHeight = currentScrollHeight;
        let scrollStep = calculateScrollStep(); // Neu: Nutzt nun die dynamische Schätzung
        window.scrollBy({ top: scrollStep, behavior: "smooth" });
        await new Promise(resolve => setTimeout(resolve, 300));
        requestAnimationFrame(() => setTimeout(search, 300));
    };
    await new Promise(resolve => setTimeout(resolve, 300));
    search();
}

    function calculateScrollStep() {
    const baseStep = window.innerHeight * 1.5;
    let step;
    if (isSlowScrollMode) {
        step = baseStep * 0.5;
    } else {
        step = baseStep * 3;
    }
    // Neu: Dynamische Anpassung basierend auf Historie-Schätzung
    const account = getCurrentUserHandle(); // Sync-Aufruf, da es hier schnell gehen muss
    const historyKey = `postHistory_${account}`;
    const history = GM_getValue(historyKey, []);
    if (history.length >= 10) { // Mindestens 10 Einträge für Schätzung
        const timestamps = history.map(h => new Date(h.timestamp).getTime()).sort((a, b) => a - b);
        const timeSpan = (timestamps[timestamps.length - 1] - timestamps[0]) / (3600 * 1000); // Stunden
        const density = history.length / Math.max(timeSpan, 1); // Posts pro Stunde
        const targetTimeDiff = (Date.now() - new Date(lastReadPost.timestamp).getTime()) / (3600 * 1000); // Stunden zur Zielposition
        const estimatedPostsToSkip = Math.round(density * targetTimeDiff);
        const densityFactor = Math.min(estimatedPostsToSkip / 100, 5); // Max. Faktor 5, um Overshooting zu vermeiden
        step *= densityFactor;
        if (DEBUG) console.log(`🛠️ Dichte-Schätzung: ${density.toFixed(2)} Posts/Stunde, geschätzte zu überspringende Posts: ${estimatedPostsToSkip}, Faktor: ${densityFactor}`);
    } else {
        if (DEBUG) console.log(`🛠️ Keine ausreichende Historie für Dichte-Schätzung.`);
    }
    if (searchDirection === 'up') {
        step = -step;
    }
    if (!isSlowScrollMode) {
        largeScrollCount++;
        if (largeScrollCount >= maxLargeScrolls) {
            isSlowScrollMode = true;
            if (DEBUG) console.log("🛠️ Max. große Scrolls erreicht → Wechsel zu Slow-Scroll-Mode.");
        }
    }
    if (DEBUG) console.log(`🛠️ Scroll-Schritt: ${step}px (Slow: ${isSlowScrollMode}, Richtung: ${searchDirection})`);
    return step;
}

    function scrollToPostWithHighlight(post) {
    if (!post) {
        console.log("❌ Kein Beitrag zum Scrollen.");
        isSearching = false;
        isFallbackSearching = false;
        return;
    }
    isAutoScrolling = true;
    const maxPositionAttempts = 6; // Erhöht auf 6 für bessere Korrektur
    let positionAttempts = 0;
    const tryPositionPost = () => {
        const rect = post.getBoundingClientRect();
        const scrollY = window.scrollY;
        const offset = 80; // Leicht erhöht auf 80px für Puffer gegen Overshooting
        const targetY = scrollY + rect.top - offset;
        if (DEBUG) console.log("🛠️ Scrolle zu Post - rect.top:", rect.top, "scrollY:", scrollY, "targetY:", targetY, "Versuch:", positionAttempts + 1);
        if (lastHighlightedPost && lastHighlightedPost !== post) {
            lastHighlightedPost.style.boxShadow = "none";
        }
        post.style.boxShadow = "0 0 20px 10px rgba(246, 146, 25, 0.9)";
        lastHighlightedPost = post;
        window.scrollTo({ top: targetY, behavior: "smooth" });
        setTimeout(() => {
            const newRect = post.getBoundingClientRect();
            const deviation = Math.abs(newRect.top - offset);
            if (deviation <= 30) { // Erhöhte Toleranz auf 30px gegen kleine Overshoots
                if (DEBUG) console.log("✅ Beitrag " + offset + " Pixel unterhalb der oberen Kante positioniert.");
                isAutoScrolling = false;
                updateHighlightedPost();
            } else if (positionAttempts < maxPositionAttempts - 1) {
                positionAttempts++;
                const correction = (newRect.top - offset) * 0.8; // Sanfte Korrektur (80% der Abweichung) gegen Overshooting
                window.scrollBy({ top: -correction, behavior: "smooth" });
                if (DEBUG) console.log("⚠️ Positionierung nicht korrekt (rect.top:", newRect.top, "), korrigiere um:", -correction, "Versuch:", positionAttempts + 1);
                setTimeout(tryPositionPost, 500); // Dynamische Verzögerung basierend auf Versuch
            } else {
                console.log("❌ Maximale Positionierungsversuche erreicht. Aktuelle rect.top:", newRect.top);
                showPopup("postDeletedFallback", 5000);
                isAutoScrolling = false;
                updateHighlightedPost();
            }
        }, 800 + positionAttempts * 200); // Dynamische Verzögerung: Basis 800ms + 200ms pro Versuch
    };
    tryPositionPost();
}

    async function findAndSetClosestPost() {
    isFallbackSearching = true;
    isSearchCancelled = false;
    if (!lastReadPost || !lastReadPost.tweetId) {
        console.log("❌ Keine gültige Leseposition für Fallback-Suche.");
        showPopup("tweetIdNotFound", 5000);
        isFallbackSearching = false;
        return;
    }
    const targetId = BigInt(lastReadPost.tweetId);
    popup = createSearchPopup(lastReadPost);
    if (!popup) {
        console.error("❌ Popup konnte nicht erstellt werden.");
        isFallbackSearching = false;
        return;
    }
    function handleSpaceKey(event) {
        if (event.code === "Space" && (isSearching || isFallbackSearching)) {
            isSearchCancelled = true;
            showPopup("fallbackSearchCancelled", 5000);
            if (DEBUG) console.log("⏹️ Fallback-Suche gestoppt durch Benutzer.");
            isSearching = false;
            isFallbackSearching = false;
            if (popup) popup.remove();
            window.removeEventListener("keydown", handleSpaceKey);
        }
    }
    window.addEventListener("keydown", handleSpaceKey);
    let attempts = 0;
    const maxAttempts = 40;
    let scrollDirection = 'up';
    while (attempts < maxAttempts) {
        if (isSearchCancelled) {
            if (DEBUG) console.log("⏹️ Fallback-Suche abgebrochen durch Benutzer.");
            isFallbackSearching = false;
            if (popup) popup.remove();
            window.removeEventListener("keydown", handleSpaceKey);
            return;
        }
        const allLoadedPosts = Array.from(document.querySelectorAll('article')).map(post => ({
            element: post,
            tweetId: getPostTweetId(post),
            timestamp: getPostTimestamp(post),
            authorHandler: getPostAuthorHandler(post),
            isRepost: isPostRepost(post)
        })).filter(p => p.tweetId && !isNaN(p.tweetId)).map(p => ({
            ...p,
            bigId: BigInt(p.tweetId)
        }));
        if (allLoadedPosts.length === 0) {
            console.log("⚠️ Keine geladenen Posts, warte...");
            await new Promise(resolve => setTimeout(resolve, 1500));
            attempts++;
            continue;
        }
        const newerPosts = allLoadedPosts.filter(p => p.bigId > targetId);
        const olderPosts = allLoadedPosts.filter(p => p.bigId < targetId);
        if (newerPosts.length > 0) {
            let closest = newerPosts.reduce((min, p) => (p.bigId < min.bigId ? p : min), newerPosts[0]);
            if (closest) {
                scrollToPostWithHighlight(closest.element);
                lastReadPost = {
                    tweetId: closest.tweetId,
                    timestamp: closest.timestamp,
                    authorHandler: closest.authorHandler,
                    isRepost: closest.isRepost,
                    account: lastReadPost.account,
                    found: false
                };
                await saveLastReadPost(lastReadPost);
                console.log("💾 Neue Leseposition basierend auf nächstem neueren Post gesetzt:", lastReadPost);
                showPopup("postDeletedFallback", 5000);
                isFallbackSearching = false;
                if (popup) popup.remove();
                window.removeEventListener("keydown", handleSpaceKey);
                return;
            }
        } else if (olderPosts.length === allLoadedPosts.length && scrollDirection === 'up') {
            scrollDirection = 'up';
        } else if (olderPosts.length > 0 && scrollDirection === 'down') {
            let closest = olderPosts.reduce((max, p) => (p.bigId > max.bigId ? p : max), olderPosts[0]);
            if (closest) {
                scrollToPostWithHighlight(closest.element);
                lastReadPost = {
                    tweetId: closest.tweetId,
                    timestamp: closest.timestamp,
                    authorHandler: closest.authorHandler,
                    isRepost: closest.isRepost,
                    account: lastReadPost.account,
                    found: false
                };
                await saveLastReadPost(lastReadPost);
                console.log("💾 Neue Leseposition basierend auf nächstem älteren Post gesetzt:", lastReadPost);
                showPopup("postDeletedFallback", 5000);
                isFallbackSearching = false;
                if (popup) popup.remove();
                window.removeEventListener("keydown", handleSpaceKey);
                return;
            }
        } else {
            scrollDirection = 'down';
        }
        let scrollStep = scrollDirection === 'up' ? -window.innerHeight : window.innerHeight;
        window.scrollBy({ top: scrollStep, behavior: 'smooth' });
        await new Promise(resolve => setTimeout(resolve, 1500));
        attempts++;
        if (DEBUG) console.log(`🛠️ Scrolle ${scrollDirection === 'up' ? 'nach oben' : 'nach unten'}, Versuch ${attempts}/${maxAttempts}`);
    }
    console.warn("⚠️ Maximale Versuche erreicht, keine passende Position gefunden.");
    showPopup("tweetIdNotFound", 5000);
    isFallbackSearching = false;
    if (popup) popup.remove();
    window.removeEventListener("keydown", handleSpaceKey);
}

    function createSearchPopup(position) {
    const lang = getUserLanguage();
    const message = getTranslatedMessage(isFallbackSearching ? 'tweetIdNotFound' : 'searchPopup', lang, { authorHandler: position.authorHandler, tweetId: position.tweetId });
    popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.top = "20px";
    popup.style.left = "50%";
    popup.style.transform = "translateX(-50%)";
    popup.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
    popup.style.color = "#ffffff";
    popup.style.padding = "10px 20px";
    popup.style.borderRadius = "8px";
    popup.style.fontSize = "14px";
    popup.style.boxShadow = "0 0 10px rgba(246, 146, 25, 0.8)";
    popup.style.zIndex = "10000";
    popup.style.transition = "opacity 1s ease";  // Auch hier langsames Ausfaden
    popup.style.opacity = "0";
    popup.textContent = message;
    if (document.body) {
        document.body.appendChild(popup);
        setTimeout(() => { popup.style.opacity = "1"; }, 100);
        return popup;
    } else {
        console.error("❌ document.body nicht verfügbar für createSearchPopup.");
        return null;
    }
}

    function observeForNewPosts() {
        const timelineContainer = document.querySelector('div[data-testid="primaryColumn"]') || document.body;
        const observer = new MutationObserver((mutations) => {
            if (!isScriptActivated || isSearching || isFallbackSearching || isAutoScrolling || window.scrollY >= 50 || !window.location.href.includes("/home")) return;
            let newArticlesDetected = false;
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE && node.matches('article')) {
                            newArticlesDetected = true;
                        }
                        if (node.querySelector && node.querySelector('article')) {
                            newArticlesDetected = true;
                        }
                    });
                }
            });
            if (newArticlesDetected) {
                if (DEBUG) console.log("🆕 Neue Beiträge über DOM-Mutation erkannt.");
                isSearching = true;
                const newPostsIndicator = getNewPostsIndicator();
                if (newPostsIndicator && !newPostsIndicator.dataset.processed) {
                    clickNewPostsIndicator(newPostsIndicator);
                }
                waitForNewPosts(() => {
                    if (DEBUG) console.log("🛠️ Neue Beiträge geladen, starte Suche.");
                    startRefinedSearchForLastReadPost();
                });
            }
        });
        observer.observe(timelineContainer, {
            childList: true,
            subtree: true,
            attributes: false
        });
        window.addEventListener("unload", () => observer.disconnect(), { once: true });
    }

    function getNewPostsIndicator() {
    const selectors = [
        'div[data-testid="cellInnerDiv"] button[role="button"][class*="css-175oi2r r-1777fci"]',
        'button[role="button"][class*="css-175oi2r"]',
        'button[aria-label*="new posts"], button[aria-label*="neue beiträge"], button[aria-label*="nouveaux tweets"], button[aria-label*="nuevos tweets"], button[aria-label*="new tweets"]',
        'button[data-testid*="new-tweets"], button[data-testid*="new-posts"]',
        'button span[class*="css-"][dir="ltr"]',
        'div[role="button"] span[data-testid*="new-tweet"], div[role="button"] span[aria-label*="posts"]' // Erweiterte Selektoren für robustere Erkennung
    ];
    let button = null;
    for (const selector of selectors) {
        const buttons = document.querySelectorAll(selector);
        for (const btn of buttons) {
            if (btn.dataset.processed === 'true') continue;
            const span = getSelectorFallback(btn, ['span']);
            const textContent = (span ? span.textContent : btn.getAttribute('aria-label') || '').toLowerCase().trim();
            const postIndicatorPattern = /\b(new posts|neue beiträge|nouveaux tweets|nuevos tweets|新しい投稿|новые посты|novos posts|مشاركات جديدة|nuovi post|새 게시물|new tweets|post anzeigen|posts anzeigen|show \d+ post|show \d+ posts)\b/i;
            const excludePattern = /\b(teilen|share|posten|veröffentlichen)\b/i;
            if (postIndicatorPattern.test(textContent) && !excludePattern.test(textContent)) {
                button = btn;
                const numMatch = textContent.match(/(\d+)/);
                pendingNewPosts = numMatch ? parseInt(numMatch[1], 10) : 1;
                break;
            }
        }
        if (button) break;
    }
    return button;
}

    function clickNewPostsIndicator(indicator) {
    if (!indicator) {
        console.log("⚠️ Kein Indikator gefunden.");
        return;
    }
    console.log(`✅ Klicke auf Indikator mit ${pendingNewPosts} neuen Beiträgen...`);
    try {
        indicator.dataset.processed = 'true';
        indicator.click();
        console.log("✅ Indikator geklickt.");
    } catch (err) {
        console.error("❌ Fehler beim Klicken:", err);
        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
        indicator.dispatchEvent(clickEvent);
        console.log("✅ Fallback: Synthetischer Klick ausgelöst.");
    } finally {
        // Neu: Zusätzliche Verzögerung und Überprüfung, ob der Klick gewirkt hat
        setTimeout(() => {
            if (indicator && indicator.isConnected) {
                console.warn("⚠️ Indikator noch sichtbar, wiederhole Klick.");
                indicator.click(); // Wiederholung für Robustheit
            }
        }, 1000);
    }
}

    function createButtons() {
        const observer = new MutationObserver(() => {
            if (document.body) {
                observer.disconnect();
                try {
                    const buttonContainer = document.createElement("div");
                    buttonContainer.style.position = "fixed";
                    buttonContainer.style.top = "10px";
                    buttonContainer.style.left = "10px";
                    buttonContainer.style.zIndex = "10000";
                    buttonContainer.style.display = "flex";
                    buttonContainer.style.flexDirection = "column";
                    buttonContainer.style.alignItems = "flex-start";
                    buttonContainer.style.visibility = "visible";
                    const buttonsConfig = [
                        {
                            icon: "🔍",
                            title: "Start manual search",
                            onClick: () => {
                                console.log("🔍 Manuelle Suche gestartet.");
                                if (!isScriptActivated) {
                                    isScriptActivated = true;
                                    console.log("🛠️ Skript durch Lupen-Klick aktiviert.");
                                    observeForNewPosts();
                                }
                                redirectToHomeAndSearch();
                            },
                        },
                        {
                            icon: "📂",
                            title: "Load last read position from file",
                            onClick: () => {
                                console.log("📂 Lade Leseposition aus Datei...");
                                loadLastReadPostFromFile();
                            },
                        },
                        {
                            icon: "💾",
                            title: "Download current read position",
                            onClick: () => {
                                console.log("💾 Starte manuellen Download der Leseposition...");
                                downloadLastReadPost();
                            },
                        },
                    ];
                    buttonsConfig.forEach(({ icon, title, onClick }) => {
                        const button = createButton(icon, title, onClick);
                        buttonContainer.appendChild(button);
                    });
                    document.body.appendChild(buttonContainer);
                    console.log("🛠️ Button-Container erstellt:", buttonContainer);
                } catch (err) {
                    console.error("❌ Fehler beim Erstellen der Buttons:", err);
                    showPopup("buttonsError", 5000);
                }
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    function createButton(icon, title, onClick) {
        const button = document.createElement("div");
        button.style.width = "27px";
        button.style.height = "27px";
        button.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
        button.style.color = "#ffffff";
        button.style.borderRadius = "50%";
        button.style.display = "flex";
        button.style.justifyContent = "center";
        button.style.alignItems = "center";
        button.style.cursor = "pointer";
        button.style.fontSize = "14px";
        button.style.boxShadow = "0 0 8px rgba(255, 255, 255, 0.5)";
        button.style.transition = "transform 0.2s, box-shadow 0.3s";
        button.style.zIndex = "10001";
        button.style.marginBottom = "8px";
        button.textContent = icon;
        button.title = title;
        button.setAttribute('role', 'button');
        button.setAttribute('aria-label', title);
        button.addEventListener("click", () => {
            button.style.boxShadow = "0 0 15px rgba(255, 255, 255, 0.8)";
            button.style.transform = "scale(0.9)";
            setTimeout(() => {
                button.style.boxShadow = "0 0 8px rgba(255, 255, 255, 0.5)";
                button.style.transform = "scale(1)";
            }, 300);
            onClick();
        });
        return button;
    }

    function showPopup(messageKey, duration = 5000, params = {}) {
    const lang = getUserLanguage();
    const message = getTranslatedMessage(messageKey, lang, params);

    // Automatische, sinnvolle Dauer je nach Art der Meldung
    let displayDuration = duration;
    const fadeDuration = 4000;           // einheitlich 4 Sekunden Ausblenden für alle

    // Wichtige Fehler & Aufforderungen zum Handeln → länger sichtbar
    if (['downloadFailed', 'downloadClipboardFailed', 'saveError',
         'fileReadError', 'fileDialogError', 'invalidPosition',
         'fileSelectError'].includes(messageKey)) {
        displayDuration = 8000;
    }
    // Warnungen & etwas ernstere Hinweise
    else if (['noValidPosition', 'tweetIdNotFound', 'postDeletedFallback',
              'newPostsDetectionDelayed', 'oldPositionWarning'].includes(messageKey)) {
        displayDuration = 7000;
    }
    // Normale Infos & Statusänderungen
    else if (['alreadyDownloaded', 'searchNoPosition', 'searchScrollPrompt',
              'fallbackSearchCancelled', 'redirectToHome',
              'newPostsDetectionDelayed', 'autoDownloadToggled'].includes(messageKey)) {
        displayDuration = 6000;
    }
    // Kurze positive Rückmeldungen
    else if (['downloadSuccess', 'fileLoadSuccess'].includes(messageKey)) {
        displayDuration = 4000;
    }
    // Standard-Fallback (wenn nichts passt)
    else {
        displayDuration = 5500;
    }

    if (popup) {
        popup.style.opacity = "0";
        setTimeout(() => popup?.remove(), fadeDuration + 200);
    }

    popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.top = "20px";
    popup.style.left = "50%";
    popup.style.transform = "translateX(-50%)";
    popup.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
    popup.style.color = "#ffffff";
    popup.style.padding = "10px 20px";
    popup.style.borderRadius = "8px";
    popup.style.fontSize = "14px";
    popup.style.boxShadow = "0 0 10px rgba(246, 146, 25, 0.8)";
    popup.style.zIndex = "10000";
    popup.style.maxWidth = "500px";
    popup.style.whiteSpace = "pre-wrap";
    popup.style.transition = `opacity ${fadeDuration / 1000}s ease`;
    popup.style.opacity = "0";
    popup.textContent = message;

    if (document.body) {
        document.body.appendChild(popup);
        setTimeout(() => { popup.style.opacity = "1"; }, 120);

        setTimeout(() => {
            try {
                popup.style.opacity = "0";
                setTimeout(() => popup?.remove(), fadeDuration + 200);
            } catch (err) {
                console.error("❌ Fehler beim Entfernen des Popups:", err);
            }
        }, displayDuration);
    } else {
        console.error("❌ document.body nicht verfügbar für showPopup.");
    }
}

    function promptManualFallback(data) {
        const content = JSON.stringify(data);
        showPopup("downloadClipboardFailed", 10000);
        console.log("📝 Bitte manuell speichern:", content);
    }
})();