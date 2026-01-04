// ==UserScript==
// @name         WME Alinhador e simplificador para segmentos de ruas retas
// @version      0.94
// @description  Adiciona um botão no WME para simplificar a tarefa de alinhar segmentos de rua em uma reta.
// @author       jonny3D, Rômulo Nunes
// @match         https://*.waze.com/*editor*
// @match         https://editor-beta.waze.com/*
// @match         https://beta.waze.com/*
// @exclude         https://www.waze.com/user/*editor/*
// @exclude         https://www.waze.com/*/user/*editor/*
// @grant        none
// @namespace    https://greasyfork.org/users/161049
// @downloadURL https://update.greasyfork.org/scripts/35768/WME%20Alinhador%20e%20simplificador%20para%20segmentos%20de%20ruas%20retas.user.js
// @updateURL https://update.greasyfork.org/scripts/35768/WME%20Alinhador%20e%20simplificador%20para%20segmentos%20de%20ruas%20retas.meta.js
// ==/UserScript==


setTimeout(AlignStreetGeometry, 1999);

function AlignStreetGeometry() {

    var UpdateSegmentGeometry = window.require("Waze/Action/UpdateSegmentGeometry");
    var MoveNode = window.require("Waze/Action/MoveNode");
    var AddNode = window.require("Waze/Action/AddNode");
    var MultiAction = window.require("Waze/Action/MultiAction");
  //  multiaction.setModel(Waze.model);
 
    window.W.selectionManager.events.register("selectionchanged", null, insertAlignStreetGeometryButtons);

    var nodestrabalhados_max = 30;
    var nodestrabalhados = [nodestrabalhados_max-1]; //guarda os nós já trabalhados para o alinhamento para verificar se o segmento está invertido no meio dos outros A -B ou B- A
    var retaprincipal_ID_ponta_A = 0; //guarda o nó de T1
    var retaprincipal_ID_ponta_B = 0; //guarda o nó de T2
    var nodestrabalhados_i = 0;

    var Frases = {
    BR:         {'btn': 'Alinhar Rua', 'msg':'Iniciando algoritmo...' }, // Brazil
    FR:         {'btn': 'Aligner la rue', 'msg':'Algorithme de départ...' }, // France
    RS:         {'btn': 'Выровнять улицу', 'msg':'Алгоритм запуска...' }, // Russia
    SP:         {'btn': 'Alinear la calle', 'msg':'Inicio de Algoritmo...' }, // Spain
    PO:         {'btn': 'Alinhar Rua', 'msg':'Iniciando algoritmo...' }, // Portugal
    UY:         {'btn': 'Alinear la calle', 'msg':'Inicio de Algoritmo...' }, // Uruguay
    US:         {'btn': 'Align Street', 'msg':'Starting Algorithm...' }, // United States
    CA:         {'btn': 'Align Street', 'msg':'Starting Algorithm...' }, // Canada
    AR:         {'btn': 'Alinear la calle', 'msg':'Inicio de Algoritmo...' }, // Argentina
    PA:         {'btn': 'Alinear la calle', 'msg':'Inicio de Algoritmo...' }, // Paraguay
    IL:         {'btn': 'רחוב ישר', 'msg':'הפעלת אלגוריתם...' } // Israel
    };



    function insertAlignStreetGeometryButtons()
    {
        // essa função vai pegar o país do mapa de onde se está editando. Se não estiver na lista acima, fica em inglês.
        var FrasesNaLingua = Frases[window.W.model.countries.top.abbr];
        if (typeof FrasesNaLingua == 'undefined')
        {
            FrasesNaLingua = Frases['US'];
            console.log("WME-ASSRR: ERRO no Cod País:" + window.W.model.countries.top.abbr);
        }
        const BottonExiste = document.getElementById("AlignStreetGeometry");
        if (!BottonExiste) {
            $('.edit-restrictions').after('&nbsp <button id="AlignStreetGeometry" class="waze-btn waze-btn-small waze-btn-white">' + FrasesNaLingua.btn +'</button>');
        }
    }

    $('#sidebar').on('click', '#AlignStreetGeometry', function(event) {
        event.preventDefault();
        DoAlignStreetGeometry();
    });

    function DoAlignStreetGeometry() {
        console.log("WME-ASSRR  ========================================================================================" );
        console.log("WME-ASSRR         I N I C I O   D O    A L G O R I T M O    D E    A L I N H A M E N T O" );
        console.log("WME-ASSRR  ========================================================================================" );
        if (window.W.selectionManager.getSelectedFeatures().length > 0) {
            var T1, T2,
                t;
               // A = 0.0,
               // B = 0.0,
               // C = 0.0;
            var correct = true;

            nodestrabalhados_i = 0;
            for (var e0=0; e0 <= nodestrabalhados_max-1; e0++)
            {
                nodestrabalhados[e0] = 0;
            } //iniciando a memória para os nós visitados.
            console.log("WME-ASSRR: Limpeza da memória OK");

			// define a linha de alinhamento
           //  Waze.selectionManager.getSelectedFeature.length
            if (window.W.selectionManager.getSelectedFeatures().length > 0) {
		   //if (W.selectionManager.selectedItems.length > 0) {

				console.log("WME-ASSRR: Inicio do cálculo da reta principal...  (Percorrendo os segmentos)");
				for (var e = 0; e < window.W.selectionManager.getSelectedFeatures().length; e++) {
					var segment = window.W.selectionManager.getSelectedFeatures()[e];

					if (segment.model.type != "segment")
                    {
						continue;
                    }

					var geometry = segment.model.geometry;

					// determine a fórmula da linha inclinada
					if (geometry.components.length > 1)
                    {
                        //Existem duas formas de pegar um nó. A primeira através das extremidades do segmento. A segunda pegando os nós "from" e "to" do segmento.

                        var nodeID_A = segment.model.attributes.fromNodeID;
                        var nodeID_B = segment.model.attributes.toNodeID;

                        //var A1 = geometry.components[0].clone();
						//var	A2 = geometry.components[geometry.components.length - 1].clone();
                        var nodeA1 = window.W.model.nodes.get(nodeID_A);
                        var nodeA2 = window.W.model.nodes.get(nodeID_B);
                        var A1 = nodeA1.geometry.clone();
                        var A2 = nodeA2.geometry.clone();
                        

                        var flagJaIncluidoA = 0;
                        var flagJaIncluidoB = 0;
                        for (e0 = 0; e0 <= nodestrabalhados_i; e0++)
                        {
                            console.log("Contador e0: " + e0);
                            if (nodestrabalhados[e0] == nodeID_A)
                            {
                                flagJaIncluidoA = 1 ;
                                continue;
                            }
                            else if (nodestrabalhados[e0] == nodeID_B)
                            {
                                flagJaIncluidoB = 1 ;
                                continue;
                            }
                        }
                        if (flagJaIncluidoA == 0)
                        {
                            nodestrabalhados[nodestrabalhados_i++] = nodeID_A;
                        }
                        if (flagJaIncluidoB == 0)
                        {
                            nodestrabalhados[nodestrabalhados_i++] = nodeID_B;
                        }
                        console.log("");
                        console.log("IDs dos Nós da reta principal: " + nodestrabalhados );


                        console.log("WME-ASSRR========================================================================================" );
						console.log("WME-ASSRR: segmento #" + (e) + " A1(" + A1.x + "; " + A1.y + "), A2(" + A2.x + "; " + A2.y + ")");
                        console.log("WME-ASSRR: Ponto A: " + nodeID_A +", Ponto B: " + nodeID_B );


                   
                        // Preciso saber como o segmento está no plano 2D, pra determinar quais extremidades pegar.
                        // não dá pra pegar qualquer nó fixo porque os segmentos podem estar juntos e invertidos B --> A com um A --> B.

                        var delta = GetDeltaDirectPlanar(A1.x,A1.y, A2.x, A2.y);

                        if (delta < 0) // Se os Pontos A e B estiverem invertidos, desinverto. De forma que sempre A1 tenha a menor distancia pra p eixo 0
                        {
							t = A1.x;
							A1.x = A2.x;
							A2.x = t;

							t = A1.y;
							A1.y = A2.y;
							A2.y = t;

                            var t2 = nodeID_A;
                            nodeID_A = nodeID_B;
                            nodeID_B = t2;

                            delta = GetDeltaDirectPlanar(A1.x, A1.y, A2.x, A2.y); //pra atualizar o valor dX e dY caso tenha invertido.

							console.log("WME-ASSRR: Houve ajuste no segmento #" + (e) +". Ficou agora...") ;
                            console.log("WME-ASSRR: segmento #" + (e) + " A1(" + A1.x + "; " + A1.y + "), A2(" + A2.x + "; " + A2.y + ")");
                            console.log("WME-ASSRR: Ponto A: " + nodeID_A +", Ponto B: " + nodeID_B );
						}

						if (e === 0) //primeiro passo da iteração, apenas guardo os dois pontos.
                        {
							T1 = A1.clone();
							T2 = A2.clone();
                            retaprincipal_ID_ponta_A = nodeID_A;
                            retaprincipal_ID_ponta_B = nodeID_B;

						} else { // nos seguintes, apenas expando o ponto final de X, unindo-o na frente ou atrás.      a2   -------   a1   //  t2 ------ t1

                            var deltaA1T1 = GetDeltaDirectPlanar(A1.x, A1.y, T1.x, T1.y);
                            var deltaA2T2 = GetDeltaDirectPlanar(A2.x, A2.y, T2.x, T2.y);
                            //console.log("WME-ASSRR: Delta de A1 e T1: " + deltaA1T1);
                            //console.log("WME-ASSRR: Delta de A2 e T2: " + deltaA2T2);

							if (deltaA1T1 > 0) // se encontrei um nó menor que o já existente em T1.
                            {
								T1.x = A1.x;
								T1.y = A1.y;
                                retaprincipal_ID_ponta_A = nodeID_A;
                                //console.log("WME-ASSRR: Alterado T1");
							}
                            if (deltaA2T2 < 0) // se encontrei um nó maior que o já existente em T2. Não usar else no if anterior porque os segmetnos não são em sequncia
                            {
								T2.x = A2.x;
								T2.y = A2.y;
                                retaprincipal_ID_ponta_B = nodeID_B;
                                //console.log("WME-ASSRR: Alterado T2");
							}
						}

						console.log("WME-ASSRR: Reta Parcial: T1 (" + T1.x + "; " + T1.y + ") , T2 (" + T2.x + "; " + T2.y + ")");
                        console.log("WME-ASSRR: IDs dos nós: T1 ("+retaprincipal_ID_ponta_A+") , T2 (" +retaprincipal_ID_ponta_B + ")");
                        //console.log("WME-ASSRR: IDs dos nós: T1 ("+retaprincipal_ID_ponta_A+") , T2 (" +retaprincipal_ID_ponta_B + ")");
					}
				}

                // Dada a reta calculada acima (ponto inicial da rua e ponto fina) da rua que se quer alinar,
                // precisamos calcular os novos pontos de interseção com a retas das ruas que se conectam a rua alinhada.
                // o alinhamento se dá pelos novos pontos de interseção.

                // Essa é a função da primeira reta.
				//A = T2.y - T1.y;
				//B = T1.x - T2.x;
				//C = T2.x * T1.y - T1.x * T2.y;

                console.log("WME-ASSRR: =====================================================================================");
				console.log("WME-ASSRR: Reta final calculada: T1 (" + T1.x + ";" + T1.y + ") - T2 (" + T2.x + ";" + T2.y + ")");
                console.log("WME-ASSRR: IDs dos nós: T1 ("+retaprincipal_ID_ponta_A+") , T2 (" +retaprincipal_ID_ponta_B + ")");
                console.log("WME-ASSRR: =====================================================================================");
                console.log("" );
				
				// desenhe uma linha de controle
				/*var seg1geo = segment.model.geometry;
				if (seg1geo.components.length > 2)
					seg1geo.components.splice(1, seg1geo.components.length - 2);
				seg1geo.comments[0].x = T1.x;
				seg1geo.comments[0].y = T1.y;
				seg1geo.comments[1].x = T2.x;
				seg1geo.comments[1].y = T2.y;

				var newseg1 = new Waze.Feature.Vector.Segment(seg1geo);
				newseg1.attributes.fromNodeID = null;
				newseg1.attributes.toNodeID = null;

				Waze.model.actionManager.add(new Waze.Action.AddSegment(newseg1));
                */

			} else
            {correct = false;}

			if (correct) // correct
			{
				console.log("");

                // remover nós desnecessários (simplificando segmentos)
				for (var e2 = 0; e2 < window.W.selectionManager.getSelectedFeatures().length; e2++)
                {
					var segment2 = window.W.selectionManager.getSelectedFeatures()[e2];
					var model = segment2.model;

					if (model.type != "segment")
                    {
                        continue;
                    }
                    console.log("WME-ASSRR Percorrendo seleção para simplificar... Segmento #"+ (e2 + 1) + " =======================================" );
					var newGeometry = model.geometry.clone();
					var flagSimpled = false;

					if (newGeometry.components.length > 2)
                    {
						newGeometry.components.splice(1, newGeometry.components.length - 2);
						flagSimpled = true;
					}
					if (flagSimpled)
                    {
                        window.W.model.actionManager.add(new UpdateSegmentGeometry(model, model.geometry, newGeometry));
                    }
                }




                console.log("");
                console.log("WME-ASSRR: Início da etapa para alinhar segmentos...");
                for (e2 = 0; e2 < nodestrabalhados_i; e2++ ) //percorrer toda a seleção
                {

					// trabalhar com o nó para encontrar o nó vizinho da reta adjacente.
                    //decidir qual nó do segmento trabalhar, pegando o fromNodeID ou toNodeID, conforme o caso.

                    console.log("" );
                    console.log("WME-ASSRR Percorrendo seleção para alinhar...                 >>>>>>>>>>>> SEGMENTO #"+ (e2) + " Nó #" + nodestrabalhados[e2] + " <<<<<<<<<< " );
					var node = window.W.model.nodes.get(nodestrabalhados[e2]);
                    var nodeGeo = node.geometry.clone();
                    console.log("WME-ASSRR ID Atual: " + nodestrabalhados[e2] );
                    //console.log("WME-ASSRR Nó.x na lista: " + nodeGeo.x );
                    //console.log("WME-ASSRR  T1.x na reta: " + T1.x );
                    //console.log("WME-ASSRR Nó.y na lista: " + nodeGeo.y );
                    //console.log("WME-ASSRR  T1.y na reta: " + T1.y );


                    var procurar = true;
                    //verificando se o dó é da extreminade para não atualizar.
                    //if ((nodeGeo.x == T1.x) & (nodeGeo.y == T1.y))
                    if ((nodestrabalhados[e2] == retaprincipal_ID_ponta_A))
                    {
                        console.log("WME-ASSRR: Nó da extremidade A...   ABORTAR ALINHAMENTO DESSE NÓ" );   
                        procurar = false;
                    }
                    else if ((nodestrabalhados[e2] == retaprincipal_ID_ponta_B))
                    {
                        console.log("WME-ASSRR: Nó da extremidade B...   ABORTAR ALINHAMENTO DESSE NÓ" );
                        procurar = false;
                    }


                    var node2 = node;
                    var nodeGeo2 = node2.geometry.clone();
                    

                    console.log("");
                    console.log("WME-ASSRR: PERCORRENDO SEGMENTOS QUE PERTENCEM AO MESMO NÓ (ID " + nodestrabalhados[e2] + ")");
                    console.log("WME-ASSRR: Num de segmentos: " + node2.attributes.segIDs.length); //número de segmentos do nó.
                    console.log("WME-ASSRR: Nó de intersecção: " + nodeGeo); //nó usado para busca
                    var RetaAjuste_PontoB = nodeGeo.clone(); //inicializando a variável com o mesmo ponto da origem da reta
                    var encontrouRetaADJ = false;
                    var j = 0;

                    //percorre todos os segmentos que pertencem ao nó. Devemos parar quando encontrar um nó adj.
                    while((j<node2.attributes.segIDs.length) & (encontrouRetaADJ == false) & (procurar == true))
                    {
                        //console.log("WME-ASSRR: loop: " + j);
                        var SegRetaID = node2.attributes.segIDs[j]; //ID de uma Reta com esse Nó
                        var SegReta = window.W.model.segments.get(SegRetaID); //a reta dona do ID
                        var SegReta_geo = SegReta.geometry.clone();
                        var SegReta_A_ID = SegReta.attributes.fromNodeID;
                        //console.log("WME-ASSRR: from: " + SegReta_A_ID);
                        var SegReta_B_ID = SegReta.attributes.toNodeID;
                        //console.log("WME-ASSRR: to: " + SegReta_B_ID);
                        var nodeXY = window.W.model.nodes.get(SegReta_B_ID); //inicializo
                        var nodeXYGeo = nodeXY.geometry.clone();

                        //se apenas o nó A for encontrado, então o segmento AB é adjacente à reta principal
                        if (NoDaRetaPrincipal(SegReta_A_ID) & ! NoDaRetaPrincipal(SegReta_B_ID))
                        {
                            //nodeXY = Waze.model.nodes.get(SegReta_B_ID);
                            //nodeXYGeo = nodeXY.geometry.clone();
                            RetaAjuste_PontoB = nodeXYGeo.clone(); //guardo o nó para usar
                            encontrouRetaADJ = true;
                            //console.log("WME-ASSR Reta ADJ com B");
                        } //se apenas o nó B for encontrado, então o segmento AB é adjacente à reta principal
                        else if (NoDaRetaPrincipal(SegReta_B_ID) & ! NoDaRetaPrincipal(SegReta_A_ID))
                        {
                            nodeXY = window.W.model.nodes.get(SegReta_A_ID);
                            nodeXYGeo = nodeXY.geometry.clone();
                            RetaAjuste_PontoB = nodeXYGeo.clone();
                            encontrouRetaADJ = true;
                            //console.log("WME-ASSR Reta ADJ com A");
                        }

                    j++;
                    }


                    
                    //Refs. bibliográficas sobre a função de interseção:
                    //1. http://www.inf.pucrs.br/~pinho/CG/Aulas/OpenGL/Interseccao/CalcIntersec.html
                    //2. John Vince, Geometry for Computer Graphics, Springer, 2005
                    //3. http://www.dpi.inpe.br/livros/bdados/cap2.pdf      (Melhor pra entender )

                    if (encontrouRetaADJ == true)
                    {

                    // Apresentando a reta ADJ encontrada para o calculo do ponto de intersecção.
                    console.log("WME-ASSRR: Reta ADJ encontrada:");
                    var S1 = nodeGeo.clone();
                    var S2 = RetaAjuste_PontoB.clone();
                    console.log("WME-ASSRR: Origem: " + S1);
                    console.log("WME-ASSRR: Fim: " + S2);

                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                    //Método de cálculo usando a função GetIntersectLinesInt, que usa as funções gerais das retas.

                    /*var P_intersec = GetIntersectLinesInt(T1.x, T1.y, T2.x , T2.y, S1.x, S1.y, S2.x, S2.y);
                    //nodeGeo2.x = P_intersec[0];
                    nodeGeo2.y = P_intersec[1];*/

                    /////////////////////////////////////////////////////////////////////////////////////////////////////
                    //Médodo de cálculo que usa a interseção de segmentos.

                    //Temos as retas dadas pelos pontos T1 e T2 (reta principal) e  S1  e S2 reta adj).
                    //                                   k    l                      m    n
                    //                                   1     2                     3      4

                    

                    //var determinante = ((S2.x - S1.x) * (T2.y - T1.y)) - (( S2.y - S1.y) * (T2.x - T1.x));
                      var determinante = ((S2.y - S1.y) * (T2.x - T1.x)) - (( S2.x - S1.x) * (T2.y - T1.y));

                    if (determinante == 0) //retas paralelas
                    {
                        console.log("WME-ASSRR: Retas PARALELAS (chamar próximo)");
                        continue; //pegar próxima etapa no lop
                    }
                    else
                    {
                    //console.log("WME-ASSRR: Determinante: " + determinante);

                       // (4x - 3x) ( 1y - 3y) - (4y - 3y) (1x - 3x)
                    var u = (((S2.x - S1.x) * (T1.y - S1.y)) - ((S2.y - S1.y) * (T1.x - S1.x)))/ determinante;

                        // (2x - 1x)(1y - 3y) - (2y - 1y)(1x - 3x)
                    var v = (((T2.x - T1.x) * (T1.y - S1.y)) - ((T2.y - T1.y) * (T1.x - S1.x)))/ determinante;

                    //console.log("WME-ASSRR: u: " + u);
                    //console.log("WME-ASSRR: v: " + v);


                    if (( u >= 0 ) & ( u <= 1 ))
                        {
                            nodeGeo2.x = T1.x + u * (T2.x - T1.x ) ;
                            nodeGeo2.y = T1.y + u * (T2.y - T1.y ) ;
                        } else if (( v >= 0 ) & ( v <= 1 ))
                        {
                            nodeGeo2.x = S1.x + v * (S2.x - S1.x ) ;
                            nodeGeo2.y = S1.y + v * (S2.y - S1.y ) ;
                        } else
                        {
                            nodeGeo2 = S1.clone();
                        }
                    }

                    
                    console.log("WME-ASSRR: Nó atualizado (interseção das retas): " + nodeGeo2);
					//nodeGeo2.calculateBounds();

                     // Ajustando os segmentos adjacentes para o novo ponto do nó (novas coordenadas)


                    var connectedSegObjs = {}; //guardando os segmentos que pertencem ao Nó pra usar no final para mover o nó.
                    var connectedSegObjs_copia = {};
                    var connectedSegObjs_Geom = {};
                    var emptyObj = {};
                    var multiaction = new MultiAction();
                    multiaction.setModel(window.W.model);
                    for (var k = 0; k < node2.attributes.segIDs.length; k++)             
                    {

                        var segid = node2.attributes.segIDs[k];
                        console.log("WME-ASSRR: Segmentos conectados ao Nó atual.  ID " + segid );
                        //connectedSegObjs[segid] = node2.model.segments.get(segid).geometry.clone();
                        //connectedSegObjs_copia[segid] = connectedSegObjs[segid];

                        //  ////segment.model.attributes.toNodeID;

                        connectedSegObjs[segid] = node2.model.segments.get(segid).clone();
                        connectedSegObjs_Geom[segid] = connectedSegObjs[segid].geometry.clone();
                        connectedSegObjs_copia[segid] = connectedSegObjs_Geom[segid];
                        //console.log(" " );

                         //var  nodeA1 = Waze.model.nodes.get(nodeID_A);

                        //console.log("WME-ASSRR: Comp com Original: " + nodeGeo );
                        var conect_no_A = connectedSegObjs[segid].attributes.fromNodeID; //  cpegou o id do nó
                        var connectedSegObjs_A = window.W.model.nodes.get(conect_no_A).geometry.clone(); // pegou o ponto do nó
                        //var connectedSegObjs_A = connectedSegObjs[segid].components[0].clone();
                        console.log("WME-ASSRR: Seg A para ajuste: " + connectedSegObjs_A );

                        var conect_no_B = connectedSegObjs[segid].attributes.toNodeID; //  pegou o id do nó
                        var connectedSegObjs_B = window.W.model.nodes.get(conect_no_B).geometry.clone(); //pegou o ponto do nó..
                        //var connectedSegObjs_B = connectedSegObjs[segid].components[1].clone();
                        console.log("WME-ASSRR: Seg B para ajuste: " + connectedSegObjs_B);

                        //preciso encontrar o component do segmento que guarda o nó FROM
                        var achouiqual_from = -1;
                        var e6 = 0;
                        //console.log("WME-ASSRR: e6 A: "+ e6);
                        //console.log("WME-ASSRR: Tam A vetor: "+ connectedSegObjs_Geom[segid].components.length);
                        while (e6 < connectedSegObjs_Geom[segid].components.length)
                        {
                            //console.log("WME-ASSRR: e6: "+ e6);
                            if((connectedSegObjs_Geom[segid].components[e6].x == connectedSegObjs_A.x) & (connectedSegObjs_Geom[segid].components[e6].y == connectedSegObjs_A.y))
                            {
                                achouiqual_from = e6;
                                //console.log("WME-ASSRR: e6: Encontrou A! ");
                            }
                            e6++;
                        }
                        //preciso encontrar o component do segmento que guarda o nó FROM e o TO
                        var achouiqual_to = -1;
                        e6 = 0;
                        //console.log("WME-ASSRR: e6 B: "+ e6);
                        //console.log("WME-ASSRR: Tam B vetor: "+ connectedSegObjs_Geom[segid].components.length);
                        while (e6 < connectedSegObjs_Geom[segid].components.length)
                        {
                            //console.log("WME-ASSRR: e6: "+ e6);
                            if((connectedSegObjs_Geom[segid].components[e6].x == connectedSegObjs_B.x) & (connectedSegObjs_Geom[segid].components[e6].y == connectedSegObjs_B.y))
                            {
                                achouiqual_to = e6;
                                //console.log("WME-ASSRR: e6: Encontrou B! ");
                            }
                            e6++;
                        }


                        console.log("WME-ASSRR: Nó no A vetor de nós do segmento : " + achouiqual_from);
                        console.log("WME-ASSRR: Nó no B vetor de nós do segmento : " + achouiqual_to);
                        //console.log("WME-ASSRR: Nó connectedSegObjs_A : " + connectedSegObjs_A);
                        //console.log("WME-ASSRR: Nó connectedSegObjs_B : " + connectedSegObjs_B);
                        //console.log("WME-ASSRR: Nó nodeGe: " + nodeGeo);

                        // ajustando


                        if ((nodeGeo.x == connectedSegObjs_A.x) & ( nodeGeo.y == connectedSegObjs_A.y) & (achouiqual_from > -1)) //ajuste manual das retas conectadas.
                        {
                            //console.log("WME-ASSRR: Inicio set FROM. ");
                            connectedSegObjs_Geom[segid].components[achouiqual_from].x = nodeGeo2.x;
					        connectedSegObjs_Geom[segid].components[achouiqual_from].y = nodeGeo2.y;
                            //console.log("WME-ASSRR: Ajustou no FROM. ");
                        }
                        else if ((nodeGeo.x ==connectedSegObjs_B.x) & ( nodeGeo.y == connectedSegObjs_B.y) & (achouiqual_to > -1))
                        {
                            //console.log("WME-ASSRR: Inicio set TO. ");
                            connectedSegObjs_Geom[segid].components[achouiqual_to].x = nodeGeo2.x;
					        connectedSegObjs_Geom[segid].components[achouiqual_to].y = nodeGeo2.y;
                            //console.log("WME-ASSRR: Ajustou no TO. ");

                        }else
                        { //se o nó foi "mexido sem querer" pelas etapas anteriores, teríamos a falta de conexao de um segmento.
                            //Basta pegar o nó do segmento mais próximo ao nó ajustado.
                            console.log("WME-ASSRR: Entrando da identificacao do nó pela Distância Euclidiana.");
                            var deltaseg = GetDeltaDirectPlanarComReferencial(connectedSegObjs_A.x,connectedSegObjs_A.y, connectedSegObjs_B.x, connectedSegObjs_B.y, nodeGeo2.x, nodeGeo2.y);
                            if (deltaseg > 0 )
                            {
                                connectedSegObjs_Geom[segid].components[0].x = nodeGeo2.x;
					            connectedSegObjs_Geom[segid].components[0].y = nodeGeo2.y;
                            }
                            else
                            {
                                connectedSegObjs_Geom[segid].components[1].x = nodeGeo2.x;
					            connectedSegObjs_Geom[segid].components[1].y = nodeGeo2.y;
                            }

                        }
                        console.log("WME-ASSRR: Ajustado A para : " + connectedSegObjs_Geom[segid].components[0]);
                        console.log("WME-ASSRR: Ajustado B para : " + connectedSegObjs_Geom[segid].components[1]);

                        multiaction.doSubAction(new UpdateSegmentGeometry(node2.model.segments.get(segid), connectedSegObjs_copia[segid] , connectedSegObjs_Geom[segid]));
                        //console.log("WME-ASSRR: multiaction update OK. ");
                    }
                    //console.log("flag1");
                    //Waze.model.actionManager.add(new MoveNode(node, node.geometry, nodeGeo2));
                    //Waze.model.actionManager.add(new MoveNode(node, node.geometry, nodeGeo2, connectedSegObjs, emptyObj));
                    nodeGeo2.calculateBounds();
                    //console.log("WME-ASSRR: calculate bounds OK. ");
                    multiaction.doSubAction(new MoveNode(node, node.geometry, nodeGeo2, connectedSegObjs_Geom, emptyObj));
                    //console.log("WME-ASSRR: multiaction move node OK. ");
                    window.W.model.actionManager.add(multiaction);
                    console.log("WME-ASSRR: Final do ajuste do Nó");
                    console.log("=====================================================================================");
                    }
                   

				}
			}
		}
	}

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                                         F U N Ç Õ E S
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //  função que recebe duas retas e devolve o ponto de intersecao.
    //Fonte2: http://www.guj.com.br/t/resolvido-ponto-de-interseccao-entres-duas-retas-de-coeficiente-a1-e-b1-e-a2-e-b2/91148
    //Fonte1: http://mundoeducacao.bol.uol.com.br/matematica/determinando-equacao-geral-reta.htm

    function GetIntersectLines(Ax, Ay, Bx, By, Cx, Cy, Dx, Dy)
    {
        console.log("WME-ASSRR: Entrou na função para calculo da interseção");
        var r = [2];
        r[0] = 0;
        r[1] = 0;
        var reta1_A = Ay - By;
        var reta1_B = Bx - Ax;
        var reta1_C = (Ax * By) - (Bx * Ay);

        var reta2_A = Cy - Dy;
        var reta2_B = Dx - Cx;
        var reta2_C = (Cx * Dy) - (Dx * Cy);
        //equac geral Ax + By + C = 0
        var coefAB = (By-Ay)/(Bx-Bx);
        var coefCD = (Dy-Cy)/(Dx-Cx);

        //forma reduzida
        // Ax + By + C = 0
        // y = (-Ax - C) / B
        // y = -Ax/B -C/B

        var reta1_AR = -reta1_A / reta1_B;
        var reta1_BR = -reta1_C / reta1_B;

        var reta2_AR = -reta2_A / reta2_B;
        var reta2_BR = -reta2_C / reta2_B;

        //a1 * x + b1   = a2 * x + b2
        // a1 x - a2 x = b2 - b1
        // x (a1 - a2) = b2 - b1


        if (coefCD != coefAB) // se não forem paralelas.
        {
            r[0] = (reta2_BR - reta1_BR) / (reta1_AR - reta2_AR);
            console.log("WME-ASSRR: calculado x " + r[0]);
            r[1] = reta1_AR * r[0] + reta1_BR;
            console.log("WME-ASSRR: calculado y " + r[1]);
        }
        return r;

    }


    function GetIntersectLinesInt(Ax, Ay, Bx, By, Cx, Cy, Dx, Dy)
    {
        console.log("WME-ASSRR: Entrou na função para calculo da interseção");
        var r = [2];
        r[0] = 0.0;
        r[1] = 0.0;
        const precisao = 11; //trabalhando com ponto flutuante limitando casas decimais.
        var reta1_A = parseFloat( Ay.toFixed(precisao)) - parseFloat(By.toFixed(precisao)) ;
        var reta1_B = parseFloat(Bx.toFixed( precisao)) - parseFloat(Ax.toFixed(precisao));
        var reta1_C = (parseFloat(Ax.toFixed( precisao)) * parseFloat(By.toFixed(precisao))) - ( parseFloat(Bx.toFixed( precisao)) * parseFloat(Ay.toFixed( precisao)));

        var reta2_A = parseFloat(Cy.toFixed(precisao)) - parseFloat(Dy.toFixed( precisao));
        var reta2_B =parseFloat(Dx.toFixed(precisao)) - parseFloat(Cx.toFixed( precisao));
        var reta2_C = ( parseFloat(Cx.toFixed( precisao)) * parseFloat(Dy.toFixed( precisao))) - (parseFloat(Dx.toFixed( precisao)) * parseFloat(Cy.toFixed( precisao)));
        //equac geral Ax + By + C = 0
        var coefAB = (parseFloat(By.toFixed( precisao))-parseFloat(Ay.toFixed( precisao))) / (parseFloat(Bx.toFixed( precisao))-parseFloat(Bx.toFixed(precisao)));
        var coefCD = (parseFloat(Dy.toFixed( precisao))-parseFloat(Cy.toFixed( precisao))) / (parseFloat(Dx.toFixed( precisao))-parseFloat(Cx.toFixed( precisao)));

        //forma reduzida
        // Ax + By + C = 0
        // y = (-Ax - C) / B
        // y = -Ax/B -C/B

        var reta1_AR = (-reta1_A / reta1_B);
        var reta1_BR = (-reta1_C / reta1_B);

        var reta2_AR = (-reta2_A / reta2_B);
        var reta2_BR = (-reta2_C / reta2_B);

        //a1 * x + b1   = a2 * x + b2
        // a1 x - a2 x = b2 - b1
        // x (a1 - a2) = b2 - b1


        if (coefCD != coefAB) // se não forem paralelas.
        {
            r[0] = (((reta2_BR - reta1_BR) / (reta1_AR - reta2_AR)));
            r[1] = (reta1_AR * r[0] + reta1_BR);
            r[0] = parseFloat(r[0].toFixed(precisao));
            r[1] = parseFloat(r[1].toFixed(precisao));
        }
        return r;

    }


    //mesma funcao de cima, porém sem o controle de casas decimais.
    function GetIntersectCoord(A1, B1, C1, A2, B2, C2, W) {
        //x:=(b1*c2 - b2*c1)/denom;
        //y:=(a2*c1 - a1*c2)/denom;
        var r = [2];
        r[0] = 1;
        r[1] = 1;
        if (W != 0){
            r[0] = (B1 * C2 - B2 * C1)/W;
		    r[1] = (A2 * C1 - A1 * C2)/W;
            }
		return r;
	}

	// define a direção da reta
	function GetDeltaDirect(A, B) {
		var d = 0.0;
		if(A < B)
        {
			d = 1.0;
        }
		else if (A > B)
        {
			d = -1.0;
        }

		return d;
	}

    // define a direcao da reta atraveś da distância euclidiana em relação ao eixo de origem 0.0
    function GetDeltaDirectPlanar(x1,y1, x2, y2) {
		var d = 0.0;
        var lado1 = Math.sqrt((x1 * x1) + (y1 * y1)); //ao quadrado pra remover o sinal
        var lado2 = Math.sqrt((x2 * x2) + (y2 * y2));
        console.log("WME-ASSRR: lado 1: " + lado1 );
        console.log("WME-ASSRR: lado 2: " + lado2 );
		if (lado1 < lado2)
        {
            d = 1.0;
            console.log("WME-ASSRR: lado 1 é menor" );
        }
		else if (lado1 > lado2)
        {
			d = -1.0;
            console.log("WME-ASSRR: lado 2 é menor" );
        }

		return d;
	}

    // define a direcao da reta atraveś da distância euclidiana em relação ao eixo de origem 0.0
    function GetDeltaDirectPlanarComReferencial(x1,y1, x2, y2, ox, oy) {
		var d = 0.0;
        var lado1 = Math.sqrt(Math.pow(x1 - ox,2) + Math.pow(y1 - oy,2)); //ao quadrado pra remover o sinal
        var lado2 = Math.sqrt(Math.pow(x2 - ox,2) + Math.pow(y2 - oy,2));
        console.log("WME-ASSRR: distancia A-O: " + lado1 );
        console.log("WME-ASSRR: distancia B-O: " + lado2 );
		if (lado1 < lado2)
        {
            d = 1.0;
            console.log("WME-ASSRR: lado A-O é menor" );
        }
		else if (lado1 > lado2)
        {
			d = -1.0;
            console.log("WME-ASSRR: lado B-O é menor" );
        }

		return d;
	}

    function NoDaRetaPrincipal(node)
    {
        var r = false;
        for (var e6 = 0; e6 < nodestrabalhados_i; e6++ ) //percorrer toda a seleção
            {
                 console.log("WME-ASSRR:.. Procurando ID na reta principal. Item #"+ (e6) + "" );
                 if (nodestrabalhados[e6] == node)
                 {
                     r = true;
                     console.log("WME-ASSRR:.. Encontrado");
                 }
            }
        if (r == false)
        {
            console.log("WME-ASSRR:.. Não encontrado");
            console.log("WME-ASSRR:.. Não encontrado  Nó: " + node);
            console.log("WME-ASSRR:.. Não encontrado  Em: " + nodestrabalhados);
        }
        return r;
    }

}


