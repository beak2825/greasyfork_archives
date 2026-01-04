// ==UserScript==
// @name         Postador + autofill
// @namespace    https://a1th.dev/a1descr
// @version      1.07
// @description  Dados automaticos para filmes, series e jogos.
// @author       a1Th
// @include      https://usinavirtual.com/postador*/*
// @icon         https://www.a1th.dev/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458011/Postador%20%2B%20autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/458011/Postador%20%2B%20autofill.meta.js
// ==/UserScript==

const apiUrl = 'https://www.a1th.dev/a1descr/api'

const urlCategoria = window.location.search

let categoria = null

if (urlCategoria.includes('filme') || urlCategoria.includes('xxx')) {
  categoria = 'filme'
} else if (urlCategoria.includes('seriado') || urlCategoria.includes('desenho')) {
  categoria = 'serie'
} else if (urlCategoria.includes('jogo')) {
  categoria = 'jogo'
}

if (!document.querySelector("#categoria > dl.c-flutuante > dt")) document.querySelector("dl.c-flutuante")?.before(divScript())

const [inputScript, btnPreencher, divRes] = [document.querySelector("#inputScript"), document.querySelector("#btnPreencher"), document.querySelector("#divRes")]

function divScript() {

  const placeholder = {
    filme: 'IMDB OU TMDB ID',
    serie: 'TMDB ID',
    jogo: 'STEAM ID'
  }

  const divScript = document.createElement('div')

  divScript.setAttribute('id', 'divScript')

  divScript.innerHTML = `<div style='display:flex;height:48px;max-width:40%;align-items:center;'>
                            <label for='inputID' style='font-weight:bold;'>ID<span style='color:red;'>*</span>:</label>
                            <input name='inputID' placeholder="${placeholder[categoria]}" id='inputScript' style='font-size:16px;'>
                            <input type='button' id='btnPreencher' value='Preencher' style='text-align:center; font-size:16px'>
                          </div>
                          <div id="divRes" style='display:block;'></div>

                      `
  return divScript

}

function divResRefresh(dados, img, title) {

  divRes.innerHTML = ''

  if (!dados) {
    divRes.innerHTML = `<img src="https://i.imgur.com/0FFbrAs.png" alt="${'Erro'}"230" height="110">
      <p>Erro: ID não encontrado</p>`
    return
  } else {
    divRes.innerHTML = `<img src="${img}" alt="${title}"230" height="110">
      <p>${title}</p>
      <a href='https://www.a1th.dev/a1descr/${categoria}/${inputScript.value}' target='_blank'>
        <p>BBcode Completo</p>
      </a>`
  }

}

async function apiFetch(id) {

  const res = await fetch(`${apiUrl}/${categoria}/${inputScript.value}`)

  try {
    const json = await res.json()
    return json
  } catch (error) {
    return null
  }

}

