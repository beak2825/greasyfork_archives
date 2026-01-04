/* ATTENDRE ZONE DE TEXTE JS */
function waittext(callback) {
    const container = document.querySelector('#forums-post-message-editor, #forums-post-topic-editor, .jv-editor');
    if (!container) return void console.warn("Pas de zone de texte"); // exit
    const editor = container.querySelector('.messageEditor__containerEdit');
    if (editor) return callback(); // trouve au chargement du script exit
    const observer = new MutationObserver(() => {
        if (container.querySelector('.messageEditor__containerEdit')) {
            observer.disconnect();
            clearTimeout(timeout);
            callback();
        }
    });
    observer.observe(container, { childList: true, subtree: true });
    const timeout = setTimeout(() => observer.disconnect(), 4000); // abandon après 4 sec  exit
}
/* ATTENDRE ZONE DE TEXTE JS */