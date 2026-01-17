(function() {
    const container = document.querySelector('#bloc-formulaire-forum form, #repondre-mp form');
    if (!container) return console.warn("Pas de zone de texte"); // exit
    const textReact = '.messageEditor__containerEdit';
    if (container.querySelector(textReact)) return main(); //déjà là => start et exit
    const observer = new MutationObserver((muts) => {
        if (container.querySelector(textReact)) {
            observer.disconnect();
            clearTimeout(timeout);
            main();
        }
    });
    observer.observe(container, { childList: true, subtree: true });
    const timeout = setTimeout(() => observer.disconnect(), 4000); // abandon après 4 sec  exit
})();