async function procurar(titulo) {

  const formatarStrings = (str) => {

    return str
      .replaceAll('.', ' ')
      .replaceAll(',', ' ')
      .replaceAll('_', ' ')
      .replaceAll('-', ' ')
      .replaceAll('+', ' ')
      .replaceAll(`'`, ' ')
      .replace(/^\[.+?\]\s?/i, '')
      .replaceAll('[', ' ').replaceAll(']', ' ')
      .replaceAll('(', ' ').replaceAll(')', ' ')
      .replaceAll(/\s{1,}/g, ' ')

  }

  const strTitulo = formatarStrings(titulo).toLowerCase()

  const resultados = async () => {
    if (categoria === 'filme' && strTitulo.match(/(.+)(\s\d{4}(?=\s))/)) {

      const url_pesquisa = `${apiUrl}/busca/${strTitulo.match(/(.+)(\s\d{4}(?=\s))/)[1]}`
      const req = await fetch(url_pesquisa)
      return await req.json()

    } else if (categoria === 'serie' && strTitulo.match(/(.+)(?=\s[es]\d{1,2})/gi)) {

      const url_pesquisa = `${apiUrl}/busca/${strTitulo.match(/(.+)(?=\s[es]\d{1,2})/gi)}`
      const req = await fetch(url_pesquisa)
      return await req.json()

    } else return

  }

  const res = await resultados()

  if (!res) return

  for (let a = 0; a < res.length; a++) {

    const strTituloOriginal = res[a]?.titulo_original?.replaceAll("'", '').replaceAll(':', '').toLowerCase().replaceAll('.', '').replaceAll(',', '')
    const strTituloNacional = res[a]?.titulo_nacional?.replaceAll("'", '').replaceAll(':', '').toLowerCase().replaceAll('.', '').replaceAll(',', '')


    if (
      strTitulo.match(/\d{4}/) == res[a]?.lancamento?.dataAno && res[a].categoria == 'filme' ||
      strTituloOriginal == strTitulo.match(/(.+)(?=\s[es]\d{1,2})/gi) && res[a].categoria == 'tv' ||
      strTituloNacional == strTitulo.match(/(.+)(?=\s[es]\d{1,2})/gi) && res[a].categoria == 'tv'
    ) {

      let tituloResultado = document.createElement('div')

      tituloResultado.setAttribute('style', 'display: grid; grid-template-columns: 1fr max-content; gap:8px ; width: max-content; margin-bottom:8px;padding-bottom:4px;border-bottom: 1px solid black;')
      tituloResultado.innerHTML = ''
      tituloResultado.innerHTML = `<span style="color:black;font-weight:bold;"> ${res[a]?.titulo_original} ${res[a]?.lancamento?.dataAno}</span>
      <input type='button' value='Sim' style="grid-column-end: none;"
      onmousedown="document.querySelector('#inputScript').value = ${res[a]?.tmdb_id}" 
      onmouseup="document.querySelector('#divRes').innerHTML = ''; document.querySelector('#btnPreencher').click()">`

      document.querySelector('#divRes').appendChild(tituloResultado)
    }

  }
}

