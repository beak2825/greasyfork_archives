// ==UserScript==
// @name         Auto Processador de Marcas e Downloads
// @namespace    Violatera/AutoMarcaDownload
// @version      1.7
// @description  Seleciona datas, ordenação, marcas, pesquisa e baixa imagens automaticamente.
// @author       Você
// @LICENSE      NONE
// @match        https://alvomerchandising.tradepro.com.br/alvomerchandising/relatorio_fotos.jsf*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544405/Auto%20Processador%20de%20Marcas%20e%20Downloads.user.js
// @updateURL https://update.greasyfork.org/scripts/544405/Auto%20Processador%20de%20Marcas%20e%20Downloads.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Função para carregar JSZip
  function carregarJSZip() {
    return new Promise((resolve, reject) => {
      if (typeof JSZip !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
      script.onload = function() {
        console.log('✅ JSZip carregado com sucesso');
        resolve();
      };
      script.onerror = function() {
        console.error('❌ Erro ao carregar JSZip');
        reject(new Error('Falha ao carregar JSZip'));
      };
      document.head.appendChild(script);
    });
  }

  // Carregar JSZip imediatamente
  carregarJSZip().catch(console.error);

  // ==========================
  // CONFIGURAÇÕES
  // ==========================
  const CONFIG = {
    MARGEM_ERRO_IMAGENS: 5,     // Aceitar até 5 imagens a menos
    MAX_TENTATIVAS_SCROLL: 999, // Sem limite prático de tentativas
    MIN_TENTATIVAS_MARGEM: 5    // Reduzido para 5 tentativas antes de aceitar margem de erro
  };

  // ==========================
  // FUNÇÃO PARA ABRIR/FECHAR DROPDOWN
  // ==========================
  function toggleDropdown() {
    const trigger = document.querySelector('.ui-selectcheckboxmenu-trigger');
    if (!trigger) {
      console.error('Trigger não encontrado!');
      return;
    }
    ['mousedown', 'mouseup', 'click'].forEach(type => {
      trigger.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window }));
    });
  }

  // ==========================
  // LISTA DE MARCAS
  // ==========================
  const marcas = [
   /* { nome: "ÁGUA SFERRIÊ", modo: "redeLojaData" },
    { nome: "Alfaparf", modo: "lojaData" },
    { nome: "BOM PRINCIPIO", modo: "redeLojaData" },
    { nome: "SEMALO", modo: "redeLojaData" },
    { nome: "PIRACANJUBA", modo: "redeLojaData" },*/
    { nome: "CAROLINA", modo: "redeLojaData" },
   /* { nome: "PANINE", modo: "lojaData" },
    { nome: "SILVESTRIN", modo: "lojaData" },
    { nome: "JCW", modo: "redeLojaData" },
    { nome: "INGLEZA", modo: "redeLojaData" },
    { nome: "CAFFEINE ARMY", modo: "lojaData" },
    { nome: "UNIBABY", modo: "lojaData" },
    { nome: "PONZAN & KARUI", modo: "lojaData" },
    { nome: "EUROCOMPANY", modo: "lojaData" },*/
]


  // ==========================
  // FUNÇÕES DE DATA E ORDENAÇÃO
  // ==========================
  function formatDate(d) {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}/${d.getFullYear()}`;
  }

  function getPreviousWeekday(day) {
    const d = new Date();
    const currentDay = d.getDay();

    // Calcular quantos dias voltar para chegar ao dia da semana desejado
    let diff;
    if (currentDay >= day) {
      // Se o dia atual é maior ou igual ao dia desejado, voltar na mesma semana
      diff = currentDay - day;
    } else {
      // Se o dia atual é menor, voltar para a semana anterior
      diff = 7 - (day - currentDay);
    }

    // Se diff é 0, significa que hoje já é o dia desejado, então voltar 7 dias
    if (diff === 0) {
      diff = 7;
    }

    console.log(`🔄 getPreviousWeekday: hoje é ${currentDay}, buscando dia ${day}, voltando ${diff} dias`);
    d.setDate(d.getDate() - diff);
    return d;
  }

  function fillDateInputs(str) {
    ['#dataInicial_input', '#dataFinal_input'].forEach(sel => {
      const input = document.querySelector(sel);
      if (input) {
        input.value = str;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }

  function autoFillDates() {
    const now = new Date();
    const w = now.getDay();
    let dateToUse;

    if (w >= 2 && w <= 6) {
      // Se é terça a sábado (incluindo sexta), usar o dia anterior
      dateToUse = new Date(now);
      dateToUse.setDate(dateToUse.getDate() - 1);
    } else if (w === 1) {
      // Se é segunda-feira, usar a sexta-feira anterior
      dateToUse = getPreviousWeekday(5);
    } else {
      // Se é domingo, usar o dia atual
      dateToUse = now;
    }

    console.log(`📅 Data calculada: ${formatDate(dateToUse)} (hoje é ${formatDate(now)}, dia da semana: ${w})`);
    fillDateInputs(formatDate(dateToUse));
  }

  function adjustOrdenacao() {
    const lbl = document.querySelector('#selectOrdenacao_label');
    if (lbl && !lbl.textContent.includes('Loja, Dia, Hora')) {
      document.querySelector('#selectOrdenacao .ui-selectonemenu-trigger')?.click();
      setTimeout(() => {
        Array.from(document.querySelectorAll('#selectOrdenacao_items li'))
          .find(li => li.textContent.trim() === 'Loja, Dia, Hora')
          ?.click();
      }, 300);
    }
  }

  // ==========================
  // FUNÇÃO PARA ROLAR A PÁGINA
  // ==========================
  function scrollToBottom() {
    return new Promise((resolve) => {
      let ultimaAltura = 0;
      let tentativasEstavel = 0;

      const scrollStep = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const clientHeight = document.documentElement.clientHeight;

        // Verificar se a altura da página mudou
        if (scrollHeight === ultimaAltura) {
          tentativasEstavel++;
        } else {
          tentativasEstavel = 0;
          ultimaAltura = scrollHeight;
        }

        // Se chegou ao final OU a página não está mais crescendo
        if (scrollTop + clientHeight >= scrollHeight - 10 || tentativasEstavel >= 3) {
          resolve();
        } else {
          window.scrollBy(0, 500); // Aumentado de 300 para 500
          setTimeout(scrollStep, 50); // Reduzido de 100ms para 50ms
        }
      };
      scrollStep();
    });
  }

  // Função para contar links da Amazon carregados
  function contarLinksAmazon() {
    const links = document.querySelectorAll('a.grupo[href*="amazon"], a.grupo[href*="s3-sa-east-1"]');
    return links.length;
  }

  // Função para rolar até carregar todas as imagens esperadas
  async function scrollAteCarregarTodas(qtdEsperada) {
    console.log(`📊 Esperando carregar ${qtdEsperada} imagens...`);
    const margemErro = CONFIG.MARGEM_ERRO_IMAGENS;
    const qtdMinima = Math.max(0, qtdEsperada - margemErro);

    console.log(`🎯 Meta: ${qtdEsperada} imagens (mínimo aceitável: ${qtdMinima}, margem de erro: ${margemErro})`);

    let qtdAnterior = 0;
    let tentativasSemMudanca = 0;

    while (true) { // Sem limite de tentativas
      await scrollToBottom();
      await new Promise(r => setTimeout(r, 500)); // Reduzido de 2000ms para 500ms

      const qtdCarregada = contarLinksAmazon();
      console.log(`📷 ${qtdCarregada}/${qtdEsperada} imagens carregadas`);

      // Verificar se atingiu a quantidade esperada
      if (qtdCarregada >= qtdEsperada) {
        console.log(`✅ Todas as ${qtdCarregada} imagens foram carregadas!`);
        break;
      }

      // Verificar se a quantidade não mudou (possível fim do carregamento)
      if (qtdCarregada === qtdAnterior) {
        tentativasSemMudanca++;
        console.log(`🔍 Quantidade estável: ${qtdCarregada} imagens (${tentativasSemMudanca}/5 tentativas)`);

        if (tentativasSemMudanca >= 3 && qtdCarregada >= qtdMinima) {
          console.log(`⚠️ Quantidade estável em ${qtdCarregada} imagens por 3 tentativas consecutivas`);
          console.log(`✅ Dentro da margem de erro aceitável. Continuando com ${qtdCarregada} imagens...`);
          break;
        } else if (tentativasSemMudanca >= 5) {
          console.log(`⚠️ Quantidade estável em ${qtdCarregada} imagens por 5 tentativas. Assumindo que todas carregaram.`);
          break;
        }
      } else {
        tentativasSemMudanca = 0; // Reset contador se houve mudança
        console.log(`📈 Progresso: ${qtdAnterior} → ${qtdCarregada} imagens (+${qtdCarregada - qtdAnterior})`);
      }

      qtdAnterior = qtdCarregada;
      console.log(`🔄 Continuando scroll...`);
    }

    const qtdFinal = contarLinksAmazon();
    return qtdFinal;
  }

  // ==========================
  // PROCESSAMENTO DE IMAGENS
  // ==========================
  function extrairRede(n) {
    // Extrair apenas a primeira parte do nome da loja (antes do primeiro " - ")
    const primeiraParte = n.split(' - ')[0];

    // Remover números no final para agrupar lojas da mesma rede
    // Ex: "ATACADAO 831" -> "ATACADAO", "STOK CENTER 31" -> "STOK CENTER"
    const semNumeros = primeiraParte.replace(/\s+\d+$/, '').trim();

    return semNumeros.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
  }

  function limparNomeArquivo(nome) {
    return nome
      .normalize('NFD')                    // Normalizar caracteres acentuados
      .replace(/[̀-ͯ]/g, '')              // Remover acentos
      .replace(/[\\/:*?"<>|]/g, '')       // Remover caracteres inválidos para arquivos
      .replace(/\s+/g, '_')               // Substituir espaços por underscore
      .trim() || 'Marca';                 // Fallback se ficar vazio
  }

  function extrairDataTexto(center) {
    // Procurar por "Tirada em" seguido de data, ignorando "Antes Tirada em"
    const texto = center?.innerText || '';

    // Procurar todas as ocorrências de "Tirada em" com data
    const matches = texto.match(/Tirada em (\d{2}\/\d{2}\/\d{4})/g);
    if (!matches) return 'SemData';

    // Se há múltiplas ocorrências, pegar a que NÃO está precedida por "Antes"
    for (const match of matches) {
      const fullMatch = texto.match(new RegExp(`(\\w+\\s+)?${match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
      if (fullMatch && !fullMatch[1]?.includes('Antes')) {
        const dateMatch = match.match(/(\d{2}\/\d{2}\/\d{4})/);
        return dateMatch ? dateMatch[1] : 'SemData';
      }
    }

    // Se não encontrou nenhuma sem "Antes", pegar a primeira
    const firstMatch = matches[0].match(/(\d{2}\/\d{2}\/\d{4})/);
    return firstMatch ? firstMatch[1] : 'SemData';
  }

  async function processarImagem({ url, texto, index }, pasta, canvas) {
    try {
      const blob = await fetch(url).then(r => r.blob());
      const objURL = URL.createObjectURL(blob);
      const img = await new Promise((res, rej) => {
        const i = new Image(); i.crossOrigin = 'anonymous';
        i.onload = () => res(i);
        i.onerror = rej;
        i.src = objURL;
      });
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const fs = Math.floor(canvas.width * 0.03);
      ctx.font = `${fs}px sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'black';
      ctx.fillStyle = '#FFD700';
      const pad = 20;
      ctx.strokeText(texto, canvas.width - pad, canvas.height - pad);
      ctx.fillText(texto, canvas.width - pad, canvas.height - pad);
      const b64 = canvas.toDataURL('image/jpeg', 0.7).split(',')[1];
      pasta.file(`img_${index+1}.jpg`, b64, { base64: true, compression: 'STORE' });
      URL.revokeObjectURL(objURL);
      return true;
    } catch (e) {
      console.warn(`Erro imagem ${index+1}:`, e);
      return false;
    }
  }

  async function baixarImagensSeparadas(r, l, d, reg, rld, nomeMarca = '') {
    // Verificar se JSZip está disponível (verificação de segurança)
    if (typeof JSZip === 'undefined') {
      console.error('❌ JSZip não está disponível. Tentando carregar...');
      await carregarJSZip();
    }

    const blocos = Array.from(document.querySelectorAll('div.ui-panelgrid-cell'));
    const imgs = blocos.map((bloco, idx) => {
      const link = bloco.querySelector('a.grupo');
      if (!link?.href.match(/amazon|s3-sa-east-1/)) return null;
      const center = bloco.querySelector('center');
      const lines = center?.innerText.split('\n').map(x => x.trim()).filter(Boolean) || [];

      // Extrair o nome da loja (primeira linha que contém " - ", pegando tudo depois do código)
      const lojaLine = lines.find(x => x.includes(' - ')) || '';
      const lojaName = lojaLine.split(' - ').slice(1).join(' - ') || 'Loja';

      // Extrair a cidade (procurar por linha que contém "/" e não contém "Tirada em" ou "Recebida em")
      const cidadeLine = lines.find(x => x.includes('/') && !x.includes('Tirada em') && !x.includes('Recebida em') && !x.includes('Antes')) || '';
      const cidade = cidadeLine.split('/')[0].trim() || '';

      return {
        url: link.href,
        texto: cidade ? `${lojaName} — ${cidade}` : lojaName,
        rede: extrairRede(lojaName), // Usar o nome da loja como base para a rede
        loja: lojaName.replace(/[\\/:*?"<>|]/g, ''),
        data: extrairDataTexto(center),
        index: idx
      };
    }).filter(Boolean);

    const zip = new JSZip();
    const canvas = document.createElement('canvas');
    let totalSucesso = 0;
    let totalErro = 0;

    console.log(`📦 Iniciando processamento de ${imgs.length} imagens...`);
    atualizarStatus(`📦 Processando ${imgs.length} imagens...`);

    const BATCH_SIZE = 50;
    for (let i = 0; i < imgs.length; i += BATCH_SIZE) {
      const batch = imgs.slice(i, i + BATCH_SIZE);

      const mensagemProgresso = `⏳ Processando ${i + 1}-${Math.min(i + BATCH_SIZE, imgs.length)} de ${imgs.length}`;
      console.log(mensagemProgresso);
      atualizarStatus(mensagemProgresso);

      const resultados = await Promise.all(batch.map(img => {
        let p = zip;
        if (reg) p = p.folder(img.rede).folder(img.texto).folder(img.data.replace(/\//g, '-'));
        else if (rld) p = p.folder(img.rede).folder(img.loja).folder(img.data.replace(/\//g, '-'));
        else if (r) { p = p.folder(img.rede); if (l) p = p.folder(img.loja); if (d) p = p.folder(img.data.replace(/\//g, '-')); }
        else if (l) { p = p.folder(img.loja); if (d) p = p.folder(img.data.replace(/\//g, '-')); }
        else p = p.folder(img.data.replace(/\//g, '-'));
        return processarImagem(img, p, canvas);
      }));

      // Contar sucessos e erros
      resultados.forEach(sucesso => sucesso ? totalSucesso++ : totalErro++);
      console.log(`✅ Lote concluído: ${totalSucesso} sucessos, ${totalErro} erros`);
    }

    console.log(`📦 Gerando arquivo ZIP...`);
    atualizarStatus(`📦 Gerando ZIP...`);
    const blob = await zip.generateAsync({ type: 'blob', compression: 'STORE' });

    // Limpar nome da marca para usar no arquivo
    console.log(`🏷️ Nome da marca recebido: "${nomeMarca}"`);
    let marcaLimpa = limparNomeArquivo(nomeMarca);

    // Para Costa Marine, adicionar sufixo indicando múltiplas seleções
    if (nomeMarca === "Costa Marine") {
      marcaLimpa = "Costa_Marine_Completo";
      console.log(`🏷️ Costa Marine: usando nome especial "${marcaLimpa}"`);
    }

    console.log(`🏷️ Nome da marca limpo: "${marcaLimpa}"`);

    const nomeArquivo = `${marcaLimpa}.zip`;
    console.log(`📁 Nome do arquivo ZIP: "${nomeArquivo}"`);

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = nomeArquivo;
    a.click();
    URL.revokeObjectURL(a.href);

    const mensagemFinal = `✅ ${totalSucesso} salvas, ❌ ${totalErro} com erro`;
    console.log(`✅ Download concluído: ${nomeArquivo} - ${totalSucesso} imagens salvas, ${totalErro} com erro`);
    console.log(`📁 ZIP "${nomeArquivo}" foi gerado e baixado com sucesso!`);
    atualizarStatus(mensagemFinal);

    // Voltar ao status normal após 5 segundos
    setTimeout(() => atualizarStatus(), 5000);
  }

  // Função para classificar redes em litoral, normal ou outros
  function classificarRede(nomeRede) {
    const redes = {
      litoral: ['ANDREAZZA', 'ASUN', 'SUPER DA PRAIA'],
      normal: ['ATACADAO', 'BAKLIZI', 'BOA VISTA', 'COMERCIAL ZAFFARI', 'COQUEIROS',
               'COTRIJUI', 'DESCO', 'IMEC', 'FORT', 'STOK CENTER', 'STR',
               'SUPER BENEDETTI', 'UNIDASUL', 'VIA ATACADISTA', 'PASSARELA']
    };

    const nomeNormalizado = nomeRede.toUpperCase().trim();

    if (redes.litoral.some(rede => nomeNormalizado.includes(rede))) {
      return 'LITORAL';
    } else if (redes.normal.some(rede => nomeNormalizado.includes(rede))) {
      return 'NORMAL';
    } else {
      return 'OUTROS';
    }
  }

  async function baixarImagensLitoralNormalOutros(nomeMarca = '') {
    // Verificar se JSZip está disponível (verificação de segurança)
    if (typeof JSZip === 'undefined') {
      console.error('❌ JSZip não está disponível. Tentando carregar...');
      await carregarJSZip();
    }

    const blocos = Array.from(document.querySelectorAll('div.ui-panelgrid-cell'));
    const imgs = blocos.map((bloco, idx) => {
      const link = bloco.querySelector('a.grupo');
      if (!link?.href.match(/amazon|s3-sa-east-1/)) return null;
      const center = bloco.querySelector('center');
      const lines = center?.innerText.split('\n').map(x => x.trim()).filter(Boolean) || [];

      // Extrair o nome da loja (primeira linha que contém " - ", pegando tudo depois do código)
      const lojaLine = lines.find(x => x.includes(' - ')) || '';
      const lojaName = lojaLine.split(' - ').slice(1).join(' - ') || 'Loja';

      // Extrair a cidade (procurar por linha que contém "/" e não contém "Tirada em" ou "Recebida em")
      const cidadeLine = lines.find(x => x.includes('/') && !x.includes('Tirada em') && !x.includes('Recebida em') && !x.includes('Antes')) || '';
      const cidade = cidadeLine.split('/')[0].trim() || '';

      // Classificar a rede
      const categoria = classificarRede(lojaName);

      return {
        url: link.href,
        texto: cidade ? `${lojaName} — ${cidade}` : lojaName,
        rede: extrairRede(lojaName),
        loja: lojaName.replace(/[\\/:*?"<>|]/g, ''),
        data: extrairDataTexto(center),
        categoria: categoria,
        index: idx
      };
    }).filter(Boolean);

    const zip = new JSZip();
    const canvas = document.createElement('canvas');
    let totalSucesso = 0;
    let totalErro = 0;

    console.log(`📦 Iniciando processamento de ${imgs.length} imagens por categoria...`);
    atualizarStatus(`📦 Processando ${imgs.length} imagens por categoria...`);

    const BATCH_SIZE = 50;
    for (let i = 0; i < imgs.length; i += BATCH_SIZE) {
      const batch = imgs.slice(i, i + BATCH_SIZE);

      const mensagemProgresso = `⏳ Processando ${i + 1}-${Math.min(i + BATCH_SIZE, imgs.length)} de ${imgs.length}`;
      console.log(mensagemProgresso);
      atualizarStatus(mensagemProgresso);

      const resultados = await Promise.all(batch.map(img => {
        // Organizar por: categoria/nome/outros
        let p = zip.folder(img.categoria).folder(img.rede).folder(img.data.replace(/\//g, '-'));
        return processarImagem(img, p, canvas);
      }));

      // Contar sucessos e erros
      resultados.forEach(sucesso => sucesso ? totalSucesso++ : totalErro++);
      console.log(`✅ Lote concluído: ${totalSucesso} sucessos, ${totalErro} erros`);
    }

    console.log(`📦 Gerando arquivo ZIP...`);
    atualizarStatus(`📦 Gerando ZIP...`);
    const blob = await zip.generateAsync({ type: 'blob', compression: 'STORE' });

    // Limpar nome da marca para usar no arquivo
    console.log(`🏷️ Nome da marca recebido: "${nomeMarca}"`);
    let marcaLimpa = limparNomeArquivo(nomeMarca);

    // Para o modo litoralNormalOutros, usar apenas o nome da marca
    const nomeArquivo = `${marcaLimpa}.zip`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    console.log(`✅ Download iniciado: ${nomeArquivo}`);
    console.log(`📊 Estatísticas: ${totalSucesso} sucessos, ${totalErro} erros de ${imgs.length} imagens`);
    atualizarStatus(`✅ Download concluído: ${nomeArquivo}`);
  }

  // ==========================
  // CONTROLE DE PROCESSAMENTO
  // ==========================
  function getClicked() {
    return localStorage.getItem('processandoMarca') === 'true';
  }

  function setClicked(value) {
    localStorage.setItem('processandoMarca', value.toString());
    // Salvar timestamp quando inicia processamento
    if (value) {
      localStorage.setItem('timestampProcessamento', Date.now().toString());
    } else {
      localStorage.removeItem('timestampProcessamento');
    }
  }

  // Verificar se o processamento está travado (mais de 5 minutos)
  function verificarTravamento() {
    const timestamp = localStorage.getItem('timestampProcessamento');
    if (!timestamp) return false;

    const tempoDecorrido = Date.now() - parseInt(timestamp);
    const cincoMinutos = 5 * 60 * 1000; // 5 minutos em ms

    return tempoDecorrido > cincoMinutos;
  }

  // Função para resetar o estado em caso de travamento
  function resetarEstado() {
    localStorage.removeItem('processandoMarca');
    localStorage.removeItem('marcaIndex');
    localStorage.removeItem('timestampProcessamento');
    console.log('🔄 Estado resetado. Reinicie a página para começar do zero.');
  }

  // Função para reiniciar desde a primeira marca
  function reiniciarProcessamento() {
    localStorage.removeItem('processandoMarca');
    localStorage.removeItem('timestampProcessamento');
    localStorage.setItem('marcaIndex', '0');
    console.log('🔄 Reiniciando processamento desde a primeira marca...');
    location.reload();
  }

  // Função para criar botão de controle na interface
  function criarBotaoControle() {
    // Verificar se o botão já existe
    if (document.getElementById('botaoReiniciarMarcas')) return;

    // Criar container do botão
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.8);
      padding: 10px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    `;

    // Criar botão de reiniciar
    const botaoReiniciar = document.createElement('button');
    botaoReiniciar.id = 'botaoReiniciarMarcas';
    botaoReiniciar.innerHTML = '🔄 Reiniciar Marcas';
    botaoReiniciar.style.cssText = `
      background: #ff6b6b;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
      margin-right: 5px;
    `;
    botaoReiniciar.onclick = () => {
      if (confirm('Tem certeza que deseja reiniciar o processamento desde a primeira marca?')) {
        reiniciarProcessamento();
      }
    };

    // Criar botão de reset
    const botaoReset = document.createElement('button');
    botaoReset.innerHTML = '🛑 Reset Estado';
    botaoReset.style.cssText = `
      background: #ffa500;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
      margin-right: 5px;
    `;
    botaoReset.onclick = () => {
      if (confirm('Tem certeza que deseja resetar o estado? Isso vai parar o processamento atual.')) {
        resetarEstado();
      }
    };

    // Criar botão de força liberação (emergência)
    const botaoForca = document.createElement('button');
    botaoForca.innerHTML = '⚡ Forçar';
    botaoForca.style.cssText = `
      background: #dc3545;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
    `;
    botaoForca.onclick = () => {
      console.log('⚡ Forçando liberação do estado...');
      setClicked(false);
      location.reload();
    };

    // Criar indicador de status
    const statusIndicator = document.createElement('div');
    statusIndicator.id = 'statusProcessamento';
    statusIndicator.style.cssText = `
      color: white;
      font-size: 11px;
      margin-top: 5px;
      text-align: center;
    `;

    // Adicionar elementos ao container
    container.appendChild(botaoReiniciar);
    container.appendChild(botaoReset);
    container.appendChild(botaoForca);
    container.appendChild(statusIndicator);

    // Adicionar à página
    document.body.appendChild(container);

    // Atualizar status periodicamente
    setInterval(atualizarStatus, 1000);
  }

  // Função para atualizar o status no botão
  function atualizarStatus(mensagemCustom = null) {
    const statusDiv = document.getElementById('statusProcessamento');
    if (!statusDiv) return;

    if (mensagemCustom) {
      statusDiv.innerHTML = mensagemCustom;
      statusDiv.style.color = '#2196F3'; // Azul para mensagens de progresso
      return;
    }

    const processando = getClicked();
    const marcaAtual = parseInt(localStorage.getItem('marcaIndex') || '0', 10);
    const totalMarcas = marcas.length;

    if (processando) {
      if (verificarTravamento()) {
        statusDiv.innerHTML = `🚨 TRAVADO na marca ${marcaAtual}/${totalMarcas}`;
        statusDiv.style.color = '#FF5722';
      } else {
        statusDiv.innerHTML = `🔄 Processando marca ${marcaAtual}/${totalMarcas}`;
        statusDiv.style.color = '#4CAF50';
      }
    } else {
      statusDiv.innerHTML = `⏸️ Parado na marca ${marcaAtual}/${totalMarcas}`;
      statusDiv.style.color = '#FFC107';
    }
  }

  // Função para ajustar configurações
  function ajustarConfig(margemErro, maxTentativas, minTentativas) {
    if (margemErro !== undefined) CONFIG.MARGEM_ERRO_IMAGENS = margemErro;
    if (maxTentativas !== undefined) CONFIG.MAX_TENTATIVAS_SCROLL = maxTentativas;
    if (minTentativas !== undefined) CONFIG.MIN_TENTATIVAS_MARGEM = minTentativas;

    console.log('⚙️ Configurações atualizadas:', CONFIG);
  }

  // Disponibilizar funções globalmente para debug
  window.resetarEstado = resetarEstado;
  window.reiniciarProcessamento = reiniciarProcessamento;
  window.ajustarConfig = ajustarConfig;
  window.atualizarStatus = atualizarStatus;
  window.CONFIG = CONFIG;

  // ==========================
  // LOOP DE MARCAS
  // ==========================
  async function processarMarca(idx) {
    if (idx >= marcas.length) {
      console.log('✅ Todas processadas');
      localStorage.removeItem('marcaIndex');
      setClicked(false);
      return;
    }

    const { nome, modo } = marcas[idx];
    console.log(`🔄 Processando marca ${idx + 1}/${marcas.length}: "${nome}" (modo: ${modo})`);
    console.log(`🏷️ Nome da marca que será usado no ZIP: "${nome}"`);
    console.log(`📍 Índice atual: ${idx}, Marca: ${nome}`);

    // Verificar se já está processando (pesquisa já foi feita)
    if (getClicked()) {
      // Verificar se está travado há muito tempo
      if (verificarTravamento()) {
        console.warn('🚨 Processamento travado detectado! Liberando automaticamente...');
        setClicked(false);
        // Reiniciar o processamento completo
        setTimeout(() => processarMarca(idx), 1000);
        return;
      } else {
        console.log(`🔄 Retomando processamento de "${nome}" - pulando para verificação de registros...`);
        // Garantir que o índice está correto (manter o mesmo índice)
        localStorage.setItem('marcaIndex', idx.toString());
        // Pular direto para a verificação de registros e scroll
      }
    } else {
      // Primeira vez processando esta marca - fazer setup completo
      setClicked(true);
      console.log(`➡️ Processando marca: ${nome}`);
      // Salvar índice atual (não o próximo ainda)
      localStorage.setItem('marcaIndex', idx.toString());

      autoFillDates();
      adjustOrdenacao();
      await new Promise(r => setTimeout(r, 1000));

      // abrir dropdown
      toggleDropdown();
      await new Promise(r => setTimeout(r, 500));

      // limpar seleção atual
      document.querySelectorAll('#multSelectFamiliaCliente\\:multiSelectFamilia_panel .ui-chkbox-box.ui-state-active')
        .forEach(box => box.click());

      // selecionar marca(s) - Costa Marine seleciona múltiplas opções
      // Delay extra para garantir que o dropdown esteja totalmente carregado
      await new Promise(r => setTimeout(r, 500));

      const painel = document.getElementById('multSelectFamiliaCliente:multiSelectFamilia_panel');
      const itemsLi = Array.from(painel.querySelectorAll('li'));

      if (nome === "Costa Marine") {
        // Para Costa Marine, selecionar ambas as opções
        const opcoesCosta = ["COSTA MARINE", "COSTA MARINE_SULPESCA"];
        let selecionadas = 0;

        console.log(`🔍 Procurando opções de Costa Marine no dropdown...`);
        console.log(`📋 Total de itens no dropdown: ${itemsLi.length}`);

        // Debug: listar todas as opções disponíveis
        console.log(`📋 Opções disponíveis no dropdown:`);
        itemsLi.forEach((li, index) => {
          const texto = li.textContent.trim();
          if (texto.toLowerCase().includes('costa')) {
            console.log(`  ${index}: "${texto}" (contém 'costa')`);
          }
        });

        for (const opcao of opcoesCosta) {
          console.log(`🔍 Procurando por: "${opcao}"`);
          const alvo = itemsLi.find(li => li.textContent.trim() === opcao);
          if (alvo) {
            const checkbox = alvo.querySelector('.ui-chkbox-box');
            if (checkbox) {
              checkbox.click();
              console.log(`✅ Selecionado: ${opcao}`);
              selecionadas++;
            } else {
              console.warn(`⚠️ Checkbox não encontrado para "${opcao}"`);
            }
            // Pequeno delay entre seleções
            await new Promise(r => setTimeout(r, 200));
          } else {
            console.warn(`⚠️ Opção "${opcao}" não encontrada no dropdown`);
          }
        }

        if (selecionadas === 0) {
          console.warn(`❌ Nenhuma opção de Costa Marine encontrada com nomes exatos`);
          console.log(`🔄 Tentando busca alternativa por texto que contenha 'COSTA'...`);

          // Busca alternativa: qualquer item que contenha "COSTA"
          const itensComCosta = itemsLi.filter(li =>
            li.textContent.toUpperCase().includes('COSTA')
          );

          console.log(`🔍 Encontrados ${itensComCosta.length} itens com 'COSTA':`);
          itensComCosta.forEach((item, index) => {
            const texto = item.textContent.trim();
            console.log(`  ${index + 1}: "${texto}"`);

            const checkbox = item.querySelector('.ui-chkbox-box');
            if (checkbox) {
              checkbox.click();
              console.log(`✅ Selecionado (busca alternativa): ${texto}`);
              selecionadas++;
            }
          });

          if (selecionadas > 0) {
            console.log(`✅ Costa Marine (busca alternativa): ${selecionadas} opções selecionadas`);
          } else {
            console.error(`❌ Nenhuma opção com 'COSTA' encontrada no dropdown`);
          }
        } else {
          console.log(`✅ Costa Marine: ${selecionadas} opções selecionadas`);
        }
      } else if (nome === "Ofertão") {
        // Para Ofertão, selecionar as 6 marcas específicas
        const opcoesOfertao = [
          "BETTANIN_OFERTAO",
          "CARGIL_OFERTAO",
          "KIMBERLY CLARK_OFERTAO",
          "NIVEA_OFERTAO",
          "RECKITT BENCKISER_OFERTAO",
          "SUZANO"
        ];
        let selecionadas = 0;

        console.log(`🔍 Procurando opções do Ofertão no dropdown...`);
        console.log(`📋 Total de itens no dropdown: ${itemsLi.length}`);

        // Debug: listar todas as opções disponíveis que contenham "OFERTAO" ou "SUZANO"
        console.log(`📋 Opções disponíveis relacionadas ao Ofertão (excluindo L'OREAL_OFERTAO):`);
        itemsLi.forEach((li, index) => {
          const texto = li.textContent.trim();
          if ((texto.toUpperCase().includes('OFERTAO') || texto.toUpperCase().includes('SUZANO')) && !texto.toUpperCase().includes("L'OREAL_OFERTAO")) {
            console.log(`  ${index}: "${texto}"`);
          }
        });

        for (const opcao of opcoesOfertao) {
          console.log(`🔍 Procurando por: "${opcao}"`);
          const alvo = itemsLi.find(li => li.textContent.trim() === opcao);
          if (alvo) {
            const checkbox = alvo.querySelector('.ui-chkbox-box');
            if (checkbox) {
              checkbox.click();
              console.log(`✅ Selecionado: ${opcao}`);
              selecionadas++;
            } else {
              console.warn(`⚠️ Checkbox não encontrado para "${opcao}"`);
            }
            // Pequeno delay entre seleções
            await new Promise(r => setTimeout(r, 200));
          } else {
            console.warn(`⚠️ Opção "${opcao}" não encontrada no dropdown`);
          }
        }

        if (selecionadas === 0) {
          console.warn(`❌ Nenhuma opção do Ofertão encontrada com nomes exatos`);
          console.log(`🔄 Tentando busca alternativa por texto que contenha 'OFERTAO' ou 'SUZANO'...`);

          // Busca alternativa: qualquer item que contenha "OFERTAO" ou "SUZANO", exceto "L'OREAL_OFERTAO"
          const itensOfertao = itemsLi.filter(li => {
            const texto = li.textContent.toUpperCase();
            return (texto.includes('OFERTAO') || texto.includes('SUZANO')) && !texto.includes("L'OREAL_OFERTAO");
          });

          console.log(`🔍 Encontrados ${itensOfertao.length} itens relacionados ao Ofertão:`);
          itensOfertao.forEach((item, index) => {
            const texto = item.textContent.trim();
            console.log(`  ${index + 1}: "${texto}"`);

            const checkbox = item.querySelector('.ui-chkbox-box');
            if (checkbox) {
              checkbox.click();
              console.log(`✅ Selecionado (busca alternativa): ${texto}`);
              selecionadas++;
            }
          });

          if (selecionadas > 0) {
            console.log(`✅ Ofertão (busca alternativa): ${selecionadas} opções selecionadas`);
          } else {
            console.error(`❌ Nenhuma opção relacionada ao Ofertão encontrada no dropdown`);
          }
        } else {
          console.log(`✅ Ofertão: ${selecionadas} opções selecionadas`);
        }
      } else {
        // Para outras marcas, seleção normal (case-insensitive)
        const alvo = itemsLi.find(li => li.textContent.toLowerCase().includes(nome.toLowerCase()));
        if (alvo) {
          // delay extra para garantir painel carregado
          await new Promise(r => setTimeout(r, 300));
          const checkbox = alvo.querySelector('.ui-chkbox-box');
          checkbox?.click();
          console.log(`✅ Selecionado: ${nome}`);
        } else {
          console.warn(`Marca "${nome}" não encontrada no dropdown.`);
        }
      }

      // fechar dropdown
      toggleDropdown();
      await new Promise(r => setTimeout(r, 300));

      // pesquisar
      console.log(`🔍 Iniciando pesquisa para "${nome}"...`);
      document.querySelector('#botaoAcaoBancoPesquisar')?.click();
      await new Promise(r => setTimeout(r, 5000));
    }

    try {

    // verificar se há registros - tentar múltiplas vezes se necessário
    let qtdRegistros = 0;
    let tentativas = 0;
    const maxTentativas = 5;

    while (tentativas < maxTentativas && qtdRegistros === 0) {
      const span = Array.from(document.querySelectorAll('span.titulo'))
        .find(s => s.innerText.includes('Registros encontrados'));

      if (span) {
        // Extrair apenas os números do texto
        const textoCompleto = span.innerText;
        const numerosEncontrados = textoCompleto.match(/\d+/g);
        qtdRegistros = numerosEncontrados ? parseInt(numerosEncontrados[0]) : 0;
        console.log(`📊 Texto encontrado: "${textoCompleto}" -> ${qtdRegistros} registros`);
        break;
      }

      // Se não encontrou, aguardar um pouco e tentar novamente
      tentativas++;
      console.log(`Tentativa ${tentativas} de encontrar registros para "${nome}"...`);
      await new Promise(r => setTimeout(r, 1000));
    }

    if (qtdRegistros > 0) {
      // Rolar até carregar todas as imagens esperadas
      const qtdCarregada = await scrollAteCarregarTodas(qtdRegistros);

      // Verificar quantas imagens realmente foram carregadas
      if (qtdCarregada === 0) {
        console.warn(`⚠️ Nenhuma imagem foi carregada para "${nome}". Pulando...`);
        // Salvar próximo índice antes de pular
        localStorage.setItem('marcaIndex', (idx + 1).toString());
        // Liberar o controle e continuar para próxima marca
        setClicked(false);
        setTimeout(() => processarMarca(idx + 1), 2000);
        return;
      }

      console.log(`📷 ${qtdCarregada} imagens carregadas de ${qtdRegistros} registros para "${nome}". Baixando...`);
    } else {
      console.warn(`⚠️ Nenhum registro encontrado para "${nome}". Pulando...`);
      // Salvar próximo índice antes de pular
      localStorage.setItem('marcaIndex', (idx + 1).toString());
      // Liberar o controle e continuar para próxima marca
      setClicked(false);
      setTimeout(() => processarMarca(idx + 1), 2000);
      return;
    }

    if (qtdRegistros > 0) {

      try {
        switch (modo) {
          case 'lojaData':
            await baixarImagensSeparadas(false, true, true, false, false, nome);
            break;
          case 'redeLojaData':
            await baixarImagensSeparadas(true, true, true, false, true, nome);
            break;
          case 'regiao':
            await baixarImagensSeparadas(false, true, true, true, false, nome);
            break;
          case 'litoralNormalOutros':
            await baixarImagensLitoralNormalOutros(nome);
            break;
          default:
            await baixarImagensSeparadas(false, true, true, false, false, nome);
        }

        console.log(`✅ Download concluído para "${nome}"`);
        // Aguardar um pouco mais após o download antes de continuar
        await new Promise(r => setTimeout(r, 3000));

        // AGORA SIM salvar o próximo índice (só depois do download completo)
        localStorage.setItem('marcaIndex', (idx + 1).toString());
        console.log(`📝 Salvando progresso: próxima marca será ${idx + 1}`);

      } catch (error) {
        console.error(`❌ Erro ao baixar imagens para "${nome}":`, error);
      }
    }

    // Voltar ao topo da página antes de processar a próxima marca
    window.scrollTo(0, 0);

    // Liberar o controle para permitir próxima pesquisa
    setClicked(false);
    console.log(`✅ Processamento de "${nome}" finalizado. Liberando para próxima marca...`);

    // Continuar para a próxima marca
    setTimeout(() => processarMarca(idx + 1), 2000);

    } catch (error) {
      console.error(`❌ Erro crítico ao processar marca "${nome}":`, error);
      // Salvar próximo índice mesmo em caso de erro
      localStorage.setItem('marcaIndex', (idx + 1).toString());
      // Liberar o controle mesmo em caso de erro
      setClicked(false);
      // Tentar continuar para a próxima marca após erro
      setTimeout(() => processarMarca(idx + 1), 5000);
    }
  }

  window.addEventListener('load', async () => {
    if (location.href.includes('relatorio_fotos')) {
      // Criar botão de controle na interface
      setTimeout(criarBotaoControle, 1000);

      // Aguardar JSZip carregar antes de iniciar
      try {
        await carregarJSZip();
        console.log('📦 JSZip pronto para uso');
      } catch (error) {
        console.error('❌ Falha ao carregar JSZip:', error);
        return;
      }

      // Verificar se há processamento em andamento
      const jaProcessando = getClicked();
      const start = parseInt(localStorage.getItem('marcaIndex') || '0', 10);

      // Verificar se está travado antes de iniciar
      if (jaProcessando && verificarTravamento()) {
        console.warn('🚨 Processamento travado detectado na inicialização! Liberando...');
        setClicked(false);
      }

      if (getClicked()) {
        console.log(`🔄 Retomando processamento da marca ${start} (${marcas[start]?.nome})...`);
      } else {
        console.log(`🚀 Iniciando processamento a partir da marca ${start} (${marcas[start]?.nome})...`);
      }

      processarMarca(start);
    }
  });
})();
