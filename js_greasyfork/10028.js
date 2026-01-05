// ==UserScript==
// @name        Tradutor Furaffinity
// @namespace   binarte.com.fatranslate
// @description Tradus a interface da Furaffinity para Português Brasileiro
// @include     http://*.furaffinity.net/*
// @version     1.01
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10028/Tradutor%20Furaffinity.user.js
// @updateURL https://update.greasyfork.org/scripts/10028/Tradutor%20Furaffinity.meta.js
// ==/UserScript==
var orderTest = false;
var imgDict = {
  '/themes/classic/img/labels/adult.gif':
  'data:image/png; charset=binary;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAyAgMAAADD4sqJAAAADFBMVEUBAgBNOjiCX2DCj4/XVsA5AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wUYFgY1arNIPQAAAfRJREFUOMvdlD9q3EAUxr/RwIog8LSGgLdNs+gCAukkwTfYdos4Fj7BHsEHCMTFlo4lkgsIUqRVsV2aCSxEEFkv35M2CssKvIGkcKYQevP9Zt5fCfjfl9mWp2D2ZfaH9xa3jsdKxFsUawcRh1mXw6uCBFhWikXSEgsrI20ofsBi8WanCq5g+eSKs3NiUW3rc5dfOt7i8AGXQaMKHuDWS8XegPs4u6Nbp6/EjGcU71TBV8zhNI1Njy1WtlK7xwJGE71WJfiSLxDmxHyPJYmRddhljK11vBhOD8B+KhNN7xe2WmDZmKIesYsooxLeVAfY5gx4C9P0TnV/YXMqUVbvsSE2kcH3GFsqpSri97H1mQYi+W9MMy2kphJLs8+0r5st7cds+cLcj3Xz8FQSHhzqpl2Q73nwWR6d7AYslm81NlRWjHHogvZUfmSmfr8NtKeKzbqbCisqG1zgev3UGJ02RfakmUSa/aOPQk5Z/plgHEjMxKet8ylLK5jEOhTs8fWI0Z7CWhCo5wMmOhfpFNa8ilvXRiNGewrbJfPWdeGI0Z7C/JXjfNoRoz2F1Q/RAUZ7CivFHmC0p7AcwUFsuX5ux1gG02caNwNGewqjG61bE9Vxj6nbY6zj9j278KidgLVqF8dYGwl/FzORNftKTO30uY3lX8B+AjpPp4XXLfdyAAAAAElFTkSuQmCC',
  '/themes/classic/img/labels/mature.gif':
  'data:image/png; charset=binary;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAyAgMAAADD4sqJAAAADFBMVEUAAgA3PUNncHmmsr/mMnnKAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wUYFgknHpIlugAAAilJREFUOMvdlLGO00AQhsce5SywlG2vOrc0kV/Aki0o7i1Q3iBtCg7v3RNEPAcFRUq4NXcvYEFBu0jpaBbJEpZwMvwbJzmQTyhIUBwry7L8fzs7s//sEv3vI2iqYzBOij+Ma1YK0yqarQKzUCSi6EQW5LxCGZGxHoulAxbVgXSRuB5LxQWNV+iCGG+MtDgFFlu2p0pPFaIoekfTsPUKXZOqS4+9IPyn8Rssq/wnsMAhi9deoS+UkPJlLLfYZM6WlO6xsEb4514JP+kJRRqY22JZFsgi2hTIrVMITMpPIL6tMl/eHptPaNYFxh2ws7iAEl3Vv2DLMdFLCtrtov7/hDWUuLA7rM9NpF/7kFsulVfE7XLbVhqK6DvMV2rEQkml3VWa+33jim+K2aPgbb9va5o6clAyTFzM9i7INx1+lLWSpsdS+WppCWWOHHsXvKfyvQg+mxWs7LETeVXTHMqSznae/q6NjusiPqonKdf/6FDIMcM9CAztyFLlQiMDj7mDYUL3YKZl0SnaLukxMht00wArG5YiEW6jLabqfE3lEEstbx4DkLDHXN4+yQdYmHzgtYqAXe6xJksGGKtb7pJnwKrdoqW7UEPs/Jzb9OqAUSD2Oh5iN4qb/P3PWC3REKsTXA90l5s2GrfRALMp43iWvtJ4A8zmBSIOMFdyJS7Hvm3CNkalCdYfYngupUnhghTeiXYcSW3uw576Mz4ygtu1U+tRLLZ8SG35V7Afjq6PQCzCptIAAAAASUVORK5CYII=',
  '/themes/classic/img/labels/general.gif':
  'data:image/png; charset=binary;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAyAgMAAADD4sqJAAAADFBMVEUAAgBUVVOWmJX7/fqo/AB/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wUYFgwWMjvRxQAAAehJREFUOMvdk7FqHDEQhkcr4iUIrNZV9gkOv8DCLfgF8gTBb3DtFU52iV9gIa+RIsWVJpKdFxCkSKviujQyLOQIuzeZkS4XUmi5FClsFcui/9PonxkNwHNfYrCnYLJq/jGu2Wo6ZmG1FabXgKjhDHsIrEANYDxjCkfCSidwLDEk7BKDGFiBtyDpS2vZXBCmvNxe6P5aUxQNE1wXO1bgM2jXMnYDtA/nn+hazb+EiUAuPrIC36ECzWlsIrZYSw+6S1jhKPwbVopv3QLKjrAQsboW2Jf7hryNmgKD5gMgv9ia0/uNrRewGoUJR+yVakgp37u/sM05wDsQu3gp7y9kR4pq/AGL3gRiE+8+emvRkVLhcPAWMy0Quz8YZ2rQk3KJu0OmsW7Syodm9VLcHesWIJBS08FUN02e8UdXfMVJ45CwJT562JCyJo+pC9xTciYezZZambAz/ODghpSBqpt6OveMTntF8qQ3CcvuPw0FnrLCk8H6F4YGgkaRJgxtDpuooBFT6FUeG9TPlkQ7SXRlHvNLZNGixIfbPObMEbu6z2MsWLI3lVi6OcxqxqDaK2/mMQ5YTTq0M97GiO3UyKXJZ5qwvRxoQmfqljAUIR3IdkFzF7Dz7aToL9NTJ2JP0b02+zKPPYPXm8d+AX2X2EOrqHnjAAAAAElFTkSuQmCC'
};
var dict = {
  'pt-BR': {
    '[Cancel]': '[Cancelar]',
    'Comment posting has been disabled by the submission owner.': 'A publicação de comentários foi desativada pelo autor.',
    'Photo information:': 'Dados da foto:',
    'Camera:': 'Câmera',
    'Date and Time:': 'Hora e Data',
    'Aperture:': 'Abertura:',
    'ISO Speed': 'Velocidade ISO:',
    'Focal length:': 'Comprimento do Foco:',
    'Metering Mode:': 'Modo de Fotometria:',
    'Exposure:': 'Exposição',
    'happy': 'feliz',
    'aggravated': 'agravado',
    'contemplative': 'contemplativo',
    'Back': 'Anterior',
    'Next': 'Próximo',
    'Featured Submission': 'Arte em Destaque',
    'Profile Information': 'Informação do Perfil',
    'Artist Type': 'Tipo de Artista',
    'angry': 'bravo',
    'lonely': 'solitário',
    'loved': 'amado',
    'melancholy': 'melancólico',
    'worried': 'preocupado',
    'working': 'trabalhador',
    'weird': 'esquisito',
    'uncomfortable': 'desconfortável',
    'touched': 'tocado',
    'tired': 'cansado',
    'thoughtful': 'profundo',
    'thirsty': 'sedento',
    'thankful': 'agradecido',
    'sympathetic': 'simpatético',
    'surprised': 'surpreso',
    'stressed': 'estressado',
    'sleepy': 'sonolento',
    'sick': 'doente',
    'shocked': 'chocado',
    'sad': 'triste',
    'satisfied': 'satisfeito',
    'relieved': 'aliviado',
    'relaxed': 'relaxado',
    'rejuvenated': 'rejuvenecido',
    'rejected': 'rejeitado',
    'productive': 'produtivo',
    'predatory': 'predatorial',
    'pleased': 'contente',
    'pissed off': 'puto da vida',
    'pessimistic': 'pessimista',
    'pensive': 'pensativo',
    'optimistic': 'otimista',
    'sore': 'dolorido',
    'silly': 'bobo',
    'scared': 'com medo',
    'rushed': 'apressado',
    'restless': 'inquieto',
    'refreshed': 'refrescado',
    'recumbent': 'recumbente',
    'quixotic': 'quixotesco',
    'peaceful': 'pacífico',
    'okay': 'bom',
    'numb': 'entorpecido',
    'nostalgic': 'nostálgico',
    'nervous': 'nervoso',
    'Age': 'Idade',
    'Species': 'Espécie',
    'Operating System': 'Sistema Operacional',
    'Music Genre': 'Gênero Musical',
    'Favorite Movie': 'Filme Favorito',
    'Favorite Artist': 'Artista Favorito',
    'Favorite Animal': 'Animal Favorito',
    'Favorite Site': 'Site Favorito',
    'Favorite Food': 'Comida Favorita',
    'Personal information': 'Informação Pessoal',
    'Crafter': 'Artesão',
    'Fursuit Maker': 'Confeccionador de Fursuits',
    'App Skinner': 'Skinner de Aplicativos',
    'Watcher': 'Seguidor',
    '3D Animator': 'Animador 3D',
    '3D Modeller': 'Modelador 3D',
    'PrOn Artist': 'Artista Pornográfico',
    'Landscaper': 'Paisagista',
    'Favorite Game': 'Jogo Favorito',
    'Music Player of Choice': 'Tocador de Música Favorito',
    'Mood': 'Humor',
    'Quote:': 'Citação',
    'Not Available...': 'não disponível...',
    'Photographer': 'Fotógrafo',
    'Writer': 'Escritor',
    'Musician': 'Músico',
    'Anime Artist': 'Mangaka',
    'Digital Artist': 'Artista Digital',
    'Traditional Artist': 'Artista Tradicional',
    'FA Forums': 'Fóruns FA',
    'IRC Chat': 'Chat IRC',
    'Advertising': 'Anúncios',
    'News and Updates': 'Notícias e Atualizações',
    'Knowledgebase': 'Base de conhecimento',
    'Site Staff': 'Equipe do Site',
    'Terms of Service': 'Termos de Serviço',
    'Code of Conduct': 'Código de Conduta',
    'Acceptable Upload Policy': 'Política de Uploads Aceitáveis',
    'Notes': 'Mensagens Privadas',
    'Journal Settings': 'Opções do Diário',
    'Submissions': 'Gerenciar Galeria',
    'Commission Info': 'Informações de Comissões',
    'Browse': 'Navegar',
    'Search': 'Procurar',
    'Submit': 'Enviar',
    'a few seconds ago': 'há alguns segundos',
    'a few minutes ago': 'há alguns minutos',
    'couple of minutes ago': 'há dois minutos',
    'a minute ago': 'há um minuto',
    'a second ago': 'há um segundo',
    'Report a Problem': 'Reportar um Problema',
    '▼ Account Management': '▼ Gerenciamento da Conta',
    '▼ Page Management': '▼ Gerenciamento da Página',
    '▼ Site Security': '▼ Segurança do Site',
    'Account Settings': 'Opções da Conta',
    'Site Settings': 'Opções do Site',
    'Profile Info': 'Informações do Perfil',
    'Upload/Change Avatar': 'Atualizar/Enviar Avatar',
    '▼ Community': '▼ Comunidade',
    '▼ Support': '▼ Suporte',
    '▼ My FA': '▼ Meu FA',
    'Category:': 'Categoria:',
    'Theme:': 'Tema:',
    'Gender:': 'Gênero:',
    'Species:': 'Espécie:',
    'Send note': 'Enviar mensagem privada',
    'Send Note': 'Enviar Mensagem Privada',
    'newer »': 'próximo »',
    'User comments': 'Comentários dos usuários',
    'User Page': 'Página do usuário',
    'Page Shouts': 'Comentários da Página',
    'Watch List': 'Lista de Seguidos',
    'Active Sessions': 'Sessões Ativas',
    'Activity Log': 'Registro de Atividade',
    'Browser Labels': 'Rótulos de Navegadores',
    'Log Out': 'Sair',
    'Gallery': 'Galeria',
    'Journals': 'Diário',
    'Reply to this post': 'Responder a esse comentário',
    '« older': '« anterior',
    '+Add to Favorites': '+Favorito',
    'Full View': 'Ver tamanho real',
    'Go to Gallery': 'Ir à Galeria',
    '- by': '- por',
    'All': 'Todos',
    'Horse': 'Cavalo',
    'Female': 'Fêmea',
    'Fetish Other': 'Outro Fetiche',
    'Favorites': 'Favoritos',
    'Posted:': 'Postado:',
    'Site Status': 'Status do site',
    'Users online': 'Usuários online',
    'guests': 'convidados',
    'registered': 'registrados',
    'Favorites:': 'Favoritos:',
    'Comments:': 'Comentários:',
    'Views:': 'Visualizações:',
    'Image Specifications:': 'Especificações da imagem:',
    'Resolution:': 'Dimensões:',
    'Keywords:': 'Palavras-chave:',
    'Submission information:': 'Informações:',
    'Write a reply?': 'Escrever um Comentário?',
    'Oldest': 'Mais Antigos',
    'Newest': 'Mais Novos',
    '>>> 60 more >>>': '>>> mais 60 >>>',
    'New Submissions': 'Novas Artes',
    '", posted by': '", postado por',
    'New Watches': 'Novos seguidores',
    'New submission comments': 'Novos comentários em artes',
    'New journal comments': 'Novos comentários em diários',
    'New journals': 'Novos diários',
    'New favorites': 'Novos favoritos',
    'has replied to': 'respondeu ao',
    'View all favorites': 'Ver mais favoritos',
    'your': 'seu',
    'comment on': 'comentário no',
    'Comment': 'Comentário',
    'Journal': 'Diário',
    'or the': 'ou o',
    'it was left on has been deleted.': 'em que foi deixado foi removido.',
    'comment on a journal titled "': 'comentário em um diário com o título "',
    'comment on a submission titled "': 'comentário em uma arte com o título "',
    'submission titled "': 'arte com o título "',
    'their': 'próprio',
    'From': 'De',
    ', posted': ', postado',
    'has favorited "': 'adicionou a seus favoritos "',
    'Search query': 'Conteúdo da consulta',
    'results per page, sort by': 'resultados por página, ordenar por',
    'in the': 'em ordem',
    'relevancy': 'relevância',
    'date': 'data',
    'popularity': 'popularidade',
    'ascending': 'ascendente',
    'descending': 'descendente',
    'journal titled "': 'diário com o título "',
    'order': ' ',
    'January': 'Janeiro',
    'Jan': 'Janeiro',
    'February': 'Fevereiro',
    'Feb': 'Fevereiro',
    'March': 'Março',
    'Mar': 'Março',
    'April': 'Abril',
    'Apr': 'Abril',
    'May': 'Maio',
    'June': 'Junho',
    'Jun': 'Junho',
    'July': 'Julho',
    'Jul': 'Julho',
    'August': 'Agosto',
    'Aug': 'Agosto',
    'September': 'Setembro',
    'Sep': 'Setembro',
    'October': 'Outubro',
    'Oct': 'Outubro',
    'November': 'Novembro',
    'Nov': 'Novembro',
    'December': 'Dezembro',
    'Dec': 'Dezembro',
    'General': 'Geral',
    'General, Mature': 'Geral e Madura',
    'General, Mature, Adult': 'Geral, Madura e Adulta',
    'Time zone': 'Fuso Horário',
    'Date of Birth': 'Data de Nascimento',
    'Content Maturity Filter': 'Filtro de Conteúdo Maduro',
    'Style': 'Estilo',
    'Change Password': 'Mudar senha',
    'Disable Account': 'Desativar Conta',
    'Password Confirmation': 'Confirmação de senha',
    'Confirm Password': 'Confirmar senha',
    'Account is enabled.': 'Conta está ativada',
    'Account is disabled.': 'Conta está desativada',
    'New Password:': 'Nova Senha',
    'Reconfirm:': 'Confirme a Senha',
    'Stylesheet:': 'Folha de estilos',
    'classic': 'Clássico',
    'Dark': 'Negro',
    'Light': 'Claro',
    'PLEASE NOTE:': 'IMPORTANTE:',
    'Display Name': 'Nome no Perfil',
    'Email Address [REQUIRED]': 'Endereço de E-mail [OBRIGATÓRIO]',
    'The name that appears on your User Page.': 'O nome que aparece na sua página pessoal.',
    'submissions at a time': 'artes de cada vez',
    'Rating:': 'Classificação:',
    'general': 'geral',
    'mature': 'madura',
    'adult': 'adulta',
    'View': 'Visualizar',
    'Journal Information': 'Informações do Diário',
    'Journal Header': 'Cabeçalho do Diário',
    'Journal Footer': 'Rodapé do Diário',
    'With the following fields, you can change options or appearance of your journal.': 'Com os campos abaixo você pode mudar a aparência do seu diário.',
    'The following will be displayed at the top of your journal': 'Este texto será mostrado acima do seu diário',
    'The following will be displayed at the bottom of your journal': 'Este texto será mostrado abaixo do seu diário',
    'Type:': 'Tipo:',
    'Artwork (Digital)': 'Arte Digital',
    'Artwork (Traditional)': 'Arte Tradicional',
    'Hyper': 'Híper',
    'Abstract': 'Abstrato',
    'Comics': 'Quadrinhos',
    'Doodle': 'Rabisco',
    'Fantasy': 'Fantasia',
    'Human': 'Humano',
    'Portraits': 'Retratos',
    'Scenery': 'Paisagens',
    'Still Life': 'Vida Morta',
    'Tutorials': 'Tutoriais',
    'Miscellaneous': 'Miscelânea',
    'Baby fur': 'Bebê',
    'Fat Furs': 'Gordura',
    'Inflation': 'Inflação',
    'Muscle': 'Músculo',
    'Pokemon': 'Pokémon',
    'Pregnancy': 'Gravidez',
    'Transformation': 'Transformação',
    'General Furry Art': 'Arte Furry em Geral',
    'Classical': 'Clássica',
    'Other Music': 'Outra Música',
    'Music': 'Música',
    'Crafting': 'Artesanato',
    'Sculpting': 'Escultura',
    'Photography': 'Fotografia',
    'Icons': 'Ícone',
    'Mosaics': 'Mosaico',
    'Story': 'Estória',
    'Poetry': 'Poesia',
    'Prose': 'Prosa',
    'Resources': 'Recurso',
    'Adoptables': 'Adotável',
    'Auctions': 'Leilão',
    'Contests': 'Concurso',
    'Current Events': 'Evento Atual',
    'Scraps': 'Rascunhos',
    'Screenshots': 'Captura de Tela',
    'Wallpaper': 'Papel de Parede',
    'Desktops': 'Área de Trabalho',
    'Other': 'Outro',
    'Fanart': 'Fanarte',
    'Male': 'Macho',
    'Primate - Human': 'Primata - Humano',
    'Multiple characters': 'Múltiplos Personagens',
    'Edit': 'Editar',
    'Hide': 'Ocultar',
    'Recent Artwork ': 'Arte Recente',
    'Recent Writing': 'Literatura Recente',
    'Recent Music': 'Músicas Recentes',
    'Unspecified / Any': 'Não Especificada / Qualquer',
    'Western': 'Dragão Europeu',
    'Dragon (Other)': 'Dragão (Outro)',
    'Any': 'Qualquer',
    'Feline - Cat': 'Felino - Gato',
    'Animal related (non-anthro)': 'Animal não-antropomórfico',
    'Canid - Vulpine': 'Canídeo - Vulpino',
    'Canid (Other)': 'Canídeo (Outro)',
    'Exotic (Other)': 'Exótico (Outro)',
    'Bovid - Bovines': 'Bovídeo - Bovino',
    'Satyr': 'Sátiro',
    'Herm': 'Hermafrodita',
    'Insect (Other)': 'Inseto (Outro)',
    'Canid - Coyote': 'Canídeo - Coiote',
    'Canid - Dog': 'Canídeo - Cachorro',
    'Canid - Wolf': 'Canídeo - Lobo',
    'Canid - GSD': 'Canídeo - Pastor Alemão',
    'Canid - Husky': 'Canídeo - Husky',
    'Canid - Jackal': 'Canídeo - Chacal',
    'Canid - Doberman': 'Canídeo - Doberman',
    'Canid - Dingo': 'Canídeo - Dingo',
    'Mantid': 'Inseto - Louva-Deus',
    'Scorpion': 'Aracnídeo - Escorpião',
    'Arachnid': 'Aracnídeo (Outro)',
    'Dinosaur - Sauropod': 'Dinossauro - Saurópodo',
    'Dinosaur - Theropod': 'Dinossauro - Terópodo',
    'Turtle': 'Tartaruga',
    'Bat': 'Morcego',
    'Bear': 'Urso',
    'Alligator': 'Jacaré',
    'Crocodile': 'Crocodilo',
    'Gecko': 'Lagartixa',
    'Frog': 'Rã',
    'Lizard': 'Lagarto',
    'Snake': 'Cobra',
    'Newt': 'Tritão',
    'Salamander': 'Salamandra',
    'Amphibian (Other)': 'Anfíbio (Outro)',
    'Cephalopod': 'Cefalópode',
    'Cetacean - Dolphin': 'Cetáceo - Golfinho',
    'Cetacean - Whale': 'Cetáceo - Baleia',
    'Cetacean (Other)': 'Cetáceo (Outro)',
    'Fish (General)': 'Peixe (Outro)',
    'Shark': 'Peixe - Tubarão',
    'Eastern': 'Dragão Asiático',
    'Serpent': 'Serpente',
    'Hydra': 'Hidra',
    'Feline - Cheetah': 'Felino - Guepardo',
    'Feline - Cougar': 'Felino - Puma',
    'Feline - Jaguar': 'Felino - Jaguar',
    'Feline - Leopard': 'Felino - Leopardo',
    'Feline - Lion': 'Felino - Leão',
    'Feline - Lynx': 'Felino - Lince',
    'Feline - Ocelot': 'Felino - Jaguatirica',
    'Feline - Panther': 'Felino - Pantera',
    'Feline - Tiger': 'Felino - Tigre',
    'Feline (Other)': 'Felino (Outro)',
    'Giraffe': 'Girafa',
    'Hedgehog': 'Ouriço',
    'Hyena': 'Hiena',
    'Hippopotamus': 'Hipopótamo',
    'Llama': 'Lhama',
    'Bovid - Antelope': 'Bovídeo - Antílope',
    'Bovid - Gazelle': 'Bovídeo - Gazela',
    'Bovid - Goat': 'Bovídeo - Bode',
    'Bovid - Antelope': 'Bovídeo - Antelope',
    'Bovid (Other)': 'Bovídeo (Outro)',
    'Donkey': 'Jumento',
    'Cervine': 'Cervino',
    'Alien': 'Alieníngena',
    'Meerkat': 'Suricato',
    'Pig/Swine': 'Suíno',
    'Marsupial - Opossum': 'Marsupial - Gambá',
    'Marsupial - Kangaroo': 'Marsupial - Canguru',
    'Marsupial - Koala': 'Marsupial - Coala',
    'Marsupial (Other)': 'Marsupial (Outro)',
    'Skunk': 'Cangambá',
    'Squirrel': 'Roedor - Esquilo',
    'Rodent - Rat': 'Roedor - Rato',
    'Rodent - Mouse': 'Roedor - Camundongo',
    'Rodent - Beaver': 'Roedor - Castor',
    'Rodent (Other)': 'Roedor (Outro)',
    'Seal': 'Foca',
    'Raccoon': 'Racum',
    'Red Panda': 'Panda-Vermelho',
    'Mongoose': 'Mangusto',
    'Rabbit': 'Coelho',
    'Crow': 'Corvídeo - Corvo',
    'Corvid': 'Corvídeo (Outro)',
    'Duck': 'Pato',
    'Eagle': 'Águia',
    'Owl': 'Coruja',
    'Hawk': 'Gavião',
    'Falcon': 'Falcão',
    'Goose': 'Ganso',
    'Swan': 'Cisne',
    'Phoenix': 'Fênix',
    'Gryphon': 'Grifo',
    'Avian (Other)': 'Ave (Outro)',
    'Reptilian (Other)': 'Réptil (Outro)',
    'Reptilian': 'Réptil',
    'Mustelid (Other)': 'Mustelídeo (Outro)',
    'Mustelid - Ferret': 'Mustelídeo - Furão',
    'Mustelid - Otter': 'Mustelídeo - Lontra',
    'Mustelid - Weasel': 'Mustelídeo - Fuinha',
    'Mustelid - Wolverine': 'Mustelídeo - Carcaju',
    'Mustelid - Badger': 'Mustelídeo - Texugo',
    'Mustelid - Mink': 'Mustelídeo - Visom',
    'Primate - Gorilla': 'Primata - Gorila',
    'Primate - Lemur': 'Primata - Lêmur',
    'Primate - Monkey': 'Primata - Macaco',
    'Primate (Other)': 'Primata (Outro)',
    'Aquatic (Other)': 'Aquático (Outro)',
    'Mammals (Other)': 'Mamífero (Outro)',
    'Mammals': 'Mamífero',
    'Elf': 'Elfo',
    'Unicorn': 'Unicórnio',
    'Gargoyle': 'Gárgula',
    'Monster': 'Monstro',
    'Daemon': 'Demônio',
    'Other / Not Specified': 'Outro / Não Especificado',
    'Transgender': 'Transsexual',
    'Full Name:': 'Nome Completo:',
    'Artist Type:': 'Tipo de Artista:',
    'Registered Since:': 'Membro Desde:',
    'Artist Profile:': 'Perfil:',
    'Current mood:': 'Humor Atual:',
    'Journals:': 'Diários:',
    'Comments Received:': 'Comentários Recebidos:',
    'Pageviews:': 'Visualizações:',
    'Submissions:': 'Artes:',
    '+Watch': '+Seguir',
    '-Watch': '-Seguir',
    'Artist Information': 'Informações do Artista',
    'Contact Information': 'Informações de Contato',
    'Shouts': 'Gritos',
    'Read more...': 'Leia mais...',
    'Featured submission': 'Em Destaque',
    'Latest Submissions': 'Arte Recente',
    'View Gallery': 'Ver Galeria',
    'faved:': 'favoritado:',
    'uploaded:': 'enviado:',
    'by': 'por',
    'New shouts': 'Novos gritos',
    'Watched by': 'Seguidores',
    'Is watching': 'Está seguindo',
    'Fur Affinity is © 2005-2015 IMVU': 'Fur Affinity © 2005-2015 IMVU',
    'Avian': 'Ave',
    'Aquatic': 'Aquático',
    'Amphibian': 'Anfíbio',
    'Dragon': 'Dragão',
    'Exotic': 'Exótico',
    'Visual Art': 'Arte Visual',
    'Readable Art': 'Arte Escrita',
    'Audio Art': 'Arte Sonora',
    'Other Stuff': 'Outros Tipos',
    'General Things': 'Tipos Gerais',
    'Rhinocerus': 'Rinoceronte',
    'Rat': 'Roedor - Ratazana',
    'Fetish / Furry specialty': 'Fetiche / Especialidade Furry',
    'Game Music': 'Música de Videogame',
    'Choose the type of a submission you would like to upload': ' ',
    'Welcome to the submission manager': 'Bem-vindo ao gerenciador de envios',
    'Please choose the type of submission you would like to make:': 'Escolha o tipo de arte que você quer enviar',
    'Artwork': 'Imagem',
    'Submit your art and images.': 'Arte e fotografia',
    'Submit a flash animation that you made!': 'Uma animação em flash que você tenha feito',
    'Submission for short stories and other creative writing.': 'Estórias curtas e outras escritas criativas',
    'Submit your poetry and prose!': 'Enviar poesia e prosa',
    'Select the file to upload.': ' ',
    'Choose your piece to showcase': 'Escolha o trabalho para expõr',
    'This file will be what is viewed as a full size image.': 'Este é o arquivo que será visto como a arte em si',
    'Submission File': 'Arquivo de envio',
    'Audio recordings and musical compositions.': 'Gravações sonoras e composições musicais',
    'Please note': 'Importante',
    ': All works you submit must abide by the': ': Tudo que você enviar deve estar de acordo com a ',
    'Acceptable Upload Policy (AUP)': 'Política de Uploads Aceitáveis',
    '. Any submission which does not adhere to the policies outlined in the AUP may be subject to removal without notice.':
    '. Qualquer envio que não esteja de acordo com a política está sujeito à remoção sem aviso prévio.',
    'Accepted formats': 'Formatos aceitáveis',
    'Max. file size': 'Tamanho máximo do arquivo',
    'Max. image dimensions': 'Tamanho máximo da imagem',
    'Note': 'Observação',
    'Note:': 'Observação:',
    ': Images larger than the maximum dimensions (1280x1280) will be resized down to the max. limit and converted to JPEG format. Even though the image will be transparently resized, it is advised that you resize the image yourself to meet FA\'s limitations before uploading it to the server.':
    ': Imagens maiores que o tamanho máximo (1280×1280) serão redimensionadas para o limite máximo e convertidas para formato JPEG. Apesar da imagem ser redimensionada automaticamente, é recomendável redimensionar a imagem de acordo com as limitações antes de enviar para a Fur Affinity.',
    'Uploading submissions larger than 1280x1280 will require you to upload a smaller version, edit your submission, and then upload the larger version.':
    'Para enviar imagens maiores que 1280×1280 é necessário enviar uma versão reduzida e depois editar a arte para enviar a versão no tamanho original.',
    ': When uploading flash files, be sure to provide a thumbnail. Fur Affinity can not generate them from the .swf file itself yet.':
    ': Ao enviar arquivos em Flash, lembre-se de incluir um thumbnail. O Flash é uma desgraça que é impossível de gerar thumbnails em PHP.',
    '( Optional )': '( Opcional )',
    '[ submission ]': '[ imagem ]',
    '[ music ]': '[ música ]',
    '[ story ]': '[ estória ]',
    '[ poetry ]': '[ poesia ]',
    'Toggle Descriptions': 'Ativar/Desativar Descrições',
    'Invert selection': 'Inverter Seleção',
    'Check/Uncheck all': 'Marcar/Desmarcar Todos',
    'Nuke all Submissions': 'Remover Todos',
    'Nuke watches': 'Remover Todos',
    'Nuke submission comments': 'Remover Todos',
    'Nuke journal comments': 'Remover Todos',
    'Nuke shouts': 'Remover Todos',
    'Nuke favorites': 'Remover Todos',
    'Nuke journals': 'Remover Todos',
    'Remove checked': 'Remover Marcados',
    'Remove selected': 'Remover Marcados',
    'Anthro Artist': 'Artista Antropomórfico',
    'System Message': 'Mensagem do Sistema',
    'Error: There was a problem uploading your file. System response:': 'Erro: Houve um problema ao fazer upload do arquivo. Resposta do sistema:',
    'Click here to go back...': 'Clique aqui para voltar...',
    'Click here to go back': 'Clique aqui para voltar...',
    'The file name of the uploaded file is too long': 'O nome do arquivo do upload é longo demais',
    'Fatal system error!': 'Erro Fatal de Sistema!',
    'File type dissallowed.': 'Tipo de arquivo não permitido.',
    'Select all': 'Selecionar Todos',
    'Select streams': 'Selecionar Streams',
    'Select none': 'Desfazer Seleções',
    'Recent Artwork': 'Arte Recente',
    'Global select all': 'Selecionar Todos Global',
    'Global select none': 'Desfazer Seleções Global',
    'Global remove selected': 'Remover Marcados Global',
    'Select all': 'Selecionar todos',
    'cheerful': 'alegre',
    'Profile information updated.': 'Informações do perfil atializadas.',
    'Click here to continue...': 'Clique aqui para continuar...',
    'This file type may be the wrong format for the submission type you are trying to make,': 'Este arquivo pode estar no formate errado para o tipo de arte que você quer enviar, ou simplesmente não é aceito.',
    'or is simply a file type that is not allowed at all.': ' ',
    'Click the link below to review the submission you are trying to make.': 'Clique no link abaixo para verificar o envio que você está tentando fazer.'
  }
};
var regDict = [
  {
    'regex': /(Full List) \([0-9]+\)/,
    'replace': {
      'Full List': 'Lista Completa'
    }
  },
  {
    regex: /(and) [0-9]+/,
    replace: {
      'and': 'e'
    }
  },
  {
    regex: /(Page generated in) [0-9]+(\.[0-9]+) (seconds) [ [0-9]+(\.[0-9]+)% PHP, [0-9]+(\.[0-9]+)% SQL ] \([0-9]+ (queries)\)/,
    replace: {
      'Page generated in': 'Página gerada em',
      'seconds': 'segundos',
      'queries':
      'consultas'
    }
  },
  {
    regex: /(This submission is copyright) .+/,
    replace: {
      'This submission is copyright': 'Os direitos deste trabalhos estão reservados a'
    }
  },
  {
    regex: /(Server Local Time:) .*/,
    replace: {
      'Server Local Time:': 'Hora local do servidor:'
    }
  },
  {
    regex: /[0-9]+ (years?|months?|days?|hours?|minutes?) (ago)/,
    replace: {
      'ago': 'atrás',
      'years': 'anos',
      'year': 'ano',
      'months': 'meses',
      'month': 'mês',
      'days': 'dias',
      'day': 'dia',
      'hours': 'horas',
      'hour': 'hora',
      'minutes': 'minutos',
      'minute': 'minuto'
    }
  }
];
try {
  var LANG = 'pt-BR';
  var imgs = document.getElementsByTagName('img');
  for (var i = 0; i < imgs.length; i++) {
    var img = imgs[i];
    var src = img.getAttribute('src');
    if (imgDict[src]) {
      img.src = imgDict[src];
    }
  }
  var REGEX = /\s+/g;
  //REGEX.multiline = true;
  function traverse(node) {
    if (node.nodeName === '#text') {
      node.textContent = translate(node.textContent);
    } else if (node.title) {
      node.title = translate(node.title);
    }
    var cur = node.firstChild;
    while (cur) {
      traverse(cur);
      cur = cur.nextSibling;
    }
  }
  function translate(text) {
    text = text.replace(REGEX, ' ');
    var startSpace = text.charAt(0) == ' ';
    var endSpace = text.charAt(text.length - 1) == ' ';
    var textContent = text.trim();
    if (textContent == '') {
      return text;
    }
    if (dict[LANG] && dict[LANG][textContent]) {
      var out = '';
      if (startSpace) {
        out += ' ';
      }
      if (orderTest) {
        out += '__';
      }
      out += dict[LANG][textContent];
      if (endSpace) {
        out += ' ';
      }
      return out;
    }
    var out = false;
    for (var i = 0; i < regDict.length; i++) {
      var entry = regDict[i];
      var match = entry.regex.exec(textContent);
      if (match != null) {
        console.log(match);
        out = '';
        if (startSpace) {
          out += ' ';
        }
        if (orderTest) {
          out += '__';
        }
        out += textContent;
        if (endSpace) {
          out += ' ';
        }
        for (var j = 1; j < match.length; j++) {
          var m = match[j];
          if (entry.replace[m]) {
            out = out.replace(m, entry.replace[m]);
          }
        }
        break;
      }
    }
    if (out !== false) {
      return out;
    }
    //console.log(textContent);

    return text;
  }
  traverse(document);
  var optGroups = document.getElementsByTagName('optgroup');
  for (var i = 0; i < optGroups.length; i++) {
    var optGroup = optGroups[i];
    optGroup.label = translate(optGroup.label);
    var cur = optGroup.firstChild;
    while (cur) {
      var next = cur.nextSibling;
      if (cur.nodeName != 'OPTION') {
        optGroup.removeChild(cur);
      }
      cur = next;
    }
    var reorder = false;
    do {
      reorder = false;
      var cur = optGroup.firstChild;
      while (cur) {
        var next = cur.nextSibling;
        if (!next) {
          break;
        }
        if (cur.textContent.localeCompare(next.textContent) > 0) {
          optGroup.insertBefore(next, cur);
          reorder = true;
        }
        cur = next;
      }
    } while (reorder);
  }
  var optGroups = document.getElementsByTagName('select');
  for (var i = 0; i < optGroups.length; i++) {
    var optGroup = optGroups[i];
    var cur = optGroup.firstChild;
    while (cur) {
      var next = cur.nextSibling;
      if (cur.nodeName != 'OPTION' && cur.nodeName != 'OPTGROUP') {
        optGroup.removeChild(cur);
      }
      cur = next;
    }
    var reorder = false;
    do {
      reorder = false;
      var cur = optGroup.firstChild;
      while (cur) {
        var next = cur.nextSibling;
        if (!next) {
          break;
        }
        if (next.nodeName == 'OPTGROUP' || cur.nodeName == 'OPTGROUP') {
          cur = next;
          continue;
        }
        if (cur.textContent.localeCompare(next.textContent) > 0) {
          optGroup.insertBefore(next, cur);
          reorder = true;
        }
        cur = next;
      }
    } while (reorder);
  }
  var _buttons = document.getElementsByTagName('input');
  var buttons = [
  ];
  for (var i = 0; i < _buttons.length; i++) {
    buttons.push(_buttons[i]);
  }
  for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
    if (button.type == 'button') {
      button.value = translate(button.value);
    } else if (button.type == 'submit') {
      var buttonNode = document.createElement('input');
      buttonNode.value = translate(button.value);
      // button.parentNode.insertBefore(buttonNode,button);      
      buttonNode.className = button.className;
    }
  }
} catch (ex) {
  console.log(ex);
}