async function preencherVideo(nome, nomeOriginal, ano, duracaoF, capa, classificacao, imdbURL, youtube, sinopse, elenco, outrasInformacoes, premios) {

  const dados = await apiFetch()

  divResRefresh(dados, dados?.poster, dados?.titulo_original)

  if (!dados) return

  const { tmdb_id, imdb_id, tmdb_url, imdb_url, poster, titulo_original, titulo_nacional, descricao, genero, duracao, atores, trailer, lancamento, avaliacao,
    diretor, escritor, premio, site, pais_de_origem, status, data_primeiro_episodio,
    data_ultimo_episodio, numero_de_episodios, numero_de_temporadas, criada_por } = dados

  const avaliacoes = {

    imdb: () => {
      if (!avaliacao.imdb) {
        return null
      }

      if (avaliacao.imdb >= 7) {
        return `[color=Lime]${avaliacao.imdb}[/color]/10`
      } else if (avaliacao.imdb < 7 && avaliacao.imdb > 5) {
        return `[color=Yellow]${avaliacao.imdb}[/color]/10`
      } else if (avaliacao.imdb < 6 && avaliacao.imdb > 4) {
        return `[color=Orange]${avaliacao.imdb}[/color]/10`
      } else {
        return `[color=Red]${avaliacao.imdb}[/color]/10`
      }

    },

    tmdb: () => {
      if (avaliacao.tmdb === 0) {
        return null
      }

      if (avaliacao.tmdb >= 7) {
        return `[color=Lime]${avaliacao.tmdb.toFixed(1)}[/color]/10`
      } else if (avaliacao.tmdb < 7 && avaliacao.tmdb > 5) {
        return `[color=Yellow]${avaliacao.tmdb.toFixed(1)}[/color]/10`
      } else if (avaliacao.tmdb < 6 && avaliacao.tmdb > 4) {
        return `[color=Orange]${avaliacao.tmdb.toFixed(1)}[/color]/10`
      } else {
        return `[color=Red]${avaliacao.tmdb.toFixed(1)}[/color]/10`
      }

    },

    MC: () => {
      if (!avaliacao.metaCritic) {
        return null
      }

      if (avaliacao.metaCritic >= 70) {
        return `[color=Lime]${avaliacao.metaCritic}[/color]/100`
      } else if (avaliacao.metaCritic < 70 && avaliacao.metaCritic > 50) {
        return `[color=Yellow]${avaliacao.metaCritic}[/color]/100`
      } else if (avaliacao.metaCritic < 60 && avaliacao.metaCritic > 40) {
        return `[color=Orange]${avaliacao.metaCritic}[/color]/100`
      } else {
        return `[color=Red]${avaliacao.metaCritic}[/color]/100`
      }

    },

    RT: () => {
      if (!avaliacao.rottenTomatoes) {
        return null
      }

      if (avaliacao.rottenTomatoes >= 70) {
        return `[color=Lime]${avaliacao.rottenTomatoes}[/color]%`
      } else if (avaliacao.rottenTomatoes < 70 && avaliacao.rottenTomatoes > 50) {
        return `[color=Yellow]${avaliacao.rottenTomatoes}[/color]%`
      } else if (avaliacao.rottenTomatoes < 60 && avaliacao.rottenTomatoes > 40) {
        return `[color=Orange]${avaliacao.rottenTomatoes}[/color]%`
      } else {
        return `[color=Red]${avaliacao.rottenTomatoes}[/color]%`
      }

    }

  }

  const ator = (max = 6) => {

    if (!atores)
      return null

    let arrayAtores = []

    for (let i = 0; i < 10; i++) {//ARRAY COM FOTO

      const url = `https://www.themoviedb.org/person/${atores[i]?.id}?language=pt-BR`
      const image = `https://image.tmdb.org/t/p/w185${atores[i]?.profile_path}`

      if (atores[i]?.profile_path) {
        arrayAtores.push({ url, image })
      }
    }

    arrayAtores = arrayAtores.slice(0, max)//QUANTIDADE


    let arrayAtoresStr = arrayAtores.map(ator => `[url=${ator.url}][img]${ator.image}[/img][/url]`)

    arrayAtoresStr = `${arrayAtoresStr}`.replaceAll(',', '')

    return arrayAtoresStr

  }

  nomeOriginal && (nomeOriginal.value = titulo_original ?? '')
  ano && (ano.value = lancamento.dataAno ?? '')
  duracaoF.value = duracao ?? ''
  !poster.includes('null') ? capa.value = poster : capa.value = ''
  imdbURL && (!imdb_url.includes('null') ? imdbURL.value = imdb_url ?? '' : '')
  youtube && (youtube.value = trailer ?? '')
  sinopse.value = descricao ?? ''
  elenco && (elenco.value = ator() ?? '')
  outrasInformacoes && (outrasInformacoes.value = `${genero ? `[b]Genero:[/b] ${genero}\n` : ''}
${tmdb_url ? `[b]TMDB: [/b]${tmdb_url}\n` : ''}
${data_primeiro_episodio ? `[b]Lançamento: [/b]${data_primeiro_episodio?.dataCompleta}\n` : ''}
${site ? `[b]Site Oficial: [/b]${site}\n` : ''}
${avaliacoes.imdb() ? `[b]Avaliação IMDB: ${avaliacoes.imdb()}\n` : ''}
Avaliação TMDB: ${avaliacoes.tmdb()}
${avaliacoes.MC() ? `\nMetaScore: ${avaliacoes.MC()}\n` : ''}
${avaliacoes.RT() ? `\nRotten Tomatoes: ${avaliacoes.RT()}[/b]\n` : ''}`
    .replace(/\n{2,}/gm, '\n\n'))
  premios && (premios.value = premio ?? '')

}

