// ==UserScript==
// @name            TW-Collections-BR Translation
// @description     Portuguese Translation - TW-Collections - see below 
// @include         http://*.the-west.*/game.php*
// @include         https://greasyfork.org/users/5125
// @version         1.0.7
// @grant       none 
// @namespace https://greasyfork.org/users/5125
// @downloadURL https://update.greasyfork.org/scripts/4920/TW-Collections-BR%20Translation.user.js
// @updateURL https://update.greasyfork.org/scripts/4920/TW-Collections-BR%20Translation.meta.js
// ==/UserScript==
// To add a new language to the TW Collections script :
// Copy / paste this content into a new script
// Replace  translator by your name
//			idscript by the id of the script (last part of the url of your script)
//			short_name by the short name for your language
//			name by the long name of your language
// Replace all lines with your translation
// 
//
// Use with TW Collection script :
// Install this script (and of course TW Collections script), the new language appears in the settings.
//

(function(e) {
	var t = document.createElement("script");
	t.type = "application/javascript";
	t.textContent = "(" + e + ")();";
	document.body.appendChild(t);
	t.parentNode.removeChild(t)
})
		(function() {
			if (window.location.href.indexOf(".the-west.") > 0) {

				TWT_ADDLANG = {
					translator : 'VSaantiago',
					idscript : '5125',
					version : '1.0.7',
					short_name : 'en',
					name : 'English',
					translation : {
					   // START OF LANGUAGE VARS
						
							description : "<center><BR /><b>TW Coleções</b><br><b>Dicas e exibição de itens que faltam para as coleções no mercado, lista de itens necessários para as coleções, mostra de itens duplicados, receitas, conjuntos, itens consumíveis em estoque, informações sobre salários, vários atalhos, remover todos os relatórios, etc. Versão TW 2.0.6. </b>",
							Options : {
								tab : {
									setting : 'Configurações'
								},
								checkbox_text : {
									box : {
										title : 'Opções de Interface | Traduzido por <a href=javascript:void(PlayerProfileWindow.open(1848911));>VSaantiago</a>, agradeçam! <a href=https://www.facebook.com/volneysaan>Facebook</a>',
										options : {
											goHome : 'Viajar para a Cidade de Morada',
											goToDaily1 : 'Cidade Fantasma',
											goToDaily2 : 'Campo Indígena Waupee',
											ownSaloon : 'Abrir Saloon',
											openMarket : 'Abrir Mercado',
											mobileTrader : 'Abrir Mercador Ambulante',
											forum : 'Abrir Fórum Local',
											listNeeded : 'Janela do Colecionador'

										}
									},
									collection : {
										title : 'Coleções | Traduzido por <a href=javascript:void(PlayerProfileWindow.open(1848911));>VSaantiago</a>, agradeçam!',
										options : {
											gereNewItems : 'Gerenciar os novos itens adicionados em conquistas bem sucedidas',
											patchsell : 'Sinalize itens em falta no estoque',
											patchtrader : 'Sinalize itens em falta nas lojas',
											patchmarket : 'Sinalize itens em falta no mercado',
											showmiss : 'Lista de itens em falta na canto',
											filterMarket : 'Filtro de Mercado: mostrar apenas faltando itens (coleções)'

										}
									},
									inventory : {
										title : 'Botões para o inventário | Traduzido por <a href=javascript:void(PlayerProfileWindow.open(1848911));>VSaantiago</a>, agradeçam!',
										doublons : 'Botões adicionais eno inventário (Itens Duplicados, Consumíveis, Receitas, Conjuntos)',
										options : {
											doublons : 'Adicionar botão de itens duplicados',
											useables : 'Adicionar botão para consumíveis',
											recipe : 'Adicionar botão para receitas',
											sets : 'Adicionar botão para a lista de conjuntos',
											sum : 'Mostrar soma de venda (ITENS EM LOTE) em pesquisa com base em preços de mercado'

										}
									},
									miscellaneous : {
										title : 'Outras Configurações | Traduzido por <a href=javascript:void(PlayerProfileWindow.open(1848911));>VSaantiago</a>, agradeçam!',
										options : {
											lang : 'Idioma',
											logout : 'Adicionar botão Sair',
											deleteAllReports : 'Adicionar deletar todos relatórios | RECOMENDO DESATIVAR',
											showFees : 'Adicionar Tarifas Bancárias em Mouseover | RECOMENDO DESATIVAR',
											popupTWT:'Abra o menu de TW Coleções no mouseover | RECOMENDO DESATIVAR'
										}
									},
									twdbadds : {
										title : 'Add-on do Cloth Calc | Traduzido por <a href=javascript:void(PlayerProfileWindow.open(1848911));>VSaantiago</a>, agradeçam!',
										options : {
											filterBuyMarket : 'Filtro Mercado: mostrar apenas itens marcados em falta (adicionar tw-db) | RECOMENDO DESATIVAR',
											addNewToShop : 'Mostrar novos itens na loja | RECOMENDO DESATIVAR'
										}
									}
								},
								message : {
									title : 'Informações',
									message : 'As preferências foram aplicadas. <img src=http://wcdn4.dataknet.com/static/resources/icons/set3/858446d3a06.png></img> ',
									reloadButton : 'Recarregar esta página',
									gameButton : 'Voltar ao jogo',
									indispo : 'Definições indisponíveis (Coleção concluída ou script não disponível)',
									more : 'Mais idiomas?',
									moreTip : 'Abra a página de dicas traduções'
								},
								update : {
									title : 'TW Coleções Update',
									upddaily : 'Todos os dias',
									updweek : 'Toda semana',
									updnever : 'Jamais',
									checknow : 'Checar atualizações agora?',
									updok : "O TW Coleções está atualizado! :)",
									updlangmaj : 'Uma atualização está disponível para um ou mais idiomas do script TW Coleções. Click nos links abaixo para atualizar.',
									updscript : 'Uma atualização está disponível para o script TW Coleções Atualizar?',
									upderror : 'Não foi possível atualizar. :( Você deve instalar o script ou o idioma manualmente!'
								},
								saveButton : 'Salvar'

							},
							ToolBox : {
								title : 'Características',
								list : {
									openOptions : 'Configurações'
								}
							},
							Doublons : {
								tip : 'Mostrar apenas os itens duplicados',
								current : 'Busca atual',
								noset : 'Sem Conjunto de Itens',
								sellable : 'Vendável',
								auctionable : 'Leiloável',
								tipuse : 'Mostrar apenas Consumíveis',
								tiprecipe : 'Mostrar apenas Receitas',
								tipsets : 'Mostrar apenas Itens pertinentes a Conjuntos',
								sellGain : ' Dólares, valor com base de LOJA'
							},
							Logout : {
								title : 'Sair'
							},
							AllReportsDelete : {
								button : 'Deletar Todos',
								title : 'Deletar Todos os Relatórios',
								work : 'Trabalho',
								progress : 'Progresso',
								userConfirm : 'Confirmar usuário',
								loadPage : 'Carregar Página',
								deleteReports : 'Excluir relatórios',
								confirmText : 'Excluir todos os relatórios - Você tem certeza?',
								deleteYes : 'Sim, exclua!',
								deleteNo : 'Não!',
								status : {
									title : 'Status',
									wait : 'Espere',
									successful : 'Sucesso :)',
									fail : 'Erro',
									error : 'Erro'
								}
							},
							fees : {
								tipText : '%1 % Salários : $%2'

							},
							twdbadds : {
								buyFilterTip : 'Mostrar apenas os itens que faltam',
								buyFilterLabel : 'Itens restantes'
							},
							collection : {
								miss : "Faltando : ",
								thText : '%1 Itens restantes %2',
								thEncours : 'Você tem um lance para este item',
								thFetch : 'Você pode recuperar este item no mercado ',
								allOpt : 'Todos',
								collectionFilterTip : 'Mostrar apenas itens de coleções',
								collectionFilterLabel : 'só Coleções',
								select : 'Selecione ...',
								listText : 'Itens de colecionador necessário',
								filters : 'Filtros',
								atTrader : 'Vendido por comerciante ambulante',
								atBid : 'Lances atuais',
								atCurBid : 'Lances finalizados',
								atTraderTitle : 'Mostrar itens à venda no comerciante ambulante',
								atBidTitle : 'Mostrar lances em curso',
								atCurBidTitle : 'Mostrar itens recuperáveis no mercado',
								searchMarket : 'Procurar no mercado',
								patchsell : {
									title : "Itens necessários para completar coleções"
								}
							}
						
						// END OF LANGUAGE VARS
					},
					// DO NOT CHANGE BELOW THIS LIGNE
					init : function() {
						var that = this;
						if (typeof window.TWT == 'undefined'
								|| window.TWT == null) {
							EventHandler.listen('twt.init', function() {
								TWT.addPatchLang(that);
								return EventHandler.ONE_TIME_EVENT;
							});
						} else {
							EventHandler.signal('twt_lang_started_'
									+ that.short_name);
							TWT.addPatchLang(that);

						}
					}

				}.init();
			}
		});