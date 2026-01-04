// ==UserScript==
// @name         Risibank Avatar
// @namespace    http://tampermonkey.net/
// @version      2024-09.v0.1.1
// @description  Offre la possibilite d'ajouter un avatar anime (GIF) dans les parametres de profil JVC (Fonctionne aussi avec des images fixes) aux yeux des utilisateurs de ce script.
// @author       Treflou
// @match        https://www.jeuxvideo.com/forums/*
// @match        https://www.jeuxvideo.com/messages-prives/*
// @match        https://www.jeuxvideo.com/profil/*?mode=infos
// @match        https://www.jeuxvideo.com/profil/*?mode=historique_forum
// @match        https://www.jeuxvideo.com/sso/infos_pseudo.php?id=*
// @icon         https://risibank.fr/logo.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503743/Risibank%20Avatar.user.js
// @updateURL https://update.greasyfork.org/scripts/503743/Risibank%20Avatar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function openRisiBank() { // Appel Risibank
        RisiBank.activate({

            ...RisiBank.Defaults.Overlay.Dark,
            mediaSize: 'sm',

            // Add selected image (risibank) to specified text area
            onSelectMedia: RisiBank.Actions.addRisiBankImageLink('#AvatarAnimeeRisi'),
        });
    }

    if (window.location.href.includes("https://www.jeuxvideo.com/sso/infos_pseudo.php?id=")) //Parametres du profil -> Ajout de la ligne "Ajouter un avatar anime :" avec previsualisation
    {

        // Import api risibank
        // html : script src="https://risibank.fr/downloads/web-api/risibank.js"></script>
        var risibankscript = document.createElement('script');
        risibankscript.src = "https://risibank.fr/downloads/web-api/risibank.js";
        risibankscript.type = "text/javascript";
        risibankscript.async = true;

        // Verifie que l'api est bien load
        risibankscript.addEventListener('load', function() {
            console.log('Le script Risibank est chargé et prêt à être utilisé.');
        });
        // Insertion du script dans le head
        document.head.appendChild(risibankscript);

        let InfosTable = document.getElementsByTagName("tbody")[0];
        let Ligne = InfosTable.insertRow(12); //Ajoute ligne au tableau
        let Case = Ligne.insertCell(0); //Ajoute première colonne

        Case.className += "cell-description p-inline-block";

        let Text = document.createElement('div');
        Text.className += "libelle";
        Text.appendChild(document.createTextNode("Avatar Animé : ")); //Ajoute ce texte dans la nouvelle ligne du tableau
        let button = document.createElement('a');
        button.className = "risibank-image"; //Bouton Risibank
        button.title = "Ajouter un média RisiBank";
        button.onclick = function() {
            document.getElementById('AvatarAnimeeRisi').value = ''; // Vide la zone de texte
            openRisiBank(); //Ouvre Risibank si logo cliqué
            return false;
        };
        button.href = "javascript:void(0);"; //palce holder
        let img = document.createElement('img'); //apparence logo risibank
        img.src = "https://risibank.fr/logo.png";
        img.width = 30; // Width in pixels //apparence
        img.height = 30; //apparence
        button.appendChild(img);
        Text.appendChild(button);
        Case.append(Text);

        let Url = document.createElement('div'); //Prépare la case lien URL
        Url.className += "valeur";
        Case.appendChild(Url);

        let UrlInput = document.createElement('input');
        UrlInput.className = 'form-control';
        UrlInput.placeholder = "https://risibank.fr/cache/medias..."; //Création de la case URl avec texte exemple
        UrlInput.id = "AvatarAnimeeRisi";
        Url.append(UrlInput);

        const InputStyle = {

            margin: "0.4rem 0", //Apparance de la case URL
            color : "#000000",
        };

        Object.assign(UrlInput.style, InputStyle); //Donne l'apparance à la case URL

        let Visuel = document.createElement('span');
        let Img = document.createElement('img'); //Création d'une image carré permettant de prévisualiser le sticker
        Img.setAttribute('src', 'https://image.jeuxvideo.com/avatar-sm/default.jpg'); //apparance sans avatar
        Img.style.height = '50px'; //apparance
        Img.style.width = '50px';
        Img.style.borderColor = "#4a4c4f";
        Img.style.margin = "10px";
        Img.style.objectFit = "scale-down"; //apparance

        Visuel.appendChild(Img);
        Case.appendChild(Visuel);

        let VisuelCercle = document.createElement('span');
        let ImgCercle = document.createElement('img'); //Création d'une image circulaire permettant de prévisualiser le sticker
        ImgCercle.setAttribute('src', 'https://image.jeuxvideo.com/avatar-sm/default.jpg'); //apparance sans avatar
        ImgCercle.style.height = '50px'; //apparance
        ImgCercle.style.width = '50px';
        ImgCercle.style.borderColor = "#4a4c4f";
        ImgCercle.style.borderRadius = "50%"; //Rend l'image circulaire
        ImgCercle.style.margin = "10px";
        ImgCercle.style.objectFit = "cover"; //apparance

        VisuelCercle.appendChild(ImgCercle);
        Case.appendChild(VisuelCercle);

        let NewSignature = document.querySelector("#signature");
        let NewSignatureText = NewSignature.textContent; //Récupère le texte de la signature
        let NewTag = ""; //initialisation du code sticker en lien avec le script
        let TagEnd = 0; //Fin du code
        let TagStart = 0; //Début du code

        let Valider = document.createElement('span');
        let BoutonValidation = document.createElement('button'); //Création du bouton "valider"
        BoutonValidation.innerText = "Valider"; //Texte du bouton
        BoutonValidation.className = 'simpleButton';
        Valider.appendChild(BoutonValidation);
        Valider.style.margin = '50px'; //apparence
        Case.appendChild(Valider);

        // Efface l'integralite du champ si "RETOUR ARRIERE" ou "SUPPR" sont utilises.
        UrlInput.onkeydown = function() {
            if(event.key === "Backspace" || event.key === "Delete") {
                UrlInput.value = "";
                return false;
            }
        };

        // Selectionne l'URL complete lors d'un clic si l'utilisateur veut la remplacer.
        UrlInput.addEventListener("click", () => UrlInput.select());

        UrlInput.addEventListener("input", (event) => {
            //let paste = (event.clipboardData || window.clipboardData).getData("text");
            let paste = UrlInput.value;

            if(paste === "")
            {
                return;
            }

            Img.setAttribute("src", paste); //Previsualisation "Carre"
            ImgCercle.setAttribute("src", paste); //Previsualisation "Cercle"

            NewTag = paste;

            if (NewTag.includes('https://risibank.fr/cache/medias/')) {
                //lien_risibank
            } else {
                alert("L'url doit contenir le lien direct risibank \nExemple : https://risibank.fr/cache/medias/0/34/3493/349399/full.png"); //Message d'erreur si l'URL n'est pas un lien Risibank (Noelshack non accepté par exemple)
                window.location.reload(); //RéActualise la page
                return;
            }

            let FormatLetter = NewTag.at(NewTag.lastIndexOf(".") + 1); //Récupère la première lette de l'extension : G comme Gif par exemple
            TagEnd = NewTag.lastIndexOf("/"); //Fin du Tag dans le lien collé
            TagStart = NewTag.lastIndexOf("/", TagEnd - 2); // Début du tag dans le lien collé

            NewTag = NewTag.substring(TagStart + 1,TagEnd) + FormatLetter; //Le nouveau code = le Tag du sticker (=son id) + la lettre de format G comme gif
        });

        Url.addEventListener("keydown", ({key}) => { //Validation du sticker si touche entrer - Securite

            if (key === "Enter") {

                Validation();
            }
        });

        BoutonValidation.addEventListener("click", () => { //Validation du sticker si bouton "Valider"

                Validation();
        });

        document.getElementsByClassName("valider-modif-profil")[0].addEventListener("click", () => { //Validation du sticker si validation du formulaire

                Validation();
        });

        function Validation() {
            if (NewTag.trim() !== "") { // Contenue valide
                if (NewSignatureText.indexOf("{") != -1) { //Verifie la presence d'un Tag debutant par {
                    let Accolade1 = NewSignatureText.indexOf("{"); //Position de la première accolade
                    let Accolade2 = NewSignatureText.indexOf("}", Accolade1 + 1); //Positon de la deuxième accolade
                    if (Accolade2 != -1) { //Verifie la presence d'une seconde } (= fin du tag)
                        if (Accolade1 + 1 === Accolade2) { //acolade_vide
                            NewSignature.innerHTML = NewSignatureText.slice(0, Accolade1 + 1) + NewTag + NewSignatureText.slice(Accolade2); //Indique que les accolades sont vides et où ajouter le tag
                        } else {
                            NewSignature.innerHTML = NewSignatureText.replace(NewSignatureText.substring(Accolade1 + 1, Accolade2), NewTag); //Si un ancien tag existait, le remplace
                        }
                    }
                } else { // = Premier avatar custom
                    NewSignature.innerHTML = NewSignatureText + " {"+NewTag+"} "; //Si premier avatar animé, ajout du tag
                }
            } else {
                // Si NewTag est vide vire les acolades existante avec des caratere ou non
                NewSignature.innerHTML = NewSignatureText.replace(/\{[^}]*\}/g, '');
            }
        }
    }

    if (window.location.href.includes("profil")) { //Si Page Profil
        try {
            let ProfilSignatureElement = document.getElementsByClassName("bloc-signature-desc"); //Regarde la signature
            let ProfilSignature = ProfilSignatureElement[0].textContent; //Récupère le texte de la signature
            let ProfilTag = getTag(ProfilSignature); //Récupère le tag en signature si existant
            if (ProfilTag != "") {

                let NewProfilAvatarURL = tagToURL(ProfilTag); //Permet de convertir le tag en lien Risibank équivalent
                let ProfilAvatar = document.querySelector("#header-profil > div.content-img-avatar > img");
                ProfilAvatar.setAttribute("src", NewProfilAvatarURL); //Change l'avatar de la page profil avec l'avatar animé
                ProfilAvatar.setAttribute("data-src", ""); // Corrige le lazy load
            }
        } catch (error) {
            console.error("Pas de Valeur PP signature"); //Si pas de tag en signature -> Message d'erreur
        }
    }

    let SignatureList = document.querySelectorAll("div.signature-msg"); //Liste des signatures de la page
    SignatureList.forEach(function(valeur){

        let Signature = valeur.textContent; //Recupere le texte de la signature
        let Tag = getTag(Signature); //Récupère le tag si existant

        if (Tag != "")
        {

            let NewAvatarURL = tagToURL(Tag); //Permet de convertir le tag en lien Risibank équivalent
            let Avatar = valeur.closest("div.conteneur-message").children[0].children[0].children[0]; //Trouve l'avatar lié à la signature
            Avatar.setAttribute("src", NewAvatarURL); //Change l'avatar du post avec l'avatar animé
            Avatar.setAttribute("data-src", ""); //Corrige le lazy load

            let TagRemoved = valeur.innerHTML.replace("{"+Tag+"}",""); //Enleve Tag de la signature
            valeur.innerHTML = TagRemoved;

        }
    });

    function getTag(SignatureString)
    {
        let Tag = "";

        if (SignatureString.indexOf("{") != -1) //Verifie la presence d'un Tag debutant par {
        {

            let PremiereAccolade = SignatureString.indexOf("{");
            let DeuxiemeAccolade = SignatureString.indexOf("}", PremiereAccolade + 1);

            if (DeuxiemeAccolade != -1) //Verifie la presence d'une seconde } (= fin du tag)
            {
                Tag = SignatureString.substring(PremiereAccolade + 1, DeuxiemeAccolade); //Scan les chiffres entre les {}
            }
        }

        return Tag;
    }

    function tagToURL(TagString) //Permet d'obtenir le lien de l'image desiree Ã  partir de son tag
    {

        let Tag = TagString;
        let URL = "/full."; //fin de l'URL avant format
        let Format = Tag.slice(-1).toLowerCase(); //Dernier caractere ( p pour PNG, j pour JPEG, g pour GIF,s pour SVG, b pour BMP, t pour TIFF) -> ajoute le format de l'image en fin d'URL
        let Length = Tag.length - 1;

        switch (Format) {

            case 'p':
                URL = URL + "png";
                break;
            case 'j':
                URL = URL + "jpeg";
                break;
            case 'g':
                URL = URL + "gif";
                break;
            case 's':
                URL = URL + "svg";
                break;
            case 'b':
                URL = URL + "bpm";
                break;
            case 't':
                URL = URL + "tiff";
                break;
            default:
                URL = URL + "gif";
                Length = Length + 1;
        }

        Tag = Tag.slice(0, Length); //enleve le dernier caractere du type de format
        URL = Tag + URL;

        for (var k = 1; k < 4; k++) //Reproduit la generation des URL de Risibank en partant du Tag (De droite vers la gauche) /!\ Pourrait devenir obsolete si les URL Risibank venaient Ã  changer de https://risibank.fr/cache/medias/0/2/239/23942/full.png Ã  https://risibank.fr/cache/medias/0/0/2/239/23942/full.png

        {
            Length = Length - 2;

            if (Length > 0)
            {
                URL = Tag.slice(0,Length) +"/"+ URL;
            }
            else{URL = "0/" + URL;}
        }

        URL = "https://risibank.fr/cache/medias/" + URL; //Debut de l'URL
        return URL;
    }

})();