function preencherVideoSelect(nome, idioma, videoCodec, audioCodec, qualidade, FormatoTela, temporada, episodio) {

  const inputValue = nome.value.toLowerCase()

  if (categoria === 'serie') {

    const seasonRegex = /[s](\d{2})/gi

    const episodeRegex = /[e](\d{2})/gi

    const season = seasonRegex.exec(inputValue)

    const episode = episodeRegex.exec(inputValue)

    season && (temporada.value = season[1])

    episode && (episodio.value = episode[1])

  }

  const idiomaF = () => {

    if (inputValue.includes('dual')) {
      idioma.value = 'Dual Áudio'
    } else if (inputValue.includes('dublado')) {
      idioma.value = 'Dublado'
    } else return

  }

  const CodecVideoF = () => {

    const h264 = ['h264', 'avc', 'h 264', 'h.264']
    const h265 = ['h265', 'hevc', 'h 265', 'h.265']
    const x264 = ['x264', 'x 264', 'x.264']
    const x265 = ['x265', 'x 265', 'x.265']

    if (h264.some(h264 => inputValue.includes(h264))) {
      videoCodec.value = 'H.264/AVC'
    } else if (h265.some(h265 => inputValue.includes(h265))) {
      videoCodec.value = 'H.265'
    } else if (x264.some(x264 => inputValue.includes(x264))) {
      videoCodec.value = 'Outro'
    } else if (x265.some(x265 => inputValue.includes(x265))) {
      videoCodec.value = 'Outro'
    } else if (inputValue.includes('divx')) {
      videoCodec.value = 'DivX'
    } else if (inputValue.includes('xvid')) {
      videoCodec.value = 'XviD'
    } else return


  }

  const codecAudioF = () => {

    const flac = ['flac']
    const dtsHD = ['dtshd', 'dts hd', 'dts-hd']
    const atmos = ['atmos', 'truehd', 'true-hd']
    const ac3 = ['ac3', 'ddp', 'dd 5 1']

    if (flac.some(flac => inputValue.includes(flac))) {
      audioCodec.value = 'FLAC'
    } else if (dtsHD.some(dtsHD => inputValue.includes(dtsHD))) {
      audioCodec.value = 'DTS-HD'
    } else if (inputValue.includes('dts')) {
      audioCodec.value = 'DTS'
    } else if (inputValue.includes('aac')) {
      audioCodec.value = 'AAC'
    } else if (inputValue.includes('mp3')) {
      audioCodec.value = 'MP3'
    } else if (atmos.some(atmos => inputValue.includes(atmos))) {
      audioCodec.value = 'Outro'
    } else if (ac3.some(ac3 => inputValue.includes(ac3))) {
      audioCodec.value = 'AC3'
    } else return

  }

  const formatoF = () => {

    const remux = ['remux', 'remux-', '-remux']
    const webdl = ['webdl', 'web-dl', 'web dl', 'web.dl']
    const webrip = ['webrip', 'web-rip', 'web rip', 'web.rip']

    if (remux.some(remux => inputValue.includes(remux))) {
      qualidade.value = 'Remux'
    } else if (webdl.some(webdl => inputValue.includes(webdl))) {
      qualidade.value = 'WEB-DL'
    } else if (webrip.some(webrip => inputValue.includes(webrip))) {
      qualidade.value = 'WEBRip'
    } else return
  }

  const resulocaoF = () => {

    const hd = ['720', '720p']
    const fullhd = ['1080', '1080p', 'fullhd']
    const uhd = ['2160', '2160p', 'uhd', '4k']

    if (hd.some(hd => inputValue.includes(hd))) {
      FormatoTela.value = '720p'
    } else if (fullhd.some(fullhd => inputValue.includes(fullhd))) {
      FormatoTela.value = '1080p'
    } else if (uhd.some(uhd => inputValue.includes(uhd))) {
      FormatoTela.value = 'Ultra HD'
    } else return

  }

  idiomaF()
  CodecVideoF()
  codecAudioF()
  formatoF()
  resulocaoF()
}

