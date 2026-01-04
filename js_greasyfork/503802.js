// ==UserScript==
// @name        Pardon, could you say it again?
// @name:fr     Pardonnez-moi, pouvez-vous le répéter?
// @name:de     Entschuldigung, könnten Sie es noch einmal sagen?
// @name:es     Perdón, ¿puedes decirlo otra vez?
// @name:zh-CN  不好意思，你能再说一遍吗？
// @name:ja     すみません、もう一度言っていただけますか？
// @name:ko     죄송합니다, 다시 말씀해 주시겠어요?
// @name:pt     Desculpe, pode repetir?
// @name:ru     Извините, не могли бы вы повторить?
// @name:it     Scusi, può ripetere?
// @name:nl     Sorry, kun je dat nog een keer zeggen?
// @name:sv     Ursäkta, kan du säga det igen?
// @name:ar     عذراً، هل يمكنك أن تقول ذلك مرة أخرى؟
// @name:hi     माफ़ करिए, क्या आप इसे फिर से कह सकते हैं?
// @name:tr     Pardon, tekrar söyleyebilir misiniz?
// @name:pl     Przepraszam, czy mógłbyś to powtórzyć?
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.2.2
// @description Press . or , to replay the last sentence slowly at 0.6x speed in any video/audio site like YouTube, Bilibili, or Spotify. This is useful when you're learning a language and want to ensure you understand every sentence correctly. Or learning instruments and want to replay a section at a slower speed.
// @description:fr Appuyez sur . ou , pour rejouer la dernière phrase lentement à 0.6x de vitesse sur n'importe quel site vidéo/audio comme YouTube, Bilibili ou Spotify. C'est utile lorsque vous apprenez une langue et que vous voulez vous assurer de bien comprendre chaque phrase. Ou lorsque vous apprenez des instruments et que vous voulez rejouer une section à une vitesse plus lente.
// @description:de Drücken Sie . oder , um den letzten Satz langsam mit 0,6-facher Geschwindigkeit auf jeder Video-/Audio-Seite wie YouTube, Bilibili oder Spotify erneut abzuspielen. Dies ist nützlich, wenn Sie eine Sprache lernen und sicherstellen möchten, dass Sie jeden Satz korrekt verstehen. Oder wenn Sie Instrumente lernen und einen Abschnitt in langsamer Geschwindigkeit wiederholen möchten.
// @description:es Presiona . o , para reproducir la última oración lentamente a 0.6x de velocidad en cualquier sitio de video/audio como YouTube, Bilibili o Spotify. Esto es útil cuando estás aprendiendo un idioma y quieres asegurarte de entender cada frase correctamente. O aprendiendo instrumentos y deseas reproducir una sección a una velocidad más lenta.
// @description:zh-CN 按下 . 或 , 可以在任何视频/音频网站上以 0.6 倍速度慢放重播最后一句话，例如 YouTube、Bilibili 或 Spotify。 这在你学习一门语言并希望确保自己准确理解每一句话时非常有用。 或者在学习乐器并希望以较慢的速度重播某个部分时也很有用。
// @description:ja . または , を押すと、YouTube、Bilibili、Spotifyなどの任意のビデオ/オーディオサイトで、最後の文を0.6倍速でゆっくり再生します。 これは、言語を学んでいるときに、すべての文を正しく理解するために役立ちます。 または、楽器を学んでいて、特定の部分を遅い速度で再生したいときに便利です。
// @description:ko . 또는 ,를 눌러 YouTube, Bilibili, Spotify와 같은 비디오/오디오 사이트에서 마지막 문장을 0.6배속으로 천천히 재생하세요. 이는 언어를 배우면서 모든 문장을 정확히 이해하고자 할 때 유용합니다. 또는 악기를 배우면서 특정 구간을 느린 속도로 반복 재생하고 싶을 때도 도움이 됩니다.
// @description:pt Pressione . ou , para reproduzir a última frase lentamente a 0.6x de velocidade em qualquer site de vídeo/áudio como YouTube, Bilibili ou Spotify. Isso é útil quando você está aprendendo um idioma e quer garantir que entende cada frase corretamente. Ou aprendendo instrumentos e quer reproduzir uma seção em velocidade mais lenta.
// @description:ru Нажмите . или , чтобы воспроизвести последнее предложение медленно на скорости 0.6x на любом видео/аудио сайте, таком как YouTube, Bilibili или Spotify. Это полезно, когда вы изучаете язык и хотите убедиться, что правильно понимаете каждое предложение. Или изучаете музыкальные инструменты и хотите воспроизвести раздел на более медленной скорости.
// @description:it Premi . o , per riprodurre l'ultima frase lentamente a velocità 0.6x in qualsiasi sito video/audio come YouTube, Bilibili o Spotify. Questo è utile quando stai imparando una lingua e vuoi assicurarti di capire ogni frase correttamente. O quando impari strumenti musicali e vuoi ripetere una sezione a velocità più lenta.
// @description:nl Druk op . of , om de laatste zin langzaam af te spelen op 0.6x snelheid op elke video/audio site zoals YouTube, Bilibili of Spotify. Dit is nuttig wanneer je een taal leert en er zeker van wilt zijn dat je elke zin correct begrijpt. Of wanneer je instrumenten leert en een sectie op langzamere snelheid wilt herhalen.
// @description:sv Tryck på . eller , för att spela upp den sista meningen långsamt i 0.6x hastighet på vilken video/ljud-sajt som helst som YouTube, Bilibili eller Spotify. Detta är användbart när du lär dig ett språk och vill försäkra dig om att du förstår varje mening korrekt. Eller när du lär dig instrument och vill spela upp ett avsnitt i långsammare hastighet.
// @description:ar اضغط على . أو , لإعادة تشغيل الجملة الأخيرة ببطء بسرعة 0.6x في أي موقع فيديو/صوتي مثل YouTube أو Bilibili أو Spotify. هذا مفيد عندما تتعلم لغة وتريد التأكد من فهم كل جملة بشكل صحيح. أو عند تعلم الآلات الموسيقية وترغب في إعادة تشغيل قسم بسرعة أبطأ.
// @description:hi . या , दबाकर YouTube, Bilibili, या Spotify जैसी किसी भी वीडियो/ऑडियो साइट पर अंतिम वाक्य को 0.6x गति से धीरे-धीरे दोहराएं। यह तब उपयोगी है जब आप कोई भाषा सीख रहे हैं और यह सुनिश्चित करना चाहते हैं कि आप हर वाक्य को सही तरीके से समझते हैं। या जब आप संगीत वाद्ययंत्र सीख रहे हैं और किसी खंड को धीमी गति से दोहराना चाहते हैं।
// @description:tr YouTube, Bilibili veya Spotify gibi herhangi bir video/ses sitesinde son cümleyi 0.6x hızda yavaşça tekrar oynatmak için . veya , tuşuna basın. Bu, bir dil öğrenirken her cümleyi doğru anladığınızdan emin olmak istediğinizde yararlıdır. Veya enstrüman öğrenirken bir bölümü daha yavaş hızda tekrar oynatmak istediğinizde kullanışlıdır.
// @description:pl Naciśnij . lub , aby odtworzyć ostatnie zdanie powoli z prędkością 0.6x na dowolnej stronie wideo/audio, takiej jak YouTube, Bilibili lub Spotify. Jest to przydatne, gdy uczysz się języka i chcesz upewnić się, że rozumiesz każde zdanie poprawnie. Lub gdy uczysz się gry na instrumentach i chcesz odtworzyć fragment z wolniejszą prędkością.
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/503802/Pardon%2C%20could%20you%20say%20it%20again.user.js
// @updateURL https://update.greasyfork.org/scripts/503802/Pardon%2C%20could%20you%20say%20it%20again.meta.js
// ==/UserScript==

const $$ = (sel) => [...document.querySelectorAll(sel)];
const tryIt = (fn) => {
  try {
    fn();
  } catch (e) {}
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const stop = (e) => (e.preventDefault(), e.stopPropagation());
async function pardon(dt = 0, speed = 1, wait = 0) {
  const vs = $$("video,audio");
  const v = vs.filter((e) => !e.paused)[0];
  if (!v) return vs[0]?.click(); 
  if (dt !== 0) v.currentTime += dt;
  if (speed !== 1) v.playbackRate *= speed;
  if (wait) await sleep(wait);
  return true;
}

window.addEventListener(
  "keydown",
  async (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (document?.activeElement?.isContentEditable)
      return;
    if (["INPUT", "TEXTAREA"].includes(document?.activeElement?.tagName))
      return;
    if (e.code === "Comma") (await pardon(-3, 0.8)) && stop(e);
    if (e.code === "Period") (await pardon(0, 1.2)) && stop(e);
    if (e.code === "ArrowLeft") (await pardon(-1, 1)) && stop(e);
    if (e.code === "ArrowRight")
      (await pardon(0, 4, 4)) && (await pardon(0, 1 / 4)) && stop(e);
  },
  { capture: true }
);
