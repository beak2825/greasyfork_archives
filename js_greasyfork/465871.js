// ==UserScript==
// @name        Darkino Perso Ebook
// @match       https://books.google.fr/**
// @match       *://www*.darkino.net/**
// @match       https://1fichier.com/**
// @match       https://valentine.wtf/**
// @version     X
// @author      Invincible812
// @description Script perso pour poster des ebooks sur Darkino
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.js
// @grant       GM.xmlHttpRequest
// @grant       GM_getValue
// @namespace https://greasyfork.org/users/868328
// @downloadURL https://update.greasyfork.org/scripts/465871/Darkino%20Perso%20Ebook.user.js
// @updateURL https://update.greasyfork.org/scripts/465871/Darkino%20Perso%20Ebook.meta.js
// ==/UserScript==


window.addEventListener('load', function () {
  if (location.pathname.includes('/mypanel/autopost')) {
    document.getElementsByTagName('option')[4].setAttribute("selected", "");
  }

  if (location.pathname.includes('/mypanel/addlink/')) {
    document.getElementsByTagName('option')[12].setAttribute("selected", ""); // FR
    document.getElementsByTagName('option')[101].setAttribute("selected", ""); // EPUB
    document.getElementsByClassName('form-textarea')[0].value="";

  }

  if (document.location.href.includes('/post/') && document.location.href.includes('/edit')) {
    document.getElementsByClassName('text-sm font-medium leading-4 text-gray-700 dark:text-gray-300')[4].insertAdjacentHTML('beforeend', `<b id="b_trad" class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline bg-gray-600 text-white hover:bg-gray-700 trad" title="trad">Trad Genres</b>`);
    function trad_genre() {
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Juvenile Fiction", "Fiction pour la jeunesse");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("General", "Roman");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Political Science", "Science politique");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("History", "Histoire");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Body", "Corps");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Mental & Esprit", "Mental & Esprit");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Magick Studies", "Études magiques");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Witchcraft", "Sorcellerie");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Self-Help", "Auto-assistance");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Humorous Stories", "Histoires humoristiques");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Love & Romance", "Amour & Romance");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Young Adult Fiction", "Fiction pour jeunes adultes");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Action & Adventure", "Action & Aventure");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Animals", "Animales");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Graphic Arts", "Arts graphiques");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Biography & Autobiography", "Biographie et autobiographie");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Social Science", "Sciences sociales");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Performing Arts", "Arts performants");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Poetry,", "Poésie");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("European", "Européen");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("French", "Français");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Games & Activities", "Jeux & Activités");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Logic & Brain Teasers", "Logique et casse-tête");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Literary Collections", "Collections littéraires");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Mind & Spirit", "Mental & Esprit");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Thrillers", "Thriller");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Medical (incl. Patients)", "Médical");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Contemporary", "Contemporain");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Health & Fitness", "Santé et forme");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Historical", "Historique");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Linguistics", "Linguistique");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Travel", "Voyage");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Food", "Alimentation");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Lodging & Transportation", "Hébergement & Transport");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Benelux Countries (Belgium, Netherlands, Luxembourg)", "");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Reference", "Référence");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Cooking", "Cuisine");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Courses & Dishes", "Cours & Plats");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Essays", "Essais");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("International Relations", "Relations internationales");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Beverages", "Breuvages");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("New Adult", "Nouvel adulte");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Scottish", "Écossais");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Life Sciences", "Sciences de la vie");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Microbiology", "Microbiologie");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Political Ideologies", "Idéologies politiques");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Theory", "Théorie");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("World", "Monde");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Sexuality", "Sexualité");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Technology", "Technologie");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Literary", "Littéraire");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Economics", "Économie");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Business", "Entreprise");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("True", "Vrai");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Biology", "Biologie");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Mystery", "Mystère");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Music", "Musique");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Fantasy & Magic", "Fantaisie & Magie");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Earth Sciences", "Sciences de la Terre");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Geography", "Géographie");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Psychology", "Psychologie");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Political Process", "Processus politique");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Campaigns & Elections", "Campagnes & Élections");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Philosophy", "Philosophie");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Military", "Militaire");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Modern", "Moderne");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Occult & Supernatural", "Occulte & Surnaturel");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("20th Century", "20ième siècle");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Family & Relationships", "Relations de famille");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Family Relationships", "Relations de famille");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Developmental", "Développement");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Child", "Enfant");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Ecology", "Écologie");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Colonial America & Revolution", "Amérique coloniale et révolution");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Small Town & Rural", "Petite Ville et Campagne");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Personal Growth", "Croissance personnelle");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Fantasy", "Fantaisie");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Lesbian", "Lesbienne");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Christian Church", "Église chrétienne");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Christianity", "Christianisme");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Applied Sciences", "Sciences appliquées");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Detective", "Détective");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Humorous", "Humour");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Black Humor", "Humour Noir");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Romantic Comedy", "Comédie Romantique");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Erotic", "Érotique");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Erotica", "Érotique");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Meditations", "Méditations");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Spiritual", "Spirituel");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Women", "Femme");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Geopolitics", "Géopolitique");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("Asia", "Asie");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("China", "Chine");
      document.getElementById("xfields.genre").value = document.getElementById("xfields.genre").value.replace("", "");

    }

    document.addEventListener('click', function (event) {
        if (event.target && event.target.classList.contains('trad')) {
          trad_genre()
        }
      });

  }

});


