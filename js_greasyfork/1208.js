// ==UserScript==
// @name           Quack Toolsammlung
// @namespace      Quack
// @description    Extends Grepolis and includes many useful tools into the game
// @include        http://*.grepolis.*/game*
// @include        https://*.grepolis.*/game*
// @icon           http://s1.directupload.net/images/140711/eshmcqzu.png
// @version        2.59.00
// @resource       HTML2Canvas https://raw.githubusercontent.com/Quackmaster/html2canvas/v0.4/build/html2canvas.js
// @resource       QT_styles https://github.com/Quackmaster/Grepolis-QT/raw/master/QT_styles.css
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_info
// @grant          GM_xmlhttpRequest
// @grant          GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/1208/Quack%20Toolsammlung.user.js
// @updateURL https://update.greasyfork.org/scripts/1208/Quack%20Toolsammlung.meta.js
// ==/UserScript==

/************************************************************************
 * Main Script
 ***********************************************************************/
function main_script(DATA) {
	/************************************************************************
	 * Global variables
	 ***********************************************************************/
	var QT = {};
	var wID = Game.world_id;
	var mID = Game.market_id;
	var aID = Game.alliance_id;
	var sID = Game.player_id;
	var pName = Game.player_name;

	/************************************************************************
	 * Languages
	 ***********************************************************************/
	QT.Lang = {
		get : function (a, b) {
			if (QT.Lang[mID] != undefined && QT.Lang[mID][a] != undefined && QT.Lang[mID][a][b] != undefined) {
				return QT.Lang[mID][a][b]
			} else {
				return QT.Lang.en[a][b]
			}
		},
		br : {
			meta : {
				flag : 'http://s7.directupload.net/images/140507/u6xmafci.png'
			},
			reports : {
				choose_folder : 'Escolher pasta',
				enacted : 'lançou',
				conquered : 'conquistado',
				spying : 'espiando',
				spy : 'Espião',
				support : 'Apoia',
				supporting : 'Tropas Alocadas',
				attacking : 'Atacando',
				farming_village : 'Aldeia Bárbara'
			},
			forum : {
				delete : 'Excluir',
				delete_sure : 'Você realmente quer apagar essas mensagens?',
				no_selection : 'Nenhuma mensagem selecionada'
			},
			town_info : {
				no_overload : 'Sem sobrecarga',
				delete : 'Excluir',
				polissuche : 'Pesquisar cidade',
				inactivity : 'Inatividade',
				days : 'dias',
				no_data : 'O jogador ainda não está listado no banco de dados'
			},
			grepo_mainmenu : {
				city_view : 'Vista da cidade',
				island_view : 'Vista Ilha'
			},
			messages : {
				ghosttown : 'Cidade-fantasma',
				no_cities : 'Nenhuma cidade nesta ilha',
				all : 'Tudo',
				export : 'Converter mensagem em BB-Code'
			},
			hotkeys : {
				hotkeys : 'Teclas de atalho',
				city_select : 'Seleção Cidade',
				last_city : 'Última cidade',
				next_city : 'Próxima cidade',
				jump_city : 'Ir para a cidade atual',
				administrator : 'Administrador',
				captain : 'Capitão',
				trade_ov : 'Troca',
				command_ov : 'Comandos',
				recruitment_ov : 'Recrutamento',
				troop_ov : 'Visão geral das tropasa',
				troops_outside : 'Tropas no exterior',
				building_ov : 'Edifícios',
				culture_ov : 'Cultura',
				gods_ov : 'Deuses',
				cave_ov : 'Grutas',
				city_groups_ov : 'Grupos de cidades',
				city_list : 'Lista de cidades',
				attack_planner : 'Planejador de ataques',
				farming_villages : 'Aldeias bárbaras',
				menu : 'Menu',
				city_view : 'Vista da cidade',
				messages : 'Mensagens',
				reports : 'Relatórios',
				alliance : 'Aliança',
				alliance_forum : 'Fórum da aliança',
				settings : 'Configurações',
				profile : 'Perfil',
				ranking : 'Posição',
				notes : 'Notas',
				chat : 'Chat',
				council : 'Conselho de Heróis'
			},
			qtoolbox : {
				onlinecounter_now : 'Tempo',
				onlinecounter_total : 'Total',
				onlinecounter_switch : 'Atual Online',
				stats : 'Estatísticas',
				grepostats : 'Grepo Stats',
				player : 'Jogador',
				alliance : 'Aliança',
				rankings : 'Classificação',
				grepo_bash : 'Grepo Bash',
				track_player : 'Rastrear um Jogador',
				track_alliance : 'Acompanhe uma Aliança',
				top_killers : 'Top Atacantes',
				maps : 'Mapas',
				grepo_maps : 'Grepo Maps',
				grepo_intel : 'Grepo Intel',
				townsearches : 'Pesquisar Cidades',
				grepo_finder : 'Grepo Finder',
				tonda_polissuche : 'Procurar Cidade',
				bb_codes : 'BB-Codes',
				in_town : 'Na cidade',
				from_town : 'Da cidade',
				outside_town : 'Fora da cidade',
				tools : 'Ferramentas',
				unit_comparison : 'Comparação de unidades',
				google_docs : 'Google Docs',
				deff_helper : 'Deff Helper',
				display_modes : 'Exibir',
				full_screen : 'Tela cheia',
				minimal : 'Mínimo',
				standard : 'Padrão',
				stats_scripts : 'Scripts',
				settings : 'Opções'
			},
			academy : {
				researched : 'Colorir pesquisado',
				notresearched : 'Colorir não pesquisado',
				undo : 'Desfazer coloração'
			},
			caves : {
				stored_silver : 'Moedas de prata armazenadss',
				silver_to_store : 'Moedas de prata armazenáveis',
				name : 'Nome',
				wood : 'Madeira',
				stone : 'Pedra',
				silver : 'Moedas de prata'
			},
			transport_calc : {
				btn_main : 'Calc. Transporte',
				available : 'Capacidade de transporte disponível',
				transportable : 'Unidades transportáveis',
				recruits : 'Contagem das unidades na fila de recrutamento',
				outsidetown : 'Contagem das unidades fora da cidade',
				slowtrans : 'Contagem de navios de transporte lento',
				fasttrans : 'Contagem de navios de transporte rápido',
				disabled : 'Temporariamente desabilitado'
			},
			culture : {
				cityfestivals : 'Festival Urbano',
				olympicgames : 'Jogos Olímpicos',
				triumph : 'Desfile da Vitória',
				theater : 'Peças de Teatro'
			},
			settings : {
				text2 : 'Contar tempo no jogo',
				text3 : 'Abrir links do menu no jogo',
				text4 : 'Ativar a inclusão de outros scripts Greasemonkey para o menu',
				text5 : 'Mostrar botões para mostrar permanente a fila de unidade, movimentos e o comércio',
				text6 : 'Barra de botões',
				text9 : 'Exibição no início',
				text11 : 'Desativar economia de tempo online total',
				text12 : 'Calculadora de Transporte',
				text13 : 'Tela do Menu',
				text14 : 'Funções do menu',
				text15 : 'Relatórios',
				text16 : 'Adicionar cor',
				text17 : 'Adicionar filtro',
				text18 : 'Ativar exibição',
				text19 : 'Apagar todas as configurações e traços do script no cache do navegador?',
				text20 : 'Fórum',
				text21 : 'Maximizar a largura do fórum',
				text22 : 'Imagem tecla de atalho',
				text23 : 'Menu Grepolis',
				text24 : 'Senado',
				text25 : 'Mostrar o número de pontos atribuídos para a construção do próximo nível de um edifício',
				text26 : 'Janela de troca',
				text27 : 'Ativar extensão',
				text28 : 'Lista de Cidades',
				text29 : 'Lista de Missões',
				text30 : 'Adicionar uma lista suspensa com suas pastas',
				text31 : 'Botão para o BB-code da cidade atual',
				text32 : 'Selecione e exclua mensagens',
				text34 : 'Visão geral das Grutas (Administrador)',
				text35 : 'Planejador de Academia',
				text36 : 'Gruta',
				text37 : 'Permitir o filtro de cidades',
				text38 : 'Digite prata acima 15000 automaticamente no campo',
				text40 : 'Visão geral aldeias bárbaras (Capitão)',
				text41 : 'Adicionar um botão para abrir a vista da cidade ao menu lateral',
				text42 : 'Mostrar perdas de recursos',
				text43 : 'Simulador',
				text44 : 'Visão geral da Ilha',
				text45 : 'Aumentar a altura da lista de cidades e a lista das aldeias bárbaras',
				text46 : 'Tecla de atalho',
				text47 : 'Usar [Enter] para ir para a cidade atual ao invés da barra de espaço',
				text48 : 'Abrir vista antiga de cidade',
				text49 : 'Ordenar relatórios alfabeticamente',
				text50 : 'Exibição da busca',
				text51 : 'Esconder cidades após farmar automaticamente',
				text52 : 'Vista da cidade',
				text53 : 'Mostrar vista para a cidade em uma janela',
				other : 'Outro',
				save : 'Salvar',
				reset : 'Redefinir as configurações',
				contact : 'Contato',
				info : 'Informações',
				settings : 'Configurações',
				translations : 'Traduções',
				trans_sure : 'Você tem certeza que sua tradução está pronta para ser enviada?',
				trans_success : 'A tradução foi enviada com sucesso',
				trans_fail : 'A tradução não pode ser enviada',
				trans_infotext1 : 'A tradução não precisa ser completa - apenas traduzir o que você precisa',
				trans_infotext2 : 'Quando um texto contém tags HTML (assim como tudo que é cercado por <> parênteses) Mantenha da mesma forma',
				trans_infotext3 : 'A fim de ser capaz de adicioná-lo aos créditos seu nome de jogador, jogador id eo id mundo será transmitido também',
				trans_infotext4 : 'Spammers irão ser adicionados à lista de banidos interna e excluídos da utilização do script',
				please_note : 'Por favor, note',
				credits : 'Créditos',
				no_translation : 'Tradução não encontrada',
				choose_lang : 'Escolha o idioma',
				add_lang : 'Adicionar um novo idioma',
				language : 'Idioma',
				enter_lang_name : 'Por favor insira um nome para o idioma',
				send : 'Enviar',
				name : 'Nome',
				ingame_name : 'Não hesite em me contatar se você prefere ser chamado pelo seu nick de jogo',
				adfly : 'Você quer ganhar dinheiro com links?',
				donations : 'Doações',
				update_check : 'Checar por atualizações',
				prologue : 'Devido à falta de alternativas de uma Devido Falta de Alternativas deuserscripts para Grepolis 2.0 este conjunto de ferramentas foi iniciada dois anos atrás constantemente tenta estender Grepolis com novas funções desde então.<p />Inicialmente, o objectivo era o de reparar as funções de userscripts antigos para Grepolis 1.0 e para aprender as noções básicas de JavaScript no processo, mas por agora muito mais foi realizado. O conjunto de ferramentas é constantemente prorrogado por ideias próprias ou ideias da comunidade e por causa de seu grande apoio a minha motivação para continuar ainda está lá.<p />Você apresenta constantemente me desafios interessantes e é divertido para encontrar soluções para isso. Como se trata de muito trabalho e pode ser muito Eu sou sempre muito grato por qualquer tipo de apoio demorado. Portanto, eu gostaria de agradecer a todos que ofereceram apoio para este projecto - seja através de doações ou clicar em um AdFly-Link, o conhecimento, a criatividade, relatórios de bugs ou apenas algumas palavras de incentivo.'
			},
			bbcode : {
				troops : 'Tropas',
				building : 'Níveis de construção',
				cities : 'Cidades',
				all : 'Tudo',
				active_grp : 'Grupo de cidade ativo',
				in : 'dentro',
				from : 'de',
				outside : 'fora',
				messages : 'Mensagens'
			},
			stats_scripts : {
				stats_scripts_ov : 'Visão geral das estatísticas e scripts'
			},
			googledocs : {
				change_url : 'Alterar URL',
				reset : 'Resetar'
			},
			farmhelper : {
				autohide_cities : 'Ocultar automaticamente aldeias bárbaras após farmar ON / OFF'
			},
			export_window : {
				wnd_title : 'Upload de Imagem - visualização',
				button_mouseover : 'Exportar para imagem',
				upload : 'Fazer upload',
				settings : 'Configurações',
				preview : 'Visualização',
				chrome : 'Chrome abre a janela com a imagem por padrão como um pop-up. Se preferir que a janela se abre como uma nova guia, você tem que instalar um addon extra. Clique aqui para chegar ao addon.',
				info : 'O provedor de hospedagem, infelizmente, permite que apenas 1.250 uploads diariamente. Eles vão proibir este serviço para o resto do mês, se eu exceder esse valor 5 vezes. No longo prazo, eu pretendo alugar um servidor próprio para isso, mas os custos e o desenvolvimento precisam de algum tempo e, acima de tudo dinheiro. Eu invisto meu tempo livre para isso com prazer, mas como um estudante Eu simplesmente não pode pagar todos os custos envolvidos. Como uma possibilidade de refinanciamento, por isso, usar os sponsorlinks de Adf.ly (apenas para a primeira imagem publicada). Com um clique neste botão informação que você será redirecionado para a página oficial de doação Paypal deste script. Obrigado a todos que já apoiam este projecto e para aqueles que pretendem fazê-lo.',
				connection_fail_text : 'A conexão com o servidor falhou. O servidor está inacessível ou o maxmimum capacidade de hospedagem é alcançado para hoje (1250 imagens por dia / 50 imagens por usuário).',
				town : 'Cidade',
				luck : 'Sorte',
				title : 'T Título',
				resources : 'Recursos',
				wall : 'Muralha',
				player : 'Jogador',
				reporttype : 'Tipo de Relatório',
				resources_lost : 'Recursos Perdidos',
				nightbonus : 'Bônus Noturno',
				alliance : 'Aliança',
				troops : 'Tropas',
				bashpoints : 'Pontos de Combate',
				buildings : 'Construções',
				payed_iron : 'Prata usada',
				payed_iron_storage : 'Prata guardada',
				date : 'Data',
				spell_info : 'Informação do Feitiço',
				spell_effect : 'Efeito do Feitiço',
				message : 'Mensagem',
				attacker : 'Atacante',
				defender : 'Defensor',
				bonuses : 'Feitiços/Bônus',
				command_type : 'Tipo de Comando',
				town_left : 'Cidade (esquerda)',
				town_right : 'Cidade (direita)',
				player_left : 'Jogador (esquerda)',
				player_right : 'Jogador (direita)',
				travel_time : 'Tempo de viagem',
				time_of_arrival : 'Hora da chegada',
				command : 'Comandos',
				defeated_atk : 'Derrotado como atacante',
				defeated_def : 'Derrotado como defensor',
				losses_atk : 'Perdas como atacante',
				losses_def : 'Perdas como defensor',
				brush_size : 'Tamanho do pincel',
				color : 'Cor',
				eraser : 'Apagar',
				pencil : 'Lápis',
				arrow : 'Seta',
				rectangel : 'Retângulo',
				line : 'Linha',
				arc : 'Arco',
				delete_drawing : 'Excluir desenho',
				fill : 'Preencher'
			},
			colors : {
				black : 'preto',
				blue : 'azul',
				red : 'vermelho',
				green : 'verde',
				yellow : 'amarelo',
				gray : 'cinza'
			},
			command_ov : {
				commands : 'Comandos'
			}
		},
		cz : {
			meta : {
				flag : 'http://s1.directupload.net/images/140507/ctjo8fgu.png'
			},
			reports : {
				choose_folder : 'Vyberte složku',
				spy : 'Špeh',
				support : 'podpora',
				supporting : 'podporující',
				attacking : 'útočící',
				farming_village : 'zemědělská vesnice'
			},
			forum : {
				delete : 'Smazat',
				delete_sure : 'Opravdu chcete smazat tyto příspěvky?',
				no_selection : 'Nebyly vybrány žádné příspěvky'
			},
			town_info : {
				no_overload : 'Bez přeložení',
				delete : 'Smazat',
				inactivity : 'Neaktivita',
				no_data : 'Hráč ještě není zaznamenán v databázi'
			},
			grepo_mainmenu : {
				city_view : 'Přehled města',
				island_view : 'Ostrovní pohled'
			},
			messages : {
				ghosttown : 'Město duchů',
				no_cities : 'Na tomto ostrově nejsou žádná města',
				all : 'vše',
				export : 'Zkonvertuj zprávu do BB-kódu'
			},
			hotkeys : {
				hotkeys : 'Horké klávesy',
				city_select : 'Výběr města',
				last_city : 'Předchozí město',
				next_city : 'Následující město',
				jump_city : 'Přejít na aktuální město',
				administrator : 'Správce',
				captain : 'Kapitán',
				trade_ov : 'Obchod',
				command_ov : 'Rozkazy',
				recruitment_ov : 'Rekrutování',
				troop_ov : 'Přehled vojsk',
				troops_outside : 'Vojsko mimo',
				building_ov : 'Budovy',
				culture_ov : 'Kultura',
				gods_ov : 'Bohové',
				cave_ov : 'Jeskyně',
				city_groups_ov : 'Skupiny měst',
				city_list : 'Seznam měst',
				attack_planner : 'Plánovač útoků',
				farming_villages : 'Zemědělské vesnice',
				city_view : 'Přehled města',
				messages : 'Zprávy',
				reports : 'Hlášení',
				alliance : 'Aliance',
				alliance_forum : 'Fórum aliance',
				settings : 'Nastavení',
				profile : 'Profil',
				ranking : 'Žebříček',
				notes : 'Poznámky',
				council : 'Shromáždění hrdinů'
			},
			qtoolbox : {
				onlinecounter_now : 'Aktuálně',
				onlinecounter_total : 'Celkově',
				onlinecounter_switch : 'Online aktuálně/celkově',
				stats : 'Statistiky',
				player : 'Hráč',
				alliance : 'Aliance',
				rankings : 'Žebříček',
				track_player : 'Vystopuj hráče',
				track_alliance : 'Vystopuj alianci',
				top_killers : 'Nejlepší bojovníci',
				maps : 'Mapy',
				townsearches : 'Vyhledávače měst',
				bb_codes : 'BB-kódy',
				in_town : 'Ve městě',
				from_town : 'Z města',
				outside_town : 'Mimo město',
				tools : 'Nástroje',
				unit_comparison : 'Porovnání jednotek',
				display_modes : 'Módy zobrazení',
				stats_scripts : 'Stats/Skripty',
				settings : 'Manažer skriptu'
			},
			academy : {
				researched : 'Zabarvit vyzkoumané',
				notresearched : 'Zabarvit nevyzkoumané',
				undo : 'Vrať zabarvení'
			},
			caves : {
				stored_silver : 'Uložené stříbrné mince',
				name : 'Jméno',
				wood : 'Dřevo',
				stone : 'Kámen',
				silver : 'Stříbrné mince'
			},
			transport_calc : {
				available : 'Dostupná přepravní kapacita',
				transportable : 'Přepravitelné jednotky',
				recruits : 'Započítej jednotky ve výstavbě',
				outsidetown : 'Započítej jednotky mimo město',
				slowtrans : 'Započítej pomalé transportní lodě',
				fasttrans : 'Započítej rychlé transportní lodě'
			},
			culture : {
				cityfestivals : 'Městské slavnosti',
				olympicgames : 'Olympijské hry',
				triumph : 'Slavnostní pochody',
				theater : 'Divadelní hry'
			},
			settings : {
				text3 : 'Otevírat odkazy z menu přímo ve hře',
				text4 : 'Zahrnout ostatní greasemonkey skripty do menu',
				text5 : 'Ukázat tlačítka pro stálé zobrazení fronty výstavby, pohybů a obchodu',
				text6 : 'Lišta tlačítek',
				text9 : 'Zobrazovat při startu',
				text11 : 'Deaktivovat ukládání celkového času online',
				text13 : 'Displej menu',
				text14 : 'Vlastnosti menu',
				text15 : 'Hlášení',
				text16 : 'Přidat barvu',
				text17 : 'Přidat filtr',
				text18 : 'Aktivovat displej',
				text19 : 'Vymazat všechny stopy a nastavení skriptu ve vyrovnávací paměti prohlížeče?',
				text20 : 'Fórum',
				text21 : 'Maximalizovat šířku fóra',
				text22 : 'Obrázek horkých kláves',
				text24 : 'Senát',
				text25 : 'Ukázovat počet bodů za vybudování další úrovně budovy',
				text26 : 'Okno obchodu',
				text27 : 'Aktivuj rozšíření',
				text28 : 'Town list',
				text30 : 'Přidat vyjížděcí seznam s Vašimi složkami',
				text31 : 'Tlačítko pro BB-kód aktuálního města',
				text32 : 'Vybrat a vymazat příspěvky',
				text34 : 'Přehled jeskyní (Správce)',
				text35 : 'Plánovač výzkumů',
				text36 : 'Jeskyně',
				text37 : 'Povolit řazení měst',
				text38 : 'Automaticky vkládat do vstupního pole stříbrné mince nad 15 000',
				text40 : 'Přehled zemědělských vesnic (Kapitán)',
				text41 : 'Přidat tlačítko pro otevírání přehledu města do postranní lišty Grepolisu',
				text42 : 'Ukazovat ztráty surovin',
				text43 : 'Simulátor',
				text44 : 'Ostrovní pohled',
				text45 : 'Rozšířit výšku seznamu měst a seznamu zemědělských vesnic',
				text46 : 'Horké klávesy',
				text47 : 'Ke skoku na aktuální město použij [Enter] (ne [Space])',
				text48 : 'Otevřít starý pohled na město',
				text49 : 'Seřadit složky hlášení abecedně',
				text52 : 'Přehled města',
				other : 'Ostatní',
				save : 'Uložit',
				reset : 'Resetovat nastavení',
				contact : 'Kontakt',
				settings : 'Nastavení',
				translations : 'Překlady',
				trans_sure : 'Jste si jisti, že Váš překlad je připraven k odeslání?',
				trans_success : 'Překlad byl úspěšně odeslán',
				trans_fail : 'Překlad nemohl být odeslán',
				trans_infotext1 : 'Překlad nemusí být kompletní - přeložte jen to, co chcete',
				trans_infotext2 : 'Pokud text obsahuje HTML tagy (tedy vše obklopené <> závorkami), nechte je, prosím, tam, kde jste je našli',
				trans_infotext3 : 'Abychom Vás mohli přidat do příspěvků, Vaše hráčské jméno, ID a ID Vašeho světa bude také odesláno spolu s tímto příspěvkem',
				trans_infotext4 : 'Spammeři budou přidáni do interního banlistu a nebudou již moci používat tento skript',
				please_note : 'Všimněte si, prosím',
				credits : 'Příspěvky',
				no_translation : 'Nebyl nalezen žádný překlad',
				choose_lang : 'Zvolte jazyk',
				add_lang : 'Přidat nový jazyk',
				language : 'Jazyk',
				enter_lang_name : 'Vložte, prosím, Váš jazyk',
				send : 'Odeslat',
				name : 'Jméno',
				ingame_name : 'Pokud chcete být nazýván Vaším hráčským jménem, neváhejte mě kontaktovat',
				adfly : 'Chcete také vydělávat pomocí odkazů?',
				donations : 'Dary',
				update_check : 'Zkontrolovat aktualizace',
				prologue : 'Vývoj této sady nástrojů byl zahájen před dvěma lety, a to kvůli nedostatku alternativ k uživatelským skriptům pro Grepolis 2.0. Od té doby se snaží stále rozšiřovat Grepolis novými funkcemi.<p />Původním cílem bylo opravit staré skripty pro Grepolis 1.0 a naučit se základy JavaScriptu, ale do nynějška jsme toho již dokázali mnohem víc. Sada je neustále rozšiřována nejen s mými vlatními nápady, ale také s nápady celé komunity a jen díky Vaší podpoře je stále tady. Neustále mi předkládáte nové výzvy a je velmi zábavné hledat jejich řešení.<p />Protože je tato práce náročná, a to i časově, jsem vždy vděčný za jakoukoliv Vaši podporu. Proto chci poděkovat každému, kdo tomuto projektu jakkoliv pomohl - buďto skrze dary nebo klikáním na AdFly-linky, znalostí, kreativitou, hlášením chyb nebo pouze povzbudivými slovy.'
			},
			bbcode : {
				troops : 'Jednotky',
				building : 'Úrovně budov',
				cities : 'Města',
				all : 'Vše',
				active_grp : 'Aktivní skupina měst',
				in : 'v',
				from : 'z',
				outside : 'mimo',
				messages : 'Zprávy'
			},
			stats_scripts : {
				stats_scripts_ov : 'Přehled statistik a skriptů'
			},
			googledocs : {
				change_url : 'Změnit URL'
			}
		},
		de : {
			meta : {
				flag : 'http://s14.directupload.net/images/140408/xpd69nmj.png',
				changelog : 'http://adf.ly/1F7EBy',
				forumlink : 'http://adf.ly/cbQaZ',
				forumlink_addfree : 'http://forum.de.grepolis.com/showthread.php?20742',
				donation_btn : '<a href="http://paypal.me/quacktoolsammlung" target="_blank"><img src="https://www.paypal.com/de_DE/i/btn/btn_donate_LG.gif" alt="Spenden"></a>',
				unitscalculator : 'http://de.grepolisqt.de/grepolis-truppenrechner/'
			},
			reports : {
				choose_folder : 'Ordner wählen',
				enacted : 'gewirkt',
				conquered : 'erobert',
				spying : 'spioniert',
				spy : 'Spion',
				support : 'stationierte',
				supporting : 'unterstützt',
				attacking : 'greift',
				farming_village : 'Bauerndorf'
			},
			forum : {
				delete : 'Löschen',
				delete_sure : 'Ausgewählte Beiträge wirklich löschen?',
				no_selection : 'Es sind keine Beiträge markiert'
			},
			town_info : {
				no_overload : 'Kein überladen',
				delete : 'Löschen',
				polissuche : 'Polissuche',
				inactivity : 'Inaktivität',
				days : 'Tage',
				no_data : 'Der Spieler befindet sich nicht in der Datenbank'
			},
			grepo_mainmenu : {
				city_view : 'Stadtansicht',
				island_view : 'Inselansicht'
			},
			messages : {
				ghosttown : 'Geisterstadt',
				no_cities : 'Keine Städte auf dieser Insel',
				all : 'Alle',
				export : 'Nachricht als BB-Code für das Forum'
			},
			hotkeys : {
				hotkeys : 'Hotkeys',
				city_select : 'Stadtauswahl',
				last_city : 'Letzte Stadt',
				next_city : 'Nächste Stadt',
				jump_city : 'Sprung zur aktuellen Stadt',
				administrator : 'Verwalter',
				captain : 'Kapitän',
				trade_ov : 'Handelsübersicht',
				command_ov : 'Befehlsübersicht',
				recruitment_ov : 'Rekrutierungsübersicht',
				troop_ov : 'Truppenübersicht',
				troops_outside : 'Truppen außerhalb',
				building_ov : 'Gebäudeübersicht',
				culture_ov : 'Kulturübersicht',
				gods_ov : 'Götterübersicht',
				cave_ov : 'Höhlenübersicht',
				city_groups_ov : 'Stadtgruppenübersicht',
				city_list : 'Städteliste',
				attack_planner : 'Angriffsplaner',
				farming_villages : 'Bauerndörfer',
				menu : 'Menü',
				city_view : 'Stadtansicht',
				messages : 'Nachrichten',
				reports : 'Berichte',
				alliance : 'Allianz',
				alliance_forum : 'Allianz-Forum',
				settings : 'Einstellungen',
				profile : 'Profil',
				ranking : 'Rangliste',
				notes : 'Notizen',
				chat : 'Chat',
				council : 'Konzil der Helden'
			},
			qtoolbox : {
				onlinecounter_now : 'Aktuell',
				onlinecounter_total : 'Total',
				onlinecounter_switch : 'Online aktuell/total',
				stats : 'Statistiken',
				grepostats : 'Grepo Stats',
				player : 'Spieler',
				alliance : 'Allianz',
				rankings : 'Ranglisten',
				grepo_bash : 'Grepo Bash',
				track_player : 'Spieler verfolgen',
				track_alliance : 'Allianz verfolgen',
				top_killers : 'Top Killers',
				maps : 'Karten',
				grepo_maps : 'Grepo Maps',
				grepo_intel : 'Grepo Intel',
				townsearches : 'Stadtsuchen',
				grepo_finder : 'Grepo Finder',
				tonda_polissuche : 'Polissuche',
				bb_codes : 'BB-Codes',
				in_town : 'In Stadt',
				from_town : 'Aus Stadt',
				outside_town : 'Außerhalb Stadt',
				tools : 'Tools',
				unit_comparison : 'Truppen Rechner',
				google_docs : 'Google Docs',
				deff_helper : 'Deff Assistent',
				display_modes : 'Anzeige',
				full_screen : 'Vollbild',
				minimal : 'Minimal',
				standard : 'Standard',
				stats_scripts : 'Stats/Skripte',
				settings : 'Skript Manager'
			},
			academy : {
				researched : 'Erforschte markieren',
				notresearched : 'Nicht erforschte markieren',
				undo : 'Markierungen aufheben'
			},
			caves : {
				stored_silver : 'Eingelagerte Silbermünzen',
				silver_to_store: 'Lagerbare Silbermünzen',
				name : 'Name',
				wood : 'Holz',
				stone : 'Stein',
				silver : 'Silbermünzen',
				search_for : 'Suchen nach'
			},
			transport_calc : {
				btn_main : 'Transportrechner',
				available : 'Verfügbare Transportkapazität',
				transportable : 'Zu transportierende Einheiten',
				recruits : 'Truppen in der Bauschleife',
				outsidetown : 'Truppen außerhalb der Stadt',
				slowtrans : 'Langsame Transportboote mitzählen',
				fasttrans : 'Schnelle Transportboote mitzählen',
				disabled : 'Temporär deaktiviert'
			},
			culture : {
				cityfestivals : 'Stadtfeste',
				olympicgames : 'Olympische Spiele',
				triumph : 'Triumphzüge',
				theater : 'Theaterspiele'
			},
			settings : {
				text2 : 'Onlinezähler',
				text3 : 'Links aus dem Menü direkt im Spiel öffnen',
				text4 : 'Hinzufügen von anderen Greasemonkey-Skripten zum Menü aktivieren',
				text5 : 'Buttons für die permanente Anzeige der Rekrutions-/ Bewegungs-/ und Handelsübersicht',
				text6 : 'Buttonleiste',
				text9 : 'Bei Start anzeigen',
				text10 : 'Buttons Stadtverwaltung, Stadt vor/zurück',
				text11 : 'Speicherung der totalen Onlinezeit deaktiviert',
				text12 : 'Transport-Rechner',
				text13 : 'Menü Darstellung',
				text14 : 'Menü Funktionen',
				text15 : 'Berichte',
				text16 : 'einfärben',
				text17 : 'Filtermöglichkeiten aktivieren',
				text18 : 'Anzeige aktivieren',
				text19 : 'Sämtliche Einstellungen und Spuren des Skriptes im Browsercache löschen?',
				text20 : 'Forum',
				text21 : 'Breite des Forums maximieren',
				text22 : 'Hotkey Bild',
				text23 : 'Grepolis Menü',
				text24 : 'Senat',
				text25 : 'Punkte für Gebäude anzeigen',
				text26 : 'Handelsfenster',
				text27 : 'Erweiterung aktivieren',
				text28 : 'Stadtliste',
				text29 : 'Questliste',
				text30 : 'Ordner zusätzlich in einer Auswahlliste anzeigen',
				text31 : 'Button für den BB-Code der aktuellen Stadt',
				text32 : 'Beiträge auswählen und löschen',
				text34 : 'Höhlen Übersicht (Verwalter)',
				text35 : 'Akademie Planer',
				text36 : 'Höhle',
				text37 : 'Sortierung der Städte ermöglichen',
				text38 : 'Silber über 15000 automatisch in das Eingabefeld eintragen',
				text40 : 'Bauerndörfer Übersicht (Kapitän)',
				text41 : 'Einen Button für die Stadtansicht dem Seitenmenü von Grepolis hinzufügen',
				text42 : 'Rohstoffverlustanzeige hinzufügen',
				text43 : 'Simulator',
				text44 : 'Inselübersicht',
				text45 : 'Listen der Städte und Bauerndörfer vergrößern',
				text46 : 'Hotkeys',
				text47 : '[Enter] als Button um zur aktuellen Stadt zu springen (nicht [Space])',
				text48 : 'Alte Stadtansicht öffnen',
				text49 : 'Berichteordner alphabetisch sortieren',
				text50 : 'Questpfeil anzeigen',
				text51 : 'Städte nach dem Farmen automatisch verstecken',
				text52 : 'Stadtansicht',
				text53 : 'Stadtansicht in einem Fenster anzeigen',
				text54 : 'Einheiten Tooltips ausschalten',
				text55 : 'Allgemeine Einstellungen',
				other : 'Sonstiges',
				save : 'Speichern',
				reset : 'Einstellungen zurücksetzen',
				contact : 'Kontakt',
				info : 'Info',
				settings : 'Einstellungen',
				translations : 'Übersetzungen',
				choose_lang : 'Sprache wählen',
				add_lang : 'Neue Sprache hinzufügen',
				language : 'Sprache',
				send : 'Abschicken',
				enter_lang_name : 'Bitte der Sprache einen Namen geben',
				trans_sure : 'Bist du dir sicher, dass deine Übersetzung bereit zum abschicken ist?',
				trans_success : 'Die Übersetzung wurde erfolgreich versandt',
				trans_fail : 'Die Übersetzung konnte nicht gesendet werden',
				trans_infotext1 : 'Die Übersetzung muss nicht komplett sein - übersetzt einfach das wozu ihr Lust habt',
				trans_infotext2 : 'Sollte ein zu übersetzender Text HTML Tags enthalten (also alles was in <> Klammern steht), bitte ich euch darum diese beizubehalten',
				trans_infotext3 : 'Um euch den Credits hinzufügen zu können, wird beim Absenden euer Spielername, eure SpielerID und die WeltenID übermittelt',
				trans_infotext4 : 'Spammer kommen auf eine interne Filterliste und werden vom Gebrauch der Toolsammlung zukünftig ausgeschlossen',
				please_note : 'Hinweise',
				credits : 'Credits',
				no_translation : 'Keine Übersetzungen gefunden',
				ingame_name : 'Wer lieber via ingame Name genannt werden möchte, kann sich gerne bei mir melden',
				adfly : 'Auch mit Links Geld verdienen?',
				donations : 'Spenden',
				update_check : 'Nach Update suchen',
				prologue : 'Aus Mangel an Skriptalternativen für Grepolis 2.0 wurde diese Toolsammlung vor 2 Jahren gestartet und versucht seitdem Grepolis um diverse Funktionen zu erweitern.<p />Anfänglich war es lediglich das Ziel alte Skripte der 1.0 Version wieder funktionstüchtig zu machen und Einblicke in die Funktionsweise von JavaScript zu erhalten. Mittlerweile hat sich jedoch einiges mehr daraus entwickelt. Die Toolsammlung wird stetig durch eigene Ideen oder Ideen aus der Community erweitert und durch euren Support ist die Motivation bis heute erhalten geblieben. Ihr stellt mich dabei immer wieder vor interessante Problemstellungen und es macht Spaß eine Lösung dafür auszutüfteln.<p />Da dies mitunter viel Aufwand und Zeit beansprucht, freue ich mich immer sehr über jede Form von Unterstützung. Deshalb ein großes Danke an alle die dieses Projekt schon solange unterstützen - sei es durch eine Spende oder einen Klick auf einen AdFly-Link, Wissen, Kreativität, Bugberichte oder aufmunternde Worte.'
			},
			bbcode : {
				troops : 'Truppen',
				building : 'Gebäudestufen',
				cities : 'Städte',
				all : 'Alle',
				active_grp : 'Aktive Stadtgruppe',
				in : 'in',
				from : 'aus',
				outside : 'außerhalb von',
				messages : 'Nachrichten'
			},
			stats_scripts : {
				stats_scripts_ov : 'Übersicht Statistiken und Skripte'
			},
			googledocs : {
				change_url : 'Link ändern',
				reset : 'Reset'
			},
			farmhelper : {
				autohide_cities : 'Städte nach dem Farmen automatisch verstecken an/aus'
			},
			export_window : {
				wnd_title : 'Bilder Upload - Vorschau',
				button_mouseover : 'Als Bild exportieren',
				upload : 'Hochladen',
				settings : 'Einstellungen',
				preview : 'Vorschau',
				chrome : 'Chrome öffnet die Seite zum Screenshot standardmäßig als Popup. Wer die Seite lieber als neuen Tab geöffnet haben will, muss ein Extra Addon dafür installieren. Hier klicken um zum Addon zu gelangen',
				info : 'Der Hostinganbieter erlaubt täglich leider nur 1250 Uploads. Wenn wir diesen Wert monatlich 5x überschreiten, hat dies eine Sperrung des Services für den Rest des Monats zur Folge. Langfristig ist deshalb ein eigener Server geplant, aber diesen zu mieten und die benötigte Infrastruktur aufzubauen kostet viel Zeit und vor allem Geld. Meine Freizeit investiere ich dafür gerne, jedoch bin ich als Student nicht in der Lage die Kosten vollständig dafür übernehmen zu können. Zur Refinanzierung werden deshalb Sponsorlinks von Adf.ly genutzt (nur für das erste Bild pro Tag). Mit Klick auf diesen Info Button erfolgt zudem eine Weiterleitung zu der offiziellen Paypal Seite des Skriptes. Vielen Dank an alle, die dieses Projekt unterstützen oder es demnächst vorhaben!',
				connection_fail_text : 'Verbindung zum Server nicht möglich. Entweder ist der Server nicht erreichbar oder die maximale Hosting Kapazität wurde für heute schon erreicht (1250 Bilder pro Tag / 50 Bilder pro User).',
				town : 'Stadt',
				luck : 'Glück',
				title : 'Titel',
				resources : 'Rohstoffe',
				wall : 'Stadtmauer',
				player : 'Spieler',
				moral : 'Moral',
				reporttype : 'Berichttype',
				resources_lost : 'Rohstoffkosten',
				nightbonus : 'Nachtbonus',
				alliance : 'Allianz',
				troops : 'Truppen',
				bashpoints : 'Kampfpunkte',
				buildings : 'Gebäude',
				payed_iron : 'Eingesetzte Silbermünzen',
				payed_iron_storage : 'Silbermünzen im Lager',
				date : 'Datum',
				spell_info : 'Zauber Info',
				spell_effect : 'Zauber Effekt',
				message : 'Nachricht',
				attacker : 'Angreifer',
				defender : 'Verteidiger',
				bonuses : 'Zauber/Boni',
				command_type : 'Befehlsart',
				town_left : 'Stadt (links)',
				town_right : 'Stadt (rechts)',
				player_left : 'Spieler (links)',
				player_right : 'Spieler (rechts)',
				travel_time : 'Laufzeit',
				time_of_arrival : 'Ankunftszeit',
				command : 'Befehl',
				defeated_atk : 'Besiegt als Angreifer',
				defeated_def : 'Besiegt als Verteidiger',
				losses_atk : 'Verluste als Angreifer',
				losses_def : 'Verluste als Verteidiger',
				brush_size : 'Pinselstärke',
				color : 'Farbe',
				eraser : 'Radiergummi',
				pencil : 'Zeichenstift',
				arrow : 'Pfeil',
				rectangel : 'Rechteck',
				line : 'Linie',
				arc : 'Kreis',
				delete_drawing : 'Zeichnung löschen',
				fill : 'Füllen'
			},
			colors : {
				black : "schwarz",
				blue : "blau",
				red : "rot",
				green : "grün",
				yellow : "gelb",
				gray : "grau"
			},
			command_ov : {
				commands : "Befehle"
			},
			recipeevent : {
				recipebook : "Link zum Rezepte Buch des Events. Teile deine Rezepte mit der Community, damit wir die Liste schnell vervollständigen können.",
				poll : "Helfe den Entwicklern des Spiels die Belohnungen zu verbessern und sag uns, welche dir am besten gefallen.",
				present : "Mach mit bei dem Event Gewinnspiel und verbessere täglich deine Chance auf 1500 Gold!"
			}
		},
		es : {
			meta : {
				flag : 'http://s1.directupload.net/images/140408/6lxubx63.png',
				donation_btn : '<a href="http://paypal.me/quacktoolsammlung" target="_blank"><img src="https://www.paypal.com/es_ES/i/btn/btn_donate_LG.gif" alt="Donar"></a>'
			},
			reports : {
				choose_folder : 'Elegir carpeta',
				enacted : 'promulgado',
				conquered : 'conquistado',
				spying : 'espionaje',
				spy : 'Espíar',
				support : 'Apoyar',
				supporting : 'Apoyos',
				attacking : 'Atacante',
				farming_village : 'Aldea agrícola'
			},
			forum : {
				delete : 'Borrar',
				delete_sure : '¿Realmente desea eliminar estos mensajes?',
				no_selection : 'No hay posts seleccionados'
			},
			town_info : {
				no_overload : 'No cargar',
				delete : 'Borrar',
				polissuche : 'Búsqueda de la ciudad',
				inactivity : 'Inactividad',
				days : 'días',
				no_data : 'El jugador no está listado en la base de datos'
			},
			grepo_mainmenu : {
				city_view : 'Vista de la ciudad',
				island_view : 'Vista de la isla'
			},
			messages : {
				ghosttown : 'Ciudad fantasma',
				no_cities : 'No hay ciudades en esta isla',
				all : 'Todo',
				export : 'Convertir mensaje en códigos BB'
			},
			hotkeys : {
				hotkeys : 'Atajos de teclado',
				city_select : 'Selección de la ciudad',
				last_city : 'Última ciudad',
				next_city : 'Próxima ciudad',
				jump_city : 'Saltar a la ciudad actual',
				administrator : 'Administrador',
				captain : 'Capitán',
				trade_ov : 'Vista general de comercio',
				command_ov : 'Vista general de órdenes',
				recruitment_ov : 'Vista general de reclutamiento',
				troop_ov : 'Vista de tropas',
				troops_outside : 'Tropas fuera',
				building_ov : 'Vista general de edificios',
				culture_ov : 'Vista de cultura',
				gods_ov : 'Vista general de dioses',
				cave_ov : 'Vista general de la cueva',
				city_groups_ov : 'Vista general de grupos de ciudades',
				city_list : 'Lista de ciudades',
				attack_planner : 'Programador de ataque',
				farming_villages : 'Aldeas',
				menu : 'Menú',
				city_view : 'Vista de la ciudad',
				messages : 'Mensajes',
				reports : 'Informes',
				alliance : 'Alianza',
				alliance_forum : 'Foro de la alianza',
				settings : 'Ajustes',
				profile : 'Perfil',
				ranking : 'Clasificación',
				notes : 'Notas',
				chat : 'Chat',
				council : 'Consejo de héroes'
			},
			qtoolbox : {
				onlinecounter_switch : 'Actual on-line/total',
				stats : 'Estadísticas',
				player : 'Jugador',
				alliance : 'Alianza',
				track_player : 'Seguir un jugador',
				track_alliance : 'Seguir una alianza',
				top_killers : 'Top Atacantes',
				maps : 'Mapas',
				grepo_maps : 'Grepo Mapas',
				townsearches : 'Búsqueda de ciudades',
				tonda_polissuche : 'Buscar ciudad',
				from_town : 'Desde la ciudad',
				outside_town : 'Fuera de la ciudad',
				unit_comparison : 'Comparación de unidades',
				display_modes : 'Modos de pantalla',
				full_screen : 'Pantalla completa',
				minimal : 'Minimizar'
			},
			academy : {
				researched : 'Colorear investigado',
				notresearched : 'Colorear no investigado',
				undo : 'Deshacer coloración'
			},
			caves : {
				stored_silver : 'Monedas de plata almacenables',
				silver_to_store : 'Monedas de plata Almacenadas',
				name : 'Nombre',
				wood : 'Madera',
				stone : 'Piedra',
				silver : 'Monedas de plata'
			},
			transport_calc : {
				btn_main : 'Calc. de Transporte',
				available : 'Capacidad de transporte disponible',
				transportable : 'Unidades transportables',
				recruits : 'Contar unidades en cola de reclutamiento',
				outsidetown : 'Contar unidades fuera de la ciudad',
				slowtrans : 'Contar naves de transporte lentas',
				fasttrans : 'Contar naves de transportes rapidas',
				disabled : 'Deshabilitado temporalmente'
			},
			culture : {
				cityfestivals : 'Festival de la ciudad',
				olympicgames : 'Juegos Olímpicos',
				triumph : 'Marcha triunfal',
				theater : 'Obras de teatro'
			},
			settings : {
				text2 : 'Contador on-line',
				text3 : 'Abrir enlaces del menú dentro del juego',
				text4 : 'Active la inclusión de otros scripts de Greasemonkey al menú',
				text5 : 'Mostrar botones para la exhibición permanente de la cola de la unidad, los movimientos y el comercio',
				text6 : 'Barra de botones',
				text9 : 'Mostrar al inicio',
				text11 : 'Desactivar el tiempo on-line',
				text12 : 'Calculadora de Transporte',
				text13 : 'Pantalla del menú',
				text14 : 'Funciones del menú',
				text15 : 'Reportes',
				text16 : 'Agregar color',
				text17 : 'Agregar filtro',
				text18 : 'Activar pantalla',
				text19 : 'Eliminar todos los ajustes y las cookies de la caché del navegador?',
				text20 : 'Foro',
				text21 : 'Maximizar la pantalla del foro',
				text22 : 'Imagen hotkey',
				text23 : 'Menú Grepolis',
				text24 : 'Senado',
				text25 : 'Mostrar el número de puntos otorgados para la construcción de un nivel superior de un edificio',
				text26 : 'Ventana de comercio',
				text27 : 'Activar extensión',
				text28 : 'Lista de ciudades',
				text29 : 'Lista de colectas',
				text30 : 'Agregar una lista desplegable con las carpetas',
				text31 : 'Botón para el código BB de la ciudad actual',
				text32 : 'Seleccionar y borrar mensajes',
				text34 : 'Resumen de Cuevas (Administrador)',
				text35 : 'Planificar la Academia',
				text36 : 'Cueva',
				text37 : 'Permitir la clasificación de las ciudades',
				text38 : 'Introducir 15.000 monedas de plata automáticamente en el campo de entrada',
				text40 : 'Visión general aldeas agrícolas (Capitán)',
				text41 : 'Agregar un botón para abrir la vista de la ciudad al menú lateral de Grepolis',
				text42 : 'Mostrar recursos perdidos',
				text43 : 'Simulador',
				text44 : 'Visión general de Isla',
				text45 : 'Agrandar la altura de la lista de ciudades y la lista de las aldeas agrícolas',
				text46 : 'Atajos de teclado',
				text47 : 'Utilizar [Enter] como el botón para saltar a la ciudad actual (no [Space])',
				text48 : 'Abrir la vista de la ciudad antigua',
				text49 : 'Ordenar por orden alfabético los informes',
				text51 : 'Ocultar automáticamente Ciudades después de la agricultura',
				text52 : 'Vista de la ciudad',
				text53 : 'Mostrar la vista de la ciudad en una ventana',
				other : 'Otros',
				save : 'Salvar',
				reset : 'Restablecer la configuración',
				contact : 'Contacto',
				info : 'Información',
				settings : 'Opciones',
				translations : 'Traducciones',
				trans_sure : '¿Está seguro de que su traducción esta lista para enviar?',
				trans_success : 'La traducción ha sido enviada con éxito',
				trans_fail : 'La traducción no se ha podido enviar',
				trans_infotext1 : 'La traducción no tiene que ser completa - simplemente traduce lo que quieres',
				trans_infotext2 : 'Cuando un texto contiene etiquetas HTML (por lo tanto todo lo que está rodeado de <> entre paréntesis) Les pido que guardes donde las encontraste',
				trans_infotext3 : 'Con el fin de ser capaz de añadir a los créditos el nombre del jugador, id del jugador y el id del mundo se transmitirán así',
				trans_infotext4 : 'Los spammers se añadirán a la lista de ban interna y excluidos de la utilización del script',
				please_note : 'A tener en cuenta',
				credits : 'Créditos',
				no_translation : 'No se encontró traducción',
				choose_lang : 'Elegir idioma',
				add_lang : 'Añadir un nuevo idioma',
				language : 'Idioma',
				enter_lang_name : 'Por favor ingrese el nombre del idioma',
				send : 'Enviar',
				name : 'Nombre',
				ingame_name : 'No dude en ponerse en contacto conmigo si usted prefiere ser llamado por su nombre del juego',
				adfly : '¿Quieres ganar dinero con los enlaces, también?',
				donations : 'Donaciones',
				update_check : 'Buscar actualizaciones',
				prologue : 'Debido a la falta de alternativas de scripts de usuarios para Grepolis 2.0 de este conjunto de herramientas que se inició hace dos años und constantemente trata de extender Grepolis con nuevas funciones desde entonces. Inicialmente el objetivo era reparar las funciones de userscripts edad para Grepolis 1.0 y para aprender los conceptos básicos de JavaScript en el proceso, pero por ahora mucho más se logró. El conjunto de herramientas se amplía constantemente por las ideas propias o ideas de la comunidad y debido a su gran apoyo de mi motivación para continuar todavía está allí. Constantemente me presenta retos interesantes y es divertido para encontrar soluciones para eso. Dado que se trata de mucho trabajo y puede llevar mucho tiempo consumiendo siempre estoy muy agradecido por cualquier tipo de soporte. Por lo tanto me gustaría dar las gracias a todos los que ofreció su apoyo para este proyecto -. Sea a través de donaciones o hacer clic en un AdFly-Link, el conocimiento, la creatividad, los informes de error o sólo algunas palabras alentadoras. Debido a la falta de alternativas de userscripts para Grepolis 2.0 de este conjunto de herramientas se inició hace dos años und constantemente trata de extender Grepolis con nuevas funciones desde entonces.<p />En un principio el objetivo era reparar las funciones de userscripts viejos para Grepolis 1.0 y de aprender los conceptos básicos de JavaScript en el proceso, pero por ahora mucho más se logró. El conjunto de herramientas se amplía constantemente por las ideas propias o ideas de la comunidad y debido a su gran apoyo de mi motivación para continuar todavía está allí. Constantemente me presenta retos interesantes y es divertido para encontrar soluciones para eso.<p />Dado que se trata de mucho trabajo y puede ser muy lento siempre estoy muy agradecido por cualquier tipo de soporte. Por lo tanto me gustaría dar las gracias a todos los que ofreció su apoyo para este proyecto -. Sea a través de donaciones o hacer clic en un AdFly-Link, el conocimiento, la creatividad, los informes de error o sólo algunas palabras alentadoras bbcode'
			},
			bbcode : {
				troops : 'Tropas',
				building : 'Nivel de construcción',
				cities : 'Ciudades',
				all : 'Todo',
				active_grp : 'Grupo de ciudad activa',
				in : 'en',
				from : 'desde',
				outside : 'fuera de',
				messages : 'Mensajes'
			},
			stats_scripts : {
				stats_scripts_ov : 'Visión general de las estadísticas y scripts'
			},
			googledocs : {
				change_url : 'Cambiar URL',
				reset : 'Resetear'
			},
			farmhelper : {
				autohide_cities : 'Ocultar automáticamente las Ciudades después de la agricultura encendido/apagado'
			},
			export_window : {
				button_mouseover : 'Exportar a imagen',
				upload : 'Subir',
				settings : 'Opciones',
				preview : 'Vista previa',
				chrome : 'Chrome abre la ventana con la captura de pantalla por defecto como una ventana emergente. Si usted prefiere que la ventana se abra como una nueva pestaña, tienes que instalar un complemento adicional. Haga clic aquí para llegar al complemento.',
				town : 'Ciudad',
				luck : 'Suerte',
				title : 'Titulo',
				resources : 'Recursos',
				wall : 'Muralla',
				player : 'Jugador',
				reporttype : 'Tipo de reporte',
				resources_lost : 'Recursos perdidos',
				nightbonus : 'Bonus nocturno',
				alliance : 'Alianza',
				troops : 'Tropas',
				buildings : 'Edificios',
				payed_iron : 'Hierro pagado',
				payed_iron_storage : 'Hierro almacenado',
				date : 'Fecha',
				spell_info : 'Información del hechizo',
				spell_effect : 'Efecto del hechizo',
				message : 'Mensaje',
				attacker : 'Atacante',
				defender : 'Defensor',
				bonuses : 'Hechizos/beneficios',
				town_left : 'Ciudad (izquierda)',
				town_right : 'Ciudad (derecha)',
				player_left : 'Jugador (izquierda)',
				player_right : 'Jugador (derecha)',
				travel_time : 'Tiempo de viaje',
				time_of_arrival : 'Tiempo de llegada',
				command : 'Comando',
				defeated_atk : 'Derrotado como atacante',
				defeated_def : 'Derrotado como defensor',
				losses_atk : 'Perdidas como atacante',
				losses_def : 'Perdidas como defensor',
				brush_size : 'Tamaño de pincel',
				color : 'Color',
				eraser : 'Borrador',
				pencil : 'Lápiz',
				arrow : 'Flecha',
				rectangel : 'Rectángulo',
				line : 'Linea',
				arc : 'Circulo',
				delete_drawing : 'Eliminar dibujo',
				fill : 'Llenar'
			},
			colors : {
				black : "negro",
				blue : "azul",
				red : "rojo",
				green : "verde",
				yellow : "amarillo",
				gray : "gris"
			},
			command_ov : {
				commands : 'Comandos'
			}
		},
		fr : {
			meta : {
				flag : 'http://s7.directupload.net/images/140408/fo8msuwx.png',
				donation_btn : '<a href="http://paypal.me/quacktoolsammlung" target="_blank"><img src="https://www.paypal.com/fr_FR/i/btn/btn_donate_LG.gif" alt="Donate"></a>'
			},
			reports : {
				choose_folder : 'Choisissez un dossier',
				enacted : 'promulgué',
				conquered : 'conquérir (ville conquise)',
				spying : 'espionner ',
				spy : 'Espion',
				supporting : 'soutenir',
				attacking : 'attaquer',
				farming_village : 'village agricole'
			},
			forum : {
				delete : 'Supprimer',
				delete_sure : 'Voulez vous réellement effacer ces messages?',
				no_selection : 'Aucun message sélectionnés'
			},
			town_info : {
				no_overload : 'sans surcharge',
				delete : 'Effacer',
				polissuche : 'Recherche ville',
				inactivity : 'Inactivité',
				days : 'Jours',
				no_data : "Le joueur n'est pas encore listé dans la base de données"
			},
			grepo_mainmenu : {
				city_view : 'Vue de la ville',
				island_view : "Vue île",
				delete : 'Supprimer'
			},
			messages : {
				ghosttown : 'Ville fantôme',
				no_cities : 'Aucune ville sur cette île',
				all : 'Tous',
				export : 'Convertir le message en BB-Code',
			},
			hotkeys : {
				hotkeys : 'Raccourci',
				city_select : 'Sélection ville',
				last_city : 'Ville précédente',
				next_city : 'Ville suivante',
				jump_city : 'Attendre la ville actuelle',
				administrator : 'Administrateur',
				captain : 'Capitaine',
				trade_ov : 'Aperçu du commerce',
				command_ov : 'Aperçu des ordres',
				recruitment_ov : 'Aperçu du recrutement',
				troop_ov : 'Aperçu des troupes',
				troops_outside : 'Troupes en dehors',
				building_ov : 'Aperçu des bâtiments',
				culture_ov : 'Aperçu culturel',
				gods_ov : 'Aperçu des divinités',
				cave_ov : 'Aperçu des grottes',
				city_groups_ov : 'Aperçu des groupes de villes',
				city_list : 'Liste des villes',
				attack_planner : 'Planificateur',
				farming_villages : 'Villages de paysans',
				menu : 'Menu',
				city_view : 'Vue de la ville',
				messages : 'Messages',
				reports : 'Rapports',
				alliance : 'Alliance',
				alliance_forum : 'Forum d\'alliance',
				settings : 'Réglages',
				profile : 'Profil',
				ranking : 'Classement',
				notes : 'Notes',
				chat : 'Chat',
				council : 'Concile des héros'
			},
			qtoolbox : {
				onlinecounter_now : 'Depuis',
				onlinecounter_total : 'Totale',
				onlinecounter_switch : 'Online depuis/totale',
				stats : 'Statistiques',
				player : 'Joueur',
				alliance : 'Alliance',
				rankings : 'Classement',
				track_player : 'Trouver Joueur',
				track_alliance : 'Trouver Alliance',
				top_killers : 'Meilleurs combattants',
				maps : 'Cartes',
				townsearches : 'Ville-Recherches',
				tonda_polissuche : 'Recherche de Ville',
				in_town : 'Dans la ville',
				from_town : 'De la ville',
				outside_town : 'Extérieur de la ville',
				tools : 'Outils',
				display_modes : 'Mode écran',
				full_screen : 'Plein écran'
			},
			academy : {
				researched : 'Colorer recherché',
				notresearched : 'Colorer non recherché',
				undo : 'Annuler coloration'
			},
			caves : {
				stored_silver : 'Capacité de stockage des pièces d\'argent',
				name : 'Nom',
				wood : 'Bois',
				stone : 'Pierre',
				silver : 'Pièces d\'argent'
			},
			transport_calc : {
				btn_main : 'Transports assistant',
				available : 'Capacité disponible',
				transportable : 'Unités transportables',
				recruits : 'Nombre d\'unités dans la queue de recrutement',
				outsidetown : 'Nombre d\'unités en dehors de la ville',
				slowtrans : 'Nombre de transporteurs lents',
				fasttrans : 'Nombre de transporteurs rapides',
				disabled : 'Temporairement désactivé'
			},
			culture : {
				cityfestivals : 'Festivals',
				olympicgames : 'Jeux Olympiques',
				triumph : 'Marche triomphales',
				theater : 'Pièces de théâtre'
			},
			settings : {
				text2 : 'Comptoir en ligne',
				text3 : 'Ouvrir les liens du menu dans le jeu',
				text4 : 'Activer l\'inclusion de scripts Greasemonkey autres au menu',
				text5 : 'Afficher les boutons d\'affichage permanent de l\'unité de file de recrutement, d\'activité et de commerce',
				text6 : 'Barre de boutons',
				text9 : 'Afficher au départ',
				text11 : 'Désactiver l\'enregistrement du temps total en ligne',
				text12 : 'Transports assistant',
				text13 : 'Affichage du menu',
				text14 : 'Fonctions du menu',
				text15 : 'Rapports',
				text16 : 'Ajoutez de la couleur',
				text17 : 'Ajouter filtrer',
				text18 : 'Afficher activé',
				text19 : 'Effacer toutes les traces et personnalisations du script dans le cache du navigateur?',
				text21 : 'Maximiser la largeur du forum',
				text22 : 'Image raccourcis',
				text23 : 'Menu Grepolis',
				text24 : 'Sénat',
				text25 : 'Afficher le nombre de points attribués pour la construction d\'un niveau supérieur d\'un bâtiment',
				text26 : 'Fenêtre de négociation',
				text27 : 'Activer les extension',
				text28 : 'Liste de ville',
				text29 : 'Liste des quest',
				text30 : 'Ajoutez une liste déroulante avec les dossiers',
				text31 : 'Button pour le BB-code de la ville actuelle',
				text32 : 'Sélectionner et supprimer des messages',
				text34 : 'Aperçu des grottes (Administrateur)',
				text35 : 'Planificateurs de l\'Académie',
				text36 : 'Grotte',
				text37 : 'Permettre le tri des villes',
				text38 : 'Entrer argent au-dessus de 15.000 automatiquement dans le champ de saisie',
				text40 : 'L\'aperçu des villages de paysans (Capitaine)',
				text41 : 'Ajouter un bouton pour ouvrir la vue sur la ville au menu de côté sur Grepolis',
				text42 : 'Afficher les pertes de ressources',
				text43 : 'Simulateur',
				text44 : 'Visualisation de l\'île',
				text45 : 'Agrandir la hauteur de la liste des villes et des villages',
				text46 : 'Raccourcis',
				text47 : 'Utiliser [Entrer] comme bouton pour passer à la ville courante (et pas [Espace])',
				text48 : 'Ouvrir l\'ancienne vue de la ville',
				text49 : 'Trier les sorts alphabétiquement',
				text50 : 'Afficher les quêtes',
				text51 : 'Masquer automatiquement la ville',
				text52 : 'Vue de la ville',
				text53 : 'Afficher la ville dans une fenêtre',
				other : 'Autre',
				save : 'Sauver',
				reset : 'Réinitialiser les réglages',
				settings : 'Paramètres',
				translations : 'Traductions',
				trans_sure : 'Etes vous sur que votre traduction est prête à être envoyée ?',
				trans_success : 'La traduction a été envoyée avec succès',
				trans_fail : 'La traduction ne peut pas être envoyée',
				trans_infotext1 : 'La traduction n\'a pas besoin d\'être complète - traduisez juste ce que vous voulez',
				trans_infotext2 : 'Quand du texte contient des balises HTML (tout ce qui est entouré par des <> ) je vous demande de les laisser au même endroit où vous les avez trouvé',
				trans_infotext3 : 'Afin de pouvoir vous ajouter aux crédits, votre pseudo, identifiant et votre numéro de monde seront également envoyé',
				trans_infotext4 : 'Les spammeurs seront ajoutés à la liste noir interne et ne pourront plus utiliser le script',
				please_note : 'Notez',
				no_translation : 'Traduction non trouvée',
				choose_lang : 'Sélectionner la langue',
				add_lang : 'Ajouter une langue',
				language : 'Langue',
				enter_lang_name : 'Entrer un nom de langue',
				send : 'Envoyer',
				name : 'Nom',
				ingame_name : 'N\'hésitez pas à me contacter si vous préférez être appeler par votre pseudo.',
				adfly : 'Voulez vous également gagner de l\'argent avec des lien ?',
				update_check : 'Vérifier les mise à jours',
				prologue : 'A cause du manque de script alternatifs pour Grepolis 2.0, cet outil a été lancé il y a 2 ans et essaye constamment depuis d\'étendre Grepolis avec de nouvelles fonctionnalités.<p />Le but initial était de réparer les fonctions des vieux script pour Grepolis 1.0 et d\'apprendre les bases du Javascript, mais depuis, beaucoup plus a été accomplis. Mon outil est constamment étendu par mes propres idées, ou celles de la communauté, et grâce à votre support, ma motivation à continuer est toujours là. Vous me présentez constamment de nouveaux défis, et c\'est très amusant d\'en trouver les solutions.<p />Comme il y a beaucoup à faire, et que cela peut demander beaucoup de temps, je suis toujours très reconnaissant pour tout type d\'aide. De ce fait, j\'aimerai remercier tous ceux qui ont offert de l\'aide sur ce projet, que ce soit par des donations, en cliquant sur des liens AdFly, en partageant des connaissances, des conseils créatifs, en rapportant des problèmes, ou simplement par des messages d\'encouragement.'
			},
			bbcode : {
				troops : 'Troupes',
				building : 'Les niveaux des bâtiments',
				cities : 'Villes',
				all : 'Toutes',
				active_grp : 'Groupe de villes actif',
				in : 'en',
				from : 'de',
				outside : 'à l\'extérieur de'
			},
			stats_scripts : {
				stats_scripts_ov : 'Aperçu de statistiques et des scripts'
			},
			googledocs : {
				change_url : 'Changer lien',
				reset : 'Remettre'
			},
			farmhelper : {
				autohide_cities : 'Masquer automatiquement les villes après l\'agriculture on / off'
			}
		},
		gr : {
			meta : {
				flag : 'http://s7.directupload.net/images/140725/ki6kli48.png'
			},
			reports : {
				choose_folder : 'Επιλογή φακέλου',
				enacted : 'Θεσπιστεί',
				conquered : 'Κατακτήθηκε',
				spying : 'Κατασκοπεία',
				spy : 'Κατάκσοπος',
				support : 'Υποστήριξη',
				supporting : 'Υποστηρίζει',
				attacking : 'Επιτίθεται',
				farming_village : 'Αγροτικό χωριό'
			},
			forum : {
				delete : 'Διαγραφή',
				delete_sure : 'Θέλετε να διαγραφεί αυτή η ανάρτηση?',
				no_selection : 'Δεν έχετε επιλέξει ανάρτηση'
			},
			town_info : {
				no_overload : 'Μη υπερφόρτωση',
				delete : 'Διαγραφή',
				polissuche : 'Εύρεση πόλης',
				inactivity : 'Ανενεργός',
				days : 'Ημέρες',
				no_data : 'Ο παίχτης δεν έχει μπει ακόμα στην βάση δεδομένων'
			},
			grepo_mainmenu : {
				city_view : 'Προβολή πόλης',
				island_view : 'Προβολή νησιού'
			},
			messages : {
				ghosttown : 'Πόλη φάντασμα',
				no_cities : 'Καμμία πόλη στο νησί',
				all : 'Όλα',
				export : 'Μετατροπή μυνήματος σε BB-Code'
			},
			hotkeys : {
				hotkeys : 'Συντομεύσεις Πληκτρολογίου',
				city_select : 'Επιλογή πόλης',
				last_city : 'Τελευταία πόλη',
				next_city : 'Επόμενη πόλη',
				jump_city : 'Πηγαίνει στην σωστή πόλη',
				administrator : 'Διαχειριστής',
				captain : 'Καπετάνιος',
				trade_ov : 'Συνναλαγή',
				command_ov : 'Εντολές',
				recruitment_ov : 'Στρατολογηση',
				troop_ov : 'Επισκοπηση Στρατευματων',
				troops_outside : 'Στρατευματα Εξω',
				building_ov : 'Κτίρια',
				culture_ov : 'Πολιτισμός',
				gods_ov : 'Θεότητες',
				cave_ov : 'Σπηλιές',
				city_groups_ov : 'Ομάδες πόλεων',
				city_list : 'Λίστα πόλεων',
				attack_planner : 'Πλάνο επίθεσης',
				farming_villages : 'Αγροτικά χωριά',
				menu : 'Μενού',
				city_view : 'Προεπισκόπηση πόλης',
				messages : 'Μυνήματα',
				reports : 'Αναφορές',
				alliance : 'Συμμαχία',
				alliance_forum : 'Φορουμ Συμμαχίας',
				settings : 'Ρυθμίσεις',
				profile : 'Προφίλ',
				ranking : 'Κατάταξη',
				notes : 'Σημειώσεις',
				chat : 'Συνομιλία',
				council : 'Συμβούλιο Ηρώων'
			},
			qtoolbox : {
				onlinecounter_now : 'Τρέχουσα',
				onlinecounter_total : 'Σύνολο',
				stats : 'Στατιστικά',
				grepostats : 'Στατιστικά Grepolis',
				player : 'Παίκτης',
				alliance : 'Συμμαχία',
				top_killers : 'Κορυφαίοι μαχητές',
				rankings : 'Κατάταξη',
				track_player : 'Εύρεση παίκτη',
				track_alliance : 'Εύρεση συμμαχίας',
				maps : 'Χάρτης',
				townsearches : 'Εύρεση πόλεων',
				tonda_polissuche : 'Αναζήτηση πολης',
				in_town : 'Εντός πόλεως',
				from_town : 'Από την πόλη',
				outside_town : 'Εκτός πόλεως',
				tools : 'Εργαλεία',
				unit_comparison : 'Σύγκριση μονάδων',
				google_docs : 'Έγγραφα Google',
				display_modes : 'Μέθοδοι προβολής',
				full_screen : 'Πλήρης οθόνη'
			},
			academy : {
				researched : 'Χρωματισμός εξερευνηθέντων',
				notresearched : 'Χρωματισμός μη εξερευνηθέντων',
				undo : 'Αναιρεση χρωματισμού'
			},
			caves : {
				stored_silver : 'Αποθηκευμένα Ασημένια νομίσματα',
				silver_to_store : 'Ασημένια νομίσματα προς αποθήκευση',
				name : 'Όνομα',
				wood : 'Ξύλο',
				stone : 'Πέτρα',
				silver : 'Ασημένια νομίσματα'
			},
			transport_calc : {
				btn_main : 'Υπολογισμός μεταφορικών',
				available : 'Διαθέσιμες θέσεις μεταφοράς',
				transportable : 'Μεταφερόμενες μονάδες',
				recruits : 'Μέτρηση μονάδων στην σειρά παραγωγής',
				outsidetown : 'Μέτρηση μονάδων εκτός πόλεως',
				slowtrans : 'Μέτρηση αργών μταφορικών',
				fasttrans : 'Μέτρηση γρήγορων μεταφορικών',
				disabled : 'Προσωρινά μη διαθέσιμο'
			},
			culture : {
				cityfestivals : 'Γιορτές Πόλης',
				olympicgames : 'Ολυμπιακοί αγώνεσ',
				triumph : 'Παρελάσεις θριάμβου',
				theater : 'Θεατρικές παραστάσεις'
			},
			settings : {
				text2 : 'Μετρητής ώρας online',
				text3 : 'Άνοιγμα συνδέσμων από το μενού εντός παιχνιδιού',
				text4 : 'Ενεργοποίησε να περιλαμβάνονται και άλλα scripts στο μενού από το greasemonkey',
				text5 : 'Προβολή κουμπιών για την μόνιμη προβολή των κινήσεων μοναδων και εμπορίου',
				text9 : 'Προβολή στο ξεκίνημα'
			},
			bbcode : {
				troops : 'Στρατεύματα',
				building : 'Επίπεδα κτιρίων',
				cities : 'Πόλεις',
				all : 'Όλα',
				active_grp : 'Ενεργοποίση ομάδων πόλεων',
				in : 'Μέσα',
				from : 'Από',
				outside : 'Εκτός',
				messages : 'Μηνύματα'
			},
			stats_scripts : {
				stats_scripts_ov : 'Προβολή στατιστικών και scripts'
			},
			googledocs : {
				change_url : 'Αλλαγή URL'
			},
			export_window : {
				town : 'Πόλη',
				luck : 'Τύχη',
				title : 'Τίτλος',
				resources : 'Λάφυρα',
				wall : 'Τείχος',
				player : 'Παίκτης',
				moral : 'Ηθικό',
				reporttype : 'Τύπος αναφοράς',
				resources_lost : 'Απώλεια λαφύρων',
				nightbonus : 'Μπόνους νύχτας',
				alliance : 'Συμμαχία',
				troops : 'Στρατεύματα',
				bashpoints : 'Πόντοι μάχης',
				buildings : 'Κτίρια',
				payed_iron : 'Νομίσματα που εστάλησαν',
				payed_iron_storage : 'Αποθηκευμάνα νομίσματα',
				date : 'Ημερομηνία',
				spell_info : 'Πληροφορίες θεϊκής δύναμης',
				spell_effect : 'Αποτέλεσμα θεϊκής δύναμης',
				message : 'Μήνυμα',
				attacker : 'Επιτιθέμενος',
				defender : 'Αμυνόμενος',
				bonuses : 'Θεϊκες δυνάμεις/Μπόνους',
				command_type : 'Τύπος εντολής',
				town_left : 'Πόλη (αριστερά)',
				town_right : 'Πόλη (δεξιά)',
				player_left : 'Παίχτης (αριστερά)',
				player_right : 'Παίχτης (δεξιά)',
				travel_time : 'Διάρκεια ταξιδιού',
				time_of_arrival : 'Ώρα άφιξης',
				command : 'Εντολή',
				defeated_atk : 'Ήττα επιτιθέμενου',
				defeated_def : 'Ήττα αμυνόμενου',
				losses_atk : 'Απώλειες επιτιθέμενου',
				losses_def : 'Απώλειες αμυνόμενου',
				brush_size : 'Μέγεθος βούρτσας',
				color : 'Χρώμα',
				eraser : 'Γόμα',
				pencil : 'Μολύβι',
				arrow : 'Βέλος',
				rectangel : 'Τετράγωνο',
				line : 'Γραμμή',
				arc : 'Κύκλος',
				delete_drawing : 'Διαγραφή ζωγραφιάς',
				fill : 'Γέμισμα'
			},
			colors : {
				black : 'Μαύρο',
				blue : 'Μπλε',
				red : 'Κόκκινο',
				green : 'Πράσινο',
				yellow : 'Κίτρινο',
				gray : 'Γκρι'
			}
		},
		hu : {
			meta : {
				flag : 'http://s1.directupload.net/images/140422/3k2lqw68.png',
			},
			reports : {
				choose_folder : 'Válaszz mappát',
				enacted : 'elfogadott',
				conquered : 'meghódított',
				spying : 'kémkedés',
				spy : 'Kém',
				support : 'támogatás',
				supporting : 'támogatás',
				attacking : 'támadás',
				farming_village : 'falvak farmolása'
			},
			forum : {
				delete : 'Törlés',
				delete_sure : 'Biztos törölni szeretnéd ezt a bejegyzést?',
				no_selection : 'Nincsnek kiválasztott megjegyzések'
			},
			town_info : {
				no_overload : 'Nincs túlterhelés',
				delete : 'Törlés',
				polissuche : 'Városkeresés',
				inactivity : 'Inaktivitás',
				days : 'nap',
				no_data : 'A játékos még nincs listázva az adatbázisban'
			},
			grepo_mainmenu : {
				city_view : 'Város nézet',
				island_view : 'Sziget nézet'
			},
			messages : {
				ghosttown : 'Szellem város',
				no_cities : 'Ezen a szigeten nincs város',
				all : 'mind',
				export : 'Üzenet BB-Code-ba konvertálása'
			},
			hotkeys : {
				hotkeys : 'Gyorsparancsok',
				city_select : 'Város kiválasztás',
				last_city : 'Előző város',
				next_city : 'Következő város',
				jump_city : 'Ugrás az aktuális városra',
				administrator : 'Parancsnok',
				captain : 'Kapitány',
				trade_ov : 'Kereskedelem',
				command_ov : 'Parancsok',
				recruitment_ov : 'Toborzás',
				troop_ov : 'Csapat áttekintés',
				troops_outside : 'Kinti csapatok',
				building_ov : 'Épületek',
				culture_ov : 'Kúltúra',
				gods_ov : 'Istenek',
				cave_ov : 'Vermek',
				city_groups_ov : 'Város csoportok',
				city_list : 'Város lista',
				attack_planner : 'Támadástervező',
				farming_villages : 'Falvak farmolása',
				menu : 'Menü',
				city_view : 'Város nézet',
				messages : 'Üzenetek',
				reports : 'Jelentések',
				alliance : 'Szövetség',
				alliance_forum : 'Szövetségi fórum',
				settings : 'Beállítások',
				profile : 'Profil',
				ranking : 'Helyezés',
				notes : 'Feljegyzések',
				council : 'Hősök Világa'
			},
			qtoolbox : {
				onlinecounter_now : 'Most',
				onlinecounter_total : 'Összes',
				onlinecounter_switch : 'Eltöltött idő most/összes',
				stats : 'Statisztika',
				grepostats : 'Grepo statisztika megnyitása',
				player : 'Játékos',
				alliance : 'Szövetség',
				rankings : 'Ranglista',
				grepo_bash : 'Grepo bash megnyitása',
				track_player : 'Játékos elhelyezkedése',
				track_alliance : 'Szövetség elhelyezkedése',
				top_killers : 'Legtöbb harcipont',
				maps : 'Térképek',
				grepo_maps : 'Grepo mappák megnyitása',
				grepo_intel : 'Grepo információk megnyitása',
				townsearches : 'Város keresések',
				grepo_finder : 'Grepo kereső megnyitása',
				tonda_polissuche : 'Városkeresés',
				bb_codes : 'BB-Kódok',
				in_town : 'Városban',
				from_town : 'Városból',
				outside_town : 'Városon kívül',
				tools : 'Eszközök',
				unit_comparison : 'Összehasonlítás',
				google_docs : 'Google dokumentumok',
				deff_helper : 'Deff segítő',
				display_modes : 'Kijelző módok',
				full_screen : 'Teljes képernyő',
				minimal : 'Minimális',
				standard : 'Alap',
				stats_scripts : 'Statisztikák/Scriptek',
				settings : 'Script kezelő'
			},
			academy : {
				researched : 'Kifejlesztett színezése',
				notresearched : 'Nem kifejlesztett színezése',
				undo : 'Színezés visszavonása'
			},
			caves : {
				stored_silver : 'Elraktározható ezüstpénzek',
				name : 'Név',
				wood : 'Fa',
				stone : 'Kő',
				silver : 'Ezüstpénz'
			},
			transport_calc : {
				btn_main : 'Szállítási idő számláló',
				available : 'Rendelkezésre álló szállítási kapacitás',
				transportable : 'Szállítható egységek',
				recruits : 'Számolja a kiképzés alatt álló egységeket',
				outsidetown : 'Számolja a városon kívüli egységeket',
				slowtrans : 'Számolja a szállítóhajókat',
				fasttrans : 'Számolja a gyors szállítóhajókat',
				disabled : 'Ideiglenesen nem elérhető'
			},
			culture : {
				cityfestivals : 'Városi fesztiválok',
				olympicgames : 'Olimpiai játékok',
				triumph : 'Diadalmenetek',
				theater : 'Színházi játékok'
			},
			settings : {
				text2 : 'Online-idő számláló',
				text3 : 'Linkek megnyitása a menüből a játékban',
				text4 : 'Aktiválja a többi greasemonkey scriptet',
				text5 : 'Mutassa az egységek kiképzési sorrendjének, a mozgásoknak és a kereskedelemnek a kapcsolóit az állandó kijelzőn',
				text6 : 'Gombsor',
				text9 : 'Kijelzés indításkor',
				text11 : 'A teljes eltöltött idő mentésének kikapcsolása',
				text12 : 'Szállítási idő számláló',
				text13 : 'Menü megjelenítés',
				text14 : 'Menü tulajdonságok',
				text15 : 'jelentések',
				text16 : 'Szín hozzáadása',
				text17 : 'Szűrő hozzáadása',
				text18 : 'Kijelző aktiválása',
				text19 : 'Törölsz minden scriptet és beállítást a gyorsítótárból és az előzményekből?',
				text20 : 'Fórum',
				text21 : 'Maximális szélesség',
				text22 : 'Gyorsparancs kép',
				text23 : 'Grepolis menü',
				text24 : 'Szenátus',
				text25 : 'Kiírja, mennyi pontot kapsz, ha bővíted az épületet',
				text26 : 'Kereskedés ablak',
				text27 : 'Bővítmény aktiválása',
				text28 : 'Város lista',
				text29 : 'Küldetés lista',
				text30 : 'Hozzáad egy legördülő listát a mappáiddal',
				text31 : 'Város BB-kódja',
				text32 : 'Válassz ki és törölj megjegyzéseket',
				text34 : 'Vermek áttekintése (parancsnok)',
				text35 : 'Akadémia tervező',
				text36 : 'Verem',
				text37 : 'Engedélyezze a városok rendezését',
				text38 : 'Engedélyezi egyszerre több mint 15ezer ezüst beírását a beviteli mezőbe',
				text40 : 'Farmolható faluk áttekintése (Kapitány szükséges)',
				text41 : 'Hozzáad egy "Város nézet" gombot a menühöz',
				text42 : 'Kiírja a vesztett nyersanyagokat',
				text43 : 'Szimulátor',
				text44 : 'Sziget áttekintő',
				text45 : 'Megnöveli a városlista és a farmolható faluk listájának a magasságát',
				text46 : 'Gyorsparancsok',
				text47 : '[Enter] használata az aktuális városhoz ugrásra (nem [Space])',
				text48 : 'Régi városnézet megnyitása',
				text49 : 'Jelentések mappa ABC sorrendbe rendezése',
				text50 : 'Küldetésnyíl mutatása',
				text51 : 'Városok automatikus elrejtése farmolás után',
				text52 : 'Város nézet',
				text53 : 'Városnézet megnyitása új ablakban',
				other : 'Másik',
				save : 'Mentés',
				reset : 'Beállítások visszaállítása',
				contact : 'Kapcsolat',
				settings : 'Beállítások',
				translations : 'Fordítás',
				trans_sure : 'Biztos vagy benne, hogy a fordításod kész arra hogy elküldd?',
				trans_success : 'Sikeresen elküldted a fordítást',
				trans_fail : 'A fordítás nem lett elküldve',
				trans_infotext1 : 'A fordítás nincs teljesen kész - fordíts amit szeretnél',
				trans_infotext2 : 'Ha egy szöveg HTML-t tartalmaz ( < > között ) akkor megkérdezlek, biztosan szeretnéd-e használni.',
				trans_infotext3 : 'Azért hogy hozzáadhassunk a készítőkhöz, a játékosneved, játékos azonosítód és a világ azonosítód is hozzá lesz kapcsolva',
				trans_infotext4 : 'A spammelők hozzá lesznek adva a Ban-listához én nem tudják majd használni a scriptet.',
				please_note : 'Kérlek vedd figyelembe',
				credits : 'Készítők',
				no_translation : 'Nem találtunk fordítást',
				choose_lang : 'Válaszz nyelvet',
				add_lang : 'Új nyelv hozzáadása',
				language : 'Nyelv',
				enter_lang_name : 'Írd be a nyelv nevét',
				send : 'Küldés',
				name : 'Név',
				ingame_name : 'Ne habozz jelezni, ha inkább a játékban használt nevedet használnád',
				adfly : 'Szeretnél pénzt szerezni linkekkel is?',
				donations : 'Támogatások',
				update_check : 'Frissítés ellnőrzése',
				prologue : 'Mivel kevés különböző userscript létezik a Grepolis 2.0-hoz, ez a finomhangoló program 2 éve indult és azóta is folyamatosan törekszik a játék újabb funkciókkal való bővítésére.<p />Eleinte a Grepolis 1.0-hoz készült régi userscriptek kijavítása volt és a JavaScript alapjainak megtanulása közben, de mostanra ennél sokkal több valósult meg. A finomhangoló program folyamatosan bővítve lett saját és a közösség ötleteivel és a nagy támogatásotok a folytatásra sarkall. Folyamatosan érdekes kihívások elé állítotok és szórakoztató a megoldások megkeresése.<p />Mindig nagyon boldogan segítek bármilyen formában, habár ez sok munkát és időt jelent. Ezért szeretném megköszönni mindenkinek, aki támogatta ezt a project-et - akár anyagi, AdFly-Link kattintással, tudással, kreativitással, hibajelentéssel vagy csak néhány bíztató szóval.'
			},
			bbcode : {
				troops : 'Csapatok',
				building : 'Építkezési szintek',
				cities : 'Városok',
				all : 'Összes',
				active_grp : 'Aktív város csoport',
				in : 'itt',
				from : 'itt',
				outside : 'kívül itt',
				messages : 'Üzenetek'
			},
			stats_scripts : {
				stats_scripts_ov : 'Statisztikák és szkriptek attekintése'
			},
			googledocs : {
				change_url : 'Link cserélése',
				reset : 'Újra'
			},
			colors : {
				black : 'fekete',
				blue : 'kék',
				red : 'piros',
				green : 'zöld',
				yellow : 'sárga',
				gray : 'szürke'
			},
			command_ov : {
				commands : 'Parancsok'
			}
		},
		it : {
			meta : {
				flag : 'http://s7.directupload.net/images/140422/rxk9hlkk.png',
				donation_btn : '<a href="http://paypal.me/quacktoolsammlung" target="_blank"><img src="https://www.paypal.com/it_IT/i/btn/btn_donate_LG.gif" alt="Donate"></a>'
			},
			reports : {
				choose_folder : 'Scegli cartella',
				enacted : 'Eseguito',
				conquered : 'Conquistato',
				spying : 'Spiando',
				spy : 'Spia',
				support : 'supporti',
				supporting : 'supportando',
				attacking : 'attaccando',
				farming_village : 'villaggio rurale'
			},
			forum : {
				delete : 'Cancella',
				delete_sure : 'Vuoi davvero cancellare questo post?',
				no_selection : 'Nessun post selezionato'
			},
			town_info : {
				no_overload : 'Nessun sovraccarico',
				delete : 'Cancella',
				polissuche : 'cerca città',
				inactivity : 'Inattività',
				days : 'giorni',
				no_data : 'Il player non esiste ancora nel database'
			},
			grepo_mainmenu : {
				city_view : 'Panoramica città',
				island_view : 'Visuale isola'
			},
			messages : {
				ghosttown : 'Città fantasma',
				no_cities : 'Nessuna città su quest\'isola',
				all : 'tutti',
				export : 'Converti messagi in BB-Code'
			},
			hotkeys : {
				hotkeys : 'Tasti di scelta rapida',
				city_select : 'Selezione città',
				last_city : 'Precedente città',
				next_city : 'Prossima città',
				jump_city : 'Salta alla città attuale',
				administrator : 'Amministratore',
				captain : 'Capitano',
				trade_ov : 'Panoramica commercio',
				command_ov : 'Panoramica ordini',
				recruitment_ov : 'Panoramica reclutamento',
				troop_ov : 'Panoramica truppe',
				troops_outside : 'Truppe esterne',
				building_ov : 'Panoramica edifici',
				culture_ov : 'Panoramica cultura',
				gods_ov : 'Panoramica dei',
				cave_ov : 'Panoramica caverne',
				city_groups_ov : 'Panoramica gruppi di città',
				city_list : 'Elenco città',
				attack_planner : 'Pianificatore attacchi',
				farming_villages : 'Villaggi rurali',
				city_view : 'Panoramica città',
				messages : 'Messaggi',
				reports : 'Rapporti',
				alliance : 'Alleanza',
				alliance_forum : 'Forum-Alleanza',
				settings : 'Impostazioni',
				profile : 'Profilo',
				ranking : 'Classifica',
				notes : 'Note',
				council : 'Concilio degli eroi'
			},
			qtoolbox : {
				onlinecounter_now : 'Attuale',
				onlinecounter_total : 'Totale',
				onlinecounter_switch : 'Online Attuale/Totale',
				stats : 'Statistiche',
				player : 'Giocatore',
				alliance : 'Alleanza',
				rankings : 'Classifiche',
				track_player : 'Analisi giocatore',
				track_alliance : 'Analisi alleanza',
				top_killers : 'Top attaccanti',
				maps : 'Mappe',
				townsearches : 'Ricerca delle città',
				tonda_polissuche : 'Cercacittà',
				in_town : 'Truppe in città',
				from_town : 'Truppe della città',
				outside_town : 'Truppe esterne',
				tools : 'Strumenti',
				unit_comparison : 'Confronto unità',
				display_modes : 'Modalità schermo',
				full_screen : 'Schermo intero',
				minimal : 'Minima',
				stats_scripts : 'Statistiche/script'
			},
			academy : {
				researched : 'Colora ricercate',
				notresearched : 'Decolora ricercate',
				undo : 'Annulla colorazione',
			},
			caves : {
				stored_silver : 'Monete d\'argento incorporate',
				silver_to_store : 'Monete d\'argento immagazinabili',
				name : 'Nome',
				wood : 'Legname',
				stone : 'Pietre',
				silver : 'Monete d\'argento',
				search_for : 'Cerca per'
			},
			transport_calc : {
				btn_main : 'Calcolo trasporti',
				available : 'Capacità di trasporto disponibile',
				transportable : 'Unità trasportabili',
				recruits : 'Calcola le truppe in reclutamento',
				outsidetown : 'Calcola le unità esterne',
				slowtrans : 'Conta trasporti lenti',
				fasttrans : 'Conta trasporti veloci',
				disabled : 'Temporaneamente disabilitato'
			},
			culture : {
				cityfestivals : 'Festa cittadina',
				olympicgames : 'Giochi Olimpici',
				triumph : 'Corteo trionfale',
				theater : 'Opere teatrali'
			},
			settings : {
				text2 : 'Contatore online',
				text3 : 'Apri link dal menu del gioco',
				text4 : 'Attiva l\'inclusione di altri script greasemonkey al menu',
				text5 : 'Mostra pulsanti per la visualizzazione permanente delle code di unità, movimenti e commercio',
				text6 : 'Barra dei pulsanti',
				text9 : 'Mostra all\'avvio',
				text11 : 'Disattiva il salvataggio del tempo totale online',
				text12 : 'Calcolo trasporti',
				text13 : 'Visualizza menu',
				text14 : 'Caratteristiche menu',
				text15 : 'Rapporti',
				text16 : 'Aggiungi colore',
				text17 : 'Aggiungi filtro',
				text18 : 'Attiva visualizzazione',
				text19 : 'Cancella tutte le impostazioni e le tracce dello script nella cache del browser?',
				text21 : 'Espandi la larghezza del forum',
				text22 : 'Immagine tasti di scelta rapida',
				text23 : 'Menu Grepolis',
				text24 : 'Senato',
				text25 : 'Mostra il numero di punti assegnati per la costruzione del prossimo livello di un edificio',
				text26 : 'Finestra commercio',
				text27 : 'Attiva estensione',
				text28 : 'Lista città',
				text29 : 'Lista delle missioni',
				text31 : 'Bottone per il BB-code dell\'attuale città',
				text32 : 'Seleziona e cancella il post',
				text34 : 'Panoramica caverna (Amministratore)',
				text35 : 'Accademia pianificatori',
				text36 : 'Caverna',
				text40 : 'La panoramica dei villaggi (Capitano)',
				text43 : 'Simulatore',
				text52 : 'Panoramica città',
				other : 'Altro',
				save : 'Salva',
				reset : 'Resetta impostazioni',
				contact : 'Contatto',
				translations : 'Traduzioni',
				trans_success : 'La traduzione è stata inviata con successo',
				trans_fail : 'Non è stato possibile inviare la traduzione',
				trans_infotext1 : 'La traduzione non deve essere completa - traduci solo quello che ti senti',
				trans_infotext3 : 'Per essere in grado di aggiungere il vostro nome ai crediti, verranno trasmessi anche l\'id giocatore e l\'id del mondo',
				trans_infotext4 : 'Gli spammer saranno aggiunti alla lista ban interna ed esclusi dall\'uso dello script',
				credits : 'Crediti',
				no_translation : 'Nessuna traduzione trovata',
				choose_lang : 'Scegli linguaggio',
				add_lang : 'Aggiungi un nuovo linguaggio',
				language : 'Linguaggio',
				enter_lang_name : 'Per favore inserisci il nome del linguaggio',
				send : 'Invia',
				name : 'Nome',
				ingame_name : 'Non esitare a contattarmi se preferisci essere chiamato con il tuo nickname',
				update_check : 'Verifica per aggiornamenti',
				donations : 'Donazioni'
			},
			bbcode : {
				troops : 'Truppe',
				building : 'Livelli di costruzione',
				cities : 'Città',
				all : 'Tutte',
				active_grp : 'Gruppo città attive',
				from : 'da',
				outside : 'fuori da',
				messages : 'Messaggi'
			},
			stats_scripts : {
				stats_scripts_ov : 'Panoramica di statistiche e script'
			},
			googledocs : {
				change_url : 'Cambia URL',
				reset : 'Resetta'
			},
			farmhelper : {
				autohide_cities : 'Nascondi automaticamente i villaggi dopo la richiesta o il saccheggio on/off',
			},
			export_window : {
				wnd_title : 'upload immagine - anteprima',
				button_mouseover : 'Esporta come immagine',
				settings : 'Impostazioni',
				preview : 'Anteprima',
				chrome : 'Con Chrome la schermata si apre di default come un popup. Se si preferisce che si apra come una nuova scheda è necessario installare un addon in più. Clicca qui per arrivare all\'addon.',
				info : 'Il fornitore di hosting purtroppo consente solo 1.250 uploads al giorno. Il fornitore bloccherà questo servizio per il resto del mese se superiamo questo importo 5 volte. Per questo prossimamente ho intenzione di affittare un proprio server, ma i costi e lo sviluppo hanno bisogno di un po\' di tempo e soprattutto denaro. Investo il mio tempo libero per questo con piacere, ma come studente non riesco proprio a pagare tutti i costi. Come possibilità di rifinanziamento pertanto sto utilizzando lo sponsorlinks di Adf.ly (solo per il primo screenshot pubblicato). Con un clic su questo pulsante di Info sarete reindirizzati alla pagina ufficiale delle donazioni Paypal per questo script. Grazie a tutti coloro che già sostengono questo progetto e a coloro che intendono farlo.',
				connection_fail_text : 'La connessione al server non è riuscita. Il server non è raggiungibile o è stata raggiunta la massima capacità di accoglienza per oggi (1250 immagini al giorno / 50 immagini per utente).',
				town : 'Città',
				luck : 'Fortuna'
			},
			colors : {
				black : 'nero',
				blue : 'blu',
				red : 'rosso',
				green : 'verde',
				yellow : 'giallo',
				gray : 'grigio'
			},
			command_ov : {
				commands : 'Comandi'
			}
		},
		nl : {
			meta : {
				flag : 'http://s14.directupload.net/images/140408/bn8q27or.png',
				donation_btn : '<a href="http://paypal.me/quacktoolsammlung" target="_blank"><img src="https://www.paypal.com/nl_NL/i/btn/btn_donate_LG.gif" alt="Donatie"></a>'
			},
			reports : {
				choose_folder : 'Map kiezen',
				enacted : 'ingezet',
				conquered : 'veroverd',
				spying : 'verkent',
				spy : 'spion',
				supporting : 'steunt',
				attacking : 'aanvallen',
				farming_village : 'boerendorp'
			},
			forum : {
				delete : 'Verwijderen',
				delete_sure : 'Wil je deze berichten echt verwijderen?',
				no_selection : 'Geen berichten geselecteerd'
			},
			town_info : {
				no_overload : 'niet overbelasten',
				delete : 'Verwijderen',
				polissuche : 'stedenzoeker',
				inactivity : 'Inactief',
				days : 'dagen',
				no_data : 'De speler is nog niet in de database opgenomen'
			},
			grepo_mainmenu : {
				city_view : 'Stadsoverzicht',
				island_view : 'Eilandoverzicht'
			},
			messages : {
				ghosttown : 'Spookstad',
				no_cities : 'Geen steden op dit eiland',
				all : 'alle',
				export : 'Converteer bericht in BB-code'
			},
			hotkeys : {
				hotkeys : 'Sneltoetsen',
				city_select : 'Stedenkeuze',
				last_city : 'Vorige stad',
				next_city : 'Volgende stad',
				jump_city : 'Spring naar de huidige stad',
				administrator : 'Bestuurder',
				captain : 'Kapitein',
				trade_ov : 'Handel',
				command_ov : 'Bevelen',
				recruitment_ov : 'Rekrutering',
				troop_ov : 'Troepenoverzicht',
				troops_outside : 'Troepen buiten',
				building_ov : 'Gebouwen',
				culture_ov : 'Cultuur',
				gods_ov : 'Goden',
				cave_ov : 'Grotten',
				city_groups_ov : 'Stadsgroepen',
				city_list : 'Stedenlijst',
				attack_planner : 'Aanvalsplanner',
				farming_villages : 'Boerendorpen',
				city_view : 'Stadsoverzicht',
				messages : 'Berichten',
				reports : 'Rapporten',
				alliance : 'Alliantie',
				alliance_forum : 'Alliantieforum',
				settings : 'Instellingen',
				profile : 'Profiel',
				ranking : 'Ranglijst',
				notes : 'Notities',
				council : 'Raad van Helden'
			},
			qtoolbox : {
				onlinecounter_now : 'Actueel',
				onlinecounter_total : 'Totaal',
				onlinecounter_switch : 'Online actueel/totaal',
				stats : 'Statistieken',
				player : 'Speler',
				alliance : 'Alliantie',
				rankings : 'Ranglijsten',
				track_player : 'Volg een speler',
				track_alliance : 'Volg een alliantie',
				top_killers : 'Top Aanvallers',
				maps : 'Kaart',
				townsearches : 'Stedenzoeker',
				tonda_polissuche : 'Stedenzoeker',
				in_town : 'In stad',
				from_town : 'Uit stad',
				outside_town : 'Buiten stad',
				unit_comparison : 'Unit vergelijking',
				display_modes : 'Weergave',
				full_screen : 'Volledig scherm',
				minimal : 'Minimaal',
				standard : 'Standaard'
			},
			academy : {
				researched : 'Onderzochte technologieën markeren',
				notresearched : 'Niet onderzochte technologieën markeren',
				undo : 'Markeringen opheffen'
			},
			caves : {
				stored_silver : 'Opgeslagen zilverstukken',
				silver_to_store : 'Maximaal op te slaan zilverstukken',
				name : 'Naam',
				wood : 'Hout',
				stone : 'Steen',
				silver : 'Zilverstukken'
			},
			transport_calc : {
				btn_main : 'Rekenmachine',
				available : 'Beschikbare capaciteit',
				transportable : 'Vervoerbare eenheden',
				recruits : 'Eenheden in de rekruteringsrij meetellen',
				outsidetown : 'Eenheden buiten de stad meetellen',
				slowtrans : 'Langzame transportboten meetellen',
				fasttrans : 'Snelle transportboten meetellen'
			},
			culture : {
				cityfestivals : 'Stadsfeest',
				olympicgames : 'Olympische Spelen',
				triumph : 'Zegetocht',
				theater : 'Theatervoorstellingen'
			},
			settings : {
				text2 : 'Onlineteller',
				text3 : 'Links van het menu direct binnen het spel openen',
				text4 : 'Activeer de integratie van andere Greasemonkey scripten in het menu',
				text5 : 'Toon de buttons voor de permanente weergave van de troepen rekrutering, activiteiten en handel',
				text6 : 'Knoppenbalk',
				text9 : 'Bij het opstarten tonen',
				text11 : 'Het opslaan van de totale online tijd afzetten',
				text12 : 'Transport rekenaar',
				text13 : 'Menu weergave',
				text14 : 'Menu functies',
				text15 : 'Rapporten',
				text16 : 'Kleur toevoegen',
				text17 : 'Filter toevoegen',
				text18 : 'Weergave geactiveerd',
				text21 : 'Breedte van het forum maximaliseren',
				text22 : 'Sneltoets afbeelding',
				text23 : 'Grepolis menu',
				text24 : 'Senaat',
				text25 : 'Toon het aantal toegekende punten voor de bouw van een gebouw',
				text26 : 'Handelsvenster',
				text27 : 'Extensie activeren',
				text28 : 'Stad lijst',
				text29 : 'Quest lijst',
				text30 : 'Dropdown lijst met alle mappen toevoegen',
				text31 : 'Button voor de BB-code van de huidige stad',
				text32 : 'Berichten selecteren en verwijderen',
				text34 : 'Grottenoverzicht (Bestuurder)',
				text35 : 'Academie planner',
				text36 : 'Grot',
				text37 : 'Het sorteren van steden mogelijk maken',
				text38 : 'Zilver over 15000 automatisch in het invoerveld toevoegen',
				text40 : 'Boerendorpen overzicht (Kapitein)',
				text41 : 'Een button voor het openen van de stadsoverzicht aan het zijkant menu toevoegen',
				text42 : 'Toon de verloren grondstoffen',
				text44 : 'Eiland overzicht',
				text45 : 'Verhoog de hoogte van de stadslijst en van de boerendorpen',
				text46 : 'Sneltoetsen',
				text47 : 'Gebruik [Enter] als de knop om naar de huidige stad te springen (geen [Spatie])',
				text48 : 'Open het oude stadsoverzicht',
				text49 : 'Sorteer de rapportfolders alfabetisch',
				text51 : 'Verberg steden automatisch na opeisen',
				text52 : 'Stadsoverzicht',
				text53 : 'Laat het stadsoverzicht zien in een scherm',
				other : 'Overige',
				save : 'Opslaan',
				reset : 'Reset instellingen',
				settings : 'Instellingen',
				translations : 'Vertalingen',
				trans_sure : 'Weet u zeker dat uw vertaling klaar is te verzenden?',
				trans_success : 'De vertaling is succesvol verstuurd',
				trans_fail : 'De vertaling kan niet worden verzonden',
				trans_infotext1 : 'De vertaling hoeft niet compleet te zijn - vertaal wat je wilt',
				trans_infotext2 : 'Wanneer een tekst HTML-tags bevat(dus alles dat wordt omgeven door <> haakjes) Vraag ik u om hen te houden waar u ze hebt gevonden.',
				trans_infotext3 : '',
				trans_infotext4 : 'Spammers zullen worden toegevoegd aan de interne banlist en uitgesloten worden van het gebruik van het script.',
				please_note : 'Let op',
				no_translation : 'Geen vertaling gevonden',
				choose_lang : 'Kies een taal',
				add_lang : 'Voer een taal in',
				language : 'Taal',
				enter_lang_name : 'Alstublieft voer een taal in ',
				send : 'Sturen',
				name : 'Naam',
				ingame_name : 'Aarzel niet om mij te contacteren indien u liever genoemd wilt worden door uw ingame naam',
				adfly : 'Wil je ook geld verdienen met links?',
				donations : 'Donaties',
				update_check : 'Controleer op updates'
			},
			bbcode : {
				troops : 'Troepen',
				building : 'Gebouw niveaus',
				cities : 'Steden',
				all : 'Alle',
				active_grp : 'Actieve Stadsgroep',
				in : 'in',
				from : 'van',
				outside : 'buiten',
				messages : 'Berichten'
			},
			stats_scripts : {
				stats_scripts_ov : 'Overzicht over statistieken en scripten'
			},
			googledocs : {
				change_url : 'URL wijzigen'
			},
			farmhelper : {
				autohide_cities : 'Steden automatisch verbergen na farmen aan/af'
			},
			export_window : {
				wnd_title : 'Afbeelding uploaden - voorbeeld',
				button_mouseover : 'Exporteren naar afbeelding',
				settings : 'instellingen',
				preview : 'Voorbeeld',
				town : 'Stad',
				luck : 'Geluk',
				title : 'Titel',
				resources : 'grondstoffen',
				wall : 'Muur',
				player : 'Speler',
				moral : 'Moraal',
				reporttype : 'Rapport type',
				resources_lost : 'verloren grondstoffen',
				nightbonus : 'Nachtbonus',
				alliance : 'Alliantie',
				troops : 'Troepen',
				bashpoints : 'Gevechtspunten',
				buildings : 'Gebouwen',
				date : 'Datum',
				spell_info : 'Spreuk info',
				spell_effect : 'Spreuk effect',
				message : 'Bericht',
				attacker : 'Aanvaller',
				defender : 'Verdediger',
				bonuses : 'Spreuken/bonussen',
				command_type : 'opdracht type',
				town_left : 'Stad (links)',
				town_right : 'Stad (rechts)',
				player_left : 'Speler (Links)',
				player_right : 'Speler (rechts)',
				travel_time : 'Looptijd',
				time_of_arrival : 'Aankomsttijd',
				command : 'Opdracht',
				defeated_atk : 'Verslagen als aanvaller',
				defeated_def : 'Verslagen als verdediger',
				losses_atk : 'Verliezen als aanvaller',
				losses_def : 'Verliezen als verdediger',
				brush_size : 'penseelformaat',
				color : 'Kleur',
				eraser : 'Gum',
				pencil : 'Potlood',
				arrow : 'Pijl',
				rectangel : 'Rechthoek',
				line : 'Lijn',
				arc : 'Boog',
				delete_drawing : 'verwijderen tekening',
				fill : 'vullen'
			},
			colors : {
				black : 'zwart',
				blue : 'blauw',
				red : 'rood',
				green : 'groen',
				yellow : 'geel',
				gray : 'grijs'
			}
		},
		pl : {
			meta : {
				flag : 'http://s7.directupload.net/images/140408/yno6pw5g.png',
				donation_btn : '<a href="http://paypal.me/quacktoolsammlung" target="_blank"><img src="https://www.paypal.com/pl_PL/i/btn/btn_donate_LG.gif" alt="Donate"></a>'
			},
			reports : {
				choose_folder : 'Wybierz folder',
				enacted : 'Rzuciłeś',
				conquered : 'podbiło',
				spying : 'szpieguje',
				spy : 'Szpieg',
				support : 'wsparcie',
				supporting : 'wspiera',
				attacking : 'atakuje',
				farming_village : 'wioskę'
			},
			forum : {
				delete : 'Usunąć',
				delete_sure : 'Czy na pewno chcesz usunąć te posty?',
				no_selection : 'Brak zaznaczonych Postów'
			},
			town_info : {
				no_overload : 'Wybierz i napełnij łódki',
				delete : 'Wyczyść',
				polissuche : 'szukaj miasta',
				inactivity : 'Nieaktywny',
				days : 'dni',
				no_data : 'Gracz jeszcze nie został dodany do bazy'
			},
			grepo_mainmenu : {
				city_view : 'Podgląd miasta',
				island_view : 'Podgląd wyspy'
			},
			messages : {
				ghosttown : 'Opuszczone miasto',
				no_cities : 'Brak miast na tej wyspie',
				all : 'Całość',
				export : 'Zmień wiadomość na BB-Code'
			},
			hotkeys : {
				hotkeys : 'Skróty',
				city_select : 'Wybór miasta',
				last_city : 'Poprzednie miasto',
				next_city : 'Następne miasto',
				jump_city : 'Przejdź do obecnego miasta',
				administrator : 'Zarządca',
				captain : 'Kapitan',
				trade_ov : 'Podgląd handlu',
				command_ov : 'Podgląd poleceń',
				recruitment_ov : 'Podgląd rekrutacji',
				troop_ov : 'Podgląd wojsk',
				troops_outside : 'Wojska poza miastem',
				building_ov : 'Podgląd budynków',
				culture_ov : 'Podgląd kultury',
				gods_ov : 'Podgląd bogów',
				cave_ov : 'Podgląd jaskini',
				city_groups_ov : 'Podglad grupy miast',
				city_list : 'Lista miast',
				attack_planner : 'Planer ataków',
				farming_villages : 'Wioski',
				menu : 'Menu',
				city_view : 'Podgląd miasta',
				messages : 'Wiadomości',
				reports : 'Raporty',
				alliance : 'Sojusz',
				alliance_forum : 'Forum sojuszu',
				settings : 'Ustawienia',
				profile : 'Profil',
				ranking : 'Ranking',
				notes : 'Notatnik',
				chat : 'Czat',
				council : 'Rada Bohaterów'
			},
			qtoolbox : {
				onlinecounter_now : 'Aktualnie',
				onlinecounter_total : 'Całkowicie',
				onlinecounter_switch : 'Czas przed grą: aktualnie/całkowicie',
				stats : 'Statystyki',
				grepostats : 'Grepo Stats',
				player : 'Gracz',
				alliance : 'Sojusz',
				rankings : 'Rankingi',
				grepo_bash : 'Grepo Bash',
				track_player : 'Sledź Gracza',
				track_alliance : 'Sledź Sojusz',
				top_killers : 'Czołowi Agresorzy',
				maps : 'Mapy',
				grepo_maps : 'Grepo Maps',
				grepo_intel : 'Grepo Intel',
				townsearches : 'Szukanie miast',
				grepo_finder : 'Grepo Finder',
				tonda_polissuche : 'Szukanie miasta',
				bb_codes : 'BB-Code',
				in_town : 'W mieście',
				from_town : 'Z miasta',
				outside_town : 'Na zewnątrz miasta',
				tools : 'Narzędzia',
				unit_comparison : 'Porównaj jednostki',
				google_docs : 'Dokumenty Google',
				deff_helper : 'Deff Pomocnik',
				display_modes : 'Wyświetlanie',
				full_screen : 'Pełny ekran',
				minimal : 'Ograniczone',
				standard : 'Standardowe',
				stats_scripts : 'Statystyki/skrypty',
				settings : 'Menadżer skryptu.'
			},
			academy : {
			researched : 'Oznacz kolorem zbadane',
			notresearched : 'Oznacz kolorem nie zbadane',
			undo : 'Cofnij kolory'
			},
			caves : {
				stored_silver : 'Przechowywane srebrne monety',
				name : 'Nazwa',
				wood : 'Drewno',
				stone : 'Kamień',
				silver : 'Srebrne monety'
			},
			transport_calc : {
				btn_main : 'Kalkulator transportu',
				available : 'Dostępna pojemność transporterów',
				transportable : 'Jednostki do przetransportowania',
				recruits : 'Uwzględniaj jednostki w kolejce rekrutacji',
				outsidetown : 'Uwzględniaj jednostki na zewnątrz miasta',
				slowtrans : 'Uwzględniaj szybkie łodzie',
				fasttrans : 'Uwzględniaj wolne łodzie',
				disabled : 'Tymczasowo nieaktywne'
			},
			culture : {
				cityfestivals : 'Festyn miejski',
				olympicgames : 'Igrzyska Olimpijskie',
				triumph : 'Pochód triumfalny',
				theater : 'Występy teatralne'
			},
			settings : {
				text2 : 'Licznik czasu on-line',
				text3 : 'Otwieraj linki z menu w grze',
				text4 : 'Aktywuj działanie innych skryptów Greasmonkey w menu',
				text5 : 'Pokaż przyciski stałego wyświetlania się kolejki rekrutacji, ruchów i handlu',
				text6 : 'Pasek przycisków',
				text9 : 'Pokaż podczas startu',
				text11 : 'Dezaktywuj zapisywanie całkowitego czasu on-line',
				text12 : 'Kalkulator transportowców',
				text13 : 'Wygląd Menu',
				text14 : 'Opcje Menu',
				text15 : 'Raporty',
				text16 : 'Dodaj kolor',
				text17 : 'Dodaj filtr',
				text18 : 'Aktywuj podgląd',
				text19 : 'Usunąć wszystkie ustawienia i obecność skryptu w pamięci cache przeglądarki?',
				text20 : 'Forum',
				text21 : 'Zmaksymalizuj szerokość forum',
				text22 : 'Ikonka skrótów',
				text23 : 'Menu Grepolis',
				text24 : 'Senat',
				text25 : 'Pokaż liczbę punktów przyznaną za zbudowanie następnego poziomu budynku',
				text26 : 'Okno handlu',
				text27 : 'Aktywuj przedłużanie',
				text28 : 'Lista miast',
				text29 : 'Lista zadań',
				text30 : 'Dodaj wyskakującą listę w folderach',
				text31 : 'Guzik z kodem BB-code aktualnego miasta',
				text32 : 'Zaznaczanie i usuwanie postów',
				text34 : 'Podgląd jaskiń (Zarządca)',
				text35 : 'Pomocnik badań w akademi',
				text36 : 'Jaskinia',
				text37 : 'Możliwość sortowania miast',
				text38 : 'Wstaw automatycznie w pole wpisywania srebro powyżej 15000',
				text40 : 'Podgląd wiosek (Kapitan)',
				text41 : 'Dodaj guzik "Podgląd Miasta" do menu',
				text42 : 'Pokaż straty surowców',
				text43 : 'Symulator',
				text44 : 'Podgląd wyspy',
				text45 : 'Powiększ listę miast i wiosek w podglądzie wyspy',
				text46 : 'Skróty klawiszowe',
				text47 : 'Użyj [Enter] jako klawisz przełączania do obecnego miasta (nie [Space])',
				text48 : 'Otwieraj podgląd miasta w starym stylu',
				text49 : 'Segreguj foldery raportów według alfabetu',
				text51 : 'Autoukrywanie miast po zebraniu surowców z wiosek',
				text52 : 'Podgląd miasta',
				text53 : 'Wyświetl podgląd miasta w oknie',
				other : 'Inne',
				save : 'Zapisz',
				reset : 'Zresetuj ustawienia',
				contact : 'Kontakt',
				info : 'Informacja',
				settings : 'Ustawienia',
				translations : 'Tłumaczenia',
				trans_sure : 'Czy jesteś pewien że twoje tłumaczenie jest gotowe do wysłania?',
				trans_success : 'Tłumaczenie zostało wysłane',
				trans_fail : 'Tłumaczenie nie może zostać wysłane',
				trans_infotext1 : 'Tłumaczenie nie musi być kompletne - po prostu tłumacz co chcesz',
				trans_infotext2 : 'Jeżeli tekst zawiera tagi HTML (czyli wszystko co jest zawarte w <> klamrach) proszę ich nie usuwać ani nie modyfikować',
				trans_infotext3 : 'Aby móc dodać cię do listy tłumaczących, twoja nazwa gracza, identyfikator gracza i kraju/świata zostanie przekazany automatycznie',
				trans_infotext4 : 'Spamerzy będą banowani i dodawani do czarnej listy',
				please_note : 'Proszę się zapoznać',
				credits : 'Dotychczasowi tłumaczący',
				no_translation : 'Nie odnaleziono tłumaczenia',
				choose_lang : 'Wybierz język',
				add_lang : 'Dodaj nowy jęzzyk',
				language : 'Język',
				enter_lang_name : 'Proszę podać nazwę języka',
				send : 'Wyślij',
				name : 'Nazwa',
				ingame_name : 'Nie wahaj się ze mną skontaktować, jeśli wolisz być nazywany tak jak w grze',
				adfly : 'Czy chcesz zarabiać także pieniądze na linkach?',
				donations : 'Darowizny',
				update_check : 'Sprawdź czy jest nowsza wersja'
			},
			bbcode : {
				troops : 'Jednostki',
				building : 'Poziomy budynków',
				cities : 'Miasta',
				all : 'Wszystkie',
				active_grp : 'Aktywna grupa miast',
				in : 'w',
				from : 'z',
				outside : 'na zewnątrz',
				messages : 'Wiadomości'
			},
			stats_scripts : {
				stats_scripts_ov : 'Podgląd statystyk i skryptów'
			},
			googledocs : {
				change_url : 'Zmień URL',
				reset : 'Resetuj'
			},
			farmhelper : {
				autohide_cities : 'Autoukrywanie miast po zebraniu surowców z wiosek rolniczych wł/wył'
			}
		},
		pt : {
			meta : {
				flag : 'http://fs1.directupload.net/images/150205/37p8cy33.png',
			},
			reports : {
				choose_folder : 'Escolha pasta',
				enacted : 'Aprovada',
				conquered : 'Conquistada',
				spying : 'a espiar',
				spy : 'Espião',
				support : 'suporte',
				supporting : 'a suportar',
				attacking : 'a atacar',
				farming_village : 'A pilhar a cidade'
			},
			forum : {
				delete : 'Eliminar',
				delete_sure : 'Queres mesmo eliminar este comentário?',
				no_selection : 'Sem comentários seleccionados'
			},
			town_info : {
				no_overload : 'Sem sobrecarga',
				delete : 'Eliminar',
				polissuche : 'pesquisa de cidade',
				inactivity : 'Inactividade',
				days : 'dias',
				no_data : 'Este jogador não consta na base de dados'
			},
			grepo_mainmenu : {
				city_view : 'Vista da cidade',
				island_view : 'Vista da ilha'
			},
			messages : {
				ghosttown : 'Cidade Fantasma',
				no_cities : 'Sem cidades nest ilha',
				all : 'todas',
				export : 'Converter mensagem em BB-Code'
			},
			hotkeys : {
				hotkeys : 'Teclas de atalho',
				city_select : 'Seleção de cidade',
				last_city : 'Última cidade',
				next_city : 'Próxima cidade',
				jump_city : 'Ir para a cidade actual',
				administrator : 'Administrador',
				captain : 'Capitão',
				trade_ov : 'Troca',
				command_ov : 'Comandos',
				recruitment_ov : 'Recrutar',
				troop_ov : 'Resumo de tropas',
				troops_outside : 'Tropas fora',
				building_ov : 'Edificios',
				culture_ov : 'Cultura',
				gods_ov : 'Deuses',
				city_groups_ov : 'Grupos de cidades',
				city_list : 'Lista de cidades',
				attack_planner : 'Planear ataques',
				farming_villages : 'Pilhar cidades',
				city_view : 'Vista de cidade',
				messages : 'Mensagens',
				reports : 'Reportes',
				alliance : 'Aliança',
				alliance_forum : 'Forum da aliança',
				settings : 'Definições',
				profile : 'Perfil',
				notes : 'Notas',
				council : 'Concelho dos herois'
			},
			qtoolbox : {
				onlinecounter_now : 'Actual',
				onlinecounter_switch : 'Actualmente online/total',
				stats : 'Estatísticas',
				player : 'Jogador',
				alliance : 'Aliança',
				track_player : 'Localizar um jogador',
				track_alliance : 'Localizar uma aliança',
				maps : 'Mapas',
				townsearches : 'Pesquisa de cidades',
				in_town : 'Na cidade',
				from_town : 'Da cidade',
				outside_town : 'Fora da cidade',
				tools : 'Ferramentas',
				unit_comparison : 'Comparação de unidades',
				minimal : 'Minimo'
			},
			academy : {
				researched : 'Colorir a pesquisa',
				notresearched : 'Colorir não pesquisado',
				undo : 'Repor cor'
			},
			caves : {
				stored_silver : 'Moedas de prata armazenadas',
				silver_to_store : 'Moedas de prata que podem ser armazenadas',
				name : 'Nome',
				wood : 'Madeira',
				stone : 'Pedra',
				silver : 'Moedas de prata'
			},
			transport_calc : {
				btn_main : 'Calculadora de transporte',
				available : 'Capacidade de transporte disponivel',
				transportable : 'Unidades transportáveis',
				recruits : 'Contar de unidade em fila de recrutamento',
				outsidetown : 'Contador de unidades fora da cidade',
				slowtrans : 'Contador de navios de transporte lentos',
				fasttrans : 'Contador de navios de transporte rápidos',
				disabled : 'Temporariamente desativado'
			},
			culture : {
				cityfestivals : 'Festivais Urbanos',
				olympicgames : 'Jogos olímpicos',
				triumph : 'Desfile da victória',
				theater : 'Peças de teatro'
			},
			settings : {
				text2 : 'Contador online',
				text3 : 'Abrir links pelo menu de jogo',
				text4 : 'Activar a inclusão de outros scripts do greasemonkey no menu.',
				text5 : 'Mostra botões permanentemente para fila de unidades, movimentos e trocas',
				text6 : 'Barra de botões',
				text9 : 'Mostrar ao inicio',
				text11 : 'Desactivar registo do tempo total online',
				text12 : 'Calculadora de transporte',
				text13 : 'Menu de visualização',
				text14 : 'Menu de caracteristicas',
				text15 : 'Reportes',
				text16 : 'Adicionar cor',
				text17 : 'Adicionar filtro',
				text18 : 'Activar vista',
				text19 : 'Eliminar todas as definições e configurações do script no cache do browser',
				text20 : 'Forum ',
				text21 : 'Maximizar a largura do forum',
				text22 : 'Imagem das teclas de atalho',
				text23 : 'Menu Grepolis',
				text24 : 'Senado',
				text25 : 'Mostrar o número de pontos creditados pela construção do próximo nível deste edificio',
				text26 : 'Janela de troca',
				text27 : 'Activar extensão',
				text28 : 'Lista de cidades',
				text29 : 'Lista de missões',
				text30 : 'Adicionar lista suspensa com as suas pastas',
				text31 : 'Botão para o BB-code da cidade actual',
				text32 : 'Selecionar e eliminar posts',
				text34 : 'Visão de caves (Administrador)',
				text35 : 'Planeamento da academia',
				text37 : 'Permitir alinhar cidades',
				text38 : 'Colocar prata acima de 15000 automaticamente no campo de input',
				text40 : 'Vista das aldeias de pilhagem (Capitão)',
				text41 : 'Adicionar botão para abrir a vista de cidade no menu lateral do Grepolis',
				text42 : 'Mostrar as perdas de recursos',
				text43 : 'Simulador',
				text44 : 'Vista de ilha',
				text45 : 'Aumentar a altura da lista de cidades e da lista de aldeias de pilhagem',
				text46 : 'Teclas de atalho',
				text47 : 'Usar [Enter] como o botão para retornar à cidade actual (não [Space])',
				text48 : 'Abrir a vista de cidade antiga',
				text49 : 'Ordem pastas de reporte alfabeticamente',
				text50 : 'Mostrar a seta de missões',
				text51 : 'Esconder automaticamente cidades depois de ',
				text52 : 'Vista de cidade',
				text53 : 'Mostrar a vista de cidade numa janela',
				other : 'Outro',
				save : 'Guardar',
				reset : 'Repor definições',
				contact : 'Contacto',
				info : 'Informação',
				settings : 'Definições',
				translations : 'Traduções',
				trans_sure : 'Tem a certeza que a tradução está pronta para enviar?',
				trans_success : 'Tradução enviada com sucesso',
				trans_fail : 'A tradução não pode ser enviada',
				trans_infotext1 : 'A tradução não tem de ser completa. Traduza apenas o que pretender',
				trans_infotext2 : 'Quando um texto tem tags HTML (ou seja, tudo o que está ente <> parêntesis) eu peço que os mantenhas como os encontraste.',
				trans_infotext3 : 'De forma a colocá-lo nos créditos o seu nome, ID de jogador e mundo serão igualmente transmitidos',
				trans_infotext4 : 'Spammers serão adicionados à lista interna e bloqueado o uso do script',
				please_note : 'Por favor repare',
				credits : 'Créditos',
				no_translation : 'Tradução não encontrada',
				choose_lang : 'Escolher lingua',
				add_lang : 'Adicionar nova lingua',
				language : 'Linguagem',
				enter_lang_name : 'Por favor indica a linguagem',
				send : 'Enviar',
				name : 'Nome',
				ingame_name : 'Não hesite em contactar-me se preferir ser tratado pelo seu nome de jogo',
				adfly : 'Também quer ganhar dinheiro com links?',
				donations : 'Doações',
				update_check : 'Verificar updates',
				prologue : 'Devido à falta de alternativas de userscripts para Grepolis 2.0 deste conjunto de ferramentas foi iniciado há dois anos e constantemente tenta estender Grepolis com novas funções desde então.<p />Inicialmente, o objetivo era o de reparar as funções de userscripts velhos para Grepolis 1.0 e para aprender os conceitos básicos de JavaScript no processo, mas por agora, muito mais tem sido realizado. O conjunto de ferramentas é constantemente melhorado por nossas próprias idéias ou idéias da comunidade, por causa do seu grande apoio a minha motivação para continuar ainda está lá. Você apresenta constantemente desafios interessantes e é divertido para encontrar soluções para isso.<p />Como se trata de uma grande quantidade de trabalho que pode ser muito Eu sou sempre muito grato por qualquer tipo de apoio demorado. Portanto, eu gostaria de agradecer a todos que ofereceram apoio para este projeto - seja através de doações ou clicando em um AdFly-Link, o conhecimento, a criatividade, relatórios de bugs ou apenas algumas palavras de incentivo.'
			},
			bbcode : {
				troops : 'Tropas',
				building : 'Nível de edificios',
				cities : 'Cidades',
				all : 'Todos',
				active_grp : 'Grupo de cidades activo',
				in : 'no',
				from : 'de',
				outside : 'Fora de',
				messages : 'Mensagens'
			},
			stats_scripts : {
				stats_scripts_ov : 'Rever estados e scriots'
			},
			googledocs : {
				change_url : 'Mudar URL'
			},
			farmhelper : {
				autohide_cities : 'Auto Hide Farming Villages after farming or looting on/off'
			},
			export_window : {
				wnd_title : 'Revisão do upload da imagem',
				button_mouseover : 'Exportar para imagem',
				upload : ' Upload',
				settings : 'Definições',
				preview : 'Rever',
				chrome : 'O Chrome abre por predefinição a janela com o screenshot como um pop-up. Se preferir que a janela abra como uma nova tab tem de instalar um addon Extra. Clique aqui para obter o addon',
				info : 'O provedor de hospedagem, infelizmente, permite  apenas 1.250 uploads diariamente. Eles vão proibir este serviço para o resto do mês, se eu exceder esse valor 5 vezes. No longo prazo, eu pretendo alugar um servidor próprio para isso, mas os custos e o desenvolvimento precisam de algum tempo e, acima de tudo dinheiro. Eu invisto meu tempo livre para isso com prazer, mas como um estudante Eu simplesmente não pode pagar todos os custos envolvidos. Como alternativa , uso os sponsorlinks de Adf.ly (apenas para a primeira imagem publicada). Com um clique neste botão informação você será redirecionado para a página oficial de doação Paypal deste script. Obrigado a todos que já apoiam este projecto e para aqueles que pretendem fazê-lo.',
				connection_fail_text : 'Conexão com o servidor falhou. O servidor não está contactável ou a capacidade de alojamento foi alcançada para hoje (1250 imagens por dia / 50 imagens por utilizador)',
				town : 'Cidade',
				luck : 'Sorte',
				title : 'Titulo',
				resources : 'Recursos',
				wall : 'Parede',
				player : 'Jogador',
				moral : ' Moral',
				reporttype : 'Tipo de reporte',
				resources_lost : 'Recursos perdidos',
				nightbonus : 'Bónus nocturno',
				alliance : 'Aliança',
				troops : 'Tropas',
				bashpoints : 'Pontos de batalha',
				buildings : 'Edificios',
				payed_iron : 'Ferro pago',
				payed_iron_storage : 'Ferro no armazém',
				date : 'Data',
				spell_info : 'Informação sobre o feitiço',
				spell_effect : 'Resultado do feitiço',
				message : 'Mensagem',
				attacker : 'Atacante',
				defender : 'Defensor',
				bonuses : 'Feitiço/bonus',
				command_type : 'Tipo de comando',
				town_left : 'Cidade (esquerda)',
				town_right : 'Cidade (direita)',
				player_left : 'Jogador (esquerda)',
				player_right : 'Jogador (direita)',
				travel_time : 'Tempo de viagem',
				time_of_arrival : 'Tempo de chegada',
				command : 'Comando',
				defeated_atk : 'Derrotado como atacante',
				defeated_def : 'Derrotado como defensor',
				losses_atk : 'Perdas como atacante',
				losses_def : 'Perdas como defensor',
				brush_size : 'Tamanho da escova',
				color : 'Cor',
				eraser : 'Borracha',
				pencil : 'Lápis',
				arrow : 'Seta',
				rectangel : 'Rectangulo',
				line : 'Linha',
				arc : 'Curva',
				delete_drawing : 'Eliminar desenho',
				fill : 'Preencher'
			},
			colors : {
				black : 'Preto',
				blue : 'azul',
				red : 'vermelho',
				green : 'verde',
				yellow : 'amarelo',
				gray : 'cinzento'
			},
			command_ov : {
				commands : 'Comandos'
			}
		},
		ro : {
			meta : {
				flag : 'http://s1.directupload.net/images/140818/uqbqdqcf.png',
			},
			reports : {
				choose_folder : 'Alege un folder',
				enacted : 'decretat',
				conquered : 'cucerit',
				spying : 'spionaj',
				spy : 'Spion',
				support : 'suport',
				supporting : 'sprijinire',
				attacking : 'ataca',
				farming_village : 'sat de farmat'
			},
			forum : {
				delete : 'Sterge',
				delete_sure : 'Esti sigur ca vrei sa stergi acest post?',
				no_selection : 'Nici un post selectat'
			},
			town_info : {
				no_overload : 'Nu supraincarcati',
				delete : 'Sterge',
				polissuche : 'cautare oras',
				inactivity : 'Inactivitate',
				days : 'zile',
				no_data : 'Acest jucator nu este inca listat in baza de date'
			},
			grepo_mainmenu : {
				city_view : 'Vezi Oras',
				island_view : 'Vezi Insula'
			},
			messages : {
				ghosttown : 'Oras fantoma',
				no_cities : 'Nici un oras pe aceasta insula',
				all : 'toate',
				export : 'Converteste mesajul in BB-Code'
			},
			hotkeys : {
				hotkeys : 'Taste',
				city_select : 'Selectare oras',
				last_city : 'Ultimul oras',
				next_city : 'Urmatorul oras',
				jump_city : 'Salt la orasul curent',
				captain : 'Capitan',
				trade_ov : 'Negot',
				command_ov : 'Comenzi',
				recruitment_ov : 'Recrutare',
				troop_ov : 'Privire de ansamblu a trupelor',
				troops_outside : 'Trupe din afara orasului',
				building_ov : 'Constructii',
				culture_ov : 'Cultura',
				gods_ov : 'Zei',
				cave_ov : 'Pesteri',
				city_groups_ov : 'Grupe orase',
				city_list : 'Lista orase',
				attack_planner : 'Planificator atacuri',
				farming_villages : 'Sate de farmat',
				menu : 'Meniu',
				city_view : 'Vezi oras ',
				messages : 'Mesaje',
				reports : 'Rapoarte',
				alliance : 'Alianta',
				alliance_forum : 'Forum Alianta',
				settings : 'Setari',
				profile : 'Profil',
				ranking : 'Clasament',
				notes : 'Notite',
				council : 'Consiliul eroilor'
			},
			qtoolbox : {
				onlinecounter_now : 'Curent',
				onlinecounter_switch : 'Online curent/total',
				stats : 'Statistici',
				player : 'Jucator',
				alliance : 'Alianta',
				rankings : 'Clasament',
				track_player : 'Urmareste un jucator',
				track_alliance : 'Urmareste o alianta',
				top_killers : 'Top ucigasi/asasini',
				maps : 'Mape',
				tonda_polissuche : 'Cautare oras',
				in_town : 'In oras',
				from_town : 'Din oras',
				outside_town : 'In afara orasului',
				tools : 'Instrumente',
				unit_comparison : 'Comparare unitati',
				google_docs : 'Documente Google',
				deff_helper : 'Ajutator Deff',
				display_modes : 'Modul Afisaj',
				full_screen : 'Tot ecranul',
				minimal : 'Minim',
				stats_scripts : 'Statistici/Scripturi',
				settings : 'Manager script'
			},
			academy : {
				researched : 'Colorati cercetarea',
				notresearched : 'Nu colorati cercetarea',
				undo : 'Anulare colorare'
			},
			caves : {
				stored_silver : 'Monede de argint stocate',
				silver_to_store : 'Monede de argint ce pot fi stocate',
				name : 'Nume',
				wood : 'Lemn',
				stone : 'Piatra',
				silver : 'Monede de argint '
			},
			transport_calc : {
				btn_main : 'Calculator transport',
				available : 'Capacitate de transport disponibila',
				transportable : 'Unitati transportabile',
				recruits : 'Numar unitati in asteptare de recrutare',
				outsidetown : 'Numar unitati din afara orasului',
				slowtrans : 'Numar transportoare incete',
				fasttrans : 'Numar transportoare rapide',
				disabled : 'Temporar scos din uz '
			},
			culture : {
				cityfestivals : 'Festival oras',
				olympicgames : 'Jocuri olimpice',
				triumph : 'Parada triumfala',
				theater : 'Piese de teatru'
			},
			settings : {
				text2 : 'Contrare Online',
				text3 : 'Deschide linkurile din meniul in joc',
				text4 : 'Activati includerea altor scripturi Greasemonkey in meniu',
				text5 : 'Arata butoanele pentru afisarea permanenta a unitatilor in asteptare, miscarile si comertul',
				text6 : 'Buton bara',
				text9 : 'Afisaj la pornire',
				text11 : 'Dezactiveaza economisirea din totalul timp online',
				text12 : 'Calculator de transport',
				text13 : 'Meniu afisaj',
				text14 : 'Caracteristici meniu ',
				text15 : 'Reporturi',
				text16 : 'Adauga culoare',
				text17 : 'Adauga filtru',
				text18 : 'Activeaza afisaj',
				text19 : 'Stergi toate setarile si urmele ale scripturilor in ascunzatoarea browserului?',
				text21 : 'Maximizati latimea forumului ',
				text22 : 'Taste imagine',
				text23 : 'Meniu grepolis',
				text24 : 'Senat',
				text25 : 'Arata numarul de puncte primite din constructia urmatorului nivel al cladiri',
				text26 : 'Fereastra de negot',
				text27 : 'Activeaa extensia',
				text28 : 'Lista orase',
				text29 : 'Lista misiuni',
				text30 : 'Adauga o lista verticala cu foldere',
				text31 : 'Buton pentru BB-Code a orasului curent',
				text32 : 'Selecteaza si sterge posturi',
				text34 : 'Privire de ansamblu asupra pesterilor(Administrator)',
				text35 : 'Planificator academie',
				text36 : 'Pestera',
				text37 : 'Permite sortarea oraselor',
				text38 : 'Introdu 1500 monede de argint automat in campul selectat',
				text40 : 'Privire de ansamblu a satelor de farmat(Captain)',
				text41 : 'Adauga buton pentru deschiderea "vezi orasul" in meniul lateral al Grepolisului ',
				text42 : 'Arata resurse pierdute',
				text44 : 'Privire ansamblu insula',
				text45 : 'Mareste inaltimea listei orasele si lista de orase farmat',
				text46 : 'Taste',
				text47 : 'Foloseste [ENTER] ca buton pentru a sari la orasul curent',
				text48 : 'Deschide vechiul "vezi orasul"',
				text49 : 'Sorteaza alfabetiv foldere de report',
				text50 : 'Afiseaza sageata misiune',
				text51 : 'Ascunde automat orasele dupa farmat',
				text52 : 'Vezi oras',
				text53 : 'Afiseaza vederea orasului in fereastra',
				other : 'Altele',
				save : 'Salveaza ',
				reset : 'Reseteaza salvarile',
				info : 'Informatii',
				settings : 'Setari',
				translations : 'Traduceri',
				trans_sure : 'Esti sigur ca traducerea ta este gata sa fie trimisa?',
				trans_success : 'Traducerea a fost trimis cu succes',
				trans_fail : 'Traducerea nu a putut fi trimisa',
				trans_infotext1 : 'Traducerea nu trebuie sa fie completa, doar traduce ce vrei tu',
				trans_infotext4 : 'Spammeri vor fi adaugati in lista de blocare si vor fi exclusi din a utiliza acest script',
				please_note : 'Nota',
				credits : 'Credite',
				no_translation : 'Nici o traducere gasita',
				choose_lang : 'Alege o limba',
				add_lang : 'Adauga o noua limba',
				language : 'Limba',
				enter_lang_name : 'Introdu numele limbii',
				send : 'Trimite',
				name : 'Nume',
				ingame_name : 'Nu ezita sa ma contactezi daca preferi sa fi numit dupa numele de joc',
				adfly : 'Vrei sa castigi bani cu linkuri de asemenea?',
				donations : 'Donatii',
				update_check : 'Cautate update'
			},
			bbcode : {
				troops : 'Trupe',
				building : 'Nivel cladire',
				cities : 'Orase',
				all : 'Toate',
				active_grp : 'grupa oras activ',
				from : 'din',
				outside : 'in afara',
				messages : 'Mesaje'
			},
			stats_scripts : {
				stats_scripts_ov : 'Prezentare generala a statisticilor si scripturilor'
			},
			googledocs : {
				change_url : 'Schimba URL',
				reset : 'Resetare'
			},
			farmhelper : {
				autohide_cities : 'Ascundere automata a oraselor dupa farmaj pornire/oprire '
			}
		},
		ru : {
			meta : {
				flag : 'http://s1.directupload.net/images/140408/7bsp2aye.png',
				donation_btn : '<a href="http://paypal.me/quacktoolsammlung" target="_blank"><img src="https://www.paypal.com/ru_RU/i/btn/btn_donate_LG.gif" alt="Donate"></a>'
			},
			reports : {
				choose_folder : 'Выбрать каталог',
				enacted : 'принятый',
				conquered : 'завоеванный',
				spying : 'шпионаж',
				spy : 'шпион',
				support : 'поддержка',
				supporting : 'поддерживающий',
				attacking : 'атакующий',
				farming_village : 'селения'
			},
			forum : {
				delete : 'Удалить',
				delete_sure : 'Вы действительно хотите удалить эти сообщения?',
				no_selection : 'Сообщения не выбраны'
			},
			town_info : {
				no_overload : 'Нет перезагрузки',
				delete : 'Удалить',
				polissuche : 'Поиск города',
				inactivity : 'Бездействие',
				days : 'Дни',
				no_data : 'Игрок не найден в базе данных'
			},
			grepo_mainmenu : {
				city_view : 'Обзор города',
				island_view : 'Обзор острова'
			},
			messages : {
				ghosttown : 'Город-призрак',
				no_cities : 'На этом острове нет городов',
				all : 'Все',
				export : 'Конвертировать сообщение в BB-Код'
			},
			hotkeys : {
				hotkeys : 'Горячие клавиши',
				city_select : 'Выбор города',
				last_city : 'Последний город',
				next_city : 'Следующий город',
				jump_city : 'Переход к текущему городу',
				administrator : 'Администратор',
				captain : 'Капитан',
				trade_ov : 'Обзор торговли',
				command_ov : 'Обзор приказов',
				recruitment_ov : 'Обзор вербовок',
				troop_ov : 'Обзор войск',
				troops_outside : 'Войска вне города',
				building_ov : 'Обзор зданий',
				culture_ov : 'Обзор культуры',
				gods_ov : 'Обзор богов',
				cave_ov : 'Обзор пещер',
				city_groups_ov : 'Обзор групп городов',
				city_list : 'Список городов',
				attack_planner : 'Планировщик',
				farming_villages : 'Селения земледельцев',
				menu : 'Меню',
				city_view : 'Обзор города',
				messages : 'Сообщения',
				reports : 'Отчеты',
				alliance : 'Союз',
				alliance_forum : 'Форум Союза',
				settings : 'Настройки',
				profile : 'Профиль',
				ranking : 'Рейтинг',
				notes : 'Заметки',
				chat : 'Чат',
				council : 'Совет героев'
			},
			qtoolbox : {
				onlinecounter_now : 'Текущий',
				onlinecounter_total : 'Общий',
				onlinecounter_switch : 'Онлайн текущий/всего',
				stats : 'Статистика',
				grepostats : 'Grepo Статистика',
				player : 'Игрок',
				alliance : 'Союз',
				rankings : 'Рейтинг',
				track_player : 'Следить за игроком',
				track_alliance : 'Следить за Альянсом',
				top_killers : 'Топ атакеров',
				maps : 'Карты',
				grepo_maps : 'Grepo Карты',
				townsearches : 'Поисковик городов',
				grepo_finder : 'Grepo Поисковик',
				tonda_polissuche : 'Поиск городов',
				bb_codes : 'ББ-коды',
				in_town : 'В городе',
				from_town : 'Из города',
				outside_town : 'Вне города',
				tools : 'Инструменты',
				unit_comparison : 'Сравнение юнитов',
				google_docs : 'Google Документы',
				deff_helper : 'Deff помощник',
				display_modes : 'Режим экрана',
				full_screen : 'Полный экран',
				minimal : 'Минимализированный',
				standard : 'Стандартный',
				stats_scripts : 'Разработчики/Скрипты',
				settings : 'Менеджер скриптов'
			},
			academy : {
				researched : 'Выделить изученное',
				notresearched : 'Выделить неизученное',
				undo : 'Отменить выделение'
			},
			caves : {
				stored_silver : 'Встроенные cереб. монеты',
				name : 'название',
				wood : 'древесина',
				stone : 'камень',
				silver : 'Сереб. монеты'
			},
			transport_calc : {
				btn_main : 'Калькулятор транспорта',
				available : 'Доступная вместимость транспорта',
				transportable : 'Перевозимые юниты',
				recruits : 'Подсчитать юнитов в очереди обучения',
				outsidetown : 'Подсчитать юнитов вне города',
				slowtrans : 'Подсчитать медленных транспортных юнитов',
				fasttrans : 'Подсчитать быстрых транспортных юнитов'
			},
			culture : {
				cityfestivals : 'Фестиваль',
				olympicgames : 'Олимпийские игры',
				triumph : 'Шествие',
				theater : 'Представление'
			},
			settings : {
				text2 : 'Время онлайн',
				text3 : 'Открыть ссылки в окне игры',
				text4 : 'Активируйте включение других скриптов в меню.',
				text5 : 'Постоянно показывать кнопки Очереди стройки юнитов, передвижения и торговли',
				text6 : 'Меню кнопок',
				text9 : 'Показывать при запуске',
				text12 : 'Калькулятор транспорта',
				text13 : 'Показывать меню',
				text14 : 'Список функций',
				text15 : 'Отчеты',
				text16 : 'Добавить цвет',
				text17 : 'Добавить фильтр',
				text18 : 'Включить на весь экран',
				text19 : 'Удалить все настройки скрипта из кеша браузера?',
				text20 : 'Форум',
				text21 : 'Увеличить размер форума',
				text22 : 'Значок "Быстрых клавиш"',
				text23 : 'Меню Grepolis',
				text24 : 'Сенат',
				text25 : 'Показать количество очков, нужных для постройки следующего уровня здания',
				text26 : 'Окно торговли',
				text27 : 'Активировать дополнение',
				text28 : 'Список городов',
				text29 : 'Список заданий',
				text30 : 'Добавить выпадающий список с вашими папками',
				text31 : 'BB-code текущего города',
				text32 : 'Выбрать и удалить сообщения форума',
				text34 : 'Обзор пещеры (Администратор)',
				text35 : 'Академия планированию',
				text36 : 'Пещера',
				text37 : 'Разрешить сортировку городов',
				text38 : 'Поместить 15000 серебра автоматически в поле ввода',
				text40 : 'Обзор селений земледельцев (Капитан)',
				text41 : 'Добавить кнопку для открытия Обзора города в подменю Grepolis',
				text42 : 'Показать потерянные ресурсы',
				text43 : 'Симулятор',
				text44 : 'Обзор острова',
				text46 : 'Быстрые клавиши',
				text47 : 'Использовать клавишу [Enter] для перехода к текущему городу. (не [Пробел])',
				text48 : 'Открыть старый вид Обзора города',
				text49 : 'Сортировать папки отчетов в алфавитном порядке',
				text52 : 'Обзор города',
				other : 'Другое',
				save : 'Сохранить',
				reset : 'Сброс настроек',
				contact : 'контакт',
				info : 'информация',
				settings : 'Настройки',
				translations : 'Переводы',
				trans_sure : 'Вы уверены? Ваша версия перевода будет отослана разработчику.',
				trans_success : 'Версия перевода успешно отправлена.',
				trans_fail : 'Отправка перевода не удалась.',
				trans_infotext1 : 'Данная версия перевода неполная - при желании можете перевести.',
				trans_infotext2 : 'Текст кода содержит HTML (всё, заключенное в угловые скобки <> прошу не изменять)',
				trans_infotext3 : 'Дабы добавить вас в Титры, ваш никнейм и игровой мир будут переданы разработчику.',
				trans_infotext4 : 'Спамеры будут добавлены в Черный список и их внесенные данные в код скрипта, будут удалены.',
				credits : 'Помощники проекта:',
				no_translation : 'Перевод не найден.',
				choose_lang : 'Выбор языка',
				add_lang : 'Добавить новый язык',
				language : 'Язык',
				enter_lang_name : 'Укажите название языка',
				send : 'Послать',
				name : 'Имя',
				ingame_name : 'Не стесняйтесь обращаться ко мне, чтобы я указал ваш игровой ник.',
				adfly : 'Вы хотите заработать деньги по ссылкам?',
				donations : 'Пожертвования',
				update_check : 'Проверить обновление',
				prologue : 'В связи с отсутствием подобных скриптов на userscripts.org для Grepolis 2.0. Два года назад была начата разработка данного скрипта. Скрипт постоянно пополняется новыми функциями и дополнениями.<p />Я благодарен игрокам за советы и идеи, они дают мне силы работать дальше. К сожалению, проект отнимает очень много времени, поэтому я буду рад любой поддержке.<p />Я хочу поблагодарить всех, кто помогал проекту, будь то Пожертвования или ссылки AdFly-Link, советы, отчеты с ошибками или просто добрые слова в мой адрес.'
			},
			bbcode : {
				troops : 'Войска',
				building : 'Уровень зданий',
				cities : 'Города',
				all : 'все',
				active_grp : 'Активная группа городов',
				in : 'в',
				from : 'из',
				outside : 'вне',
				messages : 'Сообщения'
			},
			stats_scripts : {
				stats_scripts_ov : 'Обзор статистики и скриптов'
			},
			googledocs : {
				change_url : 'Изменить URL',
				reset : 'Сброс'
			}
		},
		en : {
			meta : {
				flag : 'http://s14.directupload.net/images/140408/e2nfyth9.png',
				changelog : 'http://adf.ly/1F7F0A',
				forumlink : 'http://adf.ly/fJDMD',
				forumlink_addfree : 'http://forum.en.grepolis.com/showthread.php?51999',
				donation_btn : '<a href="http://paypal.me/quacktoolsammlung" target="_blank"><img src="https://www.paypal.com/en_US/i/btn/btn_donate_LG.gif" alt="Donate"></a>',
				unitscalculator : 'http://en.grepolisqt.de/grepolis-units-calculator/'
			},
			reports : {
				choose_folder : 'Choose folder',
				enacted : 'enacted',
				conquered : 'conquered',
				spying : 'spying',
				spy : 'Spy',
				support : 'support',
				supporting : 'supporting',
				attacking : 'attacking',
				farming_village : 'farming village'
			},
			forum : {
				delete : 'Delete',
				delete_sure : 'Do you really want to delete these posts?',
				no_selection : 'No posts selected'
			},
			town_info : {
				no_overload : 'No overloading',
				delete : 'Delete',
				polissuche : 'town search',
				inactivity : 'Inactivity',
				days : 'days',
				no_data : 'This player is not listed in the database'
			},
			grepo_mainmenu : {
				city_view : 'City view',
				island_view : 'Island view'
			},
			messages : {
				ghosttown : 'Ghost town',
				no_cities : 'No cities on this island',
				all : 'all',
				export : 'Convert message into BB-Code'
			},
			hotkeys : {
				hotkeys : 'Hotkeys',
				city_select : 'City selection',
				last_city : 'Last city',
				next_city : 'Next city',
				jump_city : 'Jump to current city',
				administrator : 'Administrator',
				captain : 'Captain',
				trade_ov : 'Trade',
				command_ov : 'Commands',
				recruitment_ov : 'Recruiting',
				troop_ov : 'Troop overview',
				troops_outside : 'Troops outside',
				building_ov : 'Buildings',
				culture_ov : 'Culture',
				gods_ov : 'Gods',
				cave_ov : 'Caves',
				city_groups_ov : 'City groups',
				city_list : 'City list',
				attack_planner : 'Attack planner',
				farming_villages : 'Farming villages',
				menu : 'Menu',
				city_view : 'City view',
				messages : 'Messages',
				reports : 'Reports',
				alliance : 'Alliance',
				alliance_forum : 'Alliance forum',
				settings : 'Settings',
				profile : 'Profile',
				ranking : 'Ranking',
				notes : 'Notes',
				chat : 'Chat',
				council : 'Council of Heroes'
			},
			qtoolbox : {
				onlinecounter_now : 'Current',
				onlinecounter_total : 'Total',
				onlinecounter_switch : 'Online current/total',
				stats : 'Statistics',
				grepostats : 'Grepo Stats',
				player : 'Player',
				alliance : 'Alliance',
				rankings : 'Rankings',
				grepo_bash : 'Grepo Bash',
				track_player : 'Track a Player',
				track_alliance : 'Track an Alliance',
				top_killers : 'Top Killers',
				maps : 'Maps',
				grepo_maps : 'Grepo Maps',
				grepo_intel : 'Grepo Intel',
				townsearches : 'Town searches',
				grepo_finder : 'Grepo Finder',
				tonda_polissuche : 'Townsearch',
				bb_codes : 'BB-Codes',
				in_town : 'In town',
				from_town : 'From town',
				outside_town : 'Outside town',
				tools : 'Tools',
				unit_comparison : 'Units calculator',
				google_docs : 'Google Docs',
				deff_helper : 'Deff Helper',
				display_modes : 'Display modes',
				full_screen : 'Full screen',
				minimal : 'Minimal',
				standard : 'Standard',
				stats_scripts : 'Stats/Scripts',
				settings : 'Script manager',
				quo : 'Quo',
				grepoworld : 'Grepoworld'
			},
			academy : {
				researched : 'Colorize researched',
				notresearched : 'Colorize not researched',
				undo : 'Undo coloration'
			},
			caves : {
				stored_silver : 'Stored silver coins',
				silver_to_store: 'Storable silver coins',
				name : 'Name',
				wood : 'Wood',
				stone : 'Stone',
				silver : 'Silver coins',
				search_for : 'Search for'
			},
			transport_calc : {
				btn_main : 'Transport calculator',
				available : 'Available transport capacity',
				transportable : 'Transportable units',
				recruits : 'Count units in recruitment queue',
				outsidetown : 'Count units outside of city',
				slowtrans : 'Count slow transport ships',
				fasttrans : 'Count fast transport ships',
				disabled : 'Temporarily disabled'
			},
			culture : {
				cityfestivals : 'City festivals',
				olympicgames : 'Olympic Games',
				triumph : 'Victory processions',
				theater : 'Theater plays'
			},
			settings : {
				text2 : 'Online counter',
				text3 : 'Open links from the menu ingame',
				text4 : 'Activate the inclusion of other greasemonkey scripts to the menu',
				text5 : 'Show buttons for permanent display of the unit queue, movements and trade',
				text6 : 'Button bar',
				text9 : 'Display at start',
				text11 : 'Deactivate saving of the total online time',
				text12 : 'Transport calculator',
				text13 : 'Menu display',
				text14 : 'Menu features',
				text15 : 'Reports',
				text16 : 'Add color',
				text17 : 'Add filter',
				text18 : 'Activate display',
				text19 : 'Delete all settings and traces of the script in the browser cache?',
				text20 : 'Forum',
				text21 : 'Maximize the width of the forum',
				text22 : 'Hotkey image',
				text23 : 'Grepolis menu',
				text24 : 'Senate',
				text25 : 'Show the number of points awarded for constructing the next level of a building',
				text26 : 'Trading window',
				text27 : 'Activate extension',
				text28 : 'Town list',
				text29 : 'Quest list',
				text30 : 'Add a dropdown list with your folders',
				text31 : 'Button for the BB-code of the current city',
				text32 : 'Select and delete posts',
				text34 : 'Caves overview (Administrator)',
				text35 : 'Academy planner',
				text36 : 'Cave',
				text37 : 'Allow sorting of cities',
				text38 : 'Enter silver above 15000 automatically into the input field',
				text40 : 'Farming villages overview (Captain)',
				text41 : 'Add a button for opening the city view to the sidemenu of Greplis',
				text42 : 'Show losses of resources',
				text43 : 'Simulator',
				text44 : 'Island overview',
				text45 : 'Enlarge the height of the citylist and the list of the farming villages',
				text46 : 'Hotkeys',
				text47 : 'Use [Enter] as the button to jump to the current city (not [Space])',
				text48 : 'Open the old cityview',
				text49 : 'Sort report folders alphabetically',
				text50 : 'Display of the quest arrow',
				text51 : 'Autohide cities after farming',
				text52 : 'City view',
				text53 : 'Display the city view in a window',
				text54 : 'Removal of the new unit tooltipps',
				text55 : 'General settings',
				other : 'Other',
				save : 'Save',
				reset : 'Reset settings',
				contact : 'Contact',
				info : 'Info',
				settings : 'Settings',
				translations : 'Translations',
				trans_sure : 'Are you sure that your translation is ready to send?',
				trans_success : 'The translation has been sent successfully',
				trans_fail : 'The translation could not be sent',
				trans_infotext1 : 'The translation does not have to be complete - just translate what you want',
				trans_infotext2 : 'When a text contains HTML tags (thus everything which is surrounded by <> brackets) I ask you to keep them where you found them',
				trans_infotext3 : 'In order to be able to add you to the credits your player name, player id and the world id will be transmitted as well',
				trans_infotext4 : 'Spammers will be added to the internal banlist and excluded from using the script',
				please_note : 'Please note',
				credits : 'Credits',
				no_translation : 'No translation found',
				choose_lang : 'Choose language',
				add_lang : 'Add a new language',
				language : 'Language',
				enter_lang_name : 'Please enter a language name',
				send : 'Send',
				name : 'Name',
				ingame_name : 'Do not hesitate to contact me if you prefer to be called by your ingame name',
				adfly : 'Do you want to earn money with links, too?',
				donations : 'Donations',
				update_check : 'Check for update',
				prologue : 'Due to the lack of alternatives of userscripts for Grepolis 2.0 this toolset was started two years ago and constantly tries to extend Grepolis with new functions ever since.<p />Initially the goal was to repair the functions of old userscripts for Grepolis 1.0 and to learn the basics of JavaScript in the process but by now much more has been accomplished. The toolset is constantly extended by our own ideas or ideas from the community, because of your great support my motivation to continue is still there. You constantly present me with interesting challenges and it is fun to find solutions for that.<p />Since this is a great deal of work that can be very time-consuming I am always very grateful for any type of support. Therefore I would like to thank everyone who has offered support for this project - whether through donations or clicking an AdFly-Link, knowledge, creativity, bug reports or just some encouraging words.'
			},
			bbcode : {
				troops : 'Troops',
				building : 'Building levels',
				cities : 'Cities',
				all : 'All',
				active_grp : 'Active city group',
				in : 'in',
				from : 'from',
				outside : 'outside of',
				messages : 'Messages'
			},
			stats_scripts : {
				stats_scripts_ov : 'Overview of stats and scripts'
			},
			googledocs : {
				change_url : 'Change URL',
				reset : 'Reset'
			},
			farmhelper : {
				autohide_cities : 'Auto Hide Farming Villages after farming or looting on/off'
			},
			export_window : {
				wnd_title : 'Image upload - preview',
				button_mouseover : 'Export to image',
				upload : 'Upload',
				settings : 'Settings',
				preview : 'Preview',
				chrome : 'Chrome opens the window with the screenshot per default as a popup. If you prefer that the window opens as a new tab you have to install an extra addon. Click here to get to the addon.',
				info : "The hosting provider unfortunately allows just 1250 uploads daily. They will ban this service for the rest of the month if we exceed this amount 5 times. In the long run I plan to rent an own server for this but the costs and the development need quite some time and most of all money. I invest my own free time for this with pleasure but as a student I just can't pay all of the costs involved. As a possibility for refinancing I therefore use the sponsorlinks from Adf.ly (only for the first published screenshot). With a click on this info button you will be redirected to the official Paypal donation page of this script. Thanks to all who already support this project and to those who intend to do so.",
				connection_fail_text : 'Connection to the server failed. The server is unreachable or the maxmimum hosting capacity is reached for today (1250 images per day / 50 images per user).',
				town : 'Town',
				luck : 'Luck',
				title : 'Title',
				resources : 'Resources',
				wall : 'Wall',
				player : 'Player',
				moral : 'Moral',
				reporttype : 'Report type',
				resources_lost : 'Resources lost',
				nightbonus : 'Nightbonus',
				alliance : 'Alliance',
				troops : 'Troops',
				bashpoints : 'Bashpoints',
				buildings : 'Buildings',
				payed_iron : 'Iron paid',
				payed_iron_storage : 'Iron in storage',
				date : 'Date',
				spell_info : 'Spell info',
				spell_effect : 'Spell effect',
				message : 'Message',
				attacker : 'Attacker',
				defender : 'Defender',
				bonuses : 'Spells/Bonuses',
				command_type : 'Command type',
				town_left : 'Town (left)',
				town_right : 'Town (right)',
				player_left : 'Player (left)',
				player_right : 'Player (right)',
				travel_time : 'Travel time',
				time_of_arrival : 'Time of arrival',
				command : 'Command',
				defeated_atk : 'Defeated as an attacker',
				defeated_def : 'Defeated as a defender',
				losses_atk : 'Losses as an attacker',
				losses_def : 'Losses as a defender',
				brush_size : 'Brush Size',
				color : 'Color',
				eraser : 'Eraser',
				pencil : 'Pencil',
				arrow : 'Arrow',
				rectangel : 'Rectangel',
				line : 'Line',
				arc : 'Arc',
				delete_drawing : 'Delete drawing',
				fill : 'Fill'
			},
			colors : {
				black : "black",
				blue : "blue",
				red : "red",
				green : "green",
				yellow : "yellow",
				gray : "gray"
			},
			command_ov : {
				commands : "Commands"
			},
			recipeevent : {
				recipebook: "A searchable recipe book - please share your recipes in the comment section so we can complete the list",
				poll : "Help the devolopers of Grepolis: What are your favorite rewards?",
				present : "Check out the Grepolis Halloween Event 1500 Gold Giveaway. Make sure to visit every day to earn extra entries and to boost your luck even further!"
			}
		}
	};

	/************************************************************************
	 * Images
	 ***********************************************************************/
	QT.Images = {
		hotkeys : {
			key : 'http://fs5.directupload.net/images/160207/dj4uootz.jpg',
			city_select : 'http://fs5.directupload.net/images/160207/nzhgrbzm.png',
			administrator : 'http://fs5.directupload.net/images/160207/j4kvrnok.png',
			captain : 'http://fs5.directupload.net/images/160207/8r8ty3md.png',
			menu : 'http://fs5.directupload.net/images/160207/giiagnrp.png'
		},
		archer : "http://s1.directupload.net/images/140121/l2xgz8zg.jpg",
		attack_ship : "http://s1.directupload.net/images/140121/mvlqonug.jpg",
		big_transporter : "http://s1.directupload.net/images/140121/shdrwvx4.jpg",
		bireme : "http://s1.directupload.net/images/140121/op3pm7ig.jpg",
		calydonian_boar : "http://s14.directupload.net/images/140121/5qr5nmxo.jpg",
		catapult : "http://s1.directupload.net/images/140121/gv9r6p24.jpg",
		centaur : "http://s7.directupload.net/images/140121/7lytp7ku.jpg",
		cerberus : "http://s14.directupload.net/images/140121/58gsjmi9.jpg",
		chariot : "http://s14.directupload.net/images/140121/vlfs3fmp.jpg",
		colonize_ship : "http://s14.directupload.net/images/140121/zgcvw7q2.jpg",
		demolition_ship : "http://s7.directupload.net/images/140121/h3isd3id.jpg",
		fury : "http://s7.directupload.net/images/140121/97qhkxxu.jpg",
		godsent : "http://s1.directupload.net/images/140121/oc3euuhk.jpg",
		griffin : "http://s7.directupload.net/images/140121/lukxwqlc.jpg",
		harpy : "http://s1.directupload.net/images/140121/7hl9sx8x.jpg",
		hoplite : "http://s1.directupload.net/images/140121/lllk8ef5.jpg",
		manticore : "http://s1.directupload.net/images/140121/dz3wluob.jpg",
		medusa : "http://s14.directupload.net/images/140121/6qgf9chs.jpg",
		militia : "http://s1.directupload.net/images/140121/exvjtpb6.jpg",
		minotaur : "http://s7.directupload.net/images/140121/o8a34o3n.jpg",
		pegasus : "http://s1.directupload.net/images/140121/e8ovbacv.jpg",
		rider : "http://s14.directupload.net/images/140121/39pvt7u6.jpg",
		sea_monster : "http://s14.directupload.net/images/140121/hflh35u5.jpg",
		slinger : "http://s1.directupload.net/images/140121/jtfdfuk9.jpg",
		small_transporter : "http://s14.directupload.net/images/140121/oxgq69a8.jpg",
		sword : "http://s14.directupload.net/images/140121/vpaij5z9.jpg",
		trireme : "http://s14.directupload.net/images/140121/mdzzpxye.jpg",
		zyklop : "http://s1.directupload.net/images/140121/oihz5sop.jpg",
		andromeda : "http://s7.directupload.net/images/140121/4jdz5tso.jpg",
		atalanta : "http://s1.directupload.net/images/140121/yo6vp8l2.jpg",
		cheiron : "http://s1.directupload.net/images/140121/tkpytdq8.jpg",
		ferkyon : "http://s1.directupload.net/images/140121/glncylst.jpg",
		helen : "http://s1.directupload.net/images/140121/m75fi7pf.jpg",
		hercules : "http://s1.directupload.net/images/140121/hnaqid9l.jpg",
		leonidas : "http://s1.directupload.net/images/140121/tskyuwpt.jpg",
		orpheus : "http://s7.directupload.net/images/140121/hfjeztt4.jpg",
		terylea : "http://s7.directupload.net/images/140121/vev4s7z7.jpg",
		urephon : "http://s14.directupload.net/images/140121/jfqewwux.jpg",
		zuretha : "http://s7.directupload.net/images/140121/o6cf8cya.jpg",
	};

	/************************************************************************
	 * Links
	 ***********************************************************************/
	QT.Links = {
		GS_Spieler : "http://www." + mID + ".grepostats.com/world/" + wID + "/player/" + sID,
		GS_Allianz : "http://www." + mID + ".grepostats.com/world/" + wID + "/alliance/" + aID,
		GS_Bash : "http://www." + mID + ".grepostats.com/world/" + wID + "/alliance/" + aID + "/members",
		GrepoBash : "http://grepobash.de/show.php?server=" + wID + "&ally=" + aID + "&order=all",
		GrepoMaps : "http://" + wID + ".grepolismaps.org",
		Polissuche_faark : "http://grepo.faark.de/tondasPolisSuche/townSearch.php/" + wID,
		Unitvergleich : "https://docs.google.com/spreadsheet/ccc?key=0AkpTmTnKs72_dHU0VUZ4SDRnNXh4bWZhUnRESEdJaUE#gid=0",
		ForumMax : "http://" + wID + ".grepolis.com/forum",
		Grepofinder : "http://www.drolez.com/grepofinder/" + wID,
		Polissuche : "http://polissuche.marco93.de/" + wID + ".html",
		GrepoIntelMap : "http://grepointel.com/map.php?server=" + wID,
		GrepoIntelPlayer : "http://grepointel.com/track.php?server=" + wID,
		GrepoIntelAlliance : "http://grepointel.com/alliance.php?server=" + wID,
		GrepoIntelKillers : "http://grepointel.com/topkillers.php?server=" + wID,
		gretimes : "http://gretimes.community.grepolis.pl",
		grepostats : "http://www." + mID + ".grepostats.com",
		grepointel : "http://www.grepointel.com",
		grepomaps_main : "http://www.grepolismaps.org",
		grepobash_main : "http://www.grepobash.de",
		grepofinder_main : "http://www.drolez.com/grepofinder/",
		polisssuche_main : "http://polissuche.marco93.de",
		einheitenvergleich : "https://docs.google.com/spreadsheet/ccc?key=0AkpTmTnKs72_dHU0VUZ4SDRnNXh4bWZhUnRESEdJaUE",
		grepoutils : "http://www.grepoutils.webxxs.com",
		abakus : "http://forum.de.grepolis.com/showthread.php?691-Abakus-Der-Grepolis-Rechner",
		grepotool : "http://forum.de.grepolis.com/showthread.php?28359",
		youscreen : "http://www.youscreen.de",
		quacktools : "https://openuserjs.org/scripts/quackmaster/Quack_Toolsammlung",
		grc : "http://grepolis.potusek.eu/module/installgrc",
		playerprofilescript : "https://openuserjs.org/scripts/Menidan/Grepolis_Spielerprofil_mit_Zur%C3%BCck-Button",
		attackwarner : "http://forum.de.grepolis.com/showthread.php?25986",
		grepotownslist : "http://userscripts-mirror.org/scripts/show/84608.html",
		grepolisrevobericht : "http://forum.de.grepolis.com/showthread.php?29259",
		grepoforen : "http://www.grepoforen.de",
		transportrechner_menidan : "https://openuserjs.org/scripts/Menidan/Grepolis_Transportrechner",
		zeitrechner : "https://openuserjs.org/scripts/Menidan/Grepolis_Zeitrechner",
		diotools : "http://forum.de.grepolis.com/showthread.php?28838",
		bauerndorfalarm : "http://forum.de.grepolis.com/showthread.php?28919",
		quo : "http://www.quo.marekblomkvist.com/" + wID,
		quo_main : "http://www.quo.marekblomkvist.com",
		grepolisqt_main : "http://www.grepolisqt.de",
		grepolisqt : "http://adf.ly/pcChx",
		grepolisqt_facebook : "https://www.facebook.com/grepolisqt",
		revoformatierer : "http://tms-partner.de/Grepolis/revoeingabe.php",
		gs_eroberungsstatistiken : "https://openuserjs.org/scripts/Menidan/Grepolis_Stats_Eroberungsstatistiken",
		grepoworld : 'http://www.grepoworld.com',
		grepoworld_player : "http://grepoworld.com/world/" + wID + "/player/" + sID,
		grepoworld_alliance :  "http://grepoworld.com/world/" + wID + "/alliance/" + aID
	};

	/************************************************************************
	 * Settings
	 ***********************************************************************/
	QT.Settings = {
		values : {
			"onlinetotal" : 0,
			"qmenu_online_version" : 0,
			"qmenu_update_next" : 0,
			"script_version" : 0,
			"clicked_sponsor_links" : 0,
			"clicked_sponsor_link_last" : 0,
			"googledocsurl" : "https://docs.google.com/spreadsheet/ccc?key=0AkpTmTnKs72_dEF3bWs3SW5iWjdyUEE0M0c3Znpmc3c",
			"grepolistoolkit" : false,
			"sylvester2017" : true,
			"qmenu_settings_akademieplaner" : true,
			"qmenu_settings_berichte_farben" : true,
			"qmenu_settings_berichte_filter" : true,
			"qmenu_settings_berichte_losses" : true,
			"qmenu_settings_berichte_move" : true,
			"qmenu_settings_berichte_sortfolders" : true,
			"qmenu_settings_buttonbar" : true,
			"qmenu_settings_cityview_BTN" : true,
			"qmenu_settings_cityview_window" : true,
			"qmenu_settings_counter" : true,
			"qmenu_settings_counter_aktiv" : true,
			"qmenu_settings_farmhelper" : true,
			"qmenu_settings_farmhelper_hidecities" : true,
			"qmenu_settings_forumdelete" : true,
			"qmenu_settings_grepopoints" : true,
			"qmenu_settings_hidesilver" : true,
			"qmenu_settings_hidessilver" : true,
			"qmenu_settings_hidessort" : true,
			"qmenu_settings_hotkey_anzeige" : true,
			"qmenu_settings_hotkey_jump" : true,
			"qmenu_settings_hotkey_active" : true,
			"qmenu_settings_island_villages" : true,
			"qmenu_settings_maximize_forum" : true,
			"qmenu_settings_plusmenu" : true,
			"qmenu_settings_questliste" : true,
			"qmenu_settings_questpfeil" : true,
			"qmenu_settings_removetooltipps" : true,
			"qmenu_settings_stadtliste" : true,
			"qmenu_settings_tradeimprovement" : true,
			"qmenu_settings_transport_rechner" : true,
			"qmenu_settings_townbb" : true
		},
		save : function (name, value) {
			QT_saveValue(name, value);
		},
		save_all : function (valuesToSave) {
			QT_saveAllValues(valuesToSave);
		},
		delete : function (name) {
			QT_deleteValue(name);
		},
		delete_all : function () {
			QT_deleteAllValues();
		},
		setValues : function () {
			for (var opt in DATA) {
				QT.Settings.values[opt] = DATA[opt];
			}
		}
	};

	/************************************************************************
	 * Helper Functions
	 ***********************************************************************/
	QT.Helper = {
		grepo_btn : function (ID, Text) {
			return $('<a id="' + ID + '" href="#" class="button"><span class="left"><span class="right"><span class="middle"><small>' + Text + '</small></span></span></span></a>');
		},
		grepo_dropdown : function (ID, Options) {
			var str = '<span class="grepo_input"><span class="left"><span class="right"><select name="' + ID + '" id="' + ID + '" type="text">';
			$.each(Options, function (a, b) {
				if (b[1]) {
					str += '<option value="' + b[0] + '">' + b[1] + '</option>'
				} else {
					str += '<option value="' + b + '">' + b + '</option>'
				}
			});
			str += '</select></span></span></span>';
			return str;
		},
		grepo_dropdown_flag : function (ID, Options) {
			var str = '<span class="grepo_input"><span class="left"><span class="right"><select name="' + ID + '" id="' + ID + '" type="text">';
			$.each(Options, function (a, b) {
				if (QT.Lang[b]) {
					var option_image = QT.Lang[b].meta.flag;
				} else {
					var option_image = "";
				}
				var option_name = (QT.Lang[b]) ? b.toUpperCase() : b;
				str += '<option style="background: url(' + option_image + ') no-repeat scroll left center #EEDDBB; padding-left: 22px" value="' + b + '">' + option_name + '</option>'
			});
			str += '</select></span></span></span>';
			return $(str);
		},
		grepo_input : function (Style, ID, Text) {
			return $('<div class="input_box" style="' + Style + '"><span class="grepo_input"><span class="left"><span class="right"><input id="' + ID + '" type="text" value="' + Text + '"></span></span></span></div>');
		},
		grepo_submenu : function (ID, Title) {
			return $('<li><a id="' + ID + '" class="submenu_link" href="#"><span class="left"><span class="right"><span class="middle" title="' + Title + '">' + Title + '</span></span></span></a></li>');
		},
		grepo_textbox : function (id, text) {
			return '<div class="textbox initial-message" id="' + id + '"><div class="left"></div><div class="right"></div><div class="middle"><div class="initial-message-box js-empty" style="display: block;">' + text + '</div><div class="ie7fix"><input type="text" tabindex="1" placeholder=""></div><div class="clear-button js-clear" style="display: none;"></div></div><div class="error-msg js-txt-error-msg"></div></div>';
		},
		grepo_playerlink : function (name, id) {
			return '<a class="gp_player_link" href="#' + btoa('{"name":"' + name + '","id":' + id + '}') + '">' + name + '</a>';
		},
		Inactivity : {
			loadDataToCache : function (JQelements) {
				QT.Helper.Inactivity.cache = {};
				QT_inactivity(wID, function (players) {
					QT.Helper.Inactivity.cache = QT_inactive_players;
					QT.Helper.Inactivity.changeDisplay(JQelements);
				});
			},
			addDisplay : function (style, playerID) {
				var currentTownXY = QT.Helper.Inactivity.Filter.coordinates();
				return '<a class="qt_activity" style="display:block; float:left; width:20px; height:12px; text-decoration:none; background:url(http://s1.directupload.net/images/140416/7fwyuv54.gif) no-repeat;' + style + '" href="http://polissuche.marco93.de/' + wID + '.html?filter=player_id:' + playerID + currentTownXY + '" target="_blank"><span class="qt_activity_number" style="display:block; margin-top:1px; font-size: 8px; color:#EEDDBB; text-shadow:1px 1px #000000; text-align:center"></span></a>';
			},
			getBG : function (number_days) {
				var bgImage = "http://s14.directupload.net/images/140415/mju99vog.png";
				var bgPos = "";
				if (number_days < 2) {
					bgPos = "0 -12px";
				} else if (number_days >= 2 && number_days < 5) {
					bgPos = "0 -24px";
				} else if (number_days >= 5) {
					bgPos = "0 -36px";
				} else {
					bgPos = "0 0";
				}
				return 'url(' + bgImage + ') no-repeat ' + bgPos + '';
			},
			createPopup : function (number_days) {
				var popupHTML = '';
				if (typeof number_days === 'undefined' || number_days === 'undefined') {
					popupHTML += QT.Lang.get("town_info", "no_data");
				} else {
					popupHTML += '<b>' + QT.Lang.get("town_info", "inactivity") + ':</b> ' + number_days + ' ' + QT.Lang.get("town_info", "days");
				}
				popupHTML += '<p/><span style="font-size:10px">powered by Tondas ' + QT.Lang.get("town_info", "polissuche") + '</span>';
				return popupHTML;
			},
			changeDisplay : function (JQelements) {
				JQelements.each(function (index, element) {
					var playerJQ = $(this).find(".qt_activity")
					var playerID = playerJQ.data("playerID");
					var number_days;
					if (playerID in QT.Helper.Inactivity.cache) {
						number_days = QT.Helper.Inactivity.cache[playerID];
					} else {
						number_days = 0;
					}
					var background = QT.Helper.Inactivity.getBG(number_days);
					playerJQ.find(".qt_activity_number").text(number_days);
					playerJQ.css({
						"background" : background
					});
					playerJQ.mousePopup(new MousePopup(QT.Helper.Inactivity.createPopup(number_days)));
				});
			},
			loadDisplay : function (JQelements, style, playerID) {
				if (mID === "zz") return;
				JQelements.each(function (index, element) {
					var id;
					if (!playerID) {
						var a = $(this).attr("href");
						var b = a.split(/#/);
						id = $.parseJSON(atob(b[1] || b[0])).id;
					} else {
						id = $(this).data("playerID");
					}
					$(QT.Helper.Inactivity.addDisplay(style, id)).appendTo(this).data("playerID", id);
				});
				if (QT.Helper.Inactivity.cache) {
					QT.Helper.Inactivity.changeDisplay(JQelements);
				} else {
					QT.Helper.Inactivity.loadDataToCache(JQelements);
				}
			},
			Filter : {
				coordinates : function () {
					var currentTownX = ITowns.getCurrentTown().getIslandCoordinateX();
					var currentTownY = ITowns.getCurrentTown().getIslandCoordinateY();
					return ';order_type:distance;order_x:' + currentTownX + ';order_y:' + currentTownY;
				}
			}
		},
		Screenshot : {
			btn_preview : function (element, id, window_type, callback) {
				$(element).append('<a id="'+ id +'" href="#"></a>');
				$("#" + id).css({
					"top" : "0px",
					"right" : "0px",
					"position" : "absolute",
					"height" : "23px",
					"width" : "22px",
					"background-image" : "url(http://s14.directupload.net/images/141014/3j8vsimv.png)",
					"background-repeat" : "no-repeat",
					"background-position" : "0px 0px"
				});

				$("#" + id).hover(
					function () {
					$(this).css({
						"background-position" : "0px -23px"
					});
				},
					function () {
					$(this).css({
						"background-position" : "0px 0px"
					});
				});

				$("#" + id).click(function () {
					QT.Helper.Screenshot.open_window(QT.Lang.get("export_window", "wnd_title"));
					QT.Helper.Screenshot.get_settings(window_type);
					var elemensToChange = callback();
					QT.Helper.Screenshot.replace_images(elemensToChange);
					$("#qt_canvas #"+ id +"").remove();
					$("#qt_canvas :first").append('<div id="qt_copyright">Powered by &copy; www.grepolisqt.de</div>');
					$("#qt_copyright").css({
						"background-color" : "#000000",
						"height" : "15px",
						"color" : "#eeddbb",
						"font-size" : "9px",
						"text-shadow" : "0 0 2px #000",
						"padding-right" : "3px",
						"text-align" : "right"
					});
					QT.Helper.Screenshot.canvasDraw.addElements();
				});

				$("#" + id).mousePopup(new MousePopup(QT.Lang.get("export_window", "button_mouseover")));

			},
			canvasDraw : {
				addElements : function () {
					$("#qt_export_content fieldset legend").append('\
						<div id="qt_canvas_toolbar">\
							<a id="eraser" class="qt_canvas_tool" href="#"></a>\
							<a id="pencil" class="qt_canvas_tool active" href="#"></a>\
							<a id="arrow" class="qt_canvas_tool" href="#"></a>\
							<a id="line" class="qt_canvas_tool" href="#"></a>\
							<a id="rectangel" class="qt_canvas_tool" href="#"></a>\
							<a id="arc" class="qt_canvas_tool" href="#"></a>\
							<div class="checkbox_new">'+QT.Lang.get("export_window", "fill")+'<div class="cbx_icon"></div></div>\
							<div class="qt_canvas_tools_select">'+QT.Lang.get("export_window", "brush_size")+'\
								'+QT.Helper.grepo_dropdown("selWidth", [1,3,5,7,9,11,13,15])+'\
							</div>\
							<div class="qt_canvas_tools_select">'+QT.Lang.get("export_window", "color")+'\
								'+QT.Helper.grepo_dropdown("selColor", [["black",""+QT.Lang.get("colors", "black")+""],["blue",""+QT.Lang.get("colors", "blue")+""],["red",""+QT.Lang.get("colors", "red")+""],["green",""+QT.Lang.get("colors", "green")+""],["yellow",""+QT.Lang.get("colors", "yellow")+""],["gray",""+QT.Lang.get("colors", "gray")+""]])+'\
							</div>\
							<a id="qt_canvas_delete" class="cancel" href="#"></a>\
						</div>\
					');

					$("#selWidth").val("5");
					$("#selColor").val("red");

					var qt_canvas_height = $("#qt_canvas :first").outerHeight();

					$("#qt_canvas").append('<div id="qt_canvas_wrapper"><canvas id="myCanvas" class="qt_canvas_el" width="800" height="'+qt_canvas_height+'"></canvas><canvas id="canvasTemp" class="qt_canvas_el" width="800" height="'+qt_canvas_height+'"></canvas></div>');

					$("#qt_canvas_toolbar").css({"position":"absolute", "right":"40px", "margin-top":"-22px", "z-index":"2", "height":"23px", "padding":"0 8px", "background":"url(https://gpde.innogamescdn.com/images/game/border/odd.png)"});
					$(".qt_canvas_tool").css({"width":"22px", "height":"23px", "display":"inline-block","background-position":"0px 0px"});
					$("#qt_canvas_delete").css({"display":"inline-block", "margin-left": "5px"});
					$("#eraser").css({"background" : "url(http://fs1.directupload.net/images/141218/5u8ojvzq.png)"});
					$("#pencil").css({"background" : "url(http://fs1.directupload.net/images/141213/9rjcrqfy.png)", "background-position":"0px -23px"});
					$("#arrow").css({"background" : "url(http://fs1.directupload.net/images/141214/tapgcj8q.png)"});
					$("#rectangel").css({"background" : "url(http://fs1.directupload.net/images/141213/xi25lbk7.png)"});
					$("#line").css({"background" : "url(http://fs1.directupload.net/images/141213/8pyhdwes.png)"});
					$("#arc").css({"background" : "url(http://fs1.directupload.net/images/141213/eufhyzin.png)"});
					$("#qt_canvas_toolbar .checkbox_new").css({"padding":"0", "margin-bottom":"14px"});
					$("#qt_canvas_toolbar .cbx_icon").css({"float":"right", "margin-left":"5px"});
					$(".qt_canvas_tools_select").css({"bottom":"6px", "position":"relative", "display":"inline-block"});
					$("#qt_canvas_wrapper").css({"position":"relative", "width":"800px", "top":"-"+qt_canvas_height+"px", "z-index":"10", "cursor":"crosshair"});
					$(".qt_canvas_el").css({"position" : "absolute"});

					$("#eraser").mousePopup(new MousePopup(QT.Lang.get("export_window", "eraser")));
					$("#pencil").mousePopup(new MousePopup(QT.Lang.get("export_window", "pencil")));
					$("#arrow").mousePopup(new MousePopup(QT.Lang.get("export_window", "arrow")));
					$("#rectangel").mousePopup(new MousePopup(QT.Lang.get("export_window", "rectangel")));
					$("#line").mousePopup(new MousePopup(QT.Lang.get("export_window", "line")));
					$("#arc").mousePopup(new MousePopup(QT.Lang.get("export_window", "arc")));
					$("#qt_canvas_delete").mousePopup(new MousePopup(QT.Lang.get("export_window", "delete_drawing")));

					$("#qt_canvas_toolbar .checkbox_new").click(function () {
						$(this).toggleClass("checked");
					});

					QT.Helper.Screenshot.canvasDraw.init();
				},
				init : function () {

					var lastX, lastY;
					var startX, startY;
					var tool;
					var fill = false;
					var mousePressed = false;
					var canvasEl, canvasTemp;
					var ctx, ctxTemp;

					var tools = {};
					tools.arc = function (x, y) {
						ctxTemp.beginPath();
						ctxTemp.clearRect(0, 0, ctxTemp.canvas.width, ctxTemp.canvas.height);
						ctxTemp.arc(x, y, Math.abs(x-startX), 0, Math.PI*2, true);
						ctxTemp.closePath();
						ctxTemp.stroke();
						if (fill) {
							ctxTemp.fill();
						}
					};
					tools.arrow = function (x, y) {
						ctxTemp.clearRect(0, 0, ctxTemp.canvas.width, ctxTemp.canvas.height);
						ctxTemp.beginPath();
						ctxTemp.moveTo(startX, startY);
						ctxTemp.lineTo(x,y);
						ctxTemp.stroke();

						var endRadians=Math.atan((y-startY)/(x-startX));
						endRadians+=((x>=startX)?90:-90)*Math.PI/180;

						ctxTemp.save();
						ctxTemp.translate(x,y);
						ctxTemp.rotate(endRadians);
						ctxTemp.moveTo(0,-1.9*ctxTemp.lineWidth);
						ctxTemp.lineTo(2.5*ctxTemp.lineWidth,3.2*ctxTemp.lineWidth);
						ctxTemp.lineTo(-2.5*ctxTemp.lineWidth,3.2*ctxTemp.lineWidth);
						ctxTemp.closePath();
						ctxTemp.restore();
						ctxTemp.fill();
					};
					tools.eraser = function (x, y) {
						ctx.beginPath();
						ctx.lineJoin = "round";
						ctx.globalCompositeOperation = "destination-out";
						ctx.strokeStyle = 'rgba(0,0,0,1.0)';
						ctx.moveTo(lastX, lastY);
						ctx.lineTo(x, y);
						ctx.closePath();
						ctx.stroke();
					};
					tools.line = function (x, y) {
						ctxTemp.clearRect(0, 0, ctxTemp.canvas.width, ctxTemp.canvas.height);
						ctxTemp.beginPath();
						ctxTemp.moveTo(startX, startY);
						ctxTemp.lineTo(x,y);
						ctxTemp.stroke();
						ctxTemp.closePath();
					};
					tools.pencil = function (x, y) {
						ctxTemp.beginPath();
						ctxTemp.lineJoin = "round";
						ctxTemp.moveTo(lastX, lastY);
						ctxTemp.lineTo(x, y);
						ctxTemp.closePath();
						ctxTemp.stroke();
					};
					tools.rectangel = function (x, y) {
						ctxTemp.beginPath();
						ctxTemp.clearRect(0, 0, ctxTemp.canvas.width, ctxTemp.canvas.height);
						ctxTemp.rect(startX, startY, x-startX, y-startY);
						ctxTemp.closePath();
						ctxTemp.stroke();
						if (fill) {
							ctxTemp.fill();
						}
					};

					canvasEl = document.getElementById('myCanvas');
					ctx = canvasEl.getContext("2d");
					canvasTemp = document.getElementById('canvasTemp');
					ctxTemp = canvasTemp.getContext("2d");

					$('#canvasTemp').mousedown(function (e) {
						mousePressed = true;
						if ($("#qt_canvas_toolbar .checkbox_new").hasClass("checked")) {
							fill = true;
						} else {
							fill = false;
						}
						ctxTemp.lineWidth = $('#selWidth').val();
						ctxTemp.strokeStyle = $('#selColor').val();
						ctxTemp.fillStyle = $('#selColor').val();
						ctx.lineWidth = $('#selWidth').val();
						ctx.globalCompositeOperation = "source-over";
						startX = e.pageX - $(this).offset().left;
						startY = e.pageY - $(this).offset().top;
						tool = $('.qt_canvas_tool.active').prop('id');
						Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, tool, false);
					});

					$('#canvasTemp').mousemove(function (e) {
						if (mousePressed) {
							Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, tool, true);
						}
					});

					$('#canvasTemp').mouseup(function (e) {
						mousePressed = false;
						img_update();
					});

					$('#canvasTemp').mouseleave(function (e) {
						mousePressed = false;
						img_update();
					});

					$(".qt_canvas_tool").hover(
						function () {
						$(this).not(".active").css({
							"background-position" : "0px -23px"
						});
					},
						function () {
						$(this).not(".active").css({
							"background-position" : "0px 0px"
						});
					});

					$(".qt_canvas_tool").click(function () {
						$(".qt_canvas_tool").removeClass("active").css({
							"background-position" : "0px 0px"
						});
						$(this).addClass("active").css({
							"background-position" : "0px -23px"
						});
					});

					$("#qt_canvas_delete").click(function () {
						clearArea();
					});

					function Draw(x, y, tool, isDown) {
						if (isDown) {
							tools[tool](x, y);
						}
						lastX = x;
						lastY = y;
					}

					function img_update () {
						ctx.drawImage(canvasTemp, 0, 0);
						ctxTemp.clearRect(0, 0, canvasTemp.width, canvasTemp.height);
					}

					function clearArea() {
						ctx.setTransform(1, 0, 0, 1, 0, 0);
						ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
					}

				}
			},
			get_settings : function (settings_type) {
				var settings_array = {};
				switch (settings_type) {
					case "attack":
					case "take_over":
					case "breach":
						settings_array.first_row = ["rp_town_name_a", "rp_town_name_d", "rp_bonuses_a", "rp_luck", "rp_title", "rp_resources"];
						settings_array.second_row = ["rp_player_a", "rp_player_d", "rp_bonuses_d", "rp_moral", "rp_attackmode", "rp_resources_lost"];
						settings_array.third_row = ["rp_alliance_a", "rp_alliance_d", "", "rp_wall", "rp_bashpoints", ""];
						settings_array.fourth_row = ["rp_troops_a", "rp_troops_d", "", "rp_nightbonus", "rp_date", ""];
						break;
					case "espionage_2.67":
						settings_array.first_row = ["rp_town_name_a", "rp_town_name_d", "rp_troops", "rp_title", "", ""];
						settings_array.second_row = ["rp_player_a", "rp_player_d", "rp_buildings", "rp_attackmode", "", ""];
						settings_array.third_row = ["rp_alliance_a", "rp_alliance_d", "rp_payed_iron", "rp_date", "", ""];
						settings_array.fourth_row = ["", "", "rp_resources", "", "", ""];
						break;
					case "my_espionage_failed":
						settings_array.first_row = ["rp_town_name_a", "rp_town_name_d", "rp_title", "", "", "rp_payed_iron"];
						settings_array.second_row = ["rp_player_a", "rp_player_d", "rp_attackmode", "", "", ""];
						settings_array.third_row = ["rp_alliance_a", "rp_alliance_d", "rp_body_p", "", "", ""];
						settings_array.fourth_row = ["", "", "rp_date", "", "", ""];
						break;
					case "espionage_failed_on_me":
						settings_array.first_row = ["rp_town_name_a", "rp_town_name_d", "rp_title", "", "", "rp_payed_iron"];
						settings_array.second_row = ["rp_player_a", "rp_player_d", "rp_attackmode", "", "", "rp_payed_iron_storage"];
						settings_array.third_row = ["rp_alliance_a", "rp_alliance_d", "rp_body_p", "", "", ""];
						settings_array.fourth_row = ["", "", "rp_date", "", "", ""];
						break;
					case "powers":
						settings_array.first_row = ["rp_player_a", "rp_town_name_d", "rp_title", "", "", ""];
						settings_array.second_row = ["rp_alliance_a", "rp_player_d", "rp_attackmode", "", "", ""];
						settings_array.third_row = ["rp_power_left", "rp_alliance_d", "rp_date", "", "", ""];
						settings_array.fourth_row = ["rp_power_right", "", "", "", "", ""];
						break;
					case "conquer":
						settings_array.first_row = ["rp_town_name_a", "rp_town_name_d", "rp_title", "", "", ""];
						settings_array.second_row = ["rp_player_a", "rp_player_d", "rp_attackmode", "", "", ""];
						settings_array.third_row = ["rp_alliance_a", "rp_alliance_d", "rp_body_p", "", "", ""];
						settings_array.fourth_row = ["", "", "rp_date", "", "", ""];
						break;
					case "raise":
						settings_array.first_row = ["rp_town_name_a", "rp_town_name_d", "rp_title", "", "", ""];
						settings_array.second_row = ["rp_player_a", "rp_player_d", "rp_attackmode", "", "", ""];
						settings_array.third_row = ["rp_alliance_a", "rp_raise_right", "rp_wall", "", "", ""];
						settings_array.fourth_row = ["rp_raise_left", "", "rp_date", "", "", ""];
						break;
					case "support":
						settings_array.first_row = ["rp_town_name_a", "rp_town_name_d", "rp_title", "", "", ""];
						settings_array.second_row = ["rp_player_a", "rp_player_d", "rp_attackmode", "", "", ""];
						settings_array.third_row = ["rp_alliance_a", "rp_alliance_d", "rp_date", "", "", ""];
						settings_array.fourth_row = ["rp_support", "", "", "", "", ""];
						break;
					case "support_failed":
						settings_array.first_row = ["rp_title", "", "", "", "", ""];
						settings_array.second_row = ["rp_attackmode", "", "", "", "", ""];
						settings_array.third_row = ["rp_body_p", "", "", "", "", ""];
						settings_array.fourth_row = ["rp_date", "", "", "", "", ""];
						break;
					case "support_attacked":
						settings_array.first_row = ["rp_town_name_a", "rp_town_name_d", "rp_title", "", "", ""];
						settings_array.second_row = ["rp_player_a", "rp_player_d", "rp_attackmode", "", "", ""];
						settings_array.third_row = ["rp_alliance_a", "rp_alliance_d", "rp_bashpoints", "", "", ""];
						settings_array.fourth_row = ["", "rp_troops_support_atk", "rp_date", "", "", ""];
						break;
					case "support_back":
						settings_array.first_row = ["rp_title", "", "", "", "", ""];
						settings_array.second_row = ["rp_body_p", "", "", "", "", ""];
						settings_array.third_row = ["rp_support", "", "", "", "", ""];
						settings_array.fourth_row = ["rp_date", "", "", "", "", ""];
						break;
					case "text_only":
						settings_array.first_row = ["rp_title", "", "", "", "", ""];
						settings_array.second_row = ["rp_body_p_all", "", "", "", "", ""];
						settings_array.third_row = ["rp_date", "", "", "", "", ""];
						settings_array.fourth_row = ["", "", "", "", "", ""];
						break;
					case "command_overview":
						settings_array.first_row = ["co_command_type", "co_command", "", "", "", ""];
						settings_array.second_row = ["co_gp_town_link_l", "co_gp_player_link_l", "", "", "", ""];
						settings_array.third_row = ["co_gp_town_link_r", "co_gp_player_link_r", "", "", "", ""];
						settings_array.fourth_row = ["co_countdown", "co_arrival", "", "", "", ""];
						break;
					case "wall":
						settings_array.first_row = ["wall_defeated_atk", "", "", "", "", ""];
						settings_array.second_row = ["wall_defeated_def", "", "", "", "", ""];
						settings_array.third_row = ["wall_losses_atk", "", "", "", "", ""];
						settings_array.fourth_row = ["wall_losses_def", "", "", "", "", ""];
						break;
					case "place_units_beyond_from_town":
					case "place_units_beyond":
						settings_array.first_row = ["sb_town_name", "", "", "", "", ""];
						settings_array.second_row = ["", "", "", "", "", ""];
						settings_array.third_row = ["", "", "", "", "", ""];
						settings_array.fourth_row = ["", "", "", "", "", ""];
						break;
					default:
						settings_array = "undefined";
						break;
				}

				if (settings_array !== "undefined") {
					var settings_elements = {
						rp_town_name_a : [QT.Lang.get("export_window", "town") + " (Off)", ["#report_sending_town .town_name"]],
						rp_luck : [QT.Lang.get("export_window", "luck"), [".luck"]],
						rp_title : [QT.Lang.get("export_window", "title"), ["#report_report_header span"]],
						rp_resources : [QT.Lang.get("export_window", "resources"), ["#resources ul", "#load", "#resources p"]],
						rp_town_name_d : [QT.Lang.get("export_window", "town") + " (Deff)", ["#report_receiving_town .town_name"]],
						rp_wall : [QT.Lang.get("export_window", "wall"), [".oldwall"]],
						rp_player_a : [QT.Lang.get("export_window", "player") + " (Off)", ["#report_sending_town .town_owner"]],
						rp_moral : [QT.Lang.get("export_window", "moral"), [".morale"]],
						rp_attackmode : [QT.Lang.get("export_window", "reporttype"), ["#report_arrow img"]],
						rp_resources_lost : [QT.Lang.get("export_window", "resources_lost"), [".report_booty_bonus_fight table"]],
						rp_player_d : [QT.Lang.get("export_window", "player") + " (Deff)", ["#report_receiving_town .town_owner"]],
						rp_nightbonus : [QT.Lang.get("export_window", "nightbonus"), [".nightbonus"]],
						rp_alliance_a : [QT.Lang.get("export_window", "alliance") + " (Off)", ["#report_sending_town .town_owner_ally"]],
						rp_troops_a : [QT.Lang.get("export_window", "troops") + " (Off)", [".report_side_attacker_unit"]],
						rp_bashpoints : [QT.Lang.get("export_window", "bashpoints"), ["#kill_points"]],
						rp_alliance_d : [QT.Lang.get("export_window", "alliance") + " (Deff)", ["#report_receiving_town .town_owner_ally"]],
						rp_troops_d : [QT.Lang.get("export_window", "troops") + " (Deff)", [".report_side_defender_unit"]],
						rp_troops : [QT.Lang.get("export_window", "troops"), ["#left_side > .report_unit"]],
						rp_buildings : [QT.Lang.get("export_window", "buildings"), ["#spy_buildings .report_unit"]],
						rp_payed_iron : [QT.Lang.get("export_window", "payed_iron"), ["#right_side p:eq(0)"]],
						rp_payed_iron_storage : [QT.Lang.get("export_window", "payed_iron_storage"), ["#right_side p:eq(1)"]],
						rp_date : [QT.Lang.get("export_window", "date"), ["#report_date"]],
						rp_power_left : [QT.Lang.get("export_window", "spell_info"), ["#left_side", ".report_god"]],
						rp_power_right : [QT.Lang.get("export_window", "spell_effect"), ["#right_side"]],
						rp_body_p : [QT.Lang.get("export_window", "message"), ["#report_game_body p:eq(0)"]],
						rp_body_p_all : [QT.Lang.get("export_window", "message"), ["#report_game_body p"]],
						rp_raise_left : [QT.Lang.get("export_window", "attacker"), ["#left_side"]],
						rp_raise_right : [QT.Lang.get("export_window", "defender"), ["#right_side"]],
						rp_support : [QT.Lang.get("export_window", "troops"), ["#report_game_body .report_unit"]],
						rp_troops_support_atk : [QT.Lang.get("export_window", "troops"), [".report_side_defender", ".big_horizontal_report_separator .report_booty_bonus_fight", ".support_report_cities"]],
						rp_bonuses_a : [QT.Lang.get("export_window", "bonuses") + " (Off)", [".report_side_attacker .power_holder"]],
						rp_bonuses_d : [QT.Lang.get("export_window", "bonuses") + " (Deff)", [".report_side_defender .power_holder"]],

						sb_town_name : [QT.Lang.get("export_window", "town"), [".gp_town_link"]],

						co_command_type : [QT.Lang.get("export_window", "command_type"), [".command_type"]],
						co_gp_town_link_l : [QT.Lang.get("export_window", "town_left"), [".gp_town_link:nth-child(1)"]],
						co_gp_town_link_r : [QT.Lang.get("export_window", "town_right"), [".gp_town_link:nth-child(4)"]],
						co_gp_player_link_l : [QT.Lang.get("export_window", "player_left"), [".gp_player_link:nth-child(2)"]],
						co_gp_player_link_r : [QT.Lang.get("export_window", "player_right"), [".gp_player_link:nth-child(4)", ".gp_player_link:nth-child(5)"]],
						co_countdown : [QT.Lang.get("export_window", "travel_time"), [".countdown"]],
						co_arrival : [QT.Lang.get("export_window", "time_of_arrival"), [".troops_arrive_at"]],
						co_command : [QT.Lang.get("export_window", "command"), [".command_overview_units", ".command_overview_booty"]],

						wall_defeated_atk : [QT.Lang.get("export_window", "defeated_atk"), ["#building_wall .game_list li:eq(2) .list_item_left", "#building_wall .game_list li:eq(3) .list_item_left"]],
						wall_defeated_def : [QT.Lang.get("export_window", "defeated_def"), ["#building_wall .game_list li:eq(4) .list_item_left", "#building_wall .game_list li:eq(5) .list_item_left"]],
						wall_losses_atk : [QT.Lang.get("export_window", "losses_atk"), ["#building_wall .game_list li:eq(2) .list_item_right", "#building_wall .game_list li:eq(3) .list_item_right"]],
						wall_losses_def : [QT.Lang.get("export_window", "losses_def"), ["#building_wall .game_list li:eq(4) .list_item_right", "#building_wall .game_list li:eq(5) .list_item_right"]]
					};

					var settings_table = "";
					$.each(settings_array, function( index, tr ) {
						settings_table += "<tr>";
						$.each(tr, function( index, td ) {
							if (td.length > 0) {
								settings_table += '<td><div class="checkbox_new '+td+' checked" style="padding-right: 15px"><div class="cbx_icon"></div><div class="cbx_caption">'+settings_elements[td][0]+'</div></div></td>';
							} else {
								settings_table += "<td></td>";
							}
						});
						settings_table += "</tr>";
					});

					$("#qt_export_container").prepend('<div id="qt_export_header" class="odd"><fieldset><legend><b>'+QT.Lang.get("export_window", "settings")+'</b></legend><table id="qt_export_settings">'+settings_table+'</table></fieldset></div>');

					$("#qt_export_header").css({"padding" : "10px", "border" : "0 none"});
					$("#qt_export_settings").css({"border-collapse" : "collapse"});
					$("#qt_export_header fieldset").css({"border" : "2px groove #fc6"});

					$("#qt_export_header .checkbox_new").click(function () {
						$(this).toggleClass("checked");

						var classList = $(this).attr('class').split(/\s+/);

						$.each(settings_elements[classList[1]][1], function(key, value) {
							var JQelement = $("#qt_canvas " + value);

							if ( JQelement.css('visibility') == 'hidden' ) {
								JQelement.css('visibility','visible');
							}
							else {
								JQelement.css('visibility','hidden');
							}
						});
					});
				} else {
					$("#qt_export_content").css({"padding-top" : "10px"});
					$("#qt_canvas, .qt_transparent").css({"height" : "468px"});
				}
			},
			open_window : function (title) {
				var html = 	'<div id="qt_export_ajax"></div><div id="qt_export_container"><div id="qt_export_content" class="odd"><fieldset><legend><b>'+QT.Lang.get("export_window", "preview")+'</b>\
				</legend><div id="qt_canvas">\
				</div></fieldset></div><div id="qt_export_footer" class="section stone recruit_button_section"></div></div>';

				var wnd = GPWindowMgr.Create(GPWindowMgr.TYPE_QT_REPORTEXPORT) || GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_QT_REPORTEXPORT); //<img class="qt_transparent" src="http://cdn.grepolis.com/images/transparent.png">
				wnd.setTitle(title);
				wnd.setContent(html);

				$("#qt_export_footer").append(QT.Helper.grepo_btn("qt_export_btn",QT.Lang.get("export_window", "upload")));
				$("#qt_export_footer").append('<a id="qt_export_info" href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=2HJ88ATTBYXSQ&lc=DE&item_name=Quack%20Toolsammlung&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted" target="_blank"></a>');

				if(/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())){
					$("#qt_export_footer").append('<a id="qt_chrome_info" href="https://chrome.google.com/webstore/detail/one-window/papnlnnbddhckngcblfljaelgceffobn" target="_blank"></a>');
					$("#qt_chrome_info").css({"top" : "8px", "right" : "7px", "position" : "absolute", "height" : "24px", "width" : "26px", "background-image" : "url(http://s14.directupload.net/images/141021/cqz59o6t.png)", "background-repeat" : "no-repeat", "background-position" : "0px 0px"});
					$('#qt_chrome_info').mousePopup(new MousePopup(QT.Lang.get("export_window", "chrome")));
				}

				$("#qt_export_info").css({"top" : "8px", "left" : "7px", "position" : "absolute", "height" : "24px", "width" : "26px", "background-image" : "url(http://s14.directupload.net/images/141014/3wmopfj5.png)", "background-repeat" : "no-repeat", "background-position" : "0px 0px"});
				$("#qt_export_ajax").css({"display" : "none", "background" : "url(https://gpde.innogamescdn.com/images/game/ajax-loader_2.76.gif) no-repeat scroll center center rgba(0, 0, 0, 0.5)", "position" : "absolute", "width" : "100%", "height" : "100%", "z-index" : "1000"});
				$("#qt_export_container fieldset").css({"border" : "2px groove #fc6"});
				$("#qt_export_content").css({"padding" : "0 10px 10px", "border" : "0 none"});
				$("#qt_canvas").css({"height" : "352px", "overflow-y" : "auto"});
				$("#qt_export_footer").css({"position" : "absolute", "bottom" : "-3px", "text-align" : "center", "width" : "868px", "z-index" : "5"});
				$("#qt_export_btn").css({"margin-top" : "9px"});

				$('#qt_export_info').mousePopup(new MousePopup(QT.Lang.get("export_window", "info")));


				$("#qt_export_btn").click(function () {
					QT.Helper.Screenshot.upload($("#qt_canvas :first"));
				});
			},
			replace_images : function (images) {
				$.each(images, function( index, value ) {
					var JQelement = $("#qt_canvas "+value);
					if (JQelement.length != 0) {
						var re = new RegExp("https://gp"+mID+".innogamescdn.com","g");
						var url = JQelement.css("background-image").replace(re, 'https://'+wID+'.grepolis.com');
						JQelement.css( "background-image", url );
					}
				});
				$("#qt_canvas .big_horizontal_report_separator .report_booty_bonus_fight").css({"background-image" : "none"});
			},
			upload : function (element) {

				$("#qt_export_ajax").show();

				/*$.ajax({
					url: 'https://api.imgur.com/3/credits.json',
					type: 'GET',
					headers: {
						Authorization: 'Client-ID ed9c3c98c1f5bba'
					},
					dataType: 'json'
				}).done(function (data) {
					console.log(data);
					$("#qt_export_ajax").hide();
				});*/

				html2canvas(element, {
					onpreloaded: function() {
						$("#qt_canvas").css({"overflow-y":"visible"});
					},
					onrendered: function(canvas) {
						$("#qt_canvas").css({"overflow-y":"auto"});

						var image = new Image();
						image.src = document.getElementById("myCanvas").toDataURL();
						image.onload = function() {
							var ctx = canvas.getContext("2d");
							ctx.drawImage(image, 0, 3);

							var img;
							try {
								img = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
							} catch(e) {
								img = canvas.toDataURL().split(',')[1];
							}

							$.ajax({
								url: 'https://api.imgur.com/3/upload.json',
								type: 'POST',
								headers: {
									Authorization: 'Client-ID ed9c3c98c1f5bba'
								},
								data: {
									type: 'base64',
									name: 'quack_toolsammlung.jpg',
									title: 'Grepolis - Quack Toolsammlung',
									description: 'Powered by http://www.grepolisqt.de',
									image: img
								},
								dataType: 'json'
							}).done(function (data) {
								$("#qt_export_ajax").hide();
								var image_url;
								if (mID == "de") {
									image_url = 'http://de.grepolisqt.de/image-de/' + data.data.id;
								} else {
									image_url = 'http://en.grepolisqt.de/image-en/' + data.data.id;
								}

								if(/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())){
									window.open(image_url, '_blank', 'width=1000,height=600');
								} else {
									window.open(image_url, '_blank');
								}

							}).fail(function() {
								$("#qt_export_ajax").hide();
								Layout.dialogWindow.open(QT.Lang.get("export_window", "connection_fail_text"), "Quack Toolsammlung", 300, 150, function () {}, !0)
							});
						};
					}
				});

			}
		},
		mutationobserver : function () {
			var observer = new MutationObserver(function (mutations) {
					mutations.forEach(function (mutation) {
						if (mutation.addedNodes[0]) {
							if (mutation.addedNodes[0].id === "town_groups_list") {
								if (QT.Settings.values.qmenu_settings_stadtliste)
									QT.Functions.townslist();
								QT.Functions.fix_Zindex();
							}
						}
					});
				});
			observer.observe($('body').get(0), {
				attributes : false,
				childList : true,
				characterData : false
			});
		},
		addWindowTypes : function () {
			//BB-Codes
			function WndHandlerQTbbcode(wndhandle) {
				this.wnd = wndhandle;
			}
			Function.prototype.inherits.call(WndHandlerQTbbcode, WndHandlerDefault);
			WndHandlerQTbbcode.prototype.getDefaultWindowOptions = function () {
				return {
					position : ["center", "center"],
					width : 700,
					height : 330,
					minimizable : true,
					title : "BB-Code"
				};
			};
			GPWindowMgr.addWndType("QT_BBCODE", "qtbbcode", WndHandlerQTbbcode, 1);
			//Grepo Stats
			function WndHandlerQTgrepostats(wndhandle) {
				this.wnd = wndhandle;
			}
			Function.prototype.inherits.call(WndHandlerQTgrepostats, WndHandlerDefault);
			WndHandlerQTgrepostats.prototype.getDefaultWindowOptions = function () {
				return {
					position : ["center", "center"],
					width : 972,
					height : 565,
					minimizable : true,
					title : "Grepo Stats"
				};
			};
			GPWindowMgr.addWndType("QT_GREPOSTATS", "qtgs", WndHandlerQTgrepostats, 1);
			//Grepo Intel
			function WndHandlerQTgrepointel(wndhandle) {
				this.wnd = wndhandle;
			}
			Function.prototype.inherits.call(WndHandlerQTgrepointel, WndHandlerDefault);
			WndHandlerQTgrepointel.prototype.getDefaultWindowOptions = function () {
				return {
					position : ["center", "center"],
					width : 1013,
					height : 565,
					minimizable : true,
					title : "Grepo Intel"
				};
			};
			GPWindowMgr.addWndType("QT_GREPOINTEL", "qtgi", WndHandlerQTgrepointel, 1);
			//Server Maps
			function WndHandlerQTservermaps(wndhandle) {
				this.wnd = wndhandle;
			}
			Function.prototype.inherits.call(WndHandlerQTservermaps, WndHandlerDefault);
			WndHandlerQTservermaps.prototype.getDefaultWindowOptions = function () {
				return {
					position : ["center", "center"],
					width : 1038,
					height : 565,
					minimizable : true,
					title : "Server Map"
				};
			};
			GPWindowMgr.addWndType("QT_SERVERMAPS", "qtservermaps", WndHandlerQTservermaps, 1);
			//Townsearches
			function WndHandlerQTtownsearches(wndhandle) {
				this.wnd = wndhandle;
			}
			Function.prototype.inherits.call(WndHandlerQTtownsearches, WndHandlerDefault);
			WndHandlerQTtownsearches.prototype.getDefaultWindowOptions = function () {
				return {
					position : ["center", "center"],
					width : 972,
					height : 565,
					minimizable : true,
					title : "Townsearch"
				};
			};
			GPWindowMgr.addWndType("QT_TOWNSEARCHES", "qttownsearches", WndHandlerQTtownsearches, 1);
			//Bashlists
			function WndHandlerQTbashlists(wndhandle) {
				this.wnd = wndhandle;
			}
			Function.prototype.inherits.call(WndHandlerQTbashlists, WndHandlerDefault);
			WndHandlerQTbashlists.prototype.getDefaultWindowOptions = function () {
				return {
					position : ["center", "center"],
					width : 972,
					height : 563,
					minimizable : true,
					title : "Bashlist"
				};
			};
			GPWindowMgr.addWndType("QT_BASHLISTS", "qtbashlists", WndHandlerQTbashlists, 1);
			//Scriptmanager
			function WndHandlerQTscriptmanager(wndhandle) {
				this.wnd = wndhandle;
			}
			Function.prototype.inherits.call(WndHandlerQTscriptmanager, WndHandlerDefault);
			WndHandlerQTscriptmanager.prototype.getDefaultWindowOptions = function () {
				return {
					position : ["center", "center"],
					width : 750,
					height : 500,
					minimizable : true,
					title : "Scriptmanager"
				};
			};
			GPWindowMgr.addWndType("QT_SCRIPTMANAGER", "qtscriptmanager", WndHandlerQTscriptmanager, 1);
			//Stats&Scripts
			function WndHandlerQTstatsandscripts(wndhandle) {
				this.wnd = wndhandle;
			}
			Function.prototype.inherits.call(WndHandlerQTstatsandscripts, WndHandlerDefault);
			WndHandlerQTstatsandscripts.prototype.getDefaultWindowOptions = function () {
				return {
					position : ["center", "center"],
					width : 750,
					height : 500,
					minimizable : true,
					title : "Stats & Scripts"
				};
			};
			GPWindowMgr.addWndType("QT_STATSANDSCRIPTS", "qtstatsandscripts", WndHandlerQTstatsandscripts, 1);
			//Google Docs
			function WndHandlerQTgoogledocs(wndhandle) {
				this.wnd = wndhandle;
			}
			Function.prototype.inherits.call(WndHandlerQTgoogledocs, WndHandlerDefault);
			WndHandlerQTgoogledocs.prototype.getDefaultWindowOptions = function () {
				return {
					position : ["center", "center"],
					width : 852,
					height : 600,
					minimizable : true,
					title : "Google Docs"
				};
			};
			GPWindowMgr.addWndType("QT_GOOGLEDOCS", "qtgoogledocs", WndHandlerQTgoogledocs, 1);
			//Townoverview
			function WndHandlerQTtownoverview(wndhandle) {
				this.wnd = wndhandle;
			}
			Function.prototype.inherits.call(WndHandlerQTtownoverview, WndHandlerDefault);
			WndHandlerQTtownoverview.prototype.getDefaultWindowOptions = function () {
				return {
					position : ["center", "center"],
					height : 600,
					width : 800,
					minimizable : true,
					title : QT.Lang.get("grepo_mainmenu", "city_view")
				};
			};
			WndHandlerQTtownoverview.prototype.onClose = function () {
				$('#ui_box').append($('DIV.ui_city_overview')).append($('DIV.ui_construction_queue'));
				if ($("#minimap_canvas").hasClass('expanded')) {
					$.Observer(GameEvents.ui.bull_eye.radiobutton.strategic_map.click).publish({});
				} else {
					$.Observer(GameEvents.ui.bull_eye.radiobutton.island_view.click).publish({});
				}
			};
			GPWindowMgr.addWndType("QT_TOWNOVERVIEW", "qttownoverview", WndHandlerQTtownoverview, 1);
			//Report Export
			function WndHandlerQTreportexport(wndhandle) {
				this.wnd = wndhandle;
			}
			Function.prototype.inherits.call(WndHandlerQTreportexport, WndHandlerDefault);
			WndHandlerQTreportexport.prototype.getDefaultWindowOptions = function () {
				return {
					position : ["center", "center"],
					width : 850, //827
					height : 600, //733
					minimizable : true,
					fullwindow : true,
					title : "Report Export"
				};
			};
			GPWindowMgr.addWndType("QT_REPORTEXPORT", "qtreportexport", WndHandlerQTreportexport, 1);
			//Rest
			function WndHandlerQTstandard(wndhandle) {
				this.wnd = wndhandle;
			}
			Function.prototype.inherits.call(WndHandlerQTstandard, WndHandlerDefault);
			WndHandlerQTstandard.prototype.getDefaultWindowOptions = function () {
				return {
					position : ["center", "center"],
					height : 500,
					width : 750,
					minimizable : true,
					title : ""
				};
			};
			GPWindowMgr.addWndType("QT_STANDARD", "qtstandard", WndHandlerQTstandard, 1);
		}
	};

	/************************************************************************
	 * Functions
	 ***********************************************************************/
	QT.Functions = {
		academyMarker : function () {

			$(".academy").append('<div id="qacacountWrapper"><div id="qacacountGreen" class="qacacountBox">0</div><div id="qacacountRed" class="qacacountBox">0</div><a id="qacamarkResearched" class="qacaBTN green" href="#"></a><a id="qacamarkNotResearched" class="qacaBTN green" href="#"></a><a id="qacamarkNone" class="qacaBTN" href="#"></a></div>');

			/*var qacmarkDIV = '<div class="qacamark green" style="width: 100%; height: 100%; position: absolute; background: none repeat scroll 0% 0% green; top: -3px; left: -3px; border: 3px solid green; opacity: 0.4"></div>';

			$(".academy_info").css({
				"z-index" : "1"
			});*/

			$('#qacamarkResearched').mousePopup(new MousePopup(QT.Lang.get("academy", "researched")));
			$('#qacamarkNotResearched').mousePopup(new MousePopup(QT.Lang.get("academy", "notresearched")));
			$('#qacamarkNone').mousePopup(new MousePopup(QT.Lang.get("academy", "undo")));

			function resetSelected() {
				$(".qacamark").each(function () {
					$(this).remove();
				});
				researchPoints = {
					"red" : 0,
					"green" : 0,
					"blue" : 0
				};
				researchSelected = {};
				UpdateResearchPointsText();
				$("#qacamarkResearched").removeClass().addClass("qacaBTN green").css({
					"background-image" : "url(" + qacaBTNpics.qacamarkResearched[0] + ")"
				});
				$("#qacamarkNotResearched").removeClass().addClass("qacaBTN green").css({
					"background-image" : "url(" + qacaBTNpics.qacamarkNotResearched[0] + ")"
				});
			};
			function GetResearchColorPoints() {
				researchPoints = {
					"red" : 0,
					"green" : 0,
					"blue" : 0
				};
				$(".qacamark").each(function () {
					var thisColor = $(this).attr('class').split(' ').pop();
					researchPoints[thisColor] += GameData.researches[$(this).parent().attr('id').substr(17)].research_points;
				});
			};
			function UpdateResearchPointsText() {
				$("#qacacountRed").text(researchPoints.red);
				$("#qacacountGreen").text(researchPoints.green);
				$("#qacacountBlue").text(researchPoints.blue + "/120");
			};
			function SafeResearchColor() {
				$(".qacamark").each(function () {
					var thisColor = $(this).attr('class').split(' ').pop();
					researchSelected[$(this).parent().attr('id')] = thisColor;
				});
			};
			function ChangeAllResearchColors(researchselector, color) {
				$(".academy " + researchselector).each(function () {
					var thisParent = $(this).parent();
					if (!$(".qacamark", thisParent).length > 0 && color != "nocolor") {
						$(".academy_info", thisParent).after(qacmarkDIV);
					} else if (color === "nocolor") {
						$(".qacamark", thisParent).remove();
					}
					$(".qacamark", thisParent).removeClass().addClass("qacamark " + color).css({
						"background-color" : color,
						"border-color" : color
					});
				});
			};

			// Changes image and calls stuff
			$(".qacaBTN").click(function () {
				var thisColor = $(this).attr('class').split(' ').pop();
				if (this.id != "qacamarkNone") {

					if (thisColor === "green") {
						$(this).removeClass("green").addClass("red");
					} else if (thisColor === "red") {
						$(this).removeClass("red").addClass("nocolor");
					} else if (thisColor === "nocolor") {
						$(this).removeClass("nocolor").addClass("green");
					}

					if (this.id === "qacamarkResearched") {
						$(".tech_tree_box").addClass("researched_green");

						//ChangeAllResearchColors(".is_researched,.in_progress", thisColor);
					} else if (this.id === "qacamarkNotResearched") {
						//ChangeAllResearchColors(".inactive", thisColor);
					}

				} else {
					resetSelected();
				}
				GetResearchColorPoints();
				UpdateResearchPointsText();
				SafeResearchColor();
			});

			// Click on Unit image
			$( ".tech_tree_box" ).on( "click", ".research_icon", function() {
				var unit_class = $(this).attr('class').split(' ')[2];//get unit name
				$( ".tech_tree_box" ).toggleClass(unit_class);//toggle unit name as class
				researchSelected.push(unit_class);//push to array
				//$( ".tech_tree_box" ).data('units', researchSelected);
				//console.log($( ".tech_tree_box" ).data());
				// data-units='["a","b","c"]'
			});

			/*$(".academy_info").click(function () {
				var thisParent = $(this).parent();
				if ($(".qacamark", thisParent).length > 0) {
					var $this = $(".qacamark", thisParent);
					if ($this.hasClass("green")) {
						$this.removeClass("green").addClass("red").css({
							"background-color" : "red",
							"border-color" : "red"
						});
					} else if ($this.hasClass("red")) {
						$this.remove();
					}
				} else {
					$(".academy_info", thisParent).after(qacmarkDIV);
				}
				GetResearchColorPoints();
				UpdateResearchPointsText();
				SafeResearchColor();
			});*/

			//init
			if (typeof researchSelected == "undefined") {
				researchSelected = {};
				researchPoints = {
					"red" : 0,
					"green" : 0,
					"blue" : 0
				};
			} else {
				$.each(researchSelected, function (key, value) {
					$("#" + key + " .academy_info").after(qacmarkDIV);
					$("#" + key + " .qacamark").removeClass("green").addClass(value).css({
						"background-color" : value,
						"border-color" : value
					});
				});
				UpdateResearchPointsText();
			}

		},
		addsettingsbutton : function () {
			var b = GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_PLAYER_SETTINGS);
			if (!b)
				return;
			var c = $("DIV#gpwnd_" + b.getID() + " .settings-menu ul:last");
			if ($(c).find('#quack-toolsammlung').length == 0) {
				$(c[0]).append('<li><img id="quackicon" src="http://s1.directupload.net/images/130206/r2q9fzri.png"></img> <a id="quack-toolsammlung" href="#">Quack Toolsammlung</a></li>');
				$("#quack-toolsammlung").click(function () {
					QT.Functions.scriptmanager();
				})
			}
		},
		agoraIndexExport : function () {
			var b = GPWindowMgr.getOpen(Layout.wnd.TYPE_BUILDING);
			if (b.length == 0)
				return;
			wnd = b[b.length - 1];
			var c = wnd.getID();

			QT.Helper.Screenshot.btn_preview("DIV#gpwnd_" + c + " #place_defense .game_header", "qt_place_defense_export", "place_defense", function() {
				$("DIV#gpwnd_" + c + " #place_defense").clone().appendTo("#qt_canvas");

				$("#qt_canvas #place_defense").css({"padding-top":"1px"});
				$("#qt_canvas #place_defense .game_list").css({"max-height":"none", "min-height":"0px"});
				$("#qt_canvas .game_border").css({"margin":"2px 3px 2px"});
				$("#qt_canvas .game_list li").css({"padding":"4px 0 4px 2px"});

				var elemensToChange = [
				".game_list .even", ".game_list .odd", ".game_header", ".game_list_footer",
				".game_border_top", ".game_border_bottom", ".game_border_left", ".game_border_right", ".game_border_corner",
				".hero40x40, .unit_icon40x40"
				];
				return elemensToChange;
			});
		},
		agoraUnitsBeyondExport : function () {
			var b = GPWindowMgr.getOpen(Layout.wnd.TYPE_BUILDING);
			if (b.length == 0)
				return;
			wnd = b[b.length - 1];
			var c = wnd.getID();

			QT.Helper.Screenshot.btn_preview("DIV#gpwnd_" + c + " #place_defense .game_header", "qt_place_units_beyond_export", "place_units_beyond", function() {
				$("DIV#gpwnd_" + c + " #place_defense").clone().appendTo("#qt_canvas");

				$("#qt_canvas #place_defense").css({"padding-top":"1px"});
				$("#qt_canvas #place_defense .game_list").css({"max-height":"none", "min-height":"0px"});
				$("#qt_canvas .game_border").css({"margin":"2px 3px 2px"});
				$("#qt_canvas .game_list li").css({"padding":"4px 0 4px 2px"});
				$("#qt_canvas .qt_sendback_big").hide();
				$("#qt_canvas .qt_sendback_small").hide();

				var elemensToChange = [
				".game_list .even", ".game_list .odd", ".game_header", ".game_list_footer",
				".game_border_top", ".game_border_bottom", ".game_border_left", ".game_border_right", ".game_border_corner",
				".hero40x40, .unit_icon40x40"
				];
				return elemensToChange;
			});
		},
		agoraUnitsBeyondFromTownExport : function () {
			QT.Helper.Screenshot.btn_preview(".classic_window.place .support_overview .game_inner_box .game_header", "qt_place_units_beyond_from_town_export", "place_units_beyond_from_town", function() {
				$(".classic_window.place .support_overview .game_inner_box").clone().appendTo("#qt_canvas");

				$("#qt_canvas .game_inner_box").css({"max-height":"none", "min-height":"0px"});
				$("#qt_canvas .game_border").css({"margin":"2px 3px -15px"});
				$("#qt_canvas .unit_icon40x40").css({"border":"1px solid #724b08"});
				$("#qt_canvas .supporters_list .support_row").css({"padding":"5px 0 4px 6px"});
				$("#qt_canvas .support_row .units_list .count").css({
					"bottom" : "1px",
					"right" : "2px",
					"position" : "absolute"
				});
				$("#qt_canvas .outer_troops_send_part").hide();
				$("#qt_canvas .qt_sendback_big").hide();
				$("#qt_canvas .qt_sendback_small").hide();


				var elemensToChange = [
				".even", ".odd", ".brown", ".game_header", ".game_list_footer",
				".game_border_top", ".game_border_bottom", ".game_border_left", ".game_border_right", ".game_border_corner",
				".hero40x40, .unit_icon40x40"
				];
				return elemensToChange;
			});
			$("#qt_place_units_beyond_from_town_export").css({
				"top" : "3px",
				"right" : "3px"
			});
		},
		allianceStatsButtons : function (settings) {
			var b = settings.url.match(/alliance_id%22%3A(\d*)%2C/);
			var c = GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_ALLIANCE_PROFILE);
			if (!c)
				return;
			var d = $("DIV#gpwnd_" + c.getID() + " DIV#player_buttons ");
			$(d[0]).find(".ally_msg_leader, .ally_msg_founder").css({
				"float" : "left"
			});
			$(d[0]).append("<a target=_blank href=http://" + mID + ".grepostats.com/world/" + wID + "/alliance/" + b[1] + '><img src="http://s14.directupload.net/images/120328/kxn3oknc.png"></a>');
			if (mID === "de") {
				$(d[0]).append('<a target="_blank" href="http://marekblomkvist.com/quo/'+ wID +'/'+ b[1] +'"><img src="http://s7.directupload.net/images/140615/fhkhdsdc.png"></a>')
			}
		},
		allianceInactivity : function () {
			var a = QT.wnd.find("DIV#ally_towns A.gp_player_link");
			QT.Helper.Inactivity.loadDisplay(a, "margin:3px 4px 0 0;");
			var b = QT.wnd.find("DIV#ally_towns IMG.founder_icon");
			b.each(function (index, element) {
				var inactivitiy_diplay = $(this).parent().find(".qt_activity");
				$(this).insertAfter(inactivitiy_diplay);
			});
		},
		bbcodeBtnTown : function () {
			$('<a id="BTN_TownBB" href="#"></a><input id="INPUT_TownBB" type="text" onfocus="this.select();" onclick="this.select();">').appendTo('.town_name_area');
			$("#BTN_TownBB").click(function () {
				$("#INPUT_TownBB").toggle();
				$("#INPUT_TownBB").val("[town]" + Game.townId + "[/town]");
			});
		},
		bbcodes : function (mode) {
			var GD_units = GameData.units;
			var units_own = ITowns.getTown(parseInt(Game.townId)).units();
			var units_support = ITowns.getTown(parseInt(Game.townId)).unitsSupport();
			var units_outer = ITowns.getTown(parseInt(Game.townId)).unitsOuter();
			var cities_own = ITowns.towns_collection.models;
			var active_towngroup = ITowns.getActiveTownGroupId();
			var cities_towngroup = ITowns.town_group_towns.getTowns(active_towngroup);
			var bbcodeArray = [];
			var bbcodeBild = "[*]";
			var bbcodeAnzahl = "[*]";
			var bb_content = "";
			var bb_count = 0;
			var bb_windowtitle = "";
			if (mode === "bbcode_intown") {
				$.each(units_own, function (unit, number) {
					if (units_own[unit] != 0) {
						if (units_support[unit]) {
							number += units_support[unit];
						}
						bbcodeBild += "[img]" + QT.Images[unit] + "[/img][|]";
						bbcodeAnzahl += "[center]" + number + "[/center][|]";
						bbcodeArray.push("" + unit + "");
					}
				});
				$.each(units_support, function (unit, number) {
					if (units_support[unit] != 0 && bbcodeArray.indexOf(unit) == -1) {
						bbcodeBild += "[img]" + QT.Images[unit] + "[/img][|]";
						bbcodeAnzahl += "[center]" + number + "[/center][|]";
					}
				});
				bb_content = "[b]" + QT.Lang.get("bbcode", "troops") + " " + QT.Lang.get("bbcode", "in") + " [/b][town]" + parseInt(Game.townId) + "[/town]:\n[table]" + bbcodeBild.slice(0, -3) + bbcodeAnzahl.slice(0, -3) + "[/table]";
				bb_windowtitle = QT.Lang.get("bbcode", "troops") + " " + QT.Lang.get("bbcode", "in") + " " + Game.townName;
			} else if (mode === "bbcode_fromtown") {
				$.each(units_own, function (unit, number) {
					if (units_own[unit] != 0) {
						bbcodeBild += "[img]" + QT.Images[unit] + "[/img][|]";
						bbcodeAnzahl += "[center]" + number + "[/center][|]";
					}
				});
				bb_content = "[b]" + QT.Lang.get("bbcode", "troops") + " " + QT.Lang.get("bbcode", "from") + " [/b][town]" + parseInt(Game.townId) + "[/town]:\n[table]" + bbcodeBild.slice(0, -3) + bbcodeAnzahl.slice(0, -3) + "[/table]";
				bb_windowtitle = QT.Lang.get("bbcode", "troops") + " " + QT.Lang.get("bbcode", "from") + " " + Game.townName;
			} else if (mode === "bbcode_outer") {
				gpAjax.ajaxPost('units_beyond_info', 'get_supporting_units_for_foreigners', {}, false, function (data) {
					$.each(data.collections[0].data, function (index, object) {
						bb_content += "[town]" + object.current_town_id + "[town]";
						$.each(object, function (unit, number) {
							if (GD_units[unit] && number != 0) {
								bbcodeBild += "[img]" + QT.Images[unit] + "[/img][|]";
								bbcodeAnzahl += "[center]" + number + "[/center][|]";
							}
						});
					});
					bb_content = "[b]" + QT.Lang.get("bbcode", "troops") + " " + QT.Lang.get("bbcode", "outside") + " [/b][town]" + parseInt(Game.townId) + "[/town]:\n[table]" + bbcodeBild.slice(0, -3) + bbcodeAnzahl.slice(0, -3) + "[/table]";
					bb_windowtitle = QT.Lang.get("bbcode", "troops") + " " + QT.Lang.get("bbcode", "outside") + " " + Game.townName;
				});
			} else if (mode === "bbcode_buildings") {
				var buildings_levels = ITowns.getTown(parseInt(Game.townId)).buildings();
				var q_buildings = {};
				var q_buildings_special = {
					"trade_office" : "http://s1.directupload.net/images/130426/sivub4fd.png",
					"tower" : "http://s7.directupload.net/images/130426/wjbtzr8z.png",
					"thermal" : "http://s14.directupload.net/images/130426/9hzexzo7.png",
					"theater" : "http://s1.directupload.net/images/130426/daevkl33.png",
					"statue" : "http://s7.directupload.net/images/130426/67vl4qhs.png",
					"oracle" : "http://s7.directupload.net/images/130426/7jj7uzgp.png",
					"lighthouse" : "http://s14.directupload.net/images/130426/xanhmd6w.png",
					"library" : "http://s1.directupload.net/images/130426/3yl9yvuc.png"
				}
				var find_buildings_special = "trade_office tower thermal theater statue oracle lighthouse library";
				var lv_buildings_standard = "";
				var lv_buildings_special = "";
				$.each(GameData.buildings, function (building) {
					if (find_buildings_special.indexOf(building) > -1 && buildings_levels.getBuildingLevel(building) > 0) {
						lv_buildings_standard += "[img]" + q_buildings_special[building] + "[/img]";
						lv_buildings_special += "..." + buildings_levels.getBuildingLevel(building) + "...";
					}
					q_buildings[building] = ".." + buildings_levels.getBuildingLevel(building) + "...";
					if (buildings_levels.getBuildingLevel(building) < 10) {
						q_buildings[building] = "." + q_buildings[building];
					}
				});
				var lv_buildings_standard_reihenfolge =
					q_buildings.main +
					q_buildings.lumber +
					q_buildings.farm +
					q_buildings.stoner +
					q_buildings.storage +
					q_buildings.ironer +
					q_buildings.barracks +
					q_buildings.temple +
					q_buildings.market +
					q_buildings.docks +
					q_buildings.academy +
					q_buildings.wall +
					q_buildings.hide +
					lv_buildings_special;
				var q_buildings_headline = Array(lv_buildings_standard_reihenfolge.length).join("-");
				bb_content = "[quote][b]" + QT.Lang.get("bbcode", "building") + " " + QT.Lang.get("bbcode", "in") + " [/b][town]" + parseInt(Game.townId) + "[/town]:\n[font=monospace]" + q_buildings_headline + "\n[img]http://s1.directupload.net/images/130426/vif5htpa.png[/img]" + lv_buildings_standard + "[size=8]" + lv_buildings_standard_reihenfolge.slice(0, -1) + "[/size][/font][/quote]";
				bb_windowtitle = QT.Lang.get("bbcode", "building") + " " + QT.Lang.get("bbcode", "in") + " " + Game.townName;
			} else if (mode === "bbcode_cities_all") {
				bb_content = "";
				bb_count = 0;
				$.each(cities_own, function (key, town) {
					bb_count++;
					bb_content += ""+ bb_count +". [town]" + town.id + "[/town] (" + town.attributes.points + ") " + town.attributes.island_x + "|" + town.attributes.island_y + "\n";
				});
				bb_windowtitle = QT.Lang.get("bbcode", "cities");
			} else if (mode === "bbcode_cities_grp") {
				var bb_content = "";
				bb_count = 0;
				$.each(cities_towngroup, function (key, town) {
					bb_count++;
					bb_content += ""+ bb_count +". [town]" + town.attributes.town_id + "[/town] (" + town.town_model.attributes.points + ") " + town.town_model.attributes.island_x + "|" + town.town_model.attributes.island_y + "\n";
				});
				bb_windowtitle = QT.Lang.get("bbcode", "cities");
			}
			var expRahmen_a = "<div class='inner_box'><div class='game_border'><div class='game_border_top'></div><div class='game_border_bottom'></div><div class='game_border_left'></div><div class='game_border_right'></div><div class='game_border_corner corner1'></div><div class='game_border_corner corner2'></div><div class='game_border_corner corner3'></div><div class='game_border_corner corner4'></div><div class='game_header bold' style='height:18px;'><div style='float:left; padding-right:10px;'></div>";
			var expRahmen_b = "</div><textarea id='expTextarea' style=\"height: 228px; width: 685px;\">";
			var expRahmen_c = "</textarea></div><div style='overflow-x: hidden; padding-left: 5px; position: relative;'></div></div></div>";
			var expTitel = "Copy & Paste";
			var wnd = GPWindowMgr.Create(GPWindowMgr.TYPE_QT_BBCODE) || GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_QT_BBCODE);
			wnd.setTitle(QT.Lang.get("qtoolbox", "bb_codes") + " - " + bb_windowtitle);
			wnd.setContent(expRahmen_a + expTitel + expRahmen_b + bb_content + expRahmen_c);
			$("#expTextarea").focus(function () {
				var that = this;
				setTimeout(function () {
					$(that).select();
				}, 10);
			});
		},
		city_view_btn : function () {
			$('#ui_box .nui_main_menu .middle .content ul li[data-option-id=messages]').removeClass("first");
			$('#ui_box .nui_main_menu .middle .content ul').not("ul li ul").prepend('<li data-option-id="cityview" class="messages main_menu_item first"><span class="content_wrapper"><span class="button_wrapper" style="opacity: 1;"><span class="button"><span class="icon" style="background:url(http://s14.directupload.net/images/140424/vbvnndai.png)"></span><span class="indicator" style="display: none;">0</span></span></span><span class="name_wrapper" style="opacity: 1;"><span class="name">' + QT.Lang.get("grepo_mainmenu", "city_view") + '</span></span></span></li>');
			$('#ui_box .nui_main_menu .middle .content ul').not("ul li ul").css({
				"height" : "+=34px"
			});

			function QT_island_overview() {
				$('#ui_box .nui_main_menu .middle .content ul li[data-option-id=cityview] .icon').css({
					"background" : "url(http://s14.directupload.net/images/140501/rwe2n26g.png) no-repeat",
					"top" : "8px",
					"left" : "5px"
				});
				$('#ui_box .nui_main_menu .middle .content ul li[data-option-id=cityview] .name').text(QT.Lang.get("grepo_mainmenu", "island_view"));
			}
			function QT_city_overview() {
				$('#ui_box .nui_main_menu .middle .content ul li[data-option-id=cityview] .icon').css({
					"background" : "url(http://s14.directupload.net/images/140424/vbvnndai.png) no-repeat",
					"top" : "6px",
					"left" : "6px"
				});
				$('#ui_box .nui_main_menu .middle .content ul li[data-option-id=cityview] .name').text(QT.Lang.get("grepo_mainmenu", "city_view"));
			}

			$.Observer(GameEvents.ui.bull_eye.radiobutton.city_overview.click).subscribe('QT_city_overview', function (e, data) {
				QT_island_overview();
			});

			$.Observer(GameEvents.ui.bull_eye.radiobutton.island_view.click).subscribe('QT_island_view', function (e, data) {
				QT_city_overview();
			});

			$.Observer(GameEvents.ui.bull_eye.radiobutton.strategic_map.click).subscribe('QT_strategic_map', function (e, data) {
				QT_city_overview();
			});

			$('#ui_box .nui_main_menu .middle .content ul li[data-option-id=cityview]').click(function () {
				if (!$("#ui_box .bull_eye_buttons .city_overview").hasClass('checked')) {
					$("#ui_box .bull_eye_buttons .city_overview").click();
				} else {
					$("#ui_box .bull_eye_buttons .island_view").click();
				}
			});
		},
		city_view_window : function () {
			$.Observer(GameEvents.ui.bull_eye.radiobutton.city_overview.click).subscribe('QT_city_overview_window', function (e, data) {
				var city_wnd = GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_QT_TOWNOVERVIEW);
				if (city_wnd) {
					city_wnd.setTitle(QT.Lang.get("grepo_mainmenu", "city_view") + " - " + Game.townName);
					return;
				}
				var html = '<div id="QT_townoverview"></div>';
				var wnd = GPWindowMgr.Create(GPWindowMgr.TYPE_QT_TOWNOVERVIEW) || GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_QT_TOWNOVERVIEW);
				wnd.setContent(html);
				wnd.setTitle(QT.Lang.get("grepo_mainmenu", "city_view") + " - " + Game.townName);
				var JQel = wnd.getJQElement();

				JQel.find(".gpwindow_content").css({
					"overflow" : "hidden",
					"border" : "1px solid black"
				});

				JQel.find('#QT_townoverview').append($('DIV.ui_city_overview')).append($('DIV.ui_construction_queue'));

				$('DIV.ui_construction_queue').css({
					"bottom":"-3px"
				});
				$('DIV.ui_city_overview .town_background').css({
					"transform":"translate(-597px, -315px)"
				});
			});

			$("#ui_box .bull_eye_buttons .rb_map").on("rb:change:value", function (e, value, old_value) {
				if (value === 'island_view' || value === 'strategic_map') {
					var wnd = GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_QT_TOWNOVERVIEW);
					if (!wnd)
						return;
					wnd.close();
				}
			});
		},
		city_view_windowTitle : function () {
			var wnd = GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_QT_TOWNOVERVIEW);
			if (wnd)
				wnd.setTitle(QT.Lang.get("grepo_mainmenu", "city_view") + " - " + Game.townName);
		},
		commandOverview : function (xhr) {
			var d = xhr.responseText.match(/{(.+)}/);
			var e = $.parseJSON("{" + d[1] + "}");
			if (e.json.data.total_commands.length > 0)
				$("#place_defense .game_border .game_header").html($("#place_defense .game_border .game_header").html().split(" (")[0] + " (" + e.json.data.total_commands + ")");
			if (e.json.data.commands.length > 0) {
				var f = {
					attack_land : 0,
					support : 0,
					attack_sea : 0,
					attack_spy : 0,
					farm_attack : 0,
					abort : 0,
					attack_takeover : 0,
					breakthrough : 0
				};
				for (var g = 0; g < e.json.data.commands.length; g++)
					f[e.json.data.commands[g].type]++;
				var h = $("div .support_filter");
				$(h[0]).mousePopup(new MousePopup(QT.Lang.get("command_ov", "commands") + ": " + f.attack_land));
				$(h[1]).mousePopup(new MousePopup(QT.Lang.get("command_ov", "commands") + ": " + f.support));
				$(h[2]).mousePopup(new MousePopup(QT.Lang.get("command_ov", "commands") + ": " + f.attack_sea));
				$(h[3]).mousePopup(new MousePopup(QT.Lang.get("command_ov", "commands") + ": " + f.attack_spy));
				$(h[4]).mousePopup(new MousePopup(QT.Lang.get("command_ov", "commands") + ": " + f.farm_attack));
				$(h[5]).mousePopup(new MousePopup(QT.Lang.get("command_ov", "commands") + ": " + f.abort));
				$(h[6]).mousePopup(new MousePopup(QT.Lang.get("command_ov", "commands") + ": " + f.attack_takeover));
				$(h[7]).mousePopup(new MousePopup(QT.Lang.get("command_ov", "commands") + ": " + f.breakthrough));
			}
		},
		commandOverviewExport : function () {
			var b = GPWindowMgr.getOpen(Layout.wnd.TYPE_TOWN_OVERVIEWS);
			if (b.length == 0)
				return;
			wnd = b[b.length - 1];
			var c = wnd.getID();

			QT.Helper.Screenshot.btn_preview("DIV#gpwnd_" + c + " #place_defense .game_header", "qt_commandoverviewexport", "command_overview", function() {
				$("DIV#gpwnd_" + c + " #command_overview").clone().appendTo("#qt_canvas");
				$("#qt_canvas .rename_command").remove();
				$("#qt_canvas .do_rename_command").remove();
				$("#qt_canvas #command_overview").css({"height":"auto"});
				$("#qt_canvas #command_overview li").removeAttr("id")

				$("#qt_canvas #command_overview .cmd_span").html(function(_, html) {
					return html.replace(/(\()/g, '<span>$1</span>').replace(/(\))/g, '<span>$1</span>');
				});

				var elemensToChange = [
				".game_list .even", ".game_list .odd",
				".hero25x25, .unit_icon25x25", ".attack_type32x32", ".overview_incoming.icon, .overview_outgoing.icon", ".game_arrow_delete", ".resource_iron_icon", ".power_icon16x16"
				];
				return elemensToChange;
			});
		},
		cultureOverview : function () {
			var a = $("ul#cultur_overview_towns");
			var b,
			c,
			d,
			e;

			e = 0;
			b = $('a[class~="confirm"][class~="type_triumph"]');
			d = $('a[class~="confirm"][class~="type_triumph"][class~="disabled"]');
			if (d.length > 0) {
				for (var f = 0; f < b.length; f++) {
					if ($(b[f]).attr("class").indexOf("disabled") > 1)
						continue;
					c = $(b[f]).parents('li[id^="ov_town_"]');
					eltext = c[0].previousSibling;
					$(c).insertBefore($(d[0]).parents('li[id^="ov_town_"]'));
					$(eltext).insertBefore($(d[0]).parents('li[id^="ov_town_"]'))
				}
			}

			e = 0;
			b = $('a[class~="confirm"][class~="type_theater"]');
			d = $('a[class~="confirm"][class~="type_theater"][class~="disabled"]');
			if (d.length > 0) {
				for (var f = 0; f < b.length; f++) {
					if ($(b[f]).attr("class").indexOf("disabled") > 1)
						continue;
					c = $(b[f]).parents('li[id^="ov_town_"]');
					eltext = c[0].previousSibling;
					$(c).insertBefore($(d[0]).parents('li[id^="ov_town_"]'));
					$(eltext).insertBefore($(d[0]).parents('li[id^="ov_town_"]'))
				}
			}

			e = 0;
			b = $('a[class~="confirm"][class~="type_party"]');
			d = $('a[class~="confirm"][class~="type_party"][class~="disabled"]');
			if (d.length > 0) {
				for (var f = 0; f < b.length; f++) {
					if ($(b[f]).attr("class").indexOf("disabled") > 1)
						continue;
					c = $(b[f]).parents('li[id^="ov_town_"]');
					eltext = c[0].previousSibling;
					$(c).insertBefore($(d[0]).parents('li[id^="ov_town_"]'));
					$(eltext).insertBefore($(d[0]).parents('li[id^="ov_town_"]'))
				}
			}

			var g = $("ul#culture_overview_towns span.eta");
			var h = $("#culture_points_overview_bottom #place_culture_count").text();
			if (h.indexOf("[") < 1) {
				var i = h.split("/");
				var j = parseInt(i[0]) + g.length;
				var k = parseInt(i[1]) - j;
				if (k > 0) {
					$("#culture_points_overview_bottom #place_culture_count").append("<span id='qculture'>[-" + k + "]</span>");
				} else {
					var l = new Array;
					for (var f = 0; f < g.length; f++)
						l.push($(g[f]).text());
					l.sort();
					var m = l[l.length + k - 1];
					$("#culture_points_overview_bottom #place_culture_count").append(" [<span id='qculture'></span>]<span id='qcultureplus' style='color: #ECB44D'> +" + k * -1 + "</span>").find("span#qculture").countdown(m);
				}
			} else {
				var i = h.split("/");
				var j = parseInt(i[0]) + g.length;
				var k = parseInt(i[1]) - j;
				if (k > 0) {
					$("#qculture").text("[-" + k + "]");
				} else {
					CultureOverview.wnd.reloadContent();
				}
			}

			if ($('#qcultureBTN_wrapper').length == 0) {
				$("#culture_overview_wrapper").parent().append('<div id="qcultureBTN_wrapper"><div class="qcultureBTN_wrapper_right"><div id="qcultureBTN_theather_r" class="qcultureBTN_r qcultureBTN_theather"></div><div id="qcultureBTN_triumph_r" class="qcultureBTN_r qcultureBTN_triumph"></div><div id="qcultureBTN_olympicgames_r" class="qcultureBTN_r qcultureBTN_olympicgames"></div><div id="qcultureBTN_cityfestival_r" class="qcultureBTN_r qcultureBTN_cityfestival"></div></div></div>');
				//<div class="qcultureBTN_wrapper_left"><div id="qcultureBTN_theather_l" class="qcultureBTN_l qcultureBTN_theather"></div><div id="qcultureBTN_triumph_l" class="qcultureBTN_l qcultureBTN_triumph"></div><div id="qcultureBTN_olympicgames_l" class="qcultureBTN_l qcultureBTN_olympicgames"></div><div id="qcultureBTN_cityfestival_l" class="qcultureBTN_l qcultureBTN_cityfestival"></div></div>
				$("#culture_overview_wrapper").css({
					"top" : "35px",
					"height" : "370px"
				});
				$("#qcultureBTN_wrapper").css({

					"color" : "white",
					"font-family" : "Verdana",
					"font-weight" : "bold",
					"font-size" : "12px",
					"text-align" : "center",
					"line-height" : "25px",
					"text-shadow" : "1px 1px 0 #000000"
				});
				$(".qcultureBTN_wrapper_left").css({
					"position" : "absolute",
					"top" : "0px",
					"left" : "0px",
					"margin-left" : "7px"
				});
				$(".qcultureBTN_wrapper_right").css({
					"position" : "absolute",
					"top" : "0px",
					"right" : "0px"
				});
				$(".qcultureBTN_l, .qcultureBTN_r").css({
					"cursor" : "pointer",
					"width" : "25px",
					"height" : "25px",
					"float" : "right",
					"position" : "relative",
					"margin-left" : "3px",
					"border" : "2px groove gray",
					"background" : "url(http://s7.directupload.net/images/140221/lztu5tha.png)"
				});
				$(".qcultureBTN_cityfestival").css({
					"background-position" : "0 -100px"
				});
				$(".qcultureBTN_olympicgames").css({
					"background-position" : "0 -25px"
				});
				$(".qcultureBTN_triumph").css({
					"background-position" : "0 -75px"
				});
				$(".qcultureBTN_theather").css({
					"background-position" : "0 -50px"
				});
				var qcultureBTN_r_clicked_last = "";
				function hideTownElements(JQelement) {
					var qcultureBTN_mode = "";
					switch (JQelement.id) {
					case "qcultureBTN_cityfestival_r":
						qcultureBTN_mode = "ul li:eq(0)";
						break;
					case "qcultureBTN_olympicgames_r":
						qcultureBTN_mode = "ul li:eq(1)";
						break;
					case "qcultureBTN_triumph_r":
						qcultureBTN_mode = "ul li:eq(2)";
						break;
					case "qcultureBTN_theather_r":
						qcultureBTN_mode = "ul li:eq(3)";
						break;
					default:
						HumanMessage.error("Error");
						break;
					}
					if (qcultureBTN_r_clicked_last === JQelement.id) {
						$("ul#culture_overview_towns li").filter(function () {
							return !!$(qcultureBTN_mode, this).find('.eta').length;
						}).toggle();
						$(JQelement).toggleClass("culture_red");
					} else {
						$("ul#culture_overview_towns li").show().filter(function () {
							return !!$(qcultureBTN_mode, this).find('.eta').length;
						}).hide();
						$(".qcultureBTN_r").removeClass("culture_red");
						$(JQelement).addClass("culture_red");
					}
					qcultureBTN_r_clicked_last = JQelement.id;
					$(".qcultureBTN_r").css({
						border : "2px groove #808080"
					});
					$(".culture_red").css({
						border : "2px groove #CC0000"
					});
				}
				$(".qcultureBTN_r").click(function () {
					hideTownElements(this);
				});
				/*
				function hideCelebrationElements (JQelement) {
				$(".qcultureBTN_r").css({border: "2px groove #808080"});
				$(".culture_red").css({border: "2px groove #CC0000"});
				$("ul#culture_overview_towns li ul.celebration_wrapper li:nth-child(2)").hide();
				$("ul#culture_overview_towns li ul.celebration_wrapper li:nth-child(4)").hide();
				}
				$(".qcultureBTN_l").click(function () {
				hideCelebrationElements(this);
				});*/
			}

			var qcultureCounter = {
				cityfestivals : 0,
				olympicgames : 0,
				triumph : 0,
				theather : 0
			};

			var qbashpoints = $("#culture_points_overview_bottom .points_count").text().split("/");
			var qgoldforgames = Math.floor($("#ui_box .gold_amount").text() / 50);
			qcultureCounter.triumph = Math.floor((parseInt(qbashpoints[0]) - parseInt(qbashpoints[1])) / 300) + 1;
			if (qcultureCounter.triumph < 0) {
				qcultureCounter.triumph = 0;
			}
			qcultureCounter.cityfestivals = $('a[class~="confirm"][class~="type_party"]:not(.disabled)').length;
			qcultureCounter.olympicgames = $('a[class~="confirm"][class~="type_games"]:not(.disabled)').length;
			if (qgoldforgames < qcultureCounter.olympicgames) {
				qcultureCounter.olympicgames = qgoldforgames;
			}
			qcultureCounter.theather = $('a[class~="confirm"][class~="type_theater"]:not(.disabled)').length;

			$("#qcultureBTN_cityfestival_r").text(qcultureCounter.cityfestivals);
			$("#qcultureBTN_olympicgames_r").text(qcultureCounter.olympicgames);
			$("#qcultureBTN_triumph_r").text(qcultureCounter.triumph);
			$("#qcultureBTN_theather_r").text(qcultureCounter.theather);
			$(".qcultureBTN_cityfestival").mousePopup(new MousePopup(QT.Lang.get("culture", "cityfestivals")));
			$(".qcultureBTN_olympicgames").mousePopup(new MousePopup(QT.Lang.get("culture", "olympicgames")));
			$(".qcultureBTN_triumph").mousePopup(new MousePopup(QT.Lang.get("culture", "triumph")));
			$(".qcultureBTN_theather").mousePopup(new MousePopup(QT.Lang.get("culture", "theater")));
			//$("ul#culture_overview_towns li ul.celebration_wrapper li:nth-child(2)").hide();

		},
		farmingvillageshelper : {
			rememberloot : function () {
				var activeFarmClass = $('#time_options_wrapper .active').attr('class').split(' ');
				activeFarm = activeFarmClass[1];
			},
			setloot : function () {
				setTimeout(function () {
					$('#time_options_wrapper .' + activeFarm).click();
				}, 500);
			},
			islandHeader : function () {
				$('#fto_town_list li').each(function( index ) {
					if (this.classList.length == 2) {
						$(this).addClass("q_li_island");
						$(this).append(
						'<div class="qcolordivider" style="background-image: url(http://s14.directupload.net/images/140805/wqknyseg.png); display: block; height: 24px; margin: -4px -2px;"></div>' +
						'<div class="checkbox_new checked disabled" style="position: absolute; right: 2px; top: 5px"><div class="cbx_icon"></div></div>'
						);
						$(this).find("span").css({
							"margin-left" : "2px"
						});
						$(this).find("a").css({
							"color" : "rgb(238, 221, 187)"
						});
					}
				});
				$('.qcolordivider').click(function () {
					var el = $(this).parent().nextUntil(".q_li_island");
					if ($('#fto_town_list li:first[style*="border-right"]').length == 0) {
						el.slideToggle();
					} else {
						el.toggleClass("hidden");
					}
				});
				$("#fto_town_wrapper .game_header").append('<a href="#" id="q_toggleAutohide" style="top: 6px; right: 5px; position: absolute; height: 11px; width: 17px; background-image: url(http://s14.directupload.net/images/140807/bydwxdus.png)"></a>');
				if (!QT.Settings.values.qmenu_settings_farmhelper_hidecities) {
					$("#q_toggleAutohide").addClass('q_autoHideCitiesOff');
				}

				$("#q_toggleAutohide").click(function () {
					if (QT.Settings.values.qmenu_settings_farmhelper_hidecities) {
						QT.Settings.save("qmenu_settings_farmhelper_hidecities", false);
					} else {
						QT.Settings.delete("qmenu_settings_farmhelper_hidecities");
					}
					QT.Settings.values.qmenu_settings_farmhelper_hidecities = !QT.Settings.values.qmenu_settings_farmhelper_hidecities;
					$(this).toggleClass('q_autoHideCitiesOff');
				});
				$('<style type="text/css">#fto_town_list li.active {background: rgba(208, 190, 151, 0.60)} .q_autoHideCitiesOff {background-position: 0px -11px}</style>').appendTo('head');
			},
			indicateLoot : function () {
				var activeIsland = $('#fto_town_list li.active').prevAll(".q_li_island").first();
				activeIsland.find("div.checkbox_new").removeClass("disabled");
				if (QT.Settings.values.qmenu_settings_farmhelper_hidecities) {
					activeIsland.find("div.qcolordivider").trigger( "click" );
				}
			},
			switchTown : function (direction) {
				var el;
				if (direction === "up") {
					el = $('#fto_town_list li.active').prevAll("li:not(.q_li_island):visible").first();
				} else {
					el = $('#fto_town_list li.active').nextAll("li:not(.q_li_island):visible").first();
				}
				el.click();
				if (el.get(0)) {
					el.get(0).scrollIntoView();
					var scrollPosition = el.get(0).parentNode.scrollTop;
					var scrollMax = scrollPosition += 405;
					var scrollContainer = el.get(0).parentNode.scrollHeight;
					if (scrollMax != scrollContainer) {
						el.get(0).parentNode.scrollTop -= 160;
					}
				}
			}
		},
		fix_Zindex : function () {
			var index_highest = parseInt($("#town_groups_list").css("z-index"), 10);
			$(".ui-dialog").each(function () {
				var index_current = parseInt($(this).css("z-index"), 10);
				if (index_current > index_highest) {
					index_highest += index_current;
				}
			});
			$("#town_groups_list").css({
				"z-index" : index_highest
			})
		},
		forumDeleteMultiple : function () {
			if ($('#forum #postlist').length) {
				if (!$('.qdeletecheckbox').length) {
					$("div.post_functions:not(:first)").each(function( index ) {
						if ($(this).find('a').length > 2) {
							$(this).append('<input class="qdeletecheckbox" type="checkbox">');
						}
					});
				}
				if (!$('#qdeleteAllcheckbox').length && $('.qdeletecheckbox').length) {
					if ($('div.forum_footer').length) {
						$("div.forum_footer").append('<input id="qdeleteAllcheckbox" type="checkbox"  style="margin-right: -7px; margin-left: 25px">');
					} else {
						$("div.game_list_footer").append('<input id="qdeleteAllcheckbox" type="checkbox"  style="position: absolute; right: 6px;">');
					}
				}
				if (!$('#qdeletemultipleBTN').length && $('.qdeletecheckbox').length) {
					$('#forum_buttons').append('<a id="qdeletemultipleBTN" class="q_delete" href="#"></a>');
					$(".q_delete").css({
						"margin-top" : "2px",
						"margin-left" : "2px",
						"position" : "absolute",
						"height" : "23px",
						"width" : "22px",
						"background-image" : "url(http://s14.directupload.net/images/130725/sz66nazr.png)",
						"background-repeat" : "no-repeat",
						"background-position" : "0px 0px"
					});
					$(".q_delete").hover(
						function () {
						$(this).css({
							"background-position" : "0px -23px"
						});
					},
						function () {
						$(this).css({
							"background-position" : "0px 0px"
						});
					});
				}

				function AreAnyCheckboxesChecked() {
					var checkboxes = $("#forum #postlist :checkbox");
					var checkboxesChecked = 0;
					for (var i = 0; i < checkboxes.length; i++) {
						if (checkboxes[i].checked) {
							checkboxesChecked++
						}
					}
					return checkboxesChecked;
				}

				$('#qdeletemultipleBTN').click(function () {
					var numberChecked = AreAnyCheckboxesChecked();
					if (numberChecked > 0) {
						var deleteconfirmText = "<img style='position: absolute; top:5px;' src='http://s1.directupload.net/images/130724/d7ce2sy6.png'><span style='position: absolute; color: #141414; font: 21px TrajanPro; display: inline; letter-spacing: -5px; margin: -14px auto; padding-left: 0px; width: 22px;'><b>" + numberChecked + "</b></span><br/>" + QT.Lang.get("forum", "delete_sure") + "";
						hOpenWindow.showConfirmDialog('', deleteconfirmText, function () {
							$("#forum #postlist :checkbox:checked").each(function (i) {
								var self = this
									setTimeout(function () {
										var deleteonlick = $(self).parent().find("a:last").attr("onclick").slice(17, -1).split(",");
										Forum.deletePost(deleteonlick[0], deleteonlick[1], true, deleteonlick[3]);
									}, i * 500);
							});
						});
					} else {
						HumanMessage.error(QT.Lang.get("forum", "no_selection"));
					}
				});

				$('#qdeleteAllcheckbox').click(function () {
					$('#forum input[type="checkbox"]').prop('checked', this.checked)
				});

				$("#forum #postlist :checkbox").click(function () {
					if ($('#qdeleteAllcheckbox').is(":checked")) {
						$('#qdeleteAllcheckbox').prop('checked', false);
					} else if ($('#forum #postlist input[type="checkbox"]').not(":checked").length === 0) {
						$('#qdeleteAllcheckbox').prop('checked', true);
					}
				});
			}
		},
		forumMaximize : function () {
			var qmenu_forum_finder = $(".forum_content").parent().parent().parent();
			if (qmenu_forum_finder.find(".menu_inner").width() != 5000 && qmenu_forum_finder.find(".menu_inner").width() > 650) {
				var forumWidth = qmenu_forum_finder.find(".menu_inner").width();
				qmenu_forum_finder.css({
					"margin-left" : 0 - (forumWidth - 810) / 2 - 85,
					"width" : forumWidth + 170
				});
				qmenu_forum_finder.find(".menu_inner").css({
					"position" : "static"
				});
				qmenu_forum_finder.find(".next").remove();
				qmenu_forum_finder.find(".prev").remove();
			}
			qmenu_forum_finder.find("#wrapper").css({
				"width" : "780px",
				"margin" : "0 auto"
			});
		},
		fullscreenmode : function () {
			$(".nui_toolbar, .nui_left_box, .nui_main_menu, .nui_right_box, .ui_resources_bar, .nui_units_box, .picomap_area, .gods_area, .toolbar_buttons, .tb_activities, .ui_quickbar, .town_name_area, .leaves, .minimized_windows_area, .btn_close_all_windows, #notification_area, #tutorial_quest_container, #island_quests_overview, #bug_reports_link, #BTN_HK").css('visibility', 'hidden');
			$('<div id="vb_back" style="position:absolute;cursor:pointer;z-index:1;top:1px;left:50%;border:1px solid #FFCC66;background-color:#2D5487"><img src=http://s14.directupload.net/images/120327/4tnvbg37.png></img></div>').appendTo("body");
			$("#vb_back").click(function () {
				$(".nui_toolbar, .nui_left_box, .nui_main_menu, .nui_right_box, .ui_resources_bar, .nui_units_box, .picomap_area, .gods_area, .toolbar_buttons, .tb_activities, .ui_quickbar, .town_name_area, .leaves, .minimized_windows_area, .btn_close_all_windows, #notification_area, #tutorial_quest_container, #island_quests_overview, #bug_reports_link, #BTN_HK").css('visibility', 'visible');
				$("#vb_back").remove();
			});
		},
		grepopoints : function () {
			var a = GPWindowMgr.getOpen(Layout.wnd.TYPE_BUILDING);
			if (a.length == 0)
				return;
			var wnd = a[a.length - 1];
			var wndID = wnd.getID();
			if ($("DIV#gpwnd_" + wndID).find("span.qt_points").length > 0 || $("DIV#gpwnd_" + wndID).find("span.qt_points_block").length > 0)
				return;

			var buildings_array = GameData.buildings;
			var queued_buildings_array = {};

			function calcPoints (level, val) {
				return Math.round(val.points * (Math.pow(val.points_factor, level)));
			}
			function calcDiff (level_old, level_new, val) {
				return calcPoints(level_new, val) - calcPoints(level_old, val);
			}

			$("DIV#gpwnd_" + wndID + " .queued_building_order").each(function () {
				var name = $(".item_icon", this).prop("class").split(/\s+/)[2];
				var level, points;
				if ($('SPAN.green', this).length) {
					level = parseInt($('SPAN.green', this).text(), 10);
					points = calcDiff(level-1, level, buildings_array[name]);
					points = (points === 0 ? "500" : points);
				} else if ($('SPAN.red', this).length) {
					level = parseInt($('SPAN.red', this).text(), 10);
					points = calcDiff(level+1, level, buildings_array[name]);
					points = (points === 0 ? "-500" : points);
				} else if ($('SPAN.arrow_green_ver', this).length) {
					level = parseInt($('DIV.building_level', this).text(), 10);
					points = calcDiff(level-1, level, buildings_array[name]);
					points = (points === 0 ? "500" : points);
				} else if ($('SPAN.arrow_red_ver', this).length) {
					level = parseInt($('DIV.building_level', this).text(), 10);
					points = calcDiff(level+1, level, buildings_array[name]);
					points = (points === 0 ? "-500" : points);
				}
				queued_buildings_array[name] = level;
				$(".item_icon", this).append('<span class="qt_points_block">' + points + ' P<\/span>');
			});

			$.each(buildings_array, function (key, val) {
				var b = $("DIV#gpwnd_" + wndID + " #building_main_" + key);
				if (b.length > 0) {
					var level;
					if (queued_buildings_array[key]) {
						level = queued_buildings_array[key];
					} else {
						level = parseInt($('.level', b).eq(0).text(), 10);
					}
					if (!isNaN(level) && val.points !== undefined) {
					console.log(key + " - Level " + level + ": " + val.points);
						if (level === 0) {
							$('.build:not(.tear_down), .build_grey:not(.tear_down)', b).append('<span class="qt_points"> (' + val.points + ' P)<\/span>');
						} else if (level < val.max_level && level > 0) {
							$('.build:not(.tear_down), .build_grey:not(.tear_down)', b).append('<span class="qt_points"> (' + calcDiff(level, level+1, val) + ' P)<\/span>');
							if (level - 1 >= 0) {
								$('.tear_down', b).append('<span class="qt_points"> (' + calcDiff(level, level-1, val) + ' P)<\/span>');
							}
						} else if (val.max_level === 1) {
							$('.tear_down', b).append('<span class="qt_points"> (-500 P)<\/span>');
						}
					}
				} else {
					var c = $("DIV#gpwnd_" + wndID + " #special_building_" + key).not(".special_tear_down");
					if (c.length > 0) {
						c.append('<span class="qt_points_block">' + val.points + ' P<\/span>');
					}

				}
			});
		},
		googledocs : function () {
			var html = $('<iframe />', {
					id : "googledocs_frame",
					src : "",
					style : "width:850px;height:506px;border:1px solid black;"
				});
			var wnd = GPWindowMgr.Create(GPWindowMgr.TYPE_QT_GOOGLEDOCS) || GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_QT_GOOGLEDOCS);
			wnd.setTitle("Google Docs");
			wnd.setContent(html);
			QT.Helper.grepo_input("margin-left:-5px;margin-top:3px;float:left", "googledocsURL_CHANGE_TEXTFELD", QT.Settings.values.googledocsurl).insertAfter('#googledocs_frame');
			QT.Helper.grepo_btn("googledocsURL_RESET_BUTTON", QT.Lang.get("googledocs", "reset")).insertAfter('#googledocs_frame');
			QT.Helper.grepo_btn("googledocsURL_CHANGE_BUTTON", QT.Lang.get("googledocs", "change_url")).insertAfter('#googledocs_frame');
			$("#googledocsURL_CHANGE_TEXTFELD").css({
				"width" : "580px"
			});
			$("#googledocsURL_CHANGE_BUTTON").css({
				"margin-right" : "0px",
				"margin-top" : "3px",
				"float" : "right"
			}).click(function () {
				QT.Settings.values.googledocsurl = $("#googledocsURL_CHANGE_TEXTFELD").val();
				setTimeout(function () {
					QT.Settings.save("googledocsurl", QT.Settings.values.googledocsurl);
				}, 0);
				document.getElementById('googledocs_frame').src = QT.Settings.values.googledocsurl;
			});
			$("#googledocsURL_RESET_BUTTON").css({
				"margin-top" : "3px",
				"float" : "right"
			}).click(function () {
				QT.Settings.values.googledocsurl = "https://docs.google.com/spreadsheet/ccc?key=0AkpTmTnKs72_dEF3bWs3SW5iWjdyUEE0M0c3Znpmc3c";
				QT.Settings.delete("googledocsurl");
				document.getElementById('googledocs_frame').src = QT.Settings.values.googledocsurl;
				document.getElementById('googledocsURL_CHANGE_TEXTFELD').value = QT.Settings.values.googledocsurl;
			});
			document.getElementById('googledocs_frame').src = QT.Settings.values.googledocsurl;
		},
		hidesIndexIron : function () {
			if ($('#hide_espionage').length == 0)
				return;
			var b = ITowns.getTown(parseInt(Game.townId)).getCurrentResources().iron;
			if (b > 15e3) {
				$("#hide_espionage :input").val(b - 15e3);
				setTimeout(function () {
					$("#hide_espionage :input").select().blur();
				}, 10);
			} else {
				$("#hide_espionage :input").val("");
				setTimeout(function () {
					$("#hide_espionage :input").select().blur();
				}, 10);
			}
		},
		hidesIndexAddPoints : function () {
			function addPoints(nStr) {
				nStr += '';
				x = nStr.split('.');
				x1 = x[0];
				x2 = x.length > 1 ? '.' + x[1] : '';
				var rgx = /(\d+)(\d{3})/;
				while (rgx.test(x1)) {
					x1 = x1.replace(rgx, '$1' + '.' + '$2');
				}
				return x1 + x2;
			}
			var hideSilver = $(".hide_storage_level").text();
			$(".hide_storage_level").text(addPoints(hideSilver));
		},
		hidesOverview : {
			init : function () {
				if ($("#hides_sort_control").length > 0 || (!QT.Settings.values.qmenu_settings_hidessilver && !QT.Settings.values.qmenu_settings_hidessort))
					return

				var silver_total = 0;
				var selection, order;
				var city_boxes = $("#hides_overview_towns").find(".town_item");

				function silverToInt (str) {
					return parseInt(str.split("/")[0].replace(/\D/g, "")) || 0;
				}

				if (QT.Settings.values.qmenu_settings_hidessilver) {
					for (var d = 0; d < city_boxes.length; d++) {
						var e = $(city_boxes[d]);
						silver_total += silverToInt(e.find(".hide_progressbar").text());
						var f = e.find(".iron");
						var g = Number(f.text().trim());
						var h = e.find("input");
						if (null != h.val() && g > 15e3) {
							h.val(g - 15e3).change();
							e.find(".iron_img").click();
							var i = HidesOverview.spinners[e.find(".iron_img").attr("name")];
							i.setValue(g - 15e3)
						}
					}
				}

				if (QT.Settings.values.qmenu_settings_hidessort) {
					if (silver_total === 0) {
						for (var a = 0; a < city_boxes.length; a++) {
							silver_total += silverToInt($(city_boxes[a]).find(".hide_progressbar").text());
						}
					}

					var sort_options = [
						["ironinstore", QT.Lang.get("caves", "stored_silver")],
						["name", QT.Lang.get("caves", "name")],
						["wood", QT.Lang.get("caves", "wood")],
						["stone", QT.Lang.get("caves", "stone")],
						["iron", QT.Lang.get("caves", "silver")]
					];
					QT.wnd.append('<div id="hides_sort_control" class="overview_search_bar"><div id="button_table_resize"></div>'+QT.Helper.grepo_dropdown("qsort_towns", sort_options)+QT.Helper.grepo_input("margin-top:0px","qsortfilterbox","")[0].outerHTML+'<div id="qsortinit" class="button_order_by active"></div><div id="hides_silver_total"><span class="resource_iron_icon iron"><span class="silver_amount">'+silver_total+'</span></span></div><div class="border"></div></div>');

					function table_resize_handler1() {
						$(this).addClass("active");
						$("#hides_overview_towns").addClass("q_resize");
						city_boxes.each(function( index ) {
							var iron_span_class = $(this).find(".box_content.res_box .iron SPAN:first-child").prop("class");
							if (iron_span_class == "res_rare") {
								$(this).find(".iron_img").append('<span class="q_res_rare"></span>');
							} else if (iron_span_class == "res_plenty") {
								$(this).find(".iron_img").append('<span class="q_res_plenty"></span>');
							}
						});
						$(this).one("click", table_resize_handler2);
					}

					function table_resize_handler2() {
						$(this).removeClass("active");
						$("#hides_overview_towns").removeClass("q_resize");
						city_boxes.find(".q_res_plenty, .q_res_rare").remove();
						$(this).one("click", table_resize_handler1);
					}

					$('#button_table_resize').one("click", table_resize_handler1);

					function isNumber(n) {
						return !isNaN(parseFloat(n)) && isFinite(n);
					}

					function setfilter(selection) {
						$('#hides_overview_towns>li').show();
						if (isNumber($('#qsortfilterbox').val())) {
							regexpRES = RegExp(/wood|stone|iron/);
							regexpInS = RegExp(/eta/);
							regexpNoT = RegExp(/gp_town_link/);
							numericfilter = parseInt($('#qsortfilterbox').val());
							$('#hides_overview_towns>li').each(function (i, e) {
								if (regexpRES.test(selection)) {
									selectedSort = parseInt($(e).find(selection).text()) || 0;
								} else if (regexpInS.test(selection)) {
									selectedSort = parseInt($(e).find(selection).text().substr(1)) || 0;
								} else {
									selectedSort = $(e).find(selection).text();
									if (!(selectedSort.indexOf(numericfilter) >= 0)) {
										$(e).hide();
									}
								}

								if (numericfilter > selectedSort) {
									$(e).hide();
								}
							});
						} else {
							namefilter = $('#qsortfilterbox').val();
							$('#hides_overview_towns>li').each(function (i, e) {
								townname = $(e).find('a.gp_town_link').text();
								if (namefilter.length > 0 && !(townname.indexOf(namefilter) >= 0)) {
									$(e).hide();
								}
							});
						}
					};

					function sort(selection) {
						order = !order;
						switch (selection) {
						case "ironinstore":
							selection = 'span.eta';
							break;
						case "name":
							selection = 'a.gp_town_link';
							break;
						case "wood":
							selection = 'span.wood span.count';
							break;
						case "stone":
							selection = 'span.stone span.count';
							break;
						case "iron":
							selection = 'span.iron span.count';
							break;
						}
						setfilter(selection);
						var qArrayUnsorted = $('#hides_overview_towns>li').get();
						qArrayUnsorted.sort(function (a, b) {
							regexpRES = RegExp(/wood|stone|iron/);
							regexpInS = RegExp(/eta/);
							if (regexpRES.test(selection)) {
								a = parseInt($(a).find(selection).text()) || 0;
								b = parseInt($(b).find(selection).text()) || 0;
							} else if (regexpInS.test(selection)) {
								a = parseInt($(a).find(selection).text().substr(1)) || 0;
								b = parseInt($(b).find(selection).text().substr(1)) || 0;
							} else {
								a = $(a).find(selection).text().toLowerCase();
								b = $(b).find(selection).text().toLowerCase();
								if (order) {
									return a.localeCompare(b);
								} else {
									return b.localeCompare(a);
								}
							}
							if (order) {
								return b - a
							} else {
								return a - b
							}
						});
						for (var i = 0; i < qArrayUnsorted.length; i++) {
							qArrayUnsorted[i].parentNode.appendChild(qArrayUnsorted[i]);
						}
					}

					$("#qsortinit").click(function () {
						sort($("#qsort_towns").val());
						$(this).toggleClass('active')
					});

				} else {
					if (silver_total != 0) {
						QT.wnd.append('<div id="hides_silver_total"><span class="resource_iron_icon iron"><span class="silver_amount">'+silver_total+'</span></span></div>');
						$('#hides_silver_total .resource_iron_icon').css({
							"position" : "absolute",
							"bottom" : "0px",
							"left" : "4px",
							"padding-left" : "25px",
							"font-size" : "10px"
						});
					}
				}
			},
			refresh_silver_total : function (xhr) {
				var JQ_silver_total = $('#hides_silver_total .silver_amount');
				var silver_total = parseInt(JQ_silver_total.text());
				var silver_stored = $.parseJSON(xhr.responseText).json.iron_stored;
				silver_total += silver_stored;
				JQ_silver_total.text(silver_total);
			}
		},
		hotkeys : function () {
			if (QT.Settings.values.qmenu_settings_hotkey_anzeige) {
				$('<a id="BTN_HK" style="z-index:6;position:absolute;top:3px;left:366px;" href="#"><img src="http://s14.directupload.net/images/131128/88q6ajaa.png" style="border-width: 0px" /></a></a>').appendTo('#ui_box');
				var mousePopupHTML = '<span style="margin-bottom:3px;display:inline-block"><b>' + QT.Lang.get("hotkeys", "hotkeys") + ':</b></span>';
				var mousePopupArray = {};
				mousePopupArray[QT.Lang.get("hotkeys", "city_select")] = [
					[QT.Images.hotkeys.city_select],
					["<span style='display:block;margin-top:-2px'>&#8592;</span>", QT.Lang.get("hotkeys", "last_city")],
					["<span style='display:block;margin-top:-2px'>&#8594;</span>", QT.Lang.get("hotkeys", "next_city")]
				];
				if (QT.Settings.values.qmenu_settings_hotkey_jump) {
					mousePopupArray[QT.Lang.get("hotkeys", "city_select")].push(['<span style="display:block;font-size:15px;margin-top:-4px">&#8629;</span>', QT.Lang.get("hotkeys", "jump_city")]);
				} else {
					mousePopupArray[QT.Lang.get("hotkeys", "city_select")].push(['<span style="display:block;font-size:9px;margin-top:2px">Sp</span>', QT.Lang.get("hotkeys", "jump_city")]);
				}
				//['<span style="display:block;font-size:15px;margin-top:-4px">'+(QT.Settings.values.qmenu_settings_hotkey_jump) ? "&#8629;","Sp" +'</span>', QT.Lang.get("hotkeys", "jump_city")]
				mousePopupArray[QT.Lang.get("hotkeys", "administrator")] = [
					[QT.Images.hotkeys.administrator],
					["1", QT.Lang.get("hotkeys", "trade_ov")],
					["2", QT.Lang.get("hotkeys", "command_ov")],
					["3", QT.Lang.get("hotkeys", "recruitment_ov")],
					["4", QT.Lang.get("hotkeys", "troop_ov")],
					["5", QT.Lang.get("hotkeys", "troops_outside")],
					["6", QT.Lang.get("hotkeys", "building_ov")],
					["7", QT.Lang.get("hotkeys", "culture_ov")],
					["8", QT.Lang.get("hotkeys", "gods_ov")],
					["9", QT.Lang.get("hotkeys", "cave_ov")],
					["0", QT.Lang.get("hotkeys", "city_groups_ov")],
					[(mID == 'de') ? "&szlig;" : "-", QT.Lang.get("hotkeys", "city_list")]
				];
				mousePopupArray[QT.Lang.get("hotkeys", "captain")] = [
					[QT.Images.hotkeys.captain],
					[(mID == 'de') ? "´" : "=", QT.Lang.get("hotkeys", "attack_planner")],
					["X", QT.Lang.get("hotkeys", "farming_villages")]
				];
				mousePopupArray[QT.Lang.get("hotkeys", "menu")] = [
					[QT.Images.hotkeys.menu],
					["S", QT.Lang.get("hotkeys", "city_view")],
					["N", QT.Lang.get("hotkeys", "messages")],
					["B", QT.Lang.get("hotkeys", "reports")],
					[(mID == 'fr') ? "Q" : "A", QT.Lang.get("hotkeys", "alliance")],
					["F", QT.Lang.get("hotkeys", "alliance_forum")],
					["E", QT.Lang.get("hotkeys", "settings")],
					["P", QT.Lang.get("hotkeys", "profile")],
					["R", QT.Lang.get("hotkeys", "ranking")],
					["M", QT.Lang.get("hotkeys", "notes")],
					["L", QT.Lang.get("hotkeys", "chat")]
				];
				if ($('.ui_heroes_overview_container').is(':visible')) {
					mousePopupArray[QT.Lang.get("hotkeys", "menu")].push(["H", QT.Lang.get("hotkeys", "council")]);
				}
				$.each(mousePopupArray, function (a, b) {
					mousePopupHTML += '<p/><span style="margin-bottom:-11px;margin-top:-8px;border-bottom:1px solid #B48F45; width:100%;display:block"><span style="display:inline-block;height:17px;width:17px;vertical-align:middle;margin-right:5px;background-image:url(' + b[0] + ')"></span><span style="display:inline-block;height:17px;vertical-align:middle">' + a + ':</span></span><br/>';
					$.each(b, function (c, d) {
						if (c === 0)
							return;
						mousePopupHTML += '<span style="display:inline-block;height:17px;width:17px;text-align:center;vertical-align:middle;margin-right:5px;background-image:url(' + QT.Images.hotkeys.key + ')"><span style="display:block;margin-top:-1px">' + d[0] + '</span></span><span style="display:inline-block;margin-bottom:1px;height:17px;vertical-align:middle">' + d[1] + '</span><br/>';
					});
				});
				$('#BTN_HK').mousePopup(new MousePopup(mousePopupHTML));
			}
			$(document).keydown(function (hk) {
				var notTheseOnes = ['textarea', 'input'];
				var target = hk.target.tagName.toLowerCase();
				//Stadt wechseln
				//if (hk.keyCode == 37 && $.inArray(target,notTheseOnes) < 0) {HelperTown.switchToPreviousTown();}
				//if (hk.keyCode == 39 && $.inArray(target,notTheseOnes) < 0) {HelperTown.switchToNextTown();}
				// Stadtsprung
				if (hk.keyCode == 13 && $.inArray(target, notTheseOnes) < 0 && QT.Settings.values.qmenu_settings_hotkey_jump) {
					WMap.mapJump({
						'id' :  + Game.townId,
						'ix' : WMap.islandPosition.x,
						'iy' : WMap.islandPosition.y
					});
				}
				if (hk.keyCode == 32 && $.inArray(target, notTheseOnes) < 0 && !QT.Settings.values.qmenu_settings_hotkey_jump) {
					WMap.mapJump({
						'id' :  + Game.townId,
						'ix' : WMap.islandPosition.x,
						'iy' : WMap.islandPosition.y
					});
				}
				// Verwalter
				if (hk.keyCode == 49 && $.inArray(target, notTheseOnes) < 0) {
					TownOverviewWindowFactory.openTradeOverview();
				}
				if (hk.keyCode == 50 && $.inArray(target, notTheseOnes) < 0) {
					TownOverviewWindowFactory.openCommandOverview();
				}
				if (hk.keyCode == 51 && $.inArray(target, notTheseOnes) < 0) {
					TownOverviewWindowFactory.openMassRecruitOverview();
				}
				if (hk.keyCode == 52 && $.inArray(target, notTheseOnes) < 0) {
					TownOverviewWindowFactory.openUnitsOverview();
				}
				if (hk.keyCode == 53 && $.inArray(target, notTheseOnes) < 0) {
					TownOverviewWindowFactory.openOuterUnitsOverview();
				}
				if (hk.keyCode == 54 && $.inArray(target, notTheseOnes) < 0) {
					TownOverviewWindowFactory.openBuildingsOverview();
				}
				if (hk.keyCode == 55 && $.inArray(target, notTheseOnes) < 0) {
					TownOverviewWindowFactory.openCultureOverview();
				}
				if (hk.keyCode == 56 && $.inArray(target, notTheseOnes) < 0) {
					TownOverviewWindowFactory.openGodsOverview();
				}
				if (hk.keyCode == 57 && $.inArray(target, notTheseOnes) < 0) {
					TownOverviewWindowFactory.openHidesOverview();
				}
				if (hk.keyCode == 48 && $.inArray(target, notTheseOnes) < 0) {
					//TownOverviewWindowFactory.openTownGroupOverview();
				}
				if (hk.keyCode == 63 && $.inArray(target, notTheseOnes) < 0 || hk.keyCode == 219 && $.inArray(target, notTheseOnes) < 0) {
					TownOverviewWindowFactory.openTownsOverview();
				}
				if (hk.keyCode == 192 && $.inArray(target, notTheseOnes) < 0 || hk.keyCode == 221 && $.inArray(target, notTheseOnes) < 0) {
					AttackPlannerWindowFactory.openAttackPlannerWindow();
				}
				if (hk.keyCode == 88 && $.inArray(target, notTheseOnes) < 0) {
					FarmTownOverviewWindowFactory.openFarmTownOverview();
				}
				// Andere
				if (hk.keyCode == 83 && $.inArray(target, notTheseOnes) < 0) {
					if (!$("#ui_box .bull_eye_buttons .city_overview").hasClass('checked')) {
						$("#ui_box .bull_eye_buttons .city_overview").click();
					} else {
						$("#ui_box .bull_eye_buttons .island_view").click();
					}
				}
				if (hk.keyCode == 82 && $.inArray(target, notTheseOnes) < 0) {
					RankingWindowFactory.openRankingWindow();
				}
				if (hk.keyCode == 66 && $.inArray(target, notTheseOnes) < 0) {
					Layout.wnd.Create(GPWindowMgr.TYPE_REPORT, ' ');
				}
				if (hk.keyCode == 78 && $.inArray(target, notTheseOnes) < 0) {
					Layout.wnd.Create(GPWindowMgr.TYPE_MESSAGE, ' ');
				}
				if (hk.keyCode == 65 && $.inArray(target, notTheseOnes) < 0) {
					Layout.wnd.Create(GPWindowMgr.TYPE_ALLIANCE);
				}
				if (hk.keyCode == 70 && $.inArray(target, notTheseOnes) < 0) {
					Layout.allianceForum.open();
				}
				if (hk.keyCode == 69 && $.inArray(target, notTheseOnes) < 0) {
					Layout.wnd.Create(GPWindowMgr.TYPE_PLAYER_SETTINGS, ' ');
				}
				if (hk.keyCode == 80 && $.inArray(target, notTheseOnes) < 0) {
					Layout.wnd.Create(GPWindowMgr.TYPE_PLAYER_PROFILE_EDIT, ' ');
				}
				if (hk.keyCode == 77 && $.inArray(target, notTheseOnes) < 0) {
					NotesWindowFactory.openNotesWindow();
				}
				if (hk.keyCode == 76 && $.inArray(target, notTheseOnes) < 0) {
					Layout.wnd.Create(GPWindowMgr.TYPE_CHAT, ' ');
				}
				if (hk.keyCode == 72 && $.inArray(target, notTheseOnes) < 0 && $('.ui_heroes_overview_container').is(':visible')) {
					HeroesWindowFactory.openHeroesWindow();
				}
				if (hk.keyCode == 38 && $(hk.target).find("ul#fto_town_list").length > 0) {
					QT.Functions.farmingvillageshelper.switchTown("up");
				}
				if (hk.keyCode == 40 && $(hk.target).find("ul#fto_town_list").length > 0) {
					QT.Functions.farmingvillageshelper.switchTown("down");
				}
				//Mit Enter Silber einlagern
				/*if (hk.keyCode == 13 && hk.target.id === "hide_order_input") {
				$("#hide_order_confirm").click();
				}*/
			});
		},
		islandAddPlayerlinks : function (xhr) {
			var b = GPWindowMgr.getOpen(Layout.wnd.TYPE_ISLAND);
			if (b.length == 0)
				return;
			wnd = b[b.length - 1];
			var c = wnd.getID();
			var d = $.parseJSON(xhr.responseText).json.json.town_list;
			var playerIdArray = [];
			$.each(d, function (key, town) {
				playerIdArray[town.player] = town.pid;
			});
			$("DIV#gpwnd_" + c + " DIV.island_info_left UL LI SPAN.player_name").each(function (index, element) {
				var name = $(this).text();
				var id = playerIdArray[name];
				if (id)
					$(this).html(QT.Helper.grepo_playerlink(name, id));
			});
		},
		islandFarmingVillages : function () {
			var b = GPWindowMgr.getOpen(Layout.wnd.TYPE_ISLAND);
			if (b.length == 0)
				return;
			wnd = b[b.length - 1];
			var c = wnd.getID();
			$("DIV#gpwnd_" + c + " DIV.center1").css({
				"left" : "229px",
				"width" : "476px",
				"top" : "0px"
			});
			$("DIV#gpwnd_" + c + " DIV.island_info_left").css({
				"bottom" : "0px",
				"left" : "0px",
				"position" : "absolute",
			});
			$("DIV#gpwnd_" + c + " DIV.island_info_left UL.game_list").css({
				"height" : "352px",
			});
			$("DIV#gpwnd_" + c + " DIV.island_info_right").css({
				"bottom" : "0px",
				"right" : "0px",
				"position" : "absolute",
			});
			$("DIV#gpwnd_" + c + " DIV.island_info_right UL.game_list").css({
				"height" : "382px",
			});
			if ($("DIV#gpwnd_" + c + " DIV.captain_commercial").is(":visible"))
				return;
			if (!$("DIV#gpwnd_" + c + " DIV.island_info_right UL.game_list li:first-child SPAN").hasClass("small player_name")) {
				$("DIV#gpwnd_" + c + " DIV.island_info_right UL.game_list").css({
					"height" : "100%",
				});
			}
			$("DIV#gpwnd_" + c + " DIV#farm_town_overview_btn").css({
				"top" : "486px",
			});
		},
		islandInactivity : function (xhr) {
			var a = $.parseJSON(xhr.responseText).json.json.town_list;
			var townInfoArray = {};
			for (var i = 0; i < a.length; i++) {
				townInfoArray[a[i]["id"]] = a[i]["pid"];
			}
			var b = QT.wnd.find("DIV.island_info_left UL LI A.gp_town_link");
			b.each(function () {
				var e = $(this).attr("href");
				var f = e.split(/#/);
				var g = $.parseJSON(atob(f[1] || f[0])).id;
				$(this).data("playerID", townInfoArray[g]);
			});
			QT.Helper.Inactivity.loadDisplay(b, "margin:3px 3px 0 0; float:left;", true);
		},
		islandMessage : function () {
			var b = GPWindowMgr.getOpen(Layout.wnd.TYPE_ISLAND);
			if (b.length == 0)
				return;
			wnd = b[b.length - 1];
			var c = wnd.getID();
			$("DIV#gpwnd_" + c + " DIV#island_towns_controls").append('<a id="q_message_island" class="q_message" href="#"></a>');
			$(".q_message").css({
				"margin-top" : "2px",
				"right" : "3px",
				"position" : "absolute",
				"height" : "23px",
				"width" : "22px",
				"background-image" : "url(http://s14.directupload.net/images/130417/4lhes4y6.png)",
				"background-repeat" : "no-repeat",
				"background-position" : "0px 0px"
			});
			$(".q_message").hover(
				function () {
				$(this).css({
					"background-position" : "0px -23px"
				});
			},
				function () {
				$(this).css({
					"background-position" : "0px 0px"
				});
			});
			$("DIV#gpwnd_" + c + " .q_message").click(function () {
				var spielernamen = "";
				$("DIV#gpwnd_" + c + " #island_info_towns_left_sorted_by_name li span.player_name").each(function () {
					if ($(this).text() != pName && $(this).text() != QT.Lang.get("messages", "ghosttown") && $(this).text() != QT.Lang.get("messages", "no_cities") + "." && spielernamen.indexOf($(this).text()) < 0) {
						spielernamen += $(this).text() + ";";
					}
				});
				Layout.newMessage.open({
					recipients : spielernamen
				});
			});
		},
		messageInputwidth : function () {
			$('#message_recipients').css({
				"width" : "630px"
			});
			$('#message_subject').css({
				"width" : "630px"
			});
			$('#message_buttons').css({
				"width" : "0px"
			});
			$('#message_buttons select').css({
				"position" : "absolute",
				"right" : "3px",
				"top" : "-24px",
				"z-index" : "1000"
			});
		},
		messageViewAll : function () {
			var wnd = GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_MESSAGE);
			var wndID = wnd.getID();
			if ($(".paginator_qt").is(":visible"))
				return;
			$("DIV#gpwnd_" + wndID + " DIV#message_message_list .paginator_bg:last").after('<a id="QT_viewAll" class="paginator_bg paginator_qt" href="javascript:void(0)">' + QT.Lang.get("messages", "all") + '</a>');
			var pages = $("DIV#gpwnd_" + wndID + " DIV#message_message_list .paginator_bg").not("#QT_viewAll").length;
			var params = {
				offset : 0,
				id : Message.id
			};
			function pagesLoad() {
				gpAjax.ajaxGet('message', 'view', params, true, function (return_data) {
					var elements = return_data.html;
					var found = $('.message_post', elements);
					$('#message_post_container').append(found);
					params.offset += 10;
					if (params.offset < pages * 10)
						pagesLoad();
				});
			}
			$("#QT_viewAll").click(function () {
				$('#message_post_container').empty();
				pagesLoad();
				var prevPage = $("#paginator_selected").text();
				var paginatorOnclick = "'message_message_list', " + prevPage + ", " + params.id + ", 'message', 'view'";
				$("#paginator_selected").replaceWith('<a class="paginator_bg" onclick="DeprecatedHelper.paginatorTabsGotoPage(' + paginatorOnclick + ')" href="javascript:void(0)">' + prevPage + '</a>');
				$("#QT_viewAll").replaceWith('<strong id="paginator_selected" class="paginator_bg paginator_qt">' + QT.Lang.get("messages", "all") + '</strong>');
			});
		},
		messageExport : function () {
			var wnd = GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_MESSAGE);
			var wndID = wnd.getID();
			if ($("#qt_messageExport").is(":visible"))
				return;
			$("DIV#gpwnd_" + wndID + " DIV#message_message_list .game_header:first").append('<div id="qt_messageExport" style="float:right; margin-top:-19px; cursor:pointer;"><img src="http://s14.directupload.net/images/140124/8tzken7v.png"/></div><div id="qt_messageExportTMP" style="display:none"></div>');
			$("#qt_messageExport").mousePopup(new MousePopup(QT.Lang.get("messages", "export")));
			$("#qt_messageExport").click(function () {
				var bb_content = "[quote]";
				var format_search = [
					/\<b\>(.*?)\<\/b\>/ig,
					/\<i\>(.*?)\<\/i\>/ig,
					/\<u\>(.*?)\<\/u\>/ig,
					/\<s\>(.*?)\<\/s\>/ig,
					/\<center\>(.*?)\<\/center\>/ig,
					/\<a class="bbcodes bbcodes_url".+href.+url=(.*?)%3A%2F%2F(.*?)".+\>(.*?)\<\/a>/ig,
					/\<span class="bbcodes bbcodes_town"\>\<a href=\"#(.*?)\".+\<\/span\>/ig,
					/\<img src="(.*?)" alt=""\>/ig,
					/\<span class="bbcodes bbcodes_color" style="color:(.*?)"\>(.*?)\<\/span\>/ig,
					/\<span class="bbcodes bbcodes_island"\>\<a href=\"#(.*?)\" .+\<\/span\>/ig,
					/\<table.+\<tbody\>(.*?)\<\/tbody\>\<\/table\>/ig,
					/\<tr\>\<td\>/ig,
					/\<tr\>\<th\>/ig,
					/\<\/td\>\<\/tr\>/ig,
					/\<\/th\>\<\/tr\>/ig,
					/\<\/td\>/ig,
					/\<\/th\>/ig,
					/\<td\>/ig,
					/\<th\>/ig
				];
				var format_replace = [
					'[b]$1[/b]',
					'[i]$1[/i]',
					'[u]$1[/u]',
					'[s]$1[/s]',
					'[center]$1[/center]',
					'[url=$1://$2]$3[/url]',
					replaceBBtowns,
					'[img]$1[/img]',
					'[color=$1]$2[/color]',
					replaceBBislands,
					'[table]$1[/table]',
					'[*]',
					'[**]',
					'[/*]',
					'[/**]',
					'[|]',
					'[||]',
					'',
					''
				];
				function replaceBBtowns(match, p1, offset, string) {
					var a = $.parseJSON(atob(p1));
					return '[town]' + a.id + '[/town]'
				};
				function replaceBBislands(match, p1, offset, string) {
					var a = $.parseJSON(atob(p1));
					return '[island]' + a.id + '[/island]'
				};

				$("#message_post_container .message_post").each(function (index, element) {
					var qt_messageExportTMP = $("#qt_messageExportTMP");
					qt_messageExportTMP.empty();
					$(this).clone().appendTo(qt_messageExportTMP);

					qt_messageExportTMP.find(".published_report").replaceWith("[report][/report]"); //replace reports
					qt_messageExportTMP.find(".bbcode_awards").replaceWith("[img]http://s1.directupload.net/images/140428/twuzm5vx.png[/img]"); //replace awards
					qt_messageExportTMP.find(".reservation_list").replaceWith(""); //remove reservations
					qt_messageExportTMP.find(".bbcodes_spoiler").replaceWith(function () { //replace spoiler
						$(this).find(".button").remove();
						return '[spoiler=' + $("b:first", this).text() + ']' + $(".bbcodes_spoiler_text", this).html() + '[/spoiler]';
					});
					qt_messageExportTMP.find(".bbcodes_quote").replaceWith(function () { //replace quotes
						return '[quote]' + $(".quote_message", this).html() + '[/quote]';
					});
					qt_messageExportTMP.find(".bbcodes_size").replaceWith(function () { //replace size
						return '[size=' + $(this)[0].style.fontSize + ']' + $(this).html() + '[/size]';
					});
					qt_messageExportTMP.find(".bbcodes_player").replaceWith(function () { //replace player
						return '[player]' + $(this).text() + '[/player]';
					});
					qt_messageExportTMP.find(".bbcodes_ally").replaceWith(function () { //replace ally
						return '[ally]' + $(this).text() + '[/ally]';
					});
					qt_messageExportTMP.find(".bbcodes_font").replaceWith(function () { //replace font
						return '[font=' + $(this).attr('class').split(' ').pop() + ']' + $(this).html() + '[/font]';
					});
					qt_messageExportTMP.find("script").remove(); //remove script tags

					var author = $(".message_poster .gp_player_link", this).text();
					var postDate = $(".message_poster .message_date", this).text().trim();
					bb_content += '[size=7][player]' + author + '[/player] ' + postDate + '[/size]\n';
					bb_content += '[img]http://s7.directupload.net/images/140502/izczcrte.png[/img]\n';
					var postHTML = $("#qt_messageExportTMP .message_post_content").html().trim();
					postHTML = postHTML.replace(/(\r\n|\n|\r|\t)/gm, ""); //remove line-breaks, tab characters
					postHTML = postHTML.replace(/<br\s*\/?>/mg, "\n"); //add line-breaks instead of <br>
					postHTML = postHTML.replace(/&nbsp;/mg, " ") //replace &nbsp
						for (var i = 0; i < format_search.length; i++) {
							postHTML = postHTML.replace(format_search[i], format_replace[i]);
						}
						bb_content += postHTML + "\n";
					bb_content += '[img]http://s1.directupload.net/images/140502/f3i4p5oy.png[/img]';
					bb_content += "\n";
				});

				bb_content = bb_content.slice(0, -1);
				bb_content += "[/quote]";

				var expRahmen_a = "<div class='inner_box'><div class='game_border'><div class='game_border_top'></div><div class='game_border_bottom'></div><div class='game_border_left'></div><div class='game_border_right'></div><div class='game_border_corner corner1'></div><div class='game_border_corner corner2'></div><div class='game_border_corner corner3'></div><div class='game_border_corner corner4'></div><div class='game_header bold' style='height:18px;'><div style='float:left; padding-right:10px;'></div>";
				var expRahmen_b = "</div><textarea id='expTextarea' style=\"height: 228px; width: 685px;\">";
				var expRahmen_c = "</textarea></div><div style='overflow-x: hidden; padding-left: 5px; position: relative;'></div></div></div>";
				var expTitel = "Copy & Paste";
				var BBwnd = GPWindowMgr.Create(GPWindowMgr.TYPE_QT_BBCODE) || GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_QT_BBCODE);
				BBwnd.setTitle(QT.Lang.get("qtoolbox", "bb_codes") + " - " + QT.Lang.get("bbcode", "messages"));
				BBwnd.setContent(expRahmen_a + expTitel + expRahmen_b + bb_content + expRahmen_c);
				$("#expTextarea").focus(function () {
					var that = this;
					setTimeout(function () {
						$(that).select();
					}, 10);
				});
			});
		},
		playerGSButton : function (settings) {
			var b = settings.url.match(/player_id%22%3A(\d*)%2C/);
			var c = GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_PLAYER_PROFILE);
			if (!c)
				return;
			var d = $("DIV#gpwnd_" + c.getID() + " DIV#player_buttons ");
			$(d[0]).append("<a target=_blank href=http://" + mID + ".grepostats.com/world/" + wID + "/player/" + b[1] + '><img src="http://s14.directupload.net/images/120328/kxn3oknc.png"></a>')
		},
		playerInactivity : function (settings) {
			var a = QT.wnd.find("DIV#player_info h3");
			var b = settings.url.match(/player_id%22%3A(\d*)%2C/);
			a.data("playerID", b[1]);
			QT.Helper.Inactivity.loadDisplay(a, "margin:7px 0 0 5px; float:right;", true);
		},
		qtoolbox : function () {
			$('#ui_box .nui_main_menu .leaves').hide();
			$('#ui_box .nui_main_menu .content ul li:last-child').removeClass("last");
			$('#ui_box .nui_main_menu .content ul li:last-child span.button_wrapper').css({
				"height" : "15px"
			});

			$('#ui_box .nui_main_menu .bottom').append('\
				<div id="qt_gtk_fix"></div>\
				<div id="qtbox_wrapper">\
					<div id="qt_mainmenu_top"><a id="qtbox_main_btn" href="#"></a></div>\
					<ol id="qt_mainmenu_list"></ol>\
					<div id="qt_border_bottom"></div>\
				</div>');

			if (!QT.Settings.values.grepolistoolkit) {
				$('#ui_box .nui_main_menu .content ul').css({
					"height" : "330px"
				});
				$('#ui_box .nui_main_menu .content ul').append('<li class="main_menu_item"></li>');
			} else {
				$('#ui_box .nui_main_menu .bottom').css({
					"bottom" : "-15px"
				});
				$('#qt_gtk_fix').css({
					"background" : "url(http://s14.directupload.net/images/141020/6zzbzb3l.png) no-repeat",
					"position" : "absolute",
					"top" : "-73px",
					"width" : "144px",
					"height" : "20px"
				});
				$('<style id="qt_gtk_fix" type="text/css">\
				.nui_main_menu .content ul li.last .button_wrapper {background: url("https://gpde.innogamescdn.com/images/game/layout/layout_2.71.png") no-repeat scroll -784px -162px rgba(0, 0, 0, 0); width: 20px; height: 18px}\
				.nui_main_menu .content ul li.last {height: 34px}\
				#ui_box .nui_main_menu .content ul {height: 381px !important}\
				#gtkMainMenu {height: 344px;}\
				</style>').appendTo('head');
			}

			$('#ui_box .nui_main_menu .bottom').css({
				"z-index" : "999"
			});
			$('#qtbox_wrapper').css({
				"position" : "absolute",
				"bottom" : "36px",
				"left" : "-2px",
				"z-index" : "1000"
			});
			$('#qt_mainmenu_top').css({
				"background" : "url(http://s7.directupload.net/images/140119/duowfxnl.png) no-repeat",
				"width" : "144px",
				"height" : "35px",
				"position" : "absolute",
				"margin-top" : "-22px"
			});
			$('#qt_border_bottom').css({
				"background" : "url(http://s7.directupload.net/images/140119/jltfmtqi.png) no-repeat center center",
				"width" : "144px",
				"height" : "14px"
			});
			$('#qtbox_main_btn').css({
				"background" : "url(http://s7.directupload.net/images/140119/nebf5887.png) no-repeat",
				"position" : "absolute",
				"top" : "14px",
				"left" : "60px",
				"width" : "20px",
				"height" : "17px"
			});
			$('#qt_mainmenu_list').css({
				"background" : "url(http://s7.directupload.net/images/140120/6waopcew.png) repeat-y",
				"padding" : "13px 4px 3px 9px",
				"display" : "none",
				"margin" : "0 0 -2px"
			});

			$("#qtbox_main_btn").hover(
				function () {
				$(this).css({
					"background-image" : "url(http://s7.directupload.net/images/140119/ywi4jbg2.png)"
				});
			},
				function () {
				$(this).css({
					"background-image" : "url(http://s7.directupload.net/images/140119/nebf5887.png)"
				});
			});

			var qtbox_main_array = [
				[QT.Lang.get("qtoolbox", "stats"), "http://s1.directupload.net/images/140125/vnghthhz.png", "",
					[QT.Lang.get("qtoolbox", "grepoworld"), "http://fs5.directupload.net/images/170105/2txtp9xz.png", "", //http://s1.directupload.net/images/121012/zzydmra8.png
						[QT.Lang.get("qtoolbox", "player"), "http://s1.directupload.net/images/121012/8xgicpg7.png", "link_grepoworld_player"],
						[QT.Lang.get("qtoolbox", "alliance"), "http://s7.directupload.net/images/121012/4kfl493a.png", "link_grepoworld_alliance"]],
						//[QT.Lang.get("qtoolbox", "rankings"), "http://s14.directupload.net/images/121012/p2otvkuz.png", "link_gs_rankings"],
					[QT.Lang.get("qtoolbox", "grepo_intel"), "http://s14.directupload.net/images/130403/u33cb3b8.jpg", "",
						[QT.Lang.get("qtoolbox", "track_player"), "http://s1.directupload.net/images/121012/8xgicpg7.png", "link_gi_player"],
						[QT.Lang.get("qtoolbox", "track_alliance"), "http://s7.directupload.net/images/121012/4kfl493a.png", "link_gi_alliance"],
						[QT.Lang.get("qtoolbox", "top_killers"), "http://s14.directupload.net/images/121012/p2otvkuz.png", "link_gi_topkillers"]],
					//[QT.Lang.get("qtoolbox", "grepo_bash"), "http://s14.directupload.net/images/140615/x766ldmm.png", "link_grepobash"],
					[QT.Lang.get("qtoolbox", "quo"), "http://s7.directupload.net/images/140615/fhkhdsdc.png", "link_quo"]],
				[QT.Lang.get("qtoolbox", "maps"), "http://s1.directupload.net/images/121012/4hbt2ofa.png", "",
					[QT.Lang.get("qtoolbox", "grepo_maps"), "http://s1.directupload.net/images/121012/4hbt2ofa.png", "link_maps_grepomaps"],
					[QT.Lang.get("qtoolbox", "grepo_intel"), "http://s14.directupload.net/images/130403/u33cb3b8.jpg", "link_maps_grepointel"]],
				[QT.Lang.get("qtoolbox", "townsearches"), "http://s14.directupload.net/images/121012/vlnknenk.png", "",
					//[QT.Lang.get("qtoolbox", "tonda_polissuche"), "http://polissuche.marco93.de/favicon.ico", "link_polissuche"],
					[QT.Lang.get("qtoolbox", "grepo_finder"), "http://s14.directupload.net/images/140913/5c6ak7br.jpg", "link_grepofinder"]],
				[QT.Lang.get("qtoolbox", "bb_codes"), "http://s14.directupload.net/images/140124/8tzken7v.png", "",
					[QT.Lang.get("bbcode", "troops"), "http://s1.directupload.net/images/121012/a2w2xe8r.png", "",
						[QT.Lang.get("qtoolbox", "in_town"), "http://s14.directupload.net/images/140124/8tzken7v.png", "bbcode_intown"],
						[QT.Lang.get("qtoolbox", "from_town"), "http://s14.directupload.net/images/140124/8tzken7v.png", "bbcode_fromtown"]],
					//[QT.Lang.get("qtoolbox","outside"), "http://s14.directupload.net/images/140124/8tzken7v.png", "bbcode_outer"]
					[QT.Lang.get("bbcode", "cities"), "http://s7.directupload.net/images/140121/3l6c8vw4.png", "",
						[QT.Lang.get("bbcode", "all"), "http://s14.directupload.net/images/140124/8tzken7v.png", "bbcode_cities_all"],
						[QT.Lang.get("bbcode", "active_grp"), "http://s14.directupload.net/images/140124/8tzken7v.png", "bbcode_cities_grp"]],
					[QT.Lang.get("bbcode", "building"), "http://cdn.grepolis.com/images/game/overviews/main_20x20.png", "bbcode_buildings"]],
				[QT.Lang.get("qtoolbox", "tools"), "http://fs1.directupload.net/images/150416/aj92dgb3.png", "",
					[QT.Lang.get("qtoolbox", "unit_comparison"), "http://s7.directupload.net/images/121012/xli4g4p8.png", "unitcomparison"],
					[QT.Lang.get("qtoolbox", "google_docs"), "http://s14.directupload.net/images/121012/cbromm2l.png", "googledocs"],
					[QT.Lang.get("qtoolbox", "full_screen"), "http://s7.directupload.net/images/121012/2erjlsv4.png", "fullscreenmode"]],
				[QT.Lang.get("qtoolbox", "stats_scripts"), "http://s14.directupload.net/images/130418/rpccjan7.png", "statsandscripts"],
				[QT.Lang.get("qtoolbox", "settings"), "http://s14.directupload.net/images/121012/xg4fgyo5.png", "scriptmanager"]
			];

			var linkArray = {
				gs_player : [QT.Links.GS_Spieler, "970", "500", QT.Lang.get("qtoolbox", "player"), "TYPE_QT_GREPOSTATS"],
				gs_alliance : [QT.Links.GS_Allianz, "970", "500", QT.Lang.get("qtoolbox", "alliance"), "TYPE_QT_GREPOSTATS"],
				gs_rankings : [QT.Links.GS_Bash, "970", "500", QT.Lang.get("qtoolbox", "rankings"), "TYPE_QT_GREPOSTATS"],
				gi_player : [QT.Links.GrepoIntelPlayer, "1010", "500", QT.Lang.get("qtoolbox", "track_player"), "TYPE_QT_GREPOINTEL"],
				gi_alliance : [QT.Links.GrepoIntelAlliance, "1010", "500", QT.Lang.get("qtoolbox", "track_alliance"), "TYPE_QT_GREPOINTEL"],
				gi_topkillers : [QT.Links.GrepoIntelKillers, "1010", "500", QT.Lang.get("qtoolbox", "top_killers"), "TYPE_QT_GREPOINTEL"],
				grepobash : [QT.Links.GrepoBash, "970", "500", QT.Lang.get("qtoolbox", "grepo_bash"), "TYPE_QT_BASHLISTS"],
				quo : [QT.Links.quo, "970", "500", QT.Lang.get("qtoolbox", "quo"), "TYPE_QT_BASHLISTS"],
				maps_grepomaps : [QT.Links.GrepoMaps, "1035", "500", QT.Lang.get("qtoolbox", "grepo_maps"), "TYPE_QT_SERVERMAPS"],
				maps_grepointel : [QT.Links.GrepoIntelMap, "1035", "500", QT.Lang.get("qtoolbox", "grepo_intel"), "TYPE_QT_SERVERMAPS"],
				grepofinder : [QT.Links.Grepofinder, "970", "500", QT.Lang.get("qtoolbox", "grepo_finder"), "TYPE_QT_TOWNSEARCHES"],
				polissuche : [QT.Links.Polissuche, "970", "500", QT.Lang.get("qtoolbox", "tonda_polissuche"), "TYPE_QT_TOWNSEARCHES"],
				grepoworld_player : [QT.Links.grepoworld_player, "970", "500", QT.Lang.get("qtoolbox", "player"), "TYPE_QT_GREPOSTATS"],
				grepoworld_alliance : [QT.Links.grepoworld_alliance, "970", "500", QT.Lang.get("qtoolbox", "alliance"), "TYPE_QT_GREPOSTATS"]
			};

			var qtbox_main_items = [];
			$.each(qtbox_main_array, function (i, e) {
				qtbox_main_items.push('<li id="' + e[2] + '" style="background-image: url(' + e[1] + ')"><span>' + e[0] + '</span>');
				if (e.length > 3) {
					qtbox_main_items.push("<span class='qmenu_arrow_span'></span>");
					qtbox_main_items.push('<ol class="qmenu_window"><li class="qmenu_window_first"></li>');
					$.each(e.slice(3), function (j, f) {
						qtbox_main_items.push('<li id="' + f[2] + '" style="background-image: url(' + f[1] + ')"><span>' + f[0] + '</span>');
						if (f.length > 3) {
							qtbox_main_items.push("<span class='qmenu_arrow_span'></span>");
							qtbox_main_items.push('<ol class="qmenu_window"><li class="qmenu_window_first"></li>');
							$.each(f.slice(3), function (k, g) {
								qtbox_main_items.push('<li id="' + g[2] + '" style="background-image: url(' + g[1] + ')"><span>' + g[0] + '</span>');
								qtbox_main_items.push('</li>');
							});
							qtbox_main_items.push('<li class="qmenu_window_last"></li></ol>');
						}
						qtbox_main_items.push('</li>');
					});
					qtbox_main_items.push('<li class="qmenu_window_last"></li></ol>');
				}
				qtbox_main_items.push('</li>');
			});

			$('#qt_mainmenu_list').append(qtbox_main_items.join(''));

			$('#qt_mainmenu_list li').click(function () {
				if ($(this).prop("id").length > 0) {
					if (this.id.substring(0, 6) === "bbcode") {
						QT.Functions.bbcodes(this.id);
					} else if (this.id.substring(0, 4) === "link") {
						window.open(linkArray[this.id.substr(5)][0]);
					} else {
						QT.Functions[this.id]();
					}
					$("#qtbox_main_btn").click();
				}
			});
			$("#qt_mainmenu_list ol").css({
				"padding" : "0"
			});
			$("#qt_mainmenu_list li").css({
				"background-size" : "10px 10px",
				"background-repeat" : "no-repeat",
				"background-position" : "left 2px",
				"padding-left" : "14px",
				"line-height" : "14px",
				"cursor" : "pointer",
				"color" : "#ecb44d",
				"text-align" : "left",
				"font-size" : "10px",
				"text-shadow" : "0 0 2px #000",
				"list-style" : "none",
				"margin" : "0"
			});
			$("#qt_mainmenu_list li span:first-child").css({
				"display" : "inline-block",
				"max-width" : "102px",
				"width" : "102px"
			});
			$(".qmenu_arrow_span").css({
				"display" : "inline-block",
				"width" : "9px",
				"height" : "7px",
				"background" : "url(http://s14.directupload.net/images/141020/noivoqy4.png) no-repeat center center"
			});
			$(".qmenu_window").css({
				"display" : "none",
				"position" : "absolute",
				"left" : "134px",
				"margin-top" : "-22px",
				"width" : "142px",
				"background" : "url(http://s7.directupload.net/images/140120/6waopcew.png)"
			});
			$(".qmenu_window li").css({
				"margin-left" : "9px"
			});
			$(".qmenu_window ol").css({
				"z-index" : "3"
			});
			$(".qmenu_window_first").css({
				"height" : "10px",
				"max-width" : "142px",
				"padding" : "0",
				"margin" : "-2px 0 0 0",
				"background" : "url(http://s7.directupload.net/images/140119/gxng9w7z.png)"
			});
			$(".qmenu_window_last").css({
				"height" : "8px",
				"max-width" : "142px",
				"padding" : "0",
				"margin" : "2px 0 0 0",
				"background" : "url(http://s1.directupload.net/images/140119/y7dq3n8j.png)"
			});

			$("#qt_mainmenu_list li").hover(function () {
				$(this).css({"color":"#edb"});
				$(this).children("ol").show();
			}, function () {
				$(this).css({"color":"#ecb44d"});
				$(this).children("ol").hide();
			});

			$("#qtbox_main_btn").click(function () {
				$("#qt_mainmenu_list").slideToggle();
			});

			// Buttonbox
			if (QT.Settings.values.qmenu_settings_buttonbar) {
				$('#qtbox_wrapper').append('<div id="qtbox_buttons_wrapper" style="display: block; position: relative; height: 26px; width: 100%; left: 2px; bottom: 0px; background:url(http://s7.directupload.net/images/131007/wh2uwdro.png) no-repeat"></div>');
				$('#ui_box .nui_main_menu .bottom, #ui_box .nui_main_menu .leaves').css({
					"bottom" : "-=27px"
				});
				$('#qtbox_buttons_wrapper').append('<a id="qtbox_button1" class="qtbox_button" style="display: block; position: absolute; width: 24px; height: 22px; margin: 1px 0 0 3px;" target="_blank" href="' + QT.Links.grepoworld_player + '"><img src="http://fs5.directupload.net/images/170105/6ai4ye3s.png"></a><a id="qtbox_button2" class="qtbox_button" style="display: block; position: absolute; width: 24px; height: 22px; margin: 1px 0 0 29px;" target="_blank" href="' + QT.Links.GrepoIntelPlayer + '"><img src="http://s1.directupload.net/images/131008/2hr8vbhw.png"></a><a id="qtbox_button3" class="qtbox_button" style="display: block; position: absolute; width: 24px; height: 22px; margin: 1px 0 0 55px;" target="_blank" href="' + QT.Links.quo + '"><img src="http://s14.directupload.net/images/131008/wfe9ficd.png"></a><a id="qtbox_button4" class="qtbox_button" style="display: block; position: absolute; width: 24px; height: 22px; margin: 1px 0 0 81px;" target="_blank" href="' + QT.Links.GrepoMaps + '"><img src="http://s7.directupload.net/images/131007/hdh4farx.png"></a><a id="qtbox_button5" class="qtbox_button" style="display: block; position: absolute; width: 24px; height: 22px; margin: 1px 0 0 107px;" target="_blank" href="' + QT.Links.Polissuche + '"><img src="http://s7.directupload.net/images/131008/5zj4ujmi.png"></a>');
				//http://s1.directupload.net/images/131008/ktvkyrx8.png
				$('#qtbox_button1').mousePopup(new MousePopup(QT.Lang.get("qtoolbox", "grepoworld")));
				$('#qtbox_button2').mousePopup(new MousePopup(QT.Lang.get("qtoolbox", "grepo_intel")));
				$('#qtbox_button3').mousePopup(new MousePopup(QT.Lang.get("qtoolbox", "quo")));
				$('#qtbox_button4').mousePopup(new MousePopup(QT.Lang.get("qtoolbox", "grepo_maps")));
				$('#qtbox_button5').mousePopup(new MousePopup(QT.Lang.get("qtoolbox", "tonda_polissuche")));

				$(".qtbox_button").hover(
					function () {
					$(this).css({
						"background" : "url(http://s7.directupload.net/images/131008/vyhnznhd.png)"
					});
				},
					function () {
					$(this).css({
						"background" : "none"
					});
				});
			}

			//Online Counter
			if (QT.Settings.values.qmenu_settings_counter) {
				$('#qtbox_wrapper').append('<div id="qtbox_clock_wrapper" style="display: block; position: relative; height: 21px; left: 2px; width: 100%; background:url(http://s7.directupload.net/images/131007/desspey5.png) no-repeat"><a id="qt_clock_clock" style="display: block; position: absolute; height: 17px; background: url(http://s7.directupload.net/images/131007/qqcsqnfm.png) no-repeat scroll 0px 2px transparent; margin-left: 5px; width: 127px;" href="#"><span id="qt_clock_span" style="display: block; color: #EEDDBB; font-size: 9px; width: 110px; position: absolute; bottom: 2px; margin-left: 10px;"></span></a></div>');
				$('#ui_box .nui_main_menu .bottom, #ui_box .nui_main_menu .leaves').css({
					"bottom" : "-=21px"
				});
				$("#qt_clock_clock").click(function () {
					(counterview === 0) ? counterview = 1 : counterview = 0;
				});
				$('#qt_clock_clock').mousePopup(new MousePopup(QT.Lang.get("qtoolbox", "onlinecounter_switch")));
				sec = -1;
				min = 0;
				hour = 0;
				counterview = 0;
				function counttime() {
					QT.Settings.values.onlinetotal++;
					sec++;
					if (sec === 60) {
						sec = 0;
						min = min + 1;
					}
					if (min === 60) {
						min = 0;
						hour += 1;
					}
					var hour_total = parseInt(QT.Settings.values.onlinetotal / 3600);
					var min_total = parseInt(QT.Settings.values.onlinetotal / 60 - hour_total * 60);
					var sec_total = QT.Settings.values.onlinetotal - (hour_total * 3600) - (min_total * 60);
					if (counterview === 0) {
						timer = QT.Lang.get("qtoolbox", "onlinecounter_now") + ": " + ((hour <= 9) ? "0" + hour : hour) + ":" + ((min <= 9) ? "0" + min : min) + ":" + ((sec <= 9) ? "0" + sec : sec);
					} else if (counterview === 1) {
						timer = QT.Lang.get("qtoolbox", "onlinecounter_total") + ": " + ((hour_total <= 9) ? "0" + hour_total : hour_total) + ":" + ((min_total <= 9) ? "0" + min_total : min_total) + ":" + ((sec_total <= 9) ? "0" + sec_total : sec_total);
					}
					if (!QT.Settings.values.qmenu_settings_counter_aktiv) {
						QT.Settings.save("onlinetotal", QT.Settings.values.onlinetotal);
					}
					$("#qt_clock_span").html(timer);
					window.setTimeout(function () {
						counttime();
					}, 1000);
				}
				counttime();
			}
		},
		questlist : function () {
			$('#quest_overview').prepend("<li id='q_questlist'><span id='q_lock'></span><span id='q_arrow'></span><span id='q_hide'></span></li>");
			$('#q_lock').click(function () {
				if ( $(this).hasClass("active") ) {
					$('#quest_overview').draggable({
						disabled : true
					});
					$(this).removeClass("active");
				} else {
					$('#quest_overview').draggable({
						disabled : false
					});
					$(this).addClass("active");
				}
			});
			function q_arrow_handler1() {
				QT.Settings.save("qmenu_settings_questpfeil", false);
				QT.Settings.values.qmenu_settings_questpfeil = false;
				$('<style id="qarrowstyle" type="text/css">.helper_arrow {display: none !important}</style>').appendTo('head');
				$(this).one("click", q_arrow_handler2);
			}
			function q_arrow_handler2() {
				QT.Settings.delete("qmenu_settings_questpfeil");
				QT.Settings.values.qmenu_settings_questpfeil = true;
				$('#qarrowstyle').remove();
				$(this).one("click", q_arrow_handler1);
			}
			$('#q_arrow').one("click", q_arrow_handler1);

			if (!QT.Settings.values.qmenu_settings_questpfeil) {
				$('#q_arrow').click();
			}
			$('#q_hide').click(function () {
				$('#quest_overview li[id*="quest"]').each(function () {
					$(this).toggle();
				});
			});
		},
		removeTooltipps : function (type) {
			var a;

			switch (type) {
				case "agora":
					a = QT.wnd.find(".place_unit");
					break;
				case "barracks":
				case "docks":
					a = QT.wnd.find("#units DIV");
					break;
				case "place":
					a = $(".classic_window.place .supporters_list").find(".units_list DIV");
					break;
				case "sidebar":
					a = $("#ui_box").find(".units_wrapper DIV");
					break;
				case "town_info":
					a = QT.wnd.find(".unit_icon40x40");
					break;
			}

			a.each(function( index ) {
				$(this).off('mouseenter mouseleave');
			});
		},
		recipeevent : function () {
			if ( $("#qt_recipeevent").length ) {
				return;
			}

			var wnd = $(".classic_window.easter");

			var link_giveaway = (mID == "de" ? "http://de.grepolisqt.de/herbst-event-rezepte-liste" : "http://en.grepolisqt.de/fall-event-recipe-list");
			var link_recipebook = (mID == "de" ? "http://de.grepolisqt.de/grepolis-demeter-2017-rezepte-liste/" : "http://en.grepolisqt.de/grepolis-demeter-2017-recipe-list/");

			var box = '<div id="qt_recipeevent" class="countdown_box" style="position: absolute; top: 35px; right: 0; width: 76px;">' +
				'<div class="left"></div>' +
				'<div class="right"></div>' +
				'<div class="middle"></div>' +
				'</div>';

			wnd.append(box);
			wnd.find("#qt_recipeevent .middle").append('<a id="qt_recipeevent_recipebook" class="qt_recipeevent_btn qt_recipeevent_btn_1 qt_recipeevent_recipebook" href="'+link_recipebook+'" target="_blank">');

			//</a><a id="qt_recipeevent_present" class="qt_recipeevent_btn qt_recipeevent_btn_1 qt_recipeevent_present" href="'+link_giveaway+'" target="_blank"></a>

			$("#qt_recipeevent_recipebook").mousePopup(new MousePopup(QT.Lang.get("recipeevent", "recipebook")));
			//$("#qt_recipeevent_present").mousePopup(new MousePopup(QT.Lang.get("recipeevent", "present")));
		},
		reportsColor : function () {
			var b = GPWindowMgr.getOpen(Layout.wnd.TYPE_REPORT);
			if (b.length == 0)
				return;
			wnd = b[b.length - 1];
			var c = wnd.getID();
			$("DIV#gpwnd_" + c + " #report_list li:contains('" + QT.Lang.get("reports", "attacking") + "')").each(function () {
				$(this).css({
					"border-left" : "5px solid red"
				}).addClass("angriffe");
			});
			$("DIV#gpwnd_" + c + " #report_list li:contains('" + QT.Lang.get("reports", "supporting") + "')").each(function () {
				$(this).css({
					"border-left" : "5px solid green"
				}).addClass("unterstützungen");
			});
			$("DIV#gpwnd_" + c + " #report_list li:contains('" + QT.Lang.get("reports", "support") + "')").each(function () {
				$(this).css({
					"border-left" : "5px solid green"
				}).addClass("unterstützungen");
			});
			$("DIV#gpwnd_" + c + " #report_list li:contains('" + QT.Lang.get("reports", "spy") + "')").each(function () {
				$(this).css({
					"border-left" : "5px solid blue"
				}).addClass("spios");
			});
			$("DIV#gpwnd_" + c + " #report_list li:contains('" + QT.Lang.get("reports", "spying") + "')").each(function () {
				$(this).css({
					"border-left" : "5px solid blue"
				}).addClass("spios");
			});
			$("DIV#gpwnd_" + c + " #report_list li:contains('" + QT.Lang.get("reports", "conquered") + "')").each(function () {
				$(this).css({
					"border-left" : "5px solid black"
				});
			});
			$("DIV#gpwnd_" + c + " #report_list li:contains('" + QT.Lang.get("reports", "enacted") + "')").each(function () {
				$(this).css({
					"border-left" : "5px solid purple"
				}).addClass("zauber");
			});
			$("DIV#gpwnd_" + c + " #report_list li:contains('" + QT.Lang.get("reports", "farming_village") + "')").each(function () {
				$(this).css({
					"border-left" : "5px solid yellow"
				}).addClass("farm");
			});
		},
		reportsFilter : function () {
			var b = GPWindowMgr.getOpen(Layout.wnd.TYPE_REPORT);
			if (b.length == 0)
				return;
			wnd = b[b.length - 1];
			var c = wnd.getID();
			if (!$("#qmenu_berichte_icon_wrapper").is(":visible")) {
				$('<div id="qmenu_berichte_icon_wrapper" style="display:inline;position:absolute;margin-top:-1px;margin-left:120px"></div>').appendTo("DIV#gpwnd_" + c + " #es_page_reports");
				$('<label class="qmenu_berichte_Icon" style="background-image: url(http://cdn.grepolis.com/images/game/unit_overview/filter_24x24.png);background-position: 0 0;"><input type="checkbox" id="angriffe" class="qmenu_berichte_checkbox"></label>').appendTo('#qmenu_berichte_icon_wrapper');
				$('<label class="qmenu_berichte_Icon" style="background-image: url(http://cdn.grepolis.com/images/game/unit_overview/filter_24x24.png);background-position: -24px 0;"><input type="checkbox" id="unterstützungen" class="qmenu_berichte_checkbox"></label>').appendTo('#qmenu_berichte_icon_wrapper');
				$('<label class="qmenu_berichte_Icon" style="background-image: url(http://s1.directupload.net/images/130116/7hzmc2e7.png);"><input type="checkbox" id="zauber" class="qmenu_berichte_checkbox"></label>').appendTo('#qmenu_berichte_icon_wrapper');
				$('<label class="qmenu_berichte_Icon" style="background-image: url(http://cdn.grepolis.com/images/game/unit_overview/filter_24x24.png);background-position: -72px 0;"><input type="checkbox" id="spios" class="qmenu_berichte_checkbox"></label>').appendTo('#qmenu_berichte_icon_wrapper');
				$('<label class="qmenu_berichte_Icon" style="background-image: url(http://cdn.grepolis.com/images/game/unit_overview/filter_24x24.png);background-position: -96px 0;"><input type="checkbox" id="farm" class="qmenu_berichte_checkbox"></label>').appendTo('#qmenu_berichte_icon_wrapper');
				$(".qmenu_berichte_Icon").css({
					'display' : 'inline-block',
					'background-repeat' : 'no-repeat',
					'width' : '24px',
					'height' : '24px',
					'position' : 'relative',
					'float' : 'left',
					'margin-left' : '24px'
				});
				$(".qmenu_berichte_checkbox").css({
					'margin-top' : '5px',
					'margin-left' : '29px'
				});
				$(".qmenu_berichte_checkbox").click(function () {
					classid = this.id;
					var checkBoxes = $("li." + classid + " INPUT[type='checkbox']");
					checkBoxes.attr("checked", !checkBoxes.attr("checked"));
				});
			}
		},
		reportsLosses : function () {
			var b = GPWindowMgr.getOpen(Layout.wnd.TYPE_REPORT);
			if (b.length == 0)
				return;
			wnd = b[b.length - 1];
			var c = wnd.getID();
			if (document.getElementById('RepConvRes')) {
				document.getElementById('RepConvRes').style.visibility = "hidden";
			}
			if ($("DIV#gpwnd_" + c + " DIV#report_arrow img").length <= 0) {
				return;
			}
			//$("DIV#gpwnd_" + c + " .report_booty_bonus_fight hr").remove();
			$("DIV#gpwnd_" + c + " #kill_points .icon").hide();
			var report_type = $("DIV#gpwnd_" + c + " DIV#report_arrow img").attr("src").replace(/.*\/([a-z_]*)\.png.*/, "$1");
			switch (report_type) {
			case "attack":
			case "take_over":
			case "breach":
				var AttackUnitsRessources = {
					unit_w : 0,
					unit_s : 0,
					unit_i : 0,
					unit_f : 0,
					unit_p : 0,
					total_w : 0,
					total_s : 0,
					total_i : 0,
					total_f : 0,
					total_p : 0
				};
				var DefenseUnitsRessources = {
					unit_w : 0,
					unit_s : 0,
					unit_i : 0,
					unit_f : 0,
					unit_p : 0,
					total_w : 0,
					total_s : 0,
					total_i : 0,
					total_f : 0,
					total_p : 0
				};
				if ($("DIV#gpwnd_" + c + " DIV#resources").length) {
					$("DIV#gpwnd_" + c + " .report_side_attacker_unit").each(function (index, value) {
						var unitNumber = $("span.report_losts", this).text();
						var unitClass = $("div.report_unit", this).attr("class").split(/\s/);
						unitName = unitClass[5];

						if (unitName != "militia" && !unitClass[6] && unitNumber != "-?") {
							AttackUnitsRessources.unit_w = Math.abs(GameData.units[unitName].resources.wood * unitNumber);
							AttackUnitsRessources.unit_s = Math.abs(GameData.units[unitName].resources.stone * unitNumber);
							AttackUnitsRessources.unit_i = Math.abs(GameData.units[unitName].resources.iron * unitNumber);
							AttackUnitsRessources.unit_f = Math.abs(GameData.units[unitName].favor * unitNumber);
							AttackUnitsRessources.unit_p = Math.abs(GameData.units[unitName].population * unitNumber);
							AttackUnitsRessources.total_w += AttackUnitsRessources.unit_w;
							AttackUnitsRessources.total_s += AttackUnitsRessources.unit_s;
							AttackUnitsRessources.total_i += AttackUnitsRessources.unit_i;
							AttackUnitsRessources.total_f += AttackUnitsRessources.unit_f;
							AttackUnitsRessources.total_p += AttackUnitsRessources.unit_p;
							var unitPopup = GameData.units[unitName].name + '<div style="margin-top: 5px; margin-bottom:5px; height: 1px; border: none; background: #B48F45"/><img src="http://cdn.grepolis.com/images/game/res/wood.png" width="20" height="20"/> ' + AttackUnitsRessources.unit_w + '<br> <img src="http://cdn.grepolis.com/images/game/res/stone.png" width="20" height="20"/> ' + AttackUnitsRessources.unit_s + '<br> <img src="http://cdn.grepolis.com/images/game/res/iron.png" width="20" height="20"/> ' + AttackUnitsRessources.unit_i + '<br> <img src="http://cdn.grepolis.com/images/game/res/favor.png" width="20" height="20"/> ' + AttackUnitsRessources.unit_f + '<br> <img src="http://cdn.grepolis.com/images/game/res/pop.png" width="20" height="20"/> ' + AttackUnitsRessources.unit_p;
							$("div.report_unit", this).mousePopup(new MousePopup(unitPopup));
						}
					});
					$("DIV#gpwnd_" + c + " .report_side_defender_unit").each(function (index, value) {
						var unitNumber = $("span.report_losts", this).text();
						var unitClass = $("div.report_unit", this).attr("class").split(/\s/);
						unitName = unitClass[5];

						if (unitName != "militia" && !unitClass[6] && unitNumber != "-?") {
							DefenseUnitsRessources.unit_w = Math.abs(GameData.units[unitName].resources.wood * unitNumber);
							DefenseUnitsRessources.unit_s = Math.abs(GameData.units[unitName].resources.stone * unitNumber);
							DefenseUnitsRessources.unit_i = Math.abs(GameData.units[unitName].resources.iron * unitNumber);
							DefenseUnitsRessources.unit_f = Math.abs(GameData.units[unitName].favor * unitNumber);
							DefenseUnitsRessources.unit_p = Math.abs(GameData.units[unitName].population * unitNumber);
							DefenseUnitsRessources.total_w += DefenseUnitsRessources.unit_w;
							DefenseUnitsRessources.total_s += DefenseUnitsRessources.unit_s;
							DefenseUnitsRessources.total_i += DefenseUnitsRessources.unit_i;
							DefenseUnitsRessources.total_f += DefenseUnitsRessources.unit_f;
							DefenseUnitsRessources.total_p += DefenseUnitsRessources.unit_p;
							var unitPopup = GameData.units[unitName].name + '<div style="margin-top: 5px; margin-bottom:5px; height: 1px; border: none; background: #B48F45"/><img src="http://cdn.grepolis.com/images/game/res/wood.png" width="20" height="20"/> ' + DefenseUnitsRessources.unit_w + '<br> <img src="http://cdn.grepolis.com/images/game/res/stone.png" width="20" height="20"/> ' + DefenseUnitsRessources.unit_s + '<br> <img src="http://cdn.grepolis.com/images/game/res/iron.png" width="20" height="20"/> ' + DefenseUnitsRessources.unit_i + '<br> <img src="http://cdn.grepolis.com/images/game/res/favor.png" width="20" height="20"/> ' + DefenseUnitsRessources.unit_f + '<br> <img src="http://cdn.grepolis.com/images/game/res/pop.png" width="20" height="20"/> ' + DefenseUnitsRessources.unit_p;
							$("div.report_unit", this).mousePopup(new MousePopup(unitPopup));
						}
					});

					var JQselector = ($("DIV#gpwnd_" + c + " DIV#resources #load").length > 0) ? $("DIV#gpwnd_" + c + " DIV#resources #load") : $("DIV#gpwnd_" + c + " DIV#resources");
					JQselector.after('<hr><table><tr><td width="50%">' + AttackUnitsRessources.total_w + '</td><td><div class="resources_small wood"></div></td><td width="50%">' + DefenseUnitsRessources.total_w + '</td></tr><tr><td>' + AttackUnitsRessources.total_s + '</td><td><div class="resources_small stone"></td><td>' + DefenseUnitsRessources.total_s + '</td></tr><tr><td>' + AttackUnitsRessources.total_i + '</td><td><div class="resources_small iron"></td><td>' + DefenseUnitsRessources.total_i + '</td></tr><tr><td>' + AttackUnitsRessources.total_f + '</td><td><div class="resources_small favor"></td><td>' + DefenseUnitsRessources.total_f + '</td></tr><tr><td>' + AttackUnitsRessources.total_p + '</td><td><div class="resources_small population"></td><td>' + DefenseUnitsRessources.total_p + "</td></tr></table>")
				}
			}
		},
		reportsMove : function () {
			var b = GPWindowMgr.getOpen(Layout.wnd.TYPE_REPORT);
			if (b.length == 0)
				return;
			wnd = b[b.length - 1];
			var c = wnd.getID();
			var folder = "";
			$("DIV#gpwnd_" + c + " #folder_menu_reports a").each(function () {
				folder += "<option value=" + $(this).parent().attr("name").substr(7) + ">" + $(this).text() + "</option>";
			});
			if (!$('#qselect').is(':visible') && folder.length > 0) {
				$("DIV#gpwnd_" + c + " #report_reports").append('<select id="qselect"><option disabled selected>' + QT.Lang.get("reports", "choose_folder") + '</option>' + folder + '</select>');
				$("#qselect").css({
					'margin-top' : '5px',
					'margin-left' : '2px'
				});
				$("#qselect").change(function () {
					var params = {
						folder_id : this.options[this.selectedIndex].value,
						report_ids : Reports.getReportsIds()
					};
					Layout.wnd.getOpenFirst(Layout.wnd.TYPE_REPORT).requestContentPost('report', 'move', params);
					this.options[0].selected = true;
				});
				$("DIV#gpwnd_" + c + " #folder_menu_reports").hide();
				$("DIV#gpwnd_" + c + " #report_list").removeClass("with_menu");
			}
		},
		reportFoldersort : function () {
			var b = GPWindowMgr.getOpen(Layout.wnd.TYPE_REPORT);
			if (b.length == 0)
				return;
			wnd = b[b.length - 1];
			var c = wnd.getID();

			var foldersContainer = $("DIV#gpwnd_" + c + " #folder_menu_reports .hor_scrollbar_cont");
			var folders = $("DIV#gpwnd_" + c + " #folder_menu_reports SPAN.folder");

			folders.sort(function (a, b) {
				var an = $(a).text().trim(),
				bn = $(b).text().trim();
				if (an > bn) {
					return 1;
				}
				if (an < bn) {
					return -1;
				}
				return 0;
			});
			folders.appendTo(foldersContainer);
		},
		reportExport : function () {
			var b = GPWindowMgr.getOpen(Layout.wnd.TYPE_REPORT);
			if (b.length == 0)
				return;
			var c = b[b.length - 1];
			var d = c.getID();

			var report_type;
			if ($("DIV#gpwnd_" + d + " .support_report_cities").length > 0) {
				report_type = "support_attacked";
			} else if ($("DIV#gpwnd_" + d + " #report_header").length <= 0) {
				if ($("DIV#gpwnd_" + d + " #report_game_body .report_unit").length > 0) {
					report_type = "support_back";
				} else {
					report_type = "text_only";
				}
			} else {
				report_type = $("DIV#gpwnd_" + d + " DIV#report_arrow img").attr("src").replace(/.*\/([A-Za-z0-9_.]*)\.png.*/, "$1");
				if (report_type == "support" && $("DIV#gpwnd_" + d + " #report_game_body > p").length > 0) {
					report_type = "support_failed";
				} else if (report_type == "espionage_2.67" && $("DIV#gpwnd_" + d + " #spy_buildings").length == 0) {
					if ($("DIV#gpwnd_" + d + " #right_side p").length > 1) {
						report_type = "espionage_failed_on_me";
					} else {
						report_type = "my_espionage_failed";
					}
				}
			}

			QT.Helper.Screenshot.btn_preview("DIV#gpwnd_" + d + " #report_report_header", "qt_reportexport", report_type, function() {
				// General
				$("#report_report").clone().appendTo("#qt_canvas");
				$("#qt_canvas #report_report_header").contents().filter(function(){return this.nodeType === 3}).wrap('<span />');

				// Elements to remove
				$("#qt_canvas #select_folder_id").remove();
				$("#qt_canvas .game_list_footer a").remove();

				// General Style
				$("#qt_canvas #report_report").css({"display": "inline-block"});
				$("#qt_canvas #report_report_header").css({"max-width":"780px"});
				$("#qt_canvas hr").css({"border": "0", "border-bottom": "1px solid #b38f48"});
				$("#qt_canvas .game_border").css({"margin":"3px 3px 3px 3px"});

				// Elements to change
				var elemensToChange = [
				// Borders
				".game_border_top", ".game_border_bottom", ".game_border_left", ".game_border_right", ".game_border_corner",
				// Header
				"#report_report_header", ".game_arrow_left", ".game_arrow_right", ".game_arrow_delete", "#report_action_bg", "#report_arrow", ".report_town_bg", ".report_town_bg .island_bg", ".town_icon", ".flagpole", ".report_town_bg_quest",
				// Body
				"#report_game_body", ".hero40x40", ".unit_icon40x40", ".resources_small", ".report_booty_bonus_fight", "#resources .res_background", "#resources .res_background div",
				".report_icon", ".button.simulate_units", ".power_icon45x45.attack_boost.lvl", ".power_icon45x45.defense_boost.lvl", ".power_icon45x45.unit_movement_boost.lvl",
				".power_icon45x45:not(.lvl)", ".power_icon86x86", ".big_horizontal_report_separator", ".god_mini", ".longterm_attack_boost", ".power_icon45x45.longterm_defense_boost", ".power_icon45x45.longterm_unit_order_boost",
				// Footer
				".game_list_footer",
				// Buildings
				".building_main", ".building_storage", ".building_hide", ".building_farm", ".building_place", ".building_lumber", ".building_stoner",
				".building_ironer", ".building_market", ".building_docks", ".building_wall", ".building_academy", ".building_temple", ".building_barracks",
				".building_tower", ".building_lighthouse", ".building_library", ".building_thermal", ".building_theatre", ".building_oracle", ".building_statue", ".building_trade_office"
				];

				return elemensToChange;
			});
			$("#qt_reportexport").css({"top":"1px", "right":"1px"});
		},
		scriptmanager : function () {
			var grepoGameBorder = '<div class="game_border"><div class="game_border_top"></div><div class="game_border_bottom"></div><div class="game_border_left"></div><div class="game_border_right"></div><div class="game_border_corner corner1"></div><div class="game_border_corner corner2"></div><div class="game_border_corner corner3"></div><div class="game_border_corner corner4"></div><div class="game_header bold" style="height:18px;padding:3px 11px">';
			var inhalte = {
				qset_tab1 : tab1(),
				qset_tab2 : tab2(),
				qset_tab3 : tab3()
			};
			function tab1() {
				var inhalt_tab1 = [];
				inhalt_tab1[0] = [QT.Lang.get("settings", "text14"), {
						"removetooltipps" : [QT.Lang.get("settings", "text55"), [["qmenu_settings_removetooltipps", QT.Lang.get("settings", "text54")]]],
						"onlinecounter" : [QT.Lang.get("settings", "text2"), [["qmenu_settings_counter", QT.Lang.get("settings", "text9")], ["qmenu_settings_counter_aktiv", QT.Lang.get("settings", "text11")]]],
						"buttonbar" : [QT.Lang.get("settings", "text6"), [["qmenu_settings_buttonbar", QT.Lang.get("settings", "text9")]]],
						"plusmenu" : [QT.Lang.get("settings", "text5"), [["qmenu_settings_plusmenu", QT.Lang.get("settings", "text9")]]],
						"cityview" : [QT.Lang.get("settings", "text52"), [["qmenu_settings_cityview_BTN", QT.Lang.get("settings", "text41")], ["qmenu_settings_cityview_window", QT.Lang.get("settings", "text53")]]],
						"bbcode_btn" : [QT.Lang.get("settings", "text31"), [["qmenu_settings_townbb", QT.Lang.get("settings", "text9")]]],
						"transportcalc" : [QT.Lang.get("settings", "text12"), [["qmenu_settings_transport_rechner", QT.Lang.get("settings", "text9")]]],
						"berichtemod" : [QT.Lang.get("settings", "text15"), [["qmenu_settings_berichte_farben", QT.Lang.get("settings", "text16")], ["qmenu_settings_berichte_filter", QT.Lang.get("settings", "text17")], ["qmenu_settings_berichte_move", QT.Lang.get("settings", "text30")], ["qmenu_settings_berichte_losses", QT.Lang.get("settings", "text42")], ["qmenu_settings_berichte_sortfolders", QT.Lang.get("settings", "text49")]]],
						"grepopoints" : [QT.Lang.get("settings", "text24"), [["qmenu_settings_grepopoints", QT.Lang.get("settings", "text25")]]],
						"forummod" : [QT.Lang.get("settings", "text20"), [["qmenu_settings_maximize_forum", QT.Lang.get("settings", "text21")], ["qmenu_settings_forumdelete", QT.Lang.get("settings", "text32")]]],
						"akademiemod" : [QT.Lang.get("settings", "text35"), [["qmenu_settings_akademieplaner", QT.Lang.get("settings", "text27")]]],
						"trademod" : [QT.Lang.get("settings", "text26"), [["qmenu_settings_tradeimprovement", QT.Lang.get("settings", "text27")]]],
						"townlistmod" : [QT.Lang.get("settings", "text28"), [["qmenu_settings_stadtliste", QT.Lang.get("settings", "text27")]]],
						"questlistmod" : [QT.Lang.get("settings", "text29"), [["qmenu_settings_questliste", QT.Lang.get("settings", "text27")], ["qmenu_settings_questpfeil", QT.Lang.get("settings", "text50")]]],
						"cavemod_admin" : [QT.Lang.get("settings", "text34"), [["qmenu_settings_hidessort", QT.Lang.get("settings", "text37")], ["qmenu_settings_hidessilver", QT.Lang.get("settings", "text38")]]],
						"cavemod_town" : [QT.Lang.get("settings", "text36"), [["qmenu_settings_hidesilver", QT.Lang.get("settings", "text38")]]],
						"farmhelper" : [QT.Lang.get("settings", "text40"), [["qmenu_settings_farmhelper", QT.Lang.get("settings", "text27")], ["qmenu_settings_farmhelper_hidecities", QT.Lang.get("settings", "text51")]]],
						"island" : [QT.Lang.get("settings", "text44"), [["qmenu_settings_island_villages", QT.Lang.get("settings", "text45")]]],
						"hotkeys" : [QT.Lang.get("settings", "text46"), [["qmenu_settings_hotkey_active", QT.Lang.get("settings", "text27")], ["qmenu_settings_hotkey_anzeige", QT.Lang.get("settings", "text22")], ["qmenu_settings_hotkey_jump", QT.Lang.get("settings", "text47")]]]
					}
				];
				var HTML_tab1 = "";
				HTML_tab1 += grepoGameBorder + QT.Lang.get("settings", "settings") + '</div>';
				HTML_tab1 += '<div id="settings_content" class="contentDiv" style="padding:0 5px; overflow: auto; height:379px">';
				$.each(inhalt_tab1, function (a, b) {
					HTML_tab1 += '<div style="margin-top: 5px; padding: 5px; border: 1px solid #B48F45"><span><b>' + b[0] + '</b></span><br />';
					$.each(b[1], function (c, d) {
						HTML_tab1 += "<div style='margin:2px 0'>" + d[0] + "<br/>";
						$.each(d[1], function (e, f) {
							var checked = (QT.Settings.values[f[0]] === true) ? "checked" : "";
							HTML_tab1 += '<div id="' + f[0] + '" class="qbox checkbox_new ' + checked + '"><div class="cbx_icon"></div><div class="cbx_caption">' + f[1] + '</div></div><br/>';
						});
						HTML_tab1 += "</div>";
					});
					HTML_tab1 += '</div>';
				});
				HTML_tab1 += '</div></div>';
				HTML_tab1 += QT.Helper.grepo_btn("qmenu_einstellungen_reset_BTN", QT.Lang.get("settings", "reset"))[0].outerHTML;
				HTML_tab1 += QT.Helper.grepo_btn("qmenu_einstellungen_safe_BTN", QT.Lang.get("settings", "save"))[0].outerHTML;
				return HTML_tab1;
			}
			function tab2() {
				var supported_lang = [QT.Lang.get("settings", "info"), QT.Lang.get("settings", "add_lang")];
				$.each(QT.Lang, function (a, b) {
					if (a != "get") {
						supported_lang.push(a);
					}
				});
				var HTML_tab2 = '';
				var q_translations = {
					BR : "==CrAZyWoW==, douglasgoclv, tesseus, Stelvins, Jonh Snow, BeerCode, WarOfGood",
					CZ : "jarajanos, Apolon Foibos, jarajanos",
					DE : "Quackmaster, Scav77",
					EN : "Quackmaster, cedomaiori",
					ES : "Jonh Snow, F0NT3, cuervobrujo, Guerrero2013, TovarischKoba, Wymir, -BENHUR-, pinxu85",
					FR : "higter, Mazelys, jbrek, ToolFire, aldo666, jojopt",
					GR : "drmacsoft, adipas.ioannis, juvekdk, ΤζονακοςΚ, genial, Tassos.28",
					HU : "Arminno, Betagamer, Shia-ko, Vermunds",
					IT : "masale81, Psy17, Sluggish, Pero70",
					NL : "Quackmaster, Florent15, sannelos, megaabelleke, Thodoris, HGamert, Siloperg47, necromancer97, nijtram1236, H2ODelirious",
					PL : "Slietie, Tropsy Kretts, Polny Konik, danon2",
					PT : "cybern, Drica0, Jahmaica",
					RO : "BaietelulCelFrumusel",
					RU : "Jest, DJEDIVER, nihondzin, Jestex"
				};
				HTML_tab2 += grepoGameBorder + QT.Lang.get("settings", "translations") + '<div style="float: right; margin-top: -2px; margin-right: -5px">' + QT.Helper.grepo_dropdown_flag("langdiv", supported_lang)[0].outerHTML + '</div></div>';
				HTML_tab2 += '<div id="trans_content" class="contentDiv" style="padding:5px 10px; overflow: auto; height:369px"><b>' + QT.Lang.get("settings", "please_note") + ':</b><br/><ul style="list-style:square outside;padding-left: 13px"><li>' + QT.Lang.get("settings", "trans_infotext1") + '</li><li>' + QT.Lang.get("settings", "trans_infotext2") + '</li><li>' + QT.Lang.get("settings", "trans_infotext3") + '</li><li>' + QT.Lang.get("settings", "trans_infotext4") + '</li></ul><div style="margin-top:30px"><b>' + QT.Lang.get("settings", "credits") + ':</b><br/><ul style="list-style:square outside;padding-left: 13px">';
				$.each(q_translations, function (a, b) {
					HTML_tab2 += '<li>' + a + ': ' + b + '</li>';
				});
				HTML_tab2 += '</ul></div></div>';
				HTML_tab2 += '</div>';
				HTML_tab2 += QT.Helper.grepo_btn("qmenu_einstellungen_sendmail", QT.Lang.get("settings", "send"))[0].outerHTML;
				return HTML_tab2;
			}
			function tab3() {
				var HTML_tab3 = "";
				var q_donations = [
					["Daniela T. - 1€", "Peter J. - 1€", "André V. - 5€", "Nepomuk P. - 10€"],
					["Michael H. - 1€", "Heiner W. - 5€", "LightShining - 15€", "Hans Hermann S. - 5€"],
					["Leuchtkraft - 10€", "Ann-Katrin R. - 3€", "alexander1128 - 10€", "Martin P. - 10€"],
					[" Rolf M. - 5€", "David W. - 5€", "Omega78 - 25€", "Helga S. - 1€"],
					["Falk T. - 5€", "Christian B. - 1€", "Christian P. - 25€", "Maik S. - 2€"],
					["Dennis B. - 1€", "Sinnaman - 15€", "Marcel N. - 10€", "Edith M. - 10€"],
					["Nepomuk P. - 50€", "Kevin T. - 5€", "Thomas R. - 10€", "Claines C. C. - 3€"],
					["Carsten R. - 5€", "Nick K. - 0,74€", "Eduard R. - 3€", "Christian P. - 5€"],
					["Martin S. - 5€", "Ian O. - 10€", "Michael W. K. - 1$", "	Ines L. - 10€"],
					["David M. - 10€", "Thomas M. W. - 3€", "Benedikt K. - 2€", "Sandra M. - 5€"],
					["Lea Renate G. - 10€", "Helena E. - 5€", "Mercedes G. - 1€", "Alexander S. - 10 €"],
					["Peter F. - 1€", "Martina S - 1€", "Wilhelm B. - 2€", "Anna G. - 0,01€"],
					["Maria N. - 5€", "Katharine S. - 10€", "Herbert W. - 5€", "Martin D. - 1€"],
					["Ronald H. - 10€", "Michael M. - 5€", "Carsten H. - 1€", "Sylvie S. - 10€"],
					["Markus B. - 1€", "Marcel P. - 20€", "Manuela M. - 5€", "Andreas H. - 5€"],
					["Andrea W. - 3€", "Dirk W. - 5€", "Mixalhs B. - 1€", "Maria N. - 1€"],
					["Danijel K. - 2€", "Maria N. - 1€", "Sven B. - 3€", "UBassoon - 10€"],
					["Bernd R. - 1€", "Wolfgang R. - 10€", "Sabine S. - 20€", "Daniel W. - 1€"],
					["Nelson A. - 2€", "Ines L. - 10€", "Ivica K. - 5€", "Andreas E. - 5€"],
					["Jean Marie T. - 1€", "Peter F. - 2€", "Andreas H. - 5€", "Thorsten W. - 5€"],
					["Pascal F. - 3€", "Marion L. - 2€", "Claudia B. - 5€", "Kat C. - 1€"],
					["David W. - 0.05€", "Doris H. - 20€", "S. J. - 5€"]
				];
				HTML_tab3 += grepoGameBorder + QT.Lang.get("settings", "info") + "</div>";
				HTML_tab3 += '<div id="info_content" class="contentDiv" style="padding:5px 10px; overflow: auto; height:396px">';
				HTML_tab3 += '<table width="100%" cellspacing="0" border="0"><tbody><tr><td width="33%"><a href="http://adf.ly/AAMwY" target="_blank">Quack Toolsammlung ' + QT.Settings.values.script_version + '</a><br />';
				HTML_tab3 += '<small><a href="' + QT.Links.quacktools + '" target="_blank">Direktlink</a> | <a href="' + QT.Lang.get("meta", "changelog") + '" target="_blank">Changelog</a> | <a href="https://github.com/Quackmaster/Grepolis-QT" target="_blank">Github</a></small><br />';
				HTML_tab3 += '<p><iframe src="//www.facebook.com/plugins/like.php?href=https%3A%2F%2Fwww.facebook.com%2Fgrepolisqt&amp;width&amp;layout=button_count&amp;action=like&amp;show_faces=false&amp;share=false&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; height:21px;" allowTransparency="true"></iframe></p>';
				HTML_tab3 += '<p><b>' + QT.Lang.get("settings", "contact") + ':</b><br />E-Mail: <a href="mailto:Quackmaster@web.de">Quackmaster@web.de</a><br />Forum: <a target="_blank" href="' + QT.Lang.get("meta", "forumlink_addfree") + '">Grepolis-Forum</a><br />Website: <a target="_blank" href="' + QT.Links.grepolisqt_main + '">grepolisqt.de</a><br />Facebook: <a target="_blank" href="' + QT.Links.grepolisqt_facebook + '">Grepolis QT</a></p></td>';
				HTML_tab3 += '<td width="33%" style="text-align:center">' + QT.Lang.get("meta", "donation_btn") + '</td>';
				HTML_tab3 += '<td width="33%" style="text-align:right"><img style="margin-right: -10px" src="http://s7.directupload.net/images/140711/bl938hld.png"></td></tr></tbody></table>';
				HTML_tab3 += '<div style="text-align: justify"><p />' + QT.Lang.get("settings", "prologue") + '</div>';
				HTML_tab3 += '<p /><b>' + QT.Lang.get("settings", "donations") + ':</b><table width="100%" cellspacing="0" border="0"><tbody>';
				$.each(q_donations, function (a, b) {
					HTML_tab3 += '<tr>';
					$.each(b, function (d, e) {
						HTML_tab3 += '<td>' + e + '</td>';
					});
					HTML_tab3 += '</tr>'
				});
				HTML_tab3 += '</tbody></table>';
				HTML_tab3 += '<p /><small>' + QT.Lang.get("settings", "ingame_name") + '</small>';
				HTML_tab3 += '<p /><a style="padding-bottom: 10px" href="http://adf.ly/?id=2057648" target="_blank">' + QT.Lang.get("settings", "adfly") + '</a>';
				HTML_tab3 += '</div></div>';
				return HTML_tab3;
			}
			function handle_and_style() {
				$("#qmenu_einstellungen_sendmail").css({
					"margin-left" : "1px"
				});
				$("#qmenu_einstellungen_sendmail").click(function () {
					if ($("#trans_lang").length && !$.trim($("#trans_lang").val())) {
						HumanMessage.error(QT.Lang.get("settings", "enter_lang_name"));
						return;
					} else if ($("#langdiv").val() === QT.Lang.get("settings", "info")) {
						HumanMessage.error(QT.Lang.get("settings", "choose_lang"));
						return;
					} else if ($("#trans_content .toSend").length === 0) {
						HumanMessage.error(QT.Lang.get("settings", "no_translation"));
						return;
					}
					hOpenWindow.showConfirmDialog('', QT.Lang.get("settings", "trans_sure"), function () {
						$("#ajax_loader").css({"visibility":"visible"});
						var trans_HTML_send = pName + "<br/>" + sID + "<br/>" + wID + "<p/>";
						$("#trans_content > DIV").each(function (i) {
							if ($(".toSend", this).length != 0) {
								trans_HTML_send += "<b>" + $("SPAN", this).text() + " : {</b><br/>";
								$(".toSend", this).each(function (index) {
									trans_HTML_send += $(this).data("name") + " : '" + $("td:last textarea", this).val() + "',<br/>";
								});
								trans_HTML_send += "},<br/>";
							}
						});
						var xhr = $.ajax({
								type : 'POST',
								url : "https://mandrillapp.com/api/1.0/messages/send.json",
								dataType : 'json',
								data : {
									key : 'Q1FnSR3v9I0K07yUvgCUgw',
									message : {
										html : trans_HTML_send,
										subject : 'Quack Toolsammlung Translation ' + $("#langdiv").val(),
										from_email : "QuackToolsammlung@mail.com",
										to : [{
												"email" : "Quackmaster@web.de",
											}
										]
									}
								}
							});
						xhr.done(function (data) {
							$("#ajax_loader").css({"visibility":"hidden"});
							HumanMessage.success(QT.Lang.get("settings", "trans_success"));
						});
						xhr.fail(function (jqXHR, textStatus, errorThrown) {
							$("#qtajaxloader").css({
								"display" : "none"
							});
							HumanMessage.error(QT.Lang.get("settings", "trans_fail"));
						});
					});
				});
				$(".qbox").click(function () {
					$(this).toggleClass("checked");
				});
				$("#qmenu_einstellungen_safe_BTN").css({
					"float" : "right",
					"margin-right" : "1px"
				}).click(function () {
					var valuesToSave = {};
					$(".qbox").each(function (index) {
						if (!$(this).hasClass("checked")) {
							valuesToSave[this.id] = false;
						}
					});
					QT.Settings.save_all(valuesToSave);
				});
				$("#qmenu_einstellungen_reset_BTN").css({
					"float" : "left",
					"margin-left" : "1px"
				}).click(function () {
					hOpenWindow.showConfirmDialog('', QT.Lang.get("settings", "text19"), function () {
						QT.Settings.delete_all();
					});
				});
				$(".contentDiv > DIV:last-child").css({
					"margin-bottom" : "5px"
				});
				$("#langdiv").change(function () {
					var lang_tab2 = $(this).val().toLowerCase();
					var langHTML_tab2 = "";
					if ($(this).val() === QT.Lang.get("settings", "info")) {
						wnd.setContent(inhalte.qset_tab2);
						handle_and_style();
						return;
					} else if ($(this).val() === QT.Lang.get("settings", "add_lang")) {
						langHTML_tab2 += '<div style="margin-top: 5px; padding: 5px; border: 1px solid #B48F45"><span><b>' + QT.Lang.get("settings", "language") + '</b></span><br /><table width="100%" cellspacing="1" border="0"><tbody>';
						langHTML_tab2 += '<tr><td style="width:50%"><div style="max-height:150px; overflow:auto">' + QT.Lang.get("settings", "name") + '</div></td>';
						langHTML_tab2 += '<td style="width:50%"><textarea id="trans_lang"></textarea></td>';
						langHTML_tab2 += '</tr></tbody></table></div>';
					}
					$.each(QT.Lang.en, function (a, b) {
						if (a != "meta") {
							langHTML_tab2 += '<div style="margin-top: 5px; padding: 5px; border: 1px solid #B48F45"><span><b>' + a + '</b></span><br /><table width="100%" cellspacing="1" border="0"><tbody>';
							$.each(b, function (c, d) {
								langHTML_tab2 += '<tr data-name="' + c + '">';
								langHTML_tab2 += '<td style="width:50%"><div style="max-height:150px; overflow:auto">' + d + '</div></td>';
								langHTML_tab2 += (QT.Lang[lang_tab2] != undefined && QT.Lang[lang_tab2][a] != undefined && QT.Lang[lang_tab2][a][c] != undefined) ? '<td style="width:50%"><textarea>' + QT.Lang[lang_tab2][a][c] + '</textarea></td>' : '<td style="width:50%"><textarea>' + QT.Lang.en[a][c] + '</textarea></td>';
								langHTML_tab2 += '</tr>';
							});
							langHTML_tab2 += '</tbody></table></div>';
						}
					});
					$("#trans_content").html(langHTML_tab2);
					$("#trans_content td").css({
						"width" : "50%",
						"border" : "1px solid transparent",
					});
					$("#trans_content textarea").css({
						"height" : "18px",
						"width" : "99%",
						"resize" : "vertical",
						"margin" : "0",
						"padding" : "0"
					});
					$("#trans_content textarea").on("change", function () {
						$(this).parent().css({
							"border" : "1px solid green"
						});
						$(this).parent().parent().addClass("toSend");
						$(this).val($(this).val());
					});
					$(".contentDiv div:last-child").css({
						"margin-bottom" : "5px"
					});
				});
				/* Implement Check Update Button later
				<a id="qtUpdate_check" class="down_big reload" href="#" style="float:right;margin-top:4px"></a>
				$("#qtUpdate_check").click(function () {
					QT.Updater.hideNotice();
					QT.Updater.forceCheck();
				});
				$('#qtUpdate_check').mousePopup(new MousePopup(QT.Lang.get("settings", "update_check")));*/
			}
			var wnd = GPWindowMgr.Create(GPWindowMgr.TYPE_QT_SCRIPTMANAGER) || GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_QT_SCRIPTMANAGER);
			wnd.setTitle(QT.Lang.get("qtoolbox", "settings"));
			wnd.setContent(inhalte.qset_tab1);
			if ($("#qmenu_settings_tabs").length === 0) {
				wnd.getJQElement().append('<div class="menu_wrapper minimize closable" style="left: 1px; right: 33px"><ul id="qmenu_settings_tabs" class="menu_inner">' + QT.Helper.grepo_submenu("qset_tab3", QT.Lang.get("settings", "info"))[0].outerHTML + QT.Helper.grepo_submenu("qset_tab2", QT.Lang.get("settings", "translations"))[0].outerHTML + QT.Helper.grepo_submenu("qset_tab1", QT.Lang.get("settings", "settings"))[0].outerHTML + '</ul></div>');
			}
			$("#qmenu_settings_tabs li a").removeClass("active");
			$("#qset_tab1").addClass("active");
			handle_and_style();
			$("#qmenu_settings_tabs li a").click(function () {
				$("#qmenu_settings_tabs li a").removeClass("active");
				$(this).addClass("active");
				wnd.setContent(inhalte[this.id]);
				handle_and_style();
			});
		},
		selectunitshelper : function () {
			var wnds = GPWindowMgr.getOpen(Layout.wnd.TYPE_TOWN);
			for (var e in wnds) {
				if (wnds.hasOwnProperty(e)) {
					var wndid = wnds[e].getID();

					var testel = $('DIV#gpwnd_'+wndid+' A.gt_balanced');
					if (testel.length > 0) continue;

					var handler=wnds[e].getHandler();

					$('DIV#gpwnd_'+wndid+' A.select_all_units').after(' | <a class="gt_balanced" style="position:relative; top:3px" href="#">'+QT.Lang.get("town_info", "no_overload")+'</a> | <a class="gt_delete" style="position:relative; top:3px" href="#">'+QT.Lang.get("town_info", "delete")+'</a>');

					var gt_bl_groundUnits=new Array('sword','slinger','archer','hoplite','rider','chariot','catapult','minotaur','zyklop','medusa','cerberus','fury','centaur','calydonian_boar','godsent');

					$('DIV#gpwnd_'+wndid+' A.gt_balanced').click(function () {
						var units=new Array();
						var item;

						for (var i=0; i<gt_bl_groundUnits.length; i++)		{
							if (handler.data.units[gt_bl_groundUnits[i]])			{
								item={name:gt_bl_groundUnits[i], count:handler.data.units[gt_bl_groundUnits[i]].count, population:handler.data.units[gt_bl_groundUnits[i]].population};
								units.push(item);
							}
						}

						if (handler.data.researches && handler.data.researches.berth) {
							var berth=handler.data.researches.berth;
						} else {
							var berth=0;
						}

						var totalCap=handler.data.units.big_transporter.count*(handler.data.units.big_transporter.capacity+berth)+handler.data.units.small_transporter.count*(handler.data.units.small_transporter.capacity+berth);
						units.sort(function(a,b){
							return b.population-a.population;
						});

						for (i=0; i<units.length; i++) {
							if (units[i].count==0)			{
								units.splice(i,1);
								i=i-1;
							};
						}

						var restCap=totalCap;
						var sendUnits=new Array();
						for (i=0; i<units.length; i++)		{
							item={name:units[i].name, count:0};
							sendUnits[units[i].name]=item;
						};

						var hasSent;
						k=0;
						while (units.length>0)		{
							hasSent=false;
							k=k+1;
							for (i=0; i<units.length; i++)			{
								if (units[i].population<=restCap)				{
									hasSent=true;
									units[i].count=units[i].count-1;
									sendUnits[units[i].name].count=sendUnits[units[i].name].count+1;
									restCap=restCap-units[i].population;
								}
							}
							for (i=0; i<units.length; i++)
								if (units[i].count==0)				{
									units.splice(i,1);
									i=i-1;
								};
								if (!hasSent)			{
									break;
								}
						}

						handler.getUnitInputs().each(function ()		{
							if (!sendUnits[this.name])			{
								if (handler.data.units[this.name].count>0)
									this.value=handler.data.units[this.name].count;
								else
									this.value='';
							}
						});

						for (i=0; i<gt_bl_groundUnits.length; i++)		{
							if (sendUnits[gt_bl_groundUnits[i]])			{
								if (sendUnits[gt_bl_groundUnits[i]].count>0)
									$('DIV#gpwnd_'+wndid+' INPUT.unit_type_'+gt_bl_groundUnits[i]).val(sendUnits[gt_bl_groundUnits[i]].count);
								else
									$('DIV#gpwnd_'+wndid+' INPUT.unit_type_'+gt_bl_groundUnits[i]).val('');
							}
						}

						$('DIV#gpwnd_'+wndid+' INPUT.unit_type_sword').trigger('change');
					});

					$('DIV#gpwnd_'+wndid+' A.gt_delete').click(function () {
						handler.getUnitInputs().each(function ()		{
							this.value='';
						});
						$('DIV#gpwnd_'+wndid+' INPUT.unit_type_sword').trigger('change');
					});

				}
			}
		},
		simulatorExport : function () {
			QT.Helper.Screenshot.btn_preview("#place_simulator_form .game_header", "qt_simulatorexport", "simulator", function() {

				$("#place_simulator").clone().appendTo("#qt_canvas");

				//$("#qt_canvas .place_sim_select_gods_wrap select")
				$("#qt_canvas #place_simulator").css({"padding-top":"1px", "overflow-x":"hidden"});
				$("#qt_canvas .game_border").css({"margin":"1px 2px 2px 2px"});

				var select_god_att = $('#place_simulator .place_sim_select_gods.att select option:selected').val();
				var select_god_def = $('#place_simulator .place_sim_select_gods.def select option:selected').val();
				var select_strategies = $('#place_simulator .place_sim_select_strategies select option:selected').val();
				var select_units = $('#place_simulator .place_sim_insert_units select option:selected').val();
				$('#qt_canvas .place_sim_select_gods.att select option[value="'+select_god_att+'"]').prop('selected', true);
				$('#qt_canvas .place_sim_select_gods.def select option[value="'+select_god_def+'"]').prop('selected', true);
				$('#qt_canvas .place_sim_select_strategies select option[value="'+select_strategies+'"]').prop('selected', true);
				$('#qt_canvas .place_sim_insert_units select option[value="'+select_units+'"]').prop('selected', true);

				// Elements to change
				var elemensToChange = [
				".game_border_top", ".game_border_bottom", ".game_border_left", ".game_border_right", ".game_border_corner",
				".game_header", ".game_body", ".place_simulator_odd, .place_simulator_odd2", ".place_simulator_even, .place_simulator_even2", ".game_list_footer",
				".hero40x40, .unit_icon40x40", ".place_symbol.place_attack", "td .place_symbol, .place_sim_select_gods .place_symbol", ".place_insert_field",
				"a.button .left, a.button .middle, a.button .right", ".place_sim_showhide", ".place_image .is_night", ".power_icon16x16"
				];
				return elemensToChange;
			});
			$("#qt_simulatorexport").css({"top":"0px"});
		},
		statsandscripts : function () {
			var grepoGameBorder = '<div class="game_border"><div class="game_border_top"></div><div class="game_border_bottom"></div><div class="game_border_left"></div><div class="game_border_right"></div><div class="game_border_corner corner1"></div><div class="game_border_corner corner2"></div><div class="game_border_corner corner3"></div><div class="game_border_corner corner4"></div><div class="game_header bold" style="height:18px;padding:3px 11px">';
			var grepoGameBorderContainer = '<div class="qsettingsContainer" style="padding:5px 5px 0px 5px; overflow: auto">';

			var SAS_HTML = [];
			SAS_HTML[0] = ["Tools", {
					//"grepostats" : ["Grepolis Stats", "http://adf.ly/B7C8k", "Clash Rank", "http://www.clashrank.com/contact", QT.Links.grepostats, "Bietet Statistiken und Übersichten über Spieler, Allianzen, Städte und vielem mehr"],
					"grepolisintel" : ["Grepolis Intel", "http://adf.ly/B7D1y", "wansyth", "mailto:wansyth@grepointel.com", QT.Links.grepointel, "Ähnlich wie Grepo Stats, aber mit einigen zusätzlichen Funktionen wie Serverkarten oder Polissuche"],
					"grepolismaps" : ["Grepolis Maps", "http://adf.ly/B7BlJ", "Gehirnpfirsich", "mailto:info@twmaps.org", QT.Links.grepomaps_main, "Kartentool - Weltkarten aller Server"],
					"quo" : ["Quo - Allianz Bashliste", "http://adf.ly/pc8xL", "Maltokor", "http://forum.de.grepolis.com/private.php?do=newpm&u=47548", QT.Links.quo_main, "Alternative zu Grepobash"],
					//"grepobash" : ["Grepolis Bashrangliste", "http://adf.ly/B6HBW", "quert", "mailto:support@terenceds.de", QT.Links.grepobash_main, "Allianzinterne Bashrangliste"],
					"polissuche" : ["Polissuche", "http://adf.ly/fGG9b", "tonda", "http://forum.de.grepolis.com/private.php?do=newpm&u=1345", QT.Links.polisssuche_main, "Deutsche Suchfunktion für Städte mit breiter Auswahl von Filteroptionen. Nützlich um Geisterstädte und Inaktive zu finden"],
					"grepofinder" : ["Grepolis Finder", "http://adf.ly/B7D6r", "Ludovic Drolez", "mailto:ludo@drolez.com", QT.Links.grepofinder_main, "Suchen von Städten mit bestimmten Filteroptionen. Nützlich um Geisterstädte und Inaktive zu finden"],
					"grepounitcompare" : ["Grepolis Truppenrechner", "http://adf.ly/1F7GrC", "Quackmaster", "http://forum.de.grepolis.com/private.php?do=newpm&u=11342", QT.Lang.get("meta", "unitscalculator"), "Eine Tabelle um die Verteidigungswerte der einzelnen Einheiten in Grepolis miteinander zu vergleichen"],
					"grepoutils" : ["Grepoutils", "http://adf.ly/B7Cgc", "sayunu", "http://forum.pt.grepolis.com/member.php?219-sayunu", QT.Links.grepoutils, "Bietet einige Tools für Grepolis"],
					"grepolisrevobericht" : ["Grepolis Revo Bericht", "http://adf.ly/cY3Ww", "znyde", "http://forum.de.grepolis.com/private.php?do=newpm&u=47082", QT.Links.grepolisrevobericht, "Formatiert eure Deffanfragen anschaulich und übersichtlich für das Forum"],
					"grepoforen" : ["GrepoForen", "http://adf.ly/cY4st", "schüri", "http://forum.de.grepolis.com/private.php?do=newpm&u=1559", QT.Links.grepoforen, "Kostenloses Grepo-phpBB-Forum, dass im Vergleich zu einem normalen Forum über viele nützliche Zusatzfunktionen für Grepolis verfügt."],
					"abakus" : ["Abakus - Der Grepolis Rechner", "http://adf.ly/B7CyQ", "Aerials", "http://forum.de.grepolis.com/private.php?do=newpm&u=781", QT.Links.abakus, "Rechner und Planer rund um Grepolis zum Download auf den Computer"],
					"grepotool" : ["Grepotool", "http://adf.ly/eAYD9", ".Pete.", "http://forum.de.grepolis.com/private.php?do=newpm&u=38433", QT.Links.grepotool, "<ul><li>Frei scroll- und zoombare Grepo-Karte einer jeden Welt</li><li>Spieler oder Allianzen können farblich markiert werden (politische Karte)</li><li>Man kann zu jeder Stadt eintragen, welche Einheiten drinstehen</li><li>Es lassen sich verschiedene Listen von Städten anlegen</li><li>uvm.</li></ul>"],
					"revoformatierer" : ["Grepolis Revolte-Bericht-Formatierer", "http://adf.ly/pc9Vp", "zynde", "http://forum.de.grepolis.com/member.php?47082-znyde", QT.Links.revoformatierer, "Formatiert Revolte Berichte für das Allianzforum"],
					"youscreen" : ["YouScreen", "http://adf.ly/BKCfU", "Lukas Ruschitzka", "mailto:webmaster@youscreen.de", QT.Links.youscreen, "Screenshot Tool - mit der Druck-Taste einen Screenshot erstellen und direkt ins Internet hochladen (vorherige Bearbeitung möglich)"],
				}
			];
			SAS_HTML[1] = ["Skripte", {
					"quacktools" : ["Quack Toolsammlung", "http://adf.ly/AAMwY", "Quackmaster", "http://forum.de.grepolis.com/private.php?do=newpm&u=11342", QT.Links.quacktools, "<ul><li>Grepo Stats Button in der Stadtinfo, Spielerinfo und Allianzinfo</li><li>Überschüssiges Silber bis 15k wird in das Formfeld in der Höhle vorab eingetragen. Im Formfeld können Beträge mit Enter bestätigt werden</li><li>In Berichten und im Simulator werden Truppenverluste in Rohstoffe/Gunst/BP umgerechnet</li><li>Anzeige von Punkten für bestimmte Gebäude im Senat</li><li>Buttonleiste mit Links zu allen wichtigen Toolseiten</li><li>Verschieden Ansichtsmöglichkeiten</li><li>BB Code Ausgabe der stationierten Truppen in und außerhalb einer Stadt für das Allianzforum oder Nachrichten</li><li>BB Code Ausgabe aller Gebäudestufen einer Stadt</li><li>Kein Überladen der Schiffe im Angriffs-/Unterstützungsfenster</li><li>Erweiterung der Kulturübersicht (G.Tio2.0Tools)</li><li>Erweiterung der Befehlsübersicht (Anzahl von Bewegungen wird angezeigt)</li><li>Hotkeys zu verschiedenen Funktionen</li><li>Übersicht über sämtliche erlaubten Statistiken und Skripte</li><li>Transportrechner</li><li>Online Timer</li><li>Google Docs Implementation</li><li>Berichte werden farblich markiert und können nach Filtern ausgewählt werden</li><li>Die Breite des Forums kann nach der Anzahl der Menüpunkte erhöht werden</li><li>Anzeige und Funktionen des Skriptes können an-/abgeschaltet werden</li><li>Questsymbole und Questpfeil können verschoben oder versteckt werden</li><li>Button in der Inselübersicht um eine Nachricht an alle Spieler auf der Insel schicken zu können</li><li>Auswahlliste aller Ordner im Berichtefenster</li><li>Beiträge im Forum können selektiert und gelöscht werden</li><li>BB-Code Button neben dem Stadtnamen</li><li>Sortierfunktion in der Höhlenübersicht</li><li>Akademieplaner</li><li>Gewählte Farmoption in der Bauerndörferübersicht (Kaptitän) wird sich gemerkt und automatisch ausgewählt</li></ul>"],
					"grc" : ["Grepolis Report Converter", "http://adf.ly/MBEgz", "Potusek", "mailto:grepolis@potusek.eu", QT.Links.grc, "<ul><li>Kann so gut wie alles in BB-Code umwandeln</li><li>Zugriff auf Spieler-Statistiken</li><li>Anzeige der Verluste (in der Mauer)</li><li>Emoticons in Nachrichten und Beiträgen im Forum</li><li>Zeitanzeige wann ein Zauber wieder verwendet werden kann</li><li>Mehrzeilige Ansicht der Tabs im Allianz Forum</li></ul>"],
					"diotools" : ["DIO-Tools", "http://adf.ly/cY7c1", "Diony", "http://forum.de.grepolis.com/private.php?do=newpm&u=10548", QT.Links.diotools, "<ul><li>Eigens erstellte Grepo-Smileys</li><li>Biremenzähler</li><li>Einheitenstärke DEF/OFF im Einheitenmenü und Auswahl der Einheitentypen</li><li>Einheitenstärke DEF & Bevölkerung in der Kaserne</li><li>Transporterkapazität</li><li>Verkürzte Laufzeit im ATT/UT-Fenster</li><li>Diverse Erweiterungen des Handelsfensters</li><li>Diverse Erweiterungen für Weltwunder</li><li>Angriffs- Unterstützungs-Zähler im Eroberungsfenster</li><li>Diverse GUI-Optimierungen</li></ul>"],
					"playerprofile" : ["Zurück-Button für Spielerprofile", "http://adf.ly/Djc2I", "Menidan", "http://forum.de.grepolis.com/private.php?do=newpm&u=36203", QT.Links.playerprofilescript, "Merkt sich geöffnete Spielerprofile die im Spielerprofilfenster vor und zurück geblättert werden können. Legt außerdem eine Chronik an, welche eine Übersicht aller geöffneten Spielerprofile bietet"],
					"transportrechner_menidan" : ["Transportrechner", "http://adf.ly/cY7nh", "Menidan", "http://forum.de.grepolis.com/private.php?do=newpm&u=36203", QT.Links.transportrechner_menidan, "Ein weiterer Transportrechner"],
					"zeitrechner" : ["Zeitrechner", "http://adf.ly/cY7JP", "Menidan", "http://forum.de.grepolis.com/private.php?do=newpm&u=36203", QT.Links.zeitrechner, "Rechnet die Summe bzw. Differenz von zwei Uhrzeiten aus"],
					"attackwarner" : ["Angriffswarner", "http://adf.ly/cY7c0", "gordon1982", "http://forum.de.grepolis.com/private.php?do=newpm&u=41281", QT.Links.attackwarner, "Spielt einen Warnton ab, wenn man angegriffen wird"],
					"bauerndorfalarm" : ["Bauerndorf Alarm", "http://adf.ly/cY7c2", "Kapsonfire", "http://forum.de.grepolis.com/private.php?do=newpm&u=46026", QT.Links.bauerndorfalarm, "Das Skript gibt Bescheid, wenn im aktuellen Sichtbereich Bauerndörfer zum farmen verfügbar sind"],
					"grepotownlist" : ["Grepolis Stats Townlist", "http://adf.ly/AARtm", "GTeauDFAdGTio", "http://forum.de.grepolis.com/private.php?do=newpm&u=8531", QT.Links.grepotownslist, "Zusatzfunktionen für die Grepolis Stats Seite. Ermöglicht die Umwandlung der Städte eines Spielers in BB-Code"],
					"gs_eroberungsstatistiken" : ["Grepolis Stats Eroberungsstatistiken", "http://adf.ly/rGbkm", "Menidan", "http://forum.de.grepolis.com/private.php?do=newpm&u=36203", QT.Links.gs_eroberungsstatistiken, "Erstellt Statistiken für die Eroberungen von Allianzen"],
				}
			];

			var inhalt = "";

			inhalt += '<div id="stats_scripts_content" class="contentDiv" style="padding:0 5px; overflow: auto; height:434px">';

			$.each(SAS_HTML, function (a, b) {
				inhalt += '<div id="' + b[0] + '">' + grepoGameBorder + b[0] + '<a class="forum_export" style="float:right" href="#"><img src="http://s14.directupload.net/images/140124/8tzken7v.png" style="margin-top: -2px; margin-left: 11px;" /></a>' + "</div>" + grepoGameBorderContainer;
				$.each(b[1], function (c, d) {
					inhalt += '<a href="' + d[1] + '" target="_blank">' + d[0] + '</a>';
					inhalt += '<small> von <a href="' + d[3] + '" target="_blank">' + d[2] + '</a></small><br />';
					inhalt += '<small><a href="' + d[4] + '" target="_blank">Direktlink</a></small><br />';
					inhalt += d[5] + '<p />';
				});
				inhalt += "</div></div></div>";
			});

			inhalt += '</div>';

			var wnd = GPWindowMgr.Create(GPWindowMgr.TYPE_QT_STATSANDSCRIPTS) || GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_QT_STATSANDSCRIPTS);
			wnd.setTitle(QT.Lang.get("qtoolbox", "stats_scripts"));
			wnd.setContent(inhalt);
			var mo_Export = "Liste als BB-Code für das Forum";
			$('.forum_export').mousePopup(new MousePopup(mo_Export));
			var expRahmen_a = "<div class='inner_box'><div class='game_border'><div class='game_border_top'></div><div class='game_border_bottom'></div><div class='game_border_left'></div><div class='game_border_right'></div><div class='game_border_corner corner1'></div><div class='game_border_corner corner2'></div><div class='game_border_corner corner3'></div><div class='game_border_corner corner4'></div><div class='game_header bold' style='height:18px;'><div style='float:left; padding-right:10px;'></div>";
			var expRahmen_b = "</div><textarea id='expTextarea' style=\"height: 228px; width: 685px;\">";
			var expRahmen_c = "</textarea></div><div style='overflow-x: hidden; padding-left: 5px; position: relative;'></div></div></div>";
			var expTitel = "Copy & Paste";
			$('#Tools .forum_export').click(function () {
				var expInhalt_Stats = "[quote][font=sansserif][center][size=20][b]Tools:[/b][/size][/center][/font][/quote]\n[quote][font=sansserif]";
				$.each(SAS_HTML[0][1], function (a, b) {
					expInhalt_Stats += '[size=10][url=' + b[1] + ']' + b[0] + '[/url][/size]';
					expInhalt_Stats += '[size=6] von [url=' + b[3] + ']' + b[2] + '[/url]\n[url=' + b[4] + ']Direktlink[/url][/size]\n';
					expInhalt_Stats += b[5] + '\n\n';
				});
				expInhalt_Stats += "[/font][/quote]";
				var wnd = GPWindowMgr.Create(GPWindowMgr.TYPE_QT_BBCODE) || GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_QT_BBCODE);
				wnd.setTitle(QT.Lang.get("qtoolbox", "bb_codes") + " - Tools");
				wnd.setContent(expRahmen_a + expTitel + expRahmen_b + expInhalt_Stats + expRahmen_c);
				$("#expTextarea").focus(function () {
					var that = this;
					setTimeout(function () {
						$(that).select();
					}, 10);
				});
			});
			$('#Skripte .forum_export').click(function () {
				var expInhalt_Skripte = "[quote][font=sansserif][center][size=20][b]Skripte:[/b][/size]\nAdd-ons installieren um die Skripte zum laufen zu bringen:\n[b]Firefox:[/b] [url=https://addons.mozilla.org/de/firefox/addon/greasemonkey/]Greasemonkey[/url] ; [b]Chrome:[/b] [url=https://chrome.google.com/webstore/detail/dhdgffkkebhmkfjojejmpbldmpobfkfo]Tampermonkey[/url][/center][/font][/quote]\n[quote][font=sansserif]";
				$.each(SAS_HTML[1][1], function (a, b) {
					expInhalt_Skripte += '[size=10][url=' + b[1] + ']' + b[0] + '[/url][/size]';
					expInhalt_Skripte += '[size=6] von [url=' + b[3] + ']' + b[2] + '[/url]\n[url=' + b[4] + ']Direktlink[/url][/size]\n';
					if (b[5].indexOf("<") != -1) {
						var text_sanatize = b[5].replace(/<\li>/ig, '- ').replace(/<\/li>/ig, '\n').replace(/(<([^>]+)>)/ig, "");
						expInhalt_Skripte += text_sanatize + '\n';
					} else {
						expInhalt_Skripte += b[5] + '\n\n';
					}
				});
				expInhalt_Skripte += "[/font][/quote]";
				var wnd = GPWindowMgr.Create(GPWindowMgr.TYPE_QT_BBCODE) || GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_QT_BBCODE);
				wnd.setTitle(QT.Lang.get("qtoolbox", "bb_codes") + " - Skripte");
				wnd.setContent(expRahmen_a + expTitel + expRahmen_b + expInhalt_Skripte + expRahmen_c);
				$("#expTextarea").focus(function () {
					var that = this;
					setTimeout(function () {
						$(that).select();
					}, 10);
				});
			});
		},
		sylvester2017 : function () {
			var wnd = GPWindowMgr.Create(GPWindowMgr.TYPE_QT_STANDARD) || GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_QT_STANDARD);
			wnd.setTitle('Quack Toolsammlung - Sylvester 2017 Gewinnspiel');
			var html = '<h1>Frohes Neues Jahr!!</h1><p>Ich hoffe ihr seid gut reingerutscht. Es gab schon länger kein Update mehr für die Toolsammlung, weswegen ich direkt zu Jahresbeginn mal ein Lebenszeichen geben wollte.</p><p>Ich habe daher mal zur Feier des neuen Jahres ein kleines Gewinnspiel gestartet. Zu gewinnen gibt es wie immer eine 10€ Paysafe Karte.</p><p>Alles was ihr dafür machen müsst ist an einer kleinen <a href="http://l4asrv-6.wi.hs-osnabrueck.de/limesurvey/index.php/936383?lang=de" target="_blank">Umfrage</a> teilzunehmen. Das Ganze kostet maximal 5 Minuten eurer Zeit und hilft mir sogar bei einer Hausarbeit, die ich für mein Wirtschaftspsychologie Studium erledigen muss. ;)</p><p>Ein bischen Eile ist geboten, da die Umfrage nur bis zum 08.01.2017 läuft - am besten also einfach direkt jetzt schnell erledigen. Das Gewinnspiel läuft nur für den deutschen Markt, weswegen eure Chance zu gewinnen diesmal auf jeden Fall etwas besser sein wird. ;)</p><p>Weitere Infos gibt es noch hier:</p>';
			html += '<a style="margin-bottom: 20px;" href="http://grepolisqt.de/umfrage/" target="_blank" class="button"><span class="left"><span class="right"><span class="middle"><small>Info zur Umfrage</small></span></span></span></a>';
			html += '<div>Viele Grüße <br> Quack</div>';
			html += '<div style="margin-top: 20px">';
			html += '<a id="sylvester2017_close" href="#" class="button"><span class="left"><span class="right"><span class="middle"><small>Bitte später nochmal dran erinnern</small></span></span></span></a>';
			html += '<a id="sylvester2017_close_forever" href="#" class="button"><span class="left"><span class="right"><span class="middle"><small>Danke ich habs verstanden - verschone mich in Zukunft</small></span></span></span></a>';
			html += '</div>';
			wnd.setContent(html);

			$('#sylvester2017_close').click(function () {
				wnd.close();
			});

			$('#sylvester2017_close_forever').click(function () {
				hOpenWindow.showConfirmDialog('', 'Schon an der Umfrage teilgenommen? ;)', function () {
					QT.Settings.save("sylvester2017", false);
					wnd.close();
				});
			});
		},
		tb_activitiesExtra : function () {
			$("#toolbar_activity_recruits_list").hover(
				function () {
				if ($("#qplusmenuRecruits").length == 0) {
					$("#toolbar_activity_recruits_list").append('<div id="qplusmenuRecruits" class="qplusmenu"><div id="qplusdraghandleRecruits" class="qplusdraghandle"></div><a class="qplusback" href="#"></a></div>');
					$('#qplusmenuRecruits .qplusback').click(function () {
						qplus_destroy("qplusmenuRecruits");
					});
				}
			}, function () {
				$('#qplusmenuRecruits').remove();
			});
			$("#toolbar_activity_commands_list").hover(
				function () {
				if ($("#qplusmenuCommands").length == 0) {
					$("#toolbar_activity_commands_list").append('<div id="qplusmenuCommands" class="qplusmenu"><div id="qplusdraghandleCommands" class="qplusdraghandle"></div><a class="qplusback" href="#"></a></div>');
					$('#qplusmenuCommands .qplusback').click(function () {
						qplus_destroy("qplusmenuCommands");
					});
				}
			}, function () {
				$('#qplusmenuCommands').remove();
			});
			$("#toolbar_activity_trades_list").hover(
				function () {
				if ($("#qplusmenuTrades").length == 0) {
					$("#toolbar_activity_trades_list").append('<div id="qplusmenuTrades" class="qplusmenu"><div id="qplusdraghandleTrades" class="qplusdraghandle"></div><a class="qplusback" href="#"></a></div>');
					$('#qplusmenuTrades .qplusback').click(function () {
						qplus_destroy("qplusmenuTrades");
					});
				}
			}, function () {
				$('#qplusmenuTrades').remove();
			});

			$('<style id="qplusmenustyle" type="text/css">\
																									.displayImp {display: block !important}\
																									.qplusmenu {margin:6px 22px 2px 5px;height:11px;display:block;position:relative}\
																									.qplusdraghandle {width:100%;height:11px;position:absolute;background:url(http://s14.directupload.net/images/131001/7guz6abs.png)}\
																									.qplusback {right:-18px;margin-top:-1px;width:16px;height:12px;position:absolute;background:url(http://s1.directupload.net/images/131001/u6le7bdw.png)}\
																									</style>').appendTo('head');

			$('#toolbar_activity_recruits_list').draggable({
				cursor : "move",
				handle : ".qplusdraghandle",
				start : function () {
					$("#qplusmenuRecruitsSTYLE").remove();
					$('#toolbar_activity_recruits_list').addClass("displayImp");
				},
				stop : function () {
					var qposition = $('#toolbar_activity_recruits_list').position();
					$('<style id="qplusmenuRecruitsSTYLE" type="text/css">#toolbar_activity_recruits_list {left: ' + qposition.left + 'px !important;top: ' + qposition.top + 'px !important}</style>').appendTo('head');
				}
			});
			$('#toolbar_activity_commands_list').draggable({
				cursor : "move",
				handle : ".qplusdraghandle",
				start : function () {
					$('#toolbar_activity_commands, #toolbar_activity_commands_list').off("mouseout");
					$("#qplusmenuCommandsSTYLE").remove();
					$('#toolbar_activity_commands_list').addClass("displayImp");

				},
				stop : function () {
					var qposition = $('#toolbar_activity_commands_list').position();
					$('<style id="qplusmenuCommandsSTYLE" type="text/css">#toolbar_activity_commands_list {left: ' + qposition.left + 'px !important;top: ' + qposition.top + 'px !important}</style>').appendTo('head');
				}
			});
			$('#toolbar_activity_trades_list').draggable({
				cursor : "move",
				handle : ".qplusdraghandle",
				start : function () {
					$("#qplusmenuTradesSTYLE").remove();
					$('#toolbar_activity_trades_list').addClass("displayImp");
				},
				stop : function () {
					var qposition = $('#toolbar_activity_trades_list').position();
					$('<style id="qplusmenuTradesSTYLE" type="text/css">#toolbar_activity_trades_list {left: ' + qposition.left + 'px !important;top: ' + qposition.top + 'px !important}</style>').appendTo('head');
				}
			});

			function qplus_destroy(JQselector) {
				if (JQselector == "qplusmenuCommands") {
					$('#toolbar_activity_commands_list').hide();
					$('#toolbar_activity_commands_list').on("mouseleave", function () {
						$('#toolbar_activity_commands_list').hide();
					});
					$('#toolbar_activity_recruits, #toolbar_activity_trades').on("mouseenter", function () {
						$('#toolbar_activity_commands_list').hide();
					});
				}
				$("#" + JQselector).parent().removeClass("displayImp");
				$("#" + JQselector + "STYLE").remove();
			}

		},
		townStatsButtons : function () {
			var wndArray = GPWindowMgr.getOpen(Layout.wnd.TYPE_TOWN);
			for (var e in wndArray) {
				if (wndArray.hasOwnProperty(e)) {
					var c = wndArray[e].getID();
					var d = $("DIV#gpwnd_" + c + " .qt_gsbutton");
					if (!$("DIV#gpwnd_" + c + " DIV#towninfo_towninfo A.gp_player_link").length > 0 || d.length > 0)
						continue;
					var e = $("DIV#gpwnd_" + c + " DIV#towninfo_towninfo A.gp_player_link").attr("href");
					var f = e.split(/#/);
					var g = $.parseJSON(atob(f[1] || f[0]));
					var h = window.location.host.replace(/.grepolis.com.*$/, "");
					var i = h.replace(/\d+/, "");
					var j = $("DIV#gpwnd_" + c + " DIV#towninfo_towninfo UL.game_list DIV.list_item_right");
					//$(j[1]).append('<a class="qt_gsbutton" target="_blank" href="http://' + i + ".grepostats.com/world/" + h + "/player/" + g.id + '"><img src="http://s14.directupload.net/images/120328/kxn3oknc.png"></a>');
					//$(j[1]).css("width", "+=25px");
					if (!$('DIV#gpwnd_' + c + ' a[onclick^="Layout.allianceProfile"]').length > 0)
						continue;
					var k = $('DIV#gpwnd_' + c + ' a[onclick^="Layout.allianceProfile"]').attr("onclick").replace(")", "").split(",")[1];
					var l = $('DIV#gpwnd_' + c + ' a[onclick^="Layout.allianceProfile"]').parent().find(".list_item_right");
					//var x = $("DIV#gpwnd_" + c + " .assign_ally_color").parent();
					//l.css("width", "+=26px");
					//l.append('<span class="qt_gsbutton"><a class="qt_gsbutton" target="_blank" href="http://' + i + ".grepostats.com/world/" + h + "/alliance/" + k + '"><img src="http://s14.directupload.net/images/120328/kxn3oknc.png"></a></span>');
					if (mID === "de") {
						l.css("width", "+=26px");
						l.append('<a class="qt_quobutton" target="_blank" href="http://marekblomkvist.com/quo/'+ h +'/'+ k +'"><img src="http://s7.directupload.net/images/140615/fhkhdsdc.png"></a>');
					}
				}
			}
		},
		townInactivity : function () {
			var a = QT.wnd.find("DIV#towninfo_towninfo UL.game_list DIV.list_item_left A.gp_player_link");
			if (!a.length > 0) return;
			QT.Helper.Inactivity.loadDisplay(a, "margin:3px 3px 0 0;");
		},
		townTradeImprovement : function () {
			if (QT.wnd.find(".q_needed").length > 0 || QT.wnd.find(".town-capacity-indicator").length == 0)
				return;

			function getRes(res_type, wnd_id, mode) {
				var res = {};
				res.wnd = $("DIV#gpwnd_" + wnd_id);
				res.selector = res.wnd.find("#town_capacity_" + res_type);
				res.caption = {
					curr : parseInt(res.wnd.find("#big_progressbar .caption .curr").html()),
					max : parseInt(res.wnd.find("#big_progressbar .caption .max").html()),
					now : parseInt(res.wnd.find("#trade_type_" + res_type + " input").val())
				}
				res.amounts = {
					curr : parseInt(res.selector.find(".curr").html()) || 0,
					curr2 : parseInt(res.selector.find(".curr2").html().substring(3)) || 0,
					curr3 : parseInt(res.selector.find(".curr3").html().substring(3)) || 0,
					max : parseInt(res.selector.find(".max").html()) || 0
				}
				if (mode === "cult" || mode === "cultreverse") {
					res.amounts.max = (res_type === "stone") ? 18000 : 15000;
				}
				if (mode === "cultreverse") {
					var townrescurrent = $("div#ui_box div.ui_resources_bar div.indicator[data-type='" + res_type + "'] div.amount").text();
					res.needed = townrescurrent - res.amounts.max;
				} else {
					res.needed = res.amounts.max - res.amounts.curr - res.amounts.curr2;
				}
				return res;
			}

			QT.wnd.find(".tripple-progress-progressbar").each(function () {
				var res_type = this.id.split("_")[2];
				var res = getRes(res_type, QT.wndId);
				$(this).find(".amounts").append('<span class="q_needed_' + res_type + '_' + QT.wndId + '"> &#9658; ' + res.needed + '</span>');
			});

			QT.wnd.find("#trade_tab").append(
				'<a id="q_wood_'+QT.wndId+'_max" class="q_trade q_max" style="top:211px" href="#"></a>' +
				'<a id="q_stone_'+QT.wndId+'_max" class="q_trade q_max" style="top:245px" href="#"></a>' +
				'<a id="q_iron_'+QT.wndId+'_max" class="q_trade q_max" style="top:279px" href="#"></a>' +
				'<a id="q_wood_'+QT.wndId+'_cult" class="q_trade q_send_cult" style="top:211px" href="#"></a>' +
				'<a id="q_stone_'+QT.wndId+'_cult" class="q_trade q_send_cult" style="top:245px" href="#"></a>' +
				'<a id="q_iron_'+QT.wndId+'_cult" class="q_trade q_send_cult" style="top:279px" href="#"></a>' +
				'<a id="q_wood_'+QT.wndId+'_cultreverse" class="q_trade q_send_cult_reverse" style="top:211px" href="#"></a>' +
				'<a id="q_stone_'+QT.wndId+'_cultreverse" class="q_trade q_send_cult_reverse" style="top:245px" href="#"></a>' +
				'<a id="q_iron_'+QT.wndId+'_cultreverse" class="q_trade q_send_cult_reverse" style="top:279px" href="#"></a>'
			);

			QT.wnd.find(".q_send_cult").css({
				"right" : "84px",
				"position" : "absolute",
				"height" : "16px",
				"width" : "22px",
				"background-image" : "url(http://s7.directupload.net/images/130330/d67gpq9g.png)",
				"background-repeat" : "no-repeat",
				"background-position" : "0px -1px"
			});
			QT.wnd.find(".q_send_cult_reverse").css({
				"left" : "105px",
				"position" : "absolute",
				"height" : "16px",
				"width" : "22px",
				"background-image" : "url(http://s7.directupload.net/images/130619/p6jyv8gu.png)",
				"background-repeat" : "no-repeat",
				"background-position" : "0px -1px"
			});
			QT.wnd.find(".q_max").css({
				"right" : "105px",
				"position" : "absolute",
				"height" : "16px",
				"width" : "22px",
				"background-image" : "url(http://s1.directupload.net/images/130330/x2pnbew9.png)",
				"background-repeat" : "no-repeat",
				"background-position" : "0px -1px"
			});

			QT.wnd.find(".q_trade").hover(
				function () {
				$(this).css({
					"background-position" : "0px -17px"
				});
			},
				function () {
				$(this).css({
					"background-position" : "0px -1px"
				});
			});

			QT.wnd.find(".q_trade").click(function () {
				var id = this.id.split("_");
				var res = getRes(id[1], id[2], id[3]);
				if (res.needed - res.amounts.curr3 <= 0 || res.caption.curr  <= 0 || res.amounts.curr3 > 0) {
					res.send = 0;
				} else if (res.needed - res.amounts.curr3 > res.caption.curr) {
					res.send = res.caption.curr + res.amounts.curr3
				} else {
					res.send = res.needed;
				}
				res.wnd.find("#trade_type_" + id[1] + " input").val(res.send).select().blur();
			});
		},
		townslist : function () {
			if ($('#town_groups_list a.town_bb').length != 0)
				return;
			$('.content .group_name .name').append('<a class="town_bb" style="position: absolute; display: block; top: 4px; right: 16px;" href="#"><img src="http://s14.directupload.net/images/140124/8tzken7v.png" style="height: 15px; width: 17px;" /></a>');
			$('.town_bb').click(function (e) {
				var towngrp_id = $(this).parent().data('groupid');
				var cities_towngroup = ITowns.town_group_towns.getTowns(towngrp_id);
				var bb_content = "";
				var bb_count = 0;
				$.each(cities_towngroup, function (key, town) {
					bb_count++;
					bb_content += ""+ bb_count +". [town]" + town.attributes.town_id + "[/town] (" + town.town_model.attributes.points + ") " + town.town_model.attributes.island_x + "|" + town.town_model.attributes.island_y + "\n";
				});
				var expRahmen_a = "<div class='inner_box'><div class='game_border'><div class='game_border_top'></div><div class='game_border_bottom'></div><div class='game_border_left'></div><div class='game_border_right'></div><div class='game_border_corner corner1'></div><div class='game_border_corner corner2'></div><div class='game_border_corner corner3'></div><div class='game_border_corner corner4'></div><div class='game_header bold' style='height:18px;'><div style='float:left; padding-right:10px;'></div>";
				var expRahmen_b = "</div><textarea id='expTextarea' style=\"height: 228px; width: 685px;\">";
				var expRahmen_c = "</textarea></div><div style='overflow-x: hidden; padding-left: 5px; position: relative;'></div></div></div>";
				var expTitel = "Copy & Paste";
				var wnd = GPWindowMgr.Create(GPWindowMgr.TYPE_QT_BBCODE) || GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_QT_BBCODE);
				wnd.setTitle(QT.Lang.get("qtoolbox", "bb_codes") + " - " + QT.Lang.get("bbcode", "cities"));
				wnd.setContent(expRahmen_a + expTitel + expRahmen_b + bb_content + expRahmen_c);
				$("#expTextarea").focus(function () {
					var that = this;
					setTimeout(function () {
						$(that).select();
					}, 10);
				});
			});
			$('.town_group_town').hover(function () {
				var townID = $(this).data("townid");
				$(this).append('<div class="jump_town" data-townid="' + townID + '"></div>');
				$(".jump_town")
				.css({
					"display" : "block",
					"top" : "2px",
					"right" : "15px",
					"height" : "16px",
					"width" : "16px",
					"position" : "absolute",
					"background" : "url('http://cdn.grepolis.com/images/game/layout/town_list_btns.png') repeat scroll -32px 0 transparent"
				})
				.click(function (e) {
					e.stopPropagation();
					WMap.mapJump(ITowns.getTown(townID), true);
				}) // MapTiles.focusTown(townID);
				.hover(function () {
					$(this).css({
						"background-position" : "-32px -16px"
					});
				}, function () {
					$(this).css({
						"background-position" : "-32px 0"
					});
				});
			}, function () {
				$(".jump_town").remove();
			});
		},
		transportcalculator : {
			init : function () {
				$('#ui_box .nui_units_box .units_naval').after('<div id="units_transport" class="container_hidden" style="position:relative"><div class="top"></div><div class="bottom"></div><div class="middle"><div class="left"></div><div class="right"></div><div class="content"><div class="units_wrapper clearfix"><div id="tr_wrapper"><div id="tr_options"><div id="tr_recruit" class="checkbox_new checked" style="margin-right:-1px"><div class="tr_options tr_recruit"></div><div class="cbx_icon" style="margin-top:2px"></div></div><div id="tr_outside" class="checkbox_new disabled" style="margin-right:-1px"><div class="tr_options tr_outside tr_deactivated"></div><div class="cbx_icon" style="margin-top:2px"></div></div><div id="tr_big_transporter" class="checkbox_new checked" style="margin-right:-1px"><div class="tr_options tr_big_transporter"></div><div class="cbx_icon" style="margin-top:2px"></div></div><div id="tr_small_transporter" class="checkbox_new checked" style="margin-right:-1px"><div class="tr_options tr_small_transporter"></div><div class="cbx_icon" style="margin-top:2px"></div></div></div><div id="tr_content"></div></div></div><div id= "tr_btn" class="">' + QT.Lang.get("transport_calc", "btn_main") + '</div><div id="tr_btn_top"></div><div class="bottom" style="bottom:19px"></div></div></div></div>');
				$("#tr_btn").css({
					"cursor" : "pointer",
					"position" : "relative",
					"height" : "16px",
					"right" : "5px",
					"font-size" : "10px",
					"font-weight" : "bold",
					"color" : "#EEDDBB",
					"padding-left" : "3px",
					"background" : "url(http://s14.directupload.net/images/140307/2mughecu.png) no-repeat scroll 0 0 rgba(0, 0, 0, 0)"
				});
				$("#tr_btn_top").css({
					"position" : "absolute",
					"height" : "6px",
					"right" : "0px",
					"bottom" : "14px",
					"width" : "138px",
					"background" : "url(http://s14.directupload.net/images/140424/9ol6fg6t.png) no-repeat"
				});
				$("#tr_wrapper").css({
					"padding" : "7px 7px 17px 7px",
					"color" : "#ECB44D",
					"font-size" : "10px",
					"display" : "none",
					"margin-left" : "-6px",
					"background" : "url(http://zz.cdn.grepolis.com/images/game/layout/layout_units_nav_bg.png) repeat scroll 0 0 rgba(0, 0, 0, 0)"
				});
				$(".tr_options").css({
					"background" : "url(http://s14.directupload.net/images/140130/zo8kqb7x.png) no-repeat scroll 0 0 rgba(0, 0, 0, 0)",
					"width" : "15px",
					"height" : "18px",
					"float" : "left"
				});
				$(".tr_outside").css({
					"background-position" : "0 -36px"
				});
				$(".tr_recruit").css({
					"background-position" : "0 -54px"
				});
				$(".tr_deactivated").css({
					"background-image" : "url(http://s7.directupload.net/images/140729/z474f6rk.png)"
				});
				$(".tr_big_transporter").css({
					"background-position" : "0 0"
				});
				$(".tr_small_transporter").css({
					"background-position" : "0 -18px"
				});
				$('#tr_recruit').mousePopup(new MousePopup(QT.Lang.get("transport_calc", "recruits")));
				$('#tr_outside').mousePopup(new MousePopup(QT.Lang.get("transport_calc", "disabled")));
				$('#tr_big_transporter').mousePopup(new MousePopup(QT.Lang.get("transport_calc", "slowtrans")));
				$('#tr_small_transporter').mousePopup(new MousePopup(QT.Lang.get("transport_calc", "fasttrans")));
				$("#tr_options .checkbox_new").click(function () {
					if ($(this).find('DIV.tr_deactivated').length === 0) {
						$(this).toggleClass("checked");
						$("#tr_content").html(QT.Functions.transportcalculator.refresh());
					}
				});
				$("#tr_btn").hover(
					function () {
					$("#tr_btn").css({
						"color" : "#ECB44D"
					});
				},
					function () {
					$("#tr_btn").css({
						"color" : "#EEDDBB"
					});
				});
				$("#tr_btn").click(function () {
					if ($("#tr_wrapper").css('display') == 'none') {
						$("#tr_content").html(QT.Functions.transportcalculator.refresh());
					}
					$("#tr_wrapper").slideToggle();
				});
			},
			refresh : function () {
				var selected_town = ITowns.getTown(Game.townId);
				var GD_units = GameData.units;
				var GD_heroes = GameData.heroes;
				var Transporter_Offset = selected_town.researches().hasBerth() ? GameDataResearches.getBonusBerth() : 0;
				var Ground_Units_BHP = 0;
				var Transport_Capacity = 0;
				var units_outside = 0;
				//var FreePopulation = selected_town.getAvailablePopulation();
				// Units inside town
				var units_own = selected_town.units();
				$.each(units_own, function (unit, number) {
					// Landtruppen
					if (!(unit in GD_heroes) && units_own[unit] != 0 && !GD_units[unit].flying && GD_units[unit].capacity == undefined) {
						Ground_Units_BHP += number * GD_units[unit].population;
					}
					// Transportschiffe
					else if (!(unit in GD_heroes) && units_own[unit] != 0 && !GD_units[unit].flying && GD_units[unit].capacity != 0) {
						if ($(".tr_" + unit).parent().hasClass("checked")) {
							Transport_Capacity += number * (GD_units[unit].capacity + Transporter_Offset);
						}
					}
				});
				// recruits
				if ($(".tr_recruit").parent().hasClass("checked")) {
					var recruits = selected_town.getUnitOrdersCollection().models;
					for (var i = 0; i < recruits.length; ++i) {
						var unit = recruits[i].attributes.unit_type;
						var number = recruits[i].attributes.units_left;
						//Landtruppen
						if (!(unit in GD_heroes) && units_own[unit] != 0 && !GD_units[unit].flying && GD_units[unit].capacity == undefined) {
							Ground_Units_BHP += number * GD_units[unit].population;
						}
						// Transportschiffe
						else if (!(unit in GD_heroes) && units_own[unit] != 0 && !GD_units[unit].flying && GD_units[unit].capacity != 0) {
							if ($(".tr_" + unit).parent().hasClass("checked")) {
								Transport_Capacity += number * (GD_units[unit].capacity + Transporter_Offset);
							}
						}
					}
				}
				// Units outside town
				if ($(".tr_outside").parent().hasClass("checked")) {
					gpAjax.ajaxPost('units_beyond_info', 'get_supporting_units_for_foreigners', {}, false, function (data) {
						$.each(data.collections[0].data, function (index, object) {
							if (object.home_town_id == Game.townId) {
								$.each(object, function (unit, number) {
									if (!(unit in GD_heroes) && GD_units[unit] && number != 0 && !GD_units[unit].flying && GD_units[unit].capacity == undefined) {
										Ground_Units_BHP += number * GD_units[unit].population;
									} else if (!(unit in GD_heroes) && GD_units[unit] && number != 0 && !GD_units[unit].flying && GD_units[unit].capacity != 0) {
										if ($(".tr_" + unit).parent().hasClass("checked")) {
											Transport_Capacity += number * (GD_units[unit].capacity + Transporter_Offset);
										}
									}
								});
							}
						});
						$("#tr_content").html(createHint(Transport_Capacity, Ground_Units_BHP));
					});
				} else {
					$("#tr_content").html(createHint(Transport_Capacity, Ground_Units_BHP));
				}
				function createHint(Transport_Capacity, Ground_Units_BHP) {
					var textCapacity = '' + QT.Lang.get("transport_calc", "available") + '<br><span style="background: url(http://s14.directupload.net/images/131025/6coe5znl.png) repeat scroll 0 0 rgba(0, 0, 0, 0); color: #EEDDBB; font-family: Verdana; font-size: 11px; font-weight: bold; text-shadow: 1px 1px 0 #000000; width:110px; display:inline-block"><b>' + Transport_Capacity + '</b></span>';
					var textUnits = '' + QT.Lang.get("transport_calc", "transportable") + '<br><span style="background: url(http://s14.directupload.net/images/131025/6coe5znl.png) repeat scroll 0 0 rgba(0, 0, 0, 0); color: #EEDDBB; font-family: Verdana; font-size: 11px; font-weight: bold; text-shadow: 1px 1px 0 #000000; width:110px; display:inline-block""><b>   ' + Ground_Units_BHP + '</b></span>';
					return textCapacity + '<br>' + textUnits;
				}
			}
		},
		unitsBeyondView : function () {
			var selected_town = ITowns.getTown(Game.townId);
			var GD_units = GameData.units;
			var GD_heroes = GameData.heroes;
			var Transporter_Offset = selected_town.researches().hasBerth() ? GameDataResearches.getBonusBerth() : 0;
			var tr_small_cap = GameData.units.small_transporter.capacity + Transporter_Offset;
			var tr_big_cap = GameData.units.big_transporter.capacity + Transporter_Offset;

			function calculate(tr_type_cap, Transport_Capacity, Ground_Units_BHP) {
				var diff = Transport_Capacity - Ground_Units_BHP;
				var tr_empty = Math.floor(diff / tr_type_cap);
				var rest = tr_type_cap - (diff - (tr_empty * tr_type_cap));
				if (rest != tr_type_cap) {
					tr_empty++;
				} else {
					rest = 0;
				}
				return [tr_empty, rest];
			}

			$("#units_beyond_list > LI, .support_row").each(function (i, e) {
				var Ground_Units_BHP = 0;
				var Transport_Capacity = 0;
				var a = $(this).children(".unit_icon40x40");
				a.each(function (index) {
					var className = this.className.split(' ');
					var unit = className[className.length - 2];
					var number = $(this).text().trim();
					if (!(unit in GD_heroes) && !GD_units[unit].flying && GD_units[unit].capacity == undefined) {
						Ground_Units_BHP += number * GD_units[unit].population;
					} else if (!(unit in GD_heroes) && !GD_units[unit].flying && GD_units[unit].capacity != 0) {
						Transport_Capacity += number * (GD_units[unit].capacity + Transporter_Offset);
					}
				});

				$(this).find(".place_sendback_container").css({
					"margin-top" : "4px"
				});

				if (Transport_Capacity > 0) {
					var tr_small = calculate(tr_small_cap, Transport_Capacity, Ground_Units_BHP);
					var tr_big = calculate(tr_big_cap, Transport_Capacity, Ground_Units_BHP);
					var tooltip =
						'<div style="position: absolute; margin-left: 40px; margin-top: 5px">' +
						'<div class="qt_sendback_big">' +
						'<div class="qt_sendback_img" style="background-position: 0px 0px; "><span class="qt_sendback_img_span big_naval">' + tr_big[0] + '</span></div>' +
						'<div class="qt_sendback_img" style="background-position: 0px -36px; margin-left: 15px"><span class="qt_sendback_img_span big_land">' + tr_big[1] + '</span></div>' +
						'</div>' +
						'<div class="qt_sendback_small">' +
						'<div class="qt_sendback_img" style="background-position: 0px -18px;"><span class="qt_sendback_img_span small_naval">' + tr_small[0] + '</span></div>' +
						'<div class="qt_sendback_img" style="background-position: 0px -36px; margin-left: 15px"><span class="qt_sendback_img_span small_land">' + tr_small[1] + '</span></div>' +
						'</div></div>';

					if ($(this).find(".qt_sendback_header_span").length == 0) {
						$(this).children("h4").append('<span class="qt_sendback_header_span"> (' + Ground_Units_BHP + '/' + Transport_Capacity + ')</span>')
						$(this).find(".place_sendback_container").append(tooltip);
					} else {
						$(this).find(".qt_sendback_header_span").text(' (' + Ground_Units_BHP + '/' + Transport_Capacity + ')');
						$(this).find(".qt_sendback_big .big_naval").text(tr_big[0]);
						$(this).find(".qt_sendback_big .big_land").text(tr_big[1]);
						$(this).find(".qt_sendback_small .small_naval").text(tr_small[0]);
						$(this).find(".qt_sendback_small .small_land").text(tr_small[1]);
					}
				}
			});
			$(".qt_sendback_img").css({
				"width" : "18px",
				"height" : "16px",
				"background-image" : "url(http://s1.directupload.net/images/140619/vyxakj9l.png)",
				"background-repeat" : "no-repeat",
				"display" : "block",
				"float" : "left"
			});
			$(".qt_sendback_img_span").css({
				"margin-left" : "20px"
			});
			$(".qt_sendback_small").css({
				"float" : "left",
				"margin-top" : "1px"
			});
		},
		unitcomparison : function () {
			window.open(QT.Lang.get("meta", "unitscalculator"));
		},
		wallExport : function () {
			QT.Helper.Screenshot.btn_preview("#building_wall .game_header", "qt_wall_export", "wall", function() {
				$("#building_wall").clone().appendTo("#qt_canvas");

				$("#qt_canvas #building_wall").css({"padding-top":"1px"});
				$("#qt_canvas #building_wall .game_list").css({"max-height":"none"});
				$("#qt_canvas .game_border").css({"margin":"1px 2px 2px 2px"});

				var elemensToChange = [
				".game_list .even", ".game_list .odd", ".game_header", ".game_list_footer",
				".game_border_top", ".game_border_bottom", ".game_border_left", ".game_border_right", ".game_border_corner",
				".hero50x50, .unit_icon50x50", ".wall_symbol"
				];
				return elemensToChange;
			});
		}
	};

	/************************************************************************
	 * Observer
	 ***********************************************************************/
	if (mID == "fr") {
		$(document).ajaxComplete(function (event, xhr, settings) {
			var url = settings.url.split("?");
			if (url == "http://script.cdn.grepolistoolkit.com/prod/php/controler.php") {
				QT.Settings.values.grepolistoolkit = true;
			}
		});
	}
	$.Observer(GameEvents.game.load).subscribe('QT', function (e, data) {
		QT.Settings.setValues();
		QT_sendStats(mID, sID, QT.Settings.values.script_version);
		QT_updater(QT.Lang.get("meta", "changelog"), QT.Lang.get("meta", "forumlink"));
		QT.Helper.mutationobserver();
		QT.Helper.addWindowTypes();
		QT.Functions.qtoolbox();
		//if (mID == "de" && QT.Settings.values.sylvester2017) { QT.Functions.sylvester2017(); };
		if (QT.Settings.values.qmenu_settings_hotkey_active)
			QT.Functions.hotkeys();
		if (QT.Settings.values.qmenu_settings_cityview_BTN)
			QT.Functions.city_view_btn();
		if (QT.Settings.values.qmenu_settings_cityview_window)
			QT.Functions.city_view_window();
		if (QT.Settings.values.qmenu_settings_townbb)
			QT.Functions.bbcodeBtnTown();
		if (QT.Settings.values.qmenu_settings_plusmenu)
			QT.Functions.tb_activitiesExtra();
		if (QT.Settings.values.qmenu_settings_transport_rechner)
			QT.Functions.transportcalculator.init();
		if (QT.Settings.values.qmenu_settings_questliste && $('#quest_overview li').length !== 0)
			QT.Functions.questlist();
		if (QT.Settings.values.qmenu_settings_removetooltipps)
			QT.Functions.removeTooltipps("sidebar");

		$(document).ajaxComplete(function (event, xhr, settings) {
			var ajaxUrl = settings.url.split("?");
			var ajaxType = ajaxUrl[0].substr(6) + "/" + ajaxUrl[1].split("&")[1].substr(7);
			var QTF = QT.Functions;
			var wnd = GPWindowMgr.getFocusedWindow() || false;
			if (wnd) {
				//QT.wnd = wnd;
				QT.wndId = wnd.getID();
				//QT.wndEl = wnd.getJQElement();
				QT.wnd = wnd.getJQElement().find(".gpwindow_content");
			}

			switch (ajaxType) {
				case "index/switch_town":
					if ($("#tr_wrapper").css('display') != 'none')
						QTF.transportcalculator.refresh();
					if (QT.Settings.values.qmenu_settings_hidesilver)
						QTF.hidesIndexIron();
					if (QT.Settings.values.qmenu_settings_cityview_window)
						QTF.city_view_windowTitle();
					if (QT.Settings.values.qmenu_settings_stadtliste && $('#town_groups_list').is(':visible'))
						QTF.townslist();
					if (QT.Settings.values.qmenu_settings_removetooltipps)
						QT.Functions.removeTooltipps("sidebar");
				break;
				case "report/index":
				case "report/move":
				case "report/delete_many":
					if (QT.Settings.values.qmenu_settings_berichte_sortfolders)
						QTF.reportFoldersort();
					if (QT.Settings.values.qmenu_settings_berichte_farben)
						QTF.reportsColor();
					if (QT.Settings.values.qmenu_settings_berichte_move)
						QTF.reportsMove();
					if (QT.Settings.values.qmenu_settings_berichte_filter)
						QTF.reportsFilter();
				break;
				case "report/view":
					if (QT.Settings.values.qmenu_settings_berichte_losses)
						QTF.reportsLosses();
					QTF.reportExport();
				break;
				case "alliance_forum/forum":
					if (QT.Settings.values.qmenu_settings_maximize_forum)
						QTF.forumMaximize();
					if (QT.Settings.values.qmenu_settings_forumdelete)
						QTF.forumDeleteMultiple();
				break;
				case "town_overviews/hides_overview":
					QTF.hidesOverview.init();
				break;
				case "town_overviews/store_iron":
					if (QT.Settings.values.qmenu_settings_hidessilver || QT.Settings.values.qmenu_settings_hidessort)
						QTF.hidesOverview.refresh_silver_total(xhr);
				break;
				case "town_overviews/command_overview":
					QTF.commandOverview(xhr);
					QTF.commandOverviewExport(); // Canvas width inkorrekt, wenn Scrollleiste nicht vorhanden
				break;
				case "town_overviews/culture_overview":
				case "town_overviews/start_celebration":
				case "town_overviews/start_all_celebrations":
					QTF.cultureOverview();
				break;
				case "building_main/index":
				case "building_main/build":
				case "building_main/cancel":
				case "building_main/tear_down":
					if (QT.Settings.values.qmenu_settings_grepopoints)
						QTF.grepopoints();
				break;
				case "building_barracks/index":
				case "building_docks/index":
					if (QT.Settings.values.qmenu_settings_removetooltipps)
						QTF.removeTooltipps("docks");
				break;
				case "building_barracks/build":
				case "building_barracks/cancel":
				case "building_docks/build":
				case "building_docks/cancel":
					if (QT.Settings.values.qmenu_settings_removetooltipps)
						QTF.removeTooltipps("barracks");
					if ($("#tr_wrapper").css('display') != 'none')
						QTF.transportcalculator.refresh();
				break;
				case "building_place/index":
					if (QT.Settings.values.qmenu_settings_removetooltipps)
						QTF.removeTooltipps("agora");
					QTF.agoraIndexExport();
				break;
				case "building_place/units_beyond":
					if (QT.Settings.values.qmenu_settings_removetooltipps)
						QTF.removeTooltipps("agora");
					QTF.unitsBeyondView();
					QTF.agoraUnitsBeyondExport(); // Grafiken von unitsBeyondView werden nicht angezeigt
				break;
				case "building_place/simulator":
					QTF.simulatorExport();
				break;
				case "building_wall/index":
					QTF.wallExport();
				break;
				case "units_beyond_info/send_back_part":
					QTF.unitsBeyondView();
				break;
				case "frontend_bridge/fetch":
					var frontend_bridge = decodeURIComponent(ajaxUrl[1].split("&")[3]).split("\"")[3];
					if (frontend_bridge === "hide" && QT.Settings.values.qmenu_settings_hidesilver) {
						QTF.hidesIndexIron();
					} else if (frontend_bridge === "place") {
						QTF.agoraUnitsBeyondFromTownExport();
						if (QT.Settings.values.qmenu_settings_removetooltipps)
							QTF.removeTooltipps("place");
					} else if (frontend_bridge === "easter") {
						QTF.recipeevent();
					} else if (frontend_bridge === "academy") {
						//QTF.academyMarker();
					}
					if (QT.Settings.values.qmenu_settings_removetooltipps)
						QT.Functions.removeTooltipps("sidebar");

					//if (QT.Settings.values.qmenu_settings_hideaddpoints)
					//QTF.hidesIndexAddPoints();
				break;
				case "frontend_bridge/execute":
					if ($("#tr_wrapper").css('display') != 'none')
						QTF.transportcalculator.refresh();
					if (QT.Settings.values.qmenu_settings_stadtliste && $('#town_groups_list').is(':visible'))
						QTF.townslist();
					if (QT.Settings.values.qmenu_settings_hidesilver)
						QTF.hidesIndexIron();
					if (QT.Settings.values.qmenu_settings_removetooltipps)
						QT.Functions.removeTooltipps("sidebar");
					//if (QT.Settings.values.qmenu_settings_hideaddpoints)
					//QTF.hidesIndexAddPoints();
				break;
				case "town_info/info":
					//QTF.townInactivity();
					QTF.townStatsButtons();
				break;
				case "town_info/trading":
					if (QT.Settings.values.qmenu_settings_tradeimprovement)
						QTF.townTradeImprovement();
				break;
				case "town_info/support":
				case "town_info/attack":
					QTF.selectunitshelper();
					if (QT.Settings.values.qmenu_settings_removetooltipps)
						QTF.removeTooltipps("town_info");
				break;
				case "player/get_profile_html":
					//QTF.playerGSButton(settings);
					//QTF.playerInactivity(settings);
				break;
				case "player/index":
					QTF.addsettingsbutton();
				break;
				case "island_info/index":
					QTF.islandMessage();
					//QTF.islandInactivity(xhr);
					//QTF.islandAddPlayerlinks(xhr);
					if (QT.Settings.values.qmenu_settings_island_villages)
						QTF.islandFarmingVillages();
				break;
				case "alliance/profile":
					//QTF.allianceStatsButtons(settings);
					//QTF.allianceInactivity();
				break;
				case "farm_town_overviews/claim_loads":
					if (QT.Settings.values.qmenu_settings_farmhelper)
						QTF.farmingvillageshelper.rememberloot();
						QTF.farmingvillageshelper.indicateLoot();
				break;
				case "farm_town_overviews/get_farm_towns_for_town":
					if (QT.Settings.values.qmenu_settings_farmhelper && typeof activeFarm != 'undefined')
						QTF.farmingvillageshelper.setloot();
				break;
				case "farm_town_overviews/index":
					QTF.farmingvillageshelper.islandHeader();
				break;
				case "message/view":
					QTF.messageViewAll();
					QTF.messageExport();
				break;
				case "message/new":
					QTF.messageInputwidth();
				break;
			}
		});
	});
}

/************************************************************************
 * Start Method
 ***********************************************************************/
var DATA = {
	script_version : GM_info.script.version,
	onlinetotal : GM_getValue("onlinetotal", 0),
	qmenu_online_version : GM_getValue("qmenu_online_version", 0),
	qmenu_update_next : GM_getValue("qmenu_update_next", 0),
	clicked_sponsor_links : GM_getValue("clicked_sponsor_links", 0),
	clicked_sponsor_link_last : GM_getValue("clicked_sponsor_link_last", 0),
	googledocsurl : GM_getValue("googledocsurl", "https://docs.google.com/spreadsheet/ccc?key=0AkpTmTnKs72_dEF3bWs3SW5iWjdyUEE0M0c3Znpmc3c&embedded=true"),
	grepolistoolkit : GM_getValue("grepolistoolkit", false),
	sylvester2017 : GM_getValue("sylvester2017", true),
	qmenu_settings_akademieplaner : GM_getValue("qmenu_settings_akademieplaner", true),
	qmenu_settings_berichte_farben : GM_getValue("qmenu_settings_berichte_farben", true),
	qmenu_settings_berichte_filter : GM_getValue("qmenu_settings_berichte_filter", true),
	qmenu_settings_berichte_losses : GM_getValue("qmenu_settings_berichte_losses", true),
	qmenu_settings_berichte_move : GM_getValue("qmenu_settings_berichte_move", true),
	qmenu_settings_berichte_sortfolders : GM_getValue("qmenu_settings_berichte_sortfolders", true),
	qmenu_settings_buttonbar : GM_getValue("qmenu_settings_buttonbar", true),
	qmenu_settings_cityview_BTN : GM_getValue("qmenu_settings_cityview_BTN", true),
	qmenu_settings_cityview_window : GM_getValue("qmenu_settings_cityview_window", true),
	qmenu_settings_counter : GM_getValue("qmenu_settings_counter", true),
	qmenu_settings_counter_aktiv : GM_getValue("qmenu_settings_counter_aktiv", true),
	qmenu_settings_farmhelper : GM_getValue("qmenu_settings_farmhelper", true),
	qmenu_settings_farmhelper_hidecities : GM_getValue("qmenu_settings_farmhelper_hidecities", true),
	qmenu_settings_forumdelete : GM_getValue("qmenu_settings_forumdelete", true),
	qmenu_settings_grepopoints : GM_getValue("qmenu_settings_grepopoints", true),
	qmenu_settings_hidesilver : GM_getValue("qmenu_settings_hidesilver", true),
	qmenu_settings_hidessilver : GM_getValue("qmenu_settings_hidessilver", true),
	qmenu_settings_hidessort : GM_getValue("qmenu_settings_hidessort", true),
	qmenu_settings_hotkey_anzeige : GM_getValue("qmenu_settings_hotkey_anzeige", true),
	qmenu_settings_hotkey_jump : GM_getValue("qmenu_settings_hotkey_jump", true),
	qmenu_settings_hotkey_active : GM_getValue("qmenu_settings_hotkey_active", true),
	qmenu_settings_island_villages : GM_getValue("qmenu_settings_island_villages", true),
	qmenu_settings_maximize_forum : GM_getValue("qmenu_settings_maximize_forum", true),
	qmenu_settings_plusmenu : GM_getValue("qmenu_settings_plusmenu", true),
	qmenu_settings_questliste : GM_getValue("qmenu_settings_questliste", true),
	qmenu_settings_questpfeil : GM_getValue("qmenu_settings_questpfeil", true),
	qmenu_settings_removetooltipps : GM_getValue("qmenu_settings_removetooltipps", true),
	qmenu_settings_stadtliste : GM_getValue("qmenu_settings_stadtliste", true),
	qmenu_settings_tradeimprovement : GM_getValue("qmenu_settings_tradeimprovement", true),
	qmenu_settings_transport_rechner : GM_getValue("qmenu_settings_transport_rechner", true),
	qmenu_settings_townbb : GM_getValue("qmenu_settings_townbb", true)
};

unsafeWindow.QT_saveValue = function (name, val) {
	setTimeout(function () {
		GM_setValue(name, val);
	}, 0);
};
unsafeWindow.QT_saveAllValues = function (values) {
	setTimeout(function () {
		var exceptions = ["qmenu_update_next", "qmenu_online_version", "onlinetotal", "googledocsurl", "clicked_sponsor_links", "clicked_sponsor_link_last"];

		for (key in DATA) {
			if (exceptions.indexOf(key) > -1) {
				continue;
			}
			GM_deleteValue(key);
		}

		for (key in values) {
			GM_setValue(key, values[key]);
		}

		window.location.reload();
	}, 0);
};
unsafeWindow.QT_deleteValue = function (name) {
	setTimeout(function () {
		GM_deleteValue(name);
	}, 0);
};
unsafeWindow.QT_deleteAllValues = function () {
	setTimeout(function () {
		for (key in DATA) {
			GM_deleteValue(key);
		}
		window.location.reload();
	}, 0);
};
unsafeWindow.QT_sendStats = function (market_id, player_id, script_version) {
	setTimeout(function () {
		GM_xmlhttpRequest({
			method : "POST",
			url : "http://grepolisqt.de/test.php?market_id=" + market_id + "&player_id=" + player_id + "&script_version=" + script_version
		});
	}, 0);
};
unsafeWindow.QT_updater = function (changelog, forumlink) {
	setTimeout(function () {
		var date_now = new Date();
		var date_time = date_now.getTime();
		var version_lastcheck = GM_getValue("qmenu_online_version");
		var version_current = GM_info.script.version;
		var next_update = GM_getValue("qmenu_update_next") || 0;

		function forceCheck() {
			GM_xmlhttpRequest({
				method : "GET",
				url : "https://openuserjs.org/meta/Quackmaster/Quack_Toolsammlung.meta.js",
				headers : {
					"User-agent" : "Mozilla/5.0",
					"Accept" : "text/html"
				},
				onload : function (response) {
					var meta = parseHeaders(response.responseText);
					GM_setValue("qmenu_online_version", meta.version);
					GM_setValue("qmenu_update_next", date_time + (6 * 60 * 60 * 1000));
					if (versionCompare(meta.version, version_current) > 0) {
						showNotice(meta.version);
					}
				}
			});
		}
		function parseHeaders(metadataBlock) {
			var headers = {};
			var metadata = metadataBlock.match(/\/\/ ==UserScript==((.|\n|\r)*?)\/\/ ==\/UserScript==/);
			if (metadata) {
				var lines = metadata[0].match(/@(.*?)(\n|\r)/g);
				for (var i = 0; i < lines.length; i++) {
					var lineData = lines[i].match(/^@([^\s]*?)\s+(.*)/);
					var key = lineData[1];
					var value = lineData[2];
					if (!headers[key])
						headers[key] = value;
					else if (headers[key]instanceof Array)
						headers[key].push(value);
					else
						headers[key] = [headers[key], value];
				}
			}
			return headers;
		}
		function versionCompare(left, right) {
			if (typeof left != "string" || typeof right != "string")
				return false;
			var a = left.split('.');
			var b = right.split('.');
			var len = Math.max(a.length, b.length);
			for (var i = 0; i < len; i++) {
				if ((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) {
					return 1;
				} else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) {
					return -1;
				}
			}
			return 0;
		}
		function showNotice(version) {
			var objTo = document.getElementById('ui_box');
			var divtest = document.createElement("div");
			divtest.innerHTML = '<div id="qt_updatebox" style="position:absolute; bottom:0px; left:50%; margin-left:-214px; width:429px; height:69px; z-index:1000; color:#EEDDBB; background-image:url(http://s7.directupload.net/images/140125/8ke6vfq4.png)">' +
				'<img id="qt_updatebox_frog" src="http://s1.directupload.net/images/140711/eshmcqzu.png" style="position:relative; left:23px; top:4px; float:left"/>' +
				'<div id="qt_updatebox_content" style="position:relative; left:38px; top:9px; float:left"; text-align: left>' +
				'<span id="qt_updatebox_update" style="color:red">Update!</span><br/>' +
				'Quack Toolsammlung Version: ' + version + '<br/>' +
				'<a href="' + changelog + '" target="_blank" class="qt_updatebox_link" style="color:#ECB44D">Changelog</a> | ' +
				'<a href="' + forumlink + '" target="_blank" class="qt_updatebox_link" style="color:#ECB44D">Forum</a> | ' +
				'<a href="http://adf.ly/pcChx" target="_blank" class="qt_updatebox_link" style="color:#ECB44D">Website</a>' +
				'</div>' +
				'<a id="qt_updatebox_close" class="cancel" style="float:right; margin-right:19px; margin-top:2px;" href="#"></a>' +
				'</div>';
			objTo.appendChild(divtest);

			var qt_updatebox = document.getElementById('qt_updatebox_close');
			qt_updatebox.addEventListener('click', function (event) {
				document.getElementById('qt_updatebox').remove();
			});

			/*$("#qt_updatebox a").hover(function () {
			$(this).css({
			"color" : "#804000"
			});
			}, function () {
			$(this).css({
			"color" : "#ECB44D"
			});
			});*/
		}

		if (date_time > next_update) {
			forceCheck();
		} else if (versionCompare(version_lastcheck, version_current) > 0) {
			showNotice(version_lastcheck);
		}
	}, 0);
};
unsafeWindow.QT_inactivity = function (world_id, callback) {
	setTimeout(function () {
		GM_xmlhttpRequest({
			method : "GET",
			url : 'http://polissearch.marco93.de/inactivity_cache/'+world_id+'.txt',
			onload : function (response) {
				var players = response.responseText.split(','), player;
				var players_ob = {};
				for (var i in players) {
					player = players[i].toString().split(':');
					players_ob[player[0]] = player[1];
				}
				unsafeWindow.QT_inactive_players = cloneInto(players_ob, unsafeWindow);
				callback(players_ob);
			}
		});
	}, 0);
};

if (typeof exportFunction == 'function') {
	exportFunction(unsafeWindow.QT_saveValue, unsafeWindow, {
		defineAs : "QT_saveValue"
	});
	exportFunction(unsafeWindow.QT_saveAllValues, unsafeWindow, {
		defineAs : "QT_saveAllValues"
	});
	exportFunction(unsafeWindow.QT_deleteValue, unsafeWindow, {
		defineAs : "QT_deleteValue"
	});
	exportFunction(unsafeWindow.QT_deleteAllValues, unsafeWindow, {
		defineAs : "QT_deleteAllValues"
	});
	exportFunction(unsafeWindow.QT_sendStats, unsafeWindow, {
		defineAs : "QT_sendStats"
	});
	exportFunction(unsafeWindow.QT_updater, unsafeWindow, {
		defineAs : "QT_updater"
	});
	exportFunction(unsafeWindow.QT_inactivity, unsafeWindow, {
		defineAs : "QT_inactivity",
		allowCrossOriginArguments: true
	});
}

function appendScript() {
	if (unsafeWindow.Game) {

		var QT_script = document.createElement('script');
		QT_script.type = 'text/javascript';
		QT_script.textContent = main_script.toString() + "\n main_script(" + JSON.stringify(DATA) + ");";
		document.body.appendChild(QT_script);

		var QT_HTML2Canvas = document.createElement('script');
		QT_HTML2Canvas.type = 'text/javascript';
		QT_HTML2Canvas.innerHTML = GM_getResourceText('HTML2Canvas');
		document.getElementsByTagName('head')[0].appendChild(QT_HTML2Canvas);

		var QT_styles = document.createElement('style');
		QT_styles.type = 'text/css';
		QT_styles.innerHTML = GM_getResourceText('QT_styles');
		document.getElementsByTagName('head')[0].appendChild(QT_styles);

	} else {
		setTimeout(function () {
			appendScript();
		}, 100);
	}
}

appendScript();