async function preencherJogo(nome, fabricante, idioma, capa, screenshot1, screenshot2, genero, youtube, descricao, configuracoes, outrasInformacoes) {

  const dados = await apiFetch()

  divResRefresh(dados, dados?.poster, dados?.titulo)

  if (!dados) return

  const { id_steam, pagina_steam, titulo, lancamento, descricao: { descricao_curta }, idiomas, requisitos: { windows: { minimo, recomendado } }, desenvolvedor,
    distribuidora, site, generos, categorias, metacritic, poster, header,
    background, screenshots, videos } = dados

  const selectIdioma = () => {
    if (idiomas.includes('Português') & idiomas.includes('Inglês')) {
      return 'Inglês e Português'
    } else if (!idiomas.includes('Português') & idiomas.includes('Inglês')) {
      return 'Inglês'
    } else if (idiomas.includes('Português')) {
      return 'Português'
    } else { return 'Outros' }
  }

  nome.value = titulo
  fabricante.value = desenvolvedor
  idioma.value = selectIdioma()
  capa.value = poster
  screenshot1.value = screenshots[0].path_full
  screenshot2.value = screenshots[1].path_full
  //GENERO
  videos && (youtube.value = videos[0].mp4.max)
  descricao.value = descricao_curta
  configuracoes && (configuracoes.value = `${minimo}\n
${recomendado}`.replace('Mínimos:', '[b]Mínimos:[/b]').replace('Recomendados', '[b]Recomendados[/b]'))

  outrasInformacoes.value = `[b]Pagina da Steam: [/b]${pagina_steam}\n
[b]Lançamento: [/b]${lancamento}\n
${site ? `[b]Site Oficial: [/b]${site}\n` : ''}
${metacritic?.score ? `[b]Metacritic: [/b]${metacritic?.score}/100\n` : ``}
[b]Idiomas: [/b]${idiomas}\n
[b]Gênero(s): [/b]${generos}\n
[b]Categoria(s): [/b]${categorias}\n`
    .replace(/\n{2,}/gm, '\n\n')
}

(async function () {

  'use strict';

  document.querySelector("#conteudo").style.height = '100%'

  const catVideo = ['filme', 'seriado', 'desenho', 'xxx']

  if (catVideo.some(catVideo => urlCategoria.includes(catVideo))) {

    const [nome, nomeOriginal, ano, duracaoF, capa, classificacao, imdbURL, youtube, sinopse, elenco, outrasInformacoes, premios] = [

      document.querySelector("#nome"),
      document.querySelector("#original"),
      document.querySelector("#ano"),
      document.querySelector("#duracao"),
      document.querySelector("#poster"),
      document.querySelector("#classificacao"),
      document.querySelector("#IMDB"),
      document.querySelector("#media"),

      document.querySelector("#descricao"),
      document.querySelector("#elenco"),
      document.querySelector("#outras_info"),
      document.querySelector("#premiacoes")
    ]

    nome?.addEventListener('change', () => {
      if (inputScript.value !== '') return
      procurar(nome.value)

    })



    nome?.addEventListener('input', () => {

      const [idioma, videoCodec, audioCodec, qualidade, FormatoTela, temporada, episodio] = [

        document.querySelector("#idioma_audio"),
        document.querySelector("#video_codec"),
        document.querySelector("#audio_codec"),
        document.querySelector("#qualidade"),
        document.querySelector("#formato_tela"),
        document.querySelector("#temporada"),
        document.querySelector("#episodio")

      ]

      preencherVideoSelect(nome, idioma, videoCodec, audioCodec, qualidade, FormatoTela, temporada, episodio)
    })

    btnPreencher?.addEventListener('click', async () => {
      await preencherVideo(nome, nomeOriginal, ano, duracaoF, capa, classificacao, imdbURL, youtube, sinopse, elenco, outrasInformacoes, premios)
    })

  } else if (urlCategoria.includes('jogo')) {

    const [nome, fabricante, idioma, capa, screenshot1, screenshot2, genero, youtube, descricao, configuracoes, outrasInformacoes] = [
      document.querySelector("#nome"),
      document.querySelector("#fabricante"),
      document.querySelector("#idioma"),
      document.querySelector("#poster"),
      document.querySelector("#screen1"),
      document.querySelector("#screen2"),
      document.querySelector("#genero"),
      document.querySelector("#media"),
      document.querySelector("#descricao"),
      document.querySelector("#config_m"),
      document.querySelector("#outras_info")

    ]


    btnPreencher?.addEventListener('click', async () => {
      await preencherJogo(nome, fabricante, idioma, capa, screenshot1, screenshot2, genero, youtube, descricao, configuracoes, outrasInformacoes)
    })

  } else return

})();