// PARTIE NFO

if (true) {
  if (document.location.pathname.includes('/addlink/')) {
    if (document.getElementsByClassName('addnews')[4].textContent.includes('Saison')) {
      null
    } else {
      document.getElementsByTagName('tbody')[0].children[3].insertAdjacentHTML('afterend', `<tr>
        <td class="addnews">ID Valentine:<a id="prez_create" class="butto" title="creer">Créer !</a></td>
                                <td class="xfields" colspan="2">
                                    <input id="id_val" class="form-control" name="title" type="text" placeholder="Ex : 456465">
                                </td>
                            </tr>`)
      $(document).on('click', '#prez_create', function (e) {


        let id = document.getElementById('id_val').value;

        GM.xmlHttpRequest({
          method: "GET",
          url: "https://valentine.wtf/pages/eBookModal.php?ebook_id=" + id + "&downloaded=0",
          onload: function (response) {
            console.log(response.responseText); // Affiche le contenu de la page HTML dans la console


            let parser = new DOMParser();
            let temp = parser.parseFromString(response.responseText, "text/html");
            let title = temp.querySelector('.col-lg-6 h3 a').textContent.trim();
            let title2 = "";
            if (temp.querySelector('.col-lg-6 h3 a:nth-of-type(2)') !== null) {
              title2 = temp.querySelector('.col-lg-6 h3 a:nth-of-type(2)').textContent.trim().replace(':', '');
              //title2 = " - " + title2;
            }
            let auteur = temp.querySelector('h5.bleuval').textContent.trim();
            //let genres = temp.querySelector('.col-lg-6 p a').textContent.trim();
            let annee = temp.querySelector('span[style="color: #a8a4a4"]:nth-of-type(2)').nextSibling.textContent.trim();
            let editor = temp.querySelector("span[style='color: #a8a4a4'] + br").previousSibling.textContent.trim()
            let pages = temp.querySelector('span[style="color: #a8a4a4"]:nth-of-type(3)').nextSibling.textContent.trim();
            //let resume = temp.querySelector('p:nth-child(2)').textContent.trim();
            //let taille = temp.querySelector('div.poids-ebook').textContent.substr(0, 5).trim();
            //let couv = temp.querySelector('img').src;

            if(title2.length>1){
              document.getElementsByTagName('textarea')[1].value = `Série : ${title}\nTome : ${title2}\nAuteur : ${auteur}\nÉditeur : ${editor}\nAnnée de parution : ${annee}\n\nBonne Lecture !`;
            }else{
              document.getElementsByTagName('textarea')[1].value = `Titre : ${title}\nAuteur : ${auteur}\nÉditeur : ${editor}\nAnnée de parution : ${annee}\n\nBonne Lecture !`;
            }
          }
        })
      })

    }
    }
}


if(location.href.includes('valentine.wtf')){

  $(document).on('click', '#eBookInfo', function(e){
    console.log(e)
  e.preventDefault();
  let id_books = $(this).data('id')
  function normaldl(){
		if (document.getElementsByClassName('content-page')[0].children[0].attributes[1].textContent=="modal fade show"){
           document.getElementsByClassName('telecharger')[0].insertAdjacentHTML(`afterend`,`<a id="save_prez" class="ebo_id" title="IDd">${id_books}</a>`);
      navigator.clipboard.writeText(id_books);
      $(document).on('click', '#save_prez', function() {
        let title = document.querySelector('.col-lg-6 h3 a').textContent.trim();
        let title2 = "";
        if(document.querySelector('.col-lg-6 h3 a:nth-of-type(2)')!==null){
          title2 = document.querySelector('.col-lg-6 h3 a:nth-of-type(2)').textContent.trim().replace(':','-');
          title2 = " - " + title2;
        }
        let auteur = document.querySelector('h5.bleuval').textContent.trim();
        let copy = title + title2 + ' - ' + auteur
        navigator.clipboard.writeText(copy);
    });
	}}normaldl()
	setTimeout(normaldl,4000);



});

}












