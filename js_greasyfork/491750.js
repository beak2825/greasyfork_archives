// ==UserScript==
// @name         LassalleToutPartout
// @version      1.0
// @description  Remplace toutes les images par des jean lassalle. voila
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/1284415
// @downloadURL https://update.greasyfork.org/scripts/491750/LassalleToutPartout.user.js
// @updateURL https://update.greasyfork.org/scripts/491750/LassalleToutPartout.meta.js
// ==/UserScript==

(function() {
    const imagesList = [
        'https://upload.wikimedia.org/wikipedia/commons/c/c5/Jean_Lassalle.jpg',
        'https://www.gala.fr/imgre/fit/~1~gal~2023~02~22~56887fe1-d0af-466e-a27d-7632e42dd0e9.png/363x363/quality/80/focus-point/880,318/jean-lassalle-reconverti-en-boulanger-une-etonnante-video-devoilee.jpg',
        'https://www.gala.fr/imgre/fit/~1~gal~2022~11~18~00958827-385d-44f5-a081-e98b9c11ef39.jpeg/363x363/crop-from/top/il-marche-avec-difficulte-jean-lassalle-revient-de-loin-sept-mois-apres-la-presidentielle.jpg',
        'https://img.20mn.fr/9KEz5zL7Q8WBmw_obvCnvik/1444x920_jean-lassalle-former-french-deputy-at-the-60th-international-agricultural-show-2024-overseas-pavilion-paris-expo-porte-de-versailles-wednesday-28-february-2024-accorsinijeanne-lassalle-0048-credit-jeanne-accorsini-sipa-2402282211',
        'https://www.gala.fr/imgre/fit/~1~gal~2023~06~27~e0a1255a-71a5-455c-b1e9-69cb1ebf616b.jpeg/363x363/quality/80/focus-point/1862,1593/interview-jean-lassalle-determine-je-n-ai-pas-renonce-a-me-presenter-a-des-elections.jpg',
        'https://www.gala.fr/imgre/fit/~1~gal~2022~11~02~a5406421-c04f-4bf1-a599-ffaeae6ced42.png/363x363/quality/80/focus-point/1068,184/jean-lassalle-chanteur-il-devoile-une-collaboration-avec-une-star-de-plus-belle-la-vie.jpg',
        'https://www.gala.fr/imgre/fit/~1~gal~2023~03~10~16657f78-ec57-493e-b438-fa3dfe74d9f7.jpeg/363x363/quality/80/focus-point/852,281/jean-lassalle-sa-participation-surprise-a-un-celebre-jeu-de-m6.jpg',
        // Ajoutez d'autres liens d'images à cette liste selon vos besoins
    ];

    const getRandomImage = () => {
        const randomIndex = Math.floor(Math.random() * imagesList.length);
        return imagesList[randomIndex];
    };

    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const randomImage = getRandomImage();
        img.src = randomImage;
    });
})